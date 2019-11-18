var router = require('express').Router();
const http = require('http');
var convert = require('xml-js');
var dataLayer = require('./datalayer');

//Récupère un fichier / et l'envoi à index.html
router.get('/', function(req, res) {
    res.sendFile(__dirname+'/index.html');
});

//prend en charge une recherche sur l'API arxiv
router.get('/recherche_arxiv/:entree', function (req, res) {
    console.log("je cherche " + req.params.entree);
    var data_to_send = {};

    http.get("http://export.arxiv.org/api/query?search_query=au:"+req.params.entree, function (response) {
        xml_data = '';
        response.on('data', function (d) {
            xml_data = xml_data + d;
        });
        response.on('end', function send_json_data() {
            var json_string_data = convert.xml2json(xml_data, {compact: true, spaces: 4});
            var json_data = JSON.parse(json_string_data);

            data_to_send = json_data.feed.entry;
            //boucle qui insère les articles un par un
            for (var i in data_to_send) {

                var auteurs;
                if (data_to_send[i].author instanceof Array) {
                    auteurs = [];
                    for (j in data_to_send[i].author) {
                        auteurs[j] = data_to_send[i].author[j].name._text;
                    }
                } else {
                    auteurs = data_to_send[i].author.name._text;
                }
                
                var article = {
                    titre: data_to_send[i].title._text,
                    auteur: auteurs,
                    sommaire: data_to_send[i].summary._text
                };

                doIt(article);

            }
            res.send(data_to_send);
        });
    });
});

//prend en charge une recherche sur l'API HAL
router.get('/recherche_hal/:entree', function (req, res) {
        http.get("http://api.archives-ouvertes.fr/search/?q=authFullName_t:"+(req.params.entree)+
            "&wt=json&fl=en_abstract_s,title_s,authFullName_s&fq=en_abstract_s:[\"\" TO *]&rows=10", function(response) {
        received_data = '';
        response.on('data', function (d) {
            received_data = received_data + d;
        });
        response.on('end', function send_json_data() {
            var json_data = JSON.parse(received_data);
            //boucle qui insère les articles un par un
            for (var i in json_data.response.docs) {
                var auteurs = [];
                    for (j in json_data.response.docs[i].authFullName_s) {
                        auteurs[j] = json_data.response.docs[i].authFullName_s[j];
                    }            
                var article = {
                    titre: json_data.response.docs[i].title_s[0],
                    auteur: auteurs,
                    sommaire: json_data.response.docs[i].en_abstract_s[0]
                };
                doIt(article);
            }
            res.send(json_data);
        });
    });
});

//Fonction qui insère un article sur la BDD mais vérifie qu'il ne s'y trouve
//pas avant
async function doIt(article_insere){
    await dataLayer.ArticleExist(article_insere, async function(val_ret){
        if(val_ret == null){
            await dataLayer.insertArticle(article_insere, function () {
            });
        }
        else{
        }
    });
}

module.exports = router;