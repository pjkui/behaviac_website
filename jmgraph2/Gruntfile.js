'use strict';
module.exports = function (grunt) {
    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';',
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n/* TencentOpen Behaviac Team*/'
            },
            dist: {
                src: ['src/common/jmUtils.js',
                    'src/models/jmGradient.js',
                    'src/models/jmShadow.js',
                    'src/common/jmObject.js',
                    'src/common/jmProperty.js',
                    'src/common/jmEvents.js',
                    'src/common/jmControl.js',
                    'src/shapes/jmShape.js',
                    'src/shapes/jmPath.js',
                    'src/shapes/jmLine.js',
                    'src/shapes/jmCircle.js',
                    'src/shapes/jmArc.js',
                    'src/shapes/jmHArc.js',
                    'src/shapes/jmPrismatic.js',
                    'src/shapes/jmBezier.js',
                    'src/shapes/jmRect.js',
                    'src/shapes/jmSequence.js',
                    'src/shapes/jmArraw.js',
                    'src/controls/jmLabel.js',
                    'src/controls/jmImage.js',
                    'src/controls/jmResize.js',
                    'src/controls/jmArrawLine.js',
                    'src/controls/jmTooltip.js',
                    'src/common/jmGraph.js',
                    'src/editor/jmCell.js',
                    'src/editor/jmConnectLine.js',
                    'src/editor/jmEditor.js'],

                dest: 'src/jm.libs.js'
            }
        },
        uglify: {
            build: {
                src: 'src/jm.libs.js',
                dest: 'src/jm.libs.min.js'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    // 默认任务
    grunt.registerTask('default', ['concat', 'uglify']);
}