const axios = require("axios");
const { getIdcsToken } = require("./idcsServices");

const crypto = require("crypto");

const REFRESH_PEPPER = process.env.REFRESH_TOKEN_PEPPER_OCID;

if (!REFRESH_PEPPER) {
  throw new Error("REFRESH_TOKEN_PEPPER_OCID is missing");
}

function refreshDigest(refresh_token) {
  return crypto
    .createHmac("sha256", String(REFRESH_PEPPER))
    .update(String(refresh_token))
    .digest("hex");
}

async function callGateway(method, path, { params, data } = {}) {
  const url = `${process.env.GATEWAY_BASE_URL}/${path}`;
  const token = await getIdcsToken(url);
  const res = await axios({
    url,
    method,
    params,
    data,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  return res.data;
}

function authTokensCreate({ user_id, refresh_token, device_id, days = 30 }) {
  if (!device_id) throw new Error("device_id is required");

  const token_hash = refreshDigest(refresh_token);

  return callGateway("POST", "authTokens/create", {
    data: {
      user_id: Number(user_id),
      token_hash,
      device_id: String(device_id),
      days: Number(days),
    },
  });
}

function authTokensValidate({ refresh_token, device_id }) {
  if (!device_id) throw new Error("device_id is required");

  const token_hash = refreshDigest(refresh_token);

  return callGateway("POST", "authTokens/validate", {
    data: {
      token_hash,
      device_id: String(device_id),
    },
  });
}

function authTokensRevoke({ refresh_token, device_id }) {
  if (!device_id) throw new Error("device_id is required");

  const token_hash = refreshDigest(refresh_token);

  return callGateway("POST", "authTokens/revoke", {
    data: {
      token_hash,
      device_id: String(device_id),
    },
  });
}

function authTokensRevokeByUserDevice({ user_id, device_id }) {
  if (!device_id) throw new Error("device_id is required");
  if (!Number.isFinite(Number(user_id))) {
    throw new Error("user_id must be numeric");
  }

  return callGateway("POST", "authTokens/revokeByUserDevice", {
    data: {
      user_id: Number(user_id),
      device_id: String(device_id),
    },
  });
}


function userAuthentication({ username, password }) {
  if (!username) throw new Error("username is required");
  if (!password) throw new Error("password is required");


  return callGateway("POST", "userAuthentication", {
    data: {
      username: String(username),
      password: String(password),
    },
  });
}

module.exports={
    authTokensCreate,
    authTokensValidate,
    authTokensRevoke,
    authTokensRevokeByUserDevice,
    userAuthentication
}