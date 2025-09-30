import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Check, 
  Trash2,
  Mail,
  MapPin,
  AlertTriangle
} from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  type: 'success' | 'warning' | 'info';
  read: boolean;
  isTransfer?: boolean;
  transferDetails?: any;
}

interface EmployeeNotificationsProps {
  notifications: Notification[];
}

const EmployeeNotifications: React.FC<EmployeeNotificationsProps> = ({ notifications }) => {
  const [notificationList, setNotificationList] = useState(notifications);
  const [filter, setFilter] = useState('all');

  const getNotificationIcon = (notification: Notification) => {
    if (notification.isTransfer) {
      return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    }
    
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const markAsRead = (id: number) => {
    setNotificationList(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAsUnread = (id: number) => {
    setNotificationList(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: false } : notif
    ));
  };

  const deleteNotification = (id: number) => {
    setNotificationList(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotificationList(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const filteredNotifications = notificationList.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notificationList.filter(notif => !notif.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-sm text-gray-600 mt-1">
            Stay updated with important announcements and application status
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{notificationList.length}</p>
            </div>
            <Bell className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
            </div>
            <Mail className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Read</p>
              <p className="text-2xl font-bold text-green-600">
                {notificationList.length - unreadCount}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({notificationList.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unread' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'read' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Read ({notificationList.length - unreadCount})
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  !notification.read 
                    ? notification.isTransfer 
                      ? 'bg-orange-50 border-l-4 border-orange-500' 
                      : 'bg-blue-50 border-l-4 border-blue-500'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getNotificationIcon(notification)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{notification.title}</h3>
                        {notification.isTransfer && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <MapPin className="w-3 h-3 mr-1" />
                            Transfer
                          </span>
                        )}
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-gray-700 mb-2">{notification.message}</p>
                      {notification.isTransfer && notification.transferDetails && (
                        <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                              <span className="text-gray-600">
                                <strong>From:</strong> {notification.transferDetails.fromBranch}
                              </span>
                              <span className="text-gray-600">
                                <strong>To:</strong> {notification.transferDetails.toBranch}
                              </span>
                              <span className="text-gray-600">
                                <strong>Date:</strong> {new Date(notification.transferDetails.transferDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-gray-500">{notification.date}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-4">
                    {!notification.read ? (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => markAsUnread(notification.id)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Mark as unread"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-600">
              {filter === 'unread' 
                ? 'All notifications have been read.' 
                : filter === 'read'
                ? 'No read notifications yet.'
                : 'You have no notifications at the moment.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeNotifications;