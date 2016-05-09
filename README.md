# Coffee Site - Front End Component

## An eCommerce site built using AngularJS

The front end component makes http

## Features
* Register as new user by making an http POST request to an API
* A random token is generated for each new user and stored in cookies using ngCookies
* The user can log out at any time by removing the token
* Upon loading each new view, cookies are used to verify that the user is still logged in
* The user can choose order options, delivery method, and checkout
* User options are stored in $cookies until checkout is complete
* After checkout, data stored in cookies are sent to an API using $http POST request

## Demo here
insert link to portfolio

[I learned this at DigitalCrafts](https://digitalcrafts.com)