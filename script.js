let map, marker, mode = "redirect";

document.getElementById("mode").addEventListener("change", function () {
  mode = this.value;
});

function initMap() {
  const hyderabad = { lat: 17.385044, lng: 78.486671 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: hyderabad,
    zoom: 13,
    disableDefaultUI: true,
    styles: [/* Optional: futuristic dark map style here */]
  });

  marker = new google.maps.Marker({
    position: hyderabad,
    map: map,
    draggable: true,
  });

  google.maps.event.addListener(map, 'click', function (event) {
    marker.setPosition(event.latLng);
    updateCoords(event.latLng.lat(), event.latLng.lng());
  });

  marker.addListener('dragend', function () {
    const pos = marker.getPosition();
    updateCoords(pos.lat(), pos.lng());
  });

  updateCoords(hyderabad.lat, hyderabad.lng);
}

function updateCoords(lat, lng) {
  document.getElementById("latitude").value = lat.toFixed(6);
  document.getElementById("longitude").value = lng.toFixed(6);
}

function sendLocation() {
  const number = document.getElementById("number").value.trim();
  const lat = document.getElementById("latitude").value;
  const lng = document.getElementById("longitude").value;

  if (!number || !lat || !lng) {
    alert("Please fill all fields and pick a location.");
    return;
  }

  if (!number.startsWith("+")) {
    alert("Use international format: +91...");
    return;
  }

  let message = `Here's my location: https://maps.google.com/?q=${lat},${lng}`;
  if (mode === "tamper") {
    message = `Check out this place: https://maps.google.com/?q=${lat},${lng}`;
  }

  const waLink = `https://wa.me/${number.replace('+', '')}?text=${encodeURIComponent(message)}`;
  window.open(waLink, "_blank");
}

function searchLocation() {
  const query = document.getElementById("searchInput").value;
  if (!query) return;

  const service = new google.maps.places.PlacesService(map);
  const request = {
    query: query,
    fields: ["name", "geometry"]
  };

  service.findPlaceFromQuery(request, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK && results[0]) {
      const location = results[0].geometry.location;
      map.setCenter(location);
      marker.setPosition(location);
      updateCoords(location.lat(), location.lng());
    } else {
      alert("Place not found!");
    }
  });
}
