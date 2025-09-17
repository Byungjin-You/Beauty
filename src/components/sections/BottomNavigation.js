"use client";

import { useRouter, usePathname } from 'next/navigation';

const BottomNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const navigationItems = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="none">
          <path fill="currentColor" fillRule="evenodd" d="M11.528 3.218a2 2 0 0 1 2.546 0L21.71 9.52a3 3 0 0 1 1.09 2.314v7.977c0 1.3-1.105 2.356-2.468 2.356h-4.698a.5.5 0 0 1-.5-.497v-6.224c0-.65-.773-1.178-1.455-1.178h-1.756c-.682 0-1.456.528-1.456 1.178v6.224a.5.5 0 0 1-.5.497H5.27c-1.364 0-2.47-1.055-2.47-2.357v-7.976a3 3 0 0 1 1.091-2.313z" clipRule="evenodd"></path>
        </svg>
      ),
      label: "홈",
      path: "/"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" fill="none">
          <path fill="currentColor" fillRule="evenodd" d="M2 4.5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm4 3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm1 4a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1z" clipRule="evenodd"></path>
        </svg>
      ),
      label: "후기",
      path: "/reviews"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
          <path fill="currentColor" fillRule="evenodd" d="M6 5V2.11a.8.8 0 0 1 1.053-.759L12 3l4.947-1.649A.8.8 0 0 1 18 2.11V5zM2 6a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1v9a2 2 0 0 0 2 2h5.5V6zm17 16h-5.5V6H22a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v9a2 2 0 0 1-2 2" clipRule="evenodd"></path>
        </svg>
      ),
      label: "이벤트",
      path: "/events"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="none">
          <path fill="currentColor" fillRule="evenodd" d="M5.5 2.434a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-14a3 3 0 0 0-3-3zm5.24 5.38a.88.88 0 0 1 .88-.88h1.76a.88.88 0 0 1 .88.88v2.86h2.86a.88.88 0 0 1 .88.88v1.76a.88.88 0 0 1-.88.88h-2.86v2.86a.88.88 0 0 1-.88.88h-1.76a.88.88 0 0 1-.88-.88v-2.86H7.88a.88.88 0 0 1-.88-.88v-1.76a.88.88 0 0 1 .88-.88h2.86z" clipRule="evenodd"></path>
        </svg>
      ),
      label: "의사/병원",
      path: "/doctors"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
          <path fill="currentColor" fillRule="evenodd" d="M10.52 19.616C8.875 20.813 6.242 22 5.138 22c-.724 0-.959-.58-.552-1.113.089-.116.208-.265.345-.435.425-.529 1.023-1.273 1.42-1.958.081-.169.036-.309-.127-.412C3.255 16.427 1.5 13.735 1.5 10.724 1.5 5.89 6.169 2 11.996 2 17.822 2 22.5 5.89 22.5 10.724c0 5.049-4.669 8.723-11.192 8.733q-.138-.002-.299-.017l-.027-.002c-.145 0-.29.047-.461.178M7.5 12.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m6-1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m3 1.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" clipRule="evenodd"></path>
        </svg>
      ),
      label: "칼럼",
      path: "/community"
    }
  ];

  return (
    <div className="fixed bottom-0 w-full desktop:hidden left-0 flex justify-center z-10">
      <div 
        className="h-[60px] flex w-full max-w-[600px] bg-white rounded-tl-2xl rounded-tr-2xl"
        style={{ boxShadow: "rgba(0, 0, 0, 0.08) 0px -4px 12px 0px" }}
      >
      {navigationItems.map((item, index) => {
        const isActive = pathname === item.path;
        
        return (
          <div key={index} className="flex justify-center items-center w-[20%]">
            <button 
              className={`w-full py-0.5 flex flex-col justify-center items-center gap-0.5 ${
                isActive ? 'text-label-common_5' : 'text-label-common_3'
              }`}
              onClick={() => {
                if (item.path !== "#") {
                  router.push(item.path);
                }
              }}
            >
              {item.icon}
              <div className="text-[10px] font-medium leading-[15px] text-inherit">
                {item.label}
              </div>
            </button>
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default BottomNavigation; 