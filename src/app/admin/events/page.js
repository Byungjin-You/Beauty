'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';

export default function AdminEventsPage() {
  // 스피너 애니메이션을 위한 CSS 추가
  const spinKeyframes = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = spinKeyframes + `
      /* 셀렉트 박스 드롭다운 강제 아래쪽 방향 */
      select {
        appearance: none !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
      }
      
      /* 드롭다운이 입력란 바로 밑에서 시작되도록 설정 */
      select[name="discountType"] {
        position: relative !important;
      }
      
      /* 드롭다운 옵션들의 위치 제어 */
      select[name="discountType"]:focus,
      select[name="discountType"]:active {
        transform: translateY(0) !important;
        -webkit-transform: translateY(0) !important;
        top: auto !important;
        bottom: auto !important;
      }
      
      /* 브라우저별 드롭다운 방향 제어 */
      select:focus {
        transform: none !important;
        -webkit-transform: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const [events, setEvents] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '', // 썸네일 이미지
    detailImage: '', // 상세 이미지
    hospital: '',
    location: '',
    price: '',
    discount: '',
    discountType: 'plasticSurgery',
    rating: '5.0',
    reviewCount: '0',
    hasKakaoConsult: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDiscountDropdownOpen, setIsDiscountDropdownOpen] = useState(false);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('[data-discount-dropdown]')) {
        setIsDiscountDropdownOpen(false);
      }
    };

    if (isDiscountDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDiscountDropdownOpen]);

  // 필수 입력란 검증
  const isFormValid = () => {
    return formData.title.trim() !== '' &&
           formData.description.trim() !== '' &&
           formData.image.trim() !== '' &&
           formData.detailImage.trim() !== '' &&
           formData.hospital.trim() !== '' &&
           formData.location.trim() !== '' &&
           formData.price.replace(/[^\d]/g, '').trim() !== '' &&
           formData.discount.replace(/[^\d]/g, '').trim() !== '' &&
           formData.discountType !== '';
  };

  // 이벤트 데이터 로드 (실제로는 API에서 가져옴)
  useEffect(() => {
    // 실제 API 호출로 대체 예정
    setEvents([]);
  }, []);

  // 폼 입력 처리
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'price') {
      // 숫자만 추출
      const numericValue = value.replace(/[^\d]/g, '');
      // 천 단위 콤마 추가
      const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else if (name === 'discount') {
      // 숫자만 추출
      const numericValue = value.replace(/[^\d]/g, '');
      // 100을 초과하지 않도록 제한
      const limitedValue = Math.min(parseInt(numericValue) || 0, 100);
      // % 기호 추가
      const formattedValue = limitedValue > 0 ? `${limitedValue}%` : '';
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (e, imageType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          [imageType]: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 삭제 핸들러
  const handleImageRemove = (imageType) => {
    setFormData(prev => ({
      ...prev,
      [imageType]: ''
    }));
  };

  // 이벤트 추가/수정
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 실제로는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingEvent) {
        // 수정
        setEvents(prev => prev.map(event => 
          event.id === editingEvent.id 
            ? { ...formData, id: editingEvent.id, createdAt: editingEvent.createdAt }
            : event
        ));
      } else {
        // 추가
        const newEvent = {
          ...formData,
          id: Date.now(),
          createdAt: new Date().toISOString().split('T')[0]
        };
        setEvents(prev => [newEvent, ...prev]);
      }

      // 폼 초기화
      setFormData({
        title: '',
        description: '',
        image: '',
        hospital: '',
        location: '',
        price: '',
        discount: '',
        discountType: 'plasticSurgery',
        rating: '5.0',
        reviewCount: '0',
        hasKakaoConsult: false
      });
      setIsFormOpen(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('이벤트 저장 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 이벤트 수정
  const handleEdit = (event) => {
    setFormData(event);
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  // 이벤트 삭제
  const handleDelete = async (eventId) => {
    if (!confirm('정말로 이 이벤트를 삭제하시겠습니까?')) return;

    try {
      // 실제로는 API 호출
      await new Promise(resolve => setTimeout(resolve, 500));
      setEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('이벤트 삭제 오류:', error);
    }
  };

  // 새 이벤트 추가 시작
  const handleAddNew = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      hospital: '',
      location: '',
      price: '',
      discount: '',
      discountType: 'plasticSurgery',
      rating: '5.0',
      reviewCount: '0',
      hasKakaoConsult: false
    });
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-label-common_5">이벤트 관리</h1>
            <p className="text-sm text-label-common_3 mt-1">이벤트를 등록하고 관리할 수 있습니다.</p>
          </div>
          <button
            onClick={handleAddNew}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: '#604aff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#4d37e6';
              e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#604aff';
              e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
          >
            <svg style={{ width: '16px', height: '16px', color: 'white', stroke: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span style={{ color: 'white' }}>새 이벤트</span>
          </button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-label-common_3">전체 이벤트</p>
                <p className="text-2xl font-bold text-label-common_5">{events.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-label-common_3">활성 이벤트</p>
                <p className="text-2xl font-bold text-label-common_5">{events.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-label-common_3">평균 할인율</p>
                <p className="text-2xl font-bold text-label-common_5">
                  {events.length > 0 ? Math.round(events.reduce((sum, e) => sum + parseInt(e.discount), 0) / events.length) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 이벤트 목록 */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-label-common_5">이벤트 목록</h2>
          </div>
          
          {events.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-label-common_4 mb-2">등록된 이벤트가 없습니다</h3>
              <p className="text-sm text-label-common_3 mb-4">첫 번째 이벤트를 등록해보세요.</p>
              <button
                onClick={handleAddNew}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  backgroundColor: '#604aff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  margin: '0 auto'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#4d37e6';
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#604aff';
                  e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
              >
                <svg style={{ width: '16px', height: '16px', color: 'white', stroke: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span style={{ color: 'white' }}>새 이벤트 등록</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-label-common_3 uppercase tracking-wider">이벤트</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-label-common_3 uppercase tracking-wider">병원</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-label-common_3 uppercase tracking-wider">가격/할인</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-label-common_3 uppercase tracking-wider">평가</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-label-common_3 uppercase tracking-wider">등록일</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-label-common_3 uppercase tracking-wider">관리</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img 
                          className="h-12 w-12 rounded-lg object-cover" 
                          src={event.image} 
                          alt={event.title}
                          onError={(e) => {
                            e.target.src = '/images/placeholder-event.png';
                          }}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-label-common_5 line-clamp-1">{event.title}</div>
                          <div className="text-sm text-label-common_3 line-clamp-1">{event.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-label-common_5">{event.hospital}</div>
                      <div className="text-sm text-label-common_3">{event.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-label-common_5">{event.price}</div>
                      <div className="text-sm font-medium" style={{ color: event.discountType === 'plasticSurgery' ? '#604aff' : '#ff528d' }}>
                        {event.discount} 할인
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 star-icon mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span className="text-sm text-label-common_5">{event.rating}</span>
                        <span className="text-sm text-label-common_3 ml-1">({event.reviewCount})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-label-common_3">
                      {event.createdAt}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="text-sm px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-label-common_4"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="text-sm px-3 py-1 rounded-lg border border-red-200 hover:bg-red-50 text-red-600"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </div>

      {/* 이벤트 등록/수정 모달 */}
      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl relative">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-label-common_5">
                  {editingEvent ? '이벤트 수정' : '새 이벤트 등록'}
                </h2>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form id="event-form" onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* 기본 정보 */}
              <div>
                <h3 className="text-lg font-semibold text-label-common_5 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" style={{ color: '#604aff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  기본 정보
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-label-common_5 mb-2">
                      이벤트 제목 *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                      style={{ borderRadius: '8px' }}
                      placeholder="이벤트 제목을 입력해주세요"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-label-common_5 mb-2">
                      이벤트 설명 *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white resize-none"
                      style={{ borderRadius: '8px' }}
                      placeholder="이벤트 설명을 입력해주세요"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-label-common_5 mb-2">
                      썸네일 URL *
                    </label>
                    <div className="space-y-3">
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                        style={{ borderRadius: '8px' }}
                        placeholder="https://example.com/thumbnail.jpg"
                        required
                      />
                      <div className="mt-3">
                        {formData.image && (formData.image.startsWith('data:') || formData.image.startsWith('http')) ? (
                          <div className="relative group">
                            <img 
                              src={formData.image} 
                              alt="썸네일 미리보기" 
                              className="w-full h-48 object-cover border-2 border-gray-200 group-hover:border-purple-400 transition-colors"
                              style={{ borderRadius: '12px' }}
                              onError={(e) => {
                                console.error('이미지 로드 실패:', formData.image);
                                e.target.style.display = 'none';
                              }}
                              onLoad={() => console.log('이미지 로드 성공')}
                            />
                            {/* X 버튼 - 오른쪽 상단 */}
                            <button
                              type="button"
                              onClick={() => handleImageRemove('image')}
                              className="absolute top-2 right-2 text-white p-2 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                              title="이미지 삭제"
                              style={{ 
                                zIndex: 10,
                                backgroundColor: '#604aff',
                                borderRadius: '50%'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#4d37e6';
                                e.target.style.borderRadius = '50%';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#604aff';
                                e.target.style.borderRadius = '50%';
                              }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            
                            {/* 교체 버튼 - 중앙 */}
                            <div 
                              className="absolute inset-0 bg-black transition-all flex items-center justify-center pointer-events-none group-hover:pointer-events-auto" 
                              style={{ 
                                borderRadius: '12px',
                                backgroundColor: 'transparent'
                              }}
                            >
                              <label 
                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full transition-colors shadow-lg cursor-pointer pointer-events-auto"
                                title="이미지 교체"
                                style={{
                                  backgroundColor: 'rgba(96, 74, 255, 0.9)'
                                }}
                              >
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, 'image')}
                                  className="hidden"
                                />
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                              </label>
                            </div>
                          </div>
                        ) : (
                          <label className="relative group block w-full p-6 border-2 border-dashed border-gray-300 hover:border-purple-400 transition-all cursor-pointer bg-gray-50 hover:bg-purple-50" style={{ borderRadius: '12px' }}>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'image')}
                              className="hidden"
                            />
                            <div className="text-center">
                              <div className="space-y-2">
                                <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">썸네일 이미지 업로드</p>
                                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF 파일을 드래그하거나 클릭하여 업로드</p>
                                </div>
                              </div>
                            </div>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-label-common_5 mb-2">
                      상세 이미지 URL *
                    </label>
                    <div className="space-y-3">
                      <input
                        type="url"
                        name="detailImage"
                        value={formData.detailImage}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                        style={{ borderRadius: '8px' }}
                        placeholder="https://example.com/detail.jpg"
                        required
                      />
                      <div className="mt-3">
                        {formData.detailImage && (formData.detailImage.startsWith('data:') || formData.detailImage.startsWith('http')) ? (
                          <div className="relative group">
                            <img 
                              src={formData.detailImage} 
                              alt="상세 이미지 미리보기" 
                              className="w-full h-48 object-cover border-2 border-gray-200 group-hover:border-purple-400 transition-colors"
                              style={{ borderRadius: '12px' }}
                              onError={(e) => {
                                console.error('이미지 로드 실패:', formData.detailImage);
                                e.target.style.display = 'none';
                              }}
                              onLoad={() => console.log('상세 이미지 로드 성공')}
                            />
                            {/* X 버튼 - 오른쪽 상단 */}
                            <button
                              type="button"
                              onClick={() => handleImageRemove('detailImage')}
                              className="absolute top-2 right-2 text-white p-2 rounded-full transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                              title="이미지 삭제"
                              style={{ 
                                zIndex: 10,
                                backgroundColor: '#604aff',
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#4d37e6';
                                e.target.style.borderRadius = '50%';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#604aff';
                                e.target.style.borderRadius = '50%';
                              }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            
                            {/* 교체 버튼 - 중앙 */}
                            <div 
                              className="absolute inset-0 bg-black transition-all flex items-center justify-center pointer-events-none group-hover:pointer-events-auto" 
                              style={{ 
                                borderRadius: '12px',
                                backgroundColor: 'transparent'
                              }}
                            >
                              <label 
                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full transition-colors shadow-lg cursor-pointer pointer-events-auto"
                                title="이미지 교체"
                                style={{
                                  backgroundColor: 'rgba(96, 74, 255, 0.9)'
                                }}
                              >
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, 'detailImage')}
                                  className="hidden"
                                />
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                              </label>
                            </div>
                          </div>
                        ) : (
                          <label className="relative group block w-full p-6 border-2 border-dashed border-gray-300 hover:border-purple-400 transition-all cursor-pointer bg-gray-50 hover:bg-purple-50" style={{ borderRadius: '12px' }}>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'detailImage')}
                              className="hidden"
                            />
                            <div className="text-center">
                              <div className="space-y-2">
                                <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">상세 이미지 업로드</p>
                                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF 파일을 드래그하거나 클릭하여 업로드</p>
                                </div>
                              </div>
                            </div>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 병원 정보 */}
              <div>
                <h3 className="text-lg font-semibold text-label-common_5 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" style={{ color: '#604aff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  병원 정보
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-label-common_5 mb-2">
                      병원명 *
                    </label>
                    <input
                      type="text"
                      name="hospital"
                      value={formData.hospital}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                      style={{ borderRadius: '8px' }}
                      placeholder="병원명을 입력해주세요"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-label-common_5 mb-2">
                      위치 *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                      style={{ borderRadius: '8px' }}
                      placeholder="서울 강남구"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 가격 정보 */}
              <div>
                <h3 className="text-lg font-semibold text-label-common_5 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" style={{ color: '#604aff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  가격 정보
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-label-common_5 mb-2">
                      가격 *
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                      style={{ borderRadius: '8px' }}
                      placeholder="1,000,000원"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-label-common_5 mb-2">
                      할인율 *
                    </label>
                    <input
                      type="text"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                      style={{ borderRadius: '8px' }}
                      placeholder="30%"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-label-common_5 mb-2">
                      할인 유형 *
                    </label>
                    <div style={{ position: 'relative', zIndex: '1000' }} data-discount-dropdown>
                      {/* 커스텀 드롭다운 */}
                      <div
                        onClick={() => setIsDiscountDropdownOpen(!isDiscountDropdownOpen)}
                        className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 hover:bg-white cursor-pointer flex justify-between items-center"
                        style={{ 
                          borderRadius: '8px',
                          position: 'relative',
                          zIndex: '1001'
                        }}
                      >
                        <span className="text-gray-700">
                          {formData.discountType === 'plasticSurgery' ? '성형수술' : '피부치료'}
                        </span>
                        <svg 
                          className={`w-4 h-4 text-gray-400 transition-transform ${isDiscountDropdownOpen ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      
                      {/* 드롭다운 옵션들 */}
                      {isDiscountDropdownOpen && (
                        <div 
                          className="absolute top-full left-0 right-0 bg-white border-2 border-gray-200 shadow-lg z-50"
                          style={{ 
                            borderRadius: '8px',
                            marginTop: '2px'
                          }}
                        >
                          <div
                            onClick={() => {
                              setFormData(prev => ({ ...prev, discountType: 'plasticSurgery' }));
                              setIsDiscountDropdownOpen(false);
                            }}
                            className="px-4 py-3 hover:bg-purple-50 cursor-pointer text-gray-700 border-b border-gray-100 last:border-b-0"
                          >
                            성형수술
                          </div>
                          <div
                            onClick={() => {
                              setFormData(prev => ({ ...prev, discountType: 'skinTreatment' }));
                              setIsDiscountDropdownOpen(false);
                            }}
                            className="px-4 py-3 hover:bg-purple-50 cursor-pointer text-gray-700 border-b border-gray-100 last:border-b-0"
                          >
                            피부치료
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 평가 정보 */}
              <div>
                <h3 className="text-lg font-semibold text-label-common_5 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" style={{ color: '#604aff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  평가 정보
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-label-common_5 mb-2">
                      평점
                    </label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      min="0"
                      max="5"
                      step="0.1"
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                      style={{ borderRadius: '8px' }}
                      placeholder="4.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-label-common_5 mb-2">
                      후기 수
                    </label>
                    <input
                      type="number"
                      name="reviewCount"
                      value={formData.reviewCount}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                      style={{ borderRadius: '8px' }}
                      placeholder="100"
                    />
                  </div>
                </div>
              </div>

              {/* 추가 옵션 */}
              <div>
                <h3 className="text-lg font-semibold text-label-common_5 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" style={{ color: '#604aff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  추가 옵션
                </h3>
                <label className="bg-purple-50 p-4 border border-purple-100 cursor-pointer hover:bg-purple-100 transition-colors block" style={{ borderRadius: '8px' }}>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="hasKakaoConsult"
                      checked={formData.hasKakaoConsult}
                      onChange={handleInputChange}
                      className="h-5 w-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-2 cursor-pointer"
                      style={{ accentColor: '#604aff' }}
                    />
                    <span className="ml-3 text-sm font-medium text-label-common_5 cursor-pointer">
                      카카오톡 상담 가능
                    </span>
                  </div>
                </label>
              </div>

            </form>
            
            {/* 플로팅 버튼 영역 */}
            <div 
              className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 mt-6"
              style={{ 
                borderBottomLeftRadius: '12px', 
                borderBottomRightRadius: '12px',
                boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
                zIndex: '10'
              }}
            >
              <div className="flex justify-end" style={{ gap: '16px' }}>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-3 text-sm font-medium text-label-common_4 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all bg-white"
                  style={{ borderRadius: '8px' }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  form="event-form"
                  disabled={isLoading || !isFormValid()}
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    backgroundColor: isFormValid() ? '#604aff' : '#9ca3af', 
                    borderRadius: '8px', 
                    color: 'white',
                    border: 'none',
                    cursor: (isLoading || !isFormValid()) ? 'not-allowed' : 'pointer',
                    opacity: (isLoading || !isFormValid()) ? 0.6 : 1,
                    boxShadow: isFormValid() ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && isFormValid()) {
                      e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                      e.target.style.backgroundColor = '#4d37e6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading && isFormValid()) {
                      e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                      e.target.style.backgroundColor = '#604aff';
                    }
                  }}
                >
                  {isLoading ? (
                    <>
                      <svg style={{ width: '16px', height: '16px', color: 'white', animation: 'spin 1s linear infinite', marginLeft: '-4px', marginRight: '8px' }} fill="none" viewBox="0 0 24 24">
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path style={{ opacity: 0.75, fill: 'white' }} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span style={{ color: 'white' }}>저장 중...</span>
                    </>
                  ) : (
                    <>
                      <svg style={{ width: '16px', height: '16px', color: 'white', stroke: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span style={{ color: 'white' }}>{editingEvent ? '수정 완료' : '등록하기'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}