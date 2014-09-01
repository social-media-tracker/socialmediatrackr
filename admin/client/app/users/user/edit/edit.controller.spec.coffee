'use strict'

describe 'Controller: EditCtrl', ->

  # load the controller's module
  beforeEach module 'meanApp'
  EditCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    EditCtrl = $controller 'EditCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
