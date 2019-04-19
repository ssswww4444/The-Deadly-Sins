// map part
// two map tile layers
let street = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}),
    satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'});

var jsonData = $.ajax({
        url:"https://api.myjson.com/bins/xefh8",
        dataType: "json",
        success: console.log("Data successfully loaded."),
        error: function (xhr) {
          alert(xhr.statusText)
        }
      }) 

// uses jquery when and done, as load geo json is async
$.when(jsonData).done(function() {
let mymap1 = L.map('mapid1',{
    maxZoom: 12,
    minZoom: 11,
    layers: [satellite, street]
}
).setView([-37.81358124698001,144.96665954589844], 11);

// add icon to marker
let myIcon = L.icon({
    iconUrl: './assets/twitter.png',
    iconSize: [20, 20],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    // shadowUrl: './assets/twitterShadow.png',
    //shadowSize: [68, 95],
    // shadowAnchor: [22, 94]
});

// save some places for testing
let southBank      = L.marker([-37.824700770115996,  144.96597290039062],{icon: myIcon}).bindPopup('Twitter from SouthBank.'),
    parkville      = L.marker([-37.78672476186113, 144.95258331298828],{icon: myIcon}).bindPopup('Twitter from Parkville.'),
    northMelbourne = L.marker([-37.79859436217878, 144.94537353515625],{icon: myIcon}).bindPopup('Twitter from North Melbourne');

let places = L.layerGroup([southBank, parkville, northMelbourne]);

// multiple layers
let baseMaps = {
    "street": street,
    "satellite": satellite
};

let overlayMaps = {
    "places": places
};

// map has restricted area and zoom range form 11-13
let southWest = L.latLng(-37.99869780196609, 144.56522216796875),
    northEast = L.latLng(-37.61804716978352,  145.2781463623047);
mymap1.setMaxBounds(new L.LatLngBounds(southWest, northEast));

L.control.layers(baseMaps, overlayMaps).addTo(mymap1);

function getColor(d) {
    return d > 100 ? '#800026' :
           d > 50  ? '#BD0026' :
           d > 20  ? '#E31A1C' :
           d > 10  ? '#FC4E2A' :
           d > 5   ? '#FD8D3C' :
           d > 2   ? '#FEB24C' :
           d > 0   ? '#FED976' :
                      '#FFEDA0';
}


function style(feature) {
    return {
        fillColor: getColor(feature.properties.cartodb_id),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

// custom info control
let info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Melbourne GEO Info</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + 'ID ' + props.cartodb_id
        : 'Hover over a polygon');
};

info.addTo(mymap1);

// legend of the heat map
let legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    let div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 2, 5, 10, 20, 50, 100],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(mymap1);


function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    mymap1.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

// add polygon layer to the map
geojson = L.geoJson(jsonData.responseJSON, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(mymap1);

});

/*
let melData = {};
let showData = function(){
    console.log(JSON.stringify(melData));
}
// https://api.myjson.com/bins/xefh8
// https://nominatim.openstreetmap.org/search.php?q=Melbourne&polygon_geojson=1&format=json
// fetch melbourne polygon geojson data
fetch(' https://api.myjson.com/bins/xefh8')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    melData = data;
    showData();
  })
  .catch(err => {
    console.log(err)
  })
*/

// map has restricted area and zoom range form 11-13
let mymap2 = L.map('mapid2',{
    maxZoom: 13,
    minZoom: 11,
}).setView([-37.81358124698001,144.96665954589844], 12);

let southWest = L.latLng(-37.89869780196609, 144.66522216796875),
    northEast = L.latLng(-37.71804716978352,  145.1781463623047);

mymap2.setMaxBounds(new L.LatLngBounds(southWest, northEast));

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap2);

// chart part
var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'horizontalBar',

    // The data for our dataset
    data: {
        labels: ['passion', 'desire', 'want', 'joy', 'pleasure', 'longing', 'sensuality'],
        datasets: [{
            label: 'Number',
            backgroundColor:["rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)","rgba(201, 203, 207, 0.2)"],
            borderColor:["rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)","rgb(201, 203, 207)"],
            data: [82, 50, 60, 30, 40, 30, 45]
        }]
    },

    // Configuration options go here
    options: {
        legend: {
            display: false
        },

        scales: {
            xAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

var ctx2 = document.getElementById('myChart2').getContext('2d');

var barChart = new Chart(ctx2, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels: ['passion', 'desire', 'want', 'joy', 'pleasure', 'longing', 'sensuality'],
        datasets: [{
            label: 'Number',
            backgroundColor:["rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)","rgba(201, 203, 207, 0.2)"],
            borderColor:["rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)","rgb(201, 203, 207)"],
            data: [82, 50, 60, 30, 40, 60, 45]
        }]
    },

    // Configuration options go here
    options: {
        legend: {
            display: false
        },

        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});