const config = require('config')
const Koop = require('koop')
const routes = require('./routes')
const plugins = require('./plugins')

const koop = new Koop()

plugins.forEach((plugin) => {
  koop.register(plugin.instance, plugin.options)
})

koop.register({
    type: 'provider',
    name: 'arches',
    hosts: true,
    disableIdParam: false,
    Model: require('./model')
})

routes.forEach((route) => koop.server[route.method.toLowerCase()](route.path, route.controller))

koop.server.listen(config.port, () => koop.log.info(`Koop server listening at ${config.port}`))
