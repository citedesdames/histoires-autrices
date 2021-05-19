$.get('https://www.google.com/url?q=https://docs.google.com/spreadsheets/d/e/2PACX-1vRBsW23Q4I427Tl_y7gcFIncVKMh5Xgk-QyTwXi8S7HO01atE23pXicffryr1dXSxkrQaxeTZsvyL2K/pub?gid%3D555683372%26single%3Dtrue%26output%3Dcsv&sa=D&source=editors&ust=1621437274716000&usg=AOvVaw1U-UPobyuRwXk8019WDfG_', function (csvString) {

    // Use PapaParse to convert string to array of objects
    var data1 = Papa.parse(csvString, {
        header: true,
        encoding: "fr",
        transform: function (h) {
            return h.replace(',', '.')
        },
        dynamicTyping: true
    }).data;

    let authorCount = {'f':[],'m':[]};
    let autrice_noms = {'name':[],'id':[]};

    let url_id = location.href.split("?id=")[1];
    
    //Count the number of female and male authors appearing 
    for (var i = 0; i < data1.length; i++) {
        if (data1[i].Genre == "F" && data1[i]['dataset_id_FK'] == url_id ) {
            authorCount['f'].push(data1[i]["author_id_FK"]);
            autrice_noms['name'].push(data1[i]["Auteur ou autrice"]);
            autrice_noms['id'].push(data1[i]["author_id_FK"]);
            //Get name of data and return as HTML element for the main h1 title
            let h1_text = data1[i]['Jeu de données'];
            document.getElementById("h1_title").innerHTML = h1_text;
        } else if (data1[i].Genre == "M" && data1[i]['dataset_id_FK'] == url_id ) {
            authorCount['m'].push(data1[i]["author_id_FK"]);
            //Get name of data and return as HTML element for the main h1 title
            let h1_text = data1[i]['Jeu de données'];
            document.getElementById("h1_title").innerHTML = h1_text;
        }       
    }

    //authorCount : Detect duplicates and trim them into a new array
    let trimmedCount = {'f':[],'m':[]};

    for (let i = 0; i < authorCount['f'].length; i++) {
        if ( trimmedCount['f'].indexOf(authorCount['f'][i]) === -1) {
            trimmedCount['f'].push(authorCount['f'][i]);
        }
    }

    for (let i = 0; i < authorCount['m'].length; i++) {
        if ( trimmedCount['m'].indexOf(authorCount['m'][i]) === -1) {
            trimmedCount['m'].push(authorCount['m'][i]);
        }
    }

    let autriceLinks = {'name':[],'id':[]};
    let autriceMap = {};

    //Find and show links to female authors
    for (let i = 0; i < autrice_noms['name'].length; i++){

        autriceLinks['name'].push(autrice_noms['name'][i]);
        autriceLinks['id'].push(autrice_noms['id'][i]);

    }
    
    console.log(autrice_noms)
    //Count female authors appearing to use for word cloud
    autriceLinks['name'].forEach(function(x) { autriceMap[x] = (autriceMap[x] || 0)+1; });


    //Detect duplicates into a new array
    let values_already_seen = {'name':[],'id':[]};
    
    for (let i = 0; i< autrice_noms['name'].length; i++) {
        if ( values_already_seen['name'].indexOf(autriceLinks['name'][i]) === -1) {
            values_already_seen['name'].push(autriceLinks['name'][i]);
            values_already_seen['id'].push(autriceLinks['id'][i]);
        }
    }

    console.log(values_already_seen);

    //Show links to female authors
    let autrice_nom_anchor = document.getElementById("autrice_nom");
    
    // sorting by alphabetical order
    // values_already_seen;

    for (let i = 0; i < values_already_seen['name'].length; i++) {
        let wordcloud_size = Math.ceil(10*Math.log(autriceMap[values_already_seen['name'][i]])+12);
        //Replace space with non-breakable space
        // values_already_seen[i].replace('',/&nbsp;/g);
        autrice_nom_anchor.innerHTML += `<a class="data__chart__text__link" style="font-size: ${wordcloud_size}px" href="/authors/authors.html?key=${values_already_seen['id'][i]}">${values_already_seen['name'][i]} </a>`;
    }

    //data for pie chart 
    data = {
        datasets: [{
            data: [ trimmedCount['m'].length, trimmedCount['f'].length],
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