// Notifications Page

import React from 'react';
import { Bell, MessageCircle, CreditCard, Calendar, CheckCircle } from 'lucide-react';
import { notifications } from '../data/mockData';
import { Notification } from '../types';

const NotificationsPage: React.FC = () => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'lesson':
        return <Calendar size={20} className="text-primary" />;
      case 'payment':
        return <CreditCard size={20} className="text-secondary" />;
      case 'message':
        return <MessageCircle size={20} className="text-blue-500" />;
      case 'system':
        return <Bell size={20} className="text-gray-500" />;
      default:
        return <Bell size={20} className="text-gray-500" />;
    }
  };

  const getIconBg = (type: Notification['type']) => {
    switch (type) {
      case 'lesson':
        return 'bg-primary/10';
      case 'payment':
        return 'bg-secondary/10';
      case 'message':
        return 'bg-blue-100';
      case 'system':
        return 'bg-gray-100';
      default:
        return 'bg-gray-100';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'الآن';
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    return date.toLocaleDateString('ar-SA');
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الإشعارات</h1>
          <p className="text-gray-500 mt-1">
            {notifications.filter(n => !n.read).length} إشعارات غير مقروءة
          </p>
        </div>
        <button className="text-primary hover:underline text-sm">
          قراءة الكل
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-surface rounded-2xl shadow-card overflow-hidden">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                index !== notifications.length - 1 ? 'border-b border-gray-100' : ''
              } ${!notification.read ? 'bg-primary/5' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${getIconBg(notification.type)}`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold">{notification.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                      <span className="text-xs text-gray-400">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                  </div>

                  {!notification.read && (
                    <div className="mt-3 flex gap-2">
                      <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors">
                        عرض التفاصيل
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                        تم القراءة
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <Bell size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-400">لا توجد إشعارات</h3>
            <p className="text-gray-400 mt-2">ستظهر إشعاراتك هنا</p>
          </div>
        )}
      </div>

      {/* Notification Settings */}
      <div className="bg-surface rounded-2xl shadow-card p-5">
        <h2 className="text-lg font-bold mb-4">إعدادات الإشعارات</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-primary" />
              <div>
                <p className="font-medium">تذكيرات الحصص</p>
                <p className="text-sm text-gray-500">إشعارات قبل الحصة بيوم وساعة</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <CreditCard size={20} className="text-secondary" />
              <div>
                <p className="font-medium">إشعارات الدفع</p>
                <p className="text-sm text-gray-500">تذكيرات بالدفع وتأكيدات الاشتراك</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <MessageCircle size={20} className="text-blue-500" />
              <div>
                <p className="font-medium">رسائل المعلم</p>
                <p className="text-sm text-gray-500">إشعارات الرسائل الجديدة</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;