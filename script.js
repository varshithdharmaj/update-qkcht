let map, marker;
let mode = "redirect";

document.getElementById('mode').addEventListener('change', function () {
  mode = this.value;
});

function initMap() {
  const defaultLoc = { lat: 17.385044, lng: 78.486671 }; // Hyderabad
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLoc,
    zoom: 13,
    disableDefaultUI: true,
  });

  marker = new google.maps.Marker({
    position: defaultLoc,
    map: map,
    draggable: true,
  });

  updateLatLngInputs(defaultLoc.lat, defaultLoc.lng);

  map.addListener("click", (e) => {
    marker.setPosition(e.latLng);
    updateLatLngInputs(e.latLng.lat(), e.latLng.lng());
  });

  marker.addListener('dragend', function () {
    let pos = marker.getPosition();
    updateLatLngInputs(pos.lat(), pos.lng());
  });
}

function updateLatLngInputs(lat, lng) {
  document.getElementById("latitude").value = lat.toFixed(6);
  document.getElementById("longitude").value = lng.toFixed(6);
}

function sendLocation() {
  const number = document.getElementById("number").value.trim();
  const lat = document.getElementById("latitude").value.trim();
  const lng = document.getElementById("longitude").value.trim();

  if (!number.startsWith("+")) {
    alert("Please enter number in international format e.g. +91...");
    return;
  }

  if (!lat || !lng) {
    alert("Please select or enter coordinates.");
    return;
  }

  const message = mode === "redirect"
    ? `Hi, here's my current location: https://maps.google.com/?q=${lat},${lng}`
    : `Hey! This is where I am: https://maps.google.com/?q=${lat},${lng}`;

  const link = `https://wa.me/${number.replace('+', '')}?text=${encodeURIComponent(message)}`;
  window.open(link, "_blank");
}

function searchLocation() {
  const query = document.getElementById("searchInput").value;
  if (!query) return alert("Please enter a location to search.");

  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=YOUR_GOOGLE_MAPS_API_KEY`)
    .then(res => res.json())
    .then(data => {
      if (data.status === "OK") {
        const loc = data.results[0].geometry.location;
        const latLng = new google.maps.LatLng(loc.lat, loc.lng);
        map.setCenter(latLng);
        map.setZoom(14);
        marker.setPosition(latLng);
        updateLatLngInputs(loc.lat, loc.lng);
      } else {
        alert("Location not found.");
      }
    })
    .catch(() => alert("Error fetching location."));
}
