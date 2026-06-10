const crypto = require("crypto");
const { signAccessToken } = require("../utils/jwt");

const {
  authTokensCreate,
  authTokensValidate,
  authTokensRevoke,
  authTokensRevokeByUserDevice,
  userAuthentication,
} = require("../services/authServices");

const days = Number(process.env.REFRESH_TOKEN_DAYS || 30);

const accessTokenTtl = process.env.ACCESS_TOKEN_TTL || "30m";

async function persistRefreshToken(userId, refresh_token, device_id) {
  await authTokensCreate({
    user_id: Number(userId),
    refresh_token,
    device_id: String(device_id),
    days,
  });
}

async function login(req, res) {
  try {
    const { username, password, device_id } = req.body || {};

    if (!username) {
      return res.status(400).json({ message: "username is required" });
    }

    if (!password) {
      return res.status(400).json({ message: "password is required" });
    }

    if (!device_id) {
      return res.status(400).json({ message: "device_id is required" });
    }

    const data = await userAuthentication({
      username,
      password,
    });


    if (data?.success !== true && data?.success !== "true") {
      return res.status(401).json({
        message: data?.message || "Invalid credentials",
      });
    }

    const user_id = Number(data.user_id);
    const emp_id = data.emp_id ? String(data.emp_id) : null;

    if (!user_id) {
      return res.status(401).json({
        message: "Invalid login response",
      });
    }

    const access_token = signAccessToken(
      {
        sub: String(user_id),
        role: "user",
        emp_id,
      },
      "30m"
    );

    const refresh_token = crypto.randomBytes(64).toString("hex");

    await authTokensRevokeByUserDevice({
      user_id,
      device_id,
    });

    await persistRefreshToken(user_id, refresh_token, device_id);

    return res.json({
      message: "Login successful",
      access_token,
      refresh_token,
      profile: {
        user_id,
        emp_id,
      },
    });
  } catch (e) {
    console.error("❌ LOGIN ERROR:", e.response?.data || e.message);

    const code = e.response?.status ?? e.upstream?.status ?? 500;

    return res.status(code).json(
      e.response?.data ??
      e.upstream?.data ?? {
        message: e.message || "Login failed",
      }
    );
  }
}

async function refresh(req, res) {
  try {
    const { refresh_token, device_id } = req.body || {};

    if (!refresh_token) {
      return res.status(400).json({ message: "refresh_token required" });
    }

    if (!device_id) {
      return res.status(400).json({ message: "device_id required" });
    }

    const data = await authTokensValidate({
      refresh_token,
      device_id,
    });

    const user_id = Number(data?.user_id);
    const emp_id = data?.emp_id ? String(data.emp_id) : null;

    if (!user_id) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    if (!emp_id) {
      return res.status(401).json({
        message: "Employee ID missing during refresh",
      });
    }

    const access_token = signAccessToken(
      {
        sub: String(user_id),
        role: "user",
        emp_id,
      },
      accessTokenTtl
    );

    const new_refresh_token = crypto.randomBytes(64).toString("hex");

    await authTokensRevoke({
      refresh_token,
      device_id,
    });

    await persistRefreshToken(user_id, new_refresh_token, device_id);

    return res.json({
      access_token,
      refresh_token: new_refresh_token,
      profile: {
        user_id,
        emp_id,
      },
    });
  } catch (e) {
    console.error("❌ REFRESH ERROR:", e.response?.data || e.message);

    const code = e.response?.status ?? e.upstream?.status ?? 500;

    return res.status(code).json(
      e.response?.data ??
      e.upstream?.data ?? {
        message: e.message || "Refresh failed",
      }
    );
  }
}

async function logout(req, res) {
  try {
    const { refresh_token, device_id } = req.body || {};

    if (!refresh_token) {
      return res.status(400).json({ message: "refresh_token required" });
    }

    if (!device_id) {
      return res.status(400).json({ message: "device_id required" });
    }

    await authTokensRevoke({
      refresh_token,
      device_id,
    });

    return res.json({
      ok: true,
      message: "Logged out successfully",
    });
  } catch (e) {
    console.error("❌ LOGOUT ERROR:", e.response?.data || e.message);

    const code = e.response?.status ?? e.upstream?.status ?? 500;

    return res.status(code).json(
      e.response?.data ??
      e.upstream?.data ?? {
        message: e.message || "Logout failed",
      }
    );
  }
}

module.exports = {
  login,
  refresh,
  logout,
};