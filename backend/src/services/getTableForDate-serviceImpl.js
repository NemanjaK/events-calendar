var tables = require("../db/globals").tables;
var _ = require("underscore");
var moment = require("moment");

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

var transform = function (date, workers, appointments, tasks, base_tasks, customers, my_materials, my_materialsByAppointmentId, my_base_materials, workDays) {
    var baseTasksById = _.indexBy(base_tasks, "id");
    var customerById = _.indexBy(customers, "id");
    var userWithAppointment = _(_.map(tasks, function (val) {
        return {
            id: val.id,
            spk: val.appointment_id + "-" + val.worker_id,
            appointment_id: val.appointment_id,
            worker_id: val.worker_id
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
                firstName: worker.first_name,
                lastName: worker.last_name,
                start: worker.is_deleted? 0: start,
                end: worker.is_deleted? 0: end,
                color: worker.color,
                order: worker.order,
                img: worker.img,
                isDeleted: worker.is_deleted,
                appointments: _.map(_.filter(appointments, function (appointment) {
                    return userWithAppointment[appointment.id + "-" + worker.id];
                }), function (appointment) {

                    var subTasks = _.map(_.filter(tasks, function (task) {
                        return task.worker_id === worker.id && task.appointment_id === appointment.id;
                    }), function (task) {
                        var t = {
                            id: task.base_task_id,
                            start: task.start,
                            end: task.end,
                            order: task.order,
                            name: baseTasksById[task.base_task_id].name
                        };
                        if (task.pause) {
                            t.pause = task.pause;
                        }
                        return t;
                    });

                    var customer = customerById[appointment.customer_id];

                    var materialsById = _.indexBy(my_base_materials, "id");

                    var materials = my_materialsByAppointmentId ? my_materialsByAppointmentId[appointment.id] : [];

                    materials = _.map(materials, function (material) {
                        var m = materialsById[material.material_id];
                        return {
                            id: material.material_id,
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
                            is_deleted: appointment.is_deleted
                        },
                        customer: {
                            id: customer.id,
                            firstName: customer.first_name,
                            lastName: customer.last_name,
                            phone: customer.phone,
                            birthday: customer.birthday,
                            email: customer.e_mail
                        },
                        tasks: regroupTasks(subTasks)
                    };
                })
            };
            if(!(worker.is_deleted && !w.appointments.length)){
                return w;
            }
        }).filter(function (worker){
            return !!worker;
        })
    };
};

var serviceImpl = function (context, input, callback) {
    var date = input.date;

    var my_workers;
    var my_appointments;
    var my_appointment_ids;
    var my_tasks;
    var my_customers;
    var my_customer_ids;
    var my_base_tasks;
    var my_materials;
    var my_materialsByAppointmentId;
    var my_base_materials;
    var my_week_days;

    tables.worker.findAll({
        where: {
            salon_id: context.salon_id
        }
    }).then(function (result) {
        my_workers = result;
        return tables.appointment.findAll({
            where: {
                salon_id: context.salon_id,
                date: date,
                is_deleted: false
            }
        });
    }).then(function (result) {
        my_appointments = result;
        my_appointment_ids = _.map(my_appointments, function (appointment) {
            return appointment.id;
        });
        my_customer_ids = _.map(my_appointments, function (appointment) {
            return appointment.customer_id;
        });
        return tables.task.findAll({
            where: {
                appointment_id: my_appointment_ids
            }
        });
    }).then(function (result) {
        my_tasks = result;
        return tables.customer.findAll({
            where: {
                id: my_customer_ids
            }
        });
    }).then(function (result) {
        my_customers = result;
        return tables.base_task.findAll({
            where: {
                salon_id: context.salon_id
            }
        });
    }).then(function (result) {
        my_base_tasks = result;
        return tables.week_days.findAll({
            where: {
                salon_id: context.salon_id
            }
        }).then(function (result){
            my_week_days = result;
        });
    }).then(function () {
        if (my_appointments) {
            return tables.material_use.findAll({
                where: {
                    appointment_id: my_appointment_ids
                }
            }).then(function (result) {
                my_materials = result;
            });
        }
    }).then(function () {
        my_materialsByAppointmentId = [];
        if (my_materials) {
            my_materialsByAppointmentId = _.groupBy(my_materials, "appointment_id");
            return tables.material.findAll({
                where: {
                    salon_id: context.salon_id
                }
            }).then(function (result) {
                my_base_materials = result;
            });
        }
    }).then(
        function () {
            var output = transform(date, my_workers, my_appointments, my_tasks, my_base_tasks,
                my_customers, my_materials, my_materialsByAppointmentId, my_base_materials, my_week_days);
            callback(null, output);
        });
};

module.exports = serviceImpl;