//Deck Module
//Defines a deck of 52 cards
var deck = (function() {
    // possible card values
    var cards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    // possible card suits
    var suits = ['hearts', 'spades', 'diamonds', 'clubs'];
    // container for all the cards
    var innerDeck = [];

    // Initializes the deck array and shuffles it
     
    var init = function() {
        reset();
        shuffle();
    }

    // Returns deck container 

    var deck = function() {
        return innerDeck;
    }

  // Clears deck and restart it with all the cards
     
    var reset = function() {
        var newDeck = new Array();

        suits.map((suit) => {
            cards.map((card) => {
                var newCard = {
                    Value: card,
                    Suit: suit
                }
                newDeck.push(newCard);
            });
        });

        innerDeck = newDeck;
    }

    // Take 1 card from the top of the deck and return it
     
    var deal = function() {
        var card = innerDeck.pop();
        return card;
    }

    // Shuffles the deck
     
    var shuffle = function() {
        var currentIndex = innerDeck.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = innerDeck[currentIndex];
            innerDeck[currentIndex] = innerDeck[randomIndex];
            innerDeck[randomIndex] = temporaryValue;
        }
    }

    
   // Creates and returns the DOM element of a card
   // Depends on deck.css to display correctly
     
    var getCardUI = function(card)
    {
        var el = document.createElement('div');
        var value = document.createElement('p');
        value.innerHTML = card.Value;
        el.className = 'card suit' + card.Suit.toLowerCase();
        el.appendChild(value);
        return el;
    }

    return {
        init: init,
        deck: deck,
        reset: reset,
        deal: deal,
        shuffle: shuffle,
        getCardUI: getCardUI
    }
})();