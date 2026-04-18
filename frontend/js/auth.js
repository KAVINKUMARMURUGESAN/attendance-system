function login() {
    const role = document.getElementById("role").value;

    if (role === "admin") {
        window.location.href = "admin/dashboard.html";
    } else if (role === "staff") {
        window.location.href = "staff/dashboard.html";
    } else {
        window.location.href = "student/dashboard.html";
    }
}
