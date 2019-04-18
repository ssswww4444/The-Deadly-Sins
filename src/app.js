// map part

var mymap1 = L.map('mapid1',{
    maxZoom: 13,
    minZoom: 11,
}
).setView([-37.81358124698001,144.96665954589844], 12);

// map has restricted area and zoom range form 11-13
var southWest = L.latLng(-37.89869780196609, 144.66522216796875),
    northEast = L.latLng(-37.71804716978352,  145.1781463623047);
mymap1.setMaxBounds(new L.LatLngBounds(southWest, northEast));

// map has restricted area and zoom range form 11-13
var mymap2 = L.map('mapid2',{
    maxZoom: 13,
    minZoom: 11,
}).setView([-37.81358124698001,144.96665954589844], 12);
mymap2.setMaxBounds(new L.LatLngBounds(southWest, northEast));

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap1);

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

  

// var marker = L.marker([-37.81358124698001,144.96665954589844]).addTo(mymap1);

/* var circle = L.circle([-37.81358124698001,144.96665954589844], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap1);
*/

// var polygon = L.polygon([
   // [144.96665954589844, -37.81358124698001],
    //[144.91665954589844, -34.81358124698001],
    // [144.88665954589844, -35.81358124698001]
// ]).addTo(mymap1);

// marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
// circle.bindPopup("I am a circle.");
// polygon.bindPopup("I am a polygon.");


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