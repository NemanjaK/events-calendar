cal.filter('dateConverter', function ($filter) {
    return function (input, format) {
        var date = new Date(input);
        return $filter('date')(date, format);
    };
});