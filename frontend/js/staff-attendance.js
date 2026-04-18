window.onload = loadAttendance;

function loadAttendance() {
    const staff = JSON.parse(localStorage.getItem("staff"));

    fetch(`http://localhost:8080/api/attendance/staff/${staff.id}`)
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
                        <td class="p-2 border">${a.durationMinutes || 0}</td>
                        <td class="p-2 border">${a.status || "-"}</td>
                        <td class="p-2 border">
                            <button onclick="markManual(${a.studentId}, 'FULL')" class="bg-green-600 text-white px-2 py-1 rounded">Present</button>
                            <button onclick="markManual(${a.studentId}, 'ABSENT')" class="bg-red-600 text-white px-2 py-1 rounded">Absent</button>
                            <button onclick="editTime(${a.id})" class="bg-blue-600 text-white px-2 py-1 rounded">Edit Time</button>
                        </td>
                    </tr>
                `;
            });
        });
}

function markManual(studentId, status) {
    fetch("http://localhost:8080/api/attendance/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, status })
    }).then(() => loadAttendance());
}

function editTime(id) {
    const entry = prompt("Enter Entry Time (YYYY-MM-DDTHH:MM)");
    const exit = prompt("Enter Exit Time (YYYY-MM-DDTHH:MM)");

    fetch(`http://localhost:8080/api/attendance/${id}/time`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryTime: entry, exitTime: exit })
    }).then(() => loadAttendance());
}
