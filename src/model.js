const request = require('request').defaults({
    gzip: true,
    json: true
})
const config = require('config')

function Model(koop) {}

Model.prototype.getData = function(req, callback) {
    let geometryType;
    if (req.params.layer) {
        switch (req.params.layer) {
            case '1':
                geometryType = 'LineString';
                break;
            case '2':
                geometryType = 'Polygon';
                break;
            case '3':
                geometryType = 'MultiPoint';
                break;
            case '4':
                geometryType = 'MultiLineString';
                break;
            case '5':
                geometryType = 'MultiPolygon';
                break;
            default:
                geometryType = 'Point';
            
        }
    }
    
    request(`${config.archesURL}/geojson`, (err, res, body) => {
        if (err) return callback(err)
        
        const geojson = translate(body, geometryType)

        geojson.ttl = 30;

        geojson.metadata = {
            title: 'Koop Arches Provider',
            geometryType: geometryType
        }

        callback(null, geojson)
    })
}

function translate(input, geometryType) {
    var features = []
    let i = 1;
    input.features.forEach(function(feature) {
        if (feature.geometry.type === geometryType || !geometryType) {
            features.push(feature);
        }
    })
    return {
        type: 'FeatureCollection',
        features: features
    }
}

module.exports = Model