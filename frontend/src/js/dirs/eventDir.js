cal.directive('calEvent', function () {

    return {
        restrict: 'A',
        scope: {
            calAttrIndex: "=",
            calAttrTotal: "="
        },
        link: function (scope, element, attrs) {

            if(scope.calAttrTotal <= 5) {
                if(scope.calAttrIndex ) {
                    element.addClass('cal-event').addClass('cal-event-xl');
                } else {
                    element.addClass('cal-event').addClass('cal-event-lg');
                }
            } else {
                element.addClass('cal-event').addClass('cal-event-sm');
            }

        }
    };
});