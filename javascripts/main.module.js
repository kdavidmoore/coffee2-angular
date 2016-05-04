var coffeeApp = angular.module('coffeeApp', ['ngRoute']);
var apiUrl = 'http://localhost:3000';

coffeeApp.config(function($routeProvider){
	$routeProvider.when('/', {
		templateUrl: 'pages/main.html',
		controller: 'mainController'
	});
	$routeProvider.when('/register', {
		templateUrl: 'pages/register.html',
		controller: 'mainController'
	});
	$routeProvider.when('/login', {
		templateUrl: 'pages/login.html',
		controller: 'mainController'
	});
	$routeProvider.when('/options', {
		templateUrl: 'pages/options.html',
		controller: 'mainController'
	});
	$routeProvider.otherwise({
		redirectTo: '/'
	});
});


coffeeApp.controller('mainController', function($scope, $http){	
	$http({
		method: 'GET',
		url: apiUrl
	}).then(function successCallback(response){
		console.log(response);	
	}, function errorCallback(status){
		console.log(status);
	});
});
