$(function () {

    const
        {dialog} = require('electron').remote,
        Conf = require('conf'),
        config = new Conf(),
        fs = require('fs'),
        path = require('path'),
        ejs = require('ejs'),
        pjson = require('./package.json')

    setup()

    function setup() {
        // Check if "Wheit" (Light) theme is selected
        if ('Bläk' === config.get('theme')) {
            $('head link#styleSheet').attr('href', 'css/example_dark.css');
        }

        $('.header.row.navi').html(loadTemplate('cmdBox', {}));

        $('footer').prepend('<img src="img/logo.png" height="24px"/> ' + pjson.productName + ' ' + pjson.version + ' - ');

        initContent()

        // Setup buttons
        var cmdBox = $('.cmdBoxNavi');

        cmdBox.find('[data-toggle=config]').on('click', function () {
            showConfig();
        });

        cmdBox.find('[data-toggle=reload]').on('click', function () {
            //reload();
            initContent(loadTemplate('alert', {type:'info', message:'Reload finished.'}));
        });

        cmdBox.find('[data-toggle=theme]').on('click', function () {
            var e = $('head link#styleSheet');

            if (e.attr('href').indexOf('dark') > 0) {
                e.attr('href', 'css/example.css');
            } else {
                e.attr('href', 'css/example_dark.css');
            }
        });
    }

    /**
     * Load a ejs template.
     *
     * @param name
     * @param object
     *
     * @returns {String}
     */
    function loadTemplate(name, object) {
        var tpl = fs.readFileSync(__dirname + '/partials/' + name + '.ejs');
        return ejs.render(tpl.toString(), object);
    }

    function initContent(message) {
        $('#header').html('<h2><img src="img/logo.png" height="70px"/> ' + pjson.productName + ' <code>' + pjson.version + '</code></h2>');
        $('#content').html(loadTemplate('alert', {type:'info', message:'Hey there&hellip;'}));

        if (message) {
            $('#console').html(message);
        }
    }

    /**
     * Show the configuration.
     */
    function showConfig() {
        $('#header').html('<h3><img src="img/logo.png" height="70px"/> Configuration</h3>');
        $('#content').html(loadTemplate('config', {o:config}));
        $('#console').html('');

        $('#btnSaveConfig').on('click', function () {
            saveConfig();
        });

        $('#cfgTheme').on('change', function () {
            var e = $('head link#styleSheet');

            if ('Bläk' === $(this).val()) {
                e.attr('href', 'css/example_dark.css');
            } else {
                e.attr('href', 'css/example.css');
            }
        });
    }

    /**
     * Save the configuration.
     */
    function saveConfig() {
        var examplePath = $('#cfgExample').val(),
            theme = $('#cfgTheme').val(),
            debug = $('#cfgDebug').is(':checked');

        if (false === fs.existsSync(examplePath)) {
            dialog.showErrorBox('Invalid Path', 'The example directory path is invalid');
            return;
        }

        config.set('examplePath', examplePath);
        config.set('debug', debug);
        config.set('theme', theme);

        initContent(loadTemplate('alert', {type:'info', message:'Config saved.'}));
    }
});
