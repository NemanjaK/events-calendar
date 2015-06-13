cal.factory('translationFactory', function ($translate) {

    var change = function (language){
        var locale =  'en';

        angular.forEach(['de', 'en', 'sr'], function (lang){
            if(language == lang) {
                locale = lang;
            }
        });

        return $translate.use(locale);
    };

    return {
        change: change
    };
});