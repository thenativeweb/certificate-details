'use strict';

const path = require('path');

const assert = require('assertthat');

const certificateDetails = require('../../lib/certificateDetails');

suite('certificateDetails', () => {
  test('is an object.', done => {
    assert.that(certificateDetails).is.ofType('object');
    done();
  });

  suite('get', () => {
    test('is a function.', done => {
      assert.that(certificateDetails.get).is.ofType('function');
      done();
    });

    test('throws an error if directory is missing.', done => {
      assert.that(() => {
        certificateDetails.get();
      }).is.throwing('Directory is missing.');
      done();
    });

    test('throws an error if callback is missing.', done => {
      assert.that(() => {
        certificateDetails.get(__dirname);
      }).is.throwing('Callback is missing.');
      done();
    });

    test('returns an error if private key and / or certificate are missing.', done => {
      certificateDetails.get(path.join(__dirname, '..', 'keys', 'none'), err => {
        assert.that(err).is.not.null();
        done();
      });
    });

    test('returns the certificate details.', done => {
      certificateDetails.get(path.join(__dirname, '..', 'keys', 'localhost'), (err, details) => {
        assert.that(err).is.null();
        assert.that(details).is.ofType('object');
        assert.that(details.subject).is.equalTo({
          country: 'DE',
          state: 'Baden-Wuerttemberg',
          location: 'Riegel am Kaiserstuhl',
          organisation: 'the native web UG (haftungsbeschraenkt)',
          commonName: 'localhost',
          email: 'hello@thenativeweb.io'
        });
        assert.that(details.issuer).is.equalTo({
          country: 'DE',
          state: 'Baden-Wuerttemberg',
          location: 'Riegel am Kaiserstuhl',
          organisation: 'the native web UG (haftungsbeschraenkt)',
          commonName: 'localhost',
          email: 'hello@thenativeweb.io'
        });
        assert.that(details.metadata).is.equalTo({
          validFrom: new Date(2015, 4, 20, 19, 20, 50),
          validTo: new Date(2025, 4, 17, 19, 20, 50),
          fingerprint: '75:93:1A:84:70:72:6C:B8:6A:38:87:4B:64:75:A9:C0:10:29:1C:18',
          serialNumber: 'DD08916E9287D8D8'
        });
        done();
      });
    });

    test('returns the certificate details with SANs.', done => {
      certificateDetails.get(path.join(__dirname, '..', 'keys', 'localhost-with-san'), (err, details) => {
        assert.that(err).is.null();
        assert.that(details).is.ofType('object');
        assert.that(details.subject).is.equalTo({
          country: 'DE',
          state: 'Baden-Wuerttemberg',
          location: 'Riegel am Kaiserstuhl',
          organisation: 'the native web GmbH',
          commonName: 'localhost',
          email: 'hello@thenativeweb.io',
          alternativeNames: [ '1.2.3.4' ]
        });
        assert.that(details.issuer).is.equalTo({
          country: 'DE',
          state: 'Baden-Wuerttemberg',
          location: 'Riegel am Kaiserstuhl',
          organisation: 'the native web GmbH',
          commonName: 'localhost',
          email: 'hello@thenativeweb.io'
        });
        assert.that(details.metadata).is.equalTo({
          validFrom: new Date(2017, 9, 6, 14, 15, 38),
          validTo: new Date(2047, 9, 4, 14, 15, 38),
          fingerprint: '7E:1B:07:5A:8A:F8:B2:96:0D:AA:0C:05:35:48:37:08:F8:34:B8:07',
          serialNumber: 'DCF2E1CF89D0A5AD'
        });
        done();
      });
    });
  });
});
