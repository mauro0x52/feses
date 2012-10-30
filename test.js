var reds = require('reds');

var strings = [
    'empreendemia mineiro bobão',
    'emprendema millor babaca',
    'empreenmia cabeça viado',
    'empeendemia lucas comunista',
    'empreendimia mauro entediado',
    'empriindemia rafael ursinho carinhoso'
];

var search1 = reds.createSearch('search1');

for (var i in strings) {
    search1.index(strings[i], i);
}

search1.query('emprendema').end(function (error, ids) {
    console.log('--------------------------------------')
    for (var i in ids) {
        console.log(strings[i]);
    }
    
    
    
        var search2 = reds.createSearch('search2');

        for (var i in strings) {
            search2.index(strings[i], i);
        }
        search2.query('millor').end(function (error, ids) {
            console.log('--------------------------------------')
            for (var i in ids) {
                console.log(strings[i]);
            }
        });
});

