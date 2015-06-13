cal.factory("colorFactory", function () {

    var dark = [
        '#da2500',
        '#f76200',
        '#f5a700',
        '#e5d30b',
        '#88c425',
        '#14c3a2',
        '#4fc1e9',
        '#5d9cec',
        '#ac92ec',
        '#ec87c0',
        '#eb9f9f',
        '#c3b399',
        '#a37e58',
        '#656d78'
    ];
    var colors = {
        '#da2500':'#f8d3cc',
        '#f76200':'#fde0cc',
        '#f5a700':'#fdedcc',
        '#e5d30b':'#faf6ce',
        '#88c425':'#e7f3d3',
        '#14c3a2':'#d0f3ec',
        '#4fc1e9':'#dcf3fb',
        '#5d9cec':'#dfebfb',
        '#ac92ec':'#eee9fb',
        '#ec87c0':'#fbe7f2',
        '#eb9f9f':'#fbecec',
        '#c3b399':'#f3f0eb',
        '#a37e58':'#ede5de',
        '#656d78':'#e0e2e4'
    };

    var getColors = function (base) {
        return {
            light: colors[base],
            dark: base
        };
    };

    var getAllDarkColors = function (){
        return dark;
    };

    var getUnUsedColor = function (objectsWithColor, allColors){
        var colors = [].concat(allColors);

        $.each(objectsWithColor, function (i, obj){
            var index = colors.indexOf(obj.colors.dark.toLowerCase());
            if(index != -1) {
                colors.splice(index, 1);
            }
        });

        return colors.length? colors[0] : allColors[0];
    };

    return {
        DEFAULT : '#5d9cec',
        getColors: getColors,
        getUnUsedColor: getUnUsedColor,
        getAllDarkColors: getAllDarkColors
    };
});