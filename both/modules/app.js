
console.log('here')

angular.module('ngAppStrictDemo', [])
    // Unlike BadController, GoodController1 and GoodController2 will not fail to be instantiated,
    // due to using explicit annotations using the array style and $inject property, respectively.
    .controller('GoodController1', ['$scope', function($scope) {
        $scope.a = 1;
        $scope.b = 2;
    }])
    .controller('GoodController2', GoodController2);
function GoodController2($scope) {
    $scope.name = 'World';
}
GoodController2.$inject = ['$scope'];