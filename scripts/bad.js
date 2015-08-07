/**
 * Реализация API, не изменяйте ее
 * @param {string} url
 * @param {function} callback
 */
function getData(url, callback) {
    var RESPONSES = {
        '/countries': [
            {name: 'Cameroon', continent: 'Africa'},
            {name :'Fiji Islands', continent: 'Oceania'},
            {name: 'Guatemala', continent: 'North America'},
            {name: 'Japan', continent: 'Asia'},
            {name: 'Yugoslavia', continent: 'Europe'},
            {name: 'Tanzania', continent: 'Africa'}
        ],
        '/cities': [
            {name: 'Bamenda', country: 'Cameroon'},
            {name: 'Suva', country: 'Fiji Islands'},
            {name: 'Quetzaltenango', country: 'Guatemala'},
            {name: 'Osaka', country: 'Japan'},
            {name: 'Subotica', country: 'Yugoslavia'},
            {name: 'Zanzibar', country: 'Tanzania'},
        ],
        '/populations': [
            {count: 138000, name: 'Bamenda'},
            {count: 77366, name: 'Suva'},
            {count: 90801, name: 'Quetzaltenango'},
            {count: 2595674, name: 'Osaka'},
            {count: 100386, name: 'Subotica'},
            {count: 157634, name: 'Zanzibar'}
        ]
    };

    setTimeout(function () {
        var result = RESPONSES[url];
        if (!result) {
            return callback('Unknown url');
        }

        callback(null, result);
    }, Math.round(Math.random * 1000));
}

/**
 * Ваши изменения ниже
 */

/**
 * Область видимости переменной request (как и функции callback)
 * находится за пределами текущего цикла for.
 * Поэтому каждая итерация поочереди будет присваивать ей различные значения, и в итоге переменная примет значение "/populations".
 * Следовательно, к тому моменту, когда запрос к api
 * будет обработан, все три коллбэка вызовутся со значением этой переменной равной "/populations".
 * Так как эта переменная задает значение ключа в объекте requests,
 * то каждый коллбэк начиная со второго будет перезаписывать результат предыдущего.
 * Таким образом, в объекте requests так и не наберется
 * трех записей, чтобы вычисления могли продолжиться.
 * 
 * В данном случае, проблему можно решить,
 * организовав замыкание, и передавая название запроса в коллбэк.
 * 
 * В будущем подобной ошибки можно избежать,
 * объявляя переменные с учетом hoisting'а.
 * 
 * Помимо прочего,
 * в коде встречается масса антишаблонов,
 * я комментировал их по ходу.
 */

var requests = ['/countries', '/cities', '/populations'];// здесь и далее лучше использовать single var pattern
var responses = {};

for (i = 0; i < 3; i++) {// переменная i объявляется глобальной
    var request = requests[i];
    
    // переменная request и функция callback "поднимутся" и будут перезаписываться в каждой итерации, необходимо вынести их объявление выше
    var callback = function (error, result) {
        responses[request] = result;
        var l = [];// нет необходимости создавать массив, длину объекта можно считать проще
        
        for (K in responses)// лучше со скобками
            l.push(K);

        if (l.length == 3) {// число захардкожено, а проверку на равенство лучше осуществлять без приведения типов
            var c = [], cc = [], p = 0;// непонятные названия переменных
            
            // здесь и далее лучше кэшировать длину массива, чтобы не считать ее на каждой итерации
            for (i = 0; i < responses['/countries'].length; i++) {
            	// "Africa" захардкожена, почему бы не вынести ее в отдельную переменную
                if (responses['/countries'][i].continent === 'Africa') {
                    c.push(responses['/countries'][i].name);
                }
            }

            for (i = 0; i < responses['/cities'].length; i++) {
                for (j = 0; j < c.length; j++) {// j теперь тоже глобальная
                    if (responses['/cities'][i].country === c[j]) {
                        cc.push(responses['/cities'][i].name);
                    }
                }
            }

            for (i = 0; i < responses['/populations'].length; i++) {
                for (j = 0; j < cc.length; j++) {
                    if (responses['/populations'][i].name === cc[j]) {
                        p += responses['/populations'][i].count;
                    }
                }
            }

            console.log('Total population in African cities: ' + p);
        }
    };

    getData(request, callback);
}