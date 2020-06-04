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
    const layerName = req.params.id
    const host = req.params.host
    const qs = Object.assign({}, config.archesHosts[host].layers[layerName])
    const geometryType = qs.type || geometryTypes[req.params.layer]
    qs.type = geometryType
    
    request({
        url: `${config.archesHosts[host].url}/geojson`,
        qs: qs
    }, (err, res, geojson) => {
        if (err) return callback(err)
        
        geojson.features.forEach(function(feature) {
            feature.properties.id = feature.id
            feature.properties.OBJECTID = feature.properties.id
            delete feature.properties.id
            if (qs.nodeid) feature.properties.nodeid = qs.nodeid
        })

        geojson.ttl = config.cacheTimeout

        geojson.metadata = {
            name: layerName,
            displayField: qs.displayField,
            title: 'Koop Arches Provider',
            geometryType: geometryType,
            idField: 'OBJECTID'
        }

        callback(null, geojson)
    })
}

module.exports = Model
