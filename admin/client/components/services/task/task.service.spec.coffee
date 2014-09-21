'use strict'

describe 'Service: task', ->

  # load the service's module
  beforeEach module 'meanApp'

  # instantiate service
  task = undefined
  beforeEach inject (_task_) ->
    task = _task_

  it 'should do something', ->
    expect(!!task).toBe true
