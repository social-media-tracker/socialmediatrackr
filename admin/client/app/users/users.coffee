'use strict'

angular.module 'meanApp'
.config ($stateProvider) ->
  $stateProvider.state 'users',
    url: '/users'
    templateUrl: 'app/users/users.html'
    controller: 'UsersCtrl'

'use strict'
