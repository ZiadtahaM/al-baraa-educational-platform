// Student Dashboard Component

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Video,
  Users,
  Star,
  ChevronLeft,
  BookOpen,
  TrendingUp,
  CreditCard,
  Bell
} from 'lucide-react';
import { lessons, subscriptions, teachers, notifications } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { countryFlags } from '../data/mockData';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const activeSubscription = subscriptions[0];
  const upcomingLessons = lessons.filter(l => l.status === 'scheduled').slice(0, 2);
  const completedLessons = lessons.filter(l => l.status === 'completed');
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">مرحباً، {user?.fullNameAr}</h1>
            <p className="text-white/80 mt-1">نتمنى لك يوماً موفقاً في التعلم</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <BookOpen size={32} />
          </div>
        </div>
      </div>

      {/* Subscription Status Card */}
      <div className="bg-surface rounded-2xl shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <CreditCard size={20} className="text-primary" />
            اشتراكي الحالي
          </h2>
          <Link to="/subscriptions" className="text-primary text-sm flex items-center gap-1 hover:underline">
            إدارة الاشتراك
            <ChevronLeft size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">الساعات المتبقية</p>
            <p className="text-3xl font-bold text-primary">{activeSubscription.remainingHours}</p>
            <p className="text-sm text-gray-400">من أصل {activeSubscription.totalHours} ساعة</p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${(activeSubscription.remainingHours / activeSubscription.totalHours) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">ينتهي في</p>
            <p className="text-lg font-bold">{formatDate(activeSubscription.endDate)}</p>
            <p className="text-sm text-success">نشط</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl p-4 shadow-card text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-2 flex items-center justify-center">
            <Calendar size={24} className="text-primary" />
          </div>
          <p className="text-2xl font-bold">{upcomingLessons.length}</p>
          <p className="text-sm text-gray-500">حصص قادمة</p>
        </div>

        <div className="bg-surface rounded-xl p-4 shadow-card text-center">
          <div className="w-12 h-12 rounded-full bg-secondary/10 mx-auto mb-2 flex items-center justify-center">
            <TrendingUp size={24} className="text-secondary" />
          </div>
          <p className="text-2xl font-bold">{completedLessons.length}</p>
          <p className="text-sm text-gray-500">حصص مكتملة</p>
        </div>

        <div className="bg-surface rounded-xl p-4 shadow-card text-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 mx-auto mb-2 flex items-center justify-center">
            <Star size={24} className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold">{teachers[0].ratingAverage}</p>
          <p className="text-sm text-gray-500">تقييم المعلم</p>
        </div>
      </div>

      {/* Upcoming Lessons */}
      <div className="bg-surface rounded-2xl shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Video size={20} className="text-primary" />
            الحصص القادمة
          </h2>
          <Link to="/lessons" className="text-primary text-sm flex items-center gap-1 hover:underline">
            عرض الكل
            <ChevronLeft size={16} />
          </Link>
        </div>

        {upcomingLessons.length > 0 ? (
          <div className="space-y-4">
            {upcomingLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="border border-gray-100 rounded-xl p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-xl p-3">
                      <Clock size={24} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-bold">{lesson.subjectName}</p>
                      <p className="text-sm text-gray-500">مع {lesson.teacherName}</p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                        <span>{formatDate(lesson.scheduledAt)}</span>
                        <span>•</span>
                        <span>{formatTime(lesson.scheduledAt)}</span>
                        <span>•</span>
                        <span>{lesson.durationMinutes} دقيقة</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2">
                      <Video size={16} />
                      انضم الآن
                    </button>
                    <button className="text-gray-400 text-sm hover:text-gray-600 flex items-center gap-1">
                      نسخ الرابط
                      <ChevronLeft size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Calendar size={48} className="mx-auto mb-3 opacity-50" />
            <p>لا توجد حصص قادمة</p>
            <Link to="/teachers" className="text-primary mt-2 inline-block hover:underline">
              احجز حصة جديدة
            </Link>
          </div>
        )}
      </div>

      {/* My Teachers */}
      <div className="bg-surface rounded-2xl shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Users size={20} className="text-primary" />
            معلميني
          </h2>
          <Link to="/teachers" className="text-primary text-sm flex items-center gap-1 hover:underline">
            عرض الكل
            <ChevronLeft size={16} />
          </Link>
        </div>

        <div className="space-y-3">
          {teachers.slice(0, 3).map((teacher) => (
            <div
              key={teacher.id}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <img
                src={teacher.avatarUrl}
                alt={teacher.fullNameAr}
                className="w-12 h-12 rounded-full border-2 border-primary/20"
              />
              <div className="flex-1">
                <p className="font-bold">{teacher.fullNameAr}</p>
                <p className="text-sm text-gray-500">{teacher.specialties.join(' • ')}</p>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-secondary">{countryFlags[teacher.country]} {teacher.country}</p>
                <div className="flex items-center gap-1 text-sm text-warning">
                  <Star size={14} fill="currentColor" />
                  <span>{teacher.ratingAverage}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications Preview */}
      {unreadNotifications > 0 && (
        <div className="bg-surface rounded-2xl shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Bell size={20} className="text-primary" />
              الإشعارات
            </h2>
            <span className="bg-error text-white text-xs px-2 py-1 rounded-full">
              {unreadNotifications} جديدة
            </span>
          </div>

          {notifications.filter(n => !n.read).map((notif) => (
            <div key={notif.id} className="p-3 bg-gray-50 rounded-xl mb-2 last:mb-0">
              <p className="font-medium">{notif.title}</p>
              <p className="text-sm text-gray-500">{notif.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;