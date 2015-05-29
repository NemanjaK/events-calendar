cal.factory('calHttpInterceptor', function ($q, $rootScope, $window, $location) {

    var responseError = function (rejection) {
        if (rejection.data) {
            if (rejection.status === 400) {
                console.log(rejection.data);
            } else if (rejection.status === 403 || rejection.status === 503) {
                console.log(rejection.data);
                $location.path("/");
            } else if (rejection.status === 404) {
                console.log(rejection.data);
            } else if (rejection.status === 500) {
                console.log(rejection.data);
            }
        }
        return $q.reject(rejection);
    };

    var request = function (config) {
        return config;
    };

    var response = function (response) {
        return response || $q.when(response);
    };

    return {
        request: request,
        response: response,
        responseError: responseError
    };
});