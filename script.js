document.addEventListener("DOMContentLoaded", () => {
    const formSteps = Array.from(document.querySelectorAll(".form-step"));
    const nextBtns = document.querySelectorAll(".next-btn");
    const prevBtns = document.querySelectorAll(".prev-btn");
    const progressSteps = document.querySelectorAll(".progress-step");
    const multiStepForm = document.getElementById("multiStepForm");
    const documentSection = document.getElementById("documentSection");
    const clientTypeSelect = document.getElementById("clientType");

    let currentStep = 0;

    // Fetch documents from server
    async function fetchDocuments(clientType) {
        try {
            const response = await fetch("http://localhost:3000/documents");
            if (response.ok) {
                const documents = await response.json();
                return documents[clientType] || [];
            } else {
                console.error("Failed to fetch documents.");
                return [];
            }
        } catch (error) {
            console.error("Error fetching documents:", error);
            return [];
        }
    }

    // Populate document fields dynamically
    async function populateDocumentFields(clientType) {
        documentSection.innerHTML = "Loading required documents...";
        const requiredDocuments = await fetchDocuments(clientType);
        documentSection.innerHTML = "";

        requiredDocuments.forEach((doc) => {
            const inputGroup = document.createElement("div");
            inputGroup.classList.add("input-group");
            inputGroup.innerHTML = `
                <label for="${doc.toLowerCase().replace(/\s+/g, "-")}" data-i18n="${doc}">${doc}</label>
                <input type="file" id="${doc.toLowerCase().replace(/\s+/g, "-")}" name="documents" accept=".pdf,.jpg,.jpeg,.png">
            `;
            documentSection.appendChild(inputGroup);
        });
    }

    // Update progress bar dynamically
    function updateProgressBar() {
        progressSteps.forEach((step, index) => {
            if (index <= currentStep) {
                step.classList.add("progress-step-active");
            } else {
                step.classList.remove("progress-step-active");
            }
        });
    }

    // Update form steps dynamically
    function updateFormSteps() {
        formSteps.forEach((step, index) => {
            step.classList.toggle("form-step-active", index === currentStep);
        });
    }

    // Populate review details
    function populateReviewDetails() {
        const formData = new FormData(multiStepForm);
        const formObject = Object.fromEntries(formData.entries());

        document.getElementById("reviewDetails").innerHTML = `
            <p><strong>Full Name:</strong> ${formObject.fullName || "N/A"}</p>
            <p><strong>Email:</strong> ${formObject.email || "N/A"}</p>
            <p><strong>Phone:</strong> ${formObject.phone || "N/A"}</p>
            <p><strong>Client Type:</strong> ${formObject.clientType || "N/A"}</p>
        `;
    }

    // Handle Next Button click
    nextBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (currentStep < formSteps.length - 1) {
                if (currentStep === 0) {
                    populateDocumentFields(clientTypeSelect.value);
                } else if (currentStep === 1) {
                    populateReviewDetails();
                }
                currentStep++;
                updateProgressBar();
                updateFormSteps();
            }
        });
    });

    // Handle Previous Button click
    prevBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (currentStep > 0) {
                currentStep--;
                updateProgressBar();
                updateFormSteps();
            }
        });
    });

    // Handle Form Submission
    multiStepForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(multiStepForm);

        try {
            const response = await fetch("http://localhost:3000/submit-form", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                const submission = await response.json();
                window.location.href = `review.html?submissionId=${submission.id}`;
            } else {
                alert("Failed to submit the form.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    });

    // Initialize i18next for language switching
    i18next.init({
        lng: 'en',
        debug: true,
        resources: {
            en: {
                translation: {
                    "welcomeMessage": "Welcome to the Multi-Step Form",
                    "fullNameLabel": "Full Name",
                    "emailLabel": "Email",
                    "phoneLabel": "Phone Number",
                    "clientTypeLabel": "Client Type",
                    "uploadDocuments": "Upload Documents",
                    "nextButton": "Next",
                    "backButton": "Back",
                    "submitButton": "Submit"
                }
            },
            es: {
                translation: {
                    "welcomeMessage": "Bienvenido al formulario de varios pasos",
                    "fullNameLabel": "Nombre completo",
                    "emailLabel": "Correo electrónico",
                    "phoneLabel": "Número de teléfono",
                    "clientTypeLabel": "Tipo de cliente",
                    "uploadDocuments": "Subir documentos",
                    "nextButton": "Siguiente",
                    "backButton": "Atrás",
                    "submitButton": "Enviar"
                }
            }
        }
    }, () => {
        translatePage();
    });

    document.getElementById('languageDropdown').addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        i18next.changeLanguage(selectedLanguage, translatePage);
    });

    function translatePage() {
        document.querySelectorAll('[data-i18n]').forEach((element) => {
            const key = element.getAttribute('data-i18n');
            element.textContent = i18next.t(key);
        });
    }

    // Initialize progress bar and form steps
    updateProgressBar();
    updateFormSteps();
});
