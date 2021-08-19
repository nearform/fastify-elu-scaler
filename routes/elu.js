'use strict'

const prometheus = require('prom-client')

module.exports = async function (fastify, opts) {

  fastify.get('/metrics', async (_, reply) => {
    fastify.log.info("GET /metrics")
    reply.send(await  prometheus.register.getSingleMetricAsString("event_loop_utilization"))
  })
}
