// Teachers Listing Page

import React, { useState } from 'react';
import { Star, Search, Filter, MapPin, Award, Video, MessageCircle } from 'lucide-react';
import { teachers, subjects, countryFlags } from '../data/mockData';
import { TeacherProfile } from '../types';

const TeachersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.fullNameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.fullNameEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || teacher.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">المعلمون</h1>
        <p className="text-gray-500 mt-2">اختر معلمك المفضل لبدء رحلة التعلم</p>
      </div>

      {/* Search & Filter */}
      <div className="bg-surface rounded-2xl shadow-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن معلم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
            />
          </div>
          <select
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
            value={selectedSpecialty || ''}
            onChange={(e) => setSelectedSpecialty(e.target.value || null)}
          >
            <option value="">جميع التخصصات</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.name}>{subject.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <TeacherCard key={teacher.id} teacher={teacher} />
        ))}
      </div>

      {filteredTeachers.length === 0 && (
        <div className="text-center py-12">
          <Filter size={64} className="mx-auto mb-4 text-gray-300" />
          <p className="text-xl text-gray-400">لم يتم العثور على معلمين</p>
        </div>
      )}
    </div>
  );
};

const TeacherCard: React.FC<{ teacher: TeacherProfile }> = ({ teacher }) => {
  return (
    <div className="bg-surface rounded-2xl shadow-card overflow-hidden hover:shadow-elevated transition-shadow">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-dark h-24 relative">
        {teacher.isVerified && (
          <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
            <Award size={14} className="text-white" />
            <span className="text-white text-xs font-medium">موثق</span>
          </div>
        )}
      </div>

      {/* Profile Section */}
      <div className="px-5 pb-5 -mt-12 relative">
        <div className="flex items-start justify-between">
          <img
            src={teacher.avatarUrl}
            alt={teacher.fullNameAr}
            className="w-24 h-24 rounded-full border-4 border-surface shadow-card"
          />
          <div className="text-left">
            <div className="flex items-center gap-1 text-warning">
              <Star size={16} fill="currentColor" />
              <span className="font-bold">{teacher.ratingAverage}</span>
            </div>
            <p className="text-sm text-gray-400">{teacher.totalReviews} تقييم</p>
          </div>
        </div>

        <div className="mt-3">
          <h3 className="text-xl font-bold">{teacher.fullNameAr}</h3>
          <p className="text-gray-500 flex items-center gap-2 mt-1">
            <MapPin size={14} />
            {countryFlags[teacher.country]} {teacher.country}
          </p>
        </div>

        <p className="text-sm text-gray-600 mt-3 line-clamp-2">{teacher.bio}</p>

        {/* Specialties */}
        <div className="flex flex-wrap gap-2 mt-4">
          {teacher.specialties.map((specialty) => (
            <span key={specialty} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              {specialty}
            </span>
          ))}
        </div>

        {/* Qualifications */}
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">المؤهلات:</p>
          <div className="flex flex-wrap gap-2">
            {teacher.qualifications.slice(0, 2).map((qual) => (
              <span key={qual} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs">
                {qual}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-secondary">{teacher.hourlyRate}</span>
            <span className="text-gray-400 text-sm mr-1">ريال/ساعة</span>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
              <MessageCircle size={20} />
            </button>
            {teacher.videoIntroUrl && (
              <button className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors">
                <Video size={20} />
              </button>
            )}
            <button className="bg-primary text-white px-5 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors">
              احجز الآن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachersPage;