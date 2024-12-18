document.addEventListener("DOMContentLoaded", async () => {
    const clientTypeSelect = document.getElementById("clientType");
    const documentList = document.getElementById("documentList");
    const addDocumentButton = document.getElementById("addDocument");
    const newDocumentName = document.getElementById("newDocumentName");
    const submissionsList = document.getElementById("submissions-list");

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

    // Update documents on server
    async function updateDocuments(clientType, documents) {
        try {
            const response = await fetch("http://localhost:3000/documents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ clientType, documents }),
            });

            if (response.ok) {
                alert("Documents updated successfully.");
            } else {
                alert("Failed to update documents.");
            }
        } catch (error) {
            console.error("Error updating documents:", error);
        }
    }

    // Render document list
    function renderDocumentList(documents) {
        documentList.innerHTML = "";
        documents.forEach((doc, index) => {
            const docItem = document.createElement("div");
            docItem.classList.add("document-item");
            docItem.innerHTML = `
                <span>${doc}</span>
                <button class="btn remove-document" data-index="${index}">Remove</button>
            `;
            documentList.appendChild(docItem);
        });

        document.querySelectorAll(".remove-document").forEach((btn) => {
            btn.addEventListener("click", async (event) => {
                const index = event.target.getAttribute("data-index");
                documents.splice(index, 1);
                await updateDocuments(clientTypeSelect.value, documents);
                renderDocumentList(documents);
            });
        });
    }

    // Fetch and render documents
    async function fetchAndRenderDocuments() {
        const clientType = clientTypeSelect.value;
        const documents = await fetchDocuments(clientType);
        renderDocumentList(documents);
    }

    // Event listeners
    clientTypeSelect.addEventListener("change", fetchAndRenderDocuments);

    addDocumentButton.addEventListener("click", async () => {
        const clientType = clientTypeSelect.value;
        const newDoc = newDocumentName.value.trim();

        if (newDoc) {
            const documents = await fetchDocuments(clientType);
            documents.push(newDoc);
            await updateDocuments(clientType, documents);
            renderDocumentList(documents);
            newDocumentName.value = "";
        } else {
            alert("Please enter a document name.");
        }
    });

    // Fetch submissions from server
    async function fetchSubmissions() {
        try {
            const response = await fetch("http://localhost:3000/submissions");
            if (response.ok) {
                const submissions = await response.json();
                renderSubmissions(submissions);
            } else {
                submissionsList.innerHTML = "<p>Failed to fetch submissions.</p>";
            }
        } catch (error) {
            console.error("Error fetching submissions:", error);
            submissionsList.innerHTML = "<p>Error fetching submissions.</p>";
        }
    }

    // Render submissions
    function renderSubmissions(submissions) {
        submissionsList.innerHTML = "";
        submissions.forEach((submission, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <p><strong>Submission #${index + 1}</strong></p>
                <p><strong>Full Name:</strong> ${submission.fullName}</p>
                <p><strong>Email:</strong> ${submission.email}</p>
                <p><strong>Phone:</strong> ${submission.phone}</p>
                <p><strong>Client Type:</strong> ${submission.clientType}</p>
                <p><strong>Documents:</strong></p>
                <ul>
                    ${submission.documents
                        .map(
                            (doc) =>
                                `<li><a href="${doc.path}" target="_blank">${doc.filename}</a></li>`
                        )
                        .join("")}
                </ul>
            `;
            submissionsList.appendChild(listItem);
        });
    }

    // Initialize i18next for language switching
    i18next.init({
        lng: 'en',
        debug: true,
        resources: {
            en: {
                translation: {
                    "manageDocuments": "Manage Required Documents",
                    "selectClientType": "Select Client Type",
                    "newDocumentPlaceholder": "Enter a new document name",
                    "addDocument": "Add Document",
                    "currentDocuments": "Current Required Documents",
                    "submittedForms": "Submitted Forms",
                    "actions": "Actions",
                    "exportData": "Export Data"
                }
            },
            es: {
                translation: {
                    "manageDocuments": "Gestionar documentos requeridos",
                    "selectClientType": "Seleccione el tipo de cliente",
                    "newDocumentPlaceholder": "Ingrese un nuevo nombre de documento",
                    "addDocument": "Agregar documento",
                    "currentDocuments": "Documentos requeridos actuales",
                    "submittedForms": "Formularios enviados",
                    "actions": "Acciones",
                    "exportData": "Exportar datos"
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

    await fetchAndRenderDocuments();
    await fetchSubmissions();
});
