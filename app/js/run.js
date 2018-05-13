(()=>{
    const module = angular.module("messaging-app");

    module.run(runBlock);

    runBlock.$inject = ["UserService"];

    function runBlock(UserService)
    {
        // Authorization state, once it detects a change to it, it logs out the app and goes back to the login screen
        firebase.auth().onAuthStateChanged(function(credentials) {
            if (credentials) {
                UserService.setAuthenticatedUser(credentials.uid)
                    .then((us)=>{
                        // Once we are authenticated check for the onDisconnect even to update the flag to null
                        firebase.database().ref("users"+"/"+us.userId).onDisconnect().update({online:null});
                        navi.pushPage("./views/messages/conversations.html",{animation:"fade"});
                    }).catch(()=>{
                        handleInvalidAuthentication();
                    });
            }else{
                handleInvalidAuthentication();
            }
        });
        function handleInvalidAuthentication() {
            let pageName = navi.getCurrentPage().name;

            if( pageName !== "./views/auth/login.html" && pageName !== "./views/auth/register-user.html")
            {
                navi.resetToPage("./views/auth/login.html",{animation:"fade"});
                // ons.notification.alert({message:"Please login again"});
            }
        }
        // firebase.auth().signOut();
    }

})();