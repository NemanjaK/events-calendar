module.exports = (function () {

    var MAX_SERVICE_EXECUTION_TIME = 0; // TODO: YET TO BE TESTED

    var createResponseFormatterCallback = function (res) {
        var timeoutReached = false;
        var timeout = null;
        if (MAX_SERVICE_EXECUTION_TIME > 0) {
            timeout = setTimeout(
                function () {
                    timeoutReached = true;
                    res.send(500).send("Timeout reached"); // TODO
                },
                MAX_SERVICE_EXECUTION_TIME
            );
        }
        var formatResponseCallback = function (err, result) {
            if (timeoutReached) {
                return; // IGNORE RESPONSE
            }
            if (timeout) {
                clearTimeout(timeout);
            }
            if (err) {
                // TODO - log error
                console.error(err);

                res.status(500).json(err);
            } else {
                var serviceResponse = {
                    header: {},
                    response: result
                };
                res.json(serviceResponse);
            }
        };
        return formatResponseCallback;
    };

    return {
        createResponseFormatterCallback : createResponseFormatterCallback
    };

}());