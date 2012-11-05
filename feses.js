/** Feses
 *
 * @autor : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Server de busca da empreendemia
 */

var express = require('express'),
    config  = require('./config.js');

var app = module.exports = express();

/*  Configurando o server */

app.configure(function () {
    "use strict";

    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.set('view engine', 'ejs');

    //caso seja ambiente de produção, esconder erros
    if (config.host.debuglevel === 0) {
        app.use(express.errorHandler({ dumpExceptions: true }));
    }

    app.use(app.router);
});

/*  Chamando controllers */
require('./controller/Search.js')(app);

/*  Métodos para dev e teste */
app.options('/*', function (request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'POST');
    response.end();
});

app.get('/ping', function (request, response) {
    "use strict";

    response.send(true);
});

/*  Ativando o server */
app.listen(config.host.port);