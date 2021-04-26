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
    // console.log(data1[0].Genre);

    var size = data1.length;
    console.log("Size :".size);
    let autrice = 0;
    let auteur = 0; 

    for (var i = 0; i < size; i++) {
        if (data1[i].Genre == "F") {
            autrice++;
        } else if (data1[i].Genre == "M") {
            auteur++;
        }       
    }
    
    console.log(autrice);
    console.log(auteur);
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

    var ctx = document.getElementById("mychart");
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
            }
        }
        }
    });

});

