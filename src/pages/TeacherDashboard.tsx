// Teacher Dashboard Component

import React from 'react';
import {
  Calendar,
  Clock,
  Video,
  Users,
  DollarSign,
  Star,
  CheckCircle,
  XCircle,
  Play,
  Square
} from 'lucide-react';
import { teacherStats, lessons } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const todayLessons = teacherStats.upcomingLessons;

  const formatTime = (time: string) => {
    return time;
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-secondary to-secondary-dark rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">مرحباً، {user?.fullNameAr}</h1>
            <p className="text-white/80 mt-1">لديك {todayLessons.length} حصص اليوم</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <Users size={32} />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{teacherStats.totalStudents}</p>
              <p className="text-sm text-gray-500">الطلاب</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{teacherStats.todayLessons}</p>
              <p className="text-sm text-gray-500">حصص اليوم</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle size={20} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{teacherStats.completionRate}%</p>
              <p className="text-sm text-gray-500">نسبة الإتمام</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
              <DollarSign size={20} className="text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{teacherStats.weeklyEarnings}</p>
              <p className="text-sm text-gray-500">أرباح الأسبوع</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Lessons */}
      <div className="bg-surface rounded-2xl shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Clock size={20} className="text-secondary" />
            حصصي اليوم
          </h2>
        </div>

        <div className="space-y-4">
          {todayLessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="border border-gray-100 rounded-xl p-4 hover:border-secondary/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-secondary">{formatTime(lesson.time)}</span>
                    <span className="text-xs text-gray-400">مدة: 45 دقيقة</span>
                  </div>

                  <div className="h-12 w-px bg-gray-200" />

                  <div>
                    <p className="font-bold">{lesson.studentName}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Star size={14} className="text-warning" />
                      {lesson.subject}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="bg-secondary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary-dark transition-colors flex items-center gap-2">
                    <Play size={16} />
                    بدء الحصة
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Video size={20} />
                  </button>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="mt-4 flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={16} />
                  <span>الحصة تبدأ خلال:</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-lg font-mono text-sm">
                    02:34:21
                  </span>
                  <button className="text-primary text-sm hover:underline">
                    توليد رابط Zoom
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="bg-surface rounded-xl p-4 shadow-card hover:shadow-elevated transition-shadow text-center group">
          <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Calendar size={24} className="text-primary" />
          </div>
          <p className="font-medium">إدارة الجدول</p>
        </button>

        <button className="bg-surface rounded-xl p-4 shadow-card hover:shadow-elevated transition-shadow text-center group">
          <div className="w-12 h-12 rounded-full bg-blue-100 mx-auto mb-3 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <Users size={24} className="text-blue-600" />
          </div>
          <p className="font-medium">قائمة الطلاب</p>
        </button>

        <button className="bg-surface rounded-xl p-4 shadow-card hover:shadow-elevated transition-shadow text-center group">
          <div className="w-12 h-12 rounded-full bg-success/10 mx-auto mb-3 flex items-center justify-center group-hover:bg-success/20 transition-colors">
            <CheckCircle size={24} className="text-success" />
          </div>
          <p className="font-medium">تأكيد الحضور</p>
        </button>

        <button className="bg-surface rounded-xl p-4 shadow-card hover:shadow-elevated transition-shadow text-center group">
          <div className="w-12 h-12 rounded-full bg-secondary/10 mx-auto mb-3 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
            <DollarSign size={24} className="text-secondary" />
          </div>
          <p className="font-medium">الأرباح</p>
        </button>
      </div>

      {/* Recent Lessons */}
      <div className="bg-surface rounded-2xl shadow-card p-5">
        <h2 className="text-lg font-bold mb-4">الحصص الأخيرة</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-right text-sm text-gray-500 border-b border-gray-100">
                <th className="pb-3 font-medium">الطالب</th>
                <th className="pb-3 font-medium">المادة</th>
                <th className="pb-3 font-medium">التاريخ</th>
                <th className="pb-3 font-medium">الحالة</th>
                <th className="pb-3 font-medium">ملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {lessons.filter(l => l.status === 'completed').map((lesson) => (
                <tr key={lesson.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3">{lesson.studentName}</td>
                  <td className="py-3">{lesson.subjectName}</td>
                  <td className="py-3 text-sm text-gray-500">
                    {new Date(lesson.scheduledAt).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      lesson.attendanceStatus === 'present'
                        ? 'bg-success/10 text-success'
                        : 'bg-error/10 text-error'
                    }`}>
                      {lesson.attendanceStatus === 'present' ? (
                        <CheckCircle size={12} />
                      ) : (
                        <XCircle size={12} />
                      )}
                      {lesson.attendanceStatus === 'present' ? 'حاضر' : 'غائب'}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-500 max-w-[200px] truncate">
                    {lesson.teacherNotes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;