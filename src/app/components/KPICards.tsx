import { TrendingUp, DollarSign, Users, Package, ArrowUp, ArrowDown, ShoppingCart, Info } from 'lucide-react';
import { useState } from 'react';

interface KPIData {
  title: string;
  subtitle?: string;
  koreanLabel?: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: 'trending' | 'shopping' | 'users' | 'package';
  iconColor: string;
  hasTooltip?: boolean;
  tooltipContent?: {
    meaning: string;
    methodology: string[];
    interpretation: string[];
  };
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
    hasTooltip: true,
    tooltipContent: {
      meaning: '랭킹 변화가 실제 구매 성과로 얼마나 효율적으로 연결되었는지를 나타내는 지표이다.',
      methodology: [
        'SKU별 General 카테고리 랭킹 변화량과 동일 시간대의 판매량 변화를 함께 고려한다.',
        '랭킹과 판매량은 스케일이 다르기 때문에 정규화한 변화량을 기준으로 계산한다.',
        '개별 SKU 단위로 산출한 뒤, 브랜드 전체 기준으로 가중 평균하여 최종 값으로 도출한다.'
      ],
      interpretation: [
        '값이 높을수록 랭킹 상승이 실제 구매 증가로 잘 전환되고 있음을 의미한다.',
        '랭킹이 상승했지만 전환율이 낮은 경우, 노출 대비 구매 효율이 낮은 상태로 해석할 수 있다.',
        '단순 순위 변화가 아닌, \'성과로 이어진 랭킹 상승\'을 판단하기 위한 지표이다.'
      ]
    }
  },
  {
    title: 'Traffic Conversion Efficiency',
    koreanLabel: '트래픽 대비 구매 전환율',
    value: '17.9%',
    change: '4.3% Down from yesterday',
    isPositive: false,
    icon: 'users',
    iconColor: 'bg-purple-100 text-purple-600',
    hasTooltip: true,
    tooltipContent: {
      meaning: '유입된 트래픽이 실제 구매로 얼마나 효율적으로 전환되었는지를 나타내는 지표이다.',
      methodology: [
        '동일 시간대의 트래픽 변화량과 판매량 변화량을 기반으로 전환 효율을 산출한다.',
        '트래픽 증가 대비 실제 판매 증가 수준을 비교하여 효율을 정규화된 값으로 계산한다.',
        'SKU 단위 계산 후 브랜드 전체 기준으로 집계한다.'
      ],
      interpretation: [
        '값이 높을수록 유입된 트래픽이 구매로 잘 연결되고 있음을 의미한다.',
        '트래픽은 증가했으나 전환율이 낮은 경우, 상세 페이지·가격·리뷰 등의 개선 여지가 있음을 시사한다.',
        '마케팅 유입의 \'양\'이 아닌 \'질\'을 평가하기 위한 지표이다.'
      ]
    }
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
  const [showTooltip, setShowTooltip] = useState<number | null>(null);

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
          <div key={index} className="bg-white p-4 shadow-sm rounded-[15px] flex flex-col relative">
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
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-1 text-sm ${kpi.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span>{kpi.change}</span>
              </div>
              
              {/* Info Button with Hover Tooltip */}
              {kpi.hasTooltip && kpi.tooltipContent && (
                <div 
                  className="relative"
                  onMouseEnter={() => setShowTooltip(index)}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  {showTooltip === index && (
                    <div className="absolute right-0 top-full mt-2 bg-gray-900 text-white text-xs p-4 rounded-lg z-50 shadow-lg w-[320px]">
                      <div className="mb-3">
                        <div className="font-bold mb-1">의미</div>
                        <div className="text-gray-300 leading-relaxed">{kpi.tooltipContent.meaning}</div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="font-bold mb-1">도출 방식</div>
                        <ul className="space-y-1">
                          {kpi.tooltipContent.methodology.map((item, i) => (
                            <li key={i} className="text-gray-300 leading-relaxed flex gap-2">
                              <span className="text-gray-500">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <div className="font-bold mb-1">해석 포인트</div>
                        <ul className="space-y-1">
                          {kpi.tooltipContent.interpretation.map((item, i) => (
                            <li key={i} className="text-gray-300 leading-relaxed flex gap-2">
                              <span className="text-gray-500">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}