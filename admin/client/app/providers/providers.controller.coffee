'use strict'

angular.module 'meanApp'
.controller 'ProvidersCtrl', ($scope, $state, ProviderStor) ->
  # setup search results directive
  $scope.searchResults = 
    providers: [],
    filters:
      apiURL: '/api/users/providers'
      perPage: '20'
    headers: [
      { text: 'ID' }
      { text: 'Name'}
      { text: 'Actions', colSpan:"3"}
    ]
    cols: ['id','name']
    options: {}
  $scope.providerClick = (p) ->
    ProviderStor.provider = p
    
  $scope.showProviders = ->
    if $state.is('providers')
      return true
    return $scope.logs?.length > 0 
