const router = require("express").Router();

const {
    employeeProfile,
    leaveDetails,
    payrollDetails,
    documentDetails
} = require("../controllers/hrController");


router.get("/employeeProfile", employeeProfile);

router.get("/leaveDetails", leaveDetails);

router.get("/payrollDetails", payrollDetails);

router.get("/documentDetails", documentDetails);

module.exports = router;