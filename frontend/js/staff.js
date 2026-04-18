window.onload = loadStudents;

function loadStudents() {
    fetch("http://localhost:8080/api/students")
        .then(res => res.json())
        .then(data => {
            const table = document.getElementById("staffStudentTable");
            table.innerHTML = "";

            data.forEach(s => {
                table.innerHTML += `
                    <tr>
                        <td class="p-2 border">${s.id}</td>
                        <td class="p-2 border">${s.name}</td>
                        <td class="p-2 border">${s.regNo}</td>
                    </tr>
                `;
            });
        });
}

function updateAttendance() {
    const studentId = document.getElementById("studentId").value;
    const status = document.getElementById("status").value;

    fetch("http://localhost:8080/api/attendance/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, status })
    })
    .then(() => alert("Attendance updated"))
    .catch(() => alert("Error updating attendance"));
}
