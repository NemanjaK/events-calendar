cal.factory('popoverFactory', function ($compile, $templateCache, $q, $http) {
    var promises = [];
    var getTemplate = function (templateURL) {
        var def = $q.defer();
        var template = $templateCache.get(templateURL);
        if (!template) {
            if(!promises.length) {
                $http.get(templateURL).success(function (data) {
                    $templateCache.put(templateURL, data);
                    angular.forEach(promises, function (promise){
                        promise.resolve(data);
                    });
                    promises = [];
                });
            }
            promises.push(def);
        } else {
            def.resolve(template);
        }
        return def.promise;
    };

    var initPopover = function (scope, element, templateURL, viewPort, position) {
        getTemplate(templateURL).then(function (popOverContent) {
            var options = {
                content: $compile(popOverContent)(scope),
                placement: position || 'bottom',
                viewport: viewPort,
                trigger: 'manual',
                html: true
            };
            $(element).popover(options);
        });
    };


    return {
        initPopover: initPopover
    };
});