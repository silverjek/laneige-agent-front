interface HeaderProps {
  onLogoClick?: () => void;
}

export function Header({ onLogoClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            onClick={onLogoClick}
            className="text-xl lg:text-2xl tracking-tight font-semibold cursor-pointer hover:text-[#2F6FE4] transition-colors"
          >
            LANEIGE
          </div>
          <div className="text-xl lg:text-2xl text-[#111111] font-medium">Amazon Performance Agent</div>
        </div>
        <div></div>
      </div>
    </header>
  );
}