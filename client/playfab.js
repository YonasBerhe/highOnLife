console.log('hey')

//GLOBAL
playfab = PlayFabClientSDK

playfab.settings.title_id = "7A35"
playfab.settings.developer_secret_key =
  "9M4SFMKC1YRFN8DPD499IEFWJD3YU5AR148SBU5I57XSYOZB3G"

function Guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

//GLOBAL

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



/*
var sample = { PlayFabId: "8C923B18390201DE", uuid: 1234, userName:"Kristoffer" }

LocalStorage.setItem('test', sample)
console.log(LocalStorage.getItem('test'))
console.log(LocalStorage.clear('test'))
console.log(LocalStorage.getItem('test')) */


function isLoggedIn(){
    return LocalStorage.getItem('User') ? true : false
}

function getUser(){
    return isLoggedIn() ? LocalStorage.getItem('User') : false
}

function updateUsername(username){
    var request = {
        DisplayName: username
    };
    playfab.UpdateUserTitleDisplayName(request, function(result){

        if(result.status === "OK"){
            var User = LocalStorage.getItem('User');
            User.username = result.data.DisplayName;

            LocalStorage.setItem('User', User);

            // TODO: add case for duplicate user name
        } else {
            console.log('something went wrong', result.code, result.status);
        }
    });
}

function createUserLoginRequest(uuid){
    return {
        TitleId : playfab.settings.title_id,
        CustomId: uuid,
        "CreateAccount": false
    };
}

function createUserRequest(){
    var uuid = Guid()

    return {
        TitleId : playfab.settings.title_id,
        CustomId: uuid,
        "CreateAccount": true
    }
}

function createUser(){
        var request = createUserRequest()

        playfab.LoginWithCustomID(request, function(result){
            if(result.status === "OK"){
                var User = result.data
                LocalStorage.setItem('User', User)
                sessionStorage.setItem('SessionTicket', 'value');

                console.log('user created')

            } else {
                console.log('something went wrong', result.code, result.status)
            }
        })
}

function loginUser(ID){
    var request = createUserLoginRequest(ID)

    playfab.LoginWithCustomID(request, function(result){
        if(result.status === "OK"){
            var User = result.data
            LocalStorage.setItem('User', User)

        } else {
            console.log('something went wrong', result.code, result.status)
        }
    })
}

function delay(fn, time){
    var timeOut = time | 3000
    setTimeout(fn, timeOut)
}

//create user on load
createUser()

delay(updateUsername('kristoffer'))
delay(function(){
    console.log(getUser())
})
/*


CustomId
PlayfabID

stored in localStorage and used to set/get username

then set display name // with customId PlayfabID
update/set display
*/
