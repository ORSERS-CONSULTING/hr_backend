const router = require("express").Router();

const { authUser } = require("../middleware/authUser");

const {
    employeeProfile,
    leaveDetails,
    payrollDetails,
    documentDetails
} = require("../controllers/hrController");


router.get("/employeeProfile", authUser, employeeProfile);

router.get("/leaveDetails", authUser, leaveDetails);

router.get("/payrollDetails", authUser, payrollDetails);

router.get("/documentDetails", authUser, documentDetails);

module.exports = router;