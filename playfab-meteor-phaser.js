"use strict";
if (Meteor.isClient) {
  Template.game.helpers(
      // game is a global var from /client/games/breakout.js

  );
  Template.highOnLife.helpers({
    rendered: function(){

    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
