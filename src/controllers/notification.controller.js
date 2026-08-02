const Notification = require("../models/Notification");
const notificationService = require("../services/notification.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");


// Create Notification
const createNotification = asyncHandler(async (req, res) => {

    const {
        title,
        message,
        type,
        priority
    } = req.body;

    const notification = await Notification.create({

        user: req.user._id,

        title,

        message,

        type,

        priority

    });

    return ApiResponse.success(

        res,

        "Notification created successfully",

        notification,

        201

    );

});




// Get All Notifications
const getNotifications = asyncHandler(
    async (req, res) => {

        const notifications =
            await notificationService.getNotifications(

                req.user._id,
                req.query

            );

        return ApiResponse.success(
            res,
            "Notifications retrieved successfully",
            notifications.items,
            200,
            notifications.pagination
           
        );

    }
);


// Get Single Notification
const getNotification = asyncHandler(
    async (req, res) => {

        const notification =
            await notificationService.getNotificationById(

                req.params.id,

                req.user._id

            );

        return ApiResponse.success(

            res,

            "Notification retrieved successfully",

            notification

        );

    }
);




// Mark Notification as Read
const markAsRead = asyncHandler(
    async (req, res) => {

        
        const notification =
            await notificationService.markAsRead(
                req.params.id,
                req.user._id
            );
        
        return ApiResponse.success(
            res,
            "Notification marked as read",
            notification
        );

    }
);



// Delete Notification
const deleteNotification = asyncHandler(
    async (req, res) => {

        await notificationService.deleteNotification(

            req.params.id,

            req.user._id

        );

        return ApiResponse.success(

            res,

            "Notification deleted successfully"

        );

    }
);

const markAllAsRead = asyncHandler(
    async (req, res) => {

        await notificationService.markAllAsRead(
            req.user._id
        );

        return ApiResponse.success(
            res,
            "All notifications marked as read"
        );

    }
);

const getNotificationStats = asyncHandler(
    async (req, res) => {

        const stats =
            await notificationService.getNotificationStats(

                req.user._id

            );

        return ApiResponse.success(

            res,

            "Notification statistics retrieved successfully",

            stats

        );

    }
);

module.exports = {

    createNotification,
    getNotifications,
    getNotification,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    getNotificationStats

};