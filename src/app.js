// map1
// two map tile layers
var street = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}),
    satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'});

var jsonData = $.ajax({
        url:"http://admin:123qweasd@45.113.233.243:5984/geo_json/2adb959d243ca8869f8d9576bb0028c2",
        type: "GET",
        dataType: "json",
        success: console.log("GeoJson successfully loaded from couchDB."),
        // to log in the couchdb account
        headers: { "Authorization": "Basic " + btoa("admin" + ":" + "123qweasd")},
        error: function (xhr) {
          alert(xhr.statusText)
        }
      }) 

// uses jquery when and done, as load geo json is async
$.when(jsonData).done(function() {
var mymap1 = L.map('mapid1',{
    maxZoom: 12,
    minZoom: 11,
    layers: [satellite, street]
}
).setView([-37.81358124698001,144.96665954589844], 11);

// add icon to marker
var myIcon = L.icon({
    iconUrl: './assets/twitter.png',
    iconSize: [20, 20],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
});

var myIcon2 = L.icon({
    iconUrl: './assets/twitterShadow.png',
    iconSize: [20, 20],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
});


// save some places for testing

var array = [];
var coordinates = [
    [-37.854700770115996,  144.96597290039062],
    [-37.864700770115996,  144.96597290039062],
    [-37.77859436217878, 144.94537353515625]
];


coordinates.forEach(function(coordinate){
    //var markerMap = L.marker((coordinate), {icon: myIcon}).bindPopup('Here is a Twitter.').addTo(mymap1);
    var markerMap = L.marker((coordinate), {icon: myIcon2}).bindPopup('Normal Twitter.');
    array.push(markerMap);
    // console.log(coordinate);
});

var southBank      = L.marker([-37.814700770115996,  144.91597290039062],{icon: myIcon}).bindPopup('Twitter from SouthBank.'),
    parkville      = L.marker([-37.834700770115996,  144.98597290039062],{icon: myIcon}).bindPopup('Twitter from Parkville.'),
    northMelbourne = L.marker([-37.79859436217878, 144.94537353515625],{icon: myIcon}).bindPopup('Twitter from North Melbourne');

var places = L.layerGroup([southBank, parkville, northMelbourne]);
var places2 = L.layerGroup(array);

// multiple layers
var baseMaps = {
    "street": street,
    "satellite": satellite
};

var overlayMaps = {
    "Normal twitters": places,
    "Wrath twitters": places2
};

// map has restricted area and zoom range form 11-13
var southWest = L.latLng(-38.00869780196609, 144.560522216796875),
    northEast = L.latLng(-37.61804716978352,  145.2981463623047);
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
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h5>Wrath story map</h5>' +  (props ?
        '<b>' + props.name + '</b><br />' + 'ID ' + props.cartodb_id
        : 'Hover over a polygon');
};

info.addTo(mymap1);

// legend of the heat map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
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
        color: '#F5F5F5',
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


// map2
// https://api.myjson.com/bins/xefh8
var jsonData2 = $.ajax({
    url:"http://admin:123qweasd@45.113.233.243:5984/geo_json/2adb959d243ca8869f8d9576bb0028c2",
    type: "GET",
    dataType: "json",
    success: console.log("GeoJson successfully loaded from couchDB."),
    // to log in the couchdb account
    headers: { "Authorization": "Basic " + btoa("admin" + ":" + "123qweasd")},
    error: function (xhr) {
      alert(xhr.statusText)
    }
  }) 


//add polygon to the map
$.when(jsonData2).done(function() {

var base1 = L.tileLayer('https://maps.heigit.org/openmapsurfer/tiles/roads/webmercator/{z}/{x}/{y}.png', {attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}),
    base2 =  L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'});

var mymap2 = L.map('mapid2',{
    maxZoom: 12,
    minZoom: 11,
    layers: [base1, base2]
}).setView([-37.81358124698001,144.96665954589844], 11);

var southWest = L.latLng(-38.00869780196609, 144.560522216796875),
    northEast = L.latLng(-37.61804716978352,  145.2981463623047);

mymap2.setMaxBounds(new L.LatLngBounds(southWest, northEast));

// add icon to marker
var myIcon = L.icon({
    iconUrl: './assets/twitterShadow.png',
    iconSize: [20, 20],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
});

var angryIcon = L.icon({
    iconUrl: './assets/angry.png',
    iconSize: [20, 20],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
});

var coolIcon = L.icon({
    iconUrl: './assets/cool.png',
    iconSize: [20, 20],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
});

// save some places for testing

var baseMaps = {
    "basemap 1": base1,
    "basemap 2": base2
};

var array = [];
var coordinates = [
    [-37.854700770115996,  144.96597290039062],
    [-37.864700770115996,  144.96597290039062],
    [-37.77859436217878, 144.94537353515625]
];

var angry = []
var coordinatesAngry = [
    [-37.814700770115996,  144.92597290039062],
    [-37.824700770115996,  144.93597290039062],
    [-37.79859436217878, 144.94537353515625]
];

var cool = []
var coordinatesCool = [
    [-37.824700770115996,  144.91597290039062],
    [-37.844700770115996,  144.94597290039062],
    [-37.78859436217878, 144.93537353515625]
];

coordinates.forEach(function(coordinate){
    //var markerMap = L.marker((coordinate), {icon: myIcon}).bindPopup('Here is a Twitter.').addTo(mymap2);
    var markerMap = L.marker((coordinate), {icon: myIcon}).bindPopup('Here is a Twitter.');
    array.push(markerMap);
    //console.log(coordinate);
});

coordinatesAngry.forEach(function(coordinate){
    //var markerMap = L.marker((coordinate), {icon: myIcon}).bindPopup('Here is a Twitter.').addTo(mymap1);
    var markerMap = L.marker((coordinate), {icon: angryIcon}).bindPopup('Angry Twitter.');
    angry.push(markerMap);
});

coordinatesCool.forEach(function(coordinate){
    //var markerMap = L.marker((coordinate), {icon: myIcon}).bindPopup('Here is a Twitter.').addTo(mymap1);
    var markerMap = L.marker((coordinate), {icon: coolIcon}).bindPopup('Cool Twitter.');
    cool.push(markerMap);
});

var places = L.layerGroup(array);
var places3 = L.layerGroup(angry);
var places4 = L.layerGroup(cool);

var overlayMaps = {
    "Normal twitters": places,
    "Angry twitters": places3,
    "Cool twitters": places4
};

L.control.layers(baseMaps, overlayMaps).addTo(mymap2);

function getColor(d) {
    return d > 100 ? '#3300FF' :
           d > 50  ? '#3366FF' :
           d > 20  ? '#3399FF' :
           d > 10  ? '#33CCFF' :
           d > 5   ? '#33FFFF' :
           d > 2   ? '#6633FF' :
           d > 0   ? '#6666FF' :
                      '#6666FF';
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
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h5>Lust story map</h5>' +  (props ?
        '<b>' + props.name + '</b><br />' + 'ID ' + props.cartodb_id
        : 'Hover over a polygon');
};

info.addTo(mymap2);

// legend of the heat map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
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

legend.addTo(mymap2);

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#F5F5F5',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson2.resetStyle(e.target);
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
geojson2 = L.geoJson(jsonData2.responseJSON, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(mymap2);


});


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