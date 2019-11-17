var AppArxiv = angular.module('AppArxiv', []);

//$http variable pour faire les requtes entre client et serveur
function mainController($scope, $http) {
    $scope.res_rech = {};
    $scope.entree_recherche = {};
    $scope.entree_auteur = {};
    $scope.checkbox = {};
    $scope.res_rech_hal = {};

    //rajout d'une donnée (appel à la fonction post dans server.js)
    $scope.recherche = function() {
        $http.get('/recherche_arxiv/'+$scope.entree_recherche.text)
            .success(function(data) {
                // console.log('OK : ' + typeof(data)+ "\nContent  : "+data);
                $scope.res_rech =data;
            })
            .error(function(data) {
                console.log('Error : ' + data);
            });

        $http.get('/recherche_hal/'+$scope.entree_recherche.text)
        .success(function(data) {
            console.log('OK : ' + typeof(data)+ "\nContent  : "+data);
            //$scope.res_rech =data;
            $scope.res_rech_hal =data.response.docs;
        })
        .error(function(data) {
            console.log('Error : ' + data);
        });
    };

    //rajout d'une donnée (appel à la fonction delete dans server.js)
    $scope.deleteTodo = function(id) {
        var rrq = '/delTask/' + id;
        console.log("dans la requete : "+ rrq )
        $http.delete(rrq)
            .success(function(data) {
                $scope.laliste = data;
                console.log($scope.laliste+"/ et data:"+data);
            })
            .error(function(data) {
                console.log('Error : ' + data);
            }); 
    };

    $scope.updateTodo = function(id) {
        var data_sent={text: $scope.modifData[id]};
        $scope.modifData[id] = [];

        console.log("Client envoi -> "+data_sent.text);
        $http.put('/updTask/'  + id, data_sent)
        .success(function(data){
            $scope.laliste = data;
        })
        .error(function(data){
            console.log('Error : ' + data);
        });
    };
}