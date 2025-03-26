// Author: Konstantinos Anagnostopoulos
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("add-event-form");
    const successMessage = document.getElementById("success-message");
    const errorMessage = document.getElementById("error-message");

    // Initialize flatpickr for date and time input
    flatpickr("#startDate", {
        enableTime: true,           // Enables time selection
        dateFormat: "Y-m-d\\TH:i:S",  // Format similar to ISO (e.g., 2025-05-03T22:00:00)
        time_24hr: true             // Optional: use 24-hour format
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        // Clear previous errors
        document.querySelectorAll(".invalid-feedback").forEach(el => el.textContent = "");
        document.querySelectorAll(".form-control").forEach(el => {
            el.classList.remove("is-invalid");
            el.removeAttribute("aria-invalid");
            el.removeAttribute("aria-describedby");
        });
        errorMessage.classList.add("d-none");
        errorMessage.textContent = "";

        // Gather form data
        const data = {
            title: document.getElementById("title").value.trim(),
            media: document.getElementById("media").value.trim(),
            description: document.getElementById("description").value.trim(),
            startDate: document.getElementById("startDate").value.trim(),
            venue: document.getElementById("venue").value.trim(),
            address: document.getElementById("address").value.trim(),
            price: document.getElementById("price").value.trim(),
            artists: document.getElementById("artists").value.trim()
        };

        // Prefix the price with a dollar sign if missing
        if (data.price && !data.price.startsWith("$")) {
            data.price = "$" + data.price;
        }

        // Submit via Ajax using fetch
        fetch("/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errData => { throw errData; });
                }
                return response.json();
            })
            .then(result => {
                // On success, show success message and clear form
                successMessage.classList.remove("d-none");
                const viewNewItemLink = document.getElementById("view-new-item");
                viewNewItemLink.setAttribute("href", "/view/" + result.new_id);
                viewNewItemLink.focus(); // Move focus to the success message link
                form.reset();
            })
            .catch(err => {
                if (err.errors) {
                    // Loop through errors and mark the fields
                    for (const [field, message] of Object.entries(err.errors)) {
                        const inputField = document.getElementById(field);
                        if (inputField) {
                            inputField.classList.add("is-invalid");
                            inputField.setAttribute("aria-invalid", "true");
                            inputField.setAttribute("aria-describedby", "error-" + field);
                            const errorDiv = document.getElementById("error-" + field);
                            if (errorDiv) {
                                errorDiv.textContent = message;
                            }
                        }
                    }
                    // Focus on the first invalid field
                    const firstInvalid = form.querySelector(".is-invalid");
                    if (firstInvalid) {
                        firstInvalid.focus();
                    }
                } else {
                    errorMessage.textContent = "An error occurred while submitting the form. Please try again.";
                    errorMessage.classList.remove("d-none");
                    errorMessage.focus(); // Move focus to the error message
                }
            });
    });

    // Clear error messages on form reset
    form.addEventListener("reset", function () {
        document.querySelectorAll(".invalid-feedback").forEach(el => el.textContent = "");
        document.querySelectorAll(".form-control").forEach(el => {
            el.classList.remove("is-invalid");
            el.removeAttribute("aria-invalid");
            el.removeAttribute("aria-describedby");
        });
        errorMessage.classList.add("d-none");
    });
});