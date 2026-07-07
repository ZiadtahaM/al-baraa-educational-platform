// Mock Data for Al-Baraa Platform

import { User, TeacherProfile, Subscription, Lesson, Plan, Subject, Notification, Message, DashboardStats } from '../types';

// Plans
export const plans: Plan[] = [
  { id: '1', name: 'شهري - 8 ساعات', hours: 8, price: 200, description: 'باقة شهرية تتضمن 8 ساعات من الحصص' },
  { id: '2', name: 'شهري - 16 ساعة', hours: 16, price: 350, description: 'باقة شهرية تتضمن 16 ساعة من الحصص' },
  { id: '3', name: 'شهري - 30 ساعة', hours: 30, price: 600, description: 'باقة شهرية تتضمن 30 ساعة من الحصص' },
];

// Subjects
export const subjects: Subject[] = [
  { id: '1', name: 'حفظ', description: 'حفظ القرآن الكريم', icon: 'book' },
  { id: '2', name: 'تجويد', description: 'أحكام التجويد', icon: 'mic' },
  { id: '3', name: 'تفسير', description: 'تفسير القرآن الكريم', icon: 'scroll' },
  { id: '4', name: 'حفظ+تجويد+تفسير', description: 'برنامج شامل', icon: 'graduation-cap' },
  { id: '5', name: 'علم الحديث', description: 'علوم الحديث النبوي', icon: 'book-open' },
  { id: '6', name: 'نور بيان', description: 'دروس نور البيان', icon: 'sun' },
  { id: '7', name: 'إجازة', description: 'الإجازة في القرآن', icon: 'award' },
  { id: '8', name: 'علوم شرعية', description: 'العلوم الشرعية المتنوعة', icon: 'scale' },
];

// Current User (Student)
export const currentStudent: User = {
  id: 'student-1',
  role: 'student',
  email: 'ahmed@example.com',
  phone: '+966501234567',
  fullNameAr: 'أحمد محمد العلي',
  fullNameEn: 'Ahmed Mohammed Al-Ali',
  avatarUrl: 'https://i.pravatar.cc/150?u=student1',
  country: 'السعودية',
  timezone: 'Asia/Riyadh',
  isActive: true,
  emailVerified: true,
  createdAt: '2024-01-15T10:00:00Z',
  lastLogin: '2024-05-24T08:30:00Z',
};

// Teachers
export const teachers: TeacherProfile[] = [
  {
    id: 'teacher-1',
    role: 'teacher',
    email: 'sarah@example.com',
    fullNameAr: 'الشيخة سارة الأحمد',
    fullNameEn: 'Sheikha Sarah Al-Ahmad',
    avatarUrl: 'https://i.pravatar.cc/150?u=teacher1',
    country: 'مصر',
    timezone: 'Africa/Cairo',
    isActive: true,
    emailVerified: true,
    createdAt: '2023-06-01T00:00:00Z',
    bio: 'حاصلة على إجازة في القرآن الكريم من الأزهر الشريف مع خبرة 15 عاماً في التدريس',
    qualifications: ['إجازة قرآن من الأزهر', 'دكتوراه في علوم القرآن', 'ماجستير في اللغة العربية'],
    specialties: ['حفظ', 'تجويد', 'إجازة'],
    hourlyRate: 50,
    ratingAverage: 4.9,
    totalReviews: 234,
    isVerified: true,
    videoIntroUrl: 'https://www.youtube.com/watch?v=example',
    availabilitySlots: [
      { day: 'السبت', startTime: '09:00', endTime: '14:00' },
      { day: 'الأحد', startTime: '09:00', endTime: '14:00' },
      { day: 'الثلاثاء', startTime: '09:00', endTime: '14:00' },
      { day: 'الخميس', startTime: '09:00', endTime: '14:00' },
    ],
  },
  {
    id: 'teacher-2',
    role: 'teacher',
    email: 'mohammed@example.com',
    fullNameAr: 'الشيخ محمد الفهيد',
    fullNameEn: 'Sheikh Mohammed Al-Fahaid',
    avatarUrl: 'https://i.pravatar.cc/150?u=teacher2',
    country: 'السعودية',
    timezone: 'Asia/Riyadh',
    isActive: true,
    emailVerified: true,
    createdAt: '2023-03-15T00:00:00Z',
    bio: 'معلم قرآن معتمد من هيئة تقويم التعليم والتدريب',
    qualifications: ['شهادة إقراء', 'دبلوم تدريبي', 'معلم معتمد'],
    specialties: ['حفظ', 'تفسير'],
    hourlyRate: 40,
    ratingAverage: 4.8,
    totalReviews: 189,
    isVerified: true,
    availabilitySlots: [
      { day: 'السبت', startTime: '16:00', endTime: '21:00' },
      { day: 'الأحد', startTime: '16:00', endTime: '21:00' },
      { day: 'الاثنين', startTime: '16:00', endTime: '21:00' },
    ],
  },
  {
    id: 'teacher-3',
    role: 'teacher',
    email: 'fatima@example.com',
    fullNameAr: 'الدكتورة فاطمة الزهراء',
    fullNameEn: 'Dr. Fatimah Al-Zahra',
    avatarUrl: 'https://i.pravatar.cc/150?u=teacher3',
    country: 'المغرب',
    timezone: 'Africa/Casablanca',
    isActive: true,
    emailVerified: true,
    createdAt: '2022-11-20T00:00:00Z',
    bio: 'متخصصة في علم الحديث ولدي خبرة واسعة في تدريس علوم القرآن',
    qualifications: ['دكتوراه في علوم الحديث', 'ماجستير في التفسير', 'إجازة قرآن'],
    specialties: ['علم الحديث', 'تفسير', 'علوم شرعية'],
    hourlyRate: 60,
    ratingAverage: 4.95,
    totalReviews: 312,
    isVerified: true,
    availabilitySlots: [
      { day: 'الاحد', startTime: '10:00', endTime: '16:00' },
      { day: 'الثلاثاء', startTime: '10:00', endTime: '16:00' },
      { day: 'الخميس', startTime: '10:00', endTime: '16:00' },
    ],
  },
];

// Subscriptions
export const subscriptions: Subscription[] = [
  {
    id: 'sub-1',
    studentId: 'student-1',
    planId: '2',
    teacherId: 'teacher-1',
    subjectId: '1',
    status: 'active',
    startDate: '2024-05-01',
    endDate: '2024-06-01',
    totalHours: 16,
    usedHours: 6,
    remainingHours: 10,
    autoRenew: true,
    paymentMethod: 'stripe',
    lastPaymentDate: '2024-05-01T10:00:00Z',
  },
];

// Lessons
export const lessons: Lesson[] = [
  {
    id: 'lesson-1',
    subscriptionId: 'sub-1',
    teacherId: 'teacher-1',
    studentId: 'student-1',
    teacherName: 'الشيخة سارة الأحمد',
    studentName: 'أحمد محمد العلي',
    subjectId: '1',
    subjectName: 'حفظ',
    scheduledAt: '2024-05-25T10:00:00Z',
    durationMinutes: 45,
    zoomJoinUrl: 'https://zoom.us/j/123456789',
    status: 'scheduled',
    teacherAttendanceConfirmed: false,
    studentAttendanceConfirmed: false,
    createdAt: '2024-05-20T00:00:00Z',
    updatedAt: '2024-05-20T00:00:00Z',
  },
  {
    id: 'lesson-2',
    subscriptionId: 'sub-1',
    teacherId: 'teacher-1',
    studentId: 'student-1',
    teacherName: 'الشيخة سارة الأحمد',
    studentName: 'أحمد محمد العلي',
    subjectId: '1',
    subjectName: 'حفظ',
    scheduledAt: '2024-05-27T14:00:00Z',
    durationMinutes: 45,
    zoomJoinUrl: 'https://zoom.us/j/987654321',
    status: 'scheduled',
    teacherAttendanceConfirmed: false,
    studentAttendanceConfirmed: false,
    createdAt: '2024-05-20T00:00:00Z',
    updatedAt: '2024-05-20T00:00:00Z',
  },
  {
    id: 'lesson-3',
    subscriptionId: 'sub-1',
    teacherId: 'teacher-1',
    studentId: 'student-1',
    teacherName: 'الشيخة سارة الأحمد',
    studentName: 'أحمد محمد العلي',
    subjectId: '1',
    subjectName: 'حفظ',
    scheduledAt: '2024-05-22T10:00:00Z',
    durationMinutes: 45,
    status: 'completed',
    teacherAttendanceConfirmed: true,
    studentAttendanceConfirmed: true,
    attendanceStatus: 'present',
    teacherNotes: 'أحمد أظهر تقدم ممتاز في حفظ سورة الملك',
    createdAt: '2024-05-18T00:00:00Z',
    updatedAt: '2024-05-22T11:00:00Z',
  },
  {
    id: 'lesson-4',
    subscriptionId: 'sub-1',
    teacherId: 'teacher-1',
    studentId: 'student-1',
    teacherName: 'الشيخة سارة الأحمد',
    studentName: 'أحمد محمد العلي',
    subjectId: '1',
    subjectName: 'حفظ',
    scheduledAt: '2024-05-20T10:00:00Z',
    durationMinutes: 45,
    status: 'completed',
    teacherAttendanceConfirmed: true,
    studentAttendanceConfirmed: false,
    attendanceStatus: 'no_show',
    teacherNotes: 'الطالب لم يحضر الحصة',
    createdAt: '2024-05-15T00:00:00Z',
    updatedAt: '2024-05-20T11:00:00Z',
  },
];

// Notifications
export const notifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'student-1',
    title: 'تذكير بالحصة',
    message: 'لديك حصة مع الشيخة سارة الأحمد غداً الساعة 10 صباحاً',
    type: 'lesson',
    read: false,
    createdAt: '2024-05-24T08:00:00Z',
  },
  {
    id: 'notif-2',
    userId: 'student-1',
    title: 'تم تجديد اشتراكك',
    message: 'تم تجديد اشتراكك بنجاح حتى تاريخ 01/06/2024',
    type: 'payment',
    read: true,
    createdAt: '2024-05-01T10:00:00Z',
  },
  {
    id: 'notif-3',
    userId: 'student-1',
    title: 'رسالة جديدة',
    message: 'لديك رسالة جديدة من الشيخة سارة',
    type: 'message',
    read: false,
    createdAt: '2024-05-23T15:30:00Z',
  },
];

// Messages
export const messages: Message[] = [
  {
    id: 'msg-1',
    senderId: 'teacher-1',
    senderName: 'الشيخة سارة الأحمد',
    receiverId: 'student-1',
    content: 'مرحباً أحمد، كيف حالك؟ هل تحتاج مساعدة في حفظ سورة الملك؟',
    timestamp: '2024-05-23T14:00:00Z',
    read: true,
  },
  {
    id: 'msg-2',
    senderId: 'student-1',
    senderName: 'أحمد محمد العلي',
    receiverId: 'teacher-1',
    content: 'أهلاً الشيخة، أنا بخير. أحتاج مساعدة في بعض الآيات',
    timestamp: '2024-05-23T14:30:00Z',
    read: true,
  },
  {
    id: 'msg-3',
    senderId: 'teacher-1',
    senderName: 'الشيخة سارة الأحمد',
    receiverId: 'student-1',
    content: 'بالتأكيد! سأساعدك في الحصة القادمة إن شاء الله',
    timestamp: '2024-05-23T15:00:00Z',
    read: false,
  },
];

// Admin Dashboard Stats
export const adminStats: DashboardStats = {
  totalStudents: 156,
  activeTeachers: 28,
  todayLessons: 45,
  monthlyRevenue: 125000,
  pendingTeachers: 5,
  activeSubscriptions: 142,
};

// Teacher Stats
export const teacherStats = {
  totalStudents: 12,
  todayLessons: 3,
  weeklyEarnings: 2400,
  completionRate: 94,
  upcomingLessons: [
    {
      id: '1',
      studentName: 'أحمد محمد العلي',
      time: '10:00 ص',
      subject: 'حفظ',
      status: 'scheduled',
    },
    {
      id: '2',
      studentName: 'فاطمة أحمد',
      time: '12:00 م',
      subject: 'تجويد',
      status: 'scheduled',
    },
    {
      id: '3',
      studentName: 'محمد علي',
      time: '03:00 م',
      subject: 'حفظ',
      status: 'scheduled',
    },
  ],
};

// Country flags mapping
export const countryFlags: Record<string, string> = {
  'السعودية': '🇸🇦',
  'مصر': '🇪🇬',
  'المغرب': '🇲🇦',
  'الأردن': '🇯🇴',
  'الإمارات': '🇦🇪',
  'الكويت': '🇰🇼',
  'قطر': '🇶🇦',
  'البحرين': '🇧🇭',
};