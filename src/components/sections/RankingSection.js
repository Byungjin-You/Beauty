"use client";

const RankingSection = () => {
  const rankingData = [
    { rank: 1, name: "울쎄라", topRank: true },
    { rank: 2, name: "인모드 FX", topRank: true },
    { rank: 3, name: "리쥬란힐러", topRank: true },
    { rank: 4, name: "윤곽주사", topRank: false },
    { rank: 5, name: "티타늄", topRank: false },
    { rank: 6, name: "피코토닝", topRank: false },
    { rank: 7, name: "볼륨필러", topRank: false },
    { rank: 8, name: "슈링크", topRank: false },
    { rank: 9, name: "울리지오", topRank: false },
    { rank: 10, name: "인모드", topRank: false }
  ];

  const getGradientColor = (rank) => {
    switch(rank) {
      case 1:
        return "from-yellow-400 to-yellow-500";
      case 2:
        return "from-gray-400 to-gray-500";
      case 3:
        return "from-orange-400 to-orange-500";
      default:
        return "";
    }
  };

  const getRankComponent = (item) => {
    if (item.topRank) {
      return (
        <div className={`w-7 h-7 bg-gradient-to-r ${getGradientColor(item.rank)} rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md`}>
          {item.rank}
        </div>
      );
    } else {
      return (
        <div className="w-7 h-7 flex items-center justify-center">
          <span className="text-base font-bold" style={{ color: "rgb(255, 82, 141)" }}>
            {item.rank}
          </span>
        </div>
      );
    }
  };

  return (
    <div className="mt-12 mb-8">
      {/* 섹션 헤더 */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-800 mb-1">많이 찾는 시술 랭킹 TOP 10</h2>
        <div className="text-xs text-gray-500">최종 업데이트 14:57:02</div>
      </div>

      {/* 랭킹 그리드 - 세로 2열 레이아웃 */}
      <div className="grid grid-cols-2 gap-x-8 mb-6">
        {/* 왼쪽 열: 1-5위 */}
        <div className="flex flex-col gap-y-4">
          {rankingData.slice(0, 5).map((item) => (
            <div key={item.rank} className="flex items-center gap-3">
              {getRankComponent(item)}
              <span className="text-label-common_6 line-clamp-1 leading-[150%] text-inherit text-base font-semibold">
                {item.name}
              </span>
            </div>
          ))}
        </div>
        
        {/* 오른쪽 열: 6-10위 */}
        <div className="flex flex-col gap-y-4">
          {rankingData.slice(5, 10).map((item) => (
            <div key={item.rank} className="flex items-center gap-3">
              {getRankComponent(item)}
              <span className="text-label-common_6 line-clamp-1 leading-[150%] text-inherit text-base font-semibold">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 더보기 버튼 */}
      <button 
        className="w-full py-3 rounded-lg font-medium text-sm border-2"
        style={{
          borderColor: "rgb(255, 82, 141)",
          color: "rgb(255, 82, 141)",
          backgroundColor: "white"
        }}
      >
        시술 랭킹 더보기
      </button>
    </div>
  );
};

export default RankingSection; 