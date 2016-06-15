// Copyright (c) QNAP Systems, Inc. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

/**
 * The `qnap-qiot-generic` module contains code common to the Azure IoT Hub Device and Service SDKs.
 * 
 * @module qnap-qiot-generic
 */

module.exports = {
  anHourFromNow: require('./lib/authorization.js').anHourFromNow,
  encodeUriComponentStrict: require('./lib/authorization.js').encodeUriComponentStrict,
  ConnectionString: require('./lib/connection_string.js'),
  endpoint: require('./lib/endpoint.js'),
  errors: require('./lib/errors.js'),
  results: require('./lib/results.js'),
  Message: require('./lib/message.js'),
  Config: require('./conofig/lib/config.js'),
  SharedAccessSignature: require('./lib/shared_access_signature.js')
};