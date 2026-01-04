import { useState } from 'react';
import { FileSpreadsheet, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import * as XLSX from 'xlsx-js-style';

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
    // Helper function to apply styling to sheets
    const applySheetFormatting = (headers: string[], data: any[][], sheetTitle: string) => {
      const numCols = headers.length;
      
      // Create complete data array with title, sheet name, headers, and data
      const completeData = [
        ['LANEIGE Amazon Performance Data'],  // Row 1: Title
        [sheetTitle],                          // Row 2: Sheet name
        headers,                                // Row 3: Headers
        ...data                                 // Row 4+: Data
      ];
      
      // Create sheet from complete data
      const sheet = XLSX.utils.aoa_to_sheet(completeData);
      
      // Apply styles
      // Row 1: Title - Bold, 20pt, Blue
      const titleCell = 'A1';
      if (!sheet[titleCell]) sheet[titleCell] = {};
      sheet[titleCell].s = {
        font: { bold: true, sz: 20, color: { rgb: '2F6FE4' } },
        alignment: { vertical: 'center', horizontal: 'left' }
      };
      
      // Row 2: Sheet name - Bold, 15pt
      const sheetNameCell = 'A2';
      if (!sheet[sheetNameCell]) sheet[sheetNameCell] = {};
      sheet[sheetNameCell].s = {
        font: { bold: true, sz: 18 },
        alignment: { vertical: 'center', horizontal: 'left' }
      };
      
      // Row 3: Headers - Bold, 15pt, Light gray background
      for (let col = 0; col < numCols; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 2, c: col });
        if (!sheet[cellAddress]) sheet[cellAddress] = {};
        sheet[cellAddress].s = {
          font: { bold: true, sz: 15 },
          fill: { fgColor: { rgb: 'E0E0E0' } },
          alignment: { vertical: 'center', horizontal: 'center' }
        };
      }
      
      // Apply 15pt font to all data cells (row 4+)
      for (let row = 3; row < completeData.length; row++) {
        for (let col = 0; col < numCols; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
          if (!sheet[cellAddress]) sheet[cellAddress] = {};
          if (!sheet[cellAddress].s) sheet[cellAddress].s = {};
          sheet[cellAddress].s.font = { sz: 15 };
        }
      }
      
      // Set column widths based on header length
      const colWidths = headers.map(header => ({ wch: Math.max(header.length + 2, 12) }));
      sheet['!cols'] = colWidths;
      
      // Freeze panes at row 3 (after headers)
      sheet['!freeze'] = { xSplit: 0, ySplit: 3, topLeftCell: 'A4', activePane: 'bottomLeft', state: 'frozen' };
      
      // Apply autofilter starting from row 3 (header row)
      sheet['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { c: 0, r: 2 }, e: { c: numCols - 1, r: completeData.length - 1 } }) };
      
      return sheet;
    };

    // ════════════════════════════════════════════════════════
    // SHEET 1: 전체 성과 스냅샷 (Overview)
    // ════════════════════════════════════════════════════════
    const overviewData = [
      { year: 2026, month: 1, day: 4, hour: 15, totalCumulativeSales: 40689, netSales: 1245, rankConversionEfficiency: 0.85, trafficConversionEfficiency: 0.72, skuUpliftRatio: 18.5, upliftedSKUCount: 5 },
      { year: 2026, month: 1, day: 4, hour: 14, totalCumulativeSales: 39444, netSales: 1198, rankConversionEfficiency: 0.83, trafficConversionEfficiency: 0.71, skuUpliftRatio: 16.2, upliftedSKUCount: 4 },
      { year: 2026, month: 1, day: 4, hour: 13, totalCumulativeSales: 38246, netSales: 1156, rankConversionEfficiency: 0.84, trafficConversionEfficiency: 0.73, skuUpliftRatio: 17.1, upliftedSKUCount: 5 },
      { year: 2026, month: 1, day: 4, hour: 12, totalCumulativeSales: 37090, netSales: 1089, rankConversionEfficiency: 0.82, trafficConversionEfficiency: 0.70, skuUpliftRatio: 15.8, upliftedSKUCount: 4 },
      { year: 2026, month: 1, day: 4, hour: 11, totalCumulativeSales: 36001, netSales: 1134, rankConversionEfficiency: 0.86, trafficConversionEfficiency: 0.74, skuUpliftRatio: 19.2, upliftedSKUCount: 6 },
      { year: 2026, month: 1, day: 4, hour: 10, totalCumulativeSales: 34867, netSales: 1067, rankConversionEfficiency: 0.81, trafficConversionEfficiency: 0.69, skuUpliftRatio: 14.5, upliftedSKUCount: 4 },
      { year: 2026, month: 1, day: 4, hour: 9, totalCumulativeSales: 33800, netSales: 1223, rankConversionEfficiency: 0.87, trafficConversionEfficiency: 0.75, skuUpliftRatio: 20.3, upliftedSKUCount: 6 },
      { year: 2026, month: 1, day: 4, hour: 8, totalCumulativeSales: 32577, netSales: 1045, rankConversionEfficiency: 0.80, trafficConversionEfficiency: 0.68, skuUpliftRatio: 13.7, upliftedSKUCount: 3 },
      { year: 2026, month: 1, day: 4, hour: 7, totalCumulativeSales: 31532, netSales: 998, rankConversionEfficiency: 0.79, trafficConversionEfficiency: 0.67, skuUpliftRatio: 12.9, upliftedSKUCount: 3 },
      { year: 2026, month: 1, day: 4, hour: 6, totalCumulativeSales: 30534, netSales: 1156, rankConversionEfficiency: 0.84, trafficConversionEfficiency: 0.72, skuUpliftRatio: 16.8, upliftedSKUCount: 5 },
      { year: 2026, month: 1, day: 3, hour: 23, totalCumulativeSales: 29378, netSales: 876, rankConversionEfficiency: 0.76, trafficConversionEfficiency: 0.65, skuUpliftRatio: 11.2, upliftedSKUCount: 3 },
      { year: 2026, month: 1, day: 3, hour: 22, totalCumulativeSales: 28502, netSales: 934, rankConversionEfficiency: 0.78, trafficConversionEfficiency: 0.66, skuUpliftRatio: 13.4, upliftedSKUCount: 4 },
      { year: 2026, month: 1, day: 3, hour: 21, totalCumulativeSales: 27568, netSales: 812, rankConversionEfficiency: 0.75, trafficConversionEfficiency: 0.64, skuUpliftRatio: 10.5, upliftedSKUCount: 3 },
      { year: 2026, month: 1, day: 3, hour: 20, totalCumulativeSales: 26756, netSales: 1023, rankConversionEfficiency: 0.82, trafficConversionEfficiency: 0.70, skuUpliftRatio: 15.2, upliftedSKUCount: 4 },
    ];

    const sheet1Headers = [
      'Year',
      'Month',
      'Day',
      'Hour',
      'Total Cumulative Sales',
      'Net Sales',
      'Rank Conversion Efficiency',
      'Traffic Conversion Efficiency',
      'SKU Uplift Ratio (%)',
      'Uplifted SKU Count'
    ];

    const sheet1Data = overviewData.map(row => [
      row.year,
      row.month,
      row.day,
      row.hour,
      row.totalCumulativeSales,
      row.netSales,
      row.rankConversionEfficiency,
      row.trafficConversionEfficiency,
      row.skuUpliftRatio,
      row.upliftedSKUCount
    ]);

    const sheet1 = applySheetFormatting(sheet1Headers, sheet1Data, 'Overview');

    // ════════════════════════════════════════════════════════
    // SHEET 2: SKU별 성과 히스토리 (SKU Performance)
    // ════════════════════════════════════════════════════════
    const skuPerformanceData = [
      { skuName: 'LANEIGE Lip Sleeping Mask (Berry)', asin: 'B07XXPHQZK', year: 2026, month: 1, day: 4, hour: 15, skuCumulativeSales: 5234, skuNetSales: 187, generalCategoryRank: 12, generalRankChange: -2, subCategoryRank: 3, subRankChange: -1 },
      { skuName: 'LANEIGE Lip Sleeping Mask (Berry)', asin: 'B07XXPHQZK', year: 2026, month: 1, day: 4, hour: 14, skuCumulativeSales: 5047, skuNetSales: 165, generalCategoryRank: 14, generalRankChange: 1, subCategoryRank: 4, subRankChange: 0 },
      { skuName: 'LANEIGE Lip Sleeping Mask (Berry)', asin: 'B07XXPHQZK', year: 2026, month: 1, day: 4, hour: 13, skuCumulativeSales: 4882, skuNetSales: 178, generalCategoryRank: 13, generalRankChange: -1, subCategoryRank: 4, subRankChange: 0 },
      { skuName: 'LANEIGE Water Bank Blue Hyaluronic Cream', asin: 'B0CNJ1Z2GL', year: 2026, month: 1, day: 4, hour: 15, skuCumulativeSales: 3421, skuNetSales: 124, generalCategoryRank: 23, generalRankChange: -3, subCategoryRank: 7, subRankChange: -2 },
      { skuName: 'LANEIGE Water Bank Blue Hyaluronic Cream', asin: 'B0CNJ1Z2GL', year: 2026, month: 1, day: 4, hour: 14, skuCumulativeSales: 3297, skuNetSales: 115, generalCategoryRank: 26, generalRankChange: 2, subCategoryRank: 9, subRankChange: 1 },
      { skuName: 'LANEIGE Water Bank Blue Hyaluronic Cream', asin: 'B0CNJ1Z2GL', year: 2026, month: 1, day: 4, hour: 13, skuCumulativeSales: 3182, skuNetSales: 108, generalCategoryRank: 24, generalRankChange: -1, subCategoryRank: 8, subRankChange: 0 },
      { skuName: 'LANEIGE Cream Skin Toner & Moisturizer', asin: 'B09P54X2NS', year: 2026, month: 1, day: 4, hour: 15, skuCumulativeSales: 2876, skuNetSales: 98, generalCategoryRank: 31, generalRankChange: -5, subCategoryRank: 11, subRankChange: -2 },
      { skuName: 'LANEIGE Cream Skin Toner & Moisturizer', asin: 'B09P54X2NS', year: 2026, month: 1, day: 4, hour: 14, skuCumulativeSales: 2778, skuNetSales: 87, generalCategoryRank: 36, generalRankChange: 3, subCategoryRank: 13, subRankChange: 1 },
    ];

    const sheet2Headers = [
      'SKU Name',
      'ASIN',
      'Year',
      'Month',
      'Day',
      'Hour',
      'SKU Cumulative Sales',
      'SKU Net Sales',
      'General Category Rank',
      'General Rank Change',
      'Sub Category Rank',
      'Sub Rank Change'
    ];

    const sheet2Data = skuPerformanceData.map(row => [
      row.skuName,
      row.asin,
      row.year,
      row.month,
      row.day,
      row.hour,
      row.skuCumulativeSales,
      row.skuNetSales,
      row.generalCategoryRank,
      row.generalRankChange,
      row.subCategoryRank,
      row.subRankChange
    ]);

    const sheet2 = applySheetFormatting(sheet2Headers, sheet2Data, 'SKU Performance');

    // ════════════════════════════════════════════════════════
    // SHEET 3: SKU별 월간 리뷰 분포 (Monthly Review Distribution)
    // ════════════════════════════════════════════════════════
    const reviewDistributionData = [
      { skuName: 'LANEIGE Lip Sleeping Mask (Berry)', asin: 'B07XXPHQZK', year: 2026, month: 1, day: 4, rating5Ratio: 78.2, rating4Ratio: 16.5, rating3Ratio: 3.1, rating2Ratio: 1.4, rating1Ratio: 0.8 },
      { skuName: 'LANEIGE Lip Sleeping Mask (Berry)', asin: 'B07XXPHQZK', year: 2026, month: 1, day: 3, rating5Ratio: 78.0, rating4Ratio: 16.7, rating3Ratio: 3.2, rating2Ratio: 1.3, rating1Ratio: 0.8 },
      { skuName: 'LANEIGE Lip Sleeping Mask (Berry)', asin: 'B07XXPHQZK', year: 2026, month: 1, day: 2, rating5Ratio: 77.8, rating4Ratio: 16.9, rating3Ratio: 3.1, rating2Ratio: 1.4, rating1Ratio: 0.8 },
      { skuName: 'LANEIGE Water Bank Blue Hyaluronic Cream', asin: 'B0CNJ1Z2GL', year: 2026, month: 1, day: 4, rating5Ratio: 82.5, rating4Ratio: 14.2, rating3Ratio: 2.1, rating2Ratio: 0.9, rating1Ratio: 0.3 },
      { skuName: 'LANEIGE Water Bank Blue Hyaluronic Cream', asin: 'B0CNJ1Z2GL', year: 2026, month: 1, day: 3, rating5Ratio: 82.3, rating4Ratio: 14.3, rating3Ratio: 2.2, rating2Ratio: 0.9, rating1Ratio: 0.3 },
      { skuName: 'LANEIGE Water Bank Blue Hyaluronic Cream', asin: 'B0CNJ1Z2GL', year: 2026, month: 1, day: 2, rating5Ratio: 82.1, rating4Ratio: 14.5, rating3Ratio: 2.2, rating2Ratio: 0.9, rating1Ratio: 0.3 },
      { skuName: 'LANEIGE Cream Skin Toner & Moisturizer', asin: 'B09P54X2NS', year: 2026, month: 1, day: 4, rating5Ratio: 80.1, rating4Ratio: 15.3, rating3Ratio: 2.8, rating2Ratio: 1.2, rating1Ratio: 0.6 },
      { skuName: 'LANEIGE Cream Skin Toner & Moisturizer', asin: 'B09P54X2NS', year: 2026, month: 1, day: 3, rating5Ratio: 79.9, rating4Ratio: 15.5, rating3Ratio: 2.9, rating2Ratio: 1.1, rating1Ratio: 0.6 },
    ];

    const sheet3Headers = [
      'SKU Name',
      'ASIN',
      'Year',
      'Month',
      'Day',
      'Rating 5 Ratio (%)',
      'Rating 4 Ratio (%)',
      'Rating 3 Ratio (%)',
      'Rating 2 Ratio (%)',
      'Rating 1 Ratio (%)'
    ];

    const sheet3Data = reviewDistributionData.map(row => [
      row.skuName,
      row.asin,
      row.year,
      row.month,
      row.day,
      row.rating5Ratio,
      row.rating4Ratio,
      row.rating3Ratio,
      row.rating2Ratio,
      row.rating1Ratio
    ]);

    const sheet3 = applySheetFormatting(sheet3Headers, sheet3Data, 'Reviews');

    // ════════════════════════════════════════════════════════
    // Create Workbook and Append All Sheets
    // ════════════════════════════════════════════════════════
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet1, 'Overview');
    XLSX.utils.book_append_sheet(workbook, sheet2, 'SKU Performance');
    XLSX.utils.book_append_sheet(workbook, sheet3, 'Reviews');

    const startStr = selectedStartDate ? format(selectedStartDate, 'yyyy-MM-dd') : 'All';
    const endStr = selectedEndDate ? format(selectedEndDate, 'yyyy-MM-dd') : 'All';
    const fileName = `LANEIGE_Analytics_${startStr}_${endStr}.xlsx`;
    
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