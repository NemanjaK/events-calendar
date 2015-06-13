cal.factory('eventsService', function ($http, $q, $timeout) {

    var edit = function (data) {
        //return $http.post("/event", data);

        data.id = data.id || new Date().getTime();

        var defer = $q.defer();

        $timeout(function (){


            defer.resolve(data);

        }, 2000);

        return defer.promise;
    };

    var remove = function (id){
        return $http.delete("/event/" + id);
    };

    return {
        edit: edit,
        remove: remove
    };
});