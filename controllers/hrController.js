const {
    getEmployeeProfile,
    getLeaveDetails,
    getPayrollDetails,
    getDocuments,
    getUserAttendance,
    getLeaveHistory,
    getLeaveBalance
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

        const safeData = {
            success: data?.success ?? true,
            year: data?.year,
            month: data?.month,
            summary: data?.summary ?? {
                percentage: 0,
                present_days: 0,
                absent_days: 0,
                late_days: 0,
                leave_days: 0,
                off_days: 0,
                holiday_days: 0,
            },
            items: Array.isArray(data?.items)
                ? data.items.map((item) => ({
                    date: item.date,
                    display_date: item.display_date,
                    day: item.day,
                    date_number: item.date_number,
                    month_name: item.month_name,
                    status: item.status,
                    leave_type_id: item.leave_type_id ?? null,
                    leave_type: item.leave_type ?? null,
                    check_in_time: item.check_in_time,
                    check_out_time: item.check_out_time,
                    shift_start_time: item.shift_start_time,
                    shift_end_time: item.shift_end_time,
                    shift_time: item.shift_time,
                    shift_id: item.shift_id,
                    shift_duration_hours: item.shift_duration_hours,
                    work_hours: item.work_hours,
                    overtime_hours: item.overtime_hours,
                    late_minutes: item.late_minutes,
                    work_location: item.work_location ?? null,
                    duration: item.duration,
                }))
                : [],
        };

        return res.status(200).json({
            success: true,
            result: safeData,
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

async function leaveHistory(req, res) {
    try {
        const attendance_code = getAttendanceCodeFromToken(req, res);
        if (!attendance_code) return;

        const data = await getLeaveHistory(attendance_code);

        const safeData = {
            success: data?.success ?? true,
            message: data?.message ?? "Leave history fetched successfully",
            employee_id: data?.employee_id ?? null,
            items: Array.isArray(data?.items)
                ? data.items.map((item) => ({
                    leave_id: item.leave_id,
                    leave_type_id: item.leave_type_id,
                    leave_type_name: item.leave_type_name ?? "Leave",

                    policy_id: item.policy_id ?? null,
                    policy_name: item.policy_name ?? null,
                    policy_code: item.policy_code ?? null,

                    leave_reason: item.leave_reason ?? null,
                    start_date: item.start_date,
                    end_date: item.end_date,
                    days: item.days ?? 0,

                    leave_taken: item.leave_taken ?? 0,
                    leave_remaining: item.leave_remaining ?? 0,

                    requested_on: item.requested_on ?? null,
                    approved_on: item.approved_on ?? null,

                    approved_by: item.approved_by ?? null,
                    reporting_manager: item.reporting_manager ?? null,
                    level2_reporting_manager: item.level2_reporting_manager ?? null,

                    status_code: item.status_code,
                    status_label: item.status_label ?? "Unknown",
                    status_color: item.status_color ?? "grey",

                    has_file: item.has_file === "Y",
                    leave_file_size: item.leave_file_size ?? 0,
                    document_file_name: item.document_file_name ?? null,
                    document_mime_type: item.document_mime_type ?? null,
                }))
                : [],
        };

        return res.status(200).json({
            success: true,
            result: safeData,
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

async function leaveBalance(req, res) {
    try {
        const attendance_code = getAttendanceCodeFromToken(req, res);
        if (!attendance_code) return;

        const data = await getLeaveBalance(attendance_code);

        const safeData = {
            success: data?.success ?? true,
            message: data?.message ?? "Leave balances fetched successfully",
            employee_id: data?.employee_id ?? null,
            items: Array.isArray(data?.items)
                ? data.items.map((item) => ({
                    tracker_id: item.tracker_id,

                    leave_type_id: item.leave_type_id,
                    leave_type_name: item.leave_type_name ?? "Leave",

                    total_leave_allowed: item.total_leave_allowed ?? 0,
                    leave_taken: item.leave_taken ?? 0,
                    leave_remaining: item.leave_remaining ?? 0,
                    no_of_units_applied: item.no_of_units_applied ?? 0,

                    policy_id: item.policy_id ?? null,
                    policy_name: item.policy_name ?? null,
                    policy_code: item.policy_code ?? null,
                }))
                : [],
        };

        return res.status(200).json({
            success: true,
            result: safeData,
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
    userAttendance,
    leaveHistory,
    leaveBalance
}