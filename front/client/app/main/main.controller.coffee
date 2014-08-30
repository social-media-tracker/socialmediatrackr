'use strict'

angular.module 'meanApp'
.controller 'MainCtrl', ($scope, $location, Auth) ->
	console.log Auth
	if Auth.isLoggedIn()
		$location.path('/activity')