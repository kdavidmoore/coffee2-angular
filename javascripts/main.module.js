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


coffeeApp.controller('navController', function($scope, $http, $cookies){
	// check to see if the user is logged in
	$http({
		method: 'GET',
		url: apiUrl + '/getUserData?token=' + $cookies.get('token')
	}).then(function successCallback(response){
		if (response.data.failure == 'noToken' || response.data.failure == 'badToken'){
			$scope.loggedIn = false;
		} else {
			// set logged in to True so the navbar links update appropriately
			$scope.loggedIn = true;
		}
	}, function errorCallback(response){
		console.log(response.status);
	});

	$scope.logout = function(){
		// clear cookies
		

	};

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
		}, function errorCallback(response){
			console.log(response.status);
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
		}, function errorCallback(response){
			console.log(response.status);
		});
	};
});


coffeeApp.controller('optionsCtrl', function($scope, $http, $location, $cookies){

	// make sure the user is logged in, i.e., that someone has not just pasted /options in the URL
	$http({
		method: 'GET',
		url: apiUrl + '/getUserData?token=' + $cookies.get('token')
	}).then(function successCallback(response){
		if (response.data.failure == 'noToken' || response.data.failure == 'badToken'){
			//redirect to login page
			$location.path('/login');
		}
	}, function errorCallback(response){
		console.log(response.status);
	});

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

	$scope.optionsForm = function(orderType){
		if (!$scope.grindType){
			// make the user select a grind type before submitting the form
			return 'no grind selected.';
		}

		if (orderType == 'solo'){
			$scope.quantity = 0.50;
			$scope.frequency = { option: "Monthly" }
		} else if (orderType == 'family'){
			$scope.quantity = 1.00;
			$scope.frequency = { option: "Every other week" }
		}

		$http({
			method: 'POST',
			url: apiUrl + '/options',
			data: {
				token: $cookies.get('token')
			}
		}).then(function successCallback(response){
			if (response.data.failure == 'badToken'){
				// invalid token, so redirect to login page
				$location.path('/login');
			} else if (success = 'tokenMatch') {
				// put the options info into cookies for temporary storage
				$cookies.put('frequency', $scope.frequency.option);
				$cookies.put('quantity', $scope.quantity);
				$cookies.put('grindType', $scope.grindType.option);

				//redirect to delivery page
				$location.path('/delivery');
			}
		}, function errorCallback(response){
			console.log(response.status);
		});
	};
});


coffeeApp.controller('deliveryCtrl', function($scope, $http, $location, $cookies){

	$scope.states = usStates;

	// make sure the user is logged in, i.e., that someone has not just pasted /options in the URL
	$http({
		method: 'GET',
		url: apiUrl + '/getUserData?token=' + $cookies.get('token')
	}).then(function successCallback(response){
		if (response.data.failure == 'noToken' || response.data.failure == 'badToken'){
			//redirect to login page
			$location.path('/login');
		}
	}, function errorCallback(response){
		console.log(response.status);
	});

	$scope.deliveryForm = function(){
			$http({
			method: 'POST',
			url: apiUrl + '/delivery',
			data: {
				token: $cookies.get('token')
			}
		}).then(function successCallback(response){
			if (response.data.failure == 'badToken'){
					// invalid token, so redirect to login page
					$location.path('/login');
				} else if (success = 'tokenMatch') {
					// put the delivery info into cookies for temporary storage
					$cookies.put('fullname', $scope.usrFullname);
					$cookies.put('addressOne', $scope.addressOne);
					$cookies.put('addressTwo', $scope.addressTwo);
					$cookies.put('city', $scope.usrCity);
					$cookies.put('state', $scope.usrState);
					$cookies.put('zip', $scope.usrZip);
					$cookies.put('deliveryDate', $scope.deliveryDate);

					//redirect to checkout page
					$location.path('/checkout');
				}
		}, function errorCallback(response){
			console.log(response.status);
		});
	};
});


coffeeApp.controller('checkoutCtrl', function($scope, $http, $location, $cookies){

	// make sure the user is logged in, i.e., that someone has not just pasted /options in the URL
	$http({
		method: 'GET',
		url: apiUrl + '/getUserData?token=' + $cookies.get('token')
	}).then(function successCallback(response){
		if (response.data.failure == 'noToken' || response.data.failure == 'badToken'){
			//redirect to login page
			$location.path('/login');
		}
	}, function errorCallback(response){
		console.log(response.status);
	});

	$scope.frequency = $cookies.get('frequency');
	$scope.quantity = $cookies.get('quantity');
	$scope.grindType = $cookies.get('grindType');
	$scope.fullname = $cookies.get('fullname');
	$scope.addressOne = $cookies.get('addressOne');
	$scope.addressTwo = $cookies.get('addressTwo');
	$scope.city = $cookies.get('city');
	$scope.state = $cookies.get('state');
	$scope.zip = $cookies.get('zip');
	$scope.deliveryDate = $cookies.get('deliveryDate');
	$scope.total = Number($scope.quantity) * 20.00;


	$scope.checkoutForm = function(){
			$http({
			method: 'POST',
			url: apiUrl + '/checkout',
			data: {
				token: $cookies.get('token'),
				frequency: $cookies.get('frequency'),
				quantity: $cookies.get('quantity'),
				grindType: $cookies.get('grindType'),
				fullname: $cookies.get('fullname'),
				addressOne: $cookies.get('addressOne'),
				addressTwo: $cookies.get('addressTwo'),
				city: $cookies.get('city'),
				state: $cookies.get('state'),
				zip: $cookies.get('zip'),
				deliveryDate: $cookies.get('deliveryDate')
			}
		}).then(function successCallback(response){
			if (response.data.failure == 'badToken'){
					// invalid token, so redirect to login page
					$location.path('/login');
				} else if (success = 'updated') {
					//redirect to receipt page
					$location.path('/receipt');
				}
		}, function errorCallback(response){
			console.log(response.status);
		});
	};
});


coffeeApp.controller('receiptCtrl', function($scope){
	console.log('this is the receipt controller.');
});
