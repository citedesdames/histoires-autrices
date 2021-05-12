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

    let url_key = location.href.split("?key=")[1].replace(/%20/g,' ');
    console.log("nom : " + url_key);
    

    for (var i = 0; i < data1.length; i++) {
        if (data1[i]['Auteur ou autrice'] == url_key ) {
            //Get name of data and return as HTML element for the main h1 title
            console.log('yes');
            let h1_text = data1[i]['Auteur ou autrice'];
            document.getElementById("h1_title").innerHTML = h1_text;
            document.getElementById("author_title").innerHTML = h1_text;
        }
    }
});