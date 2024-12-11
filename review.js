document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

    const name = params.get("fullName") || "N/A";
    const email = params.get("email") || "N/A";
    const phone = params.get("phone") || "N/A";
    const clientType = params.get("clientType") || "N/A";

    document.getElementById("submittedName").textContent = name;
    document.getElementById("submittedEmail").textContent = email;
    document.getElementById("submittedPhone").textContent = phone;
    document.getElementById("submittedClientType").textContent = clientType;
});
