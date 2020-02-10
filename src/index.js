const config = require('config')
const Koop = require('koop')
const routes = require('./routes')
const plugins = require('./plugins')
const auth_direct = require('../auth')
const koop = new Koop()

plugins.forEach((plugin) => {
  koop.register(plugin.instance, plugin.options)
})

// Configure the auth plugin by executing its exported function with requried args
// const auth = auth_direct('pass-in-your-secret', `${__dirname}/user_store.json`, {useHttp:true})
let auth = require('@koopjs/auth-direct-file')('pass-in-your-secret', `${__dirname}/user_store.json`)

// Register the auth plugin
koop.register(auth)

koop.register({
    type: 'provider',
    name: 'arches',
    hosts: true,
    disableIdParam: false,
    idField: 'id',
    Model: require('./model')
})

routes.forEach((route) => koop.server[route.method.toLowerCase()](route.path, route.controller))

const port = config.port || 8080;
koop.server.listen(port, () => koop.log.info(`Koop server listening at ${port}`))
