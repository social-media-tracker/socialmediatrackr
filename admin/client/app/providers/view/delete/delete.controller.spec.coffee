'use strict'

describe 'Controller: DeleteCtrl', ->

  # load the controller's module
  beforeEach module 'meanApp'
  DeleteCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    DeleteCtrl = $controller 'DeleteCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
