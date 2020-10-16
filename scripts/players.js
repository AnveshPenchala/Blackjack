
 // Players Module
  
 // Defines players for a card game
 
var players = (function() {
    // container for all the players
    var innerPlayers = [];

     // Initializes the players array, setting one player of auto type (this should be autoplayed by the game definition)
     
    var init = function() {
        reset();
        newPlayer('Dealer', 'auto');
    }

    //  Clears players container
     
    var reset = function() {
        innerPlayers = [];
    }

    // Returns players container
    var players = function() {
        return innerPlayers;
    }


   //Sets new player and add to container
   //{string} name 
   //{string} type (optional - if not defined is set as 'human') 
     
    var newPlayer = function(name, type='human'){
        var player = {
            id: innerPlayers.length + 1,
            name: name,
            type: type,
            hand: [],
            points: 0
        }

        innerPlayers.push(player);
    }

    return {
        init: init,
        players: players,
        newPlayer: newPlayer,
        reset: reset
    }
})();