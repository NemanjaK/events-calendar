var Promise = require("bluebird");
var sequelize = require("../db/globals").sequelize;
var resUtil = require("../util/resUtil");
var _ = require("underscore");
var moment = require("moment");

var generalValidator =  require("../validators/generalValidator");

var workerService = require("../services/workerService");
var appointmentService = require("../services/appointmentService");
var baseTaskService = require("../services/baseTaskService");
var materialService = require("../services/materialService");
var clientService = require("../services/clientService");
var appointmentTaskService = require("../services/appointmentTaskService");
var materialInUseService = require("../services/materialInUseService");

module.exports = (function () {

    var regroupTasks = function (taskList) {
        var result = [];
        var currGroup = [];
        result.push(currGroup);
        var prevEnd = 0;

        taskList = _.sortBy(taskList, function (val) {
            return val.order;
        });

        taskList.forEach(function (val, i) {
            if (i > 0 && val.start - prevEnd > 0) {
                // group break
                currGroup = [];
                result.push(currGroup);
            }
            currGroup.push(val);
            prevEnd = val.end;
        });

        return result;
    };

    var transform = function (date, workers, appointments, tasks, base_tasks, customers, materials, materialsByAppointmentId, baseMaterials, workDays) {
        var baseTasksById = _.indexBy(base_tasks, "id");
        var customerById = _.indexBy(customers, "id");
        var userWithAppointment = _(_.map(tasks, function (val) {
            return {
                id: val.id,
                spk: val.appointmentId + "-" + val.workerId,
                appointmentId: val.appointmentId,
                workerId: val.workerId
            };
        })).indexBy("spk");

        var utcDate = moment.utc(date);
        var today = moment.utc();
        today.startOf("day");

        var weekday = utcDate.weekday();
        var d = (weekday + 6) % 7;

        var start = workDays[d].start;
        var end = workDays[d].end;

        var dateValue = "today";

        if (utcDate.isBefore(today) || workDays[d].off) {
            dateValue = "inPast";
        } else if (utcDate.isAfter(today)) {
            dateValue = "inFuture";
        }


        return {
            start: (start - 2 < 0)? 0 : start - 2,
            end: (end + 1 > 23)? 23 : end + 1,
            day: dateValue,
            initial: true,
            workers: _.map(workers, function (worker) {
                var w = {
                    id: worker.id,
                    firstName: worker.firstName,
                    lastName: worker.lastName,
                    start: worker.isDeleted? 0: start,
                    end: worker.isDeleted? 0: end,
                    color: worker.color,
                    order: worker.order,
                    img: worker.img,
                    isDeleted: worker.isDeleted,
                    appointments: _.map(_.filter(appointments, function (appointment) {
                        return userWithAppointment[appointment.id + "-" + worker.id];
                    }), function (appointment) {

                        var subTasks = _.map(_.filter(tasks, function (task) {
                            return task.workerId === worker.id && task.appointmentId === appointment.id;
                        }), function (task) {
                            var t = {
                                id: task.baseTaskId,
                                start: task.start,
                                end: task.end,
                                order: task.order,
                                name: baseTasksById[task.baseTaskId].name
                            };
                            if (task.pause) {
                                t.pause = task.pause;
                            }
                            return t;
                        });

                        var customer = customerById[appointment.customerId];

                        var materialsById = _.indexBy(baseMaterials, "id");

                        var materials = materialsByAppointmentId ? materialsByAppointmentId[appointment.id] : [];

                        materials = _.map(materials, function (material) {
                            var m = materialsById[material.materialId];
                            return {
                                id: material.materialId,
                                name: m.name,
                                unit: m.unit,
                                quantity: m.quantity,
                                cnt: m.cnt,
                                order: m.order
                            };
                        });

                        return {
                            id: appointment.id,
                            details: {
                                id: appointment.id,
                                price: appointment.price,
                                discount: appointment.discount,
                                total: appointment.total,
                                comment: appointment.comment,
                                date: moment.utc(appointment.date).format("YYYY-MM-DD"),
                                start: appointment.start,
                                end: appointment.end,
                                materials: materials,
                                isDeleted: appointment.isDeleted
                            },
                            customer: {
                                id: customer.id,
                                firstName: customer.firstName,
                                lastName: customer.lastName,
                                phone: customer.phone,
                                birthday: customer.birthday,
                                email: customer.email
                            },
                            tasks: regroupTasks(subTasks)
                        };
                    })
                };
                if(!(worker.isDeleted && !w.appointments.length)){
                    return w;
                }
            }).filter(function (worker){
                return !!worker;
            })
        };
    };

    var get = function(req, res){
        var formatResponseCallback = resUtil.createResponseFormatterCallback(res);
        var tasks;
        var workers;
        var weekDays;
        var customers;
        var baseTasks;
        var materials;
        var customerIds;
        var appointments;
        var baseMaterials;
        var appointmentIds;
        var materialsByAppointmentId;

        generalValidator.validateDate(req).then(function (){
            return Promise.props({
                workers: workerService.history(req.user.salon.id),
                appointments: appointmentService.getForDate(req.user.salon.id, req.query.date),
                baseTasks: baseTaskService.history(req.user.salon.id),
                weekDays: workerService.getWorkDays(req.user.salon.id),
                materials: materialService.history(req.user.salon.id)
            });
        }).then(function (result){
            workers = result.workers;
            appointments = result.appointments;
            baseTasks = result.baseTasks;
            baseMaterials = result.materials;
            weekDays = result.weekDays;


            appointmentIds = _.map(result.appointments, function (appointment) {
                return appointment.id;
            });

            customerIds = _.map(result.appointments, function (appointment) {
                return appointment.customerId;
            });

            return Promise.props({
                clients: clientService.getByCustomerIds(customerIds),
                tasks: appointmentTaskService.getTasksForIds(appointmentIds),
                materialsInUse: materialInUseService.getMaterialsForIds(appointmentIds)
            });
        }).then(function (result){
            customers = result.clients;
            tasks = result.tasks;
            materials = result.materialsInUse;

            materialsByAppointmentId = _.groupBy(materials, "appointment_id");

            return transform(req.query.date, workers, appointments, tasks, baseTasks, customers, materials, materialsByAppointmentId, baseMaterials, weekDays);
        }).then(function (result){
            formatResponseCallback(null, result);
        }).catch(function (error){
            formatResponseCallback({
                error: error
            }, true);
        });
    };

    return {
        get: get
    };

}());
