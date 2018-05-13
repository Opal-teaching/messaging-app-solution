(function () {

    const module = angular.module("messaging-app");
    module.config(config);

    function config() {
        // Firebase configuration
        let config = {
            apiKey: "AIzaSyAecgPPBQA0XDjkV98hKGfY9EC6DUQrWYA",
            authDomain: "opal-tutorial.firebaseapp.com",
            databaseURL: "https://opal-tutorial.firebaseio.com",
            projectId: "opal-tutorial",
            storageBucket: "opal-tutorial.appspot.com",
            messagingSenderId: "330623088918"
        };
        firebase.initializeApp(config);
    }
})();