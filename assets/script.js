function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}    

docReady(function() {
    document.getElementById('siteBtn').disabled = true;
    var width = $(window).width();
    if (width > 768){
        $("#hero__img").animate({right: -200,opacity:0.3}, 1000);
    }

    $( "#menuButton" ).click(function() {
        console.log("Clicked on menu button");
        $("#navList").toggle();
        // transform", "translate3d(-100px,0, 0)"
     });
});

function showSite() {
    var x = document.getElementById("site");
    var y = document.getElementById("visiautrices");
    document.getElementById('visiautricesBtn').disabled = false;

    if (x.style.display === "none") {
        x.style.display = "block";
        y.style.display = "none";
        document.getElementById('siteBtn').disabled = true;
    } else {
        x.style.display = "none";
    }
}

function showVisiautrices() {
    var x = document.getElementById("visiautrices");
    var y = document.getElementById("site");
    document.getElementById('siteBtn').disabled = false;

    if (x.style.display === "none") {
        x.style.display = "block";
        y.style.display = "none";
        document.getElementById('visiautricesBtn').disabled = true;
    } else {
        x.style.display = "none";
    }
}

$.get('assets/data/data1.csv', function (csvString) {

    // Use PapaParse to convert string to array of objects
    var data1 = Papa.parse(csvString, {
        header: true,
        encoding: "fr",
        transform: function (h) {
            return h.replace(',', '.')
        },
        dynamicTyping: true
    }).data;

    let datasetLinks = {'name':[],'id':[]};

    //find all datasets
    for ( let i = 0; i < data1.length; i++){
        datasetLinks['name'].push(data1[i]['Jeu de données']);
        datasetLinks['id'].push(data1[i]['dataset_id_FK']);
    }

    //Detect duplicates and null values and push the remainder into a new array
    let newdatasetLinks = {'name':[],'id':[]};

    for (let i = 0; i< datasetLinks['name'].length; i++) {
        if ( newdatasetLinks['name'].indexOf(datasetLinks['name'][i]) === -1 && datasetLinks['name'][i] != null) {
            newdatasetLinks['name'].push(datasetLinks['name'][i]);
            newdatasetLinks['id'].push(datasetLinks['id'][i]);
        }
    }

    //render dataset links
    let flexLinks = document.getElementById('flexLinks');
    for (let i = 0; i< newdatasetLinks['name'].length; i++) {
        flexLinks.innerHTML += `<li class="une__flex__item"><a href="dataset/dataset.html?id=${newdatasetLinks['id'][i]}">${newdatasetLinks['name'][i]}</a></li>`;
    }

});


