cal.directive('cshdAppointment', function () {

    return {
        restrict: 'A',
        transclude: true,
        templateUrl: '/inline-templates/dirs/appointmentDir.html',
        scope: {},
        link: function (scope, element, attrs) {

        }
    };
});