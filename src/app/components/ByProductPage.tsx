import { useState } from 'react';
import { Search, Filter, RotateCcw, ArrowUp, ArrowDown, Minus, Calendar as CalendarIcon, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Product } from '../App';

interface ByProductPageProps {
  products: Product[];
  onProductClick: (product: { productName: string; asin: string; category: string; thumbnail: string; rankCategories: string[] }) => void;
}

const ITEMS_PER_PAGE = 8;

export function ByProductPage({ products, onProductClick }: ByProductPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('14 Feb 2019');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedVolatility, setSelectedVolatility] = useState<string>('All');
  const [selectedCollection, setSelectedCollection] = useState<string>('All');

  // Get unique collections from products
  const collections = Array.from(new Set(products.map(p => p.collection).filter(Boolean))) as string[];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.asin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.collection && product.collection.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesVolatility = selectedVolatility === 'All' || product.volatility === selectedVolatility;
    const matchesCollection = selectedCollection === 'All' || product.collection === selectedCollection;

    return matchesSearch && matchesCategory && matchesVolatility && matchesCollection;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDate('14 Feb 2019');
    setSelectedCategory('All');
    setSelectedVolatility('All');
    setSelectedCollection('All');
  };

  const handleDateSelect = (day: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[1]; // February for now
    setSelectedDate(`${day} ${month} 2019`);
    setShowCalendar(false);
  };

  const getVolatilityColor = (volatility: 'High' | 'Mid' | 'Low') => {
    switch (volatility) {
      case 'High':
        return 'bg-[#FFCDD2] text-[#C62828]'; // 파스텔 레드
      case 'Mid':
        return 'bg-[#FFF9C4] text-[#F57C00]'; // 파스텔 옐로우
      case 'Low':
        return 'bg-[#C8E6C9] text-[#2E7D32]'; // 파스텔 그린
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6">
      {/* Filter Bar with Search */}
      <div className="bg-white border border-gray-200 mb-4 flex items-center justify-between rounded-[15px]">
        <div className="flex items-center">
          <div className="flex items-center gap-2 px-6 py-4 border-r border-gray-200">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">Filter By</span>
          </div>

          {/* Collection Filter */}
          <div className="flex items-center gap-2 px-6 py-4 border-r border-gray-200">
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="text-sm text-gray-700 bg-transparent border-none outline-none cursor-pointer focus:outline-none"
            >
              <option value="All">All Collections</option>
              <option value="Sleeping Masks">Sleeping Masks</option>
              <option value="Bouncy & Firm">Bouncy & Firm</option>
              <option value="Perfect Renew">Perfect Renew</option>
              <option value="Water Bank">Water Bank</option>
              <option value="Cream Skin">Cream Skin</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 px-6 py-4 border-r border-gray-200">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-sm text-gray-700 bg-transparent border-none outline-none cursor-pointer focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Sets & Bundles">Sets & Bundles</option>
              <option value="Lip-Care">Lip-Care</option>
              <option value="Masks">Masks</option>
              <option value="Moisturizers">Moisturizers</option>
              <option value="Toners">Toners</option>
              <option value="Serums">Serums</option>
              <option value="Cleansers">Cleansers</option>
              <option value="Creams">Creams</option>
              <option value="Sun Care">Sun Care</option>
              <option value="Powders">Powders</option>
            </select>
          </div>

          {/* Volatility Filter */}
          <div className="flex items-center gap-2 px-6 py-4 border-r border-gray-200">
            <select
              value={selectedVolatility}
              onChange={(e) => setSelectedVolatility(e.target.value)}
              className="text-sm text-gray-700 bg-transparent border-none outline-none cursor-pointer focus:outline-none"
            >
              <option value="All">All Volatility</option>
              <option value="High">High</option>
              <option value="Mid">Mid</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Reset Filter */}
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-2 px-6 py-4 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        {/* Search - Right side, compact */}
        <div className="relative flex items-center gap-2 px-6 py-4 border-l border-gray-200 w-64">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-sm focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="w-4 h-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Update Time */}
      <div className="flex justify-end mb-2">
        <span className="text-xs text-gray-500">Updated: Jan 4, 2026 at 15:00</span>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-200 rounded-[15px]">
        {/* Fixed Header Table */}
        <table className="w-full" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '5%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '29%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '14%' }} />
          </colgroup>
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-6 text-gray-500 text-xs uppercase tracking-wider">NO.</th>
              <th className="text-left py-4 px-6 text-gray-500 text-xs uppercase tracking-wider">ASIN</th>
              <th className="text-left py-4 px-6 text-gray-500 text-xs uppercase tracking-wider">PRODUCT NAME</th>
              <th className="text-center py-4 px-6 text-gray-500 text-xs uppercase tracking-wider">COLLECTIONS</th>
              <th className="text-center py-4 px-6 text-gray-500 text-xs uppercase tracking-wider">CATEGORY</th>
              <th className="text-center py-4 px-6 text-gray-500 text-xs uppercase tracking-wider">SKU RANK CHANGE</th>
              <th className="text-center py-4 px-6 text-gray-500 text-xs uppercase tracking-wider">VOLATILITY</th>
            </tr>
          </thead>
        </table>
        
        {/* Scrollable Body */}
        <div className="overflow-x-hidden max-h-[640px] overflow-y-auto custom-scrollbar">
          <table className="w-full" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '5%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '29%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '14%' }} />
              <col style={{ width: '14%' }} />
            </colgroup>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr 
                  key={index} 
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onProductClick({
                    productName: product.productName,
                    asin: product.asin,
                    category: product.category,
                    thumbnail: product.thumbnail,
                    rankCategories: product.rankCategories,
                  })}
                >
                  <td className="py-4 px-6 text-sm text-gray-500">{index + 1}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{product.asin}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.thumbnail} 
                        alt={product.productName}
                        className="w-12 h-12 object-cover"
                      />
                      <span className="text-sm text-gray-900">{product.productName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 text-center">
                    {product.collection || '-'}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-[8px] whitespace-nowrap">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700">
                    <div className="flex items-center justify-center gap-1">
                      {product.rankChange > 0 ? (
                        <>
                          <ArrowUp className="w-4 h-4 text-[#2F6FE4]" />
                          <span className="text-[#2F6FE4]">{product.rankChange}</span>
                        </>
                      ) : product.rankChange < 0 ? (
                        <>
                          <ArrowDown className="w-4 h-4 text-red-600" />
                          <span className="text-red-600">{Math.abs(product.rankChange)}</span>
                        </>
                      ) : (
                        <>
                          <Minus className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-500">0</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-block px-3 py-1 text-sm rounded-[8px] w-16 ${getVolatilityColor(product.volatility)}`}>
                      {product.volatility}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}