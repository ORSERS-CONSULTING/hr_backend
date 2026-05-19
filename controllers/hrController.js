const {
    getEmployeeProfile,
    getLeaveDetails,
    getPayrollDetails,
    getDocuments
} = require("../services/hrServices");

async function employeeProfile(req, res) {
    try {

        const b = req.query || req.body || {};
        const attendance_code = b.attendance_code;

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

        const b = req.query || req.body || {};
        const attendance_code = b.attendance_code;

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

        const b = req.query || req.body || {};
        const attendance_code = b.attendance_code;

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

        const b = req.query || req.body || {};
        const attendance_code = b.attendance_code;

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

module.exports = {
    employeeProfile,
    leaveDetails,
    payrollDetails,
    documentDetails
}