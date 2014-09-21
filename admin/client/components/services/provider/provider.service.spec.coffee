'use strict'

describe 'Service: provider', ->

  # load the service's module
  beforeEach module 'meanApp'

  # instantiate service
  provider = undefined
  beforeEach inject (_provider_) ->
    provider = _provider_

  it 'should do something', ->
    expect(!!provider).toBe true
