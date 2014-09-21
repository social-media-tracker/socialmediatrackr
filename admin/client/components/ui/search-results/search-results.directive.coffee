'use strict'

angular.module 'meanApp'
.directive 'searchResults', ->
  templateUrl: 'components/ui/search-results/search-results.html'
  restrict: 'A'
  scope:
    'data': '='
    'filters': '='
    'headers': '@'
    'options': '@'
  link: (scope, element, attrs) ->
