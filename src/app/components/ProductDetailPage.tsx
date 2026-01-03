import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Minus,
  ChevronDown,
  FileSpreadsheet,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Info,
  Check,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { usePopper } from "react-popper";
import * as XLSX from "xlsx";

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

interface ProductDetailProps {
  productName: string;
  asin: string;
  category: string;
  thumbnail: string;
  rankCategories: string[];
  onBack: () => void;
  promotions: Promotion[];
  setPromotions: React.Dispatch<
    React.SetStateAction<Promotion[]>
  >;
}

// Mock data for Rank Trend chart
// Today is Jan 4, 2026
// Data covers 30 days: Dec 6, 2025 ~ Jan 4, 2026
const rankTrendData = [
  // December 2025
  {
    date: "Dec 6",
    fullDate: "2025-12-06",
    bsrHigh: 15,
    bsrLow: 22,
    bsr: 18,
    categoryHigh: 3,
    categoryLow: 5,
    category: 4,
  },
  {
    date: "Dec 7",
    fullDate: "2025-12-07",
    bsrHigh: 14,
    bsrLow: 21,
    bsr: 17,
    categoryHigh: 3,
    categoryLow: 5,
    category: 4,
  },
  {
    date: "Dec 8",
    fullDate: "2025-12-08",
    bsrHigh: 14,
    bsrLow: 20,
    bsr: 17,
    categoryHigh: 3,
    categoryLow: 4,
    category: 4,
  },
  {
    date: "Dec 9",
    fullDate: "2025-12-09",
    bsrHigh: 13,
    bsrLow: 19,
    bsr: 16,
    categoryHigh: 3,
    categoryLow: 4,
    category: 3,
  },
  {
    date: "Dec 10",
    fullDate: "2025-12-10",
    bsrHigh: 12,
    bsrLow: 18,
    bsr: 15,
    categoryHigh: 2,
    categoryLow: 4,
    category: 3,
  },
  {
    date: "Dec 11",
    fullDate: "2025-12-11",
    bsrHigh: 11,
    bsrLow: 17,
    bsr: 14,
    categoryHigh: 2,
    categoryLow: 4,
    category: 3,
  },
  {
    date: "Dec 12",
    fullDate: "2025-12-12",
    bsrHigh: 10,
    bsrLow: 16,
    bsr: 13,
    categoryHigh: 2,
    categoryLow: 3,
    category: 3,
  },
  {
    date: "Dec 13",
    fullDate: "2025-12-13",
    bsrHigh: 10,
    bsrLow: 15,
    bsr: 12,
    categoryHigh: 2,
    categoryLow: 3,
    category: 2,
  },
  {
    date: "Dec 14",
    fullDate: "2025-12-14",
    bsrHigh: 9,
    bsrLow: 14,
    bsr: 11,
    categoryHigh: 2,
    categoryLow: 3,
    category: 2,
  },
  {
    date: "Dec 15",
    fullDate: "2025-12-15",
    bsrHigh: 8,
    bsrLow: 13,
    bsr: 10,
    categoryHigh: 2,
    categoryLow: 3,
    category: 2,
  },
  {
    date: "Dec 16",
    fullDate: "2025-12-16",
    bsrHigh: 7,
    bsrLow: 12,
    bsr: 9,
    categoryHigh: 1,
    categoryLow: 3,
    category: 2,
  },
  {
    date: "Dec 17",
    fullDate: "2025-12-17",
    bsrHigh: 6,
    bsrLow: 11,
    bsr: 8,
    categoryHigh: 1,
    categoryLow: 2,
    category: 2,
  },
  {
    date: "Dec 18",
    fullDate: "2025-12-18",
    bsrHigh: 6,
    bsrLow: 10,
    bsr: 8,
    categoryHigh: 1,
    categoryLow: 2,
    category: 1,
  },
  {
    date: "Dec 19",
    fullDate: "2025-12-19",
    bsrHigh: 5,
    bsrLow: 9,
    bsr: 7,
    categoryHigh: 1,
    categoryLow: 2,
    category: 1,
  },
  {
    date: "Dec 20",
    fullDate: "2025-12-20",
    bsrHigh: 5,
    bsrLow: 8,
    bsr: 6,
    categoryHigh: 1,
    categoryLow: 2,
    category: 1,
  },
  {
    date: "Dec 21",
    fullDate: "2025-12-21",
    bsrHigh: 4,
    bsrLow: 8,
    bsr: 6,
    categoryHigh: 1,
    categoryLow: 2,
    category: 1,
  },
  {
    date: "Dec 22",
    fullDate: "2025-12-22",
    bsrHigh: 4,
    bsrLow: 7,
    bsr: 5,
    categoryHigh: 1,
    categoryLow: 2,
    category: 1,
  },
  {
    date: "Dec 23",
    fullDate: "2025-12-23",
    bsrHigh: 3,
    bsrLow: 7,
    bsr: 5,
    categoryHigh: 1,
    categoryLow: 1,
    category: 1,
  },
  {
    date: "Dec 24",
    fullDate: "2025-12-24",
    bsrHigh: 3,
    bsrLow: 6,
    bsr: 4,
    categoryHigh: 1,
    categoryLow: 1,
    category: 1,
  },
  {
    date: "Dec 25",
    fullDate: "2025-12-25",
    bsrHigh: 3,
    bsrLow: 6,
    bsr: 4,
    categoryHigh: 1,
    categoryLow: 1,
    category: 1,
  },
  {
    date: "Dec 26",
    fullDate: "2025-12-26",
    bsrHigh: 2,
    bsrLow: 5,
    bsr: 3,
    categoryHigh: 1,
    categoryLow: 1,
    category: 1,
  },
  {
    date: "Dec 27",
    fullDate: "2025-12-27",
    bsrHigh: 2,
    bsrLow: 5,
    bsr: 3,
    categoryHigh: 1,
    categoryLow: 1,
    category: 1,
  },
  {
    date: "Dec 28",
    fullDate: "2025-12-28",
    bsrHigh: 2,
    bsrLow: 4,
    bsr: 3,
    categoryHigh: 1,
    categoryLow: 1,
    category: 1,
  },
  {
    date: "Dec 29",
    fullDate: "2025-12-29",
    bsrHigh: 1,
    bsrLow: 4,
    bsr: 2,
    categoryHigh: 1,
    categoryLow: 1,
    category: 1,
  },
  {
    date: "Dec 30",
    fullDate: "2025-12-30",
    bsrHigh: 1,
    bsrLow: 3,
    bsr: 2,
    categoryHigh: 1,
    categoryLow: 1,
    category: 1,
  },
  {
    date: "Dec 31",
    fullDate: "2025-12-31",
    bsrHigh: 1,
    bsrLow: 3,
    bsr: 2,
    categoryHigh: 1,
    categoryLow: 1,
    category: 1,
  },
  // January 2026
  {
    date: "Jan 1",
    fullDate: "2026-01-01",
    bsrHigh: 1,
    bsrLow: 3,
    bsr: 2,
    categoryHigh: 1,
    categoryLow: 1,
    category: 1,
  },
  {
    date: "Jan 2",
    fullDate: "2026-01-02",
    bsrHigh: 1,
    bsrLow: 2,
    bsr: 1,
    categoryHigh: 1,
    categoryLow: 1,
    category: 1,
  },
  {
    date: "Jan 3",
    fullDate: "2026-01-03",
    bsrHigh: 1,
    bsrLow: 2,
    bsr: 1,
    categoryHigh: 1,
    categoryLow: 1,
    category: 1,
  },
  {
    date: "Jan 4",
    fullDate: "2026-01-04",
    bsrHigh: 1,
    bsrLow: 2,
    bsr: 1,
    categoryHigh: 1,
    categoryLow: 1,
    category: 1,
    isToday: true,
  },
];

// Mock data for Rank Movement Breakdown (donut chart)
const movementDataOverall = [
  { name: "Up Moves", value: 18, color: "#3B82F6" },
  { name: "Stable", value: 7, color: "#A855F7" },
  { name: "Down Moves", value: 3, color: "#EC4899" },
];

const movementDataCategory = [
  { name: "Up Moves", value: 12, color: "#3B82F6" },
  { name: "Stable", value: 10, color: "#A855F7" },
  { name: "Down Moves", value: 6, color: "#EC4899" },
];

// Mock data for Reviews Trend - 1~5 star percentage by month
const reviewsData = [
  {
    month: "Jan",
    "1star": 3,
    "2star": 5,
    "3star": 12,
    "4star": 25,
    "5star": 55,
  },
  {
    month: "Feb",
    "1star": 3,
    "2star": 4,
    "3star": 11,
    "4star": 24,
    "5star": 58,
  },
  {
    month: "Mar",
    "1star": 2,
    "2star": 4,
    "3star": 9,
    "4star": 23,
    "5star": 62,
  },
  {
    month: "Apr",
    "1star": 2,
    "2star": 3,
    "3star": 8,
    "4star": 22,
    "5star": 65,
  },
  {
    month: "May",
    "1star": 2,
    "2star": 2,
    "3star": 7,
    "4star": 21,
    "5star": 68,
  },
  {
    month: "Jun",
    "1star": 2,
    "2star": 2,
    "3star": 6,
    "4star": 20,
    "5star": 70,
  },
  {
    month: "Jul",
    "1star": 2,
    "2star": 2,
    "3star": 6,
    "4star": 19,
    "5star": 71,
  },
  {
    month: "Aug",
    "1star": 1,
    "2star": 2,
    "3star": 5,
    "4star": 19,
    "5star": 73,
  },
  {
    month: "Sep",
    "1star": 1,
    "2star": 2,
    "3star": 5,
    "4star": 18,
    "5star": 74,
  },
  {
    month: "Oct",
    "1star": 1,
    "2star": 1,
    "3star": 4,
    "4star": 18,
    "5star": 76,
  },
  {
    month: "Nov",
    "1star": 1,
    "2star": 1,
    "3star": 4,
    "4star": 17,
    "5star": 77,
  },
  {
    month: "Dec",
    "1star": 1,
    "2star": 1,
    "3star": 3,
    "4star": 17,
    "5star": 78,
  },
];

export function ProductDetailPage({
  productName,
  asin,
  category,
  thumbnail,
  rankCategories,
  onBack,
  promotions,
  setPromotions,
}: ProductDetailProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPromotionPopover, setShowPromotionPopover] =
    useState(false);
  const [selectedPromotions, setSelectedPromotions] = useState<
    string[]
  >([]);

  // Helper to get short month name
  const getShortMonthName = (month: number) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[month];
  };

  // Convert promotions from App.tsx format to component format
  // Show events that overlap with the 30-day window around today (Jan 4, 2026)
  const upcomingPromotions = promotions
    .filter((promo) => {
      // Today is Jan 4, 2026
      const today = new Date(2026, 0, 4); // month is 0-indexed
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30); // Dec 5, 2025
      const thirtyDaysFromNow = new Date(today);
      thirtyDaysFromNow.setDate(today.getDate() + 30); // Feb 3, 2026

      // Event start and end dates
      const eventStart = new Date(
        promo.year,
        promo.month,
        promo.startDate,
      );
      const eventEnd = new Date(
        promo.year,
        promo.month,
        promo.endDate,
      );

      // Check if event overlaps with the 30-day window
      // Event overlaps if: event starts before window ends AND event ends after window starts
      return (
        eventStart <= thirtyDaysFromNow &&
        eventEnd >= thirtyDaysAgo
      );
    })
    .map((promo) => {
      const monthName = getShortMonthName(promo.month);
      return {
        id: promo.id,
        name: promo.title,
        dateRange: `${monthName} ${promo.startDate}${promo.startDate !== promo.endDate ? `-${promo.endDate}` : ""}`,
        color: promo.color,
        startDay: `${monthName} ${promo.startDate}`,
        endDay: `${monthName} ${promo.endDate}`,
        month: promo.month,
        year: promo.year,
      };
    });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rankType, setRankType] = useState<
    "overall" | "category"
  >("overall");
  const [movementRankType, setMovementRankType] = useState<
    "overall" | "category"
  >("overall");
  const [showTooltip, setShowTooltip] = useState(false);

  // Popper refs
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] =
    useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: "bottom-end",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 8],
          },
        },
      ],
    },
  );

  // Calendar configuration
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Generate calendar days for current month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const year = currentYear;
    const daysInMonth = getDaysInMonth(currentMonth, year);
    const firstDay = getFirstDayOfMonth(currentMonth, year);
    const days: (number | null)[] = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const removePromotion = (id: number) => {
    // In real app, this would remove from global state
    console.log("Remove promotion:", id);
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showPromotionPopover &&
        referenceElement &&
        popperElement &&
        !referenceElement.contains(event.target as Node) &&
        !popperElement.contains(event.target as Node)
      ) {
        setShowPromotionPopover(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, [showPromotionPopover, referenceElement, popperElement]);

  // Filter data based on selected period
  const getFilteredData = () => {
    if (selectedPeriod === "7d") {
      return rankTrendData.slice(-7);
    } else if (selectedPeriod === "14d") {
      return rankTrendData.slice(-14);
    } else {
      return rankTrendData; // 30d shows all data
    }
  };

  const filteredRankData = getFilteredData();

  // Calculate dynamic Y-axis domain based on filtered data
  const calculateYAxisDomain = () => {
    const dataKey = rankType === "overall" ? "bsr" : "category";
    const values = filteredRankData.map((d) => d[dataKey]);

    if (values.length === 0)
      return { min: 0, max: 60, ticks: [0, 15, 30, 45, 60] };

    // Calculate average
    const average =
      values.reduce((sum, val) => sum + val, 0) / values.length;

    // Round to nearest 10 (10의 자리)
    const center = Math.round(average / 10) * 10;

    // Set min and max with ±10 from center
    const min = Math.max(0, center - 10);
    const max = center + 10;

    // Create ticks array with 5 points
    const ticks = [min, min + 5, center, max - 5, max];

    return { min, max, ticks };
  };

  const yAxisConfig = calculateYAxisDomain();

  // Get X-axis ticks to ensure last element (today) is always shown
  const getXAxisTicks = () => {
    const data = filteredRankData;
    const length = data.length;

    if (selectedPeriod === "7d") {
      // Show all days for 7 days
      return data.map((d) => d.date);
    } else if (selectedPeriod === "14d") {
      // Show every other day, but always include first and last
      const ticks = [];
      for (let i = 0; i < length; i += 2) {
        ticks.push(data[i].date);
      }
      // Ensure last element is included
      if (!ticks.includes(data[length - 1].date)) {
        ticks.push(data[length - 1].date);
      }
      return ticks;
    } else {
      // 30d: Show every 5th day, but always include first and last
      const ticks = [];
      for (let i = 0; i < length; i += 5) {
        ticks.push(data[i].date);
      }
      // Ensure last element is included
      if (!ticks.includes(data[length - 1].date)) {
        ticks.push(data[length - 1].date);
      }
      return ticks;
    }
  };

  const togglePromotion = (id: string) => {
    setSelectedPromotions((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id],
    );
  };

  const activePromotions = upcomingPromotions.filter((promo) =>
    selectedPromotions.includes(promo.id),
  );

  // Get date range based on selected period
  const getDateRange = () => {
    // Today is Jan 4, 2026
    if (selectedPeriod === "7d") {
      return "Dec 29, 2025 - Jan 4, 2026"; // 7 days including today
    } else if (selectedPeriod === "14d") {
      return "Dec 22, 2025 - Jan 4, 2026"; // 14 days including today
    } else {
      return "Dec 6, 2025 - Jan 4, 2026"; // 30 days including today
    }
  };

  const exportToExcel = () => {
    const worksheetData = [
      ["Date", "BSR Rank", "Category Rank"],
      ...filteredRankData.map((data) => [
        data.date,
        data.bsr,
        data.category,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Rank Trend",
    );

    const fileName = `RankTrend_${startDate || "All"}_${endDate || "All"}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    setShowExportModal(false);
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      {/* Back button and Update Time */}
      <div className="max-w-[1440px] mx-auto px-10 pt-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-[#2F6FE4] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">
              Back to Product List
            </span>
          </button>
          <span className="text-xs text-gray-500">
            Updated: Jan 4, 2026 at 15:00
          </span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-[1440px] mx-auto px-10 py-6">
        <div className="space-y-4">
          {/* Top Row: Product Card + Rank Trend Chart */}
          <div className="flex gap-4">
            {/* Left: Product Context Card */}
            <div className="w-[300px] flex-shrink-0">
              <div className="bg-white rounded-[15px] shadow-[0_2px_16px_rgba(0,0,0,0.08)] p-6 flex flex-col h-[460px]">
                {/* Product Image */}
                <div className="w-full h-[180px] bg-gray-100 rounded-[15px] mb-4 overflow-hidden">
                  <img
                    src={thumbnail}
                    alt={productName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Name */}
                <h2 className="text-lg font-semibold text-gray-900 mb-4 leading-snug">
                  {productName}
                </h2>

                {/* Meta Info - 2 columns */}
                <div className="space-y-3 mb-4 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      ASIN
                    </span>
                    <a
                      href={`https://www.amazon.com/dp/${asin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-700 hover:text-[#2F6FE4] transition-colors cursor-pointer"
                    >
                      {asin}
                    </a>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Category
                    </span>
                    <span className="text-sm text-gray-700">
                      {category}
                    </span>
                  </div>
                </div>

                {/* Ranking Cards */}
                <div className="space-y-2">
                  {/* Overall BSR Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[15px] p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 font-medium">
                        {rankCategories[0]}
                      </span>
                      <div className="text-right ml-2">
                        <div
                          className="font-bold text-[#2F6FE4]"
                          style={{
                            fontSize: "16px",
                            lineHeight: "1.2",
                          }}
                        >
                          #107
                        </div>
                        <div className="flex items-center justify-end gap-0.5 mt-0.5">
                          <ArrowUp className="w-3 h-3 text-[#2F6FE4]" />
                          <span className="text-xs text-[#2F6FE4] font-semibold">
                            12
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Rank Card */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-[15px] p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 font-medium">
                        {rankCategories[1]}
                      </span>
                      <div className="text-right ml-2">
                        <div
                          className="font-bold text-[#7C3AED]"
                          style={{
                            fontSize: "16px",
                            lineHeight: "1.2",
                          }}
                        >
                          #5
                        </div>
                        <div className="flex items-center justify-end gap-0.5 mt-0.5">
                          <ArrowUp className="w-3 h-3 text-[#2F6FE4]" />
                          <span className="text-xs text-[#2F6FE4] font-semibold">
                            2
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Main Chart Card */}
            <div className="flex-1">
              <div className="bg-white rounded-[15px] shadow-[0_2px_16px_rgba(0,0,0,0.08)] p-6 h-[460px] flex flex-col">
                {/* Chart Header */}
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                  <div>
                    <div className="flex items-end gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Rank Trend
                      </h3>
                      <div className="flex gap-2 mb-0.5">
                        <button
                          onClick={() => setRankType("overall")}
                          className={`px-3 py-1.5 text-xs rounded-[15px] transition-colors ${
                            rankType === "overall"
                              ? "bg-[#2F6FE4] text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {rankCategories[0]}
                        </button>
                        <button
                          onClick={() =>
                            setRankType("category")
                          }
                          className={`px-3 py-1.5 text-xs rounded-[15px] transition-colors ${
                            rankType === "category"
                              ? "bg-[#2F6FE4] text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {rankCategories[1]}
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1.5">
                      {getDateRange()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      ref={setReferenceElement}
                      onClick={() =>
                        setShowPromotionPopover(
                          !showPromotionPopover,
                        )
                      }
                      className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-[#2F6FE4] hover:text-[#2F6FE4] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Events</span>
                    </button>

                    {/* Period Selector - Same style as Sales Overview */}
                    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-[15px]">
                      <button
                        onClick={() => setSelectedPeriod("7d")}
                        className={`px-4 py-1.5 text-sm transition-colors rounded-[12px] ${
                          selectedPeriod === "7d"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        7 days
                      </button>
                      <button
                        onClick={() => setSelectedPeriod("14d")}
                        className={`px-4 py-1.5 text-sm transition-colors rounded-[12px] ${
                          selectedPeriod === "14d"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        14 days
                      </button>
                      <button
                        onClick={() => setSelectedPeriod("30d")}
                        className={`px-4 py-1.5 text-sm transition-colors rounded-[12px] ${
                          selectedPeriod === "30d"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        30 days
                      </button>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="relative flex-1 min-h-0">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <LineChart
                      data={filteredRankData}
                      margin={{
                        top: 5,
                        right: 35,
                        left: -25,
                        bottom: 5,
                      }}
                    >
                      <defs>
                        <linearGradient
                          id="bsrRangeGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#F59E0B"
                            stopOpacity={0.15}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8B5CF6"
                            stopOpacity={0.15}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#E5E7EB"
                        vertical={false}
                      />
                      {/* Promotion Background Areas */}
                      {activePromotions.map((promo) => {
                        // Get the visible date range (first and last dates in filteredRankData)
                        const visibleStartDate =
                          filteredRankData[0]?.date;
                        const visibleEndDate =
                          filteredRankData[
                            filteredRankData.length - 1
                          ]?.date;

                        // Check if promo intersects with visible range
                        const startIdx =
                          filteredRankData.findIndex(
                            (d) => d.date === promo.startDay,
                          );
                        const endIdx =
                          filteredRankData.findIndex(
                            (d) => d.date === promo.endDay,
                          );

                        // If both start and end are outside visible range, skip this event
                        if (startIdx === -1 && endIdx === -1) {
                          return null;
                        }

                        // Clamp x1 and x2 to visible range
                        let x1 = promo.startDay;
                        let x2 = promo.endDay;

                        // If event starts before visible range, start from first visible date
                        if (startIdx === -1) {
                          x1 = visibleStartDate;
                        }

                        // If event ends after visible range, end at last visible date
                        if (endIdx === -1) {
                          x2 = visibleEndDate;
                        }

                        // Find the actual end index after clamping
                        const clampedEndIdx =
                          filteredRankData.findIndex(
                            (d) => d.date === x2,
                          );

                        // Always extend x2 to the next day to show event coverage
                        // e.g., Jan 1 event covers Jan 1-2, Jan 2-3 event covers Jan 2-4
                        if (
                          clampedEndIdx >= 0 &&
                          clampedEndIdx <
                            filteredRankData.length - 1
                        ) {
                          x2 =
                            filteredRankData[clampedEndIdx + 1]
                              .date;
                        }

                        return (
                          <ReferenceArea
                            key={promo.id}
                            x1={x1}
                            x2={x2}
                            fill={promo.color}
                            fillOpacity={0.3}
                            strokeOpacity={0}
                          />
                        );
                      })}
                      <XAxis
                        dataKey="date"
                        axisLine={{ stroke: "#E5E7EB" }}
                        tickLine={false}
                        ticks={getXAxisTicks()}
                        tick={(props) => {
                          const { x, y, payload } = props;
                          const dataPoint =
                            filteredRankData.find(
                              (d) => d.date === payload.value,
                            );
                          const isToday = dataPoint?.isToday;

                          return (
                            <text
                              x={x}
                              y={y + 10}
                              textAnchor="middle"
                              fill={
                                isToday ? "#2F6FE4" : "#9CA3AF"
                              }
                              fontSize={11}
                              fontWeight={isToday ? 700 : 400}
                            >
                              {payload.value}
                            </text>
                          );
                        }}
                      />
                      <YAxis
                        tick={{ fill: "#9CA3AF", fontSize: 11 }}
                        axisLine={{ stroke: "#E5E7EB" }}
                        tickLine={false}
                        reversed
                        domain={[
                          yAxisConfig.min,
                          yAxisConfig.max,
                        ]}
                        ticks={yAxisConfig.ticks}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "11px",
                          boxShadow:
                            "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                        content={({ active, payload }) => {
                          if (
                            active &&
                            payload &&
                            payload.length
                          ) {
                            const data = payload[0].payload;
                            const monthAbbr = [
                              "Jan",
                              "Feb",
                              "Mar",
                              "Apr",
                              "May",
                              "Jun",
                              "Jul",
                              "Aug",
                              "Sep",
                              "Oct",
                              "Nov",
                              "Dec",
                            ];
                            return (
                              <div
                                style={{
                                  backgroundColor: "#fff",
                                  border: "1px solid #E5E7EB",
                                  borderRadius: "8px",
                                  fontSize: "11px",
                                  boxShadow:
                                    "0 4px 12px rgba(0,0,0,0.1)",
                                  padding: "8px 12px",
                                }}
                              >
                                <div
                                  style={{
                                    marginBottom: "6px",
                                    color: "#374151",
                                    fontWeight: 600,
                                    fontSize: "12px",
                                  }}
                                >
                                  {data.fullDate}
                                </div>
                                <div
                                  style={{
                                    color: "#1F2937",
                                    fontSize: "12px",
                                    fontWeight: 500,
                                  }}
                                >
                                  Best: #
                                  {rankType === "overall"
                                    ? data.bsrHigh
                                    : data.categoryHigh}{" "}
                                  | Worst: #
                                  {rankType === "overall"
                                    ? data.bsrLow
                                    : data.categoryLow}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        align="center"
                        height={30}
                        iconType="line"
                        wrapperStyle={{
                          fontSize: "13px",
                          paddingTop: "8px",
                        }}
                        formatter={(value) => (
                          <span style={{ color: "#6B7280" }}>
                            {value}
                          </span>
                        )}
                      />
                      <Line
                        type="monotone"
                        dataKey={
                          rankType === "overall"
                            ? "bsrLow"
                            : "categoryLow"
                        }
                        stroke="#EC4899"
                        strokeWidth={2.5}
                        dot={false}
                        name="Lowest Rank"
                      />
                      <Line
                        type="monotone"
                        dataKey={
                          rankType === "overall"
                            ? "bsrHigh"
                            : "categoryHigh"
                        }
                        stroke="#3B82F6"
                        strokeWidth={2.5}
                        dot={false}
                        name="Highest Rank"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Row: What Worked + Rank Movement + Reviews */}
          <div className="flex gap-4">
            {/* Left: What Worked Box */}
            <div className="w-[616px] flex-shrink-0">
              <div
                className="bg-white rounded-[15px] shadow-[0_2px_16px_rgba(0,0,0,0.08)] p-6 flex flex-col"
                style={{ height: "400px" }}
              >
                <div className="flex items-center gap-2 mb-5 flex-shrink-0">
                  <h4>What Worked, What's Next</h4>
                  <div
                    className="relative"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    {showTooltip && (
                      <div className="absolute left-0 top-full mt-1 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-50 shadow-lg">
                        전일 데이터 기준으로 작성된 내용입니다
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div>
                    <div className="text-sm text-gray-900 mb-2">
                      What worked:
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      15% coupon activation on Feb 13 drove rank
                      spike. BSR improved by 18 positions within
                      3 days. Discount campaign contributed 73%
                      of upward movement. The promotional
                      strategy aligned perfectly with seasonal
                      demand patterns, resulting in a sustained
                      increase in organic visibility.
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed mt-3">
                      Enhanced A+ content update on Feb 10 led
                      to a 12% increase in conversion rate.
                      Product imagery refresh and lifestyle
                      photos resonated well with target audience
                      demographics. Customer reviews highlighted
                      improved product presentation as a key
                      factor in purchase decisions.
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed mt-3">
                      Lightning deal participation on Feb 18
                      generated significant traffic surge. Deal
                      exposure resulted in 250+ units sold
                      within 6 hours, pushing rank up by 8
                      positions. Post-deal velocity maintained
                      elevated sales pattern for 4 days.
                    </p>
                  </div>

                  <div>
                    <div className="text-sm text-gray-900 mb-2">
                      What's next:
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-[#2F6FE4] mt-1">
                          •
                        </span>
                        <span>
                          Consider repeating promotional
                          strategy in Q2 with emphasis on
                          weekend timing to capture higher
                          consumer traffic patterns
                        </span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-[#2F6FE4] mt-1">
                          •
                        </span>
                        <span>
                          Monitor competitor pricing and
                          maintain stock levels above 200 units
                          to avoid out-of-stock penalties
                        </span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-[#2F6FE4] mt-1">
                          •
                        </span>
                        <span>
                          Optimize PPC campaigns by increasing
                          bid for high-performing keywords
                          identified during promotion period
                        </span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-[#2F6FE4] mt-1">
                          •
                        </span>
                        <span>
                          Request early reviewer program
                          participation for newly launched
                          variants to build initial social proof
                        </span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-[#2F6FE4] mt-1">
                          •
                        </span>
                        <span>
                          Analyze conversion funnel drop-off
                          points and implement A/B testing for
                          product title and bullet points
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Two charts side by side */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              {/* Rank Movement Breakdown */}
              <div
                className="bg-white rounded-[15px] shadow-[0_2px_16px_rgba(0,0,0,0.08)] p-6"
                style={{ height: "400px" }}
              >
                <h4 className="mb-3">
                  Rank Movement Breakdown
                </h4>
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() =>
                      setMovementRankType("overall")
                    }
                    className={`px-3 py-1.5 text-xs rounded-[15px] transition-colors ${
                      movementRankType === "overall"
                        ? "bg-[#2F6FE4] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {rankCategories[0]}
                  </button>
                  <button
                    onClick={() =>
                      setMovementRankType("category")
                    }
                    className={`px-3 py-1.5 text-xs rounded-[15px] transition-colors ${
                      movementRankType === "category"
                        ? "bg-[#2F6FE4] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {rankCategories[1]}
                  </button>
                </div>

                <div className="flex items-center justify-center mb-5">
                  <ResponsiveContainer
                    width="100%"
                    height={160}
                  >
                    <PieChart>
                      <Pie
                        data={
                          movementRankType === "overall"
                            ? movementDataOverall
                            : movementDataCategory
                        }
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {movementRankType === "overall"
                          ? movementDataOverall.map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ),
                            )
                          : movementDataCategory.map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ),
                            )}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {movementRankType === "overall"
                    ? movementDataOverall.map((item) => {
                        const total =
                          movementDataOverall.reduce(
                            (sum, d) => sum + d.value,
                            0,
                          );
                        const percentage = (
                          (item.value / total) *
                          100
                        ).toFixed(1);
                        return (
                          <div
                            key={item.name}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor: item.color,
                                }}
                              />
                              <span className="text-sm text-gray-600">
                                {item.name}
                              </span>
                            </div>
                            <span className="text-sm text-gray-900">
                              {percentage}%
                            </span>
                          </div>
                        );
                      })
                    : movementDataCategory.map((item) => {
                        const total =
                          movementDataCategory.reduce(
                            (sum, d) => sum + d.value,
                            0,
                          );
                        const percentage = (
                          (item.value / total) *
                          100
                        ).toFixed(1);
                        return (
                          <div
                            key={item.name}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor: item.color,
                                }}
                              />
                              <span className="text-sm text-gray-600">
                                {item.name}
                              </span>
                            </div>
                            <span className="text-sm text-gray-900">
                              {percentage}%
                            </span>
                          </div>
                        );
                      })}
                </div>
              </div>

              {/* Reviews Trend */}
              <div
                className="bg-white rounded-[15px] shadow-[0_2px_16px_rgba(0,0,0,0.08)] p-6 flex flex-col"
                style={{ height: "400px" }}
              >
                <h4 className="mb-4 flex-shrink-0">
                  Review Rating Distribution (Monthly)
                </h4>

                <div className="flex-1 min-h-0">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <AreaChart
                      data={reviewsData}
                      margin={{
                        top: 10,
                        right: 5,
                        left: -20,
                        bottom: 5,
                      }}
                    >
                      <defs>
                        <linearGradient
                          id="color1star"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#DBEAFE"
                            stopOpacity={0.5}
                          />
                          <stop
                            offset="95%"
                            stopColor="#DBEAFE"
                            stopOpacity={0.3}
                          />
                        </linearGradient>
                        <linearGradient
                          id="color2star"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#93C5FD"
                            stopOpacity={0.6}
                          />
                          <stop
                            offset="95%"
                            stopColor="#93C5FD"
                            stopOpacity={0.4}
                          />
                        </linearGradient>
                        <linearGradient
                          id="color3star"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#60A5FA"
                            stopOpacity={0.7}
                          />
                          <stop
                            offset="95%"
                            stopColor="#60A5FA"
                            stopOpacity={0.5}
                          />
                        </linearGradient>
                        <linearGradient
                          id="color4star"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3B82F6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3B82F6"
                            stopOpacity={0.6}
                          />
                        </linearGradient>
                        <linearGradient
                          id="color5star"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#1E3A8A"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="95%"
                            stopColor="#1E3A8A"
                            stopOpacity={0.7}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#E5E7EB"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: "#9CA3AF", fontSize: 10 }}
                        axisLine={{ stroke: "#E5E7EB" }}
                        tickLine={false}
                        interval={0}
                      />
                      <YAxis
                        tick={{ fill: "#9CA3AF", fontSize: 10 }}
                        axisLine={{ stroke: "#E5E7EB" }}
                        tickLine={false}
                        domain={[0, 100]}
                        ticks={[0, 25, 50, 75, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "11px",
                          boxShadow:
                            "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                        formatter={(value) => `${value}%`}
                      />
                      <Legend
                        verticalAlign="bottom"
                        align="center"
                        height={30}
                        iconType="square"
                        wrapperStyle={{
                          fontSize: "10px",
                          paddingTop: "4px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                        formatter={(value) => (
                          <span style={{ color: "#6B7280" }}>
                            {value}
                          </span>
                        )}
                      />
                      <Area
                        type="monotone"
                        dataKey="1star"
                        stackId="1"
                        stroke="#DBEAFE"
                        fill="url(#color1star)"
                        strokeWidth={0}
                        name="1★"
                      />
                      <Area
                        type="monotone"
                        dataKey="2star"
                        stackId="1"
                        stroke="#93C5FD"
                        fill="url(#color2star)"
                        strokeWidth={0}
                        name="2★"
                      />
                      <Area
                        type="monotone"
                        dataKey="3star"
                        stackId="1"
                        stroke="#60A5FA"
                        fill="url(#color3star)"
                        strokeWidth={0}
                        name="3★"
                      />
                      <Area
                        type="monotone"
                        dataKey="4star"
                        stackId="1"
                        stroke="#3B82F6"
                        fill="url(#color4star)"
                        strokeWidth={0}
                        name="4★"
                      />
                      <Area
                        type="monotone"
                        dataKey="5star"
                        stackId="1"
                        stroke="#1E3A8A"
                        fill="url(#color5star)"
                        strokeWidth={0}
                        name="5★"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-[400px]">
            <div className="flex items-center justify-between mb-5">
              <h5 className="text-lg font-semibold text-gray-900">
                Export Data
              </h5>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#2F6FE4] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#2F6FE4] transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 px-4 py-2 bg-[#2F6FE4] text-white text-sm rounded-lg hover:bg-[#2557b8] transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promotion Popover */}
      {showPromotionPopover && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          className="z-50"
        >
          <div className="bg-white rounded-lg shadow-2xl w-[320px] border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h4 className="text-sm font-medium text-gray-900">
                Select Events
              </h4>
              <button
                onClick={() => setShowPromotionPopover(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Promotions List */}
            <div className="p-3">
              {upcomingPromotions.length > 0 ? (
                <div className="space-y-2">
                  {upcomingPromotions.map((promo) => (
                    <button
                      key={promo.id}
                      onClick={() => togglePromotion(promo.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      {/* Color Indicator */}
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: promo.color }}
                      />

                      {/* Promotion Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-900 font-medium">
                          {promo.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {promo.dateRange}
                        </div>
                      </div>

                      {/* Checkbox */}
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          selectedPromotions.includes(promo.id)
                            ? "bg-[#2F6FE4] border-[#2F6FE4]"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        {selectedPromotions.includes(
                          promo.id,
                        ) && (
                          <Check
                            className="w-3 h-3 text-white"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 text-center py-4">
                  No events available for this product
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}