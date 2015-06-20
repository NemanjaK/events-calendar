cal.directive('calPopover', function ($timeout, popoverFactory) {

    var activePopover = null;

    var ignoreClick = function (e){
        e.stopPropagation();
    };

    return {
        restrict: "A",
        transclude: true,
        template: '<div class=""></div>',
        link: function (scope, element, attrs) {
            var $element = $(element);
            var templateURL = attrs.calPopover;
            var position = attrs.calPopoverPosition;
            var viewPort = attrs.calPopoverViewPort;

            popoverFactory.initPopover(scope, element, templateURL, viewPort, position);

            scope.$close = function () {
                $element.popover('destroy');
                popoverFactory.initPopover(element.scope(), element, templateURL, viewPort, position);
            };

            $(element).on('click', function ($event) {
                var isOppen = $element.next('div.popover:visible').length;
                if (!isOppen) {
                    $element.popover('show');
                    activePopover = scope;
                    element.find('div').addClass('cal-popover-overlay');
                    $timeout(function(){
                        $('.popover.in').on('click', ignoreClick);
                    });
                } else {
                    scope.$close();
                    activePopover = null;
                    element.find('div').removeClass('cal-popover-overlay');
                    $('.popover.in').off('click', ignoreClick);
                }

                $event.preventDefault();
                $event.stopPropagation();
            });
        }
    };
});