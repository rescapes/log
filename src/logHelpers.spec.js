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

import {loggers, rescapeDefaultTransports} from './logHelpers';
const log = loggers.get('rescapeDefault');

//
// Find items logged between today and yesterday.
//


describe('logHelpers', () => {
  test('rescapeDefaultTransports', done => {
    const from = new Date();
    rescapeDefaultTransports.fileCombined.level = 'info';
    rescapeDefaultTransports.console.level = 'info';
    log.info('Info');
    log.debug('Debug Should not Display');
    rescapeDefaultTransports.fileCombined.level = 'debug';
    rescapeDefaultTransports.console.level = 'debug';
    log.debug('Debug');
    const options = {
      //from,
      //until: new Date(),
      order: 'desc',
      //message: 'Debug Should not Display'
//      fields: ['message']
    };
    log.query(options, function (err, results) {
      if (err) {
        /* TODO: handle me */
        throw err;
      }
      // TODO Can't query the logs
      expect(results.file.length).toBeGreaterThan(0)
      done();
    });
  });

});

