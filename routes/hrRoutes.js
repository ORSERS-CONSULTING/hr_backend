const router = require("express").Router();

const { authUser } = require("../middleware/authUser");

const {
    employeeProfile,
    leaveDetails,
    payrollDetails,
    documentDetails,
    userAttendance,
    leaveHistory,
    leaveBalance,
    createUserLeave
} = require("../controllers/hrController");


router.get("/employeeProfile", authUser, employeeProfile);

router.get("/leaveDetails", authUser, leaveDetails);

router.get("/payrollDetails", authUser, payrollDetails);

router.get("/documentDetails", authUser, documentDetails);

router.get("/userAttendance", authUser, userAttendance);

router.get("/leave/history", authUser, leaveHistory);
router.get("/leave/balance", authUser, leaveBalance);

router.post("/leave/create", authUser, createUserLeave)

module.exports = router;