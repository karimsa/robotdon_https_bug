# robotdon_https_bug

Proof of Concept and submissions of HTTPS bug.

## Description

The authentication and registration for the platform of RobotDon occurs entirely on
`tools.robotdon.com`. However, this domain has **no HTTPS support whatsoever**.

Due to this, the application is susceptible to a number of MiTM-related attacks. One
of these attacks is the combination of arp spoofing, dns spoofing, and setting up a 
proxy server (i.e. a web server that proxies `tools.robotdon.com`). Through this, an
attacker may poison the entire LAN to redirect all traffic intended for `tools.robotdon.com`
towards a given machine.

This machine could then host a proxy of `tools.robotdon.com` and simply log all credentials.
This attack assumes that both the attacker and the victim are on the same network which
is not the case usually. However, since the primary user audience of RobotDon is students,
this becomes an issue. This is because most students use a shared wifi connection provided
by their university or college and it would be very easy for an attacker to run a MiTM attack
due to this.

## Installation

 - Run `npm install` (assumes that node.js is installed)
 - Install ettercap
 - Ensure that no other application is running on port 80

## Running

To run, provide the main network interface and the victim's IP address to the script. For instace,
to run an attack using the interface 'wlan0' on the victim '192.168.0.2':

```
$ node index.js wlan0 192.168.0.2
```

## Disclaimer

THE CODE IN THIS REPOSITORY IS NOT INTEDED TO BE USED MALICIOUSLY. DO NOT USE IT ON ANY MACHINES
OTHER THAN YOUR OWN.

This code was written for the Bug Bountry Program run by Edusson.

## Lincensing

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the “Software”), to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of
the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.