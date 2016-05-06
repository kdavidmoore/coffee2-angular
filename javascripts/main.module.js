var coffeeApp = angular.module('coffeeApp', ['ngRoute', 'ngCookies']);
const apiUrl = 'http://localhost:3000';


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
	}).when('/logout', {
		templateUrl: 'pages/logout.html',
		controller: 'logoutCtrl'
	}).when('/ourstory', {
		templateUrl: 'pages/ourstory.html',
		controller: 'ourController'
	}).otherwise({
		redirectTo: '/'
	});
});


coffeeApp.controller('mainController', function($scope, $http, $location, $cookies){	
	$scope.getStarted = function(){
		$http({
			method: 'GET',
			url: apiUrl + '/getUserData?token=' + $cookies.get('token')
		}).then(function successCallback(response){
			if (response.data.failure == 'noToken' || response.data.failure == 'badToken'){
				// if there is no matching token, go to the register page
				$location.path('/register');
			} else {
				// if there is a matching token, go to the options page
				$location.path('/options');
			}
		}, function errorCallback(response){
			console.log(response.status);
		});
	};

	$scope.ourStory = function(){
		$location.path('/ourstory');
	};
});


coffeeApp.controller('ourController', function($scope){	
	// this is the our story page
});


coffeeApp.controller('navController', function($scope, $http, $location, $cookies){
	
	// check to see if the user is logged in
	console.log($cookies.get('token'));

	$http({
		method: 'GET',
		url: apiUrl + '/getUserData?token=' + $cookies.get('token')
	}).then(function successCallback(response){
		console.log(response.data);
		if (response.data.failure == 'noToken' || response.data.failure == 'badToken'){
			// hide the log out link and show the other links
			$scope.loggedIn = false;
		} else {
			// hide the log in and register links and show the log out link
			$scope.loggedIn = true;
		}
	}, function errorCallback(response){
		console.log(response.status);
	});

	$scope.logout = function(){
		// clear cookies and redirect to the logout page
		// for some reason, the token is not getting removed from cookies
		$cookies.remove('token');
		$location.path('/logout');
	};

});


coffeeApp.controller('regController', function($scope, $http, $location, $cookies){

	$scope.registerForm = function(){

		if ($scope.password !== $scope.password2){
			$scope.errorMessage = 'The passwords do not match.';
		} else {
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
				if(response.data.success == 'added'){
					// get the current date and add one
					var expDate = new Date();
  					exp.setDate(exp.getDate() + 1);
					// get a random token back from the API and store it inside cookies
					// make the cookie expire tomorrow
					$cookies.put('token', response.data.token, {'expires': expDate});
					//redirect to options page
					$location.path('/options');
				} else if (response.data.failure == 'notUnique'){
					$scope.errorMessage = 'That username is taken.';
				}
			}, function errorCallback(response){
				console.log(response.status);
			});
		}
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
				// get tomorrow's date
				var expDate = new Date();
  				exp.setDate(exp.getDate() + 1);
				// store the token inside cookies
				// set the expiration date
				$cookies.put('token', response.data.token, {'expires': expDate});

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
		} else {
			$scope.userOptions = response.data;
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
			$scope.unitCost = 20.00;
		} else if (orderType == 'family'){
			$scope.quantity = 1.00;
			$scope.frequency = { option: "Every other week" }
			$scope.unitCost = 17.00;
		} else {
			$scope.unitCost = 20.00;
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
				// get tomorrow's date
				var expDate = new Date();
  				exp.setDate(exp.getDate() + 1);
				// put the options info into cookies for temporary storage
				$cookies.put('frequency', $scope.frequency.option, {'expires': expDate});
				$cookies.put('quantity', $scope.quantity, {'expires': expDate});
				$cookies.put('grindType', $scope.grindType.option, {'expires': expDate});
				$cookies.put('unitCost', $scope.unitCost, {'expires': expDate});

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
					// get tomorrow's date
					var expDate = new Date();
  					exp.setDate(exp.getDate() + 1);

					// put the delivery info into cookies for temporary storage
					if ($scope.addressTwo == null){
						$cookies.put('addressTwo', ' ', {'expires': expDate});
					} else {
						$cookies.put('addressTwo', $scope.addressTwo, {'expires': expDate});
					}

					$cookies.put('fullname', $scope.fullname, {'expires': expDate});
					$cookies.put('addressOne', $scope.addressOne, {'expires': expDate});
					//$cookies.put('addressTwo', $scope.addressTwo, {'expires': expDate});
					$cookies.put('city', $scope.city, {'expires': expDate});
					$cookies.put('state', $scope.state, {'expires': expDate});
					$cookies.put('zip', $scope.zip, {'expires': expDate});
					$cookies.put('deliveryDate', $scope.deliveryDate, {'expires': expDate});

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

	$scope.unitCost = $cookies.get('unitCost');
	$scope.frequency = $cookies.get('frequency');
	$scope.quantity = $cookies.get('quantity');
	$scope.grindType = $cookies.get('grindType');
	$scope.fullname = $cookies.get('fullname');
	$scope.addressOne = $cookies.get('addressOne');
	//$scope.addressTwo = $cookies.get('addressTwo');
	$scope.city = $cookies.get('city');
	$scope.state = $cookies.get('state');
	$scope.zip = $cookies.get('zip');
	$scope.deliveryDate = $cookies.get('deliveryDate');
	$scope.total = Number($scope.quantity) * $scope.unitCost;


	$scope.checkoutForm = function(){
			$http({
			method: 'POST',
			url: apiUrl + '/checkout',
			data: {
				token: $cookies.get('token'),
				frequency: $scope.frequency,
				quantity: $scope.quantity,
				grindType: $scope.grindType,
				fullname: $scope.fullname,
				addressOne: $scope.addressOne,
				addressTwo: $scope.addressTwo,
				city: $scope.city,
				state: $scope.state,
				zip: $scope.zip,
				deliveryDate: $scope.deliveryDate,
				totalCost: $scope.total
			}
		}).then(function successCallback(response){
			if (response.data.failure == 'badToken'){
					// invalid token, so redirect to login page
					$location.path('/login');
				} else if (success = 'updated') {
					// clear cookies and redirect to receipt page
					$cookies.remove('token');
					$location.path('/receipt');
				}
		}, function errorCallback(response){
			console.log(response.status);
		});
	};
});

coffeeApp.controller('receiptCtrl', function($scope){
	$scope.logoutHeader = "Your order is on its way"
	$scope.logoutMessage = "We appreciate your business!"
});

coffeeApp.controller('logoutCtrl', function($scope){
	$scope.logoutHeader = "You have been logged out"
	$scope.logoutMessage = "Come back soon!"
});
