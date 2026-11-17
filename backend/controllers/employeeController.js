const mongoose = require("mongoose");
const Employee = require("../models/Employee");
const { logEvent } = require("../middleware/requestLogger");

const {
    saveProfilePicture,
    deleteProfilePicture
} = require("../utils/imageStorage");

// Safely remove an uploaded picture
const removePictureSafely = async (picturePath) => {
    try {
        await deleteProfilePicture(picturePath);
    } catch (error) {
        logEvent("Profile picture cleanup failed", "WARN");
    }
};

// Get all employees belonging to the logged-in user
const getEmployees = async (req, res, next) => {
    try {
        const employees = await Employee.find({
            user: req.userId
        });

        logEvent("Employees retrieved successfully");

        res.status(200).json(employees);
    } catch (error) {
        next(error);
    }
};

// Escape special characters for safe regex searching
const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Search employees - Assignment 2
const searchEmployees = async (req, res, next) => {
    try {
        const { department, position } = req.query;

        const filter = {
            user: req.userId
        };

        if (department) {
            filter.department = {
                $regex: escapeRegex(department.trim()),
                $options: "i"
            };
        }

        if (position) {
            filter.position = {
                $regex: escapeRegex(position.trim()),
                $options: "i"
            };
        }

        const employees = await Employee.find(filter);

        logEvent("Employee search completed successfully");

        res.status(200).json(employees);
    } catch (error) {
        next(error);
    }
};

// Create an employee with an optional profile picture
const createEmployee = async (req, res, next) => {
    let newPicture = null;

    try {
        const {
            first_name,
            last_name,
            email,
            position,
            salary,
            date_of_joining,
            department
        } = req.body;

        newPicture = await saveProfilePicture(req.file);

        const employee = await Employee.create({
            first_name,
            last_name,
            email,
            position,
            salary,
            date_of_joining,
            department,
            profile_picture: newPicture,
            user: req.userId
        });

        newPicture = null;

        logEvent("Employee created successfully");

        res.status(201).json({
            message: "Employee created successfully",
            employee
        });
    } catch (error) {
        await removePictureSafely(newPicture);
        next(error);
    }
};

// Get an employee by ID
const getEmployeeById = async (req, res, next) => {
    try {
        const { eid } = req.params;

        if (!mongoose.isValidObjectId(eid)) {
            return res.status(400).json({
                message: "Invalid employee ID"
            });
        }

        const employee = await Employee.findById(eid);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        if (employee.user.toString() !== req.userId.toString()) {
            logEvent("Unauthorized employee access attempt", "WARN");

            return res.status(403).json({
                message: "Access denied"
            });
        }

        logEvent("Employee retrieved successfully");

        res.status(200).json(employee);
    } catch (error) {
        next(error);
    }
};

// Update an employee and optionally replace the profile picture
const updateEmployee = async (req, res, next) => {
    let newPicture = null;

    try {
        const { eid } = req.params;

        if (!mongoose.isValidObjectId(eid)) {
            return res.status(400).json({
                message: "Invalid employee ID"
            });
        }

        const employee = await Employee.findById(eid);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        if (employee.user.toString() !== req.userId.toString()) {
            logEvent("Unauthorized employee update attempt", "WARN");

            return res.status(403).json({
                message: "Access denied"
            });
        }

        const allowedFields = [
            "first_name",
            "last_name",
            "email",
            "position",
            "salary",
            "date_of_joining",
            "department"
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (Object.prototype.hasOwnProperty.call(req.body, field)) {
                updates[field] = req.body[field];
            }
        });

        const filter = {
            _id: eid,
            user: req.userId
        };

        // Save a replacement picture if provided
        if (req.file) {
            newPicture = await saveProfilePicture(req.file);
            updates.profile_picture = newPicture;

            // Prevent conflicting picture replacements
            filter.profile_picture = employee.profile_picture ?? null;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "No valid fields provided"
            });
        }

        const updatedEmployee = await Employee.findOneAndUpdate(
            filter,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedEmployee) {
            await removePictureSafely(newPicture);
            newPicture = null;

            return res.status(req.file ? 409 : 404).json({
                message: req.file
                    ? "Employee changed or no longer exists. Please try again."
                    : "Employee not found"
            });
        }

        newPicture = null;

        // Remove the previous picture after a successful update
        if (req.file) {
            await removePictureSafely(employee.profile_picture);
        }

        logEvent("Employee updated successfully");

        res.status(200).json({
            message: "Employee updated successfully",
            employee: updatedEmployee
        });
    } catch (error) {
        await removePictureSafely(newPicture);
        next(error);
    }
};

// Delete an employee and remove the stored profile picture
const deleteEmployee = async (req, res, next) => {
    try {
        const { eid } = req.query;

        if (!mongoose.isValidObjectId(eid)) {
            return res.status(400).json({
                message: "Invalid employee ID"
            });
        }

        const employee = await Employee.findById(eid);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        if (employee.user.toString() !== req.userId.toString()) {
            logEvent("Unauthorized employee deletion attempt", "WARN");

            return res.status(403).json({
                message: "Access denied"
            });
        }

        const deletedEmployee = await Employee.findOneAndDelete({
            _id: eid,
            user: req.userId
        });

        if (!deletedEmployee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        // Remove the stored profile picture
        await removePictureSafely(deletedEmployee.profile_picture);

        logEvent("Employee deleted successfully");

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getEmployees,
    searchEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};