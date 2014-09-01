'use strict'

angular.module 'meanApp'
.controller 'MainCtrl', ($scope, $rootScope, Auth, $location, $window) ->
  # make my life on dev easier:
  # $scope.user = {email:'admin@admin.com',password:'admin'}
  $scope.errors = {}
  $scope.login = (form) ->
    $scope.submitted = true

    if form.$valid
      # Logged in, redirect to home
      Auth.login
        email: $scope.user.email
        password: $scope.user.password

      .then ->
        $location.path '/users'

      .catch (err) ->
        $scope.errors.other = err.message

  $scope.loginOauth = (provider) ->
    $window.location.href = '/auth/' + provider

