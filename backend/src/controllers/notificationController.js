const { db } = require('../config/firebase');

// Create Notification
async function createNotification(notificationData) {
    try {
        const docRef = await db.collection('notifications').add({
            ...notificationData,
            read: false,
            createdAt: new Date().toISOString()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
}

// Get User Notifications
exports.getUserNotifications = async (req, res, next) => {
    try {
        const { uid } = req.user;

        const snapshot = await db.collection('notifications')
            .where('recipientUID', '==', uid)
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();

        const notifications = [];
        snapshot.forEach(doc => {
            notifications.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json({
            success: true,
            count: notifications.length,
            unreadCount: notifications.filter(n => !n.read).length,
            data: notifications
        });
    } catch (error) {
        next(error);
    }
};

// Mark Notification as Read
exports.markAsRead = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { uid } = req.user;

        const notifRef = db.collection('notifications').doc(id);
        const notifDoc = await notifRef.get();

        if (!notifDoc.exists) {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }

        const notifData = notifDoc.data();
        if (notifData.recipientUID !== uid) {
            return res.status(403).json({ success: false, error: 'Unauthorized' });
        }

        await notifRef.update({ read: true });

        res.status(200).json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        next(error);
    }
};

// Mark All Notifications as Read
exports.markAllAsRead = async (req, res, next) => {
    try {
        const { uid } = req.user;

        const snapshot = await db.collection('notifications')
            .where('recipientUID', '==', uid)
            .where('read', '==', false)
            .get();

        const batch = db.batch();
        snapshot.forEach(doc => {
            batch.update(doc.ref, { read: true });
        });

        await batch.commit();

        res.status(200).json({
            success: true,
            message: `${snapshot.size} notifications marked as read`
        });
    } catch (error) {
        next(error);
    }
};

// Delete Notification
exports.deleteNotification = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { uid } = req.user;

        const notifRef = db.collection('notifications').doc(id);
        const notifDoc = await notifRef.get();

        if (!notifDoc.exists) {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }

        const notifData = notifDoc.data();
        if (notifData.recipientUID !== uid) {
            return res.status(403).json({ success: false, error: 'Unauthorized' });
        }

        await notifRef.delete();

        res.status(200).json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        next(error);
    }
};

// Export helper function
exports.createNotification = createNotification;
