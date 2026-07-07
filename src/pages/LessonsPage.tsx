// Lessons Page

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  Copy,
  CheckCircle,
  XCircle,
  Play,
  ExternalLink,
  ChevronLeft,
  Filter
} from 'lucide-react';
import { lessons } from '../data/mockData';

type TabType = 'upcoming' | 'completed';

const LessonsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');

  const upcomingLessons = lessons.filter(l => l.status === 'scheduled');
  const completedLessons = lessons.filter(l => l.status === 'completed');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
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
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">الحصص</h1>
        <p className="text-gray-500 mt-2">إدارة ومتابعة جميع حصصك</p>
      </div>

      {/* Tabs */}
      <div className="bg-surface rounded-2xl shadow-card p-2 flex">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
            activeTab === 'upcoming'
              ? 'bg-primary text-white'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          الحصص القادمة ({upcomingLessons.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
            activeTab === 'completed'
              ? 'bg-primary text-white'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          الحصص المنتهية ({completedLessons.length})
        </button>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        {activeTab === 'upcoming' && (
          upcomingLessons.length > 0 ? (
            upcomingLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                formatDate={formatDate}
                formatTime={formatTime}
              />
            ))
          ) : (
            <div className="bg-surface rounded-2xl shadow-card p-12 text-center">
              <Calendar size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-400">لا توجد حصص قادمة</h3>
              <p className="text-gray-400 mt-2">احجز حصة جديدة مع أحد معلمينا</p>
            </div>
          )
        )}

        {activeTab === 'completed' && (
          completedLessons.length > 0 ? (
            completedLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                formatDate={formatDate}
                formatTime={formatTime}
              />
            ))
          ) : (
            <div className="bg-surface rounded-2xl shadow-card p-12 text-center">
              <CheckCircle size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-400">لا توجد حصص منتهية</h3>
              <p className="text-gray-400 mt-2">ستظهر حصصك المنتهية هنا</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

interface LessonCardProps {
  lesson: typeof lessons[0];
  formatDate: (date: string) => string;
  formatTime: (date: string) => string;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, formatDate, formatTime }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (lesson.zoomJoinUrl) {
      navigator.clipboard.writeText(lesson.zoomJoinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusColor = (status: string, attendanceStatus?: string) => {
    if (status === 'completed') {
      return attendanceStatus === 'present' ? 'bg-success/10 text-success' : 'bg-error/10 text-error';
    }
    return 'bg-warning/10 text-warning';
  };

  const getStatusText = (status: string, attendanceStatus?: string) => {
    if (status === 'completed') {
      return attendanceStatus === 'present' ? 'حاضر' : 'غائب';
    }
    return 'مجدولة';
  };

  return (
    <div className="bg-surface rounded-2xl shadow-card p-5 hover:shadow-elevated transition-shadow">
      <div className="flex items-start gap-4">
        {/* Status Icon */}
        <div className={`p-3 rounded-xl ${
          lesson.status === 'completed'
            ? lesson.attendanceStatus === 'present'
              ? 'bg-success/10'
              : 'bg-error/10'
            : 'bg-primary/10'
        }`}>
          {lesson.status === 'completed' ? (
            lesson.attendanceStatus === 'present' ? (
              <CheckCircle size={24} className="text-success" />
            ) : (
              <XCircle size={24} className="text-error" />
            )
          ) : (
            <Play size={24} className="text-primary" />
          )}
        </div>

        {/* Lesson Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold">{lesson.subjectName}</h3>
              <p className="text-gray-500">مع {lesson.teacherName}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(lesson.status, lesson.attendanceStatus)}`}>
              {getStatusText(lesson.status, lesson.attendanceStatus)}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{formatDate(lesson.scheduledAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{formatTime(lesson.scheduledAt)}</span>
            </div>
            <span>•</span>
            <span>{lesson.durationMinutes} دقيقة</span>
          </div>

          {lesson.teacherNotes && (
            <div className="mt-3 p-3 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600">
                <span className="font-medium">ملاحظات المعلم:</span> {lesson.teacherNotes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {lesson.status === 'scheduled' && lesson.zoomJoinUrl && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-600 py-3 rounded-xl hover:bg-gray-200 transition-colors"
          >
            {copied ? <CheckCircle size={18} className="text-success" /> : <Copy size={18} />}
            {copied ? 'تم النسخ!' : 'نسخ الرابط'}
          </button>
          <a
            href={lesson.zoomJoinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl hover:bg-primary-dark transition-colors"
          >
            <Video size={18} />
            انضم الآن
          </a>
        </div>
      )}

      {lesson.status === 'completed' && lesson.recordingUrl && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <a
            href={lesson.recordingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-600 py-3 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <ExternalLink size={18} />
            مشاهدة التسجيل
          </a>
        </div>
      )}
    </div>
  );
};

export default LessonsPage;