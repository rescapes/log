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
import winston from 'winston';
const {format, loggers: _loggers, transports} = winston
import {compact} from 'rescape-ramda';
import * as R from 'ramda';

// By importing winston.loggers from here we ensure that the logs are inited
const {combine, timestamp, json, label} = format;
const isBrowser = new Function("try {return this===window;}catch(e){ return false;}");

/**
 * Configures the winston transports for use by loggers
 * @param {Object} config
 * @param {String} [config.appLogPath] Default '/tmp' File transport otput dir
 * @param {String} loggerName Default 'default'. Label for log files: rescape-${loggerName}-error|info.log
 * @returns {Object} The transports
 */
export const rescapeTransports = ({appLogPath = '/tmp', loggerName = 'default'}) => {
  return compact({
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    fileError: !isBrowser() ?
      new transports.File({
        filename: `${appLogPath}/rescape-${loggerName}-error.log`,
        level: 'error',
        prettyPrint: true,
        colorize: true,
        silent: false,
        timestamp: false
      }) : null,

    fileCombined: !isBrowser() ?
      new transports.File({
        filename: `${appLogPath}/rescape-${loggerName}-info.log`,
        level: 'info'
      }) : null,

    // Send console info (and log if enabled) to STDOUT, error and warn to STDERR

    // Messages up to and including info
    console: new transports.Console({level: 'info', format: format.simple(), stderrLevels: ['error', 'warn']}),
    // Messages up to and including debug for testing
    consoleDebug: new transports.Console({level: 'debug', format: format.simple(), stderrLevels: ['error', 'warn']})
  });
};


/**
 * Returns the console transport at 'debug' or 'info' level. Returns debug if 'env' === 'test'
 * @param {Object} transports Transports configured with rescapeTransports
 * @param {String} env  Defaults to process.env.NODE_ENV
 * @returns {Object}
 */
const consoleTransport = (transports, env = process.env.NODE_ENV) => {
  return 'test' === env ? transports.consoleDebug : transports.console;
};

/**
 * Creates a winston logger based on the appLogPath, loggerName, and env
 * @param {Object} config
 * @param {String} config.appLogPath
 * @param {String} config.loggerName Named based on the app
 * @param {String} env Defaults to process.env.NODE_ENV
 * @returns {Object}
 */
const createLogger = ({appLogPath, loggerName}, env = process.env.NODE_ENV) => {
  const transports = rescapeTransports({appLogPath, loggerName});
  return {
    format: combine(
      label({label: `rescape-${loggerName}`}),
      timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      json()
    ),
    defaultMeta: {service: 'user-service'},
    transports: R.concat([
        // Set the level to 'info' unless we our NODE_ENV is 'test', in which case set to 'debug'
        consoleTransport(transports, env)
      ],
      // Log files if we are in node
      !isBrowser() ? [
        transports.fileError,
        transports.fileCombined
      ] : []
    )
  };
};

/**
 * Default Transports. It's better to specify appLogPath and loggerName instead of using this
 */
export const rescapeDefaultTransports = rescapeTransports({});

// The default rescape logger, logs to tmp with filename 'rescape-default-info|error'
_loggers.add('rescapeDefault', createLogger({}));

/**
 * Custom logger for a certain app
 * logs to ${appLogPath}/rescape-${loggerName}-info|error
 * @param {Object} config
 * @param {String} [config.loggerName] Logger name
 * @param {String} [config.appLogPath] Logger file path
 * @param [env] Override  process.env.NODE_ENV
 */
export const configureLoggerForApp = ({loggerName, appLogPath}, env = process.env.NODE_ENV) => {
  if (!_loggers.has(loggerName)) {
    _loggers.add(loggerName, createLogger({loggerName, appLogPath}, env));
  }
};

// Test debuggers for forcing debug or info level console
_loggers.add('rescapeForceDebug', createLogger({}, 'test'));
_loggers.add('rescapeForceInfo', createLogger({}, 'not-test'));
export const loggers = _loggers