let map, marker;
let mode = "redirect";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("mode").addEventListener("change", function () {
    mode = this.value;
  });
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

  map.addListener("click", (e) => {
    marker.setPosition(e.latLng);
    updateLatLngInputs(e.latLng.lat(), e.latLng.lng());
  });

  marker.addListener("dragend", function () {
    let pos = marker.getPosition();
    updateLatLngInputs(pos.lat(), pos.lng());
  });

  initAutocomplete();
}

function updateLatLngInputs(lat, lng) {
  document.getElementById("latitude").value = lat.toFixed(6);
  document.getElementById("longitude").value = lng.toFixed(6);
}

function initAutocomplete() {
  const input = document.getElementById("searchInput");
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);

  autocomplete.addListener("place_changed", function () {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
      alert("No details available for input: '" + place.name + "'");
      return;
    }

    map.setCenter(place.geometry.location);
    map.setZoom(15);
    marker.setPosition(place.geometry.location);

    updateLatLngInputs(
      place.geometry.location.lat(),
      place.geometry.location.lng()
    );
  });
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

  let message = mode === "redirect"
    ? `Hi, here's my current location: https://maps.google.com/?q=${lat},${lng}`
    : `Hey! This is where I am: https://maps.google.com/?q=${lat},${lng}`;

  const link = `https://wa.me/${number.replace('+', '')}?text=${encodeURIComponent(message)}`;
  window.open(link, "_blank");
}
