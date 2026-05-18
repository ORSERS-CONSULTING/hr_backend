require("dotenv").config();
const { getSecret } = require("./vault");

const required = async (name, vaultOcidEnvVar) => {
  // 1. Try normal env var
  if (process.env[name]) return process.env[name];

  // 2. Otherwise, try fetching from OCI Vault
  const secretOcid = process.env[vaultOcidEnvVar];
  if (secretOcid) {
    return await getSecret(secretOcid);
  }

  throw new Error(`Missing config: ${name}`);
};

async function loadConfig() {
  return {
    PORT: process.env.PORT || 3000,
    ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL,  // <— add this line
    JWT_SECRET: await required("JWT_SECRET", "JWT_SECRET_OCID"),
    REFRESH_TOKEN_PEPPER_OCID: await required("REFRESH_TOKEN_PEPPER", "REFRESH_TOKEN_PEPPER_OCID"),
    IDCS_TENANT: await required("IDCS_TENANT", "IDCS_TENANT_OCID"),
    IDCS_CLIENT_ID: await required("IDCS_CLIENT_ID", "IDCS_CLIENT_ID_OCID"),
    IDCS_CLIENT_SECRET: await required("IDCS_CLIENT_SECRET", "IDCS_CLIENT_SECRET_OCID"),
    GATEWAY_BASE_URL: process.env.GATEWAY_BASE_URL,
    REFRESH_TOKEN_DAYS: await required("REFRESH_TOKEN_DAYS"),
  };
}

module.exports = loadConfig;
