module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          port: 8080,
          base: 'dist'
        }
      }
    },
    clean: ['dist'],
    copy: {
      sources: {
        files: [
          {expand: true, cwd: 'src', src: ['**/*.html'], dest: 'dist/'},
          {expand: true, cwd: 'src', src: ['js/**'], dest: 'dist/'}
        ]
      }
    },
    bower: {
      dev: {
        dest: 'dist/vendor'
      }
    },
    react: {
      files: {
        expand: true,
        cwd: 'src/templates',
        src: ['**/*.jsx'],
        dest: 'dist/templates',
        ext: '.js'
      }
    }
  });

  require("load-grunt-tasks")(grunt);

  grunt.registerTask('start', ['build', 'connect:server:keepalive']);
  grunt.registerTask('build', ['clean', 'copy:sources', 'bower', 'react']);
};
