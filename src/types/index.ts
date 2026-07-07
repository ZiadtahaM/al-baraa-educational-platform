// Al-Baraa Platform - Type Definitions

export type UserRole = 'admin' | 'teacher' | 'student';

export type SubscriptionStatus = 'active' | 'expired' | 'pending_payment' | 'cancelled' | 'paused';

export type LessonStatus = 'scheduled' | 'zoom_link_active' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export type AttendanceStatus = 'present' | 'absent' | 'excused' | 'no_show';

export interface User {
  id: string;
  role: UserRole;
  email: string;
  phone?: string;
  fullNameAr: string;
  fullNameEn: string;
  avatarUrl?: string;
  country: string;
  timezone: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface TeacherProfile extends User {
  role: 'teacher';
  bio: string;
  qualifications: string[];
  specialties: string[];
  hourlyRate: number;
  ratingAverage: number;
  totalReviews: number;
  isVerified: boolean;
  videoIntroUrl?: string;
  availabilitySlots: AvailabilitySlot[];
}

export interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Subscription {
  id: string;
  studentId: string;
  planId: string;
  teacherId: string;
  subjectId: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  totalHours: number;
  usedHours: number;
  remainingHours: number;
  autoRenew: boolean;
  paymentMethod: string;
  lastPaymentDate?: string;
}

export interface Plan {
  id: string;
  name: string;
  hours: number;
  price: number;
  description: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Lesson {
  id: string;
  subscriptionId: string;
  teacherId: string;
  studentId: string;
  teacherName: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  scheduledAt: string;
  durationMinutes: number;
  zoomMeetingId?: string;
  zoomHostUrl?: string;
  zoomJoinUrl?: string;
  status: LessonStatus;
  teacherAttendanceConfirmed: boolean;
  studentAttendanceConfirmed: boolean;
  attendanceStatus?: AttendanceStatus;
  teacherNotes?: string;
  studentFeedback?: StudentFeedback;
  recordingUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentFeedback {
  rating: number;
  comment: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'lesson' | 'payment' | 'system' | 'message';
  read: boolean;
  createdAt: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalStudents: number;
  activeTeachers: number;
  todayLessons: number;
  monthlyRevenue: number;
  pendingTeachers: number;
  activeSubscriptions: number;
}

// Auth State
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}