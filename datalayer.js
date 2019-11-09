var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://toto:3qdy5YVLmyfowxMJ@cluster0-952lh.mongodb.net/test?retryWrites=true&w=majority";

var client = new MongoClient(url, {useNewUrlParser: true});
//Password : 3qdy5YVLmyfowxMJ
var db;
ObjectId = require('mongodb').ObjectID;

var dataLayer = {

    init : function(cb){
        client.connect(function(err){
            if(err) throw err;
            db = client.db("ArxivApp");
            cb();
        });
    },

    getArticle : function(recherche,cb){
        db.collection("Article").find(recherche).toArray(function(err, docs){
            cb(docs);
        });
    },

    insertArticle : function(task, cb){
        db.collection("Article").insertOne(task, function(err,result){
            cb();
        });
    },


    deleteTask : function(id_task, cb){
        var myquery = { _id: ObjectId(id_task) };
        db.collection("listes").deleteOne(myquery, function(err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            cb();
        });
    },
}

module.exports = dataLayer;