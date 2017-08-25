'use strict';

const fs = require('fs'),
      path = require('path'),
      tls = require('tls');

const freeport = require('freeport');

const certificateDetails = {
  get (directory, callback) {
    if (!directory) {
      throw new Error('Directory is missing.');
    }
    if (!callback) {
      throw new Error('Callback is missing.');
    }

    let cert,
        key;

    try {
      /* eslint-disable no-sync */
      cert = fs.readFileSync(path.join(directory, 'certificate.pem'));
      key = fs.readFileSync(path.join(directory, 'privateKey.pem'));
      /* eslint-enable no-sync */
    } catch (ex) {
      return callback(ex);
    }

    freeport((err, port) => {
      if (err) {
        return callback(err);
      }

      const server = tls.createServer({ key, cert }, socket => {
        socket.end('');
      });

      server.listen(port, () => {
        const socket = tls.connect({ port, rejectUnauthorized: false }, () => {
          const details = socket.getPeerCertificate();

          server.close();

          callback(null, {
            subject: {
              country: details.subject.C,
              state: details.subject.ST,
              location: details.subject.L,
              organisation: details.subject.O,
              commonName: details.subject.CN,
              email: details.subject.emailAddress
            },
            issuer: {
              country: details.issuer.C,
              state: details.issuer.ST,
              location: details.issuer.L,
              organisation: details.issuer.O,
              commonName: details.issuer.CN,
              email: details.issuer.emailAddress
            },
            validFrom: new Date(details.valid_from),
            validTo: new Date(details.valid_to)
          });
        });

        socket.end('');
      });
    });
  }
};

module.exports = certificateDetails;