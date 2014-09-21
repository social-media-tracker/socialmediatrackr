'use strict'

angular.module 'meanApp'
.config ($stateProvider) ->
  $stateProvider.state 'providers.view',
    url: '/:id'
    templateUrl: 'app/providers/view/view.html'
    controller: 'ViewProviderCtrl'
    resolve:
      user: ($stateParams, $http, $q) ->
        console.log 'Deferring Provider'
        deferred = $q.defer();
        $http.get('/api/users/' + $stateParams.id).then (res) ->
          console.log 'Resolving Provider:', res.data
          deferred.resolve(res.data)
        return deferred.promise

        # console.log 'Resolving provider #' + $stateParams.id
        # Provider.get($stateParams.id).$promise


