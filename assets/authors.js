// $.get('../assets/data/data1.csv', function (csvString) {
let gallicaName = "";
let wikidataID = null;

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
Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vRBsW23Q4I427Tl_y7gcFIncVKMh5Xgk-QyTwXi8S7HO01atE23pXicffryr1dXSxkrQaxeTZsvyL2K/pub?gid=555683372&single=true&output=csv', {
    download: true,
    header: true,
    complete: function (results) {
        data1 = results.data;
        console.log(data1);
        loadData(data1);
    }
});

function loadData(data1) {
    let url_key = location.href.split("?key=")[1];

    // console.log("id : " + url_key);

    let datasetLinks = {
        'dataset': [],
        'id': []
    };
    for (var i = 0; i < data1.length; i++) {
        if (data1[i]['author_id_FK'] == url_key) {
            //Get name of data and return as HTML element for the main h1 title
            let h1_text = data1[i]['Nom normalisé'];
            document.getElementById("h1_title").innerHTML = h1_text;
            document.getElementById("author_title").innerHTML = h1_text;

            //Get name of data to use later as Gallica identifier
            gallicaName = data1[i]['Nom normalisé'];

            //Get id_wikidata from csv
            wikidataID = data1[i]['id_wikidata'];

            //Get datasets where the author appears
            datasetLinks['dataset'].push(data1[i]['Jeu de données']);
            datasetLinks['id'].push(data1[i]['dataset_id_FK']);
        }

    }

    //Dataset links : Detect duplicates and trim them into a new array
    let trimmedValues = {
        'dataset': [],
        'id': []
    };

    for (let i = 0; i < datasetLinks['dataset'].length; i++) {
        if (trimmedValues['dataset'].indexOf(datasetLinks['dataset'][i]) === -1) {
            trimmedValues['dataset'].push(datasetLinks['dataset'][i]);
            trimmedValues['id'].push(datasetLinks['id'][i]);
        }
    }

    //Render dataset links
    for (let i = 0; i < trimmedValues['dataset'].length; i++) {
        datasetLink = `<li class="dataset__flex__item"><a href="../dataset/dataset.html?id=${trimmedValues['id'][i]}">${trimmedValues['dataset'][i]}</a></li>`;
        document.getElementById("datasetLinks").innerHTML += datasetLink;
    }
    console.log(gallicaName);

    let urlGallica = `https://data.bnf.fr/sparql?query=PREFIX%20dcterms:%20%3Chttp://purl.org/dc/terms/%3E%20%0APREFIX%20foaf:%20%3Chttp://xmlns.com/foaf/0.1/%3E%20%0APREFIX%20rdarelationships:%20%3Chttp://rdvocab.info/RDARelationshipsWEMI/%3E%20%0ASELECT%20?auteur%20?expression%20?manifestation%20?titreManifestation%20?dateManifestation%20?fichierGallica%20?imgGallica%0AWHERE%20%7B%0A?auteur%20foaf:name%20%22${gallicaName}%22.%0A?expression%20dcterms:contributor%20?auteur.%20%0A?manifestation%20dcterms:date%20?dateManifestation.%20%0A?manifestation%20dcterms:title%20?titreManifestation.%20%0A?manifestation%20rdarelationships:expressionManifested%20?expression.%20%0A?manifestation%20rdarelationships:electronicReproduction%20?fichierGallica.%20%0A%7D%20%0AORDER%20BY%20ASC(?dateManifestation)%0A&format=application/json`;

    // Gallica JSON data
    $.getJSON(urlGallica, function (dataGallica) {
        // JSON result in `dataGallica` variable
        let tbGallica = {
            'title': [],
            'thumbnail': [],
            'link': []
        };
        for (let i = 0; i < dataGallica['results']['bindings'].length; i++) {
            // if (dataGallica['results']['bindings'][i]) {
            tbGallica['thumbnail'].push(dataGallica['results']['bindings'][i]['fichierGallica']['value'] + '/thumbnail');
            tbGallica['link'].push(dataGallica['results']['bindings'][i]['fichierGallica']['value']);
            tbGallica['title'].push(dataGallica['results']['bindings'][i]['titreManifestation']['value']);
            // }
        }

        //detect duplicates and push into new object
        let trimmedGallica = {
            'title': [],
            'thumbnail': [],
            'link': []
        };

        for (let i = 0; i < tbGallica['title'].length; i++) {
            if (trimmedGallica['title'].indexOf(tbGallica['title'][i]) === -1) {
                trimmedGallica['title'].push(tbGallica['title'][i]);
                trimmedGallica['link'].push(tbGallica['link'][i]);
                trimmedGallica['thumbnail'].push(tbGallica['thumbnail'][i]);
            }
        }

        //generate Gallica thumbnails
        for (let i = 0; i < trimmedGallica['title'].length; i++) {
            worksLink = `<li class="bnf__flex__item"><a href="${trimmedGallica['link'][i]}"><img class="bnf__flex__item__img" src="${trimmedGallica['thumbnail'][i]}.jpg">${trimmedGallica['title'][i]}</a></li>`;
            document.getElementById("worksLinks").innerHTML += worksLink;
        }
    });

    //Get author's portrait image from wikidata
    let dataGallica = [];
    class SPARQLQueryDispatcher {
        constructor(endpoint) {
            this.endpoint = endpoint;
        }

        query(sparqlQuery) {
            const fullUrl = this.endpoint + '?query=' + encodeURIComponent(sparqlQuery);
            const headers = {
                'Accept': 'application/sparql-results+json'
            };

            return fetch(fullUrl, {
                headers
            }).then(body => body.json());
        }
    }

    const endpointUrl = 'https://query.wikidata.org/sparql';
    const sparqlQuery = `#defaultView:Table
    SELECT ?item ?itemLabel ?pic ?picLabel WHERE {
      wd:Q${wikidataID} wdt:P18 ?pic.
      ?item wdt:P18 ?pic.
      SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }
      ?item wdt:P31 wd:Q5.
    }
    LIMIT 1`;


    //render wikidata image
    const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);
    queryDispatcher.query(sparqlQuery).then(res => document.getElementById("hero__img").innerHTML = `<img class="hero__portait" id="authorImg" alt="" src="${res['results']['bindings'][0]['pic']['value']}">`, );
}

$(window).on("load", function () {
    $(".loader").fadeOut("slow");
    $("body").css("overflow", "visible");
});