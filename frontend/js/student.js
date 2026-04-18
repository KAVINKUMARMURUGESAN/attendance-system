// For now we simulate logged-in student = 1
const studentId = 1;

window.onload = () => {
    fetch(`http://localhost:8080/api/attendance/student/${studentId}`)
        .then(res => res.json())
        .then(data => {
            const table = document.getElementById("studentAttendance");
            table.innerHTML = "";

            data.forEach(a => {
                table.innerHTML += `
                    <tr>
                        <td class="p-2 border">${a.date}</td>
                        <td class="p-2 border">${a.entryTime || "-"}</td>
                        <td class="p-2 border">${a.exitTime || "-"}</td>
                        <td class="p-2 border">${a.durationMinutes || "-"}</td>
                        <td class="p-2 border font-bold">${a.status || "-"}</td>
                    </tr>
                `;
            });
        });
};
