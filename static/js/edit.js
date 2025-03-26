// Author: Konstantinos Anagnostopoulos
$(document).ready(function () {
    // Initialize flatpickr for date and time
    flatpickr("#startDate", { enableTime: true, dateFormat: "Y-m-d H:i" });

    const eventId = window.location.pathname.split("/").pop();

    // Form submission handler
    $("#edit-event-form").submit(function (e) {
        e.preventDefault();

        // Clear previous errors
        $(".invalid-feedback").text("");
        $(".form-control").removeClass("is-invalid");
        $(".form-control").removeAttr("aria-invalid");
        $(".form-control").removeAttr("aria-describedby");

        const eventData = {
            title: $("#title").val(),
            media: $("#media").val(),
            description: $("#description").val(),
            startDate: $("#startDate").val(),
            venue: $("#venue").val(),
            address: $("#address").val(),
            price: $("#price").val(),
            artists: $("#artists").val(),
        };

        $.ajax({
            type: "POST",
            url: `/edit/${eventId}`,
            contentType: "application/json",
            data: JSON.stringify(eventData),
            dataType: "json", // Ensures proper JSON handling
            success: function (response) {
                if (response.success && response.id) {
                    // Redirect to the event details page
                    window.location.href = `/view/${response.id}`;
                } else {
                    alert("Error: Server response did not contain a valid ID.");
                }
            },
            error: function (xhr) {
                const errors = xhr.responseJSON.errors;
                for (const field in errors) {
                    $(`#${field}`).addClass("is-invalid");
                    $(`#${field}`).attr("aria-invalid", "true");
                    $(`#${field}`).attr("aria-describedby", `error-${field}`);
                    $(`#error-${field}`).text(errors[field]);
                }
                // Focus on the first invalid field
                const firstInvalid = $(".is-invalid").first();
                if (firstInvalid.length) {
                    firstInvalid.focus();
                }
            },
        });
    });

    // Discard changes handler (moved outside submit handler)
    $("#discard-btn").click(function () {
        if (confirm("Are you sure you want to discard changes?")) {
            window.location.href = `/view/${eventId}`;
        }
    });
});