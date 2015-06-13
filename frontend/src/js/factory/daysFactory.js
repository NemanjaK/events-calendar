cal.factory('daysFactory', function () {

    var getDaysForMonth = function (date){
        var days = [];


        var month = date.getMonth();
        console.log(month);
        var year = date.getFullYear();

        var lastDayOfMonth = new Date(year, month + 1, 0).getDate();

        var lastDayOfPrevMonth = new Date(year, month, 0).getDate();

        var dayOfWeekForMonthStart = new Date(year, month, 1).getDay();

        for(var i = 0; i < dayOfWeekForMonthStart - 1; i++) {
            var day = lastDayOfPrevMonth-i;
            days.unshift({
                date: new Date(year, month-1, day),
                d: day,
                isCurrentMonth: false,
                events: []
            });
        }
        for(i = 1; i <= lastDayOfMonth; i++) {
            days.push({
                date: new Date(year, month, i),
                d: i,
                isCurrentMonth: true,
                events: []
            });
        }

        var totalDaysInCalendar = 6 * 7;
        var nextMonthDays = totalDaysInCalendar - lastDayOfMonth - dayOfWeekForMonthStart + 1;
        for(i = 1; i <= nextMonthDays; i++) {
            days.push({
                date: new Date(year, month + 1, i),
                d: i,
                isCurrentMonth: false,
                events: []
            });
        }
        
        
        return days;
    };
    
    return {
        getDaysForMonth: getDaysForMonth
    };
});