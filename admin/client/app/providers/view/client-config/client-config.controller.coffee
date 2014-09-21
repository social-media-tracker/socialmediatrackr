'use strict'

angular.module 'meanApp'
.controller 'ClientConfigCtrl', ($scope, User, ProviderStor) ->
  $scope.clients = User.clients()
  $scope.provider = ProviderStor.provider
  $scope.provider.provider_clients = $scope.provider.provider_clients || []
  $scope.message = 'Hello'
  $scope.hasClient = (id) ->
    id = parseInt(id)
    $scope.provider.provider_clients.indexOf(id) > -1
  $scope.swapClient = (c) ->
    c.saving = true
    id = parseInt(c._id)
    q = false
    if $scope.provider.provider_clients.indexOf(id) > -1
      User.removeFromProvider {clientId:c._id, providerId:$scope.provider._id}, ->
        pc = $scope.provider.provider_clients.filter (cid) ->
          return if c && cid && cid != c._id then cid else null
        $scope.provider.provider_clients = pc
        c.saving = false
    else
      User.addToProvider {clientId:c._id, providerId:$scope.provider._id}, ->
        $scope.provider.provider_clients.push c._id
        c.saving = false



