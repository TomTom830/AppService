var router = require('express').Router();
const http = require('http');
var convert = require('xml-js');
var dataLayer = require('./datalayer');

//Récupère un fichier / et l'envoi à index.html
router.get('/', function(req, res) {
    res.sendFile(__dirname+'/index.html');
});

//prend en charge une recherche sur l'API arxiv en solicitant l'API
router.get('/recherche_arxiv/:entree', function (req, res) {
    console.log("je cherche arxiv " + req.params.entree);
    var data_r = {};

    http.get("http://localhost:3000/author/arxiv/"+req.params.entree,function (response) {
        response.on('data', function (d) {
            data_r = d;
        });
        response.on('end', function() {
            //Converti le json string reçu en json object
            var data_to_send = JSON.parse(data_r);
            //On insere article apres article dans la BDD
            for (var i in data_to_send) {
                doIt(data_to_send[i]);
            }
            res.send(data_r);
        });
    });
});

//prend en charge une recherche sur l'API HAL en solicitant l'API
router.get('/recherche_hal/:entree', function (req, res) {
    console.log("je cherche HAL " + req.params.entree);    
    http.get("http://localhost:3000/author/hal/"+req.params.entree,function (response) {
        response.on('data', function (d) {
            data_r = d;
        });
        response.on('end', function(){
            //Converti le json string reçu en json object
            var data_to_send = JSON.parse(data_r);
            //On insere article apres article dans la BDD
            for (var i in data_to_send) {
                doIt(data_to_send[i]);
            }
            res.send(data_r);
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