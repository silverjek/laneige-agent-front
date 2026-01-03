import { useState } from 'react';
import { Header } from './components/Header';
import { TopNav } from './components/TopNav';
import { KPICards } from './components/KPICards';
import { SalesChart } from './components/SalesChart';
import { AIInsightPanel } from './components/AIInsightPanel';
import { DealsTable } from './components/DealsTable';
import { CalendarWidget } from './components/CalendarWidget';
import { ByProductPage } from './components/ByProductPage';
import { ProductDetailPage } from './components/ProductDetailPage';

interface SelectedProduct {
  productName: string;
  asin: string;
  category: string;
  thumbnail: string;
  rankCategories: string[];
}

export interface Promotion {
  id: string;
  year: number;
  month: number;
  startDate: number;
  endDate: number;
  title: string;
  product: string;
  color: string;
}

export interface Product {
  asin: string;
  productName: string;
  thumbnail: string;
  category: 'Lip-Care' | 'Masks' | 'Moisturizers' | 'Toners' | 'Serums' | 'Cleansers' | 'Creams' | 'Sun Care' | 'Powders' | 'Sets & Bundles';
  collection?: string | null; // e.g., 'Water Bank', 'Cream Skin', null for products without collection
  rankChange: number;
  volatility: 'Low' | 'Mid' | 'High';
  rankCategories: string[]; // e.g., ['Beauty & Personal Care', 'Lip Care']
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'byProduct'>('overview');
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null);
  const [startDate] = useState(new Date(2025, 0, 20)); // Jan 20, 2025
  const [endDate] = useState(new Date(2025, 0, 27)); // Jan 27, 2025
  
  // Centralized promotion data
  // Today is Jan 4, 2026
  const [promotions, setPromotions] = useState<Promotion[]>([
    { id: '1', year: 2026, month: 0, startDate: 1, endDate: 1, title: 'New Year Sale', product: 'Water Sleeping Mask', color: '#FF6B6B' },
    { id: '2', year: 2026, month: 0, startDate: 2, endDate: 3, title: 'Flash Deal', product: 'Lip Sleeping Mask', color: '#4ECDC4' },
  ]);

  // Centralized product data
  const [products] = useState<Product[]>([
    {
      asin: 'B07XXPHQZK',
      productName: 'LANEIGE Lip Sleeping Mask (Berry)',
      thumbnail: 'https://m.media-amazon.com/images/I/51H5SkeGANL._SX522_.jpg',
      category: 'Lip-Care',
      rankChange: 12,
      volatility: 'High',
      rankCategories: ['Beauty & Personal Care', 'Lip Balms & Moisturizers'],
    },
    {
      asin: 'B072BHZ41J',
      productName: 'LANEIGE Lip Sleeping Mask (Vanilla)',
      thumbnail: 'https://m.media-amazon.com/images/I/51FfcCKm1EL._SX522_.jpg',
      category: 'Lip-Care',
      rankChange: -3,
      volatility: 'Low',
      rankCategories: ['Beauty & Personal Care', 'Lip Balms & Moisturizers'],
    },
    {
      asin: 'B09HN81KVR',
      productName: 'LANEIGE Lip Sleeping Mask (Sweet Candy)',
      thumbnail: 'https://m.media-amazon.com/images/I/51we3cCnmfL._SX522_.jpg',
      category: 'Lip-Care',
      rankChange: 7,
      volatility: 'Mid',
      rankCategories: ['Beauty & Personal Care', 'Lip Balms & Moisturizers'],
    },
    {
      asin: 'B0F9PY6KTG',
      productName: 'LANEIGE Lip Sleeping Mask (Strawberry Shortcake)',
      thumbnail: 'https://m.media-amazon.com/images/I/61FfcOsVQvL._SX522_.jpg',
      category: 'Lip-Care',
      rankChange: 0,
      volatility: 'Low',
      rankCategories: ['Beauty & Personal Care', 'Lip Balms & Moisturizers'],
    },
    {
      asin: 'B0F6L1MT26',
      productName: 'LANEIGE Lip Sleeping Mask (Taro Bubble Tea)',
      thumbnail: 'https://m.media-amazon.com/images/I/51DoE85QVZL._SX522_.jpg',
      category: 'Lip-Care',
      rankChange: 15,
      volatility: 'High',
      rankCategories: ['Beauty & Personal Care', 'Lip Balms & Moisturizers'],
    },

    {
      asin: 'B09HN7NTJP',
      productName: 'LANEIGE Lip Glowy Balm (Gummy Bear)',
      thumbnail: 'https://m.media-amazon.com/images/I/61ppwUnmQgL._SX522_.jpg',
      category: 'Lip-Care',
      rankChange: -8,
      volatility: 'Mid',
      rankCategories: ['Beauty & Personal Care', 'Lip Balms & Moisturizers'],
    },
    {
      asin: 'B0CZYJYX4Q',
      productName: 'LANEIGE Lip Glowy Balm (Mango)',
      thumbnail: 'https://m.media-amazon.com/images/I/61yjzhdqgsL._SX522_.jpg',
      category: 'Lip-Care',
      rankChange: 4,
      volatility: 'Low',
      rankCategories: ['Beauty & Personal Care', 'Lip Balms & Moisturizers'],
    },
    {
      asin: 'B0F7L6MBM3',
      productName: 'LANEIGE Lip Glowy Balm (Matcha Bubble Tea)',
      thumbnail: 'https://m.media-amazon.com/images/I/41eicx6Xj-L._SX522_.jpg',
      category: 'Lip-Care',
      rankChange: 9,
      volatility: 'Mid',
      rankCategories: ['Beauty & Personal Care', 'Lip Balms & Moisturizers'],
    },
    {
      asin: 'B0DVH22M8S',
      productName: 'LANEIGE Lip Glowy Balm (S\'more Kisses Set)',
      thumbnail: 'https://m.media-amazon.com/images/I/81oA73wmUlL._SX522_.jpg',
      category: 'Lip-Care',
      rankChange: -1,
      volatility: 'Low',
      rankCategories: ['Beauty & Personal Care', 'Lip Balms & Moisturizers'],
    },

    {
      asin: 'B0G15RKM65',
      productName: 'LANEIGE Glaze Craze Tinted Lip Serum (Donut Delight)',
      thumbnail: 'https://m.media-amazon.com/images/I/71UcicXUJmL._SX522_.jpg',
      category: 'Lip-Care',
      rankChange: 0,
      volatility: 'Low',
      rankCategories: ['Beauty & Personal Care', 'Skin Care Sets & Kits'],
    },
    {
      asin: 'B0DT21L39F',
      productName: 'LANEIGE Glaze Craze Tinted Lip Serum (Maple Glaze)',
      thumbnail: 'https://m.media-amazon.com/images/I/61RKr5S2L-L._SX522_.jpg',
      category: 'Lip-Care',
      rankChange: 4,
      volatility: 'Low',
      rankCategories: ['Beauty & Personal Care', 'Lip Stains'],
    },

    {
      asin: 'B0F9XRLRJ2',
      productName: 'LANEIGE Water Sleeping Mask (Dream Skin Trio)',
      thumbnail: 'https://m.media-amazon.com/images/I/81dTtu96kyL._SX522_.jpg',
      category: 'Masks',
      collection: 'Sleeping Masks',
      rankChange: 2,
      volatility: 'Low',
      rankCategories: ['Beauty & Personal Care', 'Facial Skin Care Sets & Kits'],
    },

    {
      asin: 'B0D6NZGP2R',
      productName: 'LANEIGE Bouncy & Firm Eye Sleeping Mask',
      thumbnail: 'https://m.media-amazon.com/images/I/5153ygJtrrL._SX522_.jpg',
      category: 'Masks',
      collection: 'Bouncy & Firm',
      rankChange: 14,
      volatility: 'High',
      rankCategories: ['Beauty & Personal Care', 'Eye Masks'],
    },
    {
      asin: 'B0D84WSNQK',
      productName: 'LANEIGE Bouncy & Firm Lip Treatment',
      thumbnail: 'https://m.media-amazon.com/images/I/51PM2lHOTmL._SX522_.jpg',
      category: 'Lip-Care',
      collection: 'Bouncy & Firm',
      rankChange: -5,
      volatility: 'Mid',
      rankCategories: ['Beauty & Personal Care', 'Lip Plumping Treatments'],
    },
    {
      asin: 'B0DVWLH9HL',
      productName: 'LANEIGE Bouncy & Firm Serum',
      thumbnail: 'https://m.media-amazon.com/images/I/61P2jHqgkmL._SX522_.jpg',
      category: 'Serums',
      collection: 'Bouncy & Firm',
      rankChange: 8,
      volatility: 'Mid',
      rankCategories: ['Beauty & Personal Care', 'Facial Serums'],
    },

    {
      asin: 'B0BRN834BH',
      productName: 'LANEIGE Perfect Renew 3X Signature Serum (1.35 fl oz)',
      thumbnail: 'https://m.media-amazon.com/images/I/61AFiXEMdaL._SX522_.jpg',
      category: 'Serums',
      collection: 'Perfect Renew',
      rankChange: -2,
      volatility: 'Low',
      rankCategories: ['Beauty & Personal Care', 'Facial Serums'],
    },
    {
      asin: 'B0DZDFG9YM',
      productName: 'LANEIGE Perfect Renew 3X Cream',
      thumbnail: 'https://m.media-amazon.com/images/I/4118NWEVKXL._SX522_.jpg',
      category: 'Creams',
      collection: 'Perfect Renew',
      rankChange: 1,
      volatility: 'Low',
      rankCategories: ['Beauty & Personal Care', 'Face Moisturizers'],
    },

    {
      asin: 'B0G161NPZF',
      productName: 'LANEIGE Water Bank Blue Hyaluronic Cream (Daily Hydration Set)',
      thumbnail: 'https://m.media-amazon.com/images/I/61u8dHReJGL._SX522_.jpg',
      category: 'Creams',
      collection: 'Water Bank',
      rankChange: 9,
      volatility: 'Mid',
      rankCategories: ['Beauty & Personal Care', 'Skin Care Sets & Kits'],
    },
    {
      asin: 'B0CNJ1Z2GL',
      productName: 'LANEIGE Water Bank Blue Hyaluronic Cream (50 ml)',
      thumbnail: 'https://m.media-amazon.com/images/I/51o-FBnVp5L._SX522_.jpg',
      category: 'Creams',
      collection: 'Water Bank',
      rankChange: -2,
      volatility: 'Low',
      rankCategories: ['Beauty & Personal Care', 'Face Moisturizers'],
    },
    {
      asin: 'B0F1ZD5P1G',
      productName: 'LANEIGE Water Bank Blue Hyaluronic Cream (Cream & Refill Duo)',
      thumbnail: 'https://m.media-amazon.com/images/I/61t9Wcz+t9L._SX522_.jpg',
      category: 'Creams',
      collection: 'Water Bank',
      rankChange: 5,
      volatility: 'Mid',
      rankCategories: ['Beauty & Personal Care', 'Skin Care Sets & Kits'],
    },

    {
      asin: 'B09V8X3DW5',
      productName: 'LANEIGE Water Bank Blue Hyaluronic Gel Moisturizer (50 ml)',
      thumbnail: 'https://m.media-amazon.com/images/I/51AbLJWa0jL._SX522_.jpg',
      category: 'Moisturizers',
      collection: 'Water Bank',
      rankChange: 13,
      volatility: 'High',
      rankCategories: ['Beauty & Personal Care', 'Face Moisturizers'],
    },
    {
      asin: 'B0DWKS952Y',
      productName: 'LANEIGE Water Bank Gentle Gel Cleanser',
      thumbnail: 'https://m.media-amazon.com/images/I/51ZD7HJ8iOL._SX522_.jpg',
      category: 'Cleansers',
      collection: 'Water Bank',
      rankChange: 4,
      volatility: 'Low',
      rankCategories: ['Beauty & Personal Care', 'Facial Cleansing Gels'],
    },

    {
      asin: 'B09P54X2NS',
      productName: 'LANEIGE Cream Skin Toner & Moisturizer (170 ml)',
      thumbnail: 'https://m.media-amazon.com/images/I/51taxz9F+xL._SX522_.jpg',
      category: 'Moisturizers',
      collection: 'Cream Skin',
      rankChange: -5,
      volatility: 'Mid',
      rankCategories: ['Beauty & Personal Care', 'Facial Toners & Astringents'],
    },
    {
      asin: 'B09V8SQRNM',
      productName: 'LANEIGE Cream Skin Toner & Moisturizer (50 ml)',
      thumbnail: 'https://m.media-amazon.com/images/I/41hVdJHlEfL._SX522_.jpg',
      category: 'Moisturizers',
      collection: 'Cream Skin',
      rankChange: 11,
      volatility: 'High',
      rankCategories: ['Beauty & Personal Care', 'Facial Toners & Astringents'],
    },

    {
      asin: 'B0DHWFT182',
      productName: 'LANEIGE Neo Blurring Powder',
      thumbnail: 'https://m.media-amazon.com/images/I/61++xhU0HjL._SX522_.jpg',
      category: 'Powders',
      rankChange: 3,
      volatility: 'Low',
      rankCategories: ['Beauty & Personal Care', 'Face Powder'],
    },
    {
      asin: 'B0FGKY7HPB',
      productName: 'LANEIGE Neo Blurring Powder (Refill)',
      thumbnail: 'https://m.media-amazon.com/images/I/61zm2W0NyFL._SX522_.jpg',
      category: 'Powders',
      rankChange: 0,
      volatility: 'Low',
      rankCategories: ['Beauty & Personal Care', 'Face Powder'],
    },

    {
      asin: 'B09P22Z9VD',
      productName: 'LANEIGE Hydro UV Defense Sunscreen SPF 50+',
      thumbnail: 'https://m.media-amazon.com/images/I/51swIlsyhwL._SX522_.jpg',
      category: 'Sun Care',
      rankChange: 7,
      volatility: 'Mid',
      rankCategories: ['Beauty & Personal Care', 'Facial Sunscreens'],
    },
  ]);

  const handleProductClick = (product: SelectedProduct) => {
    setSelectedProduct(product);
  };

  const handleBackToList = () => {
    setSelectedProduct(null);
  };

  const handleLogoClick = () => {
    setActiveTab('overview');
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <Header onLogoClick={handleLogoClick} />
      <TopNav 
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSelectedProduct(null);
        }}
        startDate={startDate}
        endDate={endDate}
      />
      
      {selectedProduct ? (
        <ProductDetailPage 
          productName={selectedProduct.productName}
          asin={selectedProduct.asin}
          category={selectedProduct.category}
          thumbnail={selectedProduct.thumbnail}
          rankCategories={selectedProduct.rankCategories}
          onBack={handleBackToList}
          promotions={promotions}
          setPromotions={setPromotions}
        />
      ) : activeTab === 'overview' ? (
        <main className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6">
          {/* KPI Cards */}
          <div className="mb-4 mt-4">
            <KPICards />
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* Sales Chart - Takes 2 columns */}
            <div className="lg:col-span-2 h-[500px]">
              <SalesChart />
            </div>
            
            {/* AI Insight Panel - Takes 1 column */}
            <div className="lg:col-span-1 h-[500px]">
              <AIInsightPanel />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Deals Table - Takes 2 columns */}
            <div className="lg:col-span-2 h-[640px]">
              <DealsTable 
                products={products}
                onProductClick={handleProductClick} 
              />
            </div>
            
            {/* Calendar Widget - Takes 1 column */}
            <div className="lg:col-span-1 h-[640px]">
              <CalendarWidget 
                promotions={promotions}
                setPromotions={setPromotions}
              />
            </div>
          </div>
        </main>
      ) : (
        <ByProductPage 
          products={products}
          onProductClick={handleProductClick} 
        />
      )}
    </div>
  );
}