window.onload = () => {
    loadStudents();
    loadStaffOptions();
};

function loadStudents() {
    fetch("http://localhost:8080/api/students")
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
                        <td class="p-2 border">${s.staff ? s.staff.name : "-"}</td>
                        <td class="p-2 border">
                            <button onclick="deleteStudent(${s.id})"
                                class="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                        </td>
                    </tr>
                `;
            });
        });
}

function loadStaffOptions() {
    fetch("http://localhost:8080/api/staff")
        .then(res => res.json())
        .then(data => {
            const select = document.getElementById("staffSelect");
            select.innerHTML = "<option value=''>Select Staff</option>";

            data.forEach(s => {
                select.innerHTML += `<option value="${s.id}">${s.name}</option>`;
            });
        });
}

function addStudent() {
    const name = document.getElementById("name").value;
    const regNo = document.getElementById("regNo").value;
    const password = document.getElementById("password").value;
    const staffId = document.getElementById("staffSelect").value;

    if (!staffId) {
        alert("Please select staff");
        return;
    }

    fetch("http://localhost:8080/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name,
            regNo,
            password,
            staff: { id: staffId }
        })
    })
    .then(() => {
        alert("Student added");
        loadStudents();
    });
}

function deleteStudent(id) {
    if (!confirm("Delete this student?")) return;

    fetch(`http://localhost:8080/api/students/${id}`, { method: "DELETE" })
        .then(() => loadStudents());
}
