'use strict'

angular.module 'meanApp'
.controller 'ChecklistCtrl', ($scope, $timeout, $http) ->
    # console.log $scope.user
    $scope.list = []
    $scope.loading = true

    #delay setting up the watches for a short time to let the compiler fill in data

    $http.get '/api/checklists'
    .then (res) ->
      $scope.list = res.data
      $scope.loading = false
      # console.log res.data
