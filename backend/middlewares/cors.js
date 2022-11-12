const allowedCors = [
  'http://myfirstdomainand.nomoredomains.icu/',
  'https://myfirstdomainand.nomoredomains.icu/',
  'http://localhost:3000/',
];

module.exports.cors = (req, res, next) => {
  const { method } = req;
  const { origin } = req.headers;
  // const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";
  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', '*');
    return res.end();
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
};
