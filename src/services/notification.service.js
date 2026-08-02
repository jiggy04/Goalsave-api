const Notification = require("../models/Notification");
const AppError = require("../utils/AppError");
const getQueryFeatures = require("../utils/queryFeatures");


const createNotification = async ({
    user,
    title,
    message,
    type = "system",
    priority = "medium",
    relatedModel = null,
    relatedId = null,
    expiresAt = null
}) => {

    const existingNotification = await Notification.findOne({
        user,
        title,
        relatedModel,
        relatedId,
        isRead: false
    });

    if (existingNotification) {
        return existingNotification;
    }

    return await Notification.create({

        user,
        title,
        message,
        type,
        priority,
        relatedModel,
        relatedId,
        expiresAt

    });

};

const getNotifications = async (
    userId,
    query = {}
) => {

    const {
        page,
        limit,
        skip,
        sort,
        search
    } = getQueryFeatures(query);

    const filter = {
        user: userId
    };

    if (query.isRead !== undefined) {
        filter.isRead = query.isRead === "true";
    }

    if (query.type) {
        filter.type = query.type;
    }

    if (query.priority) {
        filter.priority = query.priority;
    }


    if (search) {

        filter.$or = [
            {
                title: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                message: {
                    $regex: search,
                    $options: "i"
                }
            }
        ];

    }

    
    const total = await Notification.countDocuments(filter);

    const notifications = await Notification.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

    return {
        items: notifications,
        pagination: {
             page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

const getNotificationById = async (
    id,
    userId
) => {

    const notificationById = await Notification.findById(id);

   
    if (!notificationById) {
        throw new AppError(
            "Notification not found by ID",
            404
        );
    }

    

    if (
        notificationById.user.toString() !==
        userId.toString()
    ) {
        throw new AppError(
            "Notification does not belong to this user",
            403
        );
    }

    return notificationById;

};

const markAsRead = async (
    id,
    userId
) => {

    const notification = await Notification.findOne({
        _id: id,
        user: userId
    });

       
    if (!notification) {

        throw new AppError(
            "Notification not found",
            404
        );

    }

    // Prevent unnecessary database writes
    if (notification.isRead) {

        return notification;

    }

    notification.isRead = true;

    await notification.save();

    return notification;

};

const deleteNotification = async (
    id,
    userId
) => {

    const notification = await Notification.findOne({

        _id: id,

        user: userId

    });

    if (!notification) {

        throw new AppError(
            "Notification not found",
            404
        );

    }

    await notification.deleteOne();

};

const markAllAsRead = async (
    userId
) => {

    await Notification.updateMany(
        {
            user: userId,
            isRead: false
        },
        {
            isRead: true
        }
    );

};

const getNotificationStats = async (
    userId
) => {

    const [

        total,

        unread,

        highPriority

    ] = await Promise.all([

        Notification.countDocuments({
            user: userId
        }),

        Notification.countDocuments({
            user: userId,
            isRead: false
        }),

        Notification.countDocuments({
            user: userId,
            priority: "high"
        })

    ]);

    return {

        total,

        unread,

        read: total - unread,

        highPriority

    };

};

const createBudgetAlert = async (
    budget,
    percentageUsed
) => {

    let title;
    let message;
    let priority;

    if (percentageUsed >= 100) {

        title = "Budget Exceeded";

        message =
            `You have exceeded your "${budget.title}" budget.`;

        priority = "high";

    } else if (percentageUsed >= 80) {

        title = "Budget Alert";

        message =
            `You have used ${percentageUsed}% of your "${budget.title}" budget.`;

        priority = "medium";

    } else {

        return;

    }

    const existingNotification =
        await Notification.findOne({

            user: budget.user,

            title,

            relatedModel: "Budget",

            relatedId: budget._id,

            isRead: false

        });

    if (existingNotification) {

        return;

    }

    await Notification.create({

        user: budget.user,

        title,

        message,

        type: "budget",

        priority,

        relatedModel: "Budget",

        relatedId: budget._id

    });

};



module.exports = {
    createNotification,
    createBudgetAlert,
    getNotifications,
    getNotificationById,
    markAsRead,
    markAllAsRead,
    getNotificationStats,
    deleteNotification,
       
};