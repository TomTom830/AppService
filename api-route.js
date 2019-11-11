var router = require('express').Router();
const http = require('http');
var convert = require('xml-js');
var dataLayer = require('./datalayer');

//Récupère un fichier / et l'envoi à index.html
router.get('/', function(req, res) {
    res.sendFile(__dirname+'/index.html');
});


router.get('/recherche_auteur/:entree', function (req, res) {
    console.log("je cherche " + req.params.entree);

    http.get("http://export.arxiv.org/api/query?search_query=au:"+req.params.entree, function (response) {
        xml_data = '';
        response.on('data', function (d) {
            xml_data = xml_data + d;
        });
        response.on('end', function send_json_data() {
            // console.log("recu xml : \n"+xml_data);
            var data_to_send = {};
            var json_string_data = convert.xml2json(xml_data, {compact: true, spaces: 4});
            var json_data = JSON.parse(json_string_data);

            //console.log("recu json : \n"+json_string_data);
            data_to_send = json_data.feed.entry;

            for (var i in data_to_send) {
                // console.log("il y a le titre : "+data_to_send[i].title._text);

                var auteurs;
                if (data_to_send[i].author instanceof Array) {
                    //console.log("auteur est un tableau");
                    auteurs = [];
                    for (j in data_to_send[i].author) {
                        auteurs[j] = data_to_send[i].author[j].name._text;
                        console.log("on rentre dans tableau " + auteurs[j]);
                    }
                } else {
                    auteurs = data_to_send[i].author.name._text;
                    console.log("on rentre " + auteurs[j]);
                }
                //var authors[]
                var article = {
                    titre: data_to_send[i].title._text,
                    auteur: auteurs,
                    sommaire: data_to_send[i].summary._text
                };

                dataLayer.insertArticle(article, function () {
                    console.log("article inséré");
                });
            }
            res.send(data_to_send);
        });
    });
});


module.exports = router;