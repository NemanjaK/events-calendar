module.exports = function (grunt) {
    // load all grunt tasks
    grunt.loadNpmTasks('grunt-prompt');

    grunt.initConfig({
        options: {
            nospawn: true
        },
        prompt: {
            config: {
                options: {
                    questions: [
                        {
                            config: 'port',
                            type: '<question input>',
                            message: 'Enter server port number:',
                            default: '3000'
                        }
                    ],
                    then: function(results, done) {
                        grunt.file.write('./config.json', JSON.stringify(results, null, 2));
                        done();
                        return true;
                    }
                }
            }
        }
    });

    grunt.task.registerTask('generateConfig', ['prompt:config']);

    grunt.task.registerTask('install', []);

    grunt.registerTask('default', []);
};