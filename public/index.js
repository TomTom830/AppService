var AppArxiv = angular.module('AppArxiv', []);

//$http variable pour faire les requtes entre client et serveur
function mainController($scope, $http) {
    $scope.res_rech = {};
    $scope.entree_recherche = {};
    $scope.entree_auteur = {};
    $scope.res_rech_hal = {};

    //fait une recherche Arxiv et HAL
    $scope.recherche = function() {
        $http.get('/recherche_arxiv/'+$scope.entree_recherche.text)
            .success(function(data) {
                $scope.res_rech =data;
            })
            .error(function(data) {
                console.log('Error : ' + data);
            });

        $http.get('/recherche_hal/'+$scope.entree_recherche.text)
        .success(function(data) {
            console.log('OK : ' + typeof(data)+ "\nContent  : "+data);
            $scope.res_rech_hal =data;
        })
        .error(function(data) {
            console.log('Error : ' + data);
        });
    };
}