//GLOBAL
playfab = PlayFabClientSDK

playfab.settings.title_id = "7A35"
playfab.settings.developer_secret_key = "9M4SFMKC1YRFN8DPD499IEFWJD3YU5AR148SBU5I57XSYOZB3G"

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

function isLoggedIn(){
    return LocalStorage.getItem('User') ? true : false
}

function getUser(){
    return isLoggedIn() ? LocalStorage.getItem('User') : false
}

function getCustomId(){
    if(!isLoggedIn()){
        console.log("user is not logged in")
    }

    var User = getUser()

    return User.CustomId
}

function updateUsername(username){
    var request = {
        DisplayName: username
    };
    playfab.UpdateUserTitleDisplayName(request, function(result){

        if(result.status === "OK"){
            var User = LocalStorage.getItem('User');
            User.Username = result.data.DisplayName;

            LocalStorage.setItem('User', User);

            // TODO: add case for duplicate user name
        } else {
            console.log('something went wrong', result.code, result.status);
        }
    });
}

function createUserLoginRequest(username){
    return {
        TitleId : playfab.settings.title_id,
        CustomId: username,
        CreateAccount: false
    };
}

function createUserRequest(username){

    return {
        TitleId : playfab.settings.title_id,
        CustomId: username,
        CreateAccount: true
    }
}

function createUser(username){
        var request = createUserRequest(username)

        playfab.LoginWithCustomID(request, function(result){
            if(result.status === "OK"){
                var User = result.data
                console.log('User created', request.CustomId)
                User.CustomId = request.CustomId
                LocalStorage.setItem('User', User)
                playfab.session_ticket = User.SessionTicket
                updateUsername(request.CustomId)

            } else {
                console.log('something went wrong', result.code, result.status)
            }
        })
}

function loginUser(username){
    var request = createUserLoginRequest(username)

    playfab.LoginWithCustomID(request, function(result){
        if(result.status === "OK"){
            console.log('User logged in', request.CustomId)
            var User = result.data
            User.CustomId = request.CustomId
            LocalStorage.setItem('User', User)

        } else {
            console.log('something went wrong', result.code, result.status, result)
        }
    })
}

function delay(fn, time){
    var timeOut = time | 3000
    setTimeout(function(){
        fn()
    }, timeOut)
}

/*


var sample = { PlayFabId: "8C923B18390201DE", uuid: 1234, userName:"Kristoffer" }

LocalStorage.setItem('test', sample)
console.log(LocalStorage.getItem('test'))
console.log(LocalStorage.clear('test'))
console.log(LocalStorage.getItem('test'))


GetUserStatistics
UpdateUserStatistics

then

GetLeaderboard



session: 156EB7602CBAEDC1---7A35-8D2D1CE3D5664A5-717AD317391CE031.2DF466F35B009DC
CustomId : 156EB7602CBAEDC1


kristofferhebert
PlayFabID E8BBC01FC98C25A2

jeffery
PlayFabID AA636B2282F384DC
playfab.settings.session_ticket = '156EB7602CBAEDC1---7A35-8D2D1CE3D5664A5-717AD317391CE031.2DF466F35B009DC'

createUser('jeffery')

delay(function(){
    var CustomId = getCustomId()
    loginUser(CustomId)
}, 3000)


//delay(updateUsername('kristoffer hebert'), 10000)
delay(function(){
    updateUsername('jeffery')
}, 6000)
delay(function(){
    console.log(getUser())
}, 10000)
/*


CustomId
PlayfabID

stored in localStorage and used to set/get username

then set display name // with customId PlayfabID
update/set display
*/
