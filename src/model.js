const request = require('request').defaults({
    gzip: true,
    json: true
})
const config = require('config')

function Model(koop) {}

Model.prototype.getData = function(req, callback) {
    let geometryType
    if (req.params.layer) {
        switch (req.params.layer) {
            case '1':
                geometryType = 'LineString'
                break
            case '2':
                geometryType = 'Polygon'
                break
            case '3':
                geometryType = 'MultiPoint'
                break
            case '4':
                geometryType = 'MultiLineString'
                break
            case '5':
                geometryType = 'MultiPolygon'
                break
            default:
                geometryType = 'Point'
            
        }
    }
    const nodeId = req.params.id
    const host = req.params.host
    const qs = config.archesHosts[host].layers[nodeId]
    
    request({
        url: `${config.archesHosts[host].url}/geojson?geometry_type=${geometryType}`,
        qs: config.archesHosts[host].layers[nodeId]
    }, (err, res, geojson) => {
        if (err) return callback(err)
        
        geojson.features.forEach(function(feature) {
            feature.properties.id = feature.id
        })

        geojson.ttl = config.cacheTimeout

        geojson.metadata = {
            title: 'Koop Arches Provider',
            geometryType: geometryType,
            idField: 'id'
        }

        callback(null, geojson)
    })
}

module.exports = Model