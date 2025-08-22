import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Calendar, Euro } from 'lucide-react';
import { Visit } from '../types';

interface RevenueProps {
  visits: Visit[];
}

const Revenue: React.FC<RevenueProps> = ({ visits }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  const revenueData = useMemo(() => {
    const now = new Date();
    const data = [];

    if (selectedPeriod === 'week') {
      // Get last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        const dayVisits = visits.filter(visit => visit.date === dateString);
        const dayRevenue = dayVisits.reduce((sum, visit) => sum + visit.revenue, 0);
        
        data.push({
          label: date.toLocaleDateString('en', { weekday: 'short' }),
          fullLabel: date.toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' }),
          value: dayRevenue,
          count: dayVisits.length
        });
      }
    } else {
      // Get last 30 days grouped by week
      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      weeks.forEach((week, index) => {
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - (4 - index) * 7);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        
        const weekVisits = visits.filter(visit => {
          const visitDate = new Date(visit.date);
          return visitDate >= startDate && visitDate <= endDate;
        });
        
        const weekRevenue = weekVisits.reduce((sum, visit) => sum + visit.revenue, 0);
        
        data.push({
          label: week,
          fullLabel: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
          value: weekRevenue,
          count: weekVisits.length
        });
      });
    }

    return data;
  }, [visits, selectedPeriod]);

  const totalRevenue = visits.reduce((sum, visit) => sum + visit.revenue, 0);
  const maxValue = Math.max(...revenueData.map(d => d.value));

  const getBarHeight = (value: number) => {
    if (maxValue === 0) return 0;
    return Math.max((value / maxValue) * 100, value > 0 ? 5 : 0); // Minimum 5% height for non-zero values
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="pt-16 md:pt-20 px-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Revenue</h1>
          <p className="text-gray-600">Track your appointment revenue and financial insights</p>
        </div>

        {/* Revenue Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <Euro className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Visits</p>
                <p className="text-2xl font-bold text-gray-900">{visits.length}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average per Visit</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(visits.length > 0 ? totalRevenue / visits.length : 0)}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
                <p className="text-sm text-gray-600">
                  {selectedPeriod === 'week' ? 'Daily' : 'Weekly'} revenue breakdown
                </p>
              </div>
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedPeriod('week')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    selectedPeriod === 'week'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setSelectedPeriod('month')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    selectedPeriod === 'month'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Month
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-end justify-between h-64 md:h-80 space-x-2 md:space-x-4">
              {revenueData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col justify-end h-full mb-3">
                    <div
                      className="bg-blue-500 rounded-t-md transition-all duration-300 hover:bg-blue-600 cursor-pointer relative group"
                      style={{ height: `${getBarHeight(item.value)}%` }}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                          <div className="font-medium">{item.fullLabel}</div>
                          <div>{formatCurrency(item.value)}</div>
                          <div className="text-gray-300">{item.count} visits</div>
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs font-medium text-gray-600 text-center">
                    {item.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatCurrency(item.value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insurance Company Breakdown */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Revenue by Insurance Company</h2>
            <p className="text-sm text-gray-600">Breakdown of revenue by insurance provider</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(
                visits.reduce((acc, visit) => {
                  acc[visit.insuranceCompany] = (acc[visit.insuranceCompany] || 0) + visit.revenue;
                  return acc;
                }, {} as { [key: string]: number })
              )
                .sort(([, a], [, b]) => b - a)
                .map(([company, revenue]) => {
                  const percentage = totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0;
                  return (
                    <div key={company} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{company}</span>
                          <span className="text-sm text-gray-600">{formatCurrency(revenue)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;