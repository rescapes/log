/**
 * Created by Andy Likuski on 2019.05.30
 * Copyright (c) 2019 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {configureLoggerForApp, rescapeDefaultTransports} from './logHelpers';
import winston from 'winston';
import {existsSync, unlinkSync} from 'fs';

const {loggers} = winston;

//
// Find items logged between today and yesterday.
//


describe('logHelpers', () => {
  test('rescapeDefaultTransports', done => {
    configureLoggerForApp({loggerName: 'unitTests'})
    // Delete the log files
    if (existsSync('/tmp/rescape-unitTests-info.log')) {
      unlinkSync('/tmp/rescape-unitTests-info.log')
    }
    if (existsSync('/tmp/rescape-unitTests-error.log')) {
      unlinkSync('/tmp/rescape-unitTests-error.log')
    }
    const log = loggers.get('unitTests');

    configureLoggerForApp({loggerName: 'unitTestsNoDebug'}, 'info')
    const logNoDebug = loggers.get('unitTestsNoDebug');
    const from = new Date();
    logNoDebug.info('Info');
    logNoDebug.debug('Debug Should not Display');
    log.debug('Debug');
    const options = {
      from: Date.now() - 10000,
      until: Date.now() + 10000,
      rows: 2,
      start: 0,
      order: 'asc',
    };
    log.info('Info to file')
    log.warn('Warn to file')
    log.query(options, function (err, results) {
      if (err) {
        /* TODO: handle me */
        throw err;
      }
      // TODO Can't query the logs
      //expect(results.file.length).toBeGreaterThan(0)
      done();
    });
  }, 100000);

});

