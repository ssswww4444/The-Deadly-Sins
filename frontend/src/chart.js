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



var scatterData = $.ajax({
    url:"http://admin:123qweasd@45.113.233.243:5984/scatter_plot/52201fc49fc58b632904e844620368a6",
    type: "GET",
    dataType: "json",
    success: console.log("scatter json successfully loaded from couchDB."),
    // to log in the couchdb account
    headers: { "Authorization": "Basic " + btoa("admin" + ":" + "123qweasd")},
    error: function (xhr) {
      alert(xhr.statusText)
    }
  }) 

$.when(scatterData).done(function() {

console.log("work-overtime")
var work_overtime = Object.values(scatterData.responseJSON["work_overtime"]);
var homeless= Object.values(scatterData.responseJSON["homeless"]);
var unemp= Object.values(scatterData.responseJSON["unemp"]);
var complete_y12 = Object.values(scatterData.responseJSON["complete_y12"]);
var death_rate = Object.values(scatterData.responseJSON["death_rate"]);
var population = Object.values(scatterData.responseJSON["population"]);
var median_age = Object.values(scatterData.responseJSON["median_age"]);
var income = Object.values(scatterData.responseJSON["income"]);

console.log(work_overtime);

// scatter part for wrath story
var ctx = document.getElementById('myChart').getContext('2d');
var dataset1x, dataset1y,dataset2x,dataset2y;

document.getElementById('correlation').value = Number(work_overtime[2]).toFixed(4)
var feature1 = work_overtime[0]
var feature2 = work_overtime[1]
var data1 = feature1.map( (v,i) => ({ x: v, y: feature2[i] }) )
var scatterChartData1 = {
    datasets: [{
        label: "Work Overtime",
        borderColor: '#3e95cd',
        backgroundColor: '#ff0000',
        data: data1
    }]
};

var feature21 = homeless[0]
var feature22 = homeless[1]
var data2 = feature21.map( (v,i) => ({ x: v, y: feature22[i] }) )
var scatterChartData2 = {
    datasets: [{
        label: "Homeless",
        borderColor: '#3e95cd',
        backgroundColor: '#ff1493',
        data: data2
    }]
};

var feature31 = unemp[0]
var feature32 = unemp[1]
var data3 = feature31.map( (v,i) => ({ x: v, y: feature32[i] }) )
var scatterChartData3 = {
    datasets: [{
        label: "Unemployment",
        borderColor: '#3e95cd',
        backgroundColor: '#ff8c00',
        data: data3
    }]
};

var feature41 = complete_y12[0]
var feature42 = complete_y12[1]
var data4 = feature41.map( (v,i) => ({ x: v, y: feature42[i] }) )
var scatterChartData4 = {
    datasets: [{
        label: "Complete Year 12",
        borderColor: '#3e95cd',
        backgroundColor: '#00ff00',
        data: data4
    }]
};

var feature51 = death_rate[0]
var feature52 = death_rate[1]
var data5 = feature51.map( (v,i) => ({ x: v, y: feature52[i] }) )
var scatterChartData5 = {
    datasets: [{
        label: "Death rate",
        borderColor: '#3e95cd',
        backgroundColor: '#daa520',
        data: data5
    }]
};

var feature61 = population[0]
var feature62 = population[1]
var data6 = feature61.map( (v,i) => ({ x: v, y: feature62[i] }) )
var scatterChartData6 = {
    datasets: [{
        label: "Population",
        borderColor: '#3e95cd',
        backgroundColor: '#4b0082',
        data: data6
    }]
};

var feature71 = median_age[0]
var feature72 = median_age[1]
var data7 = feature71.map( (v,i) => ({ x: v, y: feature72[i] }) )
var scatterChartData7 = {
    datasets: [{
        label: "Median age",
        borderColor: '#3e95cd',
        backgroundColor: '#00bfff',
        data: data7
    }]
};

var feature81 = income[0]
var feature82 = income[1]
var data8 = feature81.map( (v,i) => ({ x: v, y: feature82[i] }) )
var scatterChartData8 = {
    datasets: [{
        label: "Income",
        borderColor: '#3e95cd',
        backgroundColor: '#ff4500',
        data: data8
    }]
};

 var scatterChart = new Chart(ctx, {
        type: 'scatter',
        data: scatterChartData1,
        options: {
            title: {
                display: true,
                text: 'Scatter Chart'
            },
        }
    });

 $("#scatter-button1").text("Work Overtime");

$("#scatter-select1 a").click(function(e){
    e.preventDefault(); // cancel the link behaviour
    var selText = $(this).text();
    console.log(selText)

    if (selText === "Work Overtime"){

        document.getElementById('correlation').value = Number(work_overtime[2]).toFixed(4)
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
                    text: 'Scatter Chart'
                },
            }
        });

    }

    if (selText === "Homeless"){

        document.getElementById('correlation').value = Number(homeless[2]).toFixed(4)
        var scatterContent1 = document.getElementById('scatterContent1');
        scatterContent1.innerHTML = '&nbsp;';
        $('#scatterContent1').append(' <canvas id="myChart" width="400" height="200"><canvas>');

        var ctx = document.getElementById('myChart').getContext('2d');

        var scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: scatterChartData2,
            options: {
                title: {
                    display: true,
                    text: 'Scatter Chart'
                },
            }
        });

    }


    if (selText === "Unemployment"){

        document.getElementById('correlation').value = Number(unemp[2]).toFixed(4)
        var scatterContent1 = document.getElementById('scatterContent1');
        scatterContent1.innerHTML = '&nbsp;';
        $('#scatterContent1').append(' <canvas id="myChart" width="400" height="200"><canvas>');

        var ctx = document.getElementById('myChart').getContext('2d');

        var scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: scatterChartData3,
            options: {
                title: {
                    display: true,
                    text: 'Scatter Chart'
                },
            }
        });

    }
    if (selText === "Complete Year 12"){

        document.getElementById('correlation').value = Number(complete_y12[2]).toFixed(4)
        var scatterContent1 = document.getElementById('scatterContent1');
        scatterContent1.innerHTML = '&nbsp;';
        $('#scatterContent1').append(' <canvas id="myChart" width="400" height="200"><canvas>');

        var ctx = document.getElementById('myChart').getContext('2d');

        var scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: scatterChartData4,
            options: {
                title: {
                    display: true,
                    text: 'Scatter Chart'
                },
            }
        });

    }

    if (selText === "Death rate"){

        document.getElementById('correlation').value = Number(death_rate[2]).toFixed(4)
        var scatterContent1 = document.getElementById('scatterContent1');
        scatterContent1.innerHTML = '&nbsp;';
        $('#scatterContent1').append(' <canvas id="myChart" width="400" height="200"><canvas>');

        var ctx = document.getElementById('myChart').getContext('2d');

        var scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: scatterChartData5,
            options: {
                title: {
                    display: true,
                    text: 'Scatter Chart'
                },
            }
        });

    }

    if (selText === "Population"){

        document.getElementById('correlation').value = Number(population[2]).toFixed(4)
        var scatterContent1 = document.getElementById('scatterContent1');
        scatterContent1.innerHTML = '&nbsp;';
        $('#scatterContent1').append(' <canvas id="myChart" width="400" height="200"><canvas>');

        var ctx = document.getElementById('myChart').getContext('2d');

        var scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: scatterChartData6,
            options: {
                title: {
                    display: true,
                    text: 'Scatter Chart'
                },
            }
        });

    }

    if (selText === "Median age"){

        document.getElementById('correlation').value = Number(median_age[2]).toFixed(4)
        var scatterContent1 = document.getElementById('scatterContent1');
        scatterContent1.innerHTML = '&nbsp;';
        $('#scatterContent1').append(' <canvas id="myChart" width="400" height="200"><canvas>');

        var ctx = document.getElementById('myChart').getContext('2d');

        var scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: scatterChartData7,
            options: {
                title: {
                    display: true,
                    text: 'Scatter Chart'
                },
            }
        });

    }

    if (selText === "Income"){

        document.getElementById('correlation').value = Number(income[2]).toFixed(4)
        var scatterContent1 = document.getElementById('scatterContent1');
        scatterContent1.innerHTML = '&nbsp;';
        $('#scatterContent1').append(' <canvas id="myChart" width="400" height="200"><canvas>');

        var ctx = document.getElementById('myChart').getContext('2d');

        var scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: scatterChartData8,
            options: {
                title: {
                    display: true,
                    text: 'Scatter Chart'
                },
            }
        });

    }



    $("#scatter-button1").text(selText);
});

});

// Bar chart

var barData = $.ajax({
    url:"http://admin:123qweasd@45.113.233.243:5984/bar_chart/52201fc49fc58b632904e8446202d9a5",
    type: "GET",
    dataType: "json",
    success: console.log("bar json successfully loaded from couchDB."),
    // to log in the couchdb account
    headers: { "Authorization": "Basic " + btoa("admin" + ":" + "123qweasd")},
    error: function (xhr) {
      alert(xhr.statusText)
    }
  }) 

// uses jquery when and done, as load geo json is async
$.when(barData).done(function() {
// pie chart
console.log(barData.responseJSON)
var ctx5 = document.getElementById("bar-chart").getContext("2d");

var melbourne_data = Object.values(barData.responseJSON["Melbourne"]);
var dockland_data = Object.values(barData.responseJSON["Docklands"]);
var southbank_data = Object.values(barData.responseJSON["Southbank"]);
var eastmelbourne_data = Object.values(barData.responseJSON["East Melbourne"]);
var kensington_data = Object.values(barData.responseJSON["Kensington"])


var data = {
    labels: ["Melbourne", "Docklands", "Southbank", "East Melbourne", "Kensington"],
    datasets: [
        {
            label: "Total tweets",
            backgroundColor: "#c45850",
            data: [melbourne_data[0],dockland_data[0],southbank_data[0],eastmelbourne_data[0],kensington_data[0]]
        },
        {
            label: "Positive tweets",
            backgroundColor: "#48d1cc",
            data: [melbourne_data[1],dockland_data[1],southbank_data[1],eastmelbourne_data[1],kensington_data[1]]
        },
        {
            label: "Negative tweets",
            backgroundColor: "#8e5ea2",
            data: [melbourne_data[2],dockland_data[2],southbank_data[2],eastmelbourne_data[2],kensington_data[2]]
        },
        {
            label: "Neural tweets",
            backgroundColor: "#3e95cd",
            data: [melbourne_data[3],dockland_data[3],southbank_data[3],eastmelbourne_data[3],kensington_data[3]]
        },
    ]
};

var myBarChart = new Chart(ctx5, {
    type: 'horizontalBar',
    data: data,
    options: {
        barValueSpacing: 20,
        scales: {
            yAxes: [{
                ticks: {
                    min: 0,
                }
            }]
        }
    }
});

});


var predictData = $.ajax({
    url:"http://admin:123qweasd@45.113.233.243:5984/predict/52201fc49fc58b632904e84462037f9e",
    type: "GET",
    dataType: "json",
    success: console.log("predict json successfully loaded from couchDB."),
    // to log in the couchdb account
    headers: { "Authorization": "Basic " + btoa("admin" + ":" + "123qweasd")},
    error: function (xhr) {
      alert(xhr.statusText)
    }
  }) 

$.when(predictData).done(function() {

    console.log("predict")
    console.log(predictData)
    var pca_means = Object.values(predictData.responseJSON["pca_means"]);
    var pc1 = Object.values(predictData.responseJSON["pc1_coefficients"]);
    var pc2 = Object.values(predictData.responseJSON["pc2_coefficients"]);
    var pc3 = Object.values(predictData.responseJSON["pc3_coefficients"]);
    var lr = Object.values(predictData.responseJSON["lr_coefficients"]);
    var lr_inter = 6.079509951139702;

    console.log("lr inter")
    console.log(lr_inter)

$("#calculate").click(function(e){
    e.preventDefault(); // cancel the link behaviour
    var factor1 = document.getElementById('factor1').value;
    var factor2 = document.getElementById('factor2').value;
    var factor3 = document.getElementById('factor3').value;
    var factor4 = document.getElementById('factor4').value;
    var factor5 = document.getElementById('factor5').value;
    var factor6 = document.getElementById('factor6').value;
    var factor7 = document.getElementById('factor7').value;
    var factor8 = document.getElementById('factor8').value;

    var pc1_val1 = (parseInt(factor1)-pca_means[0]) * pc1[0];
    var pc1_val2 = (parseInt(factor2)-pca_means[1]) * pc1[1];
    var pc1_val3 = (parseInt(factor3)-pca_means[2]) * pc1[2];
    var pc1_val4 = (parseInt(factor4)-pca_means[3]) * pc1[3];
    var pc1_val5 = (parseInt(factor5)-pca_means[4]) * pc1[4];
    var pc1_val6 = (parseInt(factor6)-pca_means[5]) * pc1[5];
    var pc1_val7 = (parseInt(factor7)-pca_means[6]) * pc1[6];
    var pc1_val8 = (parseInt(factor8)-pca_means[7]) * pc1[7];
    var pc1_val_sum = pc1_val1+pc1_val2+pc1_val3+pc1_val4+pc1_val5+pc1_val6+pc1_val7+pc1_val8;

    var pc2_val1 = (parseInt(factor1)-pca_means[0]) * pc2[0];
    var pc2_val2 = (parseInt(factor2)-pca_means[1]) * pc2[1];
    var pc2_val3 = (parseInt(factor3)-pca_means[2]) * pc2[2];
    var pc2_val4 = (parseInt(factor4)-pca_means[3]) * pc2[3];
    var pc2_val5 = (parseInt(factor5)-pca_means[4]) * pc2[4];
    var pc2_val6 = (parseInt(factor6)-pca_means[5]) * pc2[5];
    var pc2_val7 = (parseInt(factor7)-pca_means[6]) * pc2[6];
    var pc2_val8 = (parseInt(factor8)-pca_means[7]) * pc2[7];
    var pc2_val_sum = pc2_val1+pc2_val2+pc2_val3+pc2_val4+pc2_val5+pc2_val6+pc2_val7+pc2_val8;

    var pc3_val1 = (parseInt(factor1)-pca_means[0]) * pc3[0];
    var pc3_val2 = (parseInt(factor2)-pca_means[1]) * pc3[1];
    var pc3_val3 = (parseInt(factor3)-pca_means[2]) * pc3[2];
    var pc3_val4 = (parseInt(factor4)-pca_means[3]) * pc3[3];
    var pc3_val5 = (parseInt(factor5)-pca_means[4]) * pc3[4];
    var pc3_val6 = (parseInt(factor6)-pca_means[5]) * pc3[5];
    var pc3_val7 = (parseInt(factor7)-pca_means[6]) * pc3[6];
    var pc3_val8 = (parseInt(factor8)-pca_means[7]) * pc3[7];
    var pc3_val_sum = pc3_val1+pc3_val2+pc3_val3+pc3_val4+pc3_val5+pc3_val6+pc3_val7+pc3_val8;

    var predict_result = (pc1_val_sum*lr[0]) + (pc2_val_sum*lr[1]) + (pc3_val_sum*lr[2]) + lr_inter;

    console.log(predict_result);
    document.getElementById('outcome').value = Number(predict_result).toFixed(4);
});

});