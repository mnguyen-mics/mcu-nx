import log from 'loglevel';

const IS_PROD = process.env.NODE_ENV === 'production';

if (!IS_PROD) {
  log.setLevel('DEBUG');
}

export default log;
