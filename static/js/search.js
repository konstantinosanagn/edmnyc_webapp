// Author: Konstantinos Anagnostopoulos
$(document).ready(function () {
    $('#search-form').submit(function (event) {
        event.preventDefault(); // Prevent default form submission

        const searchInput = $('#search-input');
        let query = searchInput.val().trim();

        // Check for empty/whitespace query
        if (!query) {
            searchInput.val(""); // Clear the input
            searchInput.focus(); // Move focus back to the input
            searchInput.attr("aria-invalid", "true"); // Mark input as invalid
            searchInput.attr("aria-describedby", "search-error"); // Associate error message
            $('#search-error').text("Please enter a search term.").removeClass("d-none"); // Show error message
            return;
        }

        // Clear any previous error state
        searchInput.removeAttr("aria-invalid");
        searchInput.removeAttr("aria-describedby");
        $('#search-error').addClass("d-none");

        // Redirect to the search results page
        window.location.href = "/search?q=" + encodeURIComponent(query);
    });
});