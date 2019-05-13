// map1
// two map tile layers
var street = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}),
    satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'});

var jsonData = $.ajax({
        // AURIN Job dataset API: http://45.113.233.243:5984/job_json/90a80a4fc502d169ebce4ee07a001fb8
        // testing melbourne geo json API: http://admin:123qweasd@45.113.233.243:5984/geo_json/2adb959d243ca8869f8d9576bb0028c2
        url:"http://admin:123qweasd@45.113.233.243:5984/job_json/90a80a4fc502d169ebce4ee07a001fb8",
        //url: "https://api.myjson.com/bins/xefh8",
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
    minZoom: 10,
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
    "basemap": street,
    //"basemap": satellite
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
    return d > 28000 ? '#800026' :
           d > 25000  ? '#BD0026' :
           d > 20000  ? '#E31A1C' :
           d > 18000  ? '#FC4E2A' :
           d > 16000   ? '#FD8D3C' :
           d > 15000   ? '#FEB24C' :
           d > 10000   ? '#FED976' :
                      '#FFEDA0';
}


function style(feature) {
    return {
        fillColor: getColor(feature.properties.median_income_per_job_aud_persons),
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
    this._div.innerHTML = '<h5>Jobs</h5>' +  (props ?
        '<b>' + props.feature_name + '</b><br />' + props.median_income_per_job_aud_persons+ ' median income ' + '<br />'
        + props.num_tweets + ' total tweets' +  '<br />' +props.num_negative_tweets + ' negative tweets'
        : 'Hover over a polygon');
};

info.addTo(mymap1);

// legend of the heat map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [10000, 15000, 16000, 18000, 20000, 25000, 28000],
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