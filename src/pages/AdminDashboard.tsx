// Admin Dashboard Component

import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  MoreVertical,
  Search,
  Filter
} from 'lucide-react';
import { adminStats, teachers, lessons } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'teachers' | 'students' | 'lessons'>('overview');

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">لوحة التحكم</h1>
            <p className="text-white/80 mt-1">مرحباً، {user?.fullNameAr}</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <DollarSign size={32} />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-surface rounded-xl p-4 shadow-card border-r-4 border-primary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{adminStats.totalStudents}</p>
              <p className="text-xs text-gray-500">إجمالي الطلاب</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-4 shadow-card border-r-4 border-success">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <UserCheck size={20} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{adminStats.activeTeachers}</p>
              <p className="text-xs text-gray-500">المعلمون النشطون</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-4 shadow-card border-r-4 border-secondary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
              <Calendar size={20} className="text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{adminStats.todayLessons}</p>
              <p className="text-xs text-gray-500">حصص اليوم</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-4 shadow-card border-r-4 border-blue-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <TrendingUp size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{adminStats.activeSubscriptions}</p>
              <p className="text-xs text-gray-500">اشتراكات نشطة</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-4 shadow-card border-r-4 border-warning">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
              <Clock size={20} className="text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{adminStats.pendingTeachers}</p>
              <p className="text-xs text-gray-500">معلمين بانتظار الموافقة</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-4 shadow-card border-r-4 border-success">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <DollarSign size={20} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{adminStats.monthlyRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500">الإيرادات الشهرية</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-surface rounded-xl shadow-card overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            نظرة عامة
          </button>
          <button
            onClick={() => setActiveTab('teachers')}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'teachers'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            المعلمون
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'students'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            الطلاب
          </button>
          <button
            onClick={() => setActiveTab('lessons')}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'lessons'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            الحصص
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Pending Approvals */}
              <div className="bg-warning/5 border border-warning/20 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle size={24} className="text-warning" />
                    <h3 className="font-bold">معلمين بانتظار الموافقة</h3>
                  </div>
                  <span className="bg-warning text-white px-3 py-1 rounded-full text-sm">
                    {adminStats.pendingTeachers}
                  </span>
                </div>
                <div className="space-y-3">
                  {teachers.filter(t => !t.isVerified).slice(0, 2).map((teacher) => (
                    <div key={teacher.id} className="flex items-center justify-between bg-white rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <img src={teacher.avatarUrl} alt={teacher.fullNameAr} className="w-10 h-10 rounded-full" />
                        <div>
                          <p className="font-medium">{teacher.fullNameAr}</p>
                          <p className="text-sm text-gray-500">{teacher.specialties.join('، ')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors">
                          <CheckCircle size={18} />
                        </button>
                        <button className="p-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-colors">
                          <XCircle size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold mb-4">آخر التسجيلات</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                          أ
                        </div>
                        <div>
                          <p className="font-medium">أحمد محمد</p>
                          <p className="text-xs text-gray-500">طالب جديد</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">منذ ساعة</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-sm font-bold">
                          س
                        </div>
                        <div>
                          <p className="font-medium">سارة أحمد</p>
                          <p className="text-xs text-gray-500">معلم جديد</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">منذ 3 ساعات</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold mb-4">حصص متنازع عليها</h3>
                  <div className="text-center py-8">
                    <CheckCircle size={48} className="text-success mx-auto mb-3 opacity-50" />
                    <p className="text-gray-500">لا توجد حصص متنازع عليها</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'teachers' && (
            <div>
              {/* Search & Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="بحث عن معلم..."
                    className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                  />
                </div>
                <select className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary">
                  <option>جميع التخصصات</option>
                  <option>حفظ</option>
                  <option>تجويد</option>
                  <option>تفسير</option>
                </select>
              </div>

              {/* Teachers Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-right text-sm text-gray-500 border-b border-gray-100">
                      <th className="pb-3 font-medium">المعلم</th>
                      <th className="pb-3 font-medium">التخصص</th>
                      <th className="pb-3 font-medium">الطلاب</th>
                      <th className="pb-3 font-medium">التقييم</th>
                      <th className="pb-3 font-medium">الحالة</th>
                      <th className="pb-3 font-medium">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((teacher) => (
                      <tr key={teacher.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <img src={teacher.avatarUrl} alt={teacher.fullNameAr} className="w-10 h-10 rounded-full" />
                            <div>
                              <p className="font-medium">{teacher.fullNameAr}</p>
                              <p className="text-sm text-gray-500">{teacher.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="bg-gray-100 px-2 py-1 rounded-lg text-sm">
                            {teacher.specialties.join('، ')}
                          </span>
                        </td>
                        <td className="py-4">
                          {Math.floor(Math.random() * 20) + 5}
                        </td>
                        <td className="py-4">
                          <span className="flex items-center gap-1">
                            <span className="text-warning">★</span>
                            {teacher.ratingAverage}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            teacher.isVerified
                              ? 'bg-success/10 text-success'
                              : 'bg-warning/10 text-warning'
                          }`}>
                            {teacher.isVerified ? 'موافق عليه' : 'بانتظار'}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                              <Eye size={18} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreVertical size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="text-center py-12">
              <Users size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">قائمة الطلاب</h3>
              <p className="text-gray-400">إجمالي {adminStats.totalStudents} طالب</p>
            </div>
          )}

          {activeTab === 'lessons' && (
            <div className="text-center py-12">
              <Calendar size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">إدارة الحصص</h3>
              <p className="text-gray-400">{adminStats.todayLessons} حصة اليوم</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;