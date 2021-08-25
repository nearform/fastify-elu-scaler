'use strict'

const prometheus = require('prom-client')

module.exports = async function (fastify, opts) {
  fastify.get('/metrics', async (request, reply) => {
    request.log.info("GET /metrics")
    const metricsData = await prometheus.register.metrics()
    return metricsData
  })
}
