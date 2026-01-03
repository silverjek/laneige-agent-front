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
            일일 매출이 전일 대비 8.2% 상승하여 40,689개를 기록했으며, 
            특히 16시~20시 구간에서 41,000개 피크를 달성한 것으로 확인됩니다. 
            이는 주요 타겟 고객층의 쇼핑 시간대와 정확히 일치하는 패턴으로, 
            Amazon의 알고리즘이 해당 시간대에 우리 제품을 적극적으로 
            노출시키고 있음을 시사합니다.
          </p>
          <p className="leading-relaxed mb-3">
            Rank Conversion Efficiency 50.7%는 순위 상승이 매출 증가로 
            효과적으로 전환되고 있음을 나타내며, 이는 업계 평균 35~40% 대비 
            현저히 높은 수치입니다. 특히 Water Sleeping Mask와 Lip Sleeping Mask의 
            경우 각각 12위, 8위 순위 상승을 기록하며 베스트셀러 랭킹에 
            진입하는 성과를 달성했습니다.
          </p>
          <p className="leading-relaxed mb-3">
            전체 35개 SKU 중 28개(80%)가 상승세를 기록하여 포트폴리오 전반의 
            모멘텀이 강화된 것으로 판단됩니다. 특히 Skin Care 카테고리가 
            전체 매출의 62%를 차지하며 주력 제품군으로서의 위상을 확고히 
            하고 있으며, Gift Set 카테고리도 시즌 효과로 15% 성장세를 
            보이고 있습니다.
          </p>
          <p className="leading-relaxed">
            고객 리뷰 점수도 평균 4.6점을 유지하며 신규 고객 유입에 
            긍정적인 영향을 미치고 있습니다. 특히 "hydration", "overnight care", 
            "visible results" 등의 키워드가 포함된 긍정 리뷰가 증가하고 있어 
            제품의 핵심 가치가 효과적으로 전달되고 있는 것으로 분석됩니다.
          </p>
        </div>
        <div>
          <div className="mb-2 text-gray-900 font-medium">
            What's Next:
          </div>
          <p className="leading-relaxed mb-3">
            Traffic Conversion Efficiency가 17.9%로 전일 대비 4.3% 하락한 점이 
            주요 개선 포인트로 보입니다. 유입 트래픽은 증가했으나 실제 구매로 
            이어지는 비율이 감소한 것은 경쟁사의 프로모션 강화 또는 
            상세이지 요소의 최적화 필요성을 나타냅니다.
          </p>
          <p className="leading-relaxed mb-3">
            단기 액션 플랜으로는 상세페이지 A+ Content 업데이트, 
            상위 10개 FAQ에 대한 즉각 답변 추가, 그리고 Before/After 이미지 
            강화가 권장됩니다. 특히 모바일 환경에서의 이미지 로딩 속도와 
            가독성 개선이 시급한 것으로 파악됩니다.
          </p>
          <p className="leading-relaxed mb-3">
            상승세를 보이지 않는 7개 SKU(20%)에 대해서는 개별 분석이 
            필요합니다. 이 중 4개는 재고 부족 이슈로 Buy Box 손실이 
            발생했으며, 3개는 경쟁사 대비 가격 경쟁력이 5% 이상 낮은 
            상태입니다. 프로모션 전략 재검토 또는 재고 조정이 권장됩니다.
          </p>
          <p className="leading-relaxed mb-3">
            현재 매출 모멘텀 유지를 위해 주말 대응 전략 수립이 필요합니다. 
            과거 데이터 분석 결과 주말에는 평균 매출이 18% 감소하는 
            패턴이 있으므로, Lightning Deal 또는 Coupon 활성화를 통한 
            수요 자극이 효과적일 것으로 예상됩니다.
          </p>
          <p className="leading-relaxed">
            중장기적으로 Amazon Vine 프로그램을 통한 신제품 리뷰 확보, 
            Influencer Program 강화, 그리고 Subscribe & Save 옵션 활성화를 
            통한 재구매율 향상 전략이 권장됩니다. 특히 LTV(고객 생애 가치) 
            증대를 위한 Cross-sell 및 Bundle 전략 수립이 필요한 시점입니다.
          </p>
        </div>
      </div>
    </div>
  );
}