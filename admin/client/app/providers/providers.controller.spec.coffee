'use strict'

describe 'Controller: ProvidersCtrl', ->

  # load the controller's module
  beforeEach module 'meanApp'
  ProvidersCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    ProvidersCtrl = $controller 'ProvidersCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
