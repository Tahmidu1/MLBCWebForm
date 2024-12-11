document.addEventListener("DOMContentLoaded", () => {
    const formSteps = Array.from(document.querySelectorAll(".form-step"));
    const nextBtns = document.querySelectorAll(".next-btn");
    const prevBtns = document.querySelectorAll(".prev-btn");
    const progressSteps = Array.from(document.querySelectorAll(".progress-step"));
    const documentSection = document.getElementById("documentSection");
    const clientTypeSelect = document.getElementById("clientType");

    let currentStep = 0;

    // Predefined document requirements (dynamic population based on client type)
    const clientDocuments = {
        Individual: ["Passport", "Bank Statement"],
        Company: ["Company Registration", "Financial Report"],
        Trust: ["Trust Deed", "Beneficiary List"]
    };

    // Function to update form steps and progress bar
    function updateFormSteps() {
        formSteps.forEach((step, index) => {
            step.classList.toggle("form-step-active", index === currentStep);
        });

        progressSteps.forEach((step, index) => {
            if (index <= currentStep) {
                step.classList.add("progress-step-active");
            } else {
                step.classList.remove("progress-step-active");
            }
        });
    }

    // Populate document fields dynamically based on client type
    function populateDocumentFields(clientType) {
        documentSection.innerHTML = ""; // Clear existing fields
        if (clientDocuments[clientType]) {
            clientDocuments[clientType].forEach((doc) => {
                const inputGroup = document.createElement("div");
                inputGroup.classList.add("input-group");
                inputGroup.innerHTML = `
                    <label for="${doc.toLowerCase().replace(/\s+/g, "-")}">${doc}</label>
                    <input type="file" id="${doc.toLowerCase().replace(/\s+/g, "-")}" name="${doc.toLowerCase().replace(/\s+/g, "-")}" required>
                `;
                documentSection.appendChild(inputGroup);
            });
        }
    }

    // Handle Next Button Click
    nextBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (currentStep < formSteps.length - 1) {
                if (currentStep === 0) {
                    const clientType = clientTypeSelect.value;
                    populateDocumentFields(clientType);
                }
                currentStep++;
                updateFormSteps();
            }
        });
    });

    // Handle Back Button Click
    prevBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (currentStep > 0) {
                currentStep--;
                updateFormSteps();
            }
        });
    });

    // Initialize form steps and progress bar
    updateFormSteps();
});
