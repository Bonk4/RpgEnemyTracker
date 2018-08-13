//import 'angular-ui-sortable';

//var app = angular.module("enemyTracker", ['ui.sortable']); 
var app = angular.module("pathTracker", []); 

app.controller("enemyCtrl", function($scope, $http, ModalService) {
    //set base scope variables
    $scope.enemies = [];
    $scope.enemyIndex = [];

    $scope.players = [];
    $scope.customEnemy = {
            Player: false,
            Name: "Zion",
            HP: 25,
            AC: 10,
            Stats: { Int: 10, Str: 10, Dex: 10, Cha: 10, Con: 10, Wis: 10 },
            Abilities: "",
            Items: "",
            Alive: true,
            Collapsed: false,
            CR: "1",
            SpecialAttacks: "",
            SpecialAbilities: "",
            Saves: ""
        };

    $scope.showAttacks = true;
    $scope.showAbilities = true;

    //load default Paizo bestiary from JSON
    loadBestiary("default");

    //assign scope functions
    $scope.damageEnemy = function(enemy) {
        enemy.HP = enemy.HP - 1;
    }
    
    $scope.healEnemy = function(enemy) {
        enemy.HP = enemy.HP + 1;
    }

    $scope.setHealth = function(enemy){
        enemy.HP = parseInt(enemy.HP);

        if(isNaN(enemy.HP)) {
            enemy.HP = 0;
        }
    }

    $scope.setAc = function(char){
        char.AC = parseInt(char.AC);
    }

    $scope.addPlayer = function() {
        $scope.players.push({
            Player: true,
            Name: "Todd",
            HP: 10,
            AC: {Total: 10},
            Alive: true,
            Collapsed: false,
        });
    }

    $scope.addEnemy = function(enemy) {
        $scope.enemies.push({
            Player: false,
            Name: enemy.Name,
            HP: parseInt(enemy.HP),
            AC: parseArmorClass(enemy.AC),
            Stats: parseStats(enemy.AbilitiyScores),
            Abilities: enemy.Abilities,
            Items: enemy.Items,
            Alive: true,
            Collapsed: false,
            CR: Math.round(enemy.CR),
            SpecialAttacks: enemy.SpecialAttacks.replace(";", "\n"),
            SpecialAbilities: enemy.SpecialAbilities.replace(";", "\n"),
            Saves: parseSaves(enemy.Fort, enemy.Ref, enemy.Will)
        });
    }

    $scope.addCustomEnemy = function() {

    }

    $scope.killEnemy = function(enemy) {
        enemy.HP = 0;
        enemy.Alive = !enemy.Alive;

        if (enemy.Alive) enemy.HP++;
    }

    $scope.collapseDetails = function(enemy, index) {
        if(!enemy.Alive) {
            $scope.enemies.splice(index, 1);
        }
        enemy.Collapsed = !enemy.Collapsed;
    }

    $scope.submitCustomEnemy = function() {

    }

    //private functions
    function removeChars(str) {
        return str.replace(/\D/g,'');
    }

    function parseStats(stats) {
        var statsBlock = stats.split(",");
        return {
            Str: parseInt(removeChars(statsBlock[0])),
            Dex: parseInt(removeChars(statsBlock[1])), 
            Con: parseInt(removeChars(statsBlock[2])), 
            Int: parseInt(removeChars(statsBlock[3])), 
            Wis: parseInt(removeChars(statsBlock[4])), 
            Cha: parseInt(removeChars(statsBlock[5]))
        };
    }

    function parseArmorClass(ac){
        totalArmor = removeChars(ac.split(",")[0]);

        return {
            Total: totalArmor,
            Details: ("AC " + ac)
        }
    }

    function parseSaves(fort, ref, will) {
        var Saves = { Fort: fort, Ref: ref, Will: will };

        if(fort.split('')[0] != "-" && fort.split('')[0] != "+")
            Saves.Fort = ('+' + fort);

        if(ref.split('')[0] != "-" && ref.split('')[0] != "+")
            Saves.Ref = ('+' + ref);

        if(will.split('')[0] != "-" && will.split('')[0] != "+")
            Saves.Will = ('+' + will);

        return Saves;
    }

    function loadBestiary(bestiary) {
        $http.get(GetJsonLink(bestiary)).then(function(response) {
            $scope.enemyIndex = $scope.enemyIndex.concat(response.data.sort(function alphabetical(a, b) {
                return b.Name < a.Name ?  1 : b.Name > a.Name ? -1 : 0;
            }));
        });

        //$scope.enemyIndex = localBestiary();
    }

    function GetJsonLink(bestiary){
        switch(bestiary) {
            //todo: upload other bestiaries and add here
            default:
                return "https://api.myjson.com/bins/1fwqgb"; //paizo base bestiary json
        }
    }


         
    $scope.openModal = function(id){
        ModalService.Open(id);
    }
 
    $scope.closeModal = function(id){
        ModalService.Close(id);
    }

});