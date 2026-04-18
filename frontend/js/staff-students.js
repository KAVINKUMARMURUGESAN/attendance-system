window.onload = loadStudents;

function loadStudents() {
    const staff = JSON.parse(localStorage.getItem("staff"));

    if (!staff) {
        window.location.href = "login.html";
        return;
    }

    fetch(`http://localhost:8080/api/students/staff/${staff.id}`)
        .then(res => res.json())
        .then(data => {
            const table = document.getElementById("studentTable");
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
