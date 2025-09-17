'use client';

import { useState } from 'react';
import { hwahaeCategories } from '../../data/hwahae-categories';

const CategoryFilter = ({ onCategorySelect, selectedCategory, selectedSubCategory }) => {
  const [expandedCategory, setExpandedCategory] = useState(null); // 기본적으로 모든 카테고리 닫혀있음
  const categories = hwahaeCategories;
  
  console.log('CategoryFilter 렌더링:', { 
    categoriesLength: categories?.length, 
    categories: categories?.slice(0, 3), // 처음 3개만 로그
    selectedCategory, 
    selectedSubCategory 
  });

  if (!categories || categories.length === 0) {
    console.error('카테고리 데이터가 없습니다!', { categories });
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <p className="text-red-500">카테고리 데이터를 불러올 수 없습니다. (총 {categories?.length || 0}개)</p>
        <p className="text-xs text-gray-500 mt-2">콘솔을 확인하세요.</p>
      </div>
    );
  }

  const handleMainCategoryClick = (category) => {
    console.log('메인 카테고리 클릭:', category.name, '현재 펼쳐진 카테고리:', expandedCategory);
    
    if (expandedCategory === category.id) {
      // 이미 펼쳐진 카테고리를 클릭하면 접기
      setExpandedCategory(null);
      console.log('카테고리 접기:', category.name);
    } else {
      // 새로운 카테고리 펼치기
      setExpandedCategory(category.id);
      console.log('카테고리 펼치기:', category.name);
    }
    
    // 메인 카테고리 클릭 시에는 자동 선택하지 않고, 사용자가 서브카테고리를 직접 선택하도록 함
    // 단, 서브카테고리가 1개뿐인 경우(전체만 있는 경우)는 자동 선택
    if (category.subcategories && category.subcategories.length === 1) {
      console.log('서브카테고리가 1개뿐이므로 자동 선택:', category.subcategories[0].name);
      onCategorySelect(category, category.subcategories[0]);
    }
  };

  const handleSubCategoryClick = (mainCategory, subCategory) => {
    onCategorySelect(mainCategory, subCategory);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-md relative z-10 overflow-hidden" style={{ pointerEvents: 'auto' }}>
      {/* 카테고리 목록 (헤더 제거) */}
      <div className="max-h-[400px] overflow-y-auto" style={{ pointerEvents: 'auto' }}>
        <div className="p-4 space-y-4" style={{ pointerEvents: 'auto' }}>
          {categories.map((category, index) => {
            console.log(`카테고리 ${index} 렌더링:`, category.name);
            const isSelected = selectedCategory?.id === category.id;
            const isExpanded = expandedCategory === category.id;
            
            return (
            <div key={category.id || `category-${index}`} className="space-y-2">
              {/* 컴팩트한 메인 카테고리 */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('메인 카테고리 클릭:', category.name);
                  handleMainCategoryClick(category);
                }}
                className={`w-full group flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 shadow-sm'
                    : 'hover:bg-gray-50 border border-transparent hover:border-gray-200 hover:shadow-md'
                }`}
                style={{ pointerEvents: 'auto' }}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-md transition-colors ${
                    isSelected 
                      ? 'bg-purple-100 text-purple-600' 
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <span className={`font-medium text-sm ${isSelected ? 'text-purple-700' : 'text-gray-800'}`}>
                    {category.name}
                  </span>
                  {isSelected && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                      선택됨
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                    {category.subcategories.length}
                  </span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    } ${isSelected ? 'text-purple-600' : 'text-gray-400'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* 개선된 서브 카테고리 태그 (덜컥거림 방지) */}
              {isExpanded && (
                <div className="ml-4 pl-4 border-l-2 border-purple-200 bg-gray-50 rounded-r-lg py-3">
                  <div className="flex flex-wrap gap-2.5" style={{ minHeight: '44px' }}>
                    {category.subcategories.map((subCategory, subIndex) => {
                      const isSubSelected = selectedCategory?.id === category.id && selectedSubCategory?.id === subCategory.id;
                      
                      return (
                        <button
                          key={subCategory.id || `${category.id}-sub-${subIndex}`}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('서브 카테고리 클릭:', category.name, '>', subCategory.name);
                            handleSubCategoryClick(category, subCategory);
                          }}
                          onMouseEnter={(e) => {
                            if (!isSubSelected) {
                              e.target.style.backgroundColor = '#f9fafb';
                              e.target.style.color = '#111827';
                              e.target.style.borderColor = '#d1d5db';
                              e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSubSelected) {
                              e.target.style.backgroundColor = '#ffffff';
                              e.target.style.color = '#374151';
                              e.target.style.borderColor = '#e5e7eb';
                              e.target.style.boxShadow = 'none';
                            }
                          }}
                          className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
                          style={{ 
                            pointerEvents: 'auto',
                            minWidth: 'fit-content',
                            minHeight: '36px',
                            backgroundColor: isSubSelected ? '#f3e8ff' : '#ffffff',
                            color: isSubSelected ? '#7c3aed' : '#374151',
                            border: isSubSelected ? '2px solid #8b5cf6' : '1px solid #e5e7eb',
                            boxShadow: isSubSelected ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 'none'
                          }}
                        >
                          <div className="flex items-center justify-center gap-2" style={{ minHeight: '20px' }}>
                            <span style={{ color: isSubSelected ? '#7c3aed' : undefined }}>
                              {subCategory.name}
                            </span>
                            <div className="w-4 h-4 flex items-center justify-center">
                              {isSubSelected && (
                                <div className="flex items-center justify-center w-4 h-4 bg-purple-100 rounded-full transition-all duration-200">
                                  <svg className="w-2.5 h-2.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            );
          })}
        </div>
      </div>
      
      {/* 컴팩트한 하단 그라데이션 */}
      <div className="h-2 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default CategoryFilter;
