cal.controller('calendarCtrl', function ($scope, $routeParams, $modal, daysFactory, colorFactory, eventsService) {


    console.log($routeParams);

    var day = $routeParams.date? new Date($routeParams.date) : new Date() || new Date();


    if($routeParams.date && !isNaN(Date.parse($routeParams.date))) {

        day = new Date($routeParams.date);

    } else {
        day = new  Date();

    }

    console.log(day);


    $scope.days = daysFactory.getDaysForMonth(day);


    $scope.openDialog = function ($event, day, event){

        $event.preventDefault();
        $event.stopPropagation();

        return $modal.open({
            templateUrl: '/inline-templates/dialogs/eventDialog.html',
            size: 'sm',
            backdrop: "static",
            controller: ['$scope', '$modalInstance',
                function ($scope, $modalInstance) {

                    $scope.mode = !!event;

                    if($scope.mode) {
                        $scope.event = {
                            id: event.id,
                            title: event.title,
                            start: event.start,
                            end: event.end,
                            time: event.time,
                            desc: event.desc,
                            colors: event.colors
                        };
                    } else {
                        var color = colorFactory.getUnUsedColor(day.events, colorFactory.getAllDarkColors());
                        $scope.event = {
                            start : day.date,
                            end : day.date,
                            time: new Date(),
                            colors: colorFactory.getColors(color)
                        };
                    }

                    $scope.openPicker = function($event, dp) {
                        $event.preventDefault();
                        $event.stopPropagation();

                        dp.opened = !dp.opened;
                    };

                    $scope.create = function (form){
                        form.$setPristine();
                        eventsService.edit($scope.event).then(function (){
                            if($scope.mode) {
                                for(var i=day.events.length - 1; i>=0; i--){
                                    if(day.events[i].id == $scope.event.id){
                                        day.events.splice(i, 1);
                                    }
                                }
                            }

                            var events = angular.copy(day.events);
                            events.push($scope.event);
                            day.events = events;
                            $modalInstance.close();

                        }).catch(function (){
                            form.$setDirty();
                        });
                    };

                    $scope.cancel = function (){
                        $modalInstance.dismiss('cancel');
                    };
                }]
        }).result;
    };


});