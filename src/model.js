const request = require('request').defaults({
    gzip: true,
    json: true
})
const config = require('config')
const geometryTypes = {
    0: 'Point',
    1: 'LineString',
    2: 'Polygon',
    3: 'MultiPoint',
    4: 'MultiLineString',
    5: 'MultiPolygon'
}

function Model(koop) {}

Model.prototype.getData = function(req, callback) {
    const geometryType = geometryTypes[req.params.layer]
    const layerName = req.params.id
    const host = req.params.host
    const qs = config.archesHosts[host].layers[layerName]
    
    request({
        url: `${config.archesHosts[host].url}/geojson?geometry_type=${geometryType}`,
        qs: config.archesHosts[host].layers[layerName]
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