cal.factory('daysFactory', function () {

    var getDaysForMonth = function (date){
        var days = [];


        var month = date.getMonth();
        var year = date.getFullYear();

        var lastDayOfMonth = new Date(year, month + 1, 0).getDate();

        var lastDayOfPrevMonth = new Date(year, month, 0).getDate();

        var dayOfWeekForMonthStart = new Date(year, month, 1).getDay();

        for(var i = 0; i < dayOfWeekForMonthStart - 1; i++) {
            days.unshift(lastDayOfPrevMonth-i);
        }
        for(i = 1; i <= lastDayOfMonth; i++) {
            days.push(i);
        }

        var totalDaysInCalendar = 6 * 7;
        var nextMonthDays = totalDaysInCalendar - lastDayOfMonth - dayOfWeekForMonthStart + 1;
        for(i = 1; i <= nextMonthDays; i++) {
            days.push(i);
        }
        
        
        return days;
    };
    
    return {
        getDaysForMonth: getDaysForMonth
    };
});