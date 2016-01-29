require.config({
    waitSeconds: 30, // seconds
    baseUrl: "/src",
    paths: {
        "jquery": "../bower_components/jquery/jquery",
        "angular": "../bower_components/angular/angular",
        "angularAMD": "../bower_components/angularAMD/angularAMD",
        "ngload": "../bower_components/angularAMD/ngload",
        "jqCookie": "../bower_components/jquery-cookie/jquery.cookie",
        "moment": "../bower_components/momentjs/moment",
        "moment-duration-format": "../bower_components/moment-duration-format/lib/moment-duration-format",
        "jsplumb": "../bower_components/jsplumb/dist/js/dom.jsPlumb-1.7.2",

        "lodash": "../bower_components/lodash/lodash.min",

        "d3": "../bower_components/d3/d3",
        "nv.d3": "../bower_components/nvd3/build/nv.d3",
        "doubleLineChart": "nvd3-templates/doubleLineChart",

        "angular-nvd3": "../bower_components/angular-nvd3/dist/angular-nvd3",

        "bootstrap": "../bower_components/bootstrap/dist/js/bootstrap",
        "jqDaterangepicker": "../bower_components/bootstrap-daterangepicker/daterangepicker",

        "jszipGlobal": "./core/common/globals/jszipGlobal",
        "jszip": "../bower_components/js-xlsx/jszip",
        "js-xlsx": "../bower_components/js-xlsx/xlsx",
        "file-saver": "../bower_components/file-saver.js/FileSaver",
        "clipboard": "../bower_components/clipboard/dist/clipboard",
        "autofill-event": "../bower_components/autofill-event/src/autofill-event",

        "async": "../bower_components/async/lib/async",
        "moxie": "../bower_components/plupload/js/moxie",
        "plupload": "../bower_components/plupload/js/plupload.dev",
        "tracekit": "../bower_components/tracekit/tracekit",


        // Angular JS modules
        "ngAnimate": "../bower_components/angular-animate/angular-animate",
        "ngResource": "../bower_components/angular-resource/angular-resource",
        "ngCookies": "../bower_components/angular-cookies/angular-cookies",
        "ngSanitize": "../bower_components/angular-sanitize/angular-sanitize",
        "ngRoute": "../bower_components/angular-route/angular-route",
        "restangular": "../bower_components/restangular/dist/restangular",
        "ui": "../bower_components/angular-ui-utils/ui-utils",
        "ui.router": "../bower_components/angular-ui-router/release/angular-ui-router",
        "ui.router.extras": "../bower_components/ui-router-extras/release/ct-ui-router-extras",
        "ngBootstrap": "../bower_components/ng-bs-daterangepicker/src/ng-bs-daterangepicker",
        "ngTable": "../bower_components/ng-table/ng-table",
        "checklist-model": "../bower_components/checklist-model/checklist-model",
        "ui.bootstrap": "../bower_components/angular-bootstrap/ui-bootstrap-tpls",
        "lvl.directives.dragdrop": "../bower_components/lvlDragDrop/script/lvl-drag-drop",
        "lvlUuid": "../bower_components/lvlDragDrop/script/lvl-uuid",
        "bootstrap-tokenfield": "../bower_components/bootstrap-tokenfield/dist/bootstrap-tokenfield"
    },
    shim: {
        'angular': {deps: ['jquery'], exports: 'angular'},
        'nvd3': {exports: 'nv'},
        'nv.d3': {deps: ['d3']},
        'angular-nvd3': {deps: ['angular', 'nv.d3']},
        'angularAMD': ['angular'],
        'ngCookies': ['angular'],
        'ngAnimate': ['angular'],
        'ngResource': ['angular'],
        'ui.bootstrap': ['angular'],
        'ngSanitize': ['angular'],
        'ngRoute': ['angular'],
        'checklist-model': ['angular'],
        'restangular': ['ngResource', 'lodash'],
        'bootstrap': ['jquery'],
        'jqCookie': ['jquery'],
        'jqDaterangepicker': ['jquery', 'moment'],
        'moment-duration-format': ['moment'],
        'autofill-event': ['jquery'],
        'ngBootstrap': ['angular', 'bootstrap', 'jqDaterangepicker'],
        'ui': ['angular'],
        'ngTable': ['angular'],
        'plupload': {deps: ['moxie'], exports: 'plupload'},
        'ui.router': ['angular'],
        'ui.router.extras': ['angular', 'ui.router'],
        'ngload': ['angularAMD'],
        'js-xlsx': ['angular', 'file-saver'],
        'tracekit': {exports: 'TraceKit'},
        // Navigator configuration
        'core/configuration': ['angular'],
        'lvlUuid': ['angular'],
        'lvl.directives.dragdrop': ['lvlUuid']
    },
    deps: ['app']
});
