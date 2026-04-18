# 📘 Classroom Attendance System Using Face Recognition

## 🎓 Project Overview

The **Classroom Attendance System** is developed to automate the process of attendance marking using face recognition technology.
Traditional attendance methods are time-consuming and prone to errors; this system aims to provide a reliable, efficient, and contactless solution.

This project integrates **web technologies, backend services, and computer vision techniques** to deliver a complete attendance management solution.

---

## 🎯 Objectives

* To automate attendance marking using face recognition
* To reduce manual errors in attendance tracking
* To provide real-time attendance data
* To integrate multiple technologies into a unified system

---

## 🧩 System Architecture

The system follows a **multi-tier architecture**:

1. **Frontend Layer**

   * Developed using HTML, CSS, and JavaScript
   * Provides user interface for interaction

2. **Backend Layer (Spring Boot)**

   * Handles business logic and API requests
   * Stores and manages attendance data

3. **Face Recognition Service (Flask)**

   * Uses OpenCV for face detection and recognition
   * Processes images and returns results to backend

---

## 🏗️ Project Structure

```
classroom-attendance-system/
│
├── frontend/                 # User Interface
├── backend-springboot/      # Java Spring Boot Backend
├── cv-flask-service/        # Python Flask Service (Face Recognition)
```

---

## ⚙️ Technologies Used

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Spring Boot (Java)
* **Microservice:** Flask (Python)
* **Computer Vision:** OpenCV
* **Database:** (PostgreSQL)

---

## 🔄 Working Principle

1. User accesses the system through the frontend interface
2. Image/video input is captured
3. Flask service processes the image using OpenCV
4. Recognized face data is sent to Spring Boot backend
5. Backend updates attendance records in the database
6. Results are displayed on the frontend

---

## ▶️ Execution Steps

### Step 1: Run Backend (Spring Boot)

```
cd backend-springboot
mvn spring-boot:run
```

### Step 2: Run Flask Service

```
cd cv-flask-service
pip install -r requirements.txt
python app.py
```

### Step 3: Run Frontend

* Open `frontend/index.html` in a browser

---

## 📊 Expected Output

* Accurate face detection and recognition
* Automated attendance marking
* Real-time display of attendance data

---

## ⚠️ Limitations

* Performance depends on lighting conditions
* Requires proper camera setup
* Accuracy may vary with dataset quality

---

## 🔮 Future Enhancements

* Integration with cloud services
* Mobile application support
* Advanced AI-based recognition models
* Role-based authentication system

---

## 👨‍💻 Developed By

**Kavinkumar Murugesan**
B.E Computer Science and Engineering

---

## 📌 Conclusion

This project demonstrates the practical implementation of **face recognition technology integrated with web applications** to solve real-world problems like attendance management efficiently.

---
