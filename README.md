# Coffee Site - Front End Component

## An eCommerce site built using AngularJS

This site allows the user to register, log in, and place orders. The user info is created, updated, or deleted using http requests to an API endpoint. The API is created by an [Express app](https://github.com/kdavidmoore/coffee-site) running on the same server.

## Features
* Register as new user by making an http POST request to an API
* A random token is generated for each new user and stored in cookies using ngCookies
* The user can log out at any time by removing the token
* Upon loading each new view, cookies are used to verify that the user is still logged in
* The user can choose order options, delivery method, and checkout
* User options are stored in $cookies until checkout is complete
* After checkout, data stored in cookies are sent to an API using $http POST request

## [Demo here](http://kdavidmoore.com/coffee)

## See also
* [Coffee Site - Back End Component](https://github.com/kdavidmoore/coffee-site) 

[I learned this at DigitalCrafts](https://digitalcrafts.com)