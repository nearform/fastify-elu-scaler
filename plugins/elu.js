'use strict'

const fp = require('fastify-plugin')
const prometheus = require('prom-client')
const { eventLoopUtilization } = require('perf_hooks').performance;
const { setInterval } = require('timers');

module.exports = fp(async function (fastify, opts) {

  let elu1 = eventLoopUtilization();

  const metric = new prometheus.Summary({
    name: 'event_loop_utilization',
    help: 'ratio of time the event loop is not idling in the event provider to the total time the event loop is running',
    maxAgeSeconds: 60,
    ageBuckets: 5,
    labelNames: ['idle', 'active', 'utilization'],
  })

  setInterval(() => { 
    const elu2 = eventLoopUtilization()
    metric.observe(eventLoopUtilization(elu2, elu1).utilization)
    elu1 = elu2 
  }, 100)
})