'use strict'

angular.module 'meanApp', [
  'ngCookies'
  'ngResource'
  'ngSanitize'
  'ui.router'
  'ui.bootstrap'
  'begriffs.paginate-anything'
  'angularFileUpload'
  'xeditable'
  'bootstrapLightbox'
  'ui.utils'
]
.config ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) ->
  $urlRouterProvider
  .otherwise '/'

  $locationProvider.html5Mode true
  $httpProvider.interceptors.push 'authInterceptor'

.factory 'authInterceptor', ($rootScope, $q, $cookieStore, $location) ->
  # Add authorization token to headers
  request: (config) ->
    config.headers = config.headers or {}
    config.headers.Authorization = 'Bearer ' + $cookieStore.get 'token' if $cookieStore.get 'token'
    config

  # Intercept 401s and redirect you to login
  responseError: (response) ->
    if response.status is 401
      $location.path '/login'
      # remove any stale tokens
      $cookieStore.remove 'token'

    $q.reject response
    
.service 'ProviderStor', ->
  return {
    provider: false
  }

.run ($rootScope, $location, Auth, editableOptions, Users) ->
  Users.loadUsers()

  # set xeditable's theme to bootstrap 3
  editableOptions.theme = 'bs3'
  
  # Redirect to login if route requires auth and you're not logged in
  $rootScope.$on '$stateChangeStart', (event, next) ->
    Auth.isLoggedInAsync (loggedIn) ->
      $location.path "/login" if next.authenticate and not loggedIn
