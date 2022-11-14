const allowedCors = [
  'http://myfirstdomainand.nomoredomains.icu',
  'http://myfirstdomainand.nomoredomains.icu/users/me',
  'http://myfirstdomainand.nomoredomains.icu/cards',
  'https://myfirstdomainand.nomoredomains.icu',
  'https://myfirstdomainand.nomoredomains.icu/users/me',
  'https://myfirstdomainand.nomoredomains.icu/cards',
];
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports.cors = (req, res, next) => {
  console.dir('done')
  const { method } = req;
  const { origin } = req.headers;

  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    return res.end();
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
};
