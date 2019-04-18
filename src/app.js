// map part
// two map tile layers
let satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'}),
    street = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'});

let mymap1 = L.map('mapid1',{
    maxZoom: 13,
    minZoom: 11,
    layers: [street, satellite]
}
).setView([-37.81358124698001,144.96665954589844], 12);

// save some places for testing
let southBank      = L.marker([-37.824700770115996,  144.96597290039062]).bindPopup('This is SouthBank.'),
    parkville      = L.marker([-37.78672476186113, 144.95258331298828]).bindPopup('This is Parkville.'),
    northMelbourne = L.marker([-37.79859436217878, 144.94537353515625]).bindPopup('This is North Melbourne');

let places = L.layerGroup([southBank, parkville, northMelbourne]);

let baseMaps = {
    "street": street,
    "satellite": satellite
};

let overlayMaps = {
    "places": places
};

// map has restricted area and zoom range form 11-13
let southWest = L.latLng(-37.89869780196609, 144.66522216796875),
    northEast = L.latLng(-37.71804716978352,  145.1781463623047);
mymap1.setMaxBounds(new L.LatLngBounds(southWest, northEast));

L.control.layers(baseMaps, overlayMaps).addTo(mymap1);


// map has restricted area and zoom range form 11-13
let mymap2 = L.map('mapid2',{
    maxZoom: 13,
    minZoom: 11,
}).setView([-37.81358124698001,144.96665954589844], 12);
mymap2.setMaxBounds(new L.LatLngBounds(southWest, northEast));

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap2);


// fetch melbourne polygon geojson data
fetch('https://nominatim.openstreetmap.org/search.php?q=Melbourne&polygon_geojson=1&format=json')
  .then(response => {
    return response.json()
  })
  .then(data => {
   console.log(data[0])
  })
  .catch(err => {
    console.log(err)
  })


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