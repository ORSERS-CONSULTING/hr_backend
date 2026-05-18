const router = require("express").Router();

const {
    employeeProfile,
    leaveDetails,
    payrollDetails
} = require("../controllers/hrController");


router.get("/employeeProfile", employeeProfile);

router.get("/leaveDetails", leaveDetails);

router.get("/payrollDetails", payrollDetails);

module.exports = router;