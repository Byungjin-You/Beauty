"use client";

const menuItems = [
  // 첫 번째 줄: Awards / AI Chat / Skin Match / Ingredients
  {
    id: "awards",
    name: "Awards",
    icon: "/images/icons8-trophy-94.png",
    link: "/awards",
    badge: "2025"
  },
  {
    id: "ai-chat",
    name: "AI Chat",
    icon: "/images/icons8-ai-94.png",
    link: "/ai-chat",
    badge: null
  },
  {
    id: "skin-match",
    name: "Skin Match",
    icon: "/images/icons8-fantasy-94.png",
    link: "/skin-match",
    badge: "NEW"
  },
  {
    id: "ingredients",
    name: "Ingredients",
    icon: "/images/icons8-analyze-64.png",
    link: "/ingredients",
    badge: null
  },
  // 두 번째 줄: Ranking / Brands / Event / Magazine
  {
    id: "ranking",
    name: "Ranking",
    icon: "/images/icons8-ranking-94.png",
    link: "/ranking",
    badge: null
  },
  {
    id: "brands",
    name: "Brands",
    icon: "/images/icons8-price-94.png",
    link: "/brands",
    badge: null
  },
  {
    id: "event",
    name: "Event",
    icon: "/images/icons8-event-94.png",
    link: "/event",
    badge: null
  },
  {
    id: "magazine",
    name: "Magazine",
    icon: "/images/icons8-magazine-64.png",
    link: "/magazine",
    badge: null
  }
];

const AwardsSection = () => {
  return (
    <div className="flex flex-col mt-[24px] tablet:mt-[32px] desktop:mt-[40px]">
      {/* 아이콘 메뉴 그리드 - 2줄 4개씩 */}
      <div className="grid grid-cols-4 gap-x-[12px] gap-y-[16px]">
        {menuItems.map((item) => (
          <a
            key={item.id}
            className="flex flex-col items-center"
            href={item.link}
          >
            {/* 아이콘 */}
            <div className="relative">
              {/* 배지 */}
              {item.badge && (
                <span className="absolute right-0 flex items-center justify-center rounded-full h-[16px] px-[5px] text-[10px] text-white z-10" style={{ fontWeight: 700, top: '-4px', backgroundColor: '#ff5d51' }}>
                  {item.badge}
                </span>
              )}
              <div className="w-[45px] h-[45px] flex items-center justify-center">
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            {/* 라벨 */}
            <div className="font-medium text-[12px] leading-[16px] tracking-[-0.5px] w-full text-center mt-[6px]" style={{ color: '#484760' }}>
              {item.name}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AwardsSection;
