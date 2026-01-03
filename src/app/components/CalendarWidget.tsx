import { ChevronLeft, ChevronRight, Plus, X, Edit2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Promotion {
  id: string;
  year: number;
  month: number;
  startDate: number;
  endDate: number;
  title: string;
  product: string;
  color: string;
}

interface CalendarWidgetProps {
  promotions: Promotion[];
  setPromotions: React.Dispatch<React.SetStateAction<Promotion[]>>;
}

export function CalendarWidget({ promotions, setPromotions }: CalendarWidgetProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0)); // January 2026
  const [pickerMonth, setPickerMonth] = useState(new Date(2026, 0)); // For date picker
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<number | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<number | null>(null);
  const [newPromoTitle, setNewPromoTitle] = useState('');
  const [newPromoColor, setNewPromoColor] = useState('#FBBF24');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
  
  const addEventModalRef = useRef<HTMLDivElement>(null);
  const startDatePickerRef = useRef<HTMLDivElement>(null);
  const endDatePickerRef = useRef<HTMLDivElement>(null);
  
  const presetColors = [
    { name: 'Yellow', color: '#FBBF24' },
    { name: 'Green', color: '#34D399' },
    { name: 'Purple', color: '#A78BFA' },
    { name: 'Orange', color: '#FB923C' },
    { name: 'Blue', color: '#60A5FA' },
    { name: 'Red', color: '#F87171' },
    { name: 'Pink', color: '#F472B6' },
    { name: 'Teal', color: '#2DD4BF' },
    { name: 'Indigo', color: '#818CF8' },
    { name: 'Lime', color: '#A3E635' },
    { name: 'Cyan', color: '#22D3EE' },
    { name: 'Rose', color: '#FB7185' },
  ];
  
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  // For date picker calendar
  const pickerDaysInMonth = new Date(pickerMonth.getFullYear(), pickerMonth.getMonth() + 1, 0).getDate();
  const pickerFirstDay = new Date(pickerMonth.getFullYear(), pickerMonth.getMonth(), 1).getDay();
  
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const today = 4; // Today is Jan 4, 2026

  const handleAddPromotion = () => {
    if (selectedStartDate && selectedEndDate && newPromoTitle.trim()) {
      const newPromo: Promotion = {
        id: Date.now().toString(),
        year: pickerMonth.getFullYear(),
        month: pickerMonth.getMonth(),
        startDate: selectedStartDate,
        endDate: selectedEndDate,
        title: newPromoTitle,
        product: '',
        color: newPromoColor,
      };
      setPromotions([...promotions, newPromo]);
      setIsModalOpen(false);
      setEditingPromoId(null);
      setShowStartPicker(false);
      setShowEndPicker(false);
      setNewPromoTitle('');
      setSelectedStartDate(null);
      setSelectedEndDate(null);
      setNewPromoColor('#FBBF24');
    }
  };

  const handleDateClick = (day: number | null) => {
    if (day) {
      setSelectedStartDate(day);
      setEditingPromoId(null);
      setIsModalOpen(true);
    }
  };

  const handleStartDateClick = (day: number) => {
    setSelectedStartDate(day);
    setShowStartPicker(false);
  };

  const handleEndDateClick = (day: number) => {
    setSelectedEndDate(day);
    setShowEndPicker(false);
  };

  const handlePrevMonth = () => {
    setPickerMonth(new Date(pickerMonth.getFullYear(), pickerMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setPickerMonth(new Date(pickerMonth.getFullYear(), pickerMonth.getMonth() + 1));
  };

  const handleMainPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleMainNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getMonthName = (date: Date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleDeletePromotion = (id: string) => {
    setPromotions(promotions.filter(p => p.id !== id));
    setDeleteConfirmId(null);
  };

  const handleEditPromotion = (promo: Promotion) => {
    setEditingPromoId(promo.id);
    setPickerMonth(new Date(promo.year, promo.month)); // Set picker to the event's month
    setSelectedStartDate(promo.startDate);
    setSelectedEndDate(promo.endDate);
    setNewPromoTitle(promo.title);
    setNewPromoColor(promo.color);
    setIsModalOpen(true);
  };

  const handleUpdatePromotion = () => {
    if (editingPromoId && selectedStartDate && selectedEndDate && newPromoTitle.trim()) {
      setPromotions(promotions.map(p => 
        p.id === editingPromoId
          ? {
              ...p,
              year: pickerMonth.getFullYear(),
              month: pickerMonth.getMonth(),
              startDate: selectedStartDate,
              endDate: selectedEndDate,
              title: newPromoTitle,
              product: '',
              color: newPromoColor,
            }
          : p
      ));
      setIsModalOpen(false);
      setEditingPromoId(null);
      setShowStartPicker(false);
      setShowEndPicker(false);
      setNewPromoTitle('');
      setSelectedStartDate(null);
      setSelectedEndDate(null);
      setNewPromoColor('#FBBF24');
    }
  };

  const getPromotionsForDate = (day: number | null) => {
    if (!day) return [];
    return promotions.filter(p => 
      p.year === currentMonth.getFullYear() &&
      p.month === currentMonth.getMonth() &&
      p.startDate <= day && 
      p.endDate >= day
    );
  };

  const getCurrentMonthPromotions = () => {
    return promotions.filter(p => 
      p.year === currentMonth.getFullYear() &&
      p.month === currentMonth.getMonth()
    );
  };

  const getShortMonthName = (month: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month];
  };

  const formatDateDisplay = (date: number | null) => {
    if (!date) return '';
    return `${getShortMonthName(pickerMonth.getMonth())} ${date}`;
  };

  useEffect(() => {
    const modalRef = addEventModalRef.current;
    const startPickerRef = startDatePickerRef.current;
    const endPickerRef = endDatePickerRef.current;
    const handleClickOutside = (event: MouseEvent) => {
      // Only close if clicked outside the modal AND outside the date pickers
      const clickedOutsideModal = modalRef && !modalRef.contains(event.target as Node);
      const clickedOutsideStartPicker = !startPickerRef || !startPickerRef.contains(event.target as Node);
      const clickedOutsideEndPicker = !endPickerRef || !endPickerRef.contains(event.target as Node);
      
      if (isModalOpen && clickedOutsideModal && clickedOutsideStartPicker && clickedOutsideEndPicker) {
        setIsModalOpen(false);
        setEditingPromoId(null);
        setShowStartPicker(false);
        setShowEndPicker(false);
        setNewPromoTitle('');
        setSelectedStartDate(null);
        setSelectedEndDate(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <div className="bg-white p-6 shadow-sm h-full flex flex-col rounded-[15px]">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <h3>{getMonthName(currentMonth)}</h3>
        <div className="flex gap-2">
          <div className="relative">
            <button 
              onClick={() => {
                setEditingPromoId(null);
                setIsModalOpen(!isModalOpen);
              }}
              className="p-2 hover:bg-gray-100 transition-colors"
              title="Add Event"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Add Event Dropdown */}
            {isModalOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 shadow-lg z-50 p-6 w-[320px] rounded-lg" ref={addEventModalRef}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium">Add Event</h4>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setNewPromoTitle('');
                      setSelectedStartDate(null);
                      setSelectedEndDate(null);
                    }}
                    className="p-1 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <label className="block text-xs text-gray-600 mb-2">Start Date</label>
                      <input
                        type="text"
                        readOnly
                        value={formatDateDisplay(selectedStartDate)}
                        onClick={() => {
                          setShowStartPicker(!showStartPicker);
                          setShowEndPicker(false);
                        }}
                        className="w-full px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-[#2F6FE4] cursor-pointer"
                        placeholder="Start"
                      />
                      
                      {/* Date Picker Dropdown */}
                      {showStartPicker && (
                        <div ref={startDatePickerRef} className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg z-50 p-4 w-[240px] rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <button
                              onClick={handlePrevMonth}
                              className="p-1 hover:bg-gray-100 transition-colors"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <h5 className="text-sm font-medium">{getMonthName(pickerMonth)}</h5>
                            <button
                              onClick={handleNextMonth}
                              className="p-1 hover:bg-gray-100 transition-colors"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-7 gap-1 mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                              <div key={day} className="text-center text-xs text-gray-500 py-1">
                                {day}
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: pickerFirstDay }).map((_, index) => (
                              <div key={`empty-${index}`} className="py-1"></div>
                            ))}
                            {Array.from({ length: pickerDaysInMonth }, (_, i) => i + 1).map((day) => {
                              const isStart = selectedStartDate === day;
                              const isEnd = selectedEndDate === day;
                              const isInRange = selectedStartDate && selectedEndDate && 
                                day > selectedStartDate && day < selectedEndDate;
                              
                              return (
                                <button
                                  key={day}
                                  onClick={() => handleStartDateClick(day)}
                                  className={`py-1 text-center text-xs transition-colors ${
                                    isStart || isEnd
                                      ? 'bg-[#2F6FE4] text-white'
                                      : isInRange
                                      ? 'bg-[#E8F0FE] text-[#2F6FE4]'
                                      : 'hover:bg-gray-100 text-gray-900'
                                  }`}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <label className="block text-xs text-gray-600 mb-2">End Date</label>
                      <input
                        type="text"
                        readOnly
                        value={formatDateDisplay(selectedEndDate)}
                        onClick={() => {
                          setShowEndPicker(!showEndPicker);
                          setShowStartPicker(false);
                        }}
                        className="w-full px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-[#2F6FE4] cursor-pointer"
                        placeholder="End"
                      />
                      
                      {/* Date Picker Dropdown */}
                      {showEndPicker && (
                        <div ref={endDatePickerRef} className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg z-50 p-4 w-[240px] rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <button
                              onClick={handlePrevMonth}
                              className="p-1 hover:bg-gray-100 transition-colors"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <h5 className="text-sm font-medium">{getMonthName(pickerMonth)}</h5>
                            <button
                              onClick={handleNextMonth}
                              className="p-1 hover:bg-gray-100 transition-colors"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-7 gap-1 mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                              <div key={day} className="text-center text-xs text-gray-500 py-1">
                                {day}
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: pickerFirstDay }).map((_, index) => (
                              <div key={`empty-${index}`} className="py-1"></div>
                            ))}
                            {Array.from({ length: pickerDaysInMonth }, (_, i) => i + 1).map((day) => {
                              const isStart = selectedStartDate === day;
                              const isEnd = selectedEndDate === day;
                              const isInRange = selectedStartDate && selectedEndDate && 
                                day > selectedStartDate && day < selectedEndDate;
                              
                              return (
                                <button
                                  key={day}
                                  onClick={() => handleEndDateClick(day)}
                                  className={`py-1 text-center text-xs transition-colors ${
                                    isStart || isEnd
                                      ? 'bg-[#2F6FE4] text-white'
                                      : isInRange
                                      ? 'bg-[#E8F0FE] text-[#2F6FE4]'
                                      : 'hover:bg-gray-100 text-gray-900'
                                  }`}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Event Title</label>
                    <input
                      type="text"
                      value={newPromoTitle}
                      onChange={(e) => setNewPromoTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-[#2F6FE4]"
                      placeholder="e.g., Flash Sale"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Color</label>
                    <div className="grid grid-cols-4 gap-2">
                      {presetColors.map((color) => (
                        <button
                          key={color.color}
                          type="button"
                          onClick={() => setNewPromoColor(color.color)}
                          className={`w-full h-10 transition-all ${
                            newPromoColor === color.color 
                              ? 'ring-2 ring-offset-2 ring-[#2F6FE4] scale-105' 
                              : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.color }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={editingPromoId ? handleUpdatePromotion : handleAddPromotion}
                    disabled={!selectedStartDate || !selectedEndDate || !newPromoTitle.trim()}
                    className={`w-full py-2 text-sm transition-colors ${
                      selectedStartDate && selectedEndDate && newPromoTitle.trim()
                        ? 'bg-[#2F6FE4] text-white hover:bg-[#265BC7]'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {editingPromoId ? 'Update Event' : 'Add Event'}
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleMainPrevMonth}
            className="p-2 hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleMainNextMonth}
            className="p-2 hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="text-center text-gray-500 text-sm py-2">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const dayPromotions = getPromotionsForDate(day);
          return (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`text-center py-2 text-sm transition-colors relative min-h-[40px] ${
                day === null
                  ? ''
                  : day === today
                  ? 'bg-[#2F6FE4] text-white cursor-pointer'
                  : 'hover:bg-gray-100 cursor-pointer'
              }`}
            >
              <div>{day}</div>
              {dayPromotions.length > 0 && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                  {dayPromotions.map((promo) => (
                    <div
                      key={promo.id}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: promo.color }}
                      title={promo.title}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Promotion List */}
      {getCurrentMonthPromotions().length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm text-gray-600 mb-3">Upcoming Events</h4>
          <div className="space-y-2">
            {getCurrentMonthPromotions()
              .sort((a, b) => a.startDate - b.startDate)
              .map((promo) => (
                <div
                  key={promo.id}
                  className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 transition-colors relative"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: promo.color }}
                    />
                    <span className="text-gray-700">{promo.title}</span>
                    <span className="text-gray-400 text-xs">{getShortMonthName(promo.month)} {promo.startDate}-{promo.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditPromotion(promo)}
                      className="text-gray-400 hover:text-[#2F6FE4] transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setDeleteConfirmId(promo.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      
                      {/* Delete Confirmation Popup */}
                      {deleteConfirmId === promo.id && (
                        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 shadow-lg z-50 p-4 w-[200px] rounded-lg">
                          <p className="text-xs text-gray-700 mb-3">정말 삭제하시겠습니까?</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeletePromotion(promo.id)}
                              className="flex-1 px-3 py-1.5 bg-red-500 text-white text-xs hover:bg-red-600 transition-colors rounded"
                            >
                              삭제
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-xs hover:bg-gray-300 transition-colors rounded"
                            >
                              취소
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}