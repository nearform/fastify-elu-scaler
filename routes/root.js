'use strict'

const crypto = require('crypto')

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    fastify.log.info("GET /")
    const salt = crypto.randomBytes(128).toString('base64')
    const hash = crypto.pbkdf2Sync('myPassword', salt, 10000, 512, 'sha512')
    return {root: true}
  })
}
