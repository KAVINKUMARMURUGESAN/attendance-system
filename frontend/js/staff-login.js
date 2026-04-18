function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:8080/api/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
    })
    .then(staff => {
        localStorage.setItem("staff", JSON.stringify(staff));
        window.location.href = "dashboard.html";
    })
    .catch(() => alert("Invalid username or password"));
}
