'use strict'

angular.module 'meanApp'
.directive 'adminActivity', ->
  templateUrl: 'components/admin-activity/admin-activity.html'
  restrict: 'E'
  scope: {
    userId:'@',
    dateTimeFormat: '@'
  }

  controller: ($scope, $http, $timeout, $attrs) -> 
    # console.log $scope.user
    $scope.users = []
    $scope.filter = {}
    $scope.loading = true
    if $scope.userId
      $scope.filter.user = $scope.userId
    else
      $scope.filter.user = -1

    getNewLog = ->
      d = new Date()
      return {message:'',createdAt:d,tz_offset:d.getTimezoneOffset()}

    #delay setting up the watches for a short time to let the compiler fill in data
    $scope.newLog = getNewLog()
    $timeout ->

      $scope.$watch 'userId', (u) ->
        if u
          $scope.filter.user = u
      $scope.$watch 'logs.length', (len) ->
        $scope.loading = false
    , 250



    $scope.deleteLog = (log) ->
      $scope.selectedLog = log._id
      $timeout ->
        if confirm('Are you sure you want to delete this activity?')
          $http.delete '/api/logs/' + log._id
          .then (res) ->
            return alert res.error if res.error
            logs = []
            for l in $scope.logs
              logs.push l if l._id != $scope.selectedLog
            $scope.logs = logs
            $scope.selectedLog = false
        else
          $scope.selectedLog = false
      , 100

    $scope.addLog = (log, user) ->
      return alert('Enter a log message') unless log.message
      log.user = user
      $http.post '/api/logs', log
      .then (res) ->
        return $scope.newLogError = res.data.error if res.data.error
        $scope.newLogError = ''
        
        $scope.newLog = getNewLog()
        $scope.logs.unshift res.data

