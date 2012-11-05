/** Search
 * @author : Rafael Erthal
 * @since : 2012-10
 *
 * @description : Representação da entidade de item buscável
 */

var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    searchSchema;

searchSchema = new schema({
    entity      : {type : String, trim : true, required : true},
    relatedId   : objectId,
    service     : {type : String, trim : true, required : true},
    tool        : {type : String, trim : true, required : true},
    title       : {type : String, trim : true, required : true},
    description : {type : String},
    user        : {type : objectId, required : true}
});

/*  Exportando o pacote  */
exports.Search = mongoose.model('Searchs', searchSchema);