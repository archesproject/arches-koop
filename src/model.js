const request = require('request').defaults({
    gzip: true,
    json: true
})
const config = require('config')
const geometryTypes = [
    'Point',
    'LineString',
    'Polygon',
    'MultiPoint',
    'MultiLineString',
    'MultiPolygon'
]

function Model(koop) {}

Model.prototype.getData = function(req, callback) {
    const geometryType = geometryTypes[req.params.layer]
    const layerName = req.params.id
    const host = req.params.host
    const qs = Object.assign({
        'geometry_type': geometryType
    }, config.archesHosts[host].layers[layerName])
    
    request({
        url: `${config.archesHosts[host].url}/geojson`,
        qs: qs
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