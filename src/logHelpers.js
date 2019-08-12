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
import {format, transports, loggers, createLogger} from 'winston';
// By importing winston.loggers from here we ensure that the logs are inited
export {loggers} from 'winston';
const {combine, timestamp, json, label} = format;

/**
 * The Transports can be updated using rescapeDefaultTransports.fileCombined.level = 'debug'
 * @type {{console: ConsoleTransportInstance, fileError: FileTransportInstance, fileCombined: FileTransportInstance}}
 */
export const rescapeDefaultTransports = {
  //
  // - Write to all logs with level `info` and below to `combined.log`
  // - Write all logs error (and below) to `error.log`.
  //
  fileError: new transports.File({
    filename: '/tmp/rescape-default-error.log',
    level: 'error',
    prettyPrint: true,
    colorize: true,
    silent: false,
    timestamp: false
  }),
  fileCombined: new transports.File({filename: '/tmp/rescape-default-combined.log', level: 'info'}),
  // Send console info (and log if enabled) to STDOUT, error and warn to STDERR
  console: new transports.Console({format: format.simple(), stderrLevels:['error', 'warn']})
};

const rescapeDefault = {
  format: combine(
    label({label: 'rescape-default'}),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    json()
  ),
  defaultMeta: {service: 'user-service'},
  transports: [
    rescapeDefaultTransports.fileError,
    rescapeDefaultTransports.fileCombined
  ]
};


// Add the default logger.
loggers.add('rescapeDefault', rescapeDefault);
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  loggers.get('rescapeDefault').add(
    rescapeDefaultTransports.console
  );
}
