/** Appel des dépendances et des packages externes */
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var dataLayer = require('./data/datalayer');
/* Initialisation : */
var app = express();

app.use(express.static(__dirname + '/')); //Dossier des données statics
app.use(morgan('dev')); //Rajoute des logs dans la console 
app.use(bodyParser.urlencoded({'extended':'true'})); 
app.use(bodyParser.json());
app.use(bodyParser.json({ type : 'application/vnd.api+json' })); //type de l'application

app.use('/', require('./route'));

//Utilisation du port 8080 :
dataLayer.init(function () {
    app.listen(8080);
});
//app.listen(8080);
console.log("on utilise le port 8080");