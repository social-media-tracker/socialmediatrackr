'use strict'

describe 'Controller: NewCtrl', ->

  # load the controller's module
  beforeEach module 'meanApp'
  NewCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    NewCtrl = $controller 'NewCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
