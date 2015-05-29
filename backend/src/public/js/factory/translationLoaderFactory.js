cal.factory('calTranslationsLoader', function ($q, $http, localStorageService) {

    return function (options) {
        var deferred = $q.defer();
        var locale = options.key;


        var localStorageLangHash =  localStorageService.get('CAL_LANG_' + locale.toUpperCase());
        var langHash = CAL_LANG[locale.toUpperCase()];

        if(localStorageLangHash != langHash){

            return $http.get("translations/trans-" + locale + ".json").then(function (response){

                localStorageService.set('CAL_LANG_' + locale.toUpperCase(), CAL_LANG[locale.toUpperCase()]);
                localStorageService.set('CAL_LANG_' + locale.toUpperCase() + '_DATA', response.data);

                return response.data;
            });
        } else {
            deferred.resolve(localStorageService.get('CAL_LANG_' + locale.toUpperCase() + '_DATA'));
        }

        return deferred.promise;
    };
});