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
 
( function( window, document, getData ) {
    var requests = [ '/countries', '/cities', '/populations' ],
        processed_continent = 'Africa';
        
    var countPopulation = function( data, in_location ) {
        var result_countries = [],
            result_cities = [],
            total_population = 0,
            response_countries = data[ '/countries' ],
            response_countries_length = response_countries.length,
            current_country,
            countries_length,
            response_cities = data[ '/cities' ],
            response_cities_length = response_cities.length,
            current_city,
            cities_length,
            response_populations = data[ '/populations' ],
            response_populations_length = response_populations.length,
            current_population,
            i,
            j,
            location_is_country,
            location_is_city;
            
        if ( in_location !== undefined ) {
            location_is_country = response_countries.some( function( element ) {
                return element.name === in_location;
            } );
            
            location_is_city = response_cities.some( function( element ) {
                return element.name === in_location;
            } );
        }
        
        for ( i = 0; i < response_countries_length; i++ ) {
            current_country = response_countries[ i ];
        
            if ( current_country.continent === processed_continent && ( location_is_country ? current_country.name === in_location : true ) ) {
                result_countries.push( current_country.name );
            }
        }
        
        countries_length = result_countries.length;

        for ( i = 0; i < response_cities_length; i++ ) {
            current_city = response_cities[ i ];
        
            for ( j = 0; j < countries_length; j++ ) {
                if ( current_city.country === result_countries[ j ] && ( location_is_city ? current_city.name === in_location : true ) ) {
                    result_cities.push( current_city.name );
                }
            }
        }
        
        cities_length = result_cities.length;
        
        if ( in_location ? location_is_country || location_is_city : true ) {
            for ( i = 0; i < response_populations_length; i++ ) {
                current_population = response_populations[ i ];
            
                for ( j = 0; j < cities_length; j++ ) {
                    if ( current_population.name === result_cities[ j ] ) {
                        total_population += current_population.count;
                    }
                }
            }
        } else {
            total_population = 0;
        }

        console.log( 'Total population of %s: %d', in_location || processed_continent, total_population );
    };
        
    var processor = function ( all_requests, current_request, error, responses, result ) {
        var responces_length = 0,
            response_key,
            all_requests_length = all_requests.length;
            
        responses[ current_request ] = result;
        
        for ( response_key in responses ) {
            if ( responses.hasOwnProperty( response_key ) === true ) {
                responces_length++;
            }
        }
        
        if ( responces_length === all_requests_length ) {
            countPopulation( responses );
            
            countPopulation( responses, window.prompt( 'Enter country or city of ' + processed_continent, 'Tanzania' ) );
        }
    };
    
    var sendRequest = function( all_requests, current_request, responses, callback ) {
        getData( current_request, function( error, result ) {
            callback( all_requests, current_request, error, responses, result );
        } );
    };
    
    var sendAllRequests = function( all_requests ) {
        var requests_length = all_requests.length,
            responses = {},
            i;
    
        for ( i = 0; i < requests_length; i++ ) {
           sendRequest( all_requests, requests[ i ], responses, processor );
        }
    };
    
    sendAllRequests( requests );
} )( window, document, window.getData );