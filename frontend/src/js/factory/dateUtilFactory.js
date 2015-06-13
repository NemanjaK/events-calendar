cal.factory('dateUtilFactory', function () {

    var move = function (currDay, dt) {
        var newDay = new Date(currDay.getTime());
        newDay.setDate(currDay.getDate() + dt);
        return newDay;
    };

    var formatDate = function (date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        return year + "-" + month + "-" + day;
    };

    return {
        move: move,
        formatDate: formatDate
    };
});