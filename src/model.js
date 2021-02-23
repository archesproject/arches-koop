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
    let propertyMap = null
    if (qs.properties) {
        propertyMap = qs.properties
        delete qs.properties
    }
    qs.type = geometryType
    
    request({
        url: `${config.archesHosts[host].url}/geojson`,
        qs: qs
    }, (err, res, geojson) => {
        if (err) return callback(err)
        
        geojson.features.forEach(function(feature) {
            if (qs.nodeid) feature.properties.nodeid = qs.nodeid
            if (propertyMap) {
                let properties = {}
                for (incomingKey in propertyMap) {
                    let outgoingKey = propertyMap[incomingKey]
                    properties[outgoingKey] = feature.properties[incomingKey] || null;
                }
                feature.properties = properties;
            }
            feature.properties.id = feature.id
            feature.properties.OBJECTID = feature.properties.id
            delete feature.properties.id
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
