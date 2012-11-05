/** Utils
 *
 * @autor : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Biblioteca de utilidades
 */
var config = require('./config.js');


/** Auth
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : valida o token de um usuário no serviço Auth
 * @param login : username do usuário
 * @param token : token do usuário
 * @param cb : callback a ser chamado após validado o token
 */
exports.auth = function (token, cb) {
    "use strict";

    var http = require('http'),
        options = {
            host: config.services.auth.host,
            path: '/user/validate?token=' + token,
            port: config.services.auth.port,
            method: 'GET'
        };

    http.request(options, function (answer) {
        var str = '';
        //pega os dados recebidos via streaming
        answer.on('data', function (chunk) {
            str += chunk;
        });
        //ao terminar o recebimentos dos dados, chamar o callback com a resposta se o usuário foi ou não autenticado
        answer.on('end', function () {
            var response = JSON.parse(str);
            if (response.error) {
                cb(response.error, undefined);
            } else {
                response.error = undefined;
                cb(undefined, response.user);
            }
        });
    }).end();
};

/** Tasks
 * @author : Rafael Erthal
 * @since : 2012-10
 *
 * @description : pega as tasks de um cliente
 * @param customer : cliente
 * @param token : token do usuário
 * @param cb : callback a ser chamado
 */
exports.tasks = function (customer, token, cb) {
    "use strict";

    var http = require('http'),
        options = {
            host: config.services.tasks.host,
            path: '/tasks?filterByPlace=' + customer._id + '&token=' + token,
            port: config.services.tasks.port,
            method: 'GET'
        };

    http.request(options, function (answer) {
        var str = '';
        //pega os dados recebidos via streaming
        answer.on('data', function (chunk) {
            str += chunk;
        });
        //ao terminar o recebimentos dos dados, chamar o callback com a resposta se o usuário foi ou não autenticado
        answer.on('end', function () {
            var response = JSON.parse(str);
            if (response.error) {
                cb(response.error, undefined);
            } else {
                response.error = undefined;
                cb(undefined, response.tasks);
            }
        });
    }).end();
};

/** removeTask
 * @author : Rafael Erthal
 * @since : 2012-10
 *
 * @description : remove task
 * @param customer : cliente
 * @param token : token do usuário
 * @param cb : callback a ser chamado
 */
exports.removeTask = function (task, token) {
    "use strict";

    var http = require('http'),
        options = {
            host: config.services.tasks.host,
            path: '/task/' + task._id + '/delete?token=' + token,
            port: config.services.tasks.port,
            method: 'POST'
        };

    http.request(options, function (answer) {
        var str = '';
        //pega os dados recebidos via streaming
        answer.on('data', function (chunk) {
            str += chunk;
        });
        //ao terminar o recebimentos dos dados, chamar o callback com a resposta se o usuário foi ou não autenticado
        answer.on('end', function () {
        });
    }).end();
};

exports.files = {
    image: {
        upload : function (file, path, cb) {
            "use strict";
            // arquivo da imagem temporaria
            var tmpFile = file;
            var restler = require('restler');
            // envia o arquivo para o servico Files
            restler.post('http://'+config.services.files.host+':'+config.services.files.port+'/image', {
                multipart: true,
                data: {
                    'path': path,
                    'file': restler.file(tmpFile.path, tmpFile.name, tmpFile.size, null, tmpFile.type)
                }
            }).on('success', function(data) {
                cb(undefined, data.image);
            }).on('error', function(error) {
                cb(error, undefined);
            });
        },
        thumbnail : {
            upload : function (file, path, cb) {
                "use strict";
                // arquivo da imagem temporaria
                var tmpFile = file,
                    restler = require('restler'),
                    resizeUrl = 'http://'+config.services.files.host+':'+config.services.files.port+'/image/resize',
                    sendUrl = 'http://'+config.services.files.host+':'+config.services.files.port+'/image',
                    imagesList = {},
                    originalPath;

                // envia o arquivo para o servico Files
                restler.post(sendUrl, {
                    multipart: true,
                    data: {
                        'path': path,
                        'file': restler.file(tmpFile.path, tmpFile.name, tmpFile.size, null, tmpFile.type)
                    }
                }).on('success', function(data) {
                    if (data.error) {
                        cb(data.error);
                    } else {
                        originalPath = data.image.path;
                        imagesList.original = data.image;


                        // thumbnail de 50 px
                        restler.post(resizeUrl, {
                            data: {
                                'file' : originalPath,
                                'width' : 50,
                                'height' : 50,
                                'label' : 'small',
                                'style' : 'extend'
                            }
                        })
                        .on('success', function (data) {
                            imagesList.small = data.image;
                            // thumbnail de 100 px
                            restler.post(resizeUrl, {
                                data: {
                                    'file' : originalPath,
                                    'width' : 100,
                                    'height' : 100,
                                    'label' : 'medium',
                                    'style' : 'extend'
                                }
                            })
                            .on('success', function (data) {
                                imagesList.medium = data.image;
                                // thumbnail de 200 px
                                restler.post(resizeUrl, {
                                    data: {
                                        'file' : originalPath,
                                        'width' : 200,
                                        'height' : 200,
                                        'label' : 'large',
                                        'style' : 'extend'
                                    }
                                })
                                .on('success', function (data) {
                                    imagesList.large = data.image;
                                    cb(undefined, imagesList);
                                })
                                .on('error', function(error) {
                                    cb(error);
                                });
                            })
                            .on('error', function(error) {
                                cb(error);
                            });
                        })
                    }
                }).on('error', function(error) {
                    cb(error);
                });

            }
        }
    }

}