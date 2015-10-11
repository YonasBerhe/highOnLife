// if (Meteor.isClient) {
  // Template.game.helpers(
  //
  //
  // );


// }

if (Meteor.isClient) {



  var LocalStorage = {
      getItem: function getItem(item){
          return JSON.parse(localStorage.getItem(item))
      },
      setItem : function setItem(itemName, itemValue){
          return localStorage.setItem(itemName, JSON.stringify(itemValue))
      },
      clear: function clear(itemName){
          return localStorage.clear(itemName)
      }
  }



  function isLoggedIn(){
      return LocalStorage.getItem('User') ? true : false
  }


  Router.route('/', function () {
    var is =  true;
     console.log(isLoggedIn());
    if(isLoggedIn()) {
      this.render('game')
    } else {
      this.render('login');
    }
  });

  Template.login.events({
    'submit form': function(e){
         e.preventDefault();
        var user = document.getElementById('usernameText').value;

          createUser(user);
      }

  });









}



if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  })
}
