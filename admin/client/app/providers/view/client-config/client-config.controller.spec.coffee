'use strict'

describe 'Controller: ClientConfigCtrl', ->

  # load the controller's module
  beforeEach module 'meanApp'
  ClientConfigCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    ClientConfigCtrl = $controller 'ClientConfigCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
