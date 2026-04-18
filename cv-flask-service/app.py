import ssl
ssl._create_default_https_context = ssl._create_unverified_context

from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import base64
import os
import cv2
import threading
import time
import requests
import numpy as np

from mtcnn import MTCNN
from keras_facenet import FaceNet

app = Flask(__name__)
CORS(app)

SAVE_FOLDER = "faces"
os.makedirs(SAVE_FOLDER, exist_ok=True)

# =========================
# SETTINGS
# =========================
MIN_REQUIRED_TIME = 60
EXIT_TIMEOUT = 20

# =========================
# AI MODELS
# =========================
detector = MTCNN()
embedder = FaceNet()

known_embeddings = {}
attendance_data = {}
completed_students = set()

camera_running = False


# =========================
# SEND EVENT TO SPRINGBOOT
# =========================
def send_event(student_id, event_type):

    try:
        requests.post(
            "http://localhost:8080/api/attendance/event",
            json={
                "studentId": student_id,
                "eventType": event_type
            }
        )

        print(f"Sent {event_type} for student {student_id}")

    except Exception as e:
        print("Error sending event:", e)


# =========================
# TRAIN FACE MODEL
# =========================
def train_model():

    global known_embeddings
    known_embeddings = {}

    for file in os.listdir(SAVE_FOLDER):

        if file.endswith(".png"):

            try:
                student_id = int(file.split("_")[1].split(".")[0])
            except:
                continue

            img_path = os.path.join(SAVE_FOLDER, file)
            image = cv2.imread(img_path)

            if image is None:
                continue

            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            faces = detector.detect_faces(image_rgb)

            if len(faces) > 0:

                x, y, w, h = faces[0]["box"]
                x, y = max(0, x), max(0, y)

                face = image_rgb[y:y+h, x:x+w]

                try:
                    face = cv2.resize(face, (160, 160))
                except:
                    continue

                embedding = embedder.embeddings([face])[0]

                known_embeddings[student_id] = embedding

    print("Model Loaded Successfully")


# =========================
# HOME
# =========================
@app.route("/")
def home():
    return "AI Attendance Service Running"


# =========================
# ENROLL FACE
# =========================
@app.route("/enroll", methods=["POST"])
def enroll_face():

    data = request.json
    student_id = data.get("studentId")
    image_data = data.get("image")

    if not student_id or not image_data:
        return jsonify({"error": "Missing data"}), 400

    image_data = image_data.split(",")[1]
    image_bytes = base64.b64decode(image_data)

    filename = f"{SAVE_FOLDER}/student_{student_id}.png"

    with open(filename, "wb") as f:
        f.write(image_bytes)

    train_model()

    return jsonify({
        "status": "Face saved",
        "studentId": student_id
    })


# =========================
# CAMERA LOOP
# =========================
def camera_loop():

    global camera_running

    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

    print("Camera started...")

    while camera_running:

        ret, frame = cap.read()

        if not ret:
            break

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        faces = detector.detect_faces(rgb)

        detected_ids = []

        for face in faces:

            x, y, w, h = face["box"]
            x, y = max(0, x), max(0, y)

            face_img = rgb[y:y+h, x:x+w]

            try:
                face_img = cv2.resize(face_img, (160, 160))
            except:
                continue

            embedding = embedder.embeddings([face_img])[0]

            min_dist = 0.9
            student_id = None

            for sid, known_embedding in known_embeddings.items():

                dist = np.linalg.norm(embedding - known_embedding)

                if dist < min_dist:
                    min_dist = dist
                    student_id = sid

            if student_id is None:
                continue

            if student_id in completed_students:
                continue

            detected_ids.append(student_id)

            cv2.rectangle(frame,(x,y),(x+w,y+h),(0,255,0),2)
            cv2.putText(frame,f"Student {student_id}",(x,y-10),
                        cv2.FONT_HERSHEY_SIMPLEX,0.9,(0,255,0),2)

            now = time.time()

            if student_id not in attendance_data:

                attendance_data[student_id] = {
                    "entry": now,
                    "last_seen": now,
                    "total": 0,
                    "present_marked": False
                }

                send_event(student_id, "ENTRY")

            else:
                attendance_data[student_id]["last_seen"] = now


        # =========================
        # UPDATE ATTENDANCE
        # =========================
        for sid in list(attendance_data.keys()):

            now = time.time()
            last_seen = attendance_data[sid]["last_seen"]

            if sid in detected_ids:
                attendance_data[sid]["total"] += 1

            # MARK PRESENT
            if (
                attendance_data[sid]["total"] >= MIN_REQUIRED_TIME
                and not attendance_data[sid]["present_marked"]
            ):

                print(f"Student {sid} marked PRESENT")

                attendance_data[sid]["present_marked"] = True

                send_event(sid, "PRESENT")

                send_event(sid, "EXIT")

                print(f"Attendance completed for student {sid}")

                completed_students.add(sid)

                del attendance_data[sid]

                continue

            # EXIT WHEN FACE DISAPPEARS
            if now - last_seen > EXIT_TIMEOUT:

                send_event(sid, "EXIT")

                print(f"Student {sid} EXITED")

                del attendance_data[sid]

        time.sleep(1)

    # CAMERA STOP CLEANUP
    for sid in list(attendance_data.keys()):

        send_event(sid, "EXIT")

        print(f"Student {sid} EXITED (camera stopped)")

    attendance_data.clear()

    cap.release()

    print("Camera stopped")


# =========================
# VIDEO STREAM
# =========================
def generate_frames():

    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

    while True:

        success, frame = cap.read()

        if not success:
            break

        ret, buffer = cv2.imencode('.jpg', frame)

        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n'
               + frame + b'\r\n')


@app.route('/video-feed')
def video_feed():

    return Response(
        generate_frames(),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )


# =========================
# CAMERA CONTROLS
# =========================
@app.route("/start-camera")
def start_camera():

    global camera_running

    if not camera_running:

        camera_running = True

        threading.Thread(target=camera_loop).start()

        return "Camera started"

    return "Camera already running"


@app.route("/stop-camera")
def stop_camera():

    global camera_running

    camera_running = False

    return "Camera stopped"


# =========================
# MAIN
# =========================
if __name__ == "__main__":

    train_model()

    app.run(port=5000, debug=True)