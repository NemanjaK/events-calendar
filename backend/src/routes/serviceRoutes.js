var SERVICE_NAME_PARAM_NAME = "serviceName";
var SERVICE_INPUT_PARAM_NAME = "input";

var servicesImpl = require("../services");
var resUtil = require("../util/resUtil");


function serviceDispatcher(req, res) {
    var serviceName = req.params[SERVICE_NAME_PARAM_NAME];
    var serviceInput = req.params[SERVICE_INPUT_PARAM_NAME] || req.body[SERVICE_INPUT_PARAM_NAME] || {};

    if (servicesImpl.hasOwnProperty(serviceName)) {
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);
        try {
            servicesImpl[serviceName](req.user, serviceInput, formatResponseCallback);
            // TODO - add timeout
        } catch (serviceInvocationError) {
            createResponseFormatterCallback(serviceInvocationError, null);
        }
    } else {
        res.status(404).send('Unknown service ' + serviceName);
    }
}

module.exports = function (app) {
    app.all("/services/:serviceName", serviceDispatcher);
};