window.onload = loadAttendance;

function loadAttendance() {
    const student = JSON.parse(localStorage.getItem("student"));

    document.getElementById("welcome").innerText = "Welcome, " + student.name;

    fetch("http://localhost:8080/api/attendance")
        .then(res => res.json())
        .then(data => {
            const table = document.getElementById("attendanceTable");
            table.innerHTML = "";

            data
                .filter(a => a.studentId === student.id)
                .forEach(a => {
                    table.innerHTML += `
                        <tr>
                            <td class="p-2 border">${a.date}</td>
                            <td class="p-2 border">${a.entryTime || "-"}</td>
                            <td class="p-2 border">${a.exitTime || "-"}</td>
                            <td class="p-2 border">${a.durationMinutes || 0}</td>
                            <td class="p-2 border">${a.status || "-"}</td>
                        </tr>
                    `;
                });
        });
}
