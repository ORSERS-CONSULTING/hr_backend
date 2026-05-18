const loadConfig = require('./config/env');

(async () => {
  const config = await loadConfig();
  process.env.PORT = config.PORT
  process.env.JWT_SECRET = config.JWT_SECRET;
  process.env.IDCS_TENANT = config.IDCS_TENANT;
  process.env.IDCS_CLIENT_ID = config.IDCS_CLIENT_ID;
  process.env.IDCS_CLIENT_SECRET = config.IDCS_CLIENT_SECRET;
  process.env.GATEWAY_BASE_URL = config.GATEWAY_BASE_URL;
  process.env.ACCESS_TOKEN_TTL = config.ACCESS_TOKEN_TTL || process.env.ACCESS_TOKEN_TTL;
  process.env.REFRESH_TOKEN_PEPPER_OCID = config.REFRESH_TOKEN_PEPPER_OCID,
  process.env.REFRESH_TOKEN_DAYS = config.REFRESH_TOKEN_DAYS,
  require('./index');
})();



