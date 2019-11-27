/*
 * Couche Data chargé de stoquer les documents des APIs dans une base de 
 * données mongo local ou en ligne suivant l'url conservée
*/
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/ArxivApp";
//var url = "mongodb+srv://toto:3qdy5YVLmyfowxMJ@cluster0-952lh.mongodb.net/ArxivApp?retryWrites=true&w=majority";
//Password : 3qdy5YVLmyfowxMJ


var client = new MongoClient(url, {useNewUrlParser: true});
var db;
ObjectId = require('mongodb').ObjectID;

var dataLayer = {
    //Connection a la BDD
    init : function(cb){
        client.connect(function(err){
            if(err) throw err;
            db = client.db("ArxivApp");
            cb();
        });
    },
    //Verifie si un article existe
    ArticleExist : function(projection, cb){
        var ret = db.collection("Article").findOne(projection, function(err, result) {
            if (err) throw err;
            cb(result);
        });
        return ret;
    },
    //Insere un article dans la BDD
    insertArticle : function(task, cb){
        db.collection("Article").insertOne(task, function(err,result){
            cb();
        });
    },
}

module.exports = dataLayer;