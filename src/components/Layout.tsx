// App Layout with RTL Support

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  MessageCircle,
  Users,
  BookOpen,
  Bell,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  role?: 'student' | 'teacher' | 'admin';
}

const Layout: React.FC<LayoutProps> = ({ children, role = 'student' }) => {
  const { user, logout, switchRole } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { icon: Home, label: 'الرئيسية', path: '/' },
    { icon: MessageCircle, label: 'الرسائل', path: '/messages' },
    { icon: Users, label: 'المعلمون', path: '/teachers' },
    { icon: BookOpen, label: 'الحصص', path: '/lessons' },
    { icon: Bell, label: 'الإشعارات', path: '/notifications' },
  ];

  const roleSwitcher = (
    <div className="flex gap-2 rtl:flex-row-reverse">
      <button
        onClick={() => switchRole('student')}
        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
          role === 'student'
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        طالب
      </button>
      <button
        onClick={() => switchRole('teacher')}
        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
          role === 'teacher'
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        معلم
      </button>
      <button
        onClick={() => switchRole('admin')}
        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
          role === 'admin'
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        مدير
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background font-arabic" dir="rtl">
      {/* Top Navigation Bar */}
      <header className="bg-surface shadow-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white text-xl font-bold">ب</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-primary">منصة البراء</h1>
                <p className="text-xs text-gray-500">التعليمية</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {roleSwitcher}

              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium">{user?.fullNameAr}</p>
                  <p className="text-xs text-gray-500">{role === 'student' ? 'طالب' : role === 'teacher' ? 'معلم' : 'مدير'}</p>
                </div>
                <img
                  src={user?.avatarUrl || 'https://i.pravatar.cc/150'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-primary/20"
                />
              </div>

              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-error transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut size={20} />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-100 py-4 px-4 bg-surface">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Bottom Tab Bar - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-100 px-2 py-2 z-50">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-2 rounded-xl min-w-[60px] ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-400'
                }`}
              >
                <Icon size={22} />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;