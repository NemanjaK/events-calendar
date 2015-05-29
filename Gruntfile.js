module.exports = function (grunt) {

    var config = {
        basePath: "",
        serviceName: ""
    };

    var increment = grunt.option('increment') || grunt.template.today('yyyymmdd');


    var versions = grunt.file.readJSON('database/increments/versions.json');



    // load all grunt tasks
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-prompt');
    grunt.loadNpmTasks('grunt-template');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.loadNpmTasks('grunt-file-creator');

    grunt.template.addDelimiters('handlebars-like-delimiters', '{{', '}}');
    grunt.template.addDelimiters('custom-db-delimiters', '{', '}');

    var configObj = {
        options: {
            nospawn: true
        },
        clean: {
            options: {
                force: true
            },
            conf: {
                src: [
                    "conf"
                ]
            },
            node_modules: {
                src: [
                    "node_modules"
                ]
            }
        },
        "file-creator": {
            "incrementSql": {
                files: [
                    {
                        file: "database/increments/inc-" + increment + ".sql",
                        method: function(fs, fd, done) {
                            var text = "INSERT INTO `{-database}`.`increments` (`version`) VALUES ('" + increment + "');"
                            fs.writeSync(fd, text);
                            done();
                        }
                    }
                ]
            },

            "versions": {
                files: [
                    {
                        file: "database/increments/versions.json",
                        method: function(fs, fd, done) {
                            if(versions.indexOf("" + increment) == -1){
                                versions.push("" + increment);
                            }
                            fs.writeSync(fd, JSON.stringify(versions, null, 2));
                            done();
                        }
                    }
                ]
            }
        },
        prompt: {
            serviceConfig: {
                options: {
                    questions: [
                        {
                            config: 'basePath',
                            type: '<question input>',
                            message: 'Enter absolute path to HairDresser folder:',
                            default: '/root/HairDresser'
                        },
                        {
                            config: 'serviceName',
                            type: '<question input>',
                            message: 'Enter service name:',
                            default: 'hairdresser'
                        },
                        {
                            config: 'servicePid',
                            type: '<question input>',
                            message: 'Enter service pid:'
                        },
                        {
                            config: 'port',
                            type: '<question input>',
                            message: 'Enter server port number:',
                            default: '3000'
                        }
                    ],
                    then: function(results, done) {
                        config.basePath = results.basePath;
                        config.serviceName = results.serviceName;

                        configObj.rename.appStart.files[0].dest = './conf/' + config.serviceName + '.conf';

                        grunt.file.write('./backend/src/config.json', JSON.stringify(results, null, 2));

                        grunt.file.write('./conf/' + results.serviceName + '.pid', results.servicePid);

                        done();
                        return true;
                    }
                }
            },
            dbConfig: {
                options: {
                    questions: [
                        {
                            config: 'engine',
                            type: '<question input>',
                            message: 'Enter engine name:',
                            default: 'mysql'
                        },
                        {
                            config: 'host',
                            type: '<question input>',
                            message: 'Enter database host address:',
                            default: 'localhost'
                        },
                        {
                            config: 'database',
                            type: '<question input>',
                            message: 'Enter database name:',
                            default: 'cshd'
                        },
                        {
                            config: 'port',
                            type: '<question input>',
                            message: 'Enter database port number:',
                            default: '3306'
                        },
                        {
                            config: 'username',
                            type: '<question input>',
                            message: 'Enter database username:',
                            default: 'cshd'
                        },
                        {
                            config: 'password',
                            type: 'password',
                            message: 'Enter database password:'
                        }
                    ],
                    then: function(results, done) {
                        grunt.file.write('./database/config.json', JSON.stringify(results, null, 2));
                        done();
                        return true;
                    }
                }
            }
        },
        exec: {
            installBaseDependencies: 'npm install',
            installBackend: 'pwd && cd backend && npm install && pwd && cd src && npm install && grunt install',
            installDataBase: 'pwd && cd database && npm install && grunt install',
            installFrontend: 'pwd && cd frontend/build && npm install',
            buildBackend: 'pwd && cd backend && npm install && cd src && npm install',
            buildDataBaseDev: 'pwd && cd database && npm install && grunt installDev',
            buildDataBase: 'pwd && cd database && npm install && grunt deployModel',
            upgradeDatabase: 'pwd && cd database && npm install && grunt upgrade',
            restoreDatabase: 'pwd && cd database && grunt restore',
            backupDatabase: 'pwd && cd database && grunt backup',
            buildFrontend: 'pwd && cd frontend/build && npm install && grunt prod',
            buildFrontendDev: 'pwd && cd frontend/build && npm install && grunt dev',
            gitPull: 'git pull',
            stopService: 'service temp stop',
            startService: 'service temp start',
            insertInitialData: 'pwd && cd database && grunt insertInitialData',
            gitAdd: 'git add .',
            gitPush: 'git push',
            gitMaster: 'git checkout master',
            gitPushBranch: 'git push -u origin ' + increment,
            gitCommit: 'git commit -a -m "add new increment"',
            createBranch: 'git branch ' + increment,
            removeBranch: 'git branch -d ' + increment,
            checkoutBranch: 'git checkout ' + increment

        },
        template: {
            'appStart': {
                'options': {
                    'data': config,
                    'delimiters': 'handlebars-like-delimiters'
                },
                'files': {
                    'conf/appstart.conf': ['backend/src/appstart.conf.template']
                }
            }
        },
        copy: {
            pidFile: {
                files: [{
                    expand: true,
                    cwd: 'conf',
                    src: ['**/*.pid'],
                    dest: '/var/run'
                }]
            },
            confFile: {
                files: [{
                    expand: true,
                    cwd: 'conf',
                    src: ['**/*.conf'],
                    dest: '/etc/init'
                }]
            }
        },
        rename: {
            appStart: {
                files: [
                    {
                        src: ['conf/appstart.conf']
                        //    dest: will be decided in runtime by prompt:serviceConfig task.
                    }
                ]
            }
        }
    };

    grunt.initConfig(configObj);


    grunt.task.registerTask('installService', ['clean:conf', 'prompt:serviceConfig', 'template:appStart', 'rename:appStart', 'copy:confFile', 'copy:pidFile']);

    grunt.task.registerTask('installServiceDev', ['clean:conf', 'prompt:serviceConfig', 'template:appStart', 'rename:appStart']);

    grunt.task.registerTask('install', ['exec:installBaseDependencies', 'exec:installBackend', 'installService', 'prompt:dbConfig', 'exec:installDataBase', 'exec:installFrontend']);

    grunt.task.registerTask('devBuild', ['exec:buildDataBaseDev', 'exec:buildFrontend']);

    grunt.task.registerTask('devInstall', ['exec:installBaseDependencies', 'exec:installBackend', 'installServiceDev', 'prompt:dbConfig', 'exec:installDataBase', 'exec:installFrontend', 'devBuild']);


    grunt.task.registerTask('insertInitialData', ['exec:insertInitialData']);

    grunt.registerTask('getServiceInfo', 'Get service info', function() {
        config = require('./backend/src/config.json');

        configObj.exec.stopService = 'service ' + config.serviceName + ' stop';
        configObj.exec.startService = 'service ' + config.serviceName + ' start';
    });


    grunt.task.registerTask('redeployFrontend', 'redeploy frontend', function () {
        var tasks = ['getServiceInfo','exec:stopService', 'exec:gitPull', 'exec:buildFrontend', 'exec:startService'];

        // Use the force option for all tasks declared in the previous line
        grunt.option('force', true);
        grunt.task.run(tasks);
    });

    grunt.task.registerTask('redeployDatabase', 'redeploy database', function () {
        var tasks = ['getServiceInfo','exec:stopService', 'exec:gitPull', 'exec:buildDataBaseDev', 'exec:startService'];

        // Use the force option for all tasks declared in the previous line
        grunt.option('force', true);
        grunt.task.run(tasks);
    });


    grunt.task.registerTask('redeploy', 'redeploy frontend and database', function () {
        var tasks = ['getServiceInfo','exec:stopService', 'exec:gitPull', 'exec:buildDataBaseDev', 'exec:buildFrontend', 'exec:startService'];

        // Use the force option for all tasks declared in the previous line
        grunt.option('force', true);
        grunt.task.run(tasks);
    });

    grunt.task.registerTask('runUpgradeScripts', 'upgrade scripts for increments', function () {
        // run upgrade scripts
        var done = this.async();

        var tables = require("./database/test/globals").tables;

        var handleIncrements = function (incs){
            var increments = [];
            if(incs.length){
                var index = versions.indexOf("" + incs[0].version);
                increments = versions.slice(index + 1, versions.length);
            } else {
                increments = versions;
            }

            if(increments.length){
                var tasks = [];
                // gen script
                increments.forEach(function (version){

                    configObj.template['inc-' + version] = {
                        'options': {
                            'data': function(){
                                var config = require('./database/config.json');
                                return {
                                    database: config.database
                                };
                            },
                            'delimiters': 'custom-db-delimiters'
                        },
                        files: {}
                    };

                    configObj.template['inc-' + version].files['database/temp/increments/inc-' + version + '.sql'] = ['database/increments/inc-' + version + '.sql'];

                    tasks.push('template:inc-' + version);
                });

                var config = require('./database/config.json');

                // run scripts
                increments.forEach(function (version){

                    configObj.exec['inc-' + version] = 'mysql -u' + config.username + ' -p' + config.password + ' < database/temp/increments/inc-' + version + '.sql';

                    tasks.push('exec:inc-' + version);

                });

                grunt.task.run(tasks);
            } else {
                console.log("Db on last version. Nothing to do.");
            }

            done();
        };

        if(tables.increments) {
            tables.increments.findAll({
                order: [["id", "DESC"]],
                limit: 1,
                offset: 0
            }).then(handleIncrements);
        } else {
            handleIncrements();
        }

    });


    grunt.task.registerTask('checkoutDatabaseRevision', 'find increment in db and checkout that branch', function () {
        // run upgrade scripts
        var done = this.async();

        var tables = require("./database/test/globals").tables;

        tables.increments.findAll({
            order: [["id", "DESC"]],
            limit: 1,
            offset: 0
        }).then(function (incs){
            var increments = [];
            if(incs.length){
                var version = incs[0].version;
                var tasks = [];

                configObj.exec['checkout-inc-' + version] = ['git checkout ' + version];

                tasks.push('template:checkout-inc-' + version);

                grunt.task.run(tasks);

            } else {
                console.log('There no increments in database.');
            }

            done();
        });
    });


    // accepts increment parameter, default is yyyymmdd
    grunt.task.registerTask('createIncrement', ['exec:gitMaster', 'exec:gitPull', 'file-creator:versions', 'file-creator:incrementSql', 'exec:gitAdd', 'exec:gitCommit', 'exec:gitPush']);

    // accepts increment parameter, default is yyyymmdd
    grunt.task.registerTask('createBranch', ['exec:gitMaster', 'exec:gitPull', 'exec:createBranch', 'exec:gitPushBranch']);

    // accepts increment parameter, default is yyyymmdd
    grunt.task.registerTask('updateTo', 'upgrade to increment', function () {
        var tasks = ['getServiceInfo','exec:stopService', 'exec:backupDatabase', 'exec:checkoutBranch', 'runUpgradeScripts', 'exec:buildDataBase' , 'exec:buildFrontend', 'exec:startService'];

        // Use the force option for all tasks declared in the previous line
        grunt.option('force', true);
        grunt.task.run(tasks);
    });

    //restore database, checkout branch from db
    grunt.task.registerTask('revert', 'revert to previous increment', function () {
        var tasks = ['getServiceInfo','exec:stopService', 'exec:restoreDatabase', 'checkoutDatabaseRevision', 'exec:buildDataBase' , 'exec:buildFrontend', 'exec:startService'];

        // Use the force option for all tasks declared in the previous line
        grunt.option('force', true);
        grunt.task.run(tasks);
    });

    grunt.registerTask('default', []);
};