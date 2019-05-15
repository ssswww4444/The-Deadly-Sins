// map1
// two map tile layers
var street = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}),
    satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'});
  
var jsonData = $.ajax({
        // AURIN Job dataset API: http://45.113.233.243:5984/job_json/90a80a4fc502d169ebce4ee07a001fb8
        // testing melbourne geo json API: http://admin:123qweasd@45.113.233.243:5984/geo_json/2adb959d243ca8869f8d9576bb0028c2
        url:"http://admin:123qweasd@45.113.233.243:5984/homeless_json/ff4be0927955452a280785783d00c807",
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
    minZoom: 9,
    layers: [satellite, street]
}
).setView([-37.81358124698001,144.96665954589844], 9);

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


var useful1     = L.marker([-37.8156,  144.9661],{icon: myIcon}).bindPopup('FEMINISM is not a dirty word. \nIt’s not about being an angry woman or a man hater. \nIt doesn’t have to be a complex… https://t.co/Dk2WP1EeMQ.'),
    useful2     = L.marker([-38.433859306,  144.593741856],{icon: myIcon}).bindPopup('"You forgot to pack me 😭I miss you already vi_keeland ❤️ @ Melbourne Airport https://t.co/P7jt3mV12Q '),
    useful3     = L.marker([-36.833285001,  144.380744992],{icon: myIcon}).bindPopup('The latest posts on Easter 2019 is up! There was a bit of a delay while I fought off a cold and handed in multiple… https://t.co/nAuzhepur5');

var rubbish1 =     L.marker([-37.7244,145.379],{icon: myIcon2}).bindPopup('As far as Porters go, this was nice - Drinking a Grand Porter by Coldstream Brewery @ Coldstream Brewery and Restau… https://t.co/s9ZDMXP0Wa'),
    rubbish2     = L.marker([-37.812,  144.937],{icon: myIcon2}).bindPopup('&amp;b reminiscent of Toohey’s Old #atthesource - Drinking an Urban Dark by Urban Alley Brewery @ Urban Alley Brewery  — https://t.co/Fal9wCCwYb'), 
    rubbish3     = L.marker([ -37.8595, 144.978],{icon: myIcon2}).bindPopup('"Conflicted about this one. Infected with something Brettish, but this combines with big floral hops and ends up an… https://t.co/Sa8acmiXZh');

var places = L.layerGroup([useful1, useful2, useful3]);
var places2 = L.layerGroup([rubbish1, rubbish2, rubbish3]);

// multiple layers
var baseMaps = {
    "basemap": street,
    //"basemap": satellite
};

var overlayMaps = {
    "Useful tweets": places,
    "Rubbish AD tweets": places2
};

// map has restricted area and zoom range form 11-13
var southWest = L.latLng(-40.00869780196609, 143.560522216796875),
    northEast = L.latLng(-35.61804716978352,  146.2981463623047);
mymap1.setMaxBounds(new L.LatLngBounds(southWest, northEast));

L.control.layers(baseMaps, overlayMaps).addTo(mymap1);

function getColor(d) {
    return d > 8.0 ? '#800026' :
           d > 6.0 ? '#BD0026' :
           d > 4.0  ? '#E31A1C' :
           d > 3.0  ? '#FC4E2A' :
           d > 2.0  ? '#FD8D3C' :
           d > 1.5   ? '#FEB24C' :
           d > 1.0   ? '#FED976' :
                      '#FFEDA0';
}


function style(feature) {
    return {
        fillColor: getColor(feature.properties.wrath_rate),
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
    this._div.innerHTML = '<h5>Wrath rate</h5>' +  (props ?
        '<b>' + props.feature_name + '</b><br />' 
        + props.total_tweet+ ' total tweets' + ' (' + props.total_tweet_rank + ') ' + '<br />'
        + Number(props.wrath_rate).toFixed(2) + '% wrath rate' + ' (' + props.wrath_rate_rank + ') ' +'<br />' 
        + Number(props.negative_rate).toFixed(2) + '% negative rate' + ' (' + props.negative_rate_rank + ') ' +'<br />'
        + props.hl_p_homeless_tot + ' homeless number' + ' (' + props.homeless_rank + ') ' + '<br />'  
        + Number(props.work_overtime).toFixed(2) + '% work overtime percentage' + ' (' + props.work_overtime_rank + ') ' +'<br />'
        + Number(props.unemp_rate).toFixed(2) + '% unemployment percentage' + ' (' + props.unemp_rate_rank + ') ' +'<br />'
        + Number(props.complete_y12_rate).toFixed(2) + '% complete year 12 percentage' +' (' + props.complete_y12_rank + ') ' + '<br />'
        + Number(props.death_rate).toFixed(2) + '% death rate' + ' (' + props.death_rate_rank + ') ' +'<br />'
        + props.population + ' population' + ' (' + props.population_rank + ') ' +'<br />'
        + props.median_age + ' median age' + ' (' + props.median_age_rank + ') ' +'<br />'
        + props.median_income + ' median income' + ' (' + props.median_income_rank + ') ' +'<br />'
        + Number(props.polarity).toFixed(2) + ' polarity' + ' (' + props.polarity_rank + ') ' +'<br />'

        : 'Hover over a polygon');
};

info.addTo(mymap1);

// legend of the heat map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [1.0, 1.5, 2.0, 3.0, 4.0, 6.0, 8.0],
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


$("#map-select a").click(function(e){
    e.preventDefault(); // cancel the link behaviour
    var selText = $(this).text();
    console.log(selText)

    if (selText === "Wrath rate"){

        var mapContent = document.getElementById('mapContent');
        mapContent.innerHTML = '&nbsp;';
        $('#mapContent').append('  <div id="mapid1"></div> <br/><br/>');

        var street = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}),
        satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'});
      
    var jsonData = $.ajax({
            // AURIN Job dataset API: http://45.113.233.243:5984/job_json/90a80a4fc502d169ebce4ee07a001fb8
            // testing melbourne geo json API: http://admin:123qweasd@45.113.233.243:5984/geo_json/2adb959d243ca8869f8d9576bb0028c2
            url:"http://admin:123qweasd@45.113.233.243:5984/homeless_json/ff4be0927955452a280785783d00c807",
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
        minZoom: 9,
        layers: [satellite, street]
    }
    ).setView([-37.81358124698001,144.96665954589844], 9);
    
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
    
    
    var useful1     = L.marker([-37.8156,  144.9661],{icon: myIcon}).bindPopup('FEMINISM is not a dirty word. \nIt’s not about being an angry woman or a man hater. \nIt doesn’t have to be a complex… https://t.co/Dk2WP1EeMQ.'),
        useful2     = L.marker([-38.433859306,  144.593741856],{icon: myIcon}).bindPopup('"You forgot to pack me 😭I miss you already vi_keeland ❤️ @ Melbourne Airport https://t.co/P7jt3mV12Q '),
        useful3     = L.marker([-36.833285001,  144.380744992],{icon: myIcon}).bindPopup('The latest posts on Easter 2019 is up! There was a bit of a delay while I fought off a cold and handed in multiple… https://t.co/nAuzhepur5');
    
    var rubbish1 =     L.marker([-37.7244,145.379],{icon: myIcon2}).bindPopup('As far as Porters go, this was nice - Drinking a Grand Porter by Coldstream Brewery @ Coldstream Brewery and Restau… https://t.co/s9ZDMXP0Wa'),
        rubbish2     = L.marker([-37.812,  144.937],{icon: myIcon2}).bindPopup('&amp;b reminiscent of Toohey’s Old #atthesource - Drinking an Urban Dark by Urban Alley Brewery @ Urban Alley Brewery  — https://t.co/Fal9wCCwYb'), 
        rubbish3     = L.marker([ -37.8595, 144.978],{icon: myIcon2}).bindPopup('"Conflicted about this one. Infected with something Brettish, but this combines with big floral hops and ends up an… https://t.co/Sa8acmiXZh');
    
    var places = L.layerGroup([useful1, useful2, useful3]);
    var places2 = L.layerGroup([rubbish1, rubbish2, rubbish3]);

    // multiple layers
    var baseMaps = {
        "basemap": street,
        //"basemap": satellite
    };
    
    var overlayMaps = {
        "Useful tweets": places,
        "Rubbish AD tweets": places2
    };
    
    // map has restricted area and zoom range form 11-13
    var southWest = L.latLng(-40.00869780196609, 143.560522216796875),
        northEast = L.latLng(-35.61804716978352,  146.2981463623047);
    mymap1.setMaxBounds(new L.LatLngBounds(southWest, northEast));
    
    L.control.layers(baseMaps, overlayMaps).addTo(mymap1);
    
    function getColor(d) {
        return d > 10.0 ? '#800026' :
               d > 8.5 ? '#BD0026' :
               d > 7.0  ? '#E31A1C' :
               d > 5.5  ? '#FC4E2A' :
               d > 4.0  ? '#FD8D3C' :
               d > 2.5   ? '#FEB24C' :
               d > 1.0   ? '#FED976' :
                          '#FFEDA0';
    }
    
    
    function style(feature) {
        return {
            fillColor: getColor(feature.properties.wrath_rate),
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
        this._div.innerHTML = '<h5>Wrath rate</h5>' +  (props ?
            '<b>' + props.feature_name + '</b><br />' 
            + props.total_tweet+ ' total tweets' + ' (' + props.total_tweet_rank + ') ' + '<br />'
            + Number(props.wrath_rate).toFixed(2) + '<b>'+'% wrath rate' +'</b>'+ ' (' + props.wrath_rate_rank + ') ' +'<br />' 
            + Number(props.negative_rate).toFixed(2) + '% negative rate' + ' (' + props.negative_rate_rank + ') ' +'<br />'
            + props.hl_p_homeless_tot + ' homeless number' + ' (' + props.homeless_rank + ') ' + '<br />'  
            + Number(props.work_overtime).toFixed(2) + '% work overtime percentage' + ' (' + props.work_overtime_rank + ') ' +'<br />'
            + Number(props.unemp_rate).toFixed(2) + '% unemployment percentage' + ' (' + props.unemp_rate_rank + ') ' +'<br />'
            + Number(props.complete_y12_rate).toFixed(2) + '% complete year 12 percentage' +' (' + props.complete_y12_rank + ') ' + '<br />'
            + Number(props.death_rate).toFixed(2) + '% death rate' + ' (' + props.death_rate_rank + ') ' +'<br />'
            + props.population + ' population' + ' (' + props.population_rank + ') ' +'<br />'
            + props.median_age + ' median age' + ' (' + props.median_age_rank + ') ' +'<br />'
            + props.median_income + ' median income' + ' (' + props.median_income_rank + ') ' +'<br />'
            + Number(props.polarity).toFixed(2) + ' polarity' + ' (' + props.polarity_rank + ') ' +'<br />'
    
            : 'Hover over a polygon');
    };
    
    info.addTo(mymap1);
    
    // legend of the heat map
    var legend = L.control({position: 'bottomright'});
    
    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [1.0, 2.5, 4.0, 5.5, 7.0, 8.5, 10.0],
            labels = [];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1.5) + '"></i> ' +
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

    }

    if (selText === "Polarity"){

        var mapContent = document.getElementById('mapContent');
        mapContent.innerHTML = '&nbsp;';
        $('#mapContent').append('  <div id="mapid1"></div> <br/><br/>');

        var street = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}),
        satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'});
      
    var jsonData = $.ajax({
            // AURIN Job dataset API: http://45.113.233.243:5984/job_json/90a80a4fc502d169ebce4ee07a001fb8
            // testing melbourne geo json API: http://admin:123qweasd@45.113.233.243:5984/geo_json/2adb959d243ca8869f8d9576bb0028c2
            url:"http://admin:123qweasd@45.113.233.243:5984/homeless_json/ff4be0927955452a280785783d00c807",
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
        minZoom: 9,
        layers: [satellite, street]
    }
    ).setView([-37.81358124698001,144.96665954589844], 9);
        
    var myIcon = L.icon({
        iconUrl: './assets/cool.png',
        iconSize: [20, 20],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
    });
    
    var myIcon2 = L.icon({
        iconUrl: './assets/angry.png',
        iconSize: [20, 20],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
    });
    
    
    var useful1     = L.marker([-37.8156,  144.9661],{icon: myIcon}).bindPopup('FEMINISM is not a dirty word. \nIt’s not about being an angry woman or a man hater. \nIt doesn’t have to be a complex… https://t.co/Dk2WP1EeMQ.'),
        useful2     = L.marker([-38.433859306,  144.593741856],{icon: myIcon}).bindPopup('"You forgot to pack me 😭I miss you already vi_keeland ❤️ @ Melbourne Airport https://t.co/P7jt3mV12Q '),
        useful3     = L.marker([-36.833285001,  144.380744992],{icon: myIcon}).bindPopup('The latest posts on Easter 2019 is up! There was a bit of a delay while I fought off a cold and handed in multiple… https://t.co/nAuzhepur5');
    
    var rubbish1 =     L.marker([-37.7244,145.379],{icon: myIcon2}).bindPopup('As far as Porters go, this was nice - Drinking a Grand Porter by Coldstream Brewery @ Coldstream Brewery and Restau… https://t.co/s9ZDMXP0Wa'),
        rubbish2     = L.marker([-37.812,  144.937],{icon: myIcon2}).bindPopup('&amp;b reminiscent of Toohey’s Old #atthesource - Drinking an Urban Dark by Urban Alley Brewery @ Urban Alley Brewery  — https://t.co/Fal9wCCwYb'), 
        rubbish3     = L.marker([ -37.8595, 144.978],{icon: myIcon2}).bindPopup('"Conflicted about this one. Infected with something Brettish, but this combines with big floral hops and ends up an… https://t.co/Sa8acmiXZh');
    
    var places = L.layerGroup([useful1, useful2, useful3]);
    var places2 = L.layerGroup([rubbish1, rubbish2, rubbish3]);
    
    // multiple layers
    var baseMaps = {
        "basemap": street,
        //"basemap": satellite
    };
    
    var overlayMaps = {
        "Useful tweets": places,
        "Rubbish AD tweets": places2
    };
    
    // map has restricted area and zoom range form 11-13
    var southWest = L.latLng(-40.00869780196609, 143.560522216796875),
        northEast = L.latLng(-35.61804716978352,  146.2981463623047);
    mymap1.setMaxBounds(new L.LatLngBounds(southWest, northEast));
    
    L.control.layers(baseMaps, overlayMaps).addTo(mymap1);
    
    function getColor1(d) {
        return d > 0.18 ? '#3300FF' :
               d > 0.15  ? '#3366FF' :
               d > 0.12  ? '#3399FF' :
               d > 0.09  ? '#33CCFF' :
               d > 0.06   ? '#33FFFF' :
               d > 0.03   ? '#6633FF' :
               d > 0.0   ? '#6666FF' :
                          '#6666FF';
    }
    function style(feature) {
        return {
            fillColor: getColor1(feature.properties.polarity),
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
        this._div.innerHTML = '<h5>Polarity</h5>' +  (props ?
            '<b>' + props.feature_name + '</b><br />' 
            + props.total_tweet+ ' total tweets' + ' (' + props.total_tweet_rank + ') ' + '<br />'
            + Number(props.wrath_rate).toFixed(2) + '% wrath rate' + ' (' + props.wrath_rate_rank + ') ' +'<br />' 
            + Number(props.negative_rate).toFixed(2) + '% negative rate' + ' (' + props.negative_rate_rank + ') ' +'<br />'
            + props.hl_p_homeless_tot + ' homeless number' + ' (' + props.homeless_rank + ') ' + '<br />'  
            + Number(props.work_overtime).toFixed(2) + '% work overtime percentage' + ' (' + props.work_overtime_rank + ') ' +'<br />'
            + Number(props.unemp_rate).toFixed(2) + '% unemployment percentage' + ' (' + props.unemp_rate_rank + ') ' +'<br />'
            + Number(props.complete_y12_rate).toFixed(2) + '% complete year 12 percentage' +' (' + props.complete_y12_rank + ') ' + '<br />'
            + Number(props.death_rate).toFixed(2) + '% death rate' + ' (' + props.death_rate_rank + ') ' +'<br />'
            + props.population + ' population' + ' (' + props.population_rank + ') ' +'<br />'
            + props.median_age + ' median age' + ' (' + props.median_age_rank + ') ' +'<br />'
            + props.median_income + ' median income' + ' (' + props.median_income_rank + ') ' +'<br />'
            + Number(props.polarity).toFixed(2) +'<b>'+ ' polarity' +'</b>'+ ' (' + props.polarity_rank + ') ' +'<br />'
    
            : 'Hover over a polygon');
    };
    
    info.addTo(mymap1);
    
    // legend of the heat map
    var legend1 = L.control({position: 'bottomright'});
    
    legend1.onAdd = function (map) {
    
        var div1 = L.DomUtil.create('div', 'info legend'),
            grades1 = [0.0, 0.03, 0.06, 0.09, 0.12, 0.15, 0.18],
            labels = [];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (let j = 0; j < grades1.length; j++) {
            div1.innerHTML +=
                '<i style="background:' + getColor1(grades1[j] + 0.03) + '"></i> ' +
                grades1[j] + (grades1[j + 1] ? '&ndash;' + grades1[j + 1] + '<br>' : '+');
        }

        return div1;
    };
    
    legend1.addTo(mymap1);
    
    
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

    }
    $("#map-button").text(selText);
});
