# Coffee Site - Angular Front End

The front-end of the new coffee app is built using AngularJS. It connects to the back-end app using asynchronous requests to an API endpoint.

## Features
* Register as new user using $http POST request to endpoint
* Random token is generated for each new user
* Log in as existing user or sign out
* On page load, verifies that the user is logged in using ngCookies
* Cookies stored in $cookies are checked against cookies stored in database using $http POST request
* Choose order options, delivery method, and checkout
* User options are stored in $cookies until checkout is complete
* After checkout, data stored in $cookies are sent to back-end using $http POST request
* User is logged out after checkout by clearing the token cookie

## Demo here
insert link to portfolio

[I learned this at DigitalCrafts](https://digitalcrafts.com)