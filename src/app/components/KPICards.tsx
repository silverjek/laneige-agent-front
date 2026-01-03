import { TrendingUp, DollarSign, Users, Package, ArrowUp, ArrowDown, ShoppingCart } from 'lucide-react';

interface KPIData {
  title: string;
  subtitle?: string;
  koreanLabel?: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: 'trending' | 'shopping' | 'users' | 'package';
  iconColor: string;
}

const kpiData: KPIData[] = [
  {
    title: 'Total Sales',
    koreanLabel: '판매량',
    subtitle: '(KST, resets at 00:00)',
    value: '40,689',
    change: '8.2% Up from yesterday',
    isPositive: true,
    icon: 'shopping',
    iconColor: 'bg-yellow-100 text-yellow-600',
  },
  {
    title: 'Rank Conversion Efficiency',
    koreanLabel: '랭킹 대비 구매 전환율',
    value: '50.7%',
    change: '8.2% Up from yesterday',
    isPositive: true,
    icon: 'trending',
    iconColor: 'bg-green-100 text-green-600',
  },
  {
    title: 'Traffic Conversion Efficiency',
    koreanLabel: '트래픽 대비 구매 전환율',
    value: '17.9%',
    change: '4.3% Down from yesterday',
    isPositive: false,
    icon: 'users',
    iconColor: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'SKU Uplift Ratio',
    koreanLabel: '상승 SKU 비율',
    value: '65%',
    subtitle: '(28/total 35)',
    change: '8.0% Up from yesterday',
    isPositive: true,
    icon: 'package',
    iconColor: 'bg-orange-100 text-orange-600',
  },
];

export function KPICards() {
  const getIcon = (iconType: string, className: string) => {
    switch (iconType) {
      case 'trending':
        return <TrendingUp className={className} />;
      case 'shopping':
        return <ShoppingCart className={className} />;
      case 'users':
        return <Users className={className} />;
      case 'package':
        return <Package className={className} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <div className="absolute -top-6 right-0 text-xs text-gray-400">
        Updated: Jan 4, 2026 at 15:00
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white p-4 shadow-sm rounded-[15px] flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-gray-600 text-sm">{kpi.title}</div>
                <div className="text-gray-400 text-xs mt-0.5 flex items-center gap-1">
                  {kpi.koreanLabel}
                  {kpi.subtitle && index === 0 && (
                    <span>{kpi.subtitle}</span>
                  )}
                </div>
              </div>
              <div className={`p-3 rounded-[15px] ${kpi.iconColor}`}>
                {getIcon(kpi.icon, 'w-6 h-6')}
              </div>
            </div>
            <div className="mb-2">
              <span className="text-2xl">{kpi.value}</span>
              {kpi.subtitle && index === 3 && (
                <span className="text-gray-500 text-sm ml-1">{kpi.subtitle}</span>
              )}
            </div>
            <div className={`flex items-center gap-1 text-sm ${kpi.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {kpi.isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              <span>{kpi.change}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}