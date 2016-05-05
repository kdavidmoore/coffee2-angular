var coffeeApp = angular.module('coffeeApp', ['ngRoute', 'ngCookies']);
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
	}).when('/delivery', {
		templateUrl: 'pages/delivery.html',
		controller: 'deliveryCtrl'
	}).when('/checkout', {
		templateUrl: 'pages/checkout.html',
		controller: 'checkoutCtrl'
	}).when('/receipt', {
		templateUrl: 'pages/receipt.html',
		controller: 'receiptCtrl'
	}).otherwise({
		redirectTo: '/'
	});
});


coffeeApp.controller('mainController', function($scope){	
	console.log('this is the main controller.');
});


coffeeApp.controller('regController', function($scope, $http, $location, $cookies){

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
				// store the token and username inside cookies
				// potential security issue here
				$cookies.put('token', response.data.token);
				$cookies.put('username', $scope.username);
				//redirect to options page
				$location.path('/options');
			}
		}, function errorCallback(status){
			console.log(status);
		});
	};
});


coffeeApp.controller('loginController', function($scope, $http, $location, $cookies){
	
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
				// store the token and username inside cookies
				// potential security issue here
				$cookies.put('token', response.data.token);
				$cookies.put('username', $scope.username);
				//redirect to options page
				$location.path('/options');
			}
		}, function errorCallback(status){
			console.log(status);
		});
	};
});


coffeeApp.controller('optionsCtrl', function($scope, $http, $location, $cookies){

	$scope.frequencies = [
		{ 
			option: "Weekly"
		},
		{
			option: "Every other week"
		},
		{
			option: "Monthly"
		}
	];

	$scope.grinds = [
		{ 
			option: "Espresso"
		},
		{
			option: "Aeropress"
		},
		{
			option: "Drip"
		},
		{
			option: "Chemex/Clever"
		},
		{
			option: "French Press"
		}
	];

	$scope.optionsForm = function(){
		$http({
			method: 'POST',
			url: apiUrl + '/options',
			data: {
				token: $cookies.get('token')
			}
		}).then(function successCallback(response){
			if (response.data.failure == 'noToken'){
				// invalid token, so redirect to login page
				$location.path('/login');
			} else if (success = 'tokenMatch') {
				// put the options info into cookies for temporary storage
				$cookies.put('grindType', $scope.grindType);
				
				// etc.

				//redirect to delivery page
				$location.path('/delivery');
			}
		}, function errorCallback(status){
			console.log(status);
		});
	};
});


coffeeApp.controller('deliveryCtrl', function($scope, $http, $location, $cookies){

	$scope.states = usStates;

	$scope.deliveryForm = function(){
			$http({
			method: 'POST',
			url: apiUrl + '/delivery',
			data: {
				token: $cookies.get('token')
			}
		}).then(function successCallback(response){
			if (response.data.failure == 'noToken'){
					// invalid token, so redirect to login page
					$location.path('/login');
				} else if (success = 'tokenMatch') {
					//redirect to checkout page
					$location.path('/checkout');
				}
		}, function errorCallback(status){
			console.log(status);
		});
	};
});


coffeeApp.controller('checkoutCtrl', function($scope, $http, $location, $cookies){

	$scope.states = usStates;

	$scope.checkoutForm = function(){
			$http({
			method: 'POST',
			url: apiUrl + '/checkout',
			data: {
				token: $cookies.get('token')
			}
		}).then(function successCallback(response){
			if (response.data.failure == 'noToken'){
					// invalid token, so redirect to login page
					$location.path('/login');
				} else if (success = 'tokenMatch') {
					//redirect to receipt page
					$location.path('/receipt');
				}
		}, function errorCallback(status){
			console.log(status);
		});
	};
});


coffeeApp.controller('receiptCtrl', function($scope){
	console.log('this is the receipt controller.');
});