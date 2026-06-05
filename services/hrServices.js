const axios = require('axios');
const { getIdcsToken } = require("./idcsServices");

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
    },
  });
  return res.data;
}


function getEmployeeProfile(attendance_code) {
  if (!attendance_code) throw new Error("attendance_code is required")
  return callGateway("GET", "employee", { params: { attendance_code } });
};

function getLeaveDetails(attendance_code) {
  if (!attendance_code) throw new Error("attendance_code is required")
  return callGateway("GET", "leave", { params: { attendance_code } });
};

function getPayrollDetails(attendance_code) {
  if (!attendance_code) throw new Error("attendance_code is required")
  return callGateway("GET", "payroll", { params: { attendance_code } });
};


function getDocuments(attendance_code) {
  if (!attendance_code) throw new Error("attendance_code is required")
  return callGateway("GET", "document", { params: { attendance_code } });
};

function getUserAttendance(attendance_code, year, month) {
  if (!attendance_code) throw new Error("attendance_code is required");

  const body = {
    attendance_code,
  };

  if (year) body.year = Number(year);
  if (month) body.month = Number(month);

  return callGateway("POST", "userAttendance", {
    data: body,
  });
}

function getLeaveHistory(attendance_code) {
  if (!attendance_code) throw new Error("attendance_code is required");

  return callGateway("GET", "leave/history", {
    params: { attendance_code },
  });
}

function getLeaveBalance(attendance_code) {
  if (!attendance_code) throw new Error("attendance_code is required");

  return callGateway("GET", "leave/balance", {
    params: { attendance_code },
  });
}

module.exports = {
  getEmployeeProfile,
  getLeaveDetails,
  getPayrollDetails,
  getDocuments,
  getUserAttendance,
  getLeaveHistory,
  getLeaveBalance
}