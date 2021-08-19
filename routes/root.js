'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    fastify.log.info("GET /")
    for (let i = 0; i < 10000; i++) {}
    return {root: true}
  })
}
