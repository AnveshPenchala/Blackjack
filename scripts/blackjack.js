
// BlackJack Module
 
// Depends on Deck and Players Modules and defines the rules and logic of the blackjack game
 
var blackjack = (function() {
     // index of the active player at a given moment
     var currentPlayer = 0;
     // Initializes the game
      
     //Starts the deck
     var init = function(){
        reset();
        deck.init();
        players.init();
        players.newPlayer('Player');

        createPlayersUI();

        dealCards();

        currentPlayer = players.players().length - 1;

        updateActivePlayer(players.players()[currentPlayer]);
    }

  // Clears the game environment
     
     var reset = function(){
        var div_status = document.getElementById('status');
        div_status.classList.remove('active');

        var p_status_text = document.getElementById('status-text');
        p_status_text.innerHTML = "";

        document.getElementById('players').innerHTML = '';
        document.getElementById('house').innerHTML = '';
    }

   // Initial deal
      
   // gives 2 cards to  player and 1 to dealer
     
    var dealCards = function() {
        players.players().map((player) => {
            switch(player.type){
                case 'human':
                    while(player.hand.length < 2) {
                        hit(player, true);
                    }
                    break;
                case 'auto':
                default:
                    hit(player, true);
                    break;
            }
        });
    }

   // handles player's points according to the respective hand
      
   // {object} player 
     
    var handlePoints = function(player){
        // to handle aces last
        var orderedCards = [];
        var points = 0;

        if (player.hand.length > 0) {
            player.hand.map((card) => {
                if (card.Value === "A") {
                    orderedCards.push(card);
                } else {
                    orderedCards.unshift(card);
                }
            });
            
            orderedCards.map((card) => {
                points += cardWeight(card, points);
            });
            
            player.points = points;
        }
        updatePlayerPoints(player);

        checkWinners(player);
    }

    
   //returns the points referent to a given card value
   //if it's an ace checks if should be 11 or 1
      
   // {object} card 
   // {number} currentPoints 

    var cardWeight = function(card, currentPoints){
        var faces = ["J", "Q", "K"];
        
        var weight = parseInt(card.Value);

        if (faces.indexOf(card.Value) > -1){
            weight = 10;
        }

        if (card.Value === "A") {
            weight = currentPoints + 11 > 21 ? 1 : 11;
        }
        return weight;
    }
    
    
    // Takes a card from the deck and place it on player's hand
    //  If its dealing phase ignore autoplay
      
    //{object} player 
    //{bool} dealing 
     
    var hit = function(player, dealing = false){
        var card = deck.deal();
        player.hand.push(card);
        handlePoints(player);
        renderCard(card, player);
        updateDeck();

        if (!dealing && player.type != 'human') {
            autoPlay(player);
        }
    };

   // Process what happens after player decides to not take more cards
      
   // {object} player 
     
    var stay = function(player){
        currentPlayer--;
        if (currentPlayer >= 0) {
            updateActivePlayer(players.players()[currentPlayer]);

            if (players.players()[currentPlayer].type != 'human') {
                autoPlay(players.players()[currentPlayer]);
            }
        } else {
            endGame();
        }
    }

    
    //  Makes the decisions for a 'auto' player based on his and the other players points
    //Uses a timeout just for visualisation effect on the Dom
      
    // {object} player 
     
    var autoPlay = function(player){
        var highestScore = 0;

        players.players().map((p) => {
            if (p.id != player.id && p.points <= 21 && p.points > highestScore) {
                highestScore = p.points;
            }
        });

        window.setTimeout(() => {
            // if points are inferior to other players have to hit
            if (player.points <= highestScore) {
                hit(player);
            } else { 
                stay(player);
            }
        }, 1000);
    }

    
    // Checks who's the winner and creates a status on the DOM to display it
     
    var endGame = function(){
        var highestScore = 0;
        var winner = {};

        players.players().map((p) => {
            if (p.points <= 21 && p.points > highestScore) {
                highestScore = p.points;
                winner = p;
            }
        });

        updateStatus(winner.name + " wins!", winner.type == 'human');
    }

    //  Checks if a player has blackjack or busts, defining winners before the expected end of the game
      
    //  {object} player 
     
    var checkWinners = function(player){
        if (player.points == 21) {
            updateStatus(player.name + " wins!", true);
        } else if (player.points > 21) {
            updateStatus(player.name + " busted!", false);
            stay(player);
        }
    }

    //  Creates and sets the elements of the DOM for the existing players
     
    var createPlayersUI = function (){
        document.getElementById('players').innerHTML = '';
        document.getElementById('house').innerHTML = '';

        players.players().map((player) => {
            var div_player = document.createElement('div');
            var div_playerid = document.createElement('div');
            var div_hand = document.createElement('div');
            var span_points = document.createElement('span');
            var div_actions = document.createElement('div');

            span_points.className = 'points';
            span_points.id = 'points_' + player.id;
            div_player.id = 'player_' + player.id;
            div_player.className = 'player';
            div_hand.id = 'hand_' + player.id;
            div_hand.className = 'hand';
            div_actions.id = 'actions_' + player.id;

            div_playerid.innerHTML = player.name + ": ";
            div_playerid.appendChild(span_points);
            div_player.appendChild(div_playerid);
            div_player.appendChild(div_hand);
            div_player.appendChild(div_actions);

            switch (player.type) {
                case 'human':
                    document.getElementById('players').appendChild(div_player);
                    break;
                case 'auto':
                default:
                    document.getElementById('house').appendChild(div_player);
                    break;
            }
        });
    }

    
    // Render a card on the DOM of the correct place for a given player's hand
      
    //{object} card 
    // {object} player 
     
    var renderCard = function(card, player)
    {
        var hand = document.getElementById('hand_' + player.id);
        hand.appendChild(deck.getCardUI(card));
    }

    
    // Updates the current number of cards in the deck's DOM element
     
    var updateDeck = function ()
    {
        document.getElementById('deckcount').innerHTML = deck.deck().length;
    }

    
    //  Changes who's the current active player in the DOM
      
    //{object} activePlayer 
    var updateActivePlayer = function(activePlayer) {
        players.players().map((player) => {
            if (player.id === activePlayer.id) {
                document.getElementById('player_' + player.id).classList.add('active');
                
                if (player.type === 'human') {
                    var div_buttons = document.createElement('div');
                    var btn_hit = document.createElement('button');
                    var btn_stay = document.createElement('button');

                    btn_hit.innerHTML = "Hit me!";
                    btn_hit.addEventListener('click', function(){ hit(player); }, false);

                    btn_stay.innerHTML = "Stay";
                    btn_stay.addEventListener('click', function(){ stay(player); }, false);

                    div_buttons.appendChild(btn_hit);
                    div_buttons.appendChild(btn_stay);
                    
                    document.getElementById('actions_' + player.id).appendChild(div_buttons);
                }
            } else {
                document.getElementById('player_' + player.id).classList.remove('active');
                document.getElementById('actions_' + player.id).innerHTML = '';
            }
        });
        var div_status = document.getElementById('status');
        div_status.classList.remove('active');
    }

    
    // Updates the player points value in the DOM
      
    //{object} player 
     
    var updatePlayerPoints = function(player) {
        document.getElementById('points_' + player.id).innerHTML = player.points;
    }

    
    // Show the status hidden element with given text
    //element should have a button to restart the game
      
    //{string} text 
    //{bool} win 
     
    var updateStatus = function(text, win) {
        var div_status = document.getElementById('status');
        div_status.classList.add('active');

        var div_status_content = document.getElementById('status-content');
        if (win){
            div_status_content.classList.remove('red');
        } else {
            div_status_content.classList.add('red');
        }

        var p_status_text = document.getElementById('status-text');
        p_status_text.innerHTML = text;
    }

    return {
        init: init,
        reset: reset
    }
})();

document.onreadystatechange = function () {
    if (document.readyState == "interactive") {
        blackjack.init();
    }
}