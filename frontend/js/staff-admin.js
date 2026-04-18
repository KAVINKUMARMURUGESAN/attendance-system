window.onload = loadStaff;

function loadStaff() {
    fetch("http://localhost:8080/api/staff")
        .then(res => res.json())
        .then(data => {
            const table = document.getElementById("staffTable");
            table.innerHTML = "";

            data.forEach(s => {
                table.innerHTML += `
                    <tr>
                        <td class="p-2 border">${s.id}</td>
                        <td class="p-2 border">${s.name}</td>
                        <td class="p-2 border">${s.username}</td>
                        <td class="p-2 border">
                            <button onclick="deleteStaff(${s.id})"
                                class="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                        </td>
                    </tr>
                `;
            });
        });
}

function addStaff() {
    const name = document.getElementById("name").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:8080/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password })
    })
    .then(() => {
        alert("Staff added");
        loadStaff();
    })
    .catch(() => alert("Error adding staff"));
}

function deleteStaff(id) {
    if (!confirm("Delete this staff member?")) return;

    fetch(`http://localhost:8080/api/staff/${id}`, {
        method: "DELETE"
    })
    .then(() => loadStaff())
    .catch(() => alert("Error deleting staff"));
}
