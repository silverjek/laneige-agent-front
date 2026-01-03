import { useState } from 'react';
import { FileSpreadsheet, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import * as XLSX from 'xlsx';

interface TopNavProps {
  activeTab: 'overview' | 'byProduct';
  onTabChange: (tab: 'overview' | 'byProduct') => void;
  startDate: Date;
  endDate: Date;
  onDateChange?: (start: Date, end: Date) => void;
}

export function TopNav({ activeTab, onTabChange }: TopNavProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0)); // January 2026

  const handleDateClick = (date: Date) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // Start new selection
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else {
      // Complete selection
      if (date < selectedStartDate) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(date);
      } else {
        setSelectedEndDate(date);
      }
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleExport = () => {
    // Mock data for export
    const exportData = [
      ['Date', 'Product', 'Rank', 'Sales', 'Revenue'],
      ['2019-02-01', 'Water Sleeping Mask', '10', '150', '$2,250'],
      ['2019-02-02', 'Water Sleeping Mask', '12', '142', '$2,130'],
      ['2019-02-03', 'Water Sleeping Mask', '9', '165', '$2,475'],
      // Add more data as needed
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    
    const startStr = selectedStartDate ? format(selectedStartDate, 'yyyy-MM-dd') : 'All';
    const endStr = selectedEndDate ? format(selectedEndDate, 'yyyy-MM-dd') : 'All';
    const fileName = `Laneige_Data_${startStr}_${endStr}.xlsx`;
    
    XLSX.writeFile(workbook, fileName);
    
    // Reset and close
    setShowCalendar(false);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get the day of week for the first day (0 = Sunday)
  const firstDayOfWeek = monthStart.getDay();

  return (
    <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex gap-8">
          <button
            onClick={() => onTabChange('overview')}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-[#2F6FE4] text-[#2F6FE4]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onTabChange('byProduct')}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'byProduct'
                ? 'border-[#2F6FE4] text-[#2F6FE4]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            By Product
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex items-center justify-center w-10 h-10 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
            title="Export to Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-gray-600" />
          </button>

          {/* Calendar Popup */}
          {showCalendar && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 shadow-lg z-50 p-6 w-[380px] rounded-[15px]">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h4 className="text-lg">{format(currentMonth, 'MMMM yyyy')}</h4>
                <button
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setShowCalendar(false)}
                  className="p-1 hover:bg-gray-100 transition-colors ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {/* Day headers */}
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className="text-center text-sm text-gray-500 py-2">
                    {day}
                  </div>
                ))}
                
                {/* Empty cells for alignment */}
                {Array.from({ length: firstDayOfWeek }).map((_, index) => (
                  <div key={`empty-${index}`} className="py-2"></div>
                ))}
                
                {/* Calendar days */}
                {days.map((day) => {
                  const isStart = selectedStartDate && isSameDay(day, selectedStartDate);
                  const isEnd = selectedEndDate && isSameDay(day, selectedEndDate);
                  const isInRange = selectedStartDate && selectedEndDate && 
                    day > selectedStartDate && day < selectedEndDate;
                  const isSelected = isStart || isEnd;

                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => handleDateClick(day)}
                      className={`py-2 text-center text-sm transition-colors ${
                        isSelected
                          ? 'bg-[#2F6FE4] text-white hover:bg-[#265BC7]'
                          : isInRange
                          ? 'bg-[#E8F0FE] text-[#2F6FE4] hover:bg-[#D4E4FD]'
                          : 'hover:bg-gray-100 text-gray-900'
                      }`}
                    >
                      {day.getDate()}
                    </button>
                  );
                })}
              </div>

              {/* Selected Range Info */}
              {selectedStartDate && (
                <div className="mb-4 p-3 bg-gray-50 text-sm">
                  <div className="text-gray-600">
                    {selectedStartDate && selectedEndDate
                      ? `${format(selectedStartDate, 'dd MMM yyyy')} - ${format(selectedEndDate, 'dd MMM yyyy')}`
                      : `Start: ${format(selectedStartDate, 'dd MMM yyyy')}`}
                  </div>
                </div>
              )}

              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={!selectedStartDate || !selectedEndDate}
                className={`w-full py-2 text-sm transition-colors ${
                  selectedStartDate && selectedEndDate
                    ? 'bg-[#2F6FE4] text-white hover:bg-[#265BC7]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Export to Excel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}