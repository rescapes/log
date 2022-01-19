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

import logger from 'js-logger';
import {reqStrPathThrowing} from '@rescapes/ramda';
logger.useDefaults();
/**
 * Creates a js-logger based on the appLogPath, loggerName, and env
 * TODO This used to be winston logging with transports and file logging.
 * Winston doesn't really support teh browser so I removed it. You can see all the codee in the git history
 * @param {Object} config
 * @param {String} config.appLogPath
 * @param {String} config.loggerName Named based on the app
 * @param {String} env Defaults to process.env.NODE_ENV
 * @returns {Object}
 */
const createLogger = ({appLogPath, loggerName, forceDebug=false, forceInfo=false}, env = process.env.NODE_ENV) => {
  const logr = logger.get(loggerName);

  logr.setLevel(!forceInfo && ('test' === env || forceDebug) ? logger.DEBUG : logger.INFO);
  return logr;
};


export const _loggers = {
// The default rescape logger, logs to tmp with filename 'rescape-default-info|error'
  rescapeDefault: createLogger({name: 'rescapeDefault', forceDebug: process.env.LOGGING_FORCE_DEBUG || false}),
  rescapeForceDebug: createLogger({name: 'test', forceDebug: true}),
  rescapeForceInfo: createLogger({name: 'not-test', forceInfo: true})
};
export const loggers = {}
loggers.get = name => {
  return reqStrPathThrowing(name, _loggers);
}
