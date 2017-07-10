module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        "steal-build": {
            default: {
                options: {
                    steal: {
                        config: __dirname + "/app/config.js",
                        main: "app/app"
                    },
                    buildOptions: {
                        minify: false
                    }
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks("grunt-steal");

    // Default task(s).
    grunt.registerTask('default', ['grunt-steal']);

};
