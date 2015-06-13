cal.controller('calendarCtrl', function ($scope, $routeParams, $modal, daysFactory) {


    console.log($routeParams);

    var day = $routeParams.date? new Date($routeParams.date) : new Date() || new Date();


    if($routeParams.date && !isNaN(Date.parse($routeParams.date))) {

        day = new Date($routeParams.date);

    } else {
        day = new  Date();

    }

    console.log(day);


    $scope.days = daysFactory.getDaysForMonth(day);


    $scope.openDialog = function (day){
        var events = angular.copy(day.events);
        return $modal.open({
            templateUrl: '/inline-templates/dialogs/eventDialog.html',
            size: 'sm',
            backdrop: "static",
            controller: ['$scope', '$modalInstance',
                function ($scope, $modalInstance) {

                    $scope.event = {
                        start : day.date,
                        end : day.date
                    };

                    $scope.openPicker = function($event, dp) {
                        $event.preventDefault();
                        $event.stopPropagation();

                        dp.opened = !dp.opened;
                    };

                    $scope.create = function (){
                        events.push($scope.event);
                        day.events = events;
                        $modalInstance.close();
                    };

                    $scope.cancel = function (){
                        $modalInstance.dismiss('cancel');
                    };
                }]
        }).result;
    };


});