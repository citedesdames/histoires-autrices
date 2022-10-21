// Use PapaParse to convert string to array of objects
// var data1 = Papa.parse(csvString, {
//     header: true,
//     encoding: "fr",
//     transform: function (h) {
//         return h.replace(',', '.')
//     },
//     dynamicTyping: true
// }).data;
let data1, desc;

loadMetadata();


//from Google Sheets
// Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vRBsW23Q4I427Tl_y7gcFIncVKMh5Xgk-QyTwXi8S7HO01atE23pXicffryr1dXSxkrQaxeTZsvyL2K/pub?gid=555683372&single=true&output=csv', {
//local
function loadMetadata() {
    Papa.parse('assets/data/desc.csv', {
        download: true,
        header: true,
        complete: function (results) {
            desc = results.data;
            //console.log(desc);
            loadDataSet(desc);
        }
    });
}

function loadDataSet(desc) {
    Papa.parse('assets/data/data1.csv', {
        download: true,
        header: true,
        complete: function (results) {
            data1 = results.data;
            // console.log(data1);
            loadData(desc, data1);
        }
    });
}

function loadData(desc, data1) {

    //Detect duplicates in array of objects into a new array
    function getUniqueListBy(arr, key) {
        return [...new Map(arr.map(item => [item[key], item])).values()]
    }

    let authorCount = {
        'f': [],
        'm': []
    };
    let autrice_noms = {
        'name': [],
        'id': []
    };

    let url_id = location.href.split("?id=")[1];
    let descText = "";
    let h1_text = "";

    // get database description and title
    for (let i = 0; i < desc.length; i++) {
        if (desc[i]["id"] == url_id) {
            descText = desc[i]["description"];
            h1_text = desc[i]["name"];
        }
    }
    //console.log(data1);

    //Counting number of female and male authors per year ================================================================
    let nbsPerYear = {};
    for (var i = 0; i < data1.length; i++) {
        if (data1[i]['dataset_id_FK'] == url_id) {

            if (!(data1[i]['year'] in nbsPerYear)) {
                nbsPerYear[data1[i]['year']] = [0, 0];
            }
            if (data1[i]['Genre'] == 'M') {
                nbsPerYear[data1[i]['year']][1]++;
            }
            if (data1[i]['Genre'] == 'F') {
                nbsPerYear[data1[i]['year']][0]++;
            }
        }
    }
    //console.log(nbsPerYear)

    //=================================================================

    // creating arrays for bar chart
    let years = Object.keys(nbsPerYear);
    let femalePerYear = [];
    let malePerYear = [];

    // for (let i=0; i<years.length; i++) {
    //     femalePerYear.push(nbsPerYear[years[i]][0])
    //     malePerYear.push(nbsPerYear[years[i]][1])
    // }

    for (const year in nbsPerYear) {
        femalePerYear.push(nbsPerYear[year][0])
        malePerYear.push(nbsPerYear[year][1])
    }

    //console.log(femalePerYear);

    //=================================================================
    // create array of decades 
    let decades = [];
    let femalePerDecade = [];
    let malePerDecade = [];

    function decadeMaker(year) {
        let firstYear = year - (year % 10);
        let lastYear = firstYear + 9;

        return `${firstYear} - ${lastYear}`;
    }

    for (let i = 0; i < years.length; i++) {
        let decade = decadeMaker(years[i]);
        if (decades[decades.length - 1] !== decade) {
            // creates new decade 
            decades.push(decade);
            femalePerDecade.push(femalePerYear[i]);
            malePerDecade.push(malePerYear[i]);
        } else {
            femalePerDecade[femalePerDecade.length - 1] += femalePerYear[i];
            malePerDecade[malePerDecade.length - 1] += malePerYear[i];
        }

    }

    //console.log(femalePerDecade);

    //=================================================================


    document.getElementById("heroDesc").innerHTML = descText;
    document.getElementById("h1_title").innerHTML = h1_text;

    //Count the number of female and male authors appearing and create array of objects from src files to generate the bubble chart
    let bubbleF = [];
    let bubbleM = [];
    for (var i = 0; i < data1.length; i++) {
        if (data1[i].Genre == "F" && data1[i]['dataset_id_FK'] == url_id) {
            bubbleFobject = {};

            authorCount['f'].push(data1[i]["author_id_FK"] + ";" + data1[i]["year"]);
            autrice_noms['name'].push(data1[i]["Nom normalisé"]);
            autrice_noms['id'].push(data1[i]["author_id_FK"]);

            // Create an array of objects fot the bubble chart (female)
            bubbleFobject.src = data1[i]["src"];
            bubbleFobject.name = data1[i]["Nom normalisé"];
            bubbleFobject.details = data1[i]["details"];
            bubbleFobject.year = data1[i]["year"];
            bubbleF.push(bubbleFobject);
        } else if (data1[i].Genre == "M" && data1[i]['dataset_id_FK'] == url_id) {
            authorCount['m'].push(data1[i]["author_id_FK"] + ";" + data1[i]["year"]);

            bubbleMobject = {};
            bubbleMobject.src = data1[i]["src"];
            bubbleMobject.name = data1[i]["Nom normalisé"];
            bubbleMobject.details = data1[i]["details"];
            bubbleMobject.year = data1[i]["year"];
            bubbleM.push(bubbleMobject);
        }
    }

    //bubbleF & bubbleM : Detect duplicates and trim them into a new array
    /*
    let trimmedBubbleF = getUniqueListBy(bubbleF, 'name');
    let trimmedBubbleM = getUniqueListBy(bubbleM, 'name');
    */
    let trimmedBubbleF = bubbleF;
    let trimmedBubbleM = bubbleM;

    //console.log(trimmedBubbleM)


    //render bubbles (female authors)
    for (let i = 0; i < trimmedBubbleF.length; i++) {
        let newBubble = document.createElement("span");
        newBubble.classList.add("chart__bubble__column__dot");
        newBubble.innerHTML = `<a href="${trimmedBubbleF[i]['src']}"></a><span class="chart__bubble__column__dot__tooltip"><p>${trimmedBubbleF[i]['year']} - ${trimmedBubbleF[i]['details']}</p><p>${trimmedBubbleF[i]['name']}</p></span>`;
        document.getElementById("bubbleF").appendChild(newBubble);
    }

    //console.log("Render bubbles2")

    //render bubbles (male authors)
    for (let i = 0; i < trimmedBubbleM.length; i++) {
        let newBubble = document.createElement("span");
        newBubble.classList.add("chart__bubble__column__dot");
        newBubble.innerHTML = `<a href="${trimmedBubbleM[i]['src']}"></a><span class="chart__bubble__column__dot__tooltip"><p>${trimmedBubbleM[i]['year']} - ${trimmedBubbleM[i]['details']}</p><p>${trimmedBubbleM[i]['name']}</p></span>`;
        document.getElementById("bubbleM").appendChild(newBubble);
    }

    //console.log("Duplicates")

    //authorCount : Detect duplicates and trim them into a new array
    let trimmedCount = {
        'f': [],
        'm': []
    };

    for (let i = 0; i < authorCount['f'].length; i++) {
        if (trimmedCount['f'].indexOf(authorCount['f'][i]) === -1) {
            trimmedCount['f'].push(authorCount['f'][i]);
        }
    }

    for (let i = 0; i < authorCount['m'].length; i++) {
        if (trimmedCount['m'].indexOf(authorCount['m'][i]) === -1) {
            trimmedCount['m'].push(authorCount['m'][i]);
        }
    }

    let autriceLinks = {
        'name': [],
        'id': []
    };
    let autriceMap = {};


    //Find and show links to female authors
    for (let i = 0; i < autrice_noms['name'].length; i++) {

        autriceLinks['name'].push(autrice_noms['name'][i]);
        autriceLinks['id'].push(autrice_noms['id'][i]);

    }

    //console.log(autrice_noms)
    //Count female authors appearing to use for word cloud
    autriceLinks['name'].forEach(function (x) {
        autriceMap[x] = (autriceMap[x] || 0) + 1;
    });

    //sort by alphabetical order

    let alpha_data = [];

    for (let i = 0; i < autrice_noms['name'].length; i++) {
        alpha_data[i] = {
            name: autrice_noms['name'][i],
            id: autrice_noms['id'][i]
        };
    }

    alpha_data.sort((a, b) => {
        let fa = a.name.toLowerCase(),
            fb = b.name.toLowerCase();

        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    });

    let sorted_data = getUniqueListBy(alpha_data, 'name');

    //Show links to female authors
    let autrice_nom_anchor = document.getElementById("autrice_nom");


    for (let i = 0; i < sorted_data.length; i++) {
        let wordcloud_size = Math.ceil(10 * Math.log(autriceMap[sorted_data[i].name]) + 12);
        autrice_nom_anchor.innerHTML += `<a class="data__chart__text__link" style="color: rgb(${colorSize(4.5*wordcloud_size)},${colorSize(4.5*wordcloud_size)},${colorSize(4.5*wordcloud_size)}) !important;font-size: ${wordcloud_size}px" href="author.html?key=${sorted_data[i].id}">${sorted_data[i].name.replace(/ /ig,"&nbsp;")}</a> `;
        // .replace(/ /ig,"&nbsp;")
    }
   

    //data for pie chart 
    data = {
        datasets: [{
            data: [authorCount['m'].length, authorCount['f'].length,],//[trimmedCount['m'].length, trimmedCount['f'].length],
            backgroundColor: ["#f1dfd1", "#cca269"]
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Auteurs',
            'Autrices'
        ],

    };

    let barchartHeight = document.getElementById("barChart").style.height = (10 + 2 * years.length) + 'vh';

    let barchartHeightDecade = document.getElementById("barChartDecade").style.height = (10 + 2 * decades.length) + 'vh';

    if (decades.length <= 1) {
        document.getElementById('barChartDecade').style.display = "none";
        document.getElementById('decadeText').style.display = "none";
    }

    //Generate a pie chart with chart.js 
    var ctx = document.getElementById("pieChart").getContext('2d');
    Chart.register(ChartjsPluginStacked100.default);
    Chart.register(ChartDataLabels);


    var chart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: '20pt'
                        }
                    }
                },
                title: {
                    display: false
                },
                datasource: {
                    url: '/assets/data/data1.csv'
                },
                datalabels: {
                    formatter: (value, ctx) => {
                        let sum = 0;
                        let dataArr = ctx.chart.data.datasets[0].data;
                        dataArr.map(data => {
                            sum += data;
                        });
                        let percentage = (value * 100 / sum).toFixed(2) + "%";
                        return percentage;
                    },
                    color: '#000',
                    font: {
                        weight: 'bold',
                        size: 24
                    },
                }
            }
        }
    });


    // Generate horizontal bar charts with chart.js

    // percentages for females authors
    let barResYearF = [];
    let barResYearM = [];

    for (let i = 0; i < years.length; i++) {
        let yearTotal = femalePerYear[i] + malePerYear[i];
        //barResYearF.push((Math.round((femalePerYear[i] * 100) / yearTotal)*10)/10);
        //barResYearM.push(100-(Math.round((femalePerYear[i] * 100) / yearTotal)*10)/10);
        barResYearF.push(femalePerYear[i]);
        barResYearM.push(malePerYear[i]);
    }

    let barResDecadeF = [];
    let barResDecadeM = [];

    for (let i = 0; i < decades.length; i++) {
        let decadeTotal = femalePerDecade[i] + malePerDecade[i];
        //barResDecadeF.push((Math.round((femalePerDecade[i] * 100) / decadeTotal)*10)/10);
        //barResDecadeM.push(100-(Math.round((femalePerDecade[i] * 100) / decadeTotal)*10)/10);
        barResDecadeF.push(femalePerDecade[i]);
        barResDecadeM.push(malePerDecade[i]);
    }


    const data2 = {
        labels: years,
        datasets: [{
                label: 'Autrices',
                data: barResYearF,
                backgroundColor: '#cca269',
                stack: 's0'
            },
            {
                label: 'Auteurs',
                data: barResYearM,
                backgroundColor: '#f1dfd1',
                stack: 's0'
            }
        ]
    };

    const data3 = {
        labels: decades,
        datasets: [{
                label: 'Autrices',
                data: barResDecadeF,
                backgroundColor: '#cca269',
                stack: 's0'
            },
            {
                label: 'Auteurs',
                data: barResDecadeM,
                backgroundColor: '#f1dfd1',
                stack: 's0'
            }
        ]
    };

    var ctx2 = document.getElementById("barChart").getContext('2d');
    var chart2 = new Chart(ctx2, {
        type: 'bar',
        data: data2,
        options: {
            maintainAspectRatio: false,
            indexAxis: "y",
            plugins: {
                stacked100: {
                    enable: true
                },
                legend: {
                    labels: {
                        font: {
                            size: '16pt'
                        }
                    }
                },
                title: {
                    display: false
                }
            },
            responsive: true,
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true
                }
            }
        }
    });

    var ctx3 = document.getElementById("barChartDecade").getContext('2d');
    var chart3 = new Chart(ctx3, {
        type: 'bar',
        data: data3,
        options: {
            maintainAspectRatio: false,
            indexAxis: "y",
            plugins: {
                stacked100: {
                    enable: true
                },
                legend: {
                    labels: {
                        font: {
                            size: '16pt'
                        }
                    }
                },
                title: {
                    display: false
                },
            },
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            }
        }
    });





    //horizontal bar chart with apexchart
    // var options = {
    //     series: [{
    //         name: 'Marine Sprite',
    //         data: [4444, 55, 41, 37, 22, 43, 21]
    //     }, {
    //         name: 'Striking Calf',
    //         data: [53, 32, 33, 52, 13, 43, 32]
    //     }, {
    //         name: 'Tank Picture',
    //         data: [12, 17, 11, 9, 15, 11, 20]
    //     }, {
    //         name: 'Bucket Slope',
    //         data: [9, 7, 5, 8, 6, 9, 4]
    //     }, {
    //         name: 'Reborn Kid',
    //         data: [25, 12, 19, 32, 25, 24, 10]
    //     }],
    //     chart: {
    //         type: 'bar',
    //         height: 350,
    //         stacked: true,
    //         stackType: '100%'
    //     },
    //     plotOptions: {
    //         bar: {
    //             horizontal: true,
    //         },
    //     },
    //     stroke: {
    //         width: 1,
    //         colors: ['#fff']
    //     },
    //     title: {
    //         text: '100% Stacked Bar'
    //     },
    //     xaxis: {
    //         categories: [2008, 2009, 2010, 2011, 2012, 2013, 2014],
    //     },
    //     tooltip: {
    //         y: {
    //             formatter: function (val) {
    //                 return val + "K"
    //             }
    //         }
    //     },
    //     fill: {
    //         opacity: 1

    //     },
    //     legend: {
    //         position: 'top',
    //         horizontalAlign: 'left',
    //         offsetX: 40
    //     }
    // };

    // var chart = new ApexCharts(document.querySelector("#chart"), options);
    // chart.render();

    function colorSize(wordcloud_size) {
        if (wordcloud_size > 160) {
            return 160;
        } else {
            return wordcloud_size;
        }
    }
}

$(window).on("load", function () {
    $(".loader").fadeOut("slow");
    $("body").css("overflow", "visible");
    $("#menuButton").click(function () {
        //console.log("Clicked on menu button");
        $("#navList").toggle();
        // transform", "translate3d(-100px,0, 0)"
    });
});