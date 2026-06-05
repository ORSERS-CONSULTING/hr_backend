const {
    getEmployeeProfile,
    getLeaveDetails,
    getPayrollDetails,
    getDocuments,
    getUserAttendance
} = require("../services/hrServices");

function getAttendanceCodeFromToken(req, res) {
    const attendance_code = req.user?.emp_id;

    if (!attendance_code) {
        res.status(401).json({
            success: false,
            message: "Employee ID missing from token",
        });
        return null;
    }

    return attendance_code;
}

async function employeeProfile(req, res) {
    try {
        const attendance_code = getAttendanceCodeFromToken(req, res);
        if (!attendance_code) return;

        const data = await getEmployeeProfile(attendance_code);

        return res.status(200).json({
            success: true,
            result: data,
        });

    } catch (e) {
        const code = e.response?.status ?? 500;
        return res.status(code).json(e.response?.data ?? { message: e.message });
    }
}



async function leaveDetails(req, res) {
    try {
        const attendance_code = getAttendanceCodeFromToken(req, res);
        if (!attendance_code) return;

        const data = await getLeaveDetails(attendance_code);

        return res.status(200).json({
            success: true,
            result: data,
        });

    } catch (e) {
        const code = e.response?.status ?? 500;
        return res.status(code).json(e.response?.data ?? { message: e.message });
    }
}



async function payrollDetails(req, res) {
    try {
        const attendance_code = getAttendanceCodeFromToken(req, res);
        if (!attendance_code) return;

        const data = await getPayrollDetails(attendance_code);

        return res.status(200).json({
            success: true,
            result: data,
        });

    } catch (e) {
        const code = e.response?.status ?? 500;
        return res.status(code).json(e.response?.data ?? { message: e.message });
    }
}


async function documentDetails(req, res) {
    try {
        const attendance_code = getAttendanceCodeFromToken(req, res);
        if (!attendance_code) return;

        const data = await getDocuments(attendance_code);

        return res.status(200).json({
            success: true,
            result: data,
        });

    } catch (e) {
        const code = e.response?.status ?? 500;
        return res.status(code).json(e.response?.data ?? { message: e.message });
    }
}

async function userAttendance(req, res) {
  try {
    const attendance_code = getAttendanceCodeFromToken(req, res);
    if (!attendance_code) return;

    const { year, month } = req.query;

    const data = await getUserAttendance(attendance_code, year, month);

    return res.status(200).json({
      success: true,
      result: data,
    });
  } catch (e) {
    const code = e.response?.status ?? 500;

    return res.status(code).json(
      e.response?.data ?? {
        success: false,
        message: e.message,
      }
    );
  }
}

module.exports = {
    employeeProfile,
    leaveDetails,
    payrollDetails,
    documentDetails,
    userAttendance
}