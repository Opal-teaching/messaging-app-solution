(function(){
    const module = angular.module("messaging-app");
    module.service("NavigatorParameters" , NavigatorParameters);
    NavigatorParameters.$inject = [];
    /**
     * @ngdoc service
     * @name messaging-app.service:NavigatorParameters
     * @desc Returns parameters, this is done to get around an Onsen bug relating not being able to push parameters
     *       using navi.popPage();
     **/
    function NavigatorParameters()
    {
        /**
         * @ngdoc property
         * @name messaging-app.service:name_type#parameters
         * @propertyOf messaging-app.service:NavigatorParameters
         * @desc Holds temporarily the parameters for the navigator
         **/
        let parameters;

        return {
            getParameters: getParameters,
            setParameters: setParameters
        };;

        //////////////////////////////////////
        /**
         * @ngdoc method
         * @name messaging-app.service:service_name#dummyService
         * @methodOf messaging-app.service:service_name
         * @returns {*} Returns parameters for navigator
         * @desc Initializes logic for application
         **/
        function getParameters(){
            let params = parameters;
            parameters = undefined;
            return params;
        }
        /**
        * @ngdoc method
        * @name messaging-app.service:name_type#setParameters
        * @methodOf messaging-app.service:name_type
        * @param {*} params Desc param1
        * @desc Sets the parameters before pushing page
        **/
        function setParameters(params)
        {
            parameters = params;
        }
    }
})();