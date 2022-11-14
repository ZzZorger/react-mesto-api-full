const allowedCors = [
  'http://myfirstdomainand.nomoredomains.icu',
];
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST';

module.exports.cors = (req, res, next) => {
  const { method } = req;
  const { origin } = req.headers;

  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedCors.includes(origin)) {
    console.log(origin)
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
  }
  return next();
};
