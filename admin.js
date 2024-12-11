document.addEventListener("DOMContentLoaded", () => {
    const clientTypeSelect = document.getElementById("clientType");
    const newDocumentInput = document.getElementById("newDocumentName");
    const addDocumentBtn = document.getElementById("addDocument");
    const documentList = document.getElementById("documentList");

    // Retrieve existing configurations from local storage or initialize
    const clientDocuments = JSON.parse(localStorage.getItem("clientDocuments")) || {
        Individual: ["Passport", "Bank Statement"],
        Company: ["Company Registration", "Financial Report"],
        Trust: ["Trust Deed", "Beneficiary List"]
    };

    // Function to update document list in the UI
    function updateDocumentList() {
        const selectedClientType = clientTypeSelect.value;
        documentList.innerHTML = "";
        clientDocuments[selectedClientType].forEach((doc, index) => {
            const docRow = document.createElement("div");
            docRow.classList.add("document-row");
            docRow.innerHTML = `
                <span>${doc}</span>
                <button class="btn remove-btn" data-index="${index}" data-type="${selectedClientType}">Remove</button>
            `;
            documentList.appendChild(docRow);
        });

        // Add remove functionality
        const removeBtns = document.querySelectorAll(".remove-btn");
        removeBtns.forEach((btn) =>
            btn.addEventListener("click", (e) => {
                const type = btn.getAttribute("data-type");
                const index = btn.getAttribute("data-index");
                clientDocuments[type].splice(index, 1);
                localStorage.setItem("clientDocuments", JSON.stringify(clientDocuments));
                updateDocumentList();
            })
        );
    }

    // Add new document for selected client type
    addDocumentBtn.addEventListener("click", () => {
        const selectedClientType = clientTypeSelect.value;
        const newDocument = newDocumentInput.value.trim();

        if (newDocument) {
            clientDocuments[selectedClientType].push(newDocument);
            localStorage.setItem("clientDocuments", JSON.stringify(clientDocuments));
            newDocumentInput.value = "";
            updateDocumentList();
        } else {
            alert("Please enter a valid document name.");
        }
    });

    // Update document list on client type change
    clientTypeSelect.addEventListener("change", updateDocumentList);

    // Initialize
    updateDocumentList();
});
