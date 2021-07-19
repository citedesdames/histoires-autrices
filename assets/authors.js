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
//from Google Sheets
// Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vRBsW23Q4I427Tl_y7gcFIncVKMh5Xgk-QyTwXi8S7HO01atE23pXicffryr1dXSxkrQaxeTZsvyL2K/pub?gid=555683372&single=true&output=csv', {
//local
Papa.parse('../assets/data/data1.csv', {
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

            //change HTML DOM page title dynamically
            document.title = h1_text + " - Histoires d'Autrices";

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
        datasetLink = `<li class="dataset__flex__item"><a href="../dataset/?id=${trimmedValues['id'][i]}">${trimmedValues['dataset'][i]}</a></li>`;
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

        const loadmore2 = document.querySelector('#loadmore2');
        let currentItems = 9;
        loadmore2.addEventListener('click', (e) => {
            const elementList = [...document.querySelectorAll('.bnf__flex__item')];
            document.getElementById('itemsLeftBNF').innerHTML = `${elementList.length} restants`;
            for (let i = currentItems; i < currentItems + 9; i++) {
                if (elementList[i]) {
                    elementList[i].style.display = 'block';
                }
            }
            currentItems += 9;
            let itemsLeft = elementList.length - currentItems;
            document.getElementById('itemsLeftBNF').innerHTML = `${itemsLeft} restants`;


            // Load more button will be hidden after list fully loaded
            if (currentItems >= elementList.length) {
                event.target.style.display = 'none';
            }
        })


        // Count the number of bnf gallica items
        let bnfNmb = document.getElementsByClassName("bnf__flex__item").length - currentItems;
        console.log(bnfNmb);

        document.getElementById('itemsLeftBNF').innerHTML = `${bnfNmb} restants`;
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

    //get wikidata image
    const endpointUrl = 'https://query.wikidata.org/sparql';
    const sparqlQuery = `#defaultView:Table
    SELECT ?item ?itemLabel ?pic ?picLabel ?birthdate ?birthdateLabel ?deathdate ?deathdateLabel WHERE {
      wd:Q${wikidataID} wdt:P18 ?pic.
      ?item wdt:P18 ?pic.
      SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }
      ?item wdt:P31 wd:Q5.
      OPTIONAL { ?item wdt:P569 ?birthdate. }
      OPTIONAL { ?item wdt:P570 ?deathdate. }
    }
    LIMIT 1`;

    //Generate in French name of months from wikidata (used with getMonth() function)
    var month = new Array();
    month[0] = "Janvier";
    month[1] = "Février";
    month[2] = "Mars";
    month[3] = "Avril";
    month[4] = "Mai";
    month[5] = "Juin";
    month[6] = "Juillet";
    month[7] = "Août";
    month[8] = "Septembre";
    month[9] = "Octobre";
    month[10] = "Novembre";
    month[11] = "Decembre";
    
    //render wikidata image
    const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);
    queryDispatcher.query(sparqlQuery).then(res => {
        console.log(res);
        document.getElementById("authorHero__img").innerHTML = `<img class="authorHero__portait" id="authorImg" alt="" src="${res['results']['bindings'][0]['pic']['value']}">`
        let dob = new Date(res['results']['bindings'][0]['birthdateLabel']['value']); 
        let dod = new Date(res['results']['bindings'][0]['deathdateLabel']['value']); 
        document.getElementById("dob").innerHTML = `Née le : ${dob.getDate()} ${month[dob.getMonth()]} ${dob.getFullYear()}<br>`
        document.getElementById("dod").innerHTML = `Décédée le : ${dod.getDate()} ${month[dod.getMonth()]} ${dod.getFullYear()}`
    });

    //get wikidata reading materials
    const sparqlQuery2 = `SELECT ?livre ?livreLabel ?pageLivre ?image ?image2 ?publisherLabel ?date ?placeLabel ?placeEdLabel WHERE {
        ?livre  wdt:P50 wd:Q${wikidataID};
          wdt:P31 wd:Q3331189.
        OPTIONAL { ?livre wdt:P18 ?image. }
        OPTIONAL { ?livre wdt:P996 ?image2. }
        OPTIONAL { ?livre wdt:P123 ?publisher. }
        OPTIONAL { ?livre wdt:P577 ?date. }
        OPTIONAL { ?livre wdt:P291 ?place. }
        ?pageLivre schema:about ?livre;
          schema:isPartOf <https://fr.wikisource.org/>.
        SERVICE wikibase:label { bd:serviceParam wikibase:language "fr". }
      }
      GROUP BY ?livre ?livreLabel ?pageLivre ?image ?image2 ?publisherLabel ?date ?placeLabel ?placeEdLabel`;


    const queryDispatcher2 = new SPARQLQueryDispatcher(endpointUrl);

    queryDispatcher2.query(sparqlQuery2).then(res => {
        console.log(res);
        let elem = document.getElementById("wikidataData");

        //if wikidata array is empty, hide
        if (res['results']['bindings'].length == 0) {
            console.log('yes');
            document.getElementsByClassName("wikidata")[0].style.display = 'none';
        } else {
            elem.insertAdjacentHTML("beforebegin", `<h2 class="wikidata__title">Les œuvres auxquelles elle a donné vie…</h2>
            <p class="wikidata__text">Plongez aussi dans ses œuvres sur Wikidata.</p>`);
        }


        for (let i = 0; i < res['results']['bindings'].length; i++) {
            elem.innerHTML += `<li class="wikidata__flex__item" ><a href="${res['results']['bindings'][i]['pageLivre']['value']}">${res['results']['bindings'][i]['livreLabel']['value'].replace(/ /,"&nbsp;")}</a></li> `;
        }


        // Load more button
        const loadmore = document.querySelector('#loadmore');
        let currentItems = 9;

        loadmore.addEventListener('click', (e) => {
            const elementList = [...document.querySelectorAll('.wikidata__flex__item')];
            console.log(elementList);
            for (let i = currentItems; i < currentItems + 9; i++) {
                if (elementList[i]) {
                    elementList[i].style.display = 'block';
                }
            }
            currentItems += 9;

            // Load more button will be hidden after list fully loaded
            if (currentItems >= elementList.length) {
                event.target.style.display = 'none';
            }
        })

    });

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