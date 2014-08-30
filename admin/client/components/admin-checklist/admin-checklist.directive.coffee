'use strict'

angular.module 'meanApp'
.directive 'adminChecklist', ->
  templateUrl: 'components/admin-checklist/admin-checklist.html'
  restrict: 'E'
  scope: {
    userId:'@'
  }

  controller: ($scope, $http, $timeout, $attrs) -> 
    # console.log $scope.user
    $scope.list = []
    $scope.filter = {}
    $scope.loading = true
    if $scope.userId
      $scope.filter.user = $scope.userId
    else
      $scope.filter.user = 0

    #delay setting up the watches for a short time to let the compiler fill in data

    $timeout ->
      $scope.$watch 'userId', (u) ->
        if u
          $scope.filter.user = u

      $scope.$watch 'filter.user',  ->
        $http.get '/api/checklists?user=' + $scope.filter.user
        .then (res) ->
          $scope.list = res.data
          $scope.loading = false
          # console.log res.data
    , 250



    $scope.deleteItem = (log) ->
      $scope.selectedItem = log._id
      $timeout ->
        if confirm('Are you sure you want to delete this task?')
          $http.delete '/api/checklists/' + log._id
          .then (res) ->
            return alert res.error if res.error
            list = []
            for l in $scope.list
              list.push l if l._id != $scope.selectedItem
            $scope.list = list
            $scope.selectedItem = false
        else
          $scope.selectedItem = false
      , 100

    $scope.addItem = (item, userId) ->
      return alert('Enter a task.') unless item.task
      item.user = userId
      $http.post '/api/checklists', item
      .then (res) ->
        return $scope.newItemError = res.data.error if res.data.error
        $scope.newItemError = ''
        $scope.newItem.task = ''
        res.data.isDone = 0
        $scope.list.unshift res.data

    $scope.swapCompleted = (item) ->
    	console.log item
    	return alert('The item is currently updating, please wait for it to finish.') if item.loading
    	item.loading = true
    	if item.completedAt
    		url = '/api/checklists/' + item._id + '/notCompleted'
    	else
    		url = '/api/checklists/' + item._id + '/completed'
    	$http.post url
    	.then (res) ->
    		return alert res.data.error if res.data.error
    		item.completedAt = res.data.completedAt
    		item.isDone = item.completedAt ? 1 : 0
    	.catch () ->
    		item.loading = false
    	.finally () ->
    		item.loading = false
