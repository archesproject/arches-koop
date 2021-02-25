# Arches Koop Application

### Configuration

Add a config file for your environment(s) (development, production, etc) to `/config/`, and define a property called `"archesHosts"` with a property for each named host containing a `"url"` and an array of `"layers"`. Each layer should define parameters to be passed to the Arches [GeoJSON API](https://arches.readthedocs.io/en/latest/api/#geojson).

There is one custom property not in the GeoJSON API which you can attach to properties to ensure a consistent schema in features.  This property is called `properties` and should be an object that maps incoming property names from the GeoJSON API to outgoing property names in the koop service.  If this property is included, 

For example, you could add `/config/development.json` with the following contents:

```json
{
    "archesHosts": {
        "consultations": {
            "url": "http://localhost:8000",
            "layers": {
                "consultations": {
                    "nodeid": "8d41e4d6-a250-11e9-accd-00224800b26d",
                    "nodegroups":"8d41e4ab-a250-11e9-87d1-00224800b26d,8d41e4c0-a250-11e9-a7e3-00224800b26d",
                    "use_display_values": true,
                    "type": "Point"
                },
                "application_areas": {
                    "nodeid": "6c923175-53d9-11e9-8c78-dca90488358a",
                    "nodegroups": "336d34e3-53c3-11e9-ba5f-dca90488358a,5fea7890-9cbb-11e9-ae86-00224800b26d",
                    "use_display_values": true,
                    "type": "Polygon",
                    "properties": {
                        "incoming_property_name": "outgoing_attribute_name"
                    }
                }
            }
        }
    }
}
```

With the server running at localhost:8080, an example layer URL would be: http://localhost:8080/arches/consultations/application_areas/FeatureServer/0

In this example: “consultations” is the host name, “application_areas” is the layer name

### Dev Server

This project by default uses the [Koop CLI](https://github.com/koopjs/koop-cli) to set up the dev server. You can start the server by running:

```
yarn start
```

The server will be running at `http://localhost:8080` or at the port specified at the configuration.

For more details, check the [Koop CLI documentation](https://github.com/koopjs/koop-cli/blob/master/README.md).
