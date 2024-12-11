document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("signatureCanvas");
    const ctx = canvas.getContext("2d");
    const clearBtn = document.getElementById("clearSignature");
    const continueBtn = document.getElementById("continueBtn");

    let drawing = false;

    // Start drawing on canvas
    canvas.addEventListener("mousedown", (e) => {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    });

    // Draw on canvas
    canvas.addEventListener("mousemove", (e) => {
        if (drawing) {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        }
    });

    // Stop drawing
    canvas.addEventListener("mouseup", () => {
        drawing = false;
    });

    // Clear canvas
    clearBtn.addEventListener("click", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Redirect to the multi-step form
    continueBtn.addEventListener("click", () => {
        if (ctx.getImageData(0, 0, canvas.width, canvas.height).data.some((color) => color !== 0)) {
            // Proceed if signature exists
            alert("Signature submitted successfully.");
            window.location.href = "multi-step-form.html"; // Redirect to the form
        } else {
            alert("Please provide your signature before continuing.");
        }
    });
});
