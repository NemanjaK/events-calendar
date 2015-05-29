cal.factory('appointmentService', function ($http) {

    var createAppointment = function (data) {
        return $http.post("/appointment", data);
    };

    var removeAppointment = function (id) {
        return $http.delete("/appointment", {
            params: {
                id: id
            }
        });
    };

    var editAppointment = function (data) {
        return $http.post("/appointment/edit/" + data.appointment.id, data);
    };

    var updateAppointment = function (data) {
        return $http.post("/appointment/update/" + data.appointment.id, data);
    };

    var get = function(id) {
        return $http.get("/appointment/" + id);
    };

    return {
        get: get,
        editAppointment: editAppointment,
        createAppointment: createAppointment,
        removeAppointment: removeAppointment,
        updateAppointment: updateAppointment
    };
});