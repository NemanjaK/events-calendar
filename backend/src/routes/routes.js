var settingsProfileController = require('../controllers/settingsProfileController');
var accountController = require('../controllers/accountController');
var workerController = require('../controllers/workerController');
var servicesController = require('../controllers/servicesController');
var materialsController = require('../controllers/materialsController');
var appointmentController = require('../controllers/appointmentController');
var categoryController = require('../controllers/categoryController');
var clientController = require('../controllers/clientController');
var currencyController = require('../controllers/currencyController');
var languageController = require('../controllers/languageController');
var statsController = require('../controllers/statsController');
var taskController = require('../controllers/taskController');
var tableController = require('../controllers/tableController');

module.exports = function (app) {


    app.namespace('/salon', function() {

        app.namespace('/settings', function() {

            app.namespace('/profile', function() {

                app.post("/", settingsProfileController.saveProfile);

                app.get("/", settingsProfileController.getProfile);
            });

            app.namespace('/account', function() {

                app.post("/", accountController.saveAccount);

                app.get("/", accountController.getAccount);
            });

            app.namespace('/worker', function() {

                app.post("/", workerController.saveWorker);

                app.post("/reorder", workerController.reorderWorkers);

                app.delete("/", workerController.removeWorker);

                app.get("/", workerController.getWorkers);

                app.get("/history", workerController.history);

                app.get("/appointments", workerController.getWorkerAppointments);
            });

            app.namespace('/services', function() {

                app.post("/", servicesController.save);

                app.post("/orderBy", servicesController.saveOrderBy);

                app.post("/reorder", servicesController.reorder);

                app.delete("/", servicesController.remove);

                app.get("/", servicesController.getAll);
            });

            app.namespace('/materials', function() {

                app.post("/", materialsController.save);

                app.post("/orderBy", materialsController.saveOrderBy);

                app.post("/reorder", materialsController.reorder);

                app.delete("/", materialsController.remove);

                app.get("/", materialsController.getAll);
            });
        });

    });

    app.namespace('/appointment', function() {

        app.post("/", appointmentController.create);

        app.post("/edit/:id", appointmentController.edit);

        app.post("/update/:id", appointmentController.update);

        app.get("/:id", appointmentController.get);

        app.delete("/", appointmentController.remove);
    });

    app.namespace('/client', function() {

        app.post("/", clientController.save);

        app.post("/reorder", clientController.reorder);

        app.delete("/", clientController.remove);

        app.get("/", clientController.getAll);

        app.get("/profile/:id", clientController.get);

        app.get("/history", clientController.history);

        app.get("/find", clientController.find);
    });

    app.namespace('/category', function() {

        app.post("/", categoryController.save);

        app.post("/reorder", categoryController.reorder);

        app.delete("/", categoryController.remove);

        app.get("/", categoryController.getAll);
    });

    app.namespace('/worker', function() {

        app.get("/", workerController.getWorker);
    });

    app.namespace('/task', function() {

        app.post("/update", taskController.update);
    });

    app.namespace('/currency', function() {

        app.get("/", currencyController.getAll);
    });

    app.namespace('/language', function() {

        app.get("/", languageController.getAll);
    });

    app.namespace('/table', function() {

        app.get("/", tableController.get);
    });

    app.namespace('/stats', function() {

        app.get("/appointments", statsController.appointments);

        app.get("/services", statsController.services);

        app.get("/clients", statsController.clients);

        app.get("/workers", statsController.workers);
    });
};