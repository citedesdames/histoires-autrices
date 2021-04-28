$.get('/assets/data/data1.csv', function (csvString) {

    // Use PapaParse to convert string to array of objects
    var data1 = Papa.parse(csvString, {
        header: true,
        encoding: "fr",
        transform: function (h) {
            return h.replace(',', '.')
        },
        dynamicTyping: true
    }).data;

    let size = data1.length;

    // ================================COLLEGE
    let autrice = 0;
    let auteur = 0; 
    let autrice_noms = [];

    console.log(data1);

    //Count the number of female and male authors appearing in French 'collège' school programmes
    for (var i = 0; i < size; i++) {
        if (data1[i].Genre == "F" && data1[i]['Jeu de données'] == "Programmes du collège" ) {
            autrice++;
            autrice_noms.push(data1[i]["Auteur ou autrice"]);
        } else if (data1[i].Genre == "M" && data1[i]['Jeu de données'] == "Programmes du collège" ) {
            auteur++;
        }       
    }
    // console.log(autrice);
    // console.log(auteur);
    // console.log(autrice_noms);

    let autriceLinks = [];

    //Find and show links to female authors - Programme de collège
    for (var i = 0; i < autrice_noms.length; i++){
        autriceLinks.push(`<a class="data__chart__text__link" href="#"> ${autrice_noms[i]}</a>`);
    }
    document.getElementById("autrice_nom").innerHTML = autriceLinks;

    //data for pie chart - Programme de collège
    data = {
        datasets: [{
            data: [ auteur, autrice],
            backgroundColor: ["#f1dfd1", "#cca269"]
        }],
    
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Auteur',
            'Autrice'
        ],

    };

    //Generate a pie chart with chart.js - Programme de collège
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
                        let percentage = (value*100 / sum).toFixed(2)+"%";
                        return percentage;
                    },
                    color: '#000',
                    font: { weight: 'bold', size: 24},
                }
            }
        }
    });


    

    

});