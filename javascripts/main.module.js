var coffeeApp = angular.module('coffeeApp', ['ngRoute']);

coffeeApp.config(function($routeProvider){
	$routeProvider.when('/', {
		templateUrl: 'pages/main.html',
		controller: 'mainController'
	});
	$routeProvider.otherwise({
		redirectTo: '/'
	});
});


coffeeApp.controller('mainController', function($scope, $http){	
	console.log('we get signal');
});