'use strict'

angular.module 'meanApp'
.controller 'LoginCtrl', ($scope, Auth, $location, $window) ->
  # make my life on dev easier:
  # $scope.user = {email:'test@test.com',password:'test'}
  $scope.errors = {}
  $scope.login = (form) ->
    $scope.submitted = true

    if form.$valid
      # Logged in, redirect to home
      Auth.login
        email: $scope.user.email
        password: $scope.user.password

      .then ->
        $location.path '/activity'

      .catch (err) ->
        $scope.errors.other = err.message

  $scope.loginOauth = (provider) ->
    $window.location.href = '/auth/' + provider
