cal.factory("monthFactory", function () {

    var months = [
        'tt_january',
        'tt_february',
        'tt_march',
        'tt_april',
        'tt_may',
        'tt_june',
        'tt_july',
        'tt_august',
        'tt_september',
        'tt_october',
        'tt_november',
        'tt_december'
    ];

    
    var getMonths = function (){
        return months;
    };


    return {
        getMonths: getMonths
    };
});