'use strict'

angular.module 'meanApp'
.filter 'trunc', ->
  (input, len) ->
    if input.length > len
      return input.substr(0,len) + '\u2026'
    input


###
&#x02026;
&#8230;
###