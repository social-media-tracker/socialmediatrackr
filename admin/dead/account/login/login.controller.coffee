'use strict'

angular.module 'meanApp'
.controller 'LoginCtrl', ($scope, Auth, $location, $window) ->
  # make my life on dev easier:
  $scope.user = {email:'admin@admin.com',password:'admin'}
  $scope.errors = {}
  $scope.login = (form) ->
    $scope.submitted = true

    if form.$valid
      # Logged in, redirect to home
      Auth.login
        email: $scope.user.email
        password: $scope.user.password

      .then ->
        $location.path '/dashboard'

      .catch (err) ->
        $scope.errors.other = err.message

### TODO: add back when ready
  $scope.loginOauth = (provider) ->
    $window.location.href = '/auth/' + provider
###