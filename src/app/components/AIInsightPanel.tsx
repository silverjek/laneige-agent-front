import { Info } from 'lucide-react';
import { useState } from 'react';

export function AIInsightPanel() {
  const [showTooltip, setShowTooltip] = useState<'worked' | 'next' | null>(null);

  return (
    <div className="bg-white p-6 shadow-sm h-full flex flex-col rounded-[15px]">
      <div className="flex items-center gap-2 mb-6">
        <h3>What Worked, What's Next</h3>
        <div 
          className="relative"
          onMouseEnter={() => setShowTooltip('worked')}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <Info className="w-4 h-4 text-gray-400 cursor-help" />
          {showTooltip === 'worked' && (
            <div className="absolute left-0 top-full mt-1 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-50 shadow-lg">
              전일 데이터 기준으로 작성된 내용입니다
            </div>
          )}
        </div>
      </div>
      <div className="space-y-5 text-gray-700 text-sm overflow-y-auto custom-scrollbar flex-1 pr-2">
        <div>
          <div className="mb-2 text-gray-900 font-medium">
            What Worked:
          </div>
          <p className="leading-relaxed mb-3">
            일일 매출은 전일 대비 8.2% 증가하여 40,689개를 기록하였으며, 16시~20시 구간에서 약 41,000개의 피크가 확인됩니다. 이는 주요 고객의 구매 집중 시간대와 일치하며, 해당 시간대의 노출 효율이 효과적으로 작동하고 있음을 시사합니다.
          </p>
          <p className="leading-relaxed mb-3">
            Rank Conversion Efficiency는 50.7%로, 랭킹 상승이 실제 매출 증가로 안정적으로 전환되고 있습니다. 특히 Water Sleeping Mask와 Lip Sleeping Mask는 각각 12위, 8위 상승하며 베스트셀러 랭킹에 진입하였습니다.
          </p>
          <p className="leading-relaxed">
            전체 35개 SKU 중 28개(80%)가 상승세를 보이며, 포트폴리오 전반의 성과가 동시에 개선되고 있습니다. 이 중 Skin Care 카테고리는 전체 매출의 62%를 차지하며 핵심 성장 축으로 작용하고 있습니다.
          </p>
        </div>
        <div>
          <div className="mb-2 text-gray-900 font-medium">
            What's Next:
          </div>
          <p className="leading-relaxed mb-3">
            Traffic Conversion Efficiency는 17.9%로 전일 대비 4.3% 하락하여 개선이 필요한 지점으로 확인됩니다. 유입 트래픽 증가 대비 구매 전환 비율이 낮아진 것으로, 상세페이지 최적화 또는 경쟁 프로모션 영향 가능성이 있습니다.
          </p>
          <p className="leading-relaxed mb-3">
            단기적으로는 A+ Content 업데이트, FAQ 보완, Before/After 이미지 강화를 우선 검토하는 것이 필요합니다. 특히 모바일 환경에서의 가독성과 로딩 속도 개선이 중요합니다.
          </p>
          <p className="leading-relaxed mb-3">
            상승 흐름에서 제외된 7개 SKU(20%)에 대해서는 개별 대응이 필요합니다. 이 중 4개는 재고 부족, 3개는 가격 경쟁력 저하가 주요 원인으로 분석됩니다.
          </p>
          <p className="leading-relaxed mb-3">
            과거 데이터 기준으로 주말 매출이 평균 18% 감소하는 패턴이 확인되어, 주말 쿠폰 또는 Lightning Deal 운영을 통한 수요 보완 전략이 요구됩니다.
          </p>
          <p className="leading-relaxed">
            중장기적으로는 Vine 리뷰 확보, 인플루언서 프로그램 강화, Subscribe & Save 활성화를 통해 재구매율 및 고객 생애 가치를 높이는 전략이 유효합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
