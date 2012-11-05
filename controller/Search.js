/** Search
 * @author : Rafael Erthal
 * @since : 2012-10
 *
 * @description : Módulo que implementa as funcionalidades de busca no feses
 */

module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        auth = require('../Utils.js').auth,
        Search = Model.Search,
        
        reds = require('reds'),
        search = reds.createSearch('search'),
        results;

    Search.find(function (error, searchs) {
        results = searchs;
        for (var i = 0; i < results.length; i++) {
            search.index(results[i].description, i);
        }
    });

    /** GET /search
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Reliza uma busca
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Deslogado
     *
     * @request : {text}
     * @response : {[search]}
     */
    app.get('/search', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');
        
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                search.query(request.param('text', null), function (error, ids) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        var res = [];
                        for (var i in ids) {
                            if (results[i].user === user._id || !results[i].user) {
                                res.push({
                                    entity      : results[i].entity,
                                    relatedId   : results[i].relatedId,
                                    service     : results[i].service,
                                    tool        : results[i].tool,
                                    title       : results[i].title,
                                    description : results[i].description
                                });
                            }
                        }
                        response.send({result : res});
                    }
                });
            }
        });
    });

    /** POST /search
     *
     * @autor : Rafael Erthal
     * @since : 2012-10
     *
     * @description : Registra um item buscável ou edita caso ele ja exista
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Deslogado
     *
     * @request : {entity,relatedId,service,tool,title,description,token}
     * @response : {search}
     */
    app.post('/search', function (request,response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');
        
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                Search.findOne({
                    entity    : request.param('entity', null),
                    relatedId : request.param('relatedId', null),
                    service   : request.param('service', null),
                    tool      : request.param('tool', null),
                    user      : user._id
                }, function (error, search) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        if (search === null) {
                            search = new Search({
                                entity      : request.param('entity', null),
                                relatedId   : request.param('relatedId', null),
                                service     : request.param('service', null),
                                tool        : request.param('tool', null),
                                user        : user._id,
                                title       : request.param('title', null),
                                description : request.param('description', null)
                            });
                            search.save(function (error) {
                                if (error) {
                                    response.send({error : error}); 
                                } else {
                                    response.send({search : search});
                                }
                            });
                        } else {
                            search.title = request.param('title', null);
                            search.description = request.param('description', null);
                            search.save(function (error) {
                                if (error) {
                                    response.send({error : error}) ;
                                } else {
                                    response.send({search : {
                                        entity      : search.entity,
                                        relatedId   : search.relatedId,
                                        service     : search.service,
                                        tool        : search.tool,
                                        title       : search.title,
                                        description : search.description
                                    }});
                                }
                            });
                        }
                    }
                });
            }
        });
    });
}