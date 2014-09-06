'use strict'

describe 'Controller: ViewCtrl', ->

  # load the controller's module
  beforeEach module 'meanApp'
  ViewCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    ViewCtrl = $controller 'ViewCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
