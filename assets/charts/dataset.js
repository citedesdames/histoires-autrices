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

    let autrice = 0;
    let auteur = 0; 
    let autrice_noms = [];

    // console.log(data1);

    let url_id = location.href.split("?id=")[1];
    console.log(url_id);
    // console.log(data1[1]['Jeu de données']);
    
    //Count the number of female and male authors appearing 
    for (var i = 0; i < size; i++) {
        if (data1[i].Genre == "F" && data1[i]['dataset_id_FK'] == url_id ) {
            autrice++;
            autrice_noms.push(data1[i]["Auteur ou autrice"]);
            //Get name of data and return as HTML element for the main h1 title
            let h1_text = data1[i]['Jeu de données'];
            document.getElementById("h1_title").innerHTML = h1_text;
        } else if (data1[i].Genre == "M" && data1[i]['dataset_id_FK'] == url_id ) {
            auteur++;
            //Get name of data and return as HTML element for the main h1 title
            let h1_text = data1[i]['Jeu de données'];
            document.getElementById("h1_title").innerHTML = h1_text;
        }       

    }
    // console.log(autrice);
    // console.log(auteur);
    // console.log(autrice_noms);

    let autriceLinks = [];
    let autriceMap = {};

    //Find and show links to female authors
    for (let i = 0; i < autrice_noms.length; i++){

        autriceLinks.push(`${autrice_noms[i]}`);

    }
    
    //Count female authors appearing to use for word cloud
    autriceLinks.forEach(function(x) { autriceMap[x] = (autriceMap[x] || 0)+1; });


    //Detect duplicates into a new array
    let values_already_seen = [];
    
    for (let i = 0; i< autrice_noms.length; i++) {
        if ( values_already_seen.indexOf(autriceLinks[i]) === -1) {
            values_already_seen.push(autriceLinks[i]);
        }
    }



    //Show links to female authors
    let autrice_nom_anchor = document.getElementById("autrice_nom");
    
    for (let i = 0; i < values_already_seen.length; i++) {
        let wordcloud_size = Math.ceil(5*Math.log(autriceMap[values_already_seen[i]])+16);
        //Replace space with non-breakable space
        // values_already_seen[i].replace('',/&nbsp;/g);
        autrice_nom_anchor.innerHTML += `<a class="data__chart__text__link" style="font-size: ${wordcloud_size}px" href="/authors/authors.html?key=${values_already_seen[i]}">${values_already_seen[i]} </a>`;
    }



    //data for pie chart 
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