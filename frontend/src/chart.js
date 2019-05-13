var melbourne_data1;
var dockland_data1;
var southbank_data1;
var eastmelbourne_data1;
var kensington_data1;
var labels1;

var chartData1 = $.ajax({
    url:"http://admin:123qweasd@45.113.233.243:5984/pie_chart/ff4be0927955452a280785783d0096d4",
    type: "GET",
    dataType: "json",
    success: console.log("chart json successfully loaded from couchDB."),
    // to log in the couchdb account
    headers: { "Authorization": "Basic " + btoa("admin" + ":" + "123qweasd")},
    error: function (xhr) {
      alert(xhr.statusText)
    }
  }) 

// uses jquery when and done, as load geo json is async
$.when(chartData1).done(function() {
// pie chart
console.log(chartData1.responseJSON)

Object.keys(chartData1.responseJSON).forEach(function(k){
    console.log(k + ' - ' + chartData1.responseJSON[k]);
});
console.log(chartData1.responseJSON["Melbourne"]);

melbourne_data1 = Object.values(chartData1.responseJSON["Melbourne"]).slice(1);
dockland_data1 = Object.values(chartData1.responseJSON["Docklands"]).slice(1);
southbank_data1 = Object.values(chartData1.responseJSON["Southbank"]).slice(1);
eastmelbourne_data1 = Object.values(chartData1.responseJSON["East Melbourne"]).slice(1);
kensington_data1 = Object.values(chartData1.responseJSON["Kensington"]).slice(1);
labels1 = Object.keys(chartData1.responseJSON["Melbourne"]).slice(1);

// pie chart for wrath story
var ctx3 = document.getElementById('pie-chart').getContext('2d');
var myPieChart = new Chart(ctx3, {
    type: 'pie',
    data: {
        labels: labels1,
        datasets: [{
          label: "Number",
          backgroundColor:["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#f4a460", "#48d1cc"],
          data: melbourne_data1
        }]
      },
    options: {
        title: {
          display: true,
          text: 'Melbourne Pie Chart'
        }
    }
});

$("#table-select1 a").click(function(e){
    e.preventDefault(); // cancel the link behaviour
    var selText1 = $(this).text();
    console.log(selText1)

    if (selText1 === "Melbourne"){
        console.log("select melbourne")
        var pieChartContent1 = document.getElementById('pieChartContent1');
        pieChartContent1.innerHTML = '&nbsp;';
        $('#pieChartContent1').append(' <canvas id="pie-chart" width="400" height="200"><canvas>');
        var ctx3 = document.getElementById('pie-chart').getContext('2d');

        var myPieChart  = new Chart(ctx3, {
            type: 'pie',
            data: {
                labels: labels1,
                datasets: [{
                  label: "Number",
                  backgroundColor:["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#f4a460", "#48d1cc"],
                  data: melbourne_data1
                }]
              },
            options: {
                animation: false,
                title: {
                  display: true,
                  text: 'Wrath: Melbourne Pie Chart'
                }
            }
        });
    }

    if (selText1 === "Docklands"){

        var pieChartContent1 = document.getElementById('pieChartContent1');
        pieChartContent1.innerHTML = '&nbsp;';
        $('#pieChartContent1').append(' <canvas id="pie-chart" width="400" height="200"><canvas>');
        var ctx3 = document.getElementById('pie-chart').getContext('2d');
        
        var myPieChart = new Chart(ctx3, {
            type: 'pie',
            data: {
                labels: labels1,
                datasets: [{
                  label: "Number",
                  backgroundColor:["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#f4a460", "#48d1cc"],
                  data: dockland_data1
                }]
              },
            options: {
                animation: false,
                title: {
                  display: true,
                  text: 'Wrath: Docklands Pie Chart'
                }
            }
        });
    }

    if (selText1 === "Southbank"){

        var pieChartContent1 = document.getElementById('pieChartContent1');
        pieChartContent1.innerHTML = '&nbsp;';
        $('#pieChartContent1').append(' <canvas id="pie-chart" width="400" height="200"><canvas>');
        var ctx3= document.getElementById('pie-chart').getContext('2d');
        
        var myPieChart = new Chart(ctx3, {
            type: 'pie',
            data: {
                labels: labels1,
                datasets: [{
                  label: "Number",
                  backgroundColor:["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#f4a460", "#48d1cc"],
                  data: southbank_data1
                }]
              },
            options: {
                animation: false,
                title: {
                  display: true,
                  text: 'Wrath: Southbank Pie Chart'
                }
            }
        });
    }
    if (selText1 === "East Melbourne"){

        var pieChartContent1 = document.getElementById('pieChartContent1');
        pieChartContent1.innerHTML = '&nbsp;';
        $('#pieChartContent1').append(' <canvas id="pie-chart" width="400" height="200"><canvas>');
        var ctx3 = document.getElementById('pie-chart').getContext('2d');
        
        var myPieChart = new Chart(ctx3, {
            type: 'pie',
            data: {
                labels: labels1,
                datasets: [{
                  label: "Number",
                  backgroundColor:["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#f4a460", "#48d1cc"],
                  data: eastmelbourne_data1
                }]
              },
            options: {
                animation: false,
                title: {
                  display: true,
                  text: 'Wrath: East Melbourne Pie Chart'
                }
            }
        });
    }
    if (selText1 === "Kensington"){

        var pieChartContent1 = document.getElementById('pieChartContent1');
        pieChartContent1.innerHTML = '&nbsp;';
        $('#pieChartContent1').append(' <canvas id="pie-chart" width="400" height="200"><canvas>');
        var ctx3 = document.getElementById('pie-chart').getContext('2d');
        
        var myPieChart = new Chart(ctx3, {
            type: 'pie',
            data: {
                labels: labels1,
                datasets: [{
                  label: "Number",
                  backgroundColor:["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#f4a460", "#48d1cc"],
                  data: kensington_data1
                }]
              },
            options: {
                animation: false,
                title: {
                  display: true,
                  text: 'Wrath: Kensington Pie Chart'
                }
            }
        });
    }
    $("#table-button1").text(selText1);
});

});

// scatter part for wrath story
var ctx = document.getElementById('myChart').getContext('2d');
var dataset1x, dataset1y,dataset2x,dataset2y;

var feature1 = [10,20,30,40,50,60,70,55,78,99,100]
var feature2 = [20,30,40,50,10,20,80,66,66,11,12]
var data1 = feature1.map( (v,i) => ({ x: v, y: feature2[i] }) )
var scatterChartData1 = {
    datasets: [{
        label: 'My First dataset',
        borderColor: '#3e95cd',
        backgroundColor: '#ff0000',
        data: data1
    }]
};

 var scatterChart = new Chart(ctx, {
        type: 'scatter',
        data: scatterChartData1,
        options: {
            title: {
                display: true,
                text: 'Feature1 Scatter Chart'
            },
        }
    });

$("#scatter-select1 a").click(function(e){
    e.preventDefault(); // cancel the link behaviour
    var selText = $(this).text();
    console.log(selText)

    if (selText === "Feature1"){

        var scatterContent1 = document.getElementById('scatterContent1');
        scatterContent1.innerHTML = '&nbsp;';
        $('#scatterContent1').append(' <canvas id="myChart" width="400" height="200"><canvas>');
        var ctx = document.getElementById('myChart').getContext('2d');

        var scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: scatterChartData1,
            options: {
                title: {
                    display: true,
                    text: 'Feature1 Scatter Chart'
                },
            }
        });
    }

        if (selText === "Feature2"){
            var scatterContent1 = document.getElementById('scatterContent1');
            scatterContent1.innerHTML = '&nbsp;';
            $('#scatterContent1').append(' <canvas id="myChart" width="400" height="200"><canvas>');
            var ctx = document.getElementById('myChart').getContext('2d');
    
            var scatterChart = new Chart(ctx, {
                type: 'scatter',
                data: scatterChartData1,
                options: {
                    title: {
                        display: true,
                        text: 'Feature2 Scatter Chart'
                    },
                }
            });
        }

        if (selText === "Feature3"){

            var scatterContent1 = document.getElementById('scatterContent1');
            scatterContent1.innerHTML = '&nbsp;';
            $('#scatterContent1').append(' <canvas id="myChart" width="400" height="200"><canvas>');
            var ctx = document.getElementById('myChart').getContext('2d');
    
            var scatterChart = new Chart(ctx, {
                type: 'scatter',
                data: scatterChartData1,
                options: {
                    title: {
                        display: true,
                        text: 'Feature3 Scatter Chart'
                    },
                }
            });
        }

        if (selText === "Feature4"){
            var scatterContent1 = document.getElementById('scatterContent1');
            scatterContent1.innerHTML = '&nbsp;';
            $('#scatterContent1').append(' <canvas id="myChart" width="400" height="200"><canvas>');
            var ctx = document.getElementById('myChart').getContext('2d');
    
            var scatterChart = new Chart(ctx, {
                type: 'scatter',
                data: scatterChartData1,
                options: {
                    title: {
                        display: true,
                        text: 'Feature4 Scatter Chart'
                    },
                }
            });
        }
    $("#scatter-button1").text(selText);
});