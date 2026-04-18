function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    let url = "";
    let body = {};

    if (role === "Admin") {
        url = "http://localhost:8080/api/admin/login";
        body = { username, password };
    } 
    else if (role === "Staff") {
        url = "http://localhost:8080/api/staff/login";
        body = { username, password };
    } 
    else if (role === "Student") {
        url = "http://localhost:8080/api/students/login";
        body = { regNo: username, password: password };
    }

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })
    .then(res => {
        if (!res.ok) throw new Error("Invalid credentials");
        return res.json();
    })
    .then(user => {
        localStorage.setItem(role.toLowerCase(), JSON.stringify(user));

        if (role === "Admin") window.location.href = "admin/dashboard.html";
        if (role === "Staff") window.location.href = "staff/dashboard.html";
        if (role === "Student") window.location.href = "student/dashboard.html";
    })
    .catch(err => alert(err.message));
}
