// Storing API endpoint
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Performing GET request on the API endpoint
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
});

// Creating a function to color the magnitude of earthquake
function depthColor(depth) {
    if (depth > 90) {
      return "red";
    } else if (depth > 70) {
      return "orangered";
    } else if (depth > 50) {
      return "orange";
    } else if (depth > 30) {
      return "gold";
    } else if (depth > 10) {
      return "yellow";
    } else {
      return "green";
    }
  }

  // Creating a function to reflect the size of the marker based on the magnitude
function markerSize(magnitude) {
    return magnitude * 7500
  }

function createFeatures(earthquakeData) {

    // Defining a function that will run once for each feature and return a popup
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr>
      <p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }
  
    // Create a GeoJSON layer that contains the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    let earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
    // Point to layer used to alter markers
      pointToLayer: function(feature, latlng) {
  
        // Determine the style of markers based on properties
        let markers = {
            radius: markerSize(feature.properties.mag),
            fillColor: depthColor(feature.geometry.coordinates[2]),
            fillOpacity: 0.5,
            color: "white",
            weight: 0.25
        }
        return L.circle(latlng,markers);
      }
    });
    
    // Send our earthquakes layer to the createMap function
    createMap(earthquakes);
  }

  function createMap(earthquakes) {

    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
      center: [40.7608, -111.8910],
      zoom: 5,
      layers: [street, earthquakes]
    });
  
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
   L.control.layers(baseMaps, overlayMaps, {
     collapsed: false
   }).addTo(myMap);

}

