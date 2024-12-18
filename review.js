document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const submissionId = params.get("submissionId");

    // Fetch submission data from backend
    async function fetchSubmission() {
        try {
            const response = await fetch("http://localhost:3000/submissions");
            if (response.ok) {
                const submissions = await response.json();
                const submission = submissions.find((sub, index) => index === parseInt(submissionId, 10));

                if (submission) {
                    document.getElementById("fullName").textContent = submission.fullName || "N/A";
                    document.getElementById("email").textContent = submission.email || "N/A";
                    document.getElementById("phone").textContent = submission.phone || "N/A";
                    document.getElementById("clientType").textContent = submission.clientType || "N/A";

                    const documentList = document.getElementById("documentList");
                    submission.documents.forEach((doc) => {
                        const listItem = document.createElement("li");
                        listItem.innerHTML = `<a href="${doc.path}" target="_blank">${doc.filename}</a>`;
                        documentList.appendChild(listItem);
                    });
                } else {
                    alert("Submission not found!");
                }
            } else {
                alert("Failed to fetch submissions!");
            }
        } catch (error) {
            console.error("Error fetching submissions:", error);
        }
    }

    fetchSubmission();
});
