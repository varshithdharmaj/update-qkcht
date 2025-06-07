function sendMessage() {
    var mobileNumber = document.getElementById("mobileNumber").value.trim();
    var latitude = document.getElementById("latitude").value.trim();
    var longitude = document.getElementById("longitude").value.trim();
    var resultElement = document.getElementById("result");

    // Basic validations
    if (!mobileNumber || !latitude || !longitude) {
        resultElement.innerHTML = "Please fill in all fields.";
        return;
    }

    if (!mobileNumber.startsWith("+")) {
        resultElement.innerHTML = "Invalid number. Please start with a '+' sign.";
        return;
    }

    if (isNaN(latitude) || isNaN(longitude)) {
        resultElement.innerHTML = "Latitude and Longitude must be numeric.";
        return;
    }

    // You can replace this with actual API/backend logic
    // Example: Creating a Google Maps link
    const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

    // Show success message
    resultElement.innerHTML = `
        Message sent to ${mobileNumber}!<br>
        <a href="${mapsLink}" target="_blank">View Custom Location</a>
    `;
}
