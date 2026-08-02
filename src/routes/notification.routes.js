const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware")

const {
    createNotificationSchema
} = require("../validators/notification.validator");

const {
    createNotification,
    getNotifications,
    getNotification,
    markAsRead,
    markAllAsRead,
    getNotificationStats,
    deleteNotification
} = require("../controllers/notification.controller");


// Protect all notification routes
router.use(authMiddleware);


// Create notification
router.post(
    "/",
    validate(createNotificationSchema),
    createNotification
);


// Get all notifications
router.get(
    "/",
    getNotifications
);

router.get(
    "/stats",
    getNotificationStats
);

router.patch(
    "/read-all",
    markAllAsRead
);

// Get single notification
router.get(
    "/:id",
    getNotification
);


// Mark notification as read
router.patch(
    "/:id/read",
    markAsRead
);

// Delete notification
router.delete(
    "/:id",
    deleteNotification
);


module.exports = router;