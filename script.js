let selectedLat = null;
let selectedLng = null;
let map, marker;

function initMap() {
    const defaultLocation = { lat: 20.5937, lng: 78.9629 }; // India default center
    map = new google.maps.Map(document.getElementById("map"), {
        center: defaultLocation,
        zoom: 4,
    });

    map.addListener("click", function (event) {
        selectedLat = event.latLng.lat();
        selectedLng = event.latLng.lng();
        updateMarkerAndCoords();
    });
}

function updateMarkerAndCoords() {
    if (marker) {
        marker.setMap(null);
    }
    marker = new google.maps.Marker({
        position: { lat: selectedLat, lng: selectedLng },
        map: map,
    });
    document.getElementById("coordsDisplay").innerText =
        `Selected Location: ${selectedLat.toFixed(5)}, ${selectedLng.toFixed(5)}`;
}

function promptCoordinates() {
    const lat = parseFloat(prompt("Enter Latitude:"));
    const lng = parseFloat(prompt("Enter Longitude:"));
    if (!isNaN(lat) && !isNaN(lng)) {
        selectedLat = lat;
        selectedLng = lng;
        map.setCenter({ lat: lat, lng: lng });
        map.setZoom(10);
        updateMarkerAndCoords();
    } else {
        alert("Invalid coordinates.");
    }
}

function sendMessage() {
    const mobileNumber = document.getElementById("mobileNumber").value.trim();
    const resultElement = document.getElementById("result");

    if (!mobileNumber || !selectedLat || !selectedLng) {
        resultElement.innerHTML = "Please fill all required fields and select a location.";
        return;
    }

    if (!mobileNumber.startsWith("+")) {
        resultElement.innerHTML = "Mobile number must start with '+'.";
        return;
    }

    const mapsLink = `https://www.google.com/maps?q=${selectedLat},${selectedLng}`;
    resultElement.innerHTML = `
        Message sent to ${mobileNumber}!<br>
        <a href="${mapsLink}" target="_blank">View Location</a>
    `;
}
