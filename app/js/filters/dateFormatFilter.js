(function(){
    var module = angular.module("messaging-app");
    module.filter("dateFormat" , dateFormat);
    dateFormat.$inject = ["$filter"];
    /**
     * @ngdoc filter
     * @name messaging-app.filter:dateMessages
     * @description Formats the dates depending on whether the date is this day, or this year, or some other year.
     **/
    function dateFormat($filter)
    {
        return function(dateStr)
        {
            let date = new Date(dateStr);
            if(!isNaN(date))
            {
                let currentDate = new Date();

                if(currentDate.getFullYear() === date.getFullYear())
                {
                    if (currentDate.getMonth() === date.getMonth() && date.getDate() === date.getDate()){
                        return $filter("date")(date, 'h:mm a' )
                    }else{
                        return $filter("date")(date, 'MMM d, h:mm a');

                    }
                }else{
                    return $filter("date")(date, 'MMM d, yyyy h:mm a');
                }
            }
            return dateStr;
        }
    }
})();