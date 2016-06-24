var myApp = angular.module('myApp', ['ngMaterial', 'hljs']);

myApp.controller("main", function ($scope, $mdDialog) {
  $scope.slots = {
    "craft": [
      {id: "0-0", quantity: 1},
      {id: "0-0", quantity: 1},
      {id: "0-0", quantity: 1},
      {id: "17-0", quantity: 1},
      {id: "17-0", quantity: 1},
      {id: "17-0", quantity: 1},
      {id: "1-0", quantity: 1},
      {id: "1-0", quantity: 1},
      {id: "1-0", quantity: 1}
    ],
    "result": {
      id: "264-0", quantity: 64
    }
  };

  $scope.MC_ITEMS = MC_ITEMS;
  $scope.editing = false;
  $scope.showQuantity = false;
  
  function calcCharactersForSlots (uniqueSlots) {
    var ret = {};
    var availableChars = "@#$%&!^+=";
    var lastIndex = 0;
    for (var item in uniqueSlots) {
      var properName = uniqueSlots[item].text_type;
      ret[item] = availableChars[lastIndex];
      lastIndex++;
    }
    return ret;
  }
  
  function calcShapeFromSlotsAndChars (craftSlots, chars) {
    var ret = "";
    var counter = 0;
    for (var key in craftSlots) {
      var id = craftSlots[key].id;
      if (counter % 3 === 0) {
        ret += "'";
      }
      ret += id === "0-0" ? " " : chars[id];
      if (counter % 3 === 2) {
        ret += "'";
        if (counter !== 8) {
          ret += ", ";
        }
      }
      counter++;
    }
    return ret;
  }

  $scope.createOutput = function () {
    var resultItem = $scope.MC_ITEMS[$scope.slots.result.id];
    var uniqueSlots = {};
    for(var key in $scope.slots.craft){
      var id = $scope.slots.craft[key].id;
      uniqueSlots[id] = MC_ITEMS[id];
    }
    var chars = calcCharactersForSlots(uniqueSlots);
    var shape = calcShapeFromSlotsAndChars($scope.slots.craft, chars);
    
    var raw = "";
//    raw += "var spigot = require('node-spigot');";
//    raw += "\n";
//    raw += "var plugin = spigot.createPlugin('CraftingPlugin');\n";
//    raw += "\n";
//    raw += "// 'import' Java classes that we'll need\n";
//    raw += "var Bukkit = org.bukkit.Bukkit;\n";
//    raw += "var Material = org.bukkit.Material;\n";
//    raw += "var ItemStack = org.bukkit.inventory.ItemStack;\n";
//    raw += "var ShapedRecipe = org.bukkit.inventory.ShapedRecipe;\n";
//    raw += "\n";
//    raw += "// When the plugin is enabled, create events and commands for this plugin\n";
    raw += "plugin.on('enabled', function () {\n";
    raw += "  var result = new ItemStack(Material.getMaterial(" + resultItem.type + "), " + $scope.slots.result.quantity + ", 0, spigot.newByte(" + resultItem.meta + ")); // ItemStack for " + resultItem.text_type + "\n";
    raw += "  var recipe = new ShapedRecipe(result);\n";
    for (var key in uniqueSlots) {
      if (key !== "0-0") {
        raw += "  recipe.setIngredient(spigot.newChar('" + chars[key] + "'), Material.getMaterial(" + uniqueSlots[key].type + ", 1, 0, spigot.newByte(" + uniqueSlots[key].meta + "))); // ingredient for " + uniqueSlots[key].name + "\n";
      }
    }
    raw += "  recipe.shape(" + shape + ");\n";
    raw += "  Bukkit.getServer().addRecipe(recipe);\n";
//    raw += "\n";
//    raw += "  Bukkit.broadcastMessage('CraftingPlugin enabled');\n";
    raw += "});\n";
//    raw += "plugin.on('disabled', function () {\n";
//    raw += "  Bukkit.broadcastMessage('CraftingPlugin disabled');\n";
//    raw += "});\n";
    return raw;
  };
  $scope.clickOnSlot = function (slot, count) {
    $scope.editing = {"slot": slot, "count": count};
    $scope.showQuantity = slot === "result";
    if (Array.isArray($scope.slots[slot])) {
      $scope.selectedItem = $scope.slots[slot][count].id || "0-0";
      $scope.selectedQuantity = $scope.slots[slot][count].quantity || 1;
    } else {
      $scope.selectedItem = $scope.slots[slot].id || "0-0";
      $scope.selectedQuantity = $scope.slots[slot].quantity || 1;
    }
  };
  $scope.amountForSlot = function (slot, count) {
    if (Array.isArray($scope.slots[slot])) {
      if (typeof $scope.slots[slot][count] === "object" && $scope.slots[slot][count]["quantity"] > 1) {
        return $scope.slots[slot][count]["quantity"];
      }
    } else if (typeof $scope.slots[slot] === "object" && $scope.slots[slot]["quantity"] > 1) {
      return $scope.slots[slot]["quantity"];
    }
    return "";
  };
  $scope.onSelectItemChange = function () {
    if(!$scope.editing){
      return;
    }
    if (Array.isArray($scope.slots[$scope.editing.slot])) {
      $scope.slots[$scope.editing.slot][$scope.editing.count] = {id: $scope.selectedItem, quantity: $scope.selectedQuantity}
    } else {
      $scope.slots[$scope.editing.slot] = {id: $scope.selectedItem, quantity: $scope.selectedQuantity}
    }
  };
  $scope.styleForSlot = function (slot, count) {
    var ret = {};
    var selected = false;
    if ($scope.editing.slot === slot && $scope.editing.count === count) {
      selected = true;
    }
    if (Array.isArray($scope.slots[slot])) {
      if (typeof $scope.slots[slot][count] === "object") {
        ret["background-image"] = "url('icons/" + $scope.slots[slot][count]["id"] + ".png')";
      }
    } else if (typeof $scope.slots[slot] === "object") {
      ret["background-image"] = "url('icons/" + $scope.slots[slot]["id"] + ".png')";
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
    if (selected) {
      ret["background-color"] = "#b9b9b9";
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