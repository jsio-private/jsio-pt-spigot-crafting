var recipes = [
  {
    shape: ["DDD", "DDD", "DDD"],
    blocks: {
      D: "DIRT"
    },
    result: {
      block: "DIAMOND",
      amount: 64
    }
  }
];

// 
var editing = false;
var myApp = angular.module('myApp', ['ngMaterial']);
var slots = {
  "craft": [
    {id: "3-0", quantity: 1},
    {id: "17-0", quantity: 1},
    {id: "17-0", quantity: 1},
    {id: "17-0", quantity: 1},
    {id: "17-0", quantity: 1},
    {id: "3-0", quantity: 1},
    {id: "3-0", quantity: 1},
    {id: "12-0", quantity: 1},
    {id: "12-0", quantity: 1}
  ],
  "result": {
    id: "264-0", quantity: 64
  }
};


function DialogCtrl ($scope, $mdDialog) {
  $scope.querySearch = function (searchText) {
    if (!searchText) {
      return MC_ITEMS;
    }
    var foundItems = [];
    for (var ind in MC_ITEMS) {
      if(MC_ITEMS[ind]["name"].toLowerCase().indexOf(searchText.toLowerCase()) !== -1){
        foundItems.push(MC_ITEMS[ind]);
      }
    }
    return foundItems;
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.finish = function () {
    $mdDialog.hide();
    if ($scope.searchText && editing) {
      var searchText = $scope.searchText.toLowerCase();
      if (MC_ITEMS[searchText]) {
        var itemId = MC_ITEMS[searchText].type + "-" + MC_ITEMS[searchText].meta;
        if (Array.isArray(slots[editing.slot])) {
          slots[editing.slot][editing.count] = {id: itemId, quantity: 1};
        } else {
          slots[editing.slot] = {id: itemId, quantity: 1};
        }
      }
    }
  };
}

myApp.controller("main", function ($scope, $mdDialog) {
  $scope.Math = Math;

  $scope.clickOnSlot = function (slot, count) {
    editing = {"slot": slot, "count": count};
    $mdDialog.show({
      controller: DialogCtrl,
      controllerAs: 'ctrl',
      templateUrl: 'dialog.tmpl.html',
      parent: angular.element(document.body),
      clickOutsideToClose:true
    });
  };
  $scope.amountForSlot = function (slot, count) {
    if (Array.isArray(slots[slot])) {
      if (typeof slots[slot][count] === "object" && slots[slot][count]["quantity"] > 1) {
        return slots[slot][count]["quantity"];
      }
    } else if (typeof slots[slot] === "object" && slots[slot]["quantity"] > 1) {
      return slots[slot]["quantity"];
    }
    return "";
  };
  $scope.styleForSlot = function (slot, count) {
    var ret = {};
    if (Array.isArray(slots[slot])) {
      if (typeof slots[slot][count] === "object") {
        ret["background-image"] = "url('icons/" + slots[slot][count]["id"] + ".png')";
      }
    } else if (typeof slots[slot] === "object") {
      ret["background-image"] = "url('icons/" + slots[slot]["id"] + ".png')";
    }
    switch (slot) {
      case "craft":
        ret["margin-left"] = 59 + (count % 3) * 36;
        ret["margin-top"] = 33 + (Math.floor(count / 3) * 36);
      break;
      case "result":
        ret["margin-left"] = 247;
        ret["margin-top"] = 69;
      break;
    }
    return ret;
  };

});
myApp.filter('range', function () {
  return function (input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++) {
      input.push(i);
    }
    return input;
  };
});