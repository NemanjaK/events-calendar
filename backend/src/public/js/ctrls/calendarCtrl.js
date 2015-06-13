cal.controller('calendarCtrl', function ($scope, $routeParams, daysFactory) {


    console.log($routeParams);

    var day = $routeParams.date? new Date($routeParams.date) : new Date() || new Date();


    if($routeParams.date && !isNaN(Date.parse($routeParams.date))) {

        day = new Date($routeParams.date);

    } else {
        day = new  Date();

    }

    console.log(day);


    $scope.days = daysFactory.getDaysForMonth(day);


});