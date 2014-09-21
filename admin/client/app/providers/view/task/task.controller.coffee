'use strict'

angular.module 'meanApp'
.controller 'AdminTaskCtrl', ($scope, $stateParams, Task, Users, Auth, $http) ->
  $scope.task = Task.get({id:$stateParams.task_id})
  $scope.u = Users.name

  $scope.logClick = (l) ->
    l.showComments = !l.showComments

  $scope.submitComment = (l) ->
    c = {message:l.newComment}
    $http.post('/api/tasks/' + $scope.task._id + '/logs/' + l._id + '/comments', c)
    .success (res) ->
      l.comments.push(res)


