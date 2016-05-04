var coffeeApp = angular.module('coffeeApp', ['ngRoute']);
var apiUrl = 'http://localhost:3000';

coffeeApp.config(function($routeProvider){
	$routeProvider.when('/', {
		templateUrl: 'pages/main.html',
		controller: 'mainController'
	}).when('/register', {
		templateUrl: 'pages/register.html',
		controller: 'regController'
	}).when('/login', {
		templateUrl: 'pages/login.html',
		controller: 'loginController'
	}).when('/options', {
		templateUrl: 'pages/options.html',
		controller: 'optionsCtrl'
	}).otherwise({
		redirectTo: '/'
	});
});


coffeeApp.controller('mainController', function($scope){	

});

coffeeApp.controller('regController', function($scope, $http, $location){

	$scope.registerForm = function(){
		$http({
			method: 'POST',
			url: apiUrl + '/register',
			data: {
				username: $scope.username,
				password: $scope.password,
				password2: $scope.password2,
				email: $scope.email
			}
		}).then(function successCallback(response){
			if(response.data.failure == 'passwordMatch'){
				$scope.errorMessage = 'The passwords do not match.';
			} else if (response.data.success == 'added'){
				//redirect to login page
				$location.path('/login');
			}
		}, function errorCallback(status){
			console.log(status);
		});
	};
});


coffeeApp.controller('loginController', function($scope, $http, $location){
	
	$scope.loginForm = function(){
		$http({
			method: 'POST',
			url: apiUrl + '/login',
			data: {
				username: $scope.username,
				password: $scope.password
			}
		}).then(function successCallback(response){
			if(response.data.failure == 'noMatch'){
				$scope.errorMessage = 'The password entered does not match our records.';
			} else if (response.data.failure == 'noUser'){
				$scope.errorMessage = 'The username entered was not found.';
			} else if (response.data.success == 'match'){
				//redirect to options page
				$location.path('/options');
			}
		}, function errorCallback(status){
			console.log(status);
		});
	};
});


coffeeApp.controller('optionsCtrl', function($scope, $http, $location){
	
	//post the options to the server
});
