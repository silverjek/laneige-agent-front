import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Product } from '../App';

interface DealsTableProps {
  products: Product[];
  onProductClick: (product: {
    productName: string;
    asin: string;
    category: string;
    thumbnail: string;
    rankCategories: string[];
  }) => void;
}

export function DealsTable({ products, onProductClick }: DealsTableProps) {
  const getVolatilityColor = (volatility: string) => {
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

  const handleRowClick = (product: Product) => {
    onProductClick({
      productName: product.productName,
      asin: product.asin,
      category: product.category,
      thumbnail: product.thumbnail,
      rankCategories: product.rankCategories,
    });
  };

  return (
    <div className="bg-white border border-gray-200 h-full flex flex-col rounded-[15px]">
      <div className="p-6 pb-4 flex-shrink-0 border-b border-gray-200">
        <h3 className="">Product Details</h3>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header Table */}
        <div className="flex-shrink-0">
          <table className="w-full" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '5%' }} />
              <col style={{ width: '45%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '15%' }} />
            </colgroup>
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 text-gray-500 text-xs uppercase tracking-wider">NO.</th>
                <th className="text-left py-4 px-6 text-gray-500 text-xs uppercase tracking-wider">PRODUCT NAME</th>
                <th className="text-left py-4 px-6 text-gray-500 text-xs uppercase tracking-wider">CATEGORY</th>
                <th className="text-center py-4 px-6 text-gray-500 text-xs uppercase tracking-wider">SKU RANK CHANGE</th>
                <th className="text-center py-4 px-6 text-gray-500 text-xs uppercase tracking-wider">VOLATILITY</th>
              </tr>
            </thead>
          </table>
        </div>
        
        {/* Scrollable Body */}
        <div className="overflow-x-hidden flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '5%' }} />
              <col style={{ width: '45%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '15%' }} />
            </colgroup>
            <tbody>
              {products.map((product, index) => (
                <tr 
                  key={index} 
                  onClick={() => handleRowClick(product)}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6 text-sm text-gray-500">{index + 1}</td>
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
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-[8px] text-center whitespace-nowrap">
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
                    <span className={`inline-block px-3 py-1 text-sm rounded-[8px] w-16 text-center ${getVolatilityColor(product.volatility)}`}>
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