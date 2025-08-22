import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Edit2, Trash2, MapPin, Clock, Euro } from 'lucide-react';
import { Visit } from '../types';

interface DashboardProps {
  visits: Visit[];
  onEditVisit: (visit: Visit) => void;
  onDeleteVisit: (visitId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ visits, onEditVisit, onDeleteVisit }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mobileWeekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
  const insuranceColors: { [key: string]: string } = {
    'AXA': 'bg-blue-500',
    'Allianz': 'bg-green-500',
    'MAPFRE': 'bg-green-400',
    'Zurich': 'bg-purple-500',
    'Sanitas': 'bg-orange-500'
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - (firstDay.getDay() + 6) % 7);
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const getVisitsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return visits.filter(visit => visit.date === dateString);
  };

  const formatTime = (time: string) => {
    return time;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const calendarDays = getCalendarDays();
  const currentMonth = currentDate.getMonth();

  return (
    <div className="pt-16 md:pt-20 px-4 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-0">Dashboard</h1>
            
            {/* Month Navigation */}
            <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border p-1">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-50 rounded-md transition-colors duration-200"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </button>
              
              <div className="flex items-center space-x-2 px-4">
                <span className="text-lg font-semibold text-gray-900">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
              
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-50 rounded-md transition-colors duration-200"
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Week Headers */}
          <div className="grid grid-cols-7 bg-gray-50 border-b">
            {weekDays.map((day, index) => (
              <div key={day} className="p-3 text-center">
                <span className="hidden md:inline text-sm font-medium text-gray-700">{day}</span>
                <span className="md:hidden text-xs font-medium text-gray-700">{mobileWeekDays[index]}</span>
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, dayIndex) => {
              const dayVisits = getVisitsForDate(day);
              const isCurrentMonth = day.getMonth() === currentMonth;
              const isToday = day.toDateString() === new Date().toDateString();

              return (
                <div
                  key={dayIndex}
                  className={`min-h-[80px] md:min-h-[120px] border-r border-b border-gray-100 p-1 md:p-2 ${
                    !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 md:mb-2 ${
                    isToday
                      ? 'text-blue-600 font-bold'
                      : isCurrentMonth
                      ? 'text-gray-900'
                      : 'text-gray-400'
                  }`}>
                    {day.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {dayVisits.slice(0, 3).map((visit) => (
                      <div
                        key={visit.id}
                        className={`group relative text-xs px-2 py-1 rounded text-white cursor-pointer hover:shadow-md transition-all duration-200 ${
                          insuranceColors[visit.insuranceCompany] || 'bg-gray-500'
                        }`}
                        onClick={() => onEditVisit(visit)}
                      >
                        <div className="hidden md:block">
                          <div className="font-medium truncate">{visit.insuranceCompany}</div>
                          <div className="opacity-90 truncate">{formatTime(visit.time)}</div>
                        </div>
                        <div className="md:hidden">
                          <div className="font-medium truncate">{visit.insuranceCompany.substring(0, 3)}</div>
                        </div>
                        
                        {/* Hover actions - desktop only */}
                        <div className="hidden group-hover:flex absolute -top-1 -right-1 bg-white rounded-full shadow-lg border">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditVisit(visit);
                            }}
                            className="p-1 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteVisit(visit.id);
                            }}
                            className="p-1 text-gray-600 hover:text-red-600 transition-colors duration-200"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {dayVisits.length > 3 && (
                      <div className="text-xs text-gray-500 px-2">
                        +{dayVisits.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Visit List */}
        <div className="md:hidden mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Appointments</h2>
          <div className="space-y-3">
            {visits
              .filter(visit => visit.date === new Date().toISOString().split('T')[0])
              .map(visit => (
                <div key={visit.id} className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                      insuranceColors[visit.insuranceCompany] || 'bg-gray-500'
                    }`}>
                      {visit.insuranceCompany}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEditVisit(visit)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteVisit(visit.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="font-medium text-gray-900">{visit.patientName}</div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{visit.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{visit.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Euro className="h-3 w-3" />
                      <span>€{visit.revenue}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;