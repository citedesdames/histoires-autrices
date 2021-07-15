// Use PapaParse to convert string to array of objects
// var data1 = Papa.parse(csvString, {
//     header: true,
//     encoding: "fr",
//     transform: function (h) {
//         return h.replace(',', '.')
//     },
//     dynamicTyping: true
// }).data;
var data1;
//from Google Sheets
// Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vRBsW23Q4I427Tl_y7gcFIncVKMh5Xgk-QyTwXi8S7HO01atE23pXicffryr1dXSxkrQaxeTZsvyL2K/pub?gid=555683372&single=true&output=csv', {
//local
Papa.parse('../assets/data/data1.csv', {
    download: true,
    header: true,
    complete: function (results) {
        data1 = results.data;
        // console.log(data1);
        loadData(desc, data1);
    }
});

var desc;
Papa.parse('../assets/data/desc.csv', {
    download: true,
    header: true,
    complete: function (results) {
        desc = results.data;
        // console.log(desc);
        loadData(desc, data1);
    }
});

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
    console.log(data1);

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
            bubbleF.push(bubbleFobject);
        } else if (data1[i].Genre == "M" && data1[i]['dataset_id_FK'] == url_id) {
            authorCount['m'].push(data1[i]["author_id_FK"] + ";" + data1[i]["year"]);

            bubbleMobject = {};
            bubbleMobject.src = data1[i]["src"];
            bubbleMobject.name = data1[i]["Nom normalisé"];
            bubbleMobject.details = data1[i]["details"];
            bubbleM.push(bubbleMobject);
        }
    }

    //bubbleF & bubbleM : Detect duplicates and trim them into a new array

    let trimmedBubbleF = getUniqueListBy(bubbleF, 'name');
    let trimmedBubbleM = getUniqueListBy(bubbleM, 'name');

    console.log(trimmedBubbleM)

    //render bubbles (female authors)
    for (let i = 0; i < trimmedBubbleF.length; i++) {
        document.getElementById("bubbleF").innerHTML += `<span class="chart__bubble__column__dot"><a href="${trimmedBubbleF[i]['src']}"></a><span class="chart__bubble__column__dot__tooltip"><p>${trimmedBubbleF[i]['details']}</p><p>${trimmedBubbleF[i]['name']}</p></span></span>`
    }

    //render bubbles (male authors)
    for (let i = 0; i < trimmedBubbleM.length; i++) {
        document.getElementById("bubbleM").innerHTML += `<span class="chart__bubble__column__dot"><a href="${trimmedBubbleM[i]['src']}"></a><span class="chart__bubble__column__dot__tooltip"><p>${trimmedBubbleM[i]['details']}</p><p>${trimmedBubbleM[i]['name']}</p></span></span>`
    }

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

    console.log(autrice_noms)
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
        autrice_nom_anchor.innerHTML += `<a class="data__chart__text__link" style="color: rgb(${colorSize(4.5*wordcloud_size)},${colorSize(4.5*wordcloud_size)},${colorSize(4.5*wordcloud_size)}) !important;font-size: ${wordcloud_size}px" href="../authors/?key=${sorted_data[i].id}">${sorted_data[i].name.replace(/ /ig,"&nbsp;")}</a> `;
        // .replace(/ /ig,"&nbsp;")
    }

    //data for pie chart 
    data = {
        datasets: [{
            data: [trimmedCount['m'].length, trimmedCount['f'].length],
            backgroundColor: ["#f1dfd1", "#cca269"]
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Auteur',
            'Autrice'
        ],

    };

    //Generate a pie chart with chart.js 
    var ctx = document.getElementById("mychart").getContext('2d');
    var chart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Chart.js Pie Chart'
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


    //horizontal bar chart with chart.js

    console.log(trimmedCount)

    let tot = trimmedCount['f'].length + trimmedCount['m'].length;
    let barRes = (trimmedCount['f'].length * 100) / tot;

    let years = [];
    for (let i = 0; i<trimmedCount['m'].length;i++) {

        years.push(trimmedCount['m'][i].split(';')[1]);
    }
    console.log(years)

    const data2 = {
        labels: ['YEAR XXXX'],
        datasets: [{
                label: 'Autrice',
                data: [barRes],
                backgroundColor: '#cca269',
                stack: 's0'
            },
            {
                label: 'Auteurs',
                data: [100 - barRes],
                backgroundColor: '#f1dfd1',
                stack: 's0'
            }
        ]
    };

    var ctx2 = document.getElementById("barChart").getContext('2d');
    var chart2 = new Chart(ctx2, {
        type: 'horizontalBar',
        data: data2,
        options: {
            indexAxis: "y",
            plugins: {
                title: {
                    display: true,
                    text: 'Chart.js Bar Chart - Stacked'
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
        console.log("Clicked on menu button");
        $("#navList").toggle();
        // transform", "translate3d(-100px,0, 0)"
    });
});