'use strict';

var fs = require('fs'),
    path = require('path'),
    tls = require('tls');

var freeport = require('freeport');

var certificateDetails = {
  get: function get(directory, callback) {
    if (!directory) {
      throw new Error('Directory is missing.');
    }
    if (!callback) {
      throw new Error('Callback is missing.');
    }

    var cert = void 0,
        key = void 0;

    try {
      /* eslint-disable no-sync */
      cert = fs.readFileSync(path.join(directory, 'certificate.pem'));
      key = fs.readFileSync(path.join(directory, 'privateKey.pem'));
      /* eslint-enable no-sync */
    } catch (ex) {
      return callback(ex);
    }

    freeport(function (err, port) {
      if (err) {
        return callback(err);
      }

      var server = tls.createServer({ key: key, cert: cert }, function (socket) {
        socket.end('');
      });

      server.listen(port, function () {
        var socket = tls.connect({ port: port, rejectUnauthorized: false }, function () {
          var details = socket.getPeerCertificate();

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
            metadata: {
              validFrom: new Date(details.valid_from),
              validTo: new Date(details.valid_to),
              fingerprint: details.fingerprint,
              serialNumber: details.serialNumber
            }
          });
        });

        socket.end('');
      });
    });
  }
};

module.exports = certificateDetails;