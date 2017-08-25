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
        assert.that(details.validFrom).is.equalTo(new Date(2015, 4, 20, 19, 20, 50));
        assert.that(details.validTo).is.equalTo(new Date(2025, 4, 17, 19, 20, 50));
        done();
      });
    });
  });
});
