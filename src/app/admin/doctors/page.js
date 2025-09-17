"use client";

import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../components/AdminLayout';

export default function AdminDoctorsPage() {
  // CSS 애니메이션 키프레임
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
      select[name="location"] {
        position: relative !important;
      }
      
      /* 드롭다운 옵션들의 위치 제어 */
      select[name="location"]:focus,
      select[name="location"]:active {
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

  const [doctors, setDoctors] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    detailImage: '',
    location: '',
    address: '',
    specialties: [],
    description: '',
    doctorCount: '',
    phone: '',
    operatingHours: '',
    badges: {
      safeZone: false,
      doctorConsult: false,
      hospitalConsult: false
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  // 드롭다운 외부 클릭 감지 (추후 필요시 사용)
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  // 필수 입력란 검증
  const isFormValid = () => {
    return formData.name.trim() !== '' &&
           formData.image.trim() !== '' &&
           formData.detailImage.trim() !== '' &&
           formData.location.trim() !== '' &&
           formData.address.trim() !== '' &&
           formData.specialties.length > 0 &&
           formData.description.trim() !== '' &&
           formData.doctorCount.trim() !== '';
  };

  // 의사/병원 데이터 로드 (실제로는 API에서 가져옴)
  useEffect(() => {
    // 실제 API 호출로 대체 예정
    setDoctors([]);
  }, []);

  // 폼 입력 처리
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('badges.')) {
      const badgeKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        badges: {
          ...prev.badges,
          [badgeKey]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // 전문분야 입력 처리
  const handleSpecialtiesChange = (e) => {
    const value = e.target.value;
    const specialtiesArray = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setFormData(prev => ({
      ...prev,
      specialties: specialtiesArray
    }));
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

  // 의사/병원 추가/수정
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 실제로는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingDoctor) {
        // 수정
        setDoctors(prev => prev.map(doctor => 
          doctor.id === editingDoctor.id 
            ? { ...formData, id: editingDoctor.id, createdAt: editingDoctor.createdAt }
            : doctor
        ));
      } else {
        // 추가
        const newDoctor = {
          ...formData,
          id: Date.now(),
          rating: 0,
          reviewCount: 0,
          consultCount: 0,
          eventCount: 0,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setDoctors(prev => [newDoctor, ...prev]);
      }

      // 폼 초기화
      setFormData({
        name: '',
        image: '',
        detailImage: '',
        location: '',
        address: '',
        specialties: [],
        description: '',
        doctorCount: '',
        phone: '',
        operatingHours: '',
        badges: {
          safeZone: false,
          doctorConsult: false,
          hospitalConsult: false
        }
      });
      setIsFormOpen(false);
      setEditingDoctor(null);
    } catch (error) {
      console.error('의사/병원 저장 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 의사/병원 수정
  const handleEdit = (doctor) => {
    setFormData(doctor);
    setEditingDoctor(doctor);
    setIsFormOpen(true);
  };

  // 의사/병원 삭제
  const handleDelete = async (doctorId) => {
    if (!confirm('정말로 이 의사/병원을 삭제하시겠습니까?')) return;

    try {
      // 실제로는 API 호출
      await new Promise(resolve => setTimeout(resolve, 500));
      setDoctors(prev => prev.filter(doctor => doctor.id !== doctorId));
    } catch (error) {
      console.error('의사/병원 삭제 오류:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-label-common_5">의사/병원 관리</h1>
            <p className="text-sm text-label-common_3 mt-1">의사/병원을 등록하고 관리할 수 있습니다.</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
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
            <span style={{ color: 'white' }}>새 의사/병원</span>
          </button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-label-common_3">전체 의사/병원</p>
                <p className="text-2xl font-bold text-label-common_5">{doctors.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-label-common_3">활성 의사/병원</p>
                <p className="text-2xl font-bold text-label-common_5">{doctors.filter(d => d.badges?.safeZone).length}</p>
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
                <p className="text-sm text-label-common_3">평균 평점</p>
                <p className="text-2xl font-bold text-label-common_5">
                  {doctors.length > 0 ? (doctors.reduce((sum, d) => sum + (d.rating || 0), 0) / doctors.length).toFixed(1) : '0.0'}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 의사/병원 목록 */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-label-common_5">의사/병원 목록</h2>
          </div>
          
          {doctors.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-label-common_4 mb-2">등록된 의사/병원이 없습니다</h3>
              <p className="text-sm text-label-common_3 mb-4">첫 번째 의사/병원을 등록해보세요.</p>
              <button
                onClick={() => setIsFormOpen(true)}
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
                <span style={{ color: 'white' }}>새 의사/병원 등록</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-label-common_3 uppercase tracking-wider">의사/병원</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-label-common_3 uppercase tracking-wider">위치</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-label-common_3 uppercase tracking-wider">전문분야</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-label-common_3 uppercase tracking-wider">평점</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-label-common_3 uppercase tracking-wider">등록일</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-label-common_3 uppercase tracking-wider">관리</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {doctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            className="h-12 w-12 rounded-lg object-cover" 
                            src={doctor.image || 'https://via.placeholder.com/48x48?text=No+Image'} 
                            alt={doctor.name}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-label-common_5">{doctor.name}</div>
                            <div className="text-sm text-label-common_3">의사 {doctor.doctorCount || 0}명</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-label-common_5">{doctor.location}</div>
                        <div className="text-sm text-label-common_3">{doctor.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {doctor.specialties?.slice(0, 3).map((specialty, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {specialty}
                            </span>
                          ))}
                          {doctor.specialties?.length > 3 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{doctor.specialties.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm text-label-common_5">{doctor.rating || '0.0'}</span>
                          <span className="text-sm text-label-common_3 ml-1">({doctor.reviewCount || 0})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-label-common_3">
                        {doctor.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(doctor)}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDelete(doctor.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
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

      {/* 의사/병원 등록/수정 모달 */}
      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl relative">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-label-common_5">
                  {editingDoctor ? '의사/병원 수정' : '새 의사/병원 등록'}
                </h2>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form id="doctor-form" onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* 기본 정보 */}
              <div>
                <h3 className="text-lg font-semibold text-label-common_5 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" style={{ color: '#604aff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  기본 정보
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-label-common_5 mb-2">
                      의사/병원명 *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                      style={{ borderRadius: '8px' }}
                      placeholder="의사/병원명을 입력해주세요"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-label-common_5 mb-2">
                      지역 *
                    </label>
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                      style={{ 
                        borderRadius: '8px',
                        backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                        backgroundPosition: 'right 12px center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '16px',
                        paddingRight: '40px'
                      }}
                      required
                    >
                      <option value="">지역을 선택해주세요</option>
                      <option value="서울 강남역">서울 강남역</option>
                      <option value="서울 신논현">서울 신논현</option>
                      <option value="서울 압구정">서울 압구정</option>
                      <option value="서울 신사">서울 신사</option>
                      <option value="서울 선릉">서울 선릉</option>
                      <option value="대구 동성로">대구 동성로</option>
                      <option value="부산 서면">부산 서면</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-label-common_5 mb-2">
                      상세 주소 *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                      style={{ borderRadius: '8px' }}
                      placeholder="상세 주소를 입력해주세요"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-label-common_5 mb-2">
                      전문 분야 *
                    </label>
                    <input
                      type="text"
                      name="specialties"
                      value={formData.specialties.join(', ')}
                      onChange={handleSpecialtiesChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                      style={{ borderRadius: '8px' }}
                      placeholder="예: 눈, 코, 가슴 (쉼표로 구분)"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-label-common_5 mb-2">
                      의사 수 *
                    </label>
                    <input
                      type="number"
                      name="doctorCount"
                      value={formData.doctorCount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                      style={{ borderRadius: '8px' }}
                      placeholder="의사 수를 입력해주세요"
                      min="1"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-label-common_5 mb-2">
                      설명 *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white resize-none"
                      style={{ borderRadius: '8px' }}
                      placeholder="의사/병원 설명을 입력해주세요"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-label-common_5 mb-2">
                      대표 이미지 URL *
                    </label>
                    <div className="space-y-3">
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                        style={{ borderRadius: '8px' }}
                        placeholder="https://example.com/image.jpg"
                        required
                      />
                      <div className="mt-3">
                        {formData.image && (formData.image.startsWith('data:') || formData.image.startsWith('http')) ? (
                          <div className="relative group">
                            <img 
                              src={formData.image} 
                              alt="대표 이미지 미리보기" 
                              className="w-full h-48 object-cover border-2 border-gray-200 group-hover:border-purple-400 transition-colors"
                              style={{ borderRadius: '12px' }}
                              onError={(e) => {
                                console.error('이미지 로드 실패:', formData.image);
                                e.target.style.display = 'none';
                              }}
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
                                  <p className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">대표 이미지 업로드</p>
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
                            />
                            {/* X 버튼 - 오른쪽 상단 */}
                            <button
                              type="button"
                              onClick={() => handleImageRemove('detailImage')}
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

              {/* 연락처 정보 */}
              <div>
                <h3 className="text-lg font-semibold text-label-common_5 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" style={{ color: '#604aff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  연락처 정보
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-label-common_5 mb-2">
                      전화번호
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                      style={{ borderRadius: '8px' }}
                      placeholder="02-1234-5678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-label-common_5 mb-2">
                      운영시간
                    </label>
                    <input
                      type="text"
                      name="operatingHours"
                      value={formData.operatingHours}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                      style={{ borderRadius: '8px' }}
                      placeholder="평일 09:00 - 18:00"
                    />
                  </div>
                </div>
              </div>

              {/* 배지 옵션 */}
              <div>
                <h3 className="text-lg font-semibold text-label-common_5 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" style={{ color: '#604aff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  배지 옵션
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="bg-purple-50 p-4 border border-purple-100 cursor-pointer hover:bg-purple-100 transition-colors block" style={{ borderRadius: '8px' }}>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="badges.safeZone"
                        checked={formData.badges.safeZone}
                        onChange={handleInputChange}
                        className="h-5 w-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-2 cursor-pointer"
                        style={{ accentColor: '#604aff' }}
                      />
                      <span className="ml-3 text-sm font-medium text-label-common_5 cursor-pointer">
                        안심존
                      </span>
                    </div>
                  </label>

                  <label className="bg-purple-50 p-4 border border-purple-100 cursor-pointer hover:bg-purple-100 transition-colors block" style={{ borderRadius: '8px' }}>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="badges.doctorConsult"
                        checked={formData.badges.doctorConsult}
                        onChange={handleInputChange}
                        className="h-5 w-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-2 cursor-pointer"
                        style={{ accentColor: '#604aff' }}
                      />
                      <span className="ml-3 text-sm font-medium text-label-common_5 cursor-pointer">
                        의사 상담
                      </span>
                    </div>
                  </label>

                  <label className="bg-purple-50 p-4 border border-purple-100 cursor-pointer hover:bg-purple-100 transition-colors block" style={{ borderRadius: '8px' }}>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="badges.hospitalConsult"
                        checked={formData.badges.hospitalConsult}
                        onChange={handleInputChange}
                        className="h-5 w-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-2 cursor-pointer"
                        style={{ accentColor: '#604aff' }}
                      />
                      <span className="ml-3 text-sm font-medium text-label-common_5 cursor-pointer">
                        병원 상담
                      </span>
                    </div>
                  </label>
                </div>
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
                  form="doctor-form"
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
                      <span style={{ color: 'white' }}>{editingDoctor ? '수정 완료' : '등록하기'}</span>
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