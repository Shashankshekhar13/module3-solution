(function () {
    'use strict';
  
    angular
      .module('NarrowItDownApp', [])
      .controller('NarrowItDownController', NarrowItDownController)
      .service('MenuSearchService', MenuSearchService)
      .directive('foundItems', FoundItemsDirective);
  
    // Controller
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
      var ctrl = this;
      ctrl.searchTerm = '';
      ctrl.found = [];
      ctrl.showNothingFound = false;
  
      ctrl.narrowItDown = function () {
        ctrl.found = [];
        ctrl.showNothingFound = false;
  
        if (!ctrl.searchTerm.trim()) {
          ctrl.showNothingFound = true;
          return;
        }
  
        MenuSearchService.getMatchedMenuItems(ctrl.searchTerm)
          .then(function (items) {
            ctrl.found = items;
            ctrl.showNothingFound = (items.length === 0);
          })
          .catch(function () {
            ctrl.showNothingFound = true;
          });
      };
  
      ctrl.removeItem = function (index) {
        ctrl.found.splice(index, 1);
      };
    }
  
    // Service
    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
      var service = this;
  
      service.getMatchedMenuItems = function (searchTerm) {
        return $http({
          method: 'GET',
          url: 'https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json'
        }).then(function (response) {
          var allItems = response.data.menu_items;
          var found = allItems.filter(function (item) {
            return item.description
              .toLowerCase()
              .indexOf(searchTerm.toLowerCase()) !== -1;
          });
          return found;
        });
      };
    }
  
    // Directive
    function FoundItemsDirective() {
      return {
        restrict: 'A',
        scope: {
          items: '<',
          onRemove: '&'
        },
        template:
          '<li ng-repeat="item in items track by $index">' +
          '  <span>{{ item.name }} ({{ item.short_name }}): {{ item.description }}</span>' +
          '  <button ng-click="onRemove({ index: $index })">Don\'t want this one!</button>' +
          '</li>'
      };
    }
  })();
  