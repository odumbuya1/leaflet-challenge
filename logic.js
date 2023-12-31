console.log("Earthquakes");
  var basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })
 // Creating the map object
var myMap = L.map("map", {
    center: [27, -95],
    zoom: 5
  });
 basemap.addTo(myMap)
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {;
 // Perform a GET request to the query URL/
    // Once we get a response, send the data.features object to the createFeatures function.
   function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  function getColor(depth) {
    switch (true) {
      case depth > 90:
        return "#BD0026";
      case depth > 70:
        return "#F03B20";
      case depth > 50:
        return "#FD8D3C";
      case depth > 30:
        return "#FEB24C";
      case depth > 10:
        return "#FED976";
      default:
        return "#6BAED6";
    }
  }
 // This function determines the radius of the earthquake marker based on its magnitude.
  // Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }
  // / Here we add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // We set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<h3>Location: ${feature.properties.place} </h3><p><h3>Earthquake Magnitude: ${feature.properties.mag}</h3><p><h3>Depth(km): ${feature.geometry.coordinates[2]}</h3>`
      );
    }
  }).addTo(myMap);
 // Set up the legend.
  var legend = L.control({
    position: "bottomleft"
  });
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [-10, 10, 30, 50, 70, 90];
    var colors = [
        "#6BAED6",
        "#FED976",
        "#FEB24C",
        "#FD8D3C",
        "#F03B20",
        "#BD0026"
      ];
 // Looping through our intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < grades.length; i++) {
    div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
    + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };
// var limits = geojson.options.limits;
// var colors = geojson.options.colors;
// var labels = [];
// // Add the minimum and maximum.
// var legendInfo = "<h1>Population with Children<br />(ages 6-17)</h1>" +
//   "<div class=\"labels\">" +
//     "<div class=\"min\">" + limits[0] + "</div>" +
//     "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//   "</div>";
// div.innerHTML = legendInfo;
// limits.forEach(function(limit, index) {
//   labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
// });
// div.innerHTML += "<ul>" + labels.join("") + "</ul>";
// return div;
// };
  legend.addTo(myMap);
});