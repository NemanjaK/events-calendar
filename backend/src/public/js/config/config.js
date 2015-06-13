
CAL_LANG.COOKIE = (function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}('claLang'));

var cal = angular.module('cal', ['ngRoute', 'ngAnimate', 'ngMessages', 'LocalStorageModule', 'ui.bootstrap', 'pascalprecht.translate']);


cal.config(
    function ($httpProvider, $routeProvider, $translateProvider, localStorageServiceProvider) {

        $httpProvider.interceptors.push('calHttpInterceptor');
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
        $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.common['Pragma'] = 'no-cache';

        var locale =  'en';
        CAL_LANG.COOKIE = CAL_LANG.COOKIE.toLowerCase();
        angular.forEach(['de', 'en', 'sr'], function (lang){
            if(CAL_LANG.COOKIE == lang) {
                locale = lang;
            }
        });
        $translateProvider.preferredLanguage(locale);

        localStorageServiceProvider.setPrefix('cal');

        $translateProvider.useLoader('calTranslationsLoaderService');

        $routeProvider
            .when('/', {
                templateUrl: '/inline-templates/pages/calendarPage.html'
            })
            .when('/:lang', {
                templateUrl: '/inline-templates/pages/calendarPage.html'
            })
            .when('/:lang/:date', {
                templateUrl: '/inline-templates/pages/calendarPage.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
);