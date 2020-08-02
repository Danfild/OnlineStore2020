const winston = require('winston');

const { splat, combine, timestamp, printf } = winston.format;

// meta param is ensured by splat()
const myFormat = printf(({ timestamp, level, message, meta }) => {
  return `${timestamp} ${level}: ${message} ${meta? JSON.stringify(meta) : ''}`;
});

const logger = winston.createLogger({
  format: combine(
    timestamp(),
    splat(),
    myFormat
  ),
  transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: '/var/log/shop/main.log' })
    ]
});

module.exports.logger = logger;