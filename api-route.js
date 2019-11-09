var router = require('express').Router();
const http = require('http');
var convert = require('xml-js');
var dataLayer = require('./datalayer');

//Récupère un fichier / et l'envoi à index.html
router.get('/', function(req, res) {
    res.sendFile(__dirname+'/index.html');
});

//dataLayer.init(function(){});

router.get('/recherche_auteur/:entree', function (req, res) {
    console.log("je cherche " + req.params.entree);

    http.get("http://export.arxiv.org/api/query?search_query=au:"+req.params.entree, function (response) {
        xml_data = '';
        response.on('data', function (d) {
            xml_data = xml_data + d;
        });
        response.on('end', function send_json_data(){
            // console.log("recu xml : \n"+xml_data);
            var data_to_send = {};
            var json_string_data = convert.xml2json(xml_data, {compact: true, spaces: 4});
            var json_data = JSON.parse(json_string_data);
        
            var task = {
                tache : "le texte xd",
                auteur : "le auteur mdr",
                heure : "le heure PTDR KO JRESPIRE PLUS JUI O SOL"
            };
            //dataLayer.insertArticle(task);

            data_to_send = json_data.feed.entry;
            res.send(data_to_send);
        });
    });
});

/*function send_json_data(xmldata,res){
    var data_to_send = {};
    console.log("xml -> "+xmldata);
    var json_string_data = convert.xml2json(xmldata, {compact: true, spaces: 4});
    var json_data = JSON.parse(json_string_data);

    data_to_send = json_data.feed.entry;
    res.send(data_to_send);
}*/

module.exports = router;