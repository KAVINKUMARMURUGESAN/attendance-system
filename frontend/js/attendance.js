window.onload = loadAttendance;

// ===============================
// Load All Attendance Records
// ===============================
function loadAttendance() {
    fetch("http://localhost:8080/api/attendance")
        .then(res => res.json())
        .then(data => {
            const table = document.getElementById("attendanceTable");
            table.innerHTML = "";

            data.forEach(a => {
                table.innerHTML += `
                <tr>
                    <td class="p-2 border">${a.studentId}</td>
                    <td class="p-2 border">${a.date}</td>
                    <td class="p-2 border">${a.entryTime || "-"}</td>
                    <td class="p-2 border">${a.exitTime || "-"}</td>
                    <td class="p-2 border">${a.durationMinutes || "-"}</td>
                    <td class="p-2 border font-bold">${a.status || "-"}</td>
                    <td class="p-2 border space-x-2">
                        <button onclick="editAttendance(${a.id}, '${a.entryTime}', '${a.exitTime}')"
                            class="bg-yellow-500 text-white px-2 py-1 rounded">
                            Edit
                        </button>
                        <button onclick="deleteAttendance(${a.id})"
                            class="bg-red-600 text-white px-2 py-1 rounded">
                            Delete
                        </button>
                    </td>
                </tr>
                `;
            });
        })
        .catch(err => console.error("Error loading attendance:", err));
}

// ===============================
// Delete Attendance Record
// ===============================
function deleteAttendance(id) {
    if (!confirm("Delete this attendance record?")) return;

    fetch(`http://localhost:8080/api/attendance/${id}`, {
        method: "DELETE"
    })
    .then(() => loadAttendance())
    .catch(() => alert("Error deleting record"));
}

// ===============================
// Edit Entry & Exit Time
// ===============================
function editAttendance(id, entryTime, exitTime) {

    const newEntry = prompt(
        "Enter Entry Time (YYYY-MM-DDTHH:MM:SS)",
        entryTime || ""
    );

    const newExit = prompt(
        "Enter Exit Time (YYYY-MM-DDTHH:MM:SS)",
        exitTime || ""
    );

    if (!newEntry || !newExit) {
        alert("Both times are required");
        return;
    }

    fetch(`http://localhost:8080/api/attendance/${id}/time`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            entryTime: newEntry,
            exitTime: newExit
        })
    })
    .then(res => res.json())
    .then(() => {
        alert("Attendance updated successfully");
        loadAttendance();
    })
    .catch(() => alert("Error updating attendance"));
}
