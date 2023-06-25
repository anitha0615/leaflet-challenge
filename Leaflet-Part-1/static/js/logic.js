// create map
let myMap = L.map('map', {
    center: [40,-97],
    zoom: 4
});

// create baselayer and add to map
L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(myMap);



// set url to get geojson
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';


d3.json(url).then(function(response) {
    console.log(response)
    let features = response.features

    createMap(features) 
});

//Function to create a map
function createMap(mapdata) {
    
    L.geoJSON(mapdata, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, 
          {
            radius: feature.properties.mag *3,
            fillColor: gethue(feature.geometry.coordinates[2]),
            fillOpacity: 0.75,
            color: '#000',
            stroke: true,
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          }
        );
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<strong>Title: " + feature.properties.title + "</n> Place: " + feature.properties.place + "</strong><hr><p>Date: " + new Date(feature.properties.time) + "</p><hr><p>Depth: " + feature.geometry.coordinates[2] + "</p><p>Magnitude: " + feature.properties.mag + "</p>");
      }
       
    }).addTo(myMap);
  
  // Create a legend that will provide context of the map data
  let legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function() {
      var div = L.DomUtil.create('div', 'legend');
      var depthLevel = [-10, 10, 30, 50, 70, 90];
      var labels = [];
  
      // Loop through each depthLevel item and color the legend
      for (var i = 0; i < depthLevel.length; i++) {
          labels.push('<ul style="background:' + gethue(depthLevel[i]+1) + '"><span>' + depthLevel[i] + (depthLevel[i + 1] ? '&ndash;' + depthLevel[i + 1] + '' : '+') + '</span></ul>');
      }
      // add each label list item to the div under the <ul> tag
      div.innerHTML += "<ul>" + labels.join("")+ "</ul>";
      return div;
    };
    legend.addTo(myMap);
  }

// Function to create marker color or shade
function gethue(depth) {
       
       if (depth >= 90) {
         return shade = "red";
       }
       else if (depth >= 70 && depth < 90) {
         return shade = "darkorange";
       }
       else if (depth >= 50 && depth < 70) {
         return shade = "orange";
       }
       else if (depth >= 30 && depth < 70) {
           return shade = "#FACB11";
       }
       else if (depth >= 10 && depth < 30) {
         return shade = "greenyellow";
       }
       else if (depth > 0) {
         return shade = "limegreen";
       }
       else {
       return shade = "grey";
       }

    // Return the shade based on the depth value
    return shade;
}

