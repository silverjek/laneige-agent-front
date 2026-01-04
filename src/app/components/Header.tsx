import { Info } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onLogoClick?: () => void;
}

export function Header({ onLogoClick }: HeaderProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          <div 
            onClick={onLogoClick}
            className="text-xl lg:text-2xl tracking-tight font-semibold cursor-pointer hover:text-[#2F6FE4] transition-colors"
          >
            LANEIGE
          </div>
          <div className="text-xl lg:text-2xl text-[#111111] font-medium">Amazon Performance Agent</div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-xs text-[#6B9EFF] whitespace-nowrap">
            본 페이지는 AI Agent 프로토타입으로, 목데이터 기반으로 동작합니다.
          </div>
          <div 
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Info className="w-4 h-4 text-[#6B9EFF] cursor-help" />
            {showTooltip && (
              <div className="absolute right-0 top-full mt-1 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-50 shadow-lg max-w-[500px]">
                제품별 상세 페이지, 기간 선택, 엑셀 추출 기능은 실제 서비스 구조를 기준으로 구현되었으며,<br />
                현재는 일부 기간 및 데이터만 예시로 제공됩니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
