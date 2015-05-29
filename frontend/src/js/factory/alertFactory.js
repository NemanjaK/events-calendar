cal.factory('alertFactory', function () {
    var alert = {
        value: null
    };

    var addAlert = function(a){
        alert.value = a;
    };
    
    var removeAlert = function() {
        alert.value = null;
    };
    
    var getAlerts = function(){
        return alert;
    };
    
    return {
        getAlerts: getAlerts,
        addAlert: addAlert,
        removeAlert: removeAlert
    };
});