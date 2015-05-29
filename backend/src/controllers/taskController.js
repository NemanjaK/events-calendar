var Promise = require("bluebird");
var sequelize = require("../db/globals").sequelize;
var resUtil = require("../util/resUtil");

var taskValidator =  require("../validators/taskValidator");

var taskService = require("../services/taskService");

module.exports = (function () {


    var update = function (req, res){
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);
        taskValidator.validateUpdate(req).then(function (){
            return taskService.update(req.user.user_account.id, req.user.salon.id, req.body.appointmentId, req.body.taskId, req.body.workerId);
        }).then(function (result){
            formatResponseCallback(null, result);
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };

    return {
        update: update
    };

}());
