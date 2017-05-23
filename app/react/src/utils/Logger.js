import * as log from 'loglevel';

const IS_PROD = process.env.NODE_ENV === 'production';

if (!IS_PROD) {
  log.setDefaultLevel('debug');
}

export default log;
