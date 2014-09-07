'use strict'

angular.module 'meanApp'
.config ($stateProvider) ->
  $stateProvider.state 'activity.view.reply',
    url: '/reply'
    templateUrl: 'app/activity/view/reply/reply.html'
    controller: 'ReplyCtrl'
