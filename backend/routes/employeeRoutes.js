const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkRequestFields = require("../middleware/requestFields");

const {
    uploadProfilePicture,
    validateProfilePicture
} = require("../middleware/upload");

const {
    getEmployees,
    searchEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
} = require("../controllers/employeeController");

const {
    employeeValidation,
    employeeUpdateValidation,
    employeeSearchValidation,
    employeeIdValidation,
    deleteEmployeeValidation,
    checkValidation
} = require("../middleware/validate");

const employeeFields = [
    "first_name",
    "last_name",
    "email",
    "position",
    "salary",
    "date_of_joining",
    "department"
];

// Protect all employee routes
router.use(auth);

// Get all employees
router.get("/employees", getEmployees);

// Search employees
router.get(
    "/employees/search",
    employeeSearchValidation,
    checkValidation,
    searchEmployees
);

// Create employee with optional profile picture
router.post(
    "/employees",
    uploadProfilePicture,
    checkRequestFields(employeeFields),
    employeeValidation,
    checkValidation,
    validateProfilePicture,
    createEmployee
);

// Get employee by ID
router.get(
    "/employees/:eid",
    employeeIdValidation,
    checkValidation,
    getEmployeeById
);

// Update employee with optional profile picture
router.put(
    "/employees/:eid",
    employeeIdValidation,
    checkValidation,
    uploadProfilePicture,
    checkRequestFields(employeeFields),
    employeeUpdateValidation,
    checkValidation,
    validateProfilePicture,
    updateEmployee
);

// Delete employee
router.delete(
    "/employees",
    deleteEmployeeValidation,
    checkValidation,
    deleteEmployee
);

module.exports = router;