'use strict'

angular.module 'meanApp'
.controller 'TaskCtrl', ($scope, $stateParams, Task, $http, Auth, Users) ->
  $scope.task = {}

  $scope.u = Users.name
  
  Task.get {id:$stateParams.id}, (res) ->
    $scope.task = res

  resetLog = ->
    $scope.log = {}

  resetLog()

  $scope.logClick = (l) ->
    l.showComments = !l.showComments

  $scope.submitComment = (l) ->
    c = {message:l.newComment}
    $http.post('/api/tasks/' + $scope.task._id + '/logs/' + l._id + '/comments', c)
    .success (res) ->
      res.user = Auth.getCurrentUser()
      l.comments.push(res)


  $scope.submitLog = (l) ->
    if (l._id)
      $http.put('/api/tasks/' + $scope.task._id + '/logs/' + l._id, l)
      .success (res) ->
        $scope.task = res
        resetLog()


    else
      $http.post('/api/tasks/' + $scope.task._id + '/logs', l)
      .success (res) ->
        $scope.task = res
        resetLog()


