'use strict'

angular.module 'meanApp'
.controller 'SettingsCtrl', ($scope, $timeout, Auth) ->
  $scope.error = false
  $scope.notifications = 
    errors: {}
    message: ''
    submitted: false
  $scope.user = Auth.getCurrentUser()
  
  # $scope.subscriptions = Auth.getCurrentUser().subscriptions

  $scope.changeSubscriptions = (form) ->
    $scope.notifications.submitted = true

    if (form.$valid)
      Auth.changeSubscriptions $scope.user
      .then ->
        $scope.notifications.message = 'Subscriptions changed.'
      .catch ->
        $scope.notifications.error = 'Server Error'

  $scope.changePassword = (form) ->
    $scope.submitted = true

    if form.$valid
      Auth.changePassword $scope.user.oldPassword, $scope.user.newPassword
      .then ->
        $scope.message = 'Password successfully changed.'

      .catch ->
        form.password.$setValidity 'mongoose', false
        $scope.errors.other = 'Incorrect password'
        $scope.message = ''
