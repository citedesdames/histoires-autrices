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
    console.log(descText);

    document.getElementById("heroDesc").innerHTML = descText;
    document.getElementById("h1_title").innerHTML = h1_text;

    //Count the number of female and male authors appearing 
    for (var i = 0; i < data1.length; i++) {
        if (data1[i].Genre == "F" && data1[i]['dataset_id_FK'] == url_id) {
            authorCount['f'].push(data1[i]["author_id_FK"]);
            autrice_noms['name'].push(data1[i]["Nom normalisé"]);
            autrice_noms['id'].push(data1[i]["author_id_FK"]);
        } else if (data1[i].Genre == "M" && data1[i]['dataset_id_FK'] == url_id) {
            authorCount['m'].push(data1[i]["author_id_FK"]);
        }
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

    //Detect duplicates into a new array
    function getUniqueListBy(arr, key) {
        return [...new Map(arr.map(item => [item[key], item])).values()]
    }
    let sorted_data = getUniqueListBy(alpha_data, 'name');

    //Show links to female authors
    let autrice_nom_anchor = document.getElementById("autrice_nom");


    for (let i = 0; i < sorted_data.length; i++) {
        let wordcloud_size = Math.ceil(10 * Math.log(autriceMap[sorted_data[i].name]) + 12);
        //Replace space with non-breakable space
        // values_already_seen[i].replace('',/&nbsp;/g);
        autrice_nom_anchor.innerHTML += `<a class="data__chart__text__link" style="color: rgb(${colorSize(4.5*wordcloud_size)},${colorSize(4.5*wordcloud_size)},${colorSize(4.5*wordcloud_size)}) !important;font-size: ${wordcloud_size}px" href="../authors/authors.html?key=${sorted_data[i].id}">${sorted_data[i].name} </a>`;
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
    
    const DATA_COUNT = 7;
    const NUMBER_CFG = {
        count: DATA_COUNT,
        min: 0,
        max: 100
    };

    const labels = Utils.months({
        count: 7
    });
    const data2 = {
        labels: labels,
        datasets: [{
                label: 'Dataset 1',
                data: Utils.numbers(NUMBER_CFG),
                backgroundColor: Utils.CHART_COLORS.red,
            },
            {
                label: 'Dataset 2',
                data: Utils.numbers(NUMBER_CFG),
                backgroundColor: Utils.CHART_COLORS.blue,
            },
            {
                label: 'Dataset 3',
                data: Utils.numbers(NUMBER_CFG),
                backgroundColor: Utils.CHART_COLORS.green,
            },
        ]
    };

    var ctx2 = document.getElementById("barChart").getContext('2d');
    var chart2 = new Chart(ctx2, {
        type: 'bar',
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
});