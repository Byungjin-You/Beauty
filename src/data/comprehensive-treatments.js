// 포괄적인 시술과 수술 분류 체계
// 기존 프로젝트 데이터 + 최신 K-Beauty 트렌드 + 의료 미용학 통합 + 메드스파 시술

export const treatmentCategories = {
  // 수술적 치료 (Surgical Treatments)
  surgery: {
    id: 'surgery',
    name: '수술적 치료',
    subcategories: {
      facial_surgery: {
        id: 'facial_surgery',
        name: '안면성형',
        treatments: [
          // 눈 관련 수술 (확장)
          { id: 'double_eyelid', name: '쌍꺼풀 수술', category: 'eye', difficulty: 'medium', duration: '1-2시간', recovery: '1-2주' },
          { id: 'ptosis_correction', name: '눈꺼풀 처짐 교정', category: 'eye', difficulty: 'medium', duration: '1-2시간', recovery: '2-3주' },
          { id: 'epicanthoplasty', name: '앞트임', category: 'eye', difficulty: 'medium', duration: '30분-1시간', recovery: '1-2주' },
          { id: 'lateral_canthoplasty', name: '뒷트임', category: 'eye', difficulty: 'medium', duration: '30분-1시간', recovery: '1-2주' },
          { id: 'under_eye_fat_removal', name: '눈밑지방 제거', category: 'eye', difficulty: 'medium', duration: '1시간', recovery: '1-2주' },
          { id: 'under_eye_fat_repositioning', name: '눈밑지방 재배치', category: 'eye', difficulty: 'high', duration: '1-2시간', recovery: '2-3주' },
          { id: 'brow_lift', name: '이마 리프트', category: 'eye', difficulty: 'high', duration: '2-3시간', recovery: '2-3주' },
          { id: 'otoplasty', name: '귀 성형', category: 'face', difficulty: 'medium', duration: '1-2시간', recovery: '1-2주' },
          
          // 코 관련 수술 (확장)
          { id: 'rhinoplasty', name: '코성형', category: 'nose', difficulty: 'high', duration: '2-3시간', recovery: '2-4주' },
          { id: 'alar_reduction', name: '콧볼 축소', category: 'nose', difficulty: 'medium', duration: '1시간', recovery: '1-2주' },
          { id: 'deviated_septum', name: '비중격 교정', category: 'nose', difficulty: 'high', duration: '2-3시간', recovery: '3-4주' },
          { id: 'nose_tip_plasty', name: '코끝 성형', category: 'nose', difficulty: 'high', duration: '1-2시간', recovery: '2-3주' },
          { id: 'functional_rhinoplasty', name: '기능성 코성형', category: 'nose', difficulty: 'high', duration: '2-3시간', recovery: '3-4주' },
          { id: 'revision_rhinoplasty', name: '코 재수술', category: 'nose', difficulty: 'very_high', duration: '3-4시간', recovery: '4-6주' },
          { id: 'non_surgical_nose_job', name: '비수술 코성형', category: 'nose', difficulty: 'low', duration: '30분', recovery: '즉시' },
          
          // 턱/윤곽 관련 수술 (확장)
          { id: 'jaw_reduction', name: '사각턱 축소', category: 'face', difficulty: 'very_high', duration: '3-4시간', recovery: '4-6주' },
          { id: 'v_line_surgery', name: 'V라인 수술', category: 'face', difficulty: 'very_high', duration: '3-4시간', recovery: '4-6주' },
          { id: 'chin_augmentation', name: '턱 확대', category: 'face', difficulty: 'high', duration: '1-2시간', recovery: '2-3주' },
          { id: 'cheekbone_reduction', name: '광대 축소', category: 'face', difficulty: 'very_high', duration: '3-4시간', recovery: '4-6주' },
          { id: 'forehead_augmentation', name: '이마 확대', category: 'face', difficulty: 'high', duration: '2-3시간', recovery: '3-4주' },
          { id: 'facial_contouring', name: '안면윤곽', category: 'face', difficulty: 'very_high', duration: '4-6시간', recovery: '6-8주' },
          { id: 'double_jaw_surgery', name: '양악수술', category: 'face', difficulty: 'very_high', duration: '4-6시간', recovery: '6-8주' },
          { id: 'three_jaw_surgery', name: '삼악수술', category: 'face', difficulty: 'very_high', duration: '5-7시간', recovery: '8-10주' },
          { id: 'long_face_surgery', name: '긴 얼굴 수술', category: 'face', difficulty: 'very_high', duration: '4-5시간', recovery: '6-8주' },
          
          // 입술 및 입 관련 수술 (신규 추가)
          { id: 'lip_augmentation_surgery', name: '입술 확대술', category: 'mouth', difficulty: 'medium', duration: '1시간', recovery: '1-2주' },
          { id: 'cupid_bow_lip_surgery', name: 'Cupid Bow 입술수술', category: 'mouth', difficulty: 'medium', duration: '1시간', recovery: '1-2주' },
          { id: 'smile_lift_surgery', name: 'Smile Lift 수술', category: 'mouth', difficulty: 'medium', duration: '1-2시간', recovery: '2-3주' },
          { id: 'gummy_smile_correction', name: '잇몸 미소 교정', category: 'mouth', difficulty: 'medium', duration: '1-2시간', recovery: '2-3주' },
          { id: 'dimple_creation', name: '보조개 수술', category: 'mouth', difficulty: 'low', duration: '30분', recovery: '1주' },
          
          // 기타 얼굴 수술 (확장)
          { id: 'facelift', name: '페이스리프트', category: 'face', difficulty: 'very_high', duration: '3-5시간', recovery: '4-6주' },
          { id: 'mini_facelift', name: '미니 페이스리프트', category: 'face', difficulty: 'high', duration: '2-3시간', recovery: '2-3주' },
          { id: 'neck_lift', name: '목 리프트', category: 'face', difficulty: 'high', duration: '2-3시간', recovery: '3-4주' },
          { id: 'hairline_lowering', name: '헤어라인 축소', category: 'hair', difficulty: 'high', duration: '3-4시간', recovery: '3-4주' },
          { id: 'forehead_reduction', name: '이마 축소', category: 'face', difficulty: 'high', duration: '2-3시간', recovery: '3-4주' },
          { id: 'temple_augmentation', name: '관자놀이 확대', category: 'face', difficulty: 'medium', duration: '1-2시간', recovery: '2-3주' },
          { id: 'malar_implant', name: '볼 임플란트', category: 'face', difficulty: 'high', duration: '2시간', recovery: '2-3주' },
          { id: 'tracheal_shave', name: '아담사과 축소', category: 'face', difficulty: 'medium', duration: '1시간', recovery: '1-2주' }
        ]
      },
      
      body_surgery: {
        id: 'body_surgery',
        name: '몸매성형',
        treatments: [
          // 가슴 관련 수술 (대폭 확장)
          { id: 'breast_augmentation', name: '가슴 확대', category: 'chest', difficulty: 'high', duration: '2-3시간', recovery: '4-6주' },
          { id: 'breast_reduction', name: '가슴 축소', category: 'chest', difficulty: 'high', duration: '3-4시간', recovery: '4-6주' },
          { id: 'breast_lift', name: '가슴 리프트', category: 'chest', difficulty: 'high', duration: '2-3시간', recovery: '4-6주' },
          { id: 'breast_revision', name: '가슴 재수술', category: 'chest', difficulty: 'very_high', duration: '3-4시간', recovery: '6-8주' },
          { id: 'gynecomastia', name: '여유증 수술', category: 'chest', difficulty: 'medium', duration: '1-2시간', recovery: '2-3주' },
          { id: 'nipple_reduction', name: '유두 축소', category: 'chest', difficulty: 'low', duration: '30분-1시간', recovery: '1-2주' },
          { id: 'areola_reduction', name: '유륜 축소', category: 'chest', difficulty: 'low', duration: '1시간', recovery: '1-2주' },
          { id: 'nipple_reconstruction', name: '유두 재건', category: 'chest', difficulty: 'medium', duration: '1-2시간', recovery: '2-3주' },
          { id: 'tuberous_breast_correction', name: '관모양 유방 교정', category: 'chest', difficulty: 'high', duration: '3-4시간', recovery: '4-6주' },
          { id: 'breast_fat_grafting', name: '가슴 지방이식', category: 'chest', difficulty: 'medium', duration: '2-3시간', recovery: '2-4주' },
          { id: 'hybrid_breast_augmentation', name: '하이브리드 가슴확대', category: 'chest', difficulty: 'high', duration: '3-4시간', recovery: '4-6주' },
          
          // 몸매 라인 수술 (확장)
          { id: 'liposuction', name: '지방흡입', category: 'bodyline', difficulty: 'high', duration: '2-4시간', recovery: '2-4주' },
          { id: 'fat_grafting', name: '지방이식', category: 'bodyline', difficulty: 'high', duration: '2-4시간', recovery: '2-4주' },
          { id: 'tummy_tuck', name: '복부성형', category: 'bodyline', difficulty: 'very_high', duration: '3-5시간', recovery: '6-8주' },
          { id: 'thigh_lift', name: '허벅지 리프트', category: 'bodyline', difficulty: 'high', duration: '2-4시간', recovery: '4-6주' },
          { id: 'arm_lift', name: '팔 리프트', category: 'bodyline', difficulty: 'high', duration: '2-3시간', recovery: '3-4주' },
          { id: 'buttock_augmentation', name: '엉덩이 확대', category: 'bodyline', difficulty: 'high', duration: '2-4시간', recovery: '4-6주' },
          { id: 'brazilian_butt_lift', name: '브라질리안 버트 리프트', category: 'bodyline', difficulty: 'very_high', duration: '3-4시간', recovery: '6-8주' },
          { id: 'calf_reduction', name: '종아리 축소', category: 'bodyline', difficulty: 'medium', duration: '1-2시간', recovery: '2-3주' },
          { id: 'abdominal_etching', name: '복근 조각술', category: 'bodyline', difficulty: 'high', duration: '2-3시간', recovery: '3-4주' },
          { id: 'body_contouring_post_weight_loss', name: '체중감소 후 바디컨투어링', category: 'bodyline', difficulty: 'very_high', duration: '4-6시간', recovery: '6-8주' },
          
          // 특수 부위 수술 (확장)
          { id: 'labiaplasty', name: '소음순 수술', category: 'yzone', difficulty: 'medium', duration: '1-2시간', recovery: '2-3주' },
          { id: 'vaginoplasty', name: '질 성형', category: 'yzone', difficulty: 'high', duration: '2-3시간', recovery: '4-6주' },
          { id: 'penile_enlargement', name: '음경 확대', category: 'yzone', difficulty: 'high', duration: '2-3시간', recovery: '4-6주' },
          { id: 'gender_affirmation_surgery', name: '성확정 수술', category: 'yzone', difficulty: 'very_high', duration: '4-8시간', recovery: '8-12주' }
        ]
      },
      
      hair_surgery: {
        id: 'hair_surgery',
        name: '모발이식',
        treatments: [
          { id: 'hair_transplant_fue', name: 'FUE 모발이식', category: 'hair', difficulty: 'high', duration: '4-8시간', recovery: '2-3주' },
          { id: 'hair_transplant_fut', name: 'FUT 모발이식', category: 'hair', difficulty: 'high', duration: '4-6시간', recovery: '3-4주' },
          { id: 'hairline_lowering_surgery', name: '헤어라인 축소술', category: 'hair', difficulty: 'high', duration: '3-4시간', recovery: '3-4주' },
          { id: 'eyebrow_transplant', name: '눈썹 이식', category: 'hair', difficulty: 'medium', duration: '2-3시간', recovery: '1-2주' },
          { id: 'beard_transplant', name: '수염 이식', category: 'hair', difficulty: 'medium', duration: '2-4시간', recovery: '1-2주' },
          { id: 'scalp_tattoo', name: '두피 문신', category: 'hair', difficulty: 'medium', duration: '2-4시간', recovery: '1주' }
        ]
      }
    }
  },

  // 비수술적 치료 (Non-Surgical Treatments) - 대폭 확장
  non_surgical: {
    id: 'non_surgical',
    name: '비수술적 치료',
    subcategories: {
      injectables: {
        id: 'injectables',
        name: '주사치료',
        treatments: [
          // 보톡스 계열 (확장)
          { id: 'botox_forehead', name: '이마 보톡스', category: 'face', difficulty: 'low', duration: '15-30분', recovery: '즉시' },
          { id: 'botox_glabella', name: '미간 보톡스', category: 'face', difficulty: 'low', duration: '15-30분', recovery: '즉시' },
          { id: 'botox_crows_feet', name: '눈가 보톡스', category: 'eye', difficulty: 'low', duration: '15-30분', recovery: '즉시' },
          { id: 'botox_jaw', name: '사각턱 보톡스', category: 'face', difficulty: 'medium', duration: '30분', recovery: '즉시' },
          { id: 'botox_calf', name: '종아리 보톡스', category: 'bodyline', difficulty: 'medium', duration: '30-45분', recovery: '즉시' },
          { id: 'botox_hyperhidrosis', name: '다한증 보톡스', category: 'bodyline', difficulty: 'medium', duration: '30-45분', recovery: '즉시' },
          { id: 'botox_neck_bands', name: '목주름 보톡스', category: 'face', difficulty: 'medium', duration: '20-30분', recovery: '즉시' },
          { id: 'botox_lip_flip', name: '립플립 보톡스', category: 'mouth', difficulty: 'low', duration: '15분', recovery: '즉시' },
          { id: 'xeomin', name: '제오민', category: 'face', difficulty: 'low', duration: '15-30분', recovery: '즉시' },
          { id: 'dysport', name: '디스포트', category: 'face', difficulty: 'low', duration: '15-30분', recovery: '즉시' },
          
          // 필러 계열 (대폭 확장)
          { id: 'filler_nasolabial', name: '팔자주름 필러', category: 'face', difficulty: 'medium', duration: '30분', recovery: '1-2일' },
          { id: 'filler_lips', name: '입술 필러', category: 'mouth', difficulty: 'medium', duration: '30분', recovery: '2-3일' },
          { id: 'filler_cheek', name: '볼 필러', category: 'face', difficulty: 'medium', duration: '30-45분', recovery: '2-3일' },
          { id: 'filler_chin', name: '턱 필러', category: 'face', difficulty: 'medium', duration: '30분', recovery: '2-3일' },
          { id: 'filler_nose', name: '코 필러', category: 'nose', difficulty: 'high', duration: '30-45분', recovery: '3-5일' },
          { id: 'filler_forehead', name: '이마 필러', category: 'face', difficulty: 'high', duration: '45분', recovery: '3-5일' },
          { id: 'filler_temple', name: '관자놀이 필러', category: 'face', difficulty: 'medium', duration: '30분', recovery: '2-3일' },
          { id: 'filler_under_eye', name: '눈밑 필러', category: 'eye', difficulty: 'high', duration: '30-45분', recovery: '3-5일' },
          { id: 'filler_jawline', name: '턱선 필러', category: 'face', difficulty: 'high', duration: '45분-1시간', recovery: '3-5일' },
          { id: 'filler_hand', name: '손등 필러', category: 'hand', difficulty: 'medium', duration: '30분', recovery: '2-3일' },
          { id: 'restylane', name: '레스틸렌', category: 'face', difficulty: 'medium', duration: '30-45분', recovery: '2-3일' },
          { id: 'juvederm', name: '쥬비덤', category: 'face', difficulty: 'medium', duration: '30-45분', recovery: '2-3일' },
          { id: 'radiesse', name: '레디에스', category: 'face', difficulty: 'medium', duration: '30-45분', recovery: '2-3일' },
          { id: 'sculptra', name: '스컬트라', category: 'face', difficulty: 'medium', duration: '45분', recovery: '2-3일' },
          
          // 지방분해 주사 (확장)
          { id: 'fat_dissolving_injection', name: '지방분해주사', category: 'bodyline', difficulty: 'medium', duration: '30분', recovery: '1-2일' },
          { id: 'kybella', name: '카이벨라 (이중턱 주사)', category: 'face', difficulty: 'medium', duration: '30분', recovery: '3-5일' },
          { id: 'phosphatidylcholine', name: '포스파티딜콜린', category: 'bodyline', difficulty: 'medium', duration: '30분', recovery: '1-2일' },
          { id: 'deoxycholic_acid', name: '데옥시콜산', category: 'face', difficulty: 'medium', duration: '30분', recovery: '2-3일' },
          
          // 기타 주사 (확장)
          { id: 'whitening_injection', name: '미백주사', category: 'skin', difficulty: 'low', duration: '30분', recovery: '즉시' },
          { id: 'vitamin_injection', name: '비타민주사', category: 'skin', difficulty: 'low', duration: '15-30분', recovery: '즉시' },
          { id: 'placenta_injection', name: '태반주사', category: 'skin', difficulty: 'low', duration: '30분', recovery: '즉시' },
          { id: 'collagen_injection', name: '콜라겐주사', category: 'skin', difficulty: 'low', duration: '30분', recovery: '즉시' },
          { id: 'iv_therapy', name: 'IV 테라피', category: 'wellness', difficulty: 'low', duration: '30분-1시간', recovery: '즉시' },
          { id: 'glutathione_injection', name: '글루타치온 주사', category: 'skin', difficulty: 'low', duration: '30분', recovery: '즉시' },
          { id: 'hormone_therapy', name: '호르몬 치료', category: 'wellness', difficulty: 'medium', duration: '30분', recovery: '즉시' },
          { id: 'mesotherapy', name: '메조테라피', category: 'skin', difficulty: 'medium', duration: '30-45분', recovery: '1-2일' }
        ]
      },
      
      laser_treatments: {
        id: 'laser_treatments',
        name: '레이저 치료',
        treatments: [
          // 피부 레이저 (대폭 확장)
          { id: 'ipl_photorejuvenation', name: 'IPL 광치료', category: 'skin', difficulty: 'low', duration: '30-45분', recovery: '1-2일' },
          { id: 'co2_laser_resurfacing', name: 'CO2 레이저 리서페이싱', category: 'skin', difficulty: 'high', duration: '1-2시간', recovery: '1-2주' },
          { id: 'fractional_laser', name: '프랙셔널 레이저', category: 'skin', difficulty: 'medium', duration: '45분-1시간', recovery: '3-5일' },
          { id: 'picosecond_laser', name: '피코레이저', category: 'skin', difficulty: 'medium', duration: '30-45분', recovery: '2-3일' },
          { id: 'q_switched_laser', name: 'Q-스위치드 레이저', category: 'skin', difficulty: 'medium', duration: '30분', recovery: '3-5일' },
          { id: 'erbium_laser', name: '어븀 레이저', category: 'skin', difficulty: 'medium', duration: '45분-1시간', recovery: '3-5일' },
          { id: 'nd_yag_laser', name: 'Nd:YAG 레이저', category: 'skin', difficulty: 'medium', duration: '30-45분', recovery: '2-3일' },
          { id: 'alexandrite_laser', name: '알렉산드라이트 레이저', category: 'skin', difficulty: 'medium', duration: '30-45분', recovery: '2-3일' },
          { id: 'ruby_laser', name: '루비 레이저', category: 'skin', difficulty: 'medium', duration: '30분', recovery: '3-5일' },
          { id: 'diode_laser', name: '다이오드 레이저', category: 'skin', difficulty: 'low', duration: '30분-1시간', recovery: '즉시' },
          
          // 특수 레이저 (확장)
          { id: 'laser_hair_removal', name: '레이저 제모', category: 'waxing', difficulty: 'low', duration: '30분-2시간', recovery: '즉시' },
          { id: 'tattoo_removal_laser', name: '타투 제거 레이저', category: 'skin', difficulty: 'medium', duration: '30분-1시간', recovery: '1-2주' },
          { id: 'vascular_laser', name: '혈관 레이저', category: 'skin', difficulty: 'medium', duration: '30-45분', recovery: '1-3일' },
          { id: 'acne_laser', name: '여드름 레이저', category: 'skin', difficulty: 'low', duration: '30분', recovery: '1-2일' },
          { id: 'scar_laser', name: '흉터 레이저', category: 'skin', difficulty: 'medium', duration: '45분', recovery: '3-5일' },
          { id: 'melasma_laser', name: '기미 레이저', category: 'skin', difficulty: 'medium', duration: '30-45분', recovery: '3-5일' },
          { id: 'age_spot_laser', name: '노인성 반점 레이저', category: 'skin', difficulty: 'low', duration: '30분', recovery: '1-2일' },
          { id: 'freckle_removal_laser', name: '주근깨 제거 레이저', category: 'skin', difficulty: 'low', duration: '30분', recovery: '1-2일' },
          
          // 한국 특화 레이저 (신규 추가)
          { id: 'bbl_skintyte', name: 'BBL SkinTyte', category: 'skin', difficulty: 'low', duration: '30-45분', recovery: '즉시' },
          { id: 'soprano_titanium', name: 'Soprano Titanium', category: 'skin', difficulty: 'low', duration: '30-45분', recovery: '즉시' },
          { id: 'clear_silk', name: 'ClearSilk', category: 'skin', difficulty: 'low', duration: '30분', recovery: '즉시' },
          { id: 'picocare', name: 'PicoCare', category: 'skin', difficulty: 'medium', duration: '30-45분', recovery: '2-3일' },
          { id: 'picoplus', name: 'PicoPlus', category: 'skin', difficulty: 'medium', duration: '30-45분', recovery: '2-3일' },
          { id: 'discovery_pico', name: 'Discovery Pico', category: 'skin', difficulty: 'medium', duration: '30-45분', recovery: '2-3일' }
        ]
      },
      
      // 고주파 및 초음파 치료 (신규 카테고리)
      energy_based_treatments: {
        id: 'energy_based_treatments',
        name: '에너지 기반 치료',
        treatments: [
          // 고주파 치료
          { id: 'thermage_flx', name: 'Thermage FLX', category: 'skin', difficulty: 'medium', duration: '1-2시간', recovery: '즉시' },
          { id: 'xerf', name: 'Xerf', category: 'skin', difficulty: 'medium', duration: '1-1.5시간', recovery: '즉시' },
          { id: 'oligio', name: 'Oligio', category: 'skin', difficulty: 'medium', duration: '45분-1시간', recovery: '즉시' },
          { id: 'inmode', name: 'InMode', category: 'skin', difficulty: 'medium', duration: '45분', recovery: '1-2일' },
          { id: 'secret_rf', name: 'Secret RF', category: 'skin', difficulty: 'medium', duration: '45분-1시간', recovery: '2-3일' },
          { id: 'infini', name: 'Infini', category: 'skin', difficulty: 'medium', duration: '1시간', recovery: '3-5일' },
          
          // 초음파 치료
          { id: 'ultherapy', name: 'Ultherapy', category: 'skin', difficulty: 'high', duration: '1-2시간', recovery: '즉시' },
          { id: 'doublo_hifu', name: 'Doublo HIFU', category: 'skin', difficulty: 'medium', duration: '45분-1시간', recovery: '즉시' },
          { id: 'ultraformer', name: 'Ultraformer', category: 'skin', difficulty: 'medium', duration: '45분-1시간', recovery: '즉시' },
          { id: 'liposonix', name: 'LipoSonix', category: 'bodyline', difficulty: 'medium', duration: '1시간', recovery: '즉시' },
          { id: 'sofwave', name: 'Sofwave', category: 'skin', difficulty: 'medium', duration: '45분', recovery: '즉시' },
          
          // 기타 에너지 치료
          { id: 'radiofrequency_body', name: 'RF 바디케어', category: 'bodyline', difficulty: 'low', duration: '45분-1시간', recovery: '즉시' },
          { id: 'ultrasound_therapy', name: '초음파 치료', category: 'bodyline', difficulty: 'medium', duration: '45분-1시간', recovery: '즉시' },
          { id: 'cryolipolysis', name: '냉동지방분해', category: 'bodyline', difficulty: 'medium', duration: '1시간', recovery: '즉시' },
          { id: 'coolsculpting', name: '쿨스컬프팅', category: 'bodyline', difficulty: 'medium', duration: '1-2시간', recovery: '즉시' },
          { id: 'emsculpt', name: 'Emsculpt', category: 'bodyline', difficulty: 'low', duration: '30분', recovery: '즉시' }
        ]
      },
      
      skin_treatments: {
        id: 'skin_treatments',
        name: '피부관리',
        treatments: [
          // 필링/스킨케어 (확장)
          { id: 'chemical_peel', name: '화학적 필링', category: 'skin', difficulty: 'medium', duration: '45분-1시간', recovery: '3-7일' },
          { id: 'glycolic_acid_peel', name: '글리콜릭 필링', category: 'skin', difficulty: 'medium', duration: '30-45분', recovery: '3-5일' },
          { id: 'salicylic_acid_peel', name: '살리실릭 필링', category: 'skin', difficulty: 'medium', duration: '30-45분', recovery: '3-5일' },
          { id: 'tca_peel', name: 'TCA 필링', category: 'skin', difficulty: 'high', duration: '45분-1시간', recovery: '5-7일' },
          { id: 'jessner_peel', name: 'Jessner 필링', category: 'skin', difficulty: 'medium', duration: '45분', recovery: '3-5일' },
          { id: 'lactic_acid_peel', name: '락틱 필링', category: 'skin', difficulty: 'low', duration: '30분', recovery: '1-3일' },
          { id: 'mandelic_acid_peel', name: '만델릭 필링', category: 'skin', difficulty: 'low', duration: '30분', recovery: '1-3일' },
          { id: 'microdermabrasion', name: '미세박피', category: 'skin', difficulty: 'low', duration: '30-45분', recovery: '1-2일' },
          { id: 'dermaplaning', name: '더마플래닝', category: 'skin', difficulty: 'low', duration: '30분', recovery: '즉시' },
          { id: 'hydrafacial', name: '하이드라페이셜', category: 'skin', difficulty: 'low', duration: '45분', recovery: '즉시' },
          { id: 'aqua_peel', name: '아쿠아필', category: 'skin', difficulty: 'low', duration: '45분', recovery: '즉시' },
          
          // 니들링/스크루버 (확장)
          { id: 'microneedling', name: '마이크로니들링', category: 'skin', difficulty: 'medium', duration: '45분-1시간', recovery: '2-3일' },
          { id: 'rf_microneedling', name: 'RF 마이크로니들링', category: 'skin', difficulty: 'medium', duration: '1시간', recovery: '3-5일' },
          { id: 'prp_facial', name: 'PRP 페이셜', category: 'skin', difficulty: 'medium', duration: '1시간', recovery: '2-3일' },
          { id: 'vampire_facial', name: '뱀파이어 페이셜', category: 'skin', difficulty: 'medium', duration: '1시간', recovery: '3-5일' },
          { id: 'prf_facial', name: 'PRF 페이셜', category: 'skin', difficulty: 'medium', duration: '1시간', recovery: '2-3일' },
          { id: 'dermaroller', name: '더마롤러', category: 'skin', difficulty: 'low', duration: '30분', recovery: '1-2일' },
          { id: 'dermastamp', name: '더마스탬프', category: 'skin', difficulty: 'low', duration: '30분', recovery: '1-2일' },
          
          // 고급 스킨케어 (신규)
          { id: 'oxygen_facial', name: '산소 페이셜', category: 'skin', difficulty: 'low', duration: '1시간', recovery: '즉시' },
          { id: 'led_light_therapy', name: 'LED 광치료', category: 'skin', difficulty: 'low', duration: '30분', recovery: '즉시' },
          { id: 'galvanic_facial', name: '갈바닉 페이셜', category: 'skin', difficulty: 'low', duration: '1시간', recovery: '즉시' },
          { id: 'collagen_mask', name: '콜라겐 마스크', category: 'skin', difficulty: 'low', duration: '30분', recovery: '즉시' },
          { id: 'gold_facial', name: '골드 페이셜', category: 'skin', difficulty: 'low', duration: '1시간', recovery: '즉시' },
          { id: 'caviar_facial', name: '캐비어 페이셜', category: 'skin', difficulty: 'low', duration: '1시간', recovery: '즉시' },
          
          // 기타 치료 (확장)
          { id: 'cryotherapy', name: '냉동치료', category: 'skin', difficulty: 'low', duration: '15-30분', recovery: '1-2주' },
          { id: 'thread_lift', name: '실리프팅', category: 'face', difficulty: 'high', duration: '1-2시간', recovery: '1-2주' },
          { id: 'pdo_thread', name: 'PDO 실', category: 'face', difficulty: 'high', duration: '1-2시간', recovery: '1-2주' },
          { id: 'cog_thread', name: 'COG 실', category: 'face', difficulty: 'high', duration: '1-2시간', recovery: '1-2주' },
          { id: 'mint_thread', name: '민트 실', category: 'face', difficulty: 'medium', duration: '1시간', recovery: '1주' }
        ]
      },
      
      body_treatments: {
        id: 'body_treatments',
        name: '바디케어',
        treatments: [
          // 체형관리 (확장)
          { id: 'lymphatic_massage', name: '림프 마사지', category: 'bodyline', difficulty: 'low', duration: '1시간', recovery: '즉시' },
          { id: 'cellulite_treatment', name: '셀룰라이트 치료', category: 'bodyline', difficulty: 'medium', duration: '1시간', recovery: '즉시' },
          { id: 'stretch_mark_treatment', name: '튼살 치료', category: 'bodyline', difficulty: 'medium', duration: '45분-1시간', recovery: '2-3일' },
          { id: 'scar_treatment', name: '흉터 치료', category: 'skin', difficulty: 'medium', duration: '30분-1시간', recovery: '3-5일' },
          { id: 'body_wrapping', name: '바디 랩핑', category: 'bodyline', difficulty: 'low', duration: '1-1.5시간', recovery: '즉시' },
          { id: 'endermologie', name: '엔더몰로지', category: 'bodyline', difficulty: 'low', duration: '45분', recovery: '즉시' },
          { id: 'cavitation', name: '캐비테이션', category: 'bodyline', difficulty: 'medium', duration: '45분', recovery: '즉시' },
          { id: 'velashape', name: 'VelaShape', category: 'bodyline', difficulty: 'medium', duration: '45분', recovery: '즉시' },
          { id: 'vanquish', name: 'Vanquish', category: 'bodyline', difficulty: 'medium', duration: '45분', recovery: '즉시' },
          { id: 'trusculpt', name: 'TruSculpt', category: 'bodyline', difficulty: 'medium', duration: '1시간', recovery: '즉시' }
        ]
      }
    }
  },

  // 전문 치료 (Specialized Treatments) - 확장
  specialized: {
    id: 'specialized',
    name: '전문치료',
    subcategories: {
      dental_aesthetic: {
        id: 'dental_aesthetic',
        name: '치과 미용',
        treatments: [
          { id: 'teeth_whitening', name: '치아 미백', category: 'teeth', difficulty: 'low', duration: '1-2시간', recovery: '즉시' },
          { id: 'veneers', name: '베니어', category: 'teeth', difficulty: 'medium', duration: '2-3시간', recovery: '1-2일' },
          { id: 'orthodontics', name: '치아 교정', category: 'teeth', difficulty: 'medium', duration: '1-3년', recovery: '점진적' },
          { id: 'dental_implant', name: '임플란트', category: 'teeth', difficulty: 'high', duration: '2-4시간', recovery: '2-4주' },
          { id: 'gum_contouring', name: '잇몸 성형', category: 'teeth', difficulty: 'medium', duration: '1-2시간', recovery: '1-2주' },
          { id: 'invisalign', name: '인비절라인', category: 'teeth', difficulty: 'medium', duration: '1-2년', recovery: '점진적' },
          { id: 'dental_bonding', name: '치아 본딩', category: 'teeth', difficulty: 'low', duration: '1시간', recovery: '즉시' },
          { id: 'dental_crown', name: '치아 크라운', category: 'teeth', difficulty: 'medium', duration: '2-3시간', recovery: '3-5일' }
        ]
      },
      
      permanent_makeup: {
        id: 'permanent_makeup',
        name: '반영구화장',
        treatments: [
          { id: 'eyebrow_tattoo', name: '눈썹 반영구', category: 'face', difficulty: 'medium', duration: '2-3시간', recovery: '1주' },
          { id: 'eyeliner_tattoo', name: '아이라인 반영구', category: 'eye', difficulty: 'medium', duration: '1-2시간', recovery: '1주' },
          { id: 'lip_tattoo', name: '입술 반영구', category: 'mouth', difficulty: 'medium', duration: '2-3시간', recovery: '1-2주' },
          { id: 'scalp_tattoo_permanent', name: '헤어라인 반영구', category: 'hair', difficulty: 'high', duration: '3-4시간', recovery: '1-2주' },
          { id: 'microblading', name: '마이크로블레이딩', category: 'face', difficulty: 'medium', duration: '2-3시간', recovery: '1주' },
          { id: 'powder_brows', name: '파우더 브로우', category: 'face', difficulty: 'medium', duration: '2-3시간', recovery: '1주' },
          { id: 'combo_brows', name: '콤보 브로우', category: 'face', difficulty: 'medium', duration: '2-3시간', recovery: '1주' },
          { id: 'areola_tattoo', name: '유륜 타투', category: 'chest', difficulty: 'medium', duration: '1-2시간', recovery: '1주' }
        ]
      },
      
      wellness: {
        id: 'wellness',
        name: '웰니스',
        treatments: [
          { id: 'oxygen_therapy', name: '산소 치료', category: 'wellness', difficulty: 'low', duration: '30-45분', recovery: '즉시' },
          { id: 'detox_therapy', name: '디톡스 테라피', category: 'wellness', difficulty: 'low', duration: '1-2시간', recovery: '즉시' },
          { id: 'anti_aging_therapy', name: '항노화 치료', category: 'wellness', difficulty: 'medium', duration: '1-2시간', recovery: '즉시' },
          { id: 'stem_cell_therapy', name: '줄기세포 치료', category: 'wellness', difficulty: 'high', duration: '2-3시간', recovery: '1-3일' },
          { id: 'chelation_therapy', name: '킬레이션 치료', category: 'wellness', difficulty: 'medium', duration: '2-3시간', recovery: '즉시' },
          { id: 'ozone_therapy', name: '오존 치료', category: 'wellness', difficulty: 'medium', duration: '1시간', recovery: '즉시' },
          { id: 'peptide_therapy', name: '펩타이드 치료', category: 'wellness', difficulty: 'medium', duration: '30분', recovery: '즉시' },
          { id: 'nad_therapy', name: 'NAD+ 치료', category: 'wellness', difficulty: 'medium', duration: '2-4시간', recovery: '즉시' }
        ]
      },
      
      // 새로운 전문 분야 추가
      regenerative_medicine: {
        id: 'regenerative_medicine',
        name: '재생의학',
        treatments: [
          { id: 'prp_therapy', name: 'PRP 치료', category: 'regen', difficulty: 'medium', duration: '1시간', recovery: '1-2일' },
          { id: 'prf_therapy', name: 'PRF 치료', category: 'regen', difficulty: 'medium', duration: '1시간', recovery: '1-2일' },
          { id: 'exosome_therapy', name: '엑소좀 치료', category: 'regen', difficulty: 'high', duration: '1-2시간', recovery: '1-2일' },
          { id: 'growth_factor_therapy', name: '성장인자 치료', category: 'regen', difficulty: 'medium', duration: '1시간', recovery: '1-2일' },
          { id: 'adipose_stem_cell', name: '지방 줄기세포', category: 'regen', difficulty: 'high', duration: '2-3시간', recovery: '3-5일' },
          { id: 'bone_marrow_stem_cell', name: '골수 줄기세포', category: 'regen', difficulty: 'very_high', duration: '3-4시간', recovery: '1주' },
          { id: 'micro_fat_grafting', name: '마이크로 지방이식', category: 'regen', difficulty: 'high', duration: '2-3시간', recovery: '1-2주' },
          { id: 'svf_therapy', name: 'SVF 치료', category: 'regen', difficulty: 'high', duration: '2-3시간', recovery: '3-5일' }
        ]
      }
    }
  }
};

// 부위별 고민과 추천 치료법 매칭 시스템 (대폭 확장)
export const symptomTreatmentMapping = {
  // 얼굴 부위 매칭 (확장)
  '볼살': [
    'botox_jaw', 'fat_dissolving_injection', 'liposuction', 'buccal_fat_removal',
    'kybella', 'phosphatidylcholine', 'deoxycholic_acid', 'thread_lift',
    'ultherapy', 'doublo_hifu', 'thermage_flx', 'inmode'
  ],
  '턱살/이중턱': [
    'fat_dissolving_injection', 'liposuction', 'neck_lift', 'chin_augmentation',
    'kybella', 'deoxycholic_acid', 'phosphatidylcholine', 'thread_lift',
    'ultherapy', 'doublo_hifu', 'coolsculpting', 'cavitation'
  ],
  '사각턱': [
    'botox_jaw', 'jaw_reduction', 'v_line_surgery', 'facial_contouring',
    'double_jaw_surgery', 'three_jaw_surgery', 'filler_jawline',
    'thermage_flx', 'ultherapy'
  ],
  '이마볼륨/납작이마': [
    'filler_forehead', 'forehead_augmentation', 'fat_grafting',
    'forehead_reduction', 'hairline_lowering', 'restylane',
    'juvederm', 'radiesse', 'sculptra'
  ],
  '관자놀이꺼짐': [
    'filler_temple', 'fat_grafting', 'temple_augmentation',
    'restylane', 'juvederm', 'radiesse', 'micro_fat_grafting'
  ],
  '광대크기': [
    'cheekbone_reduction', 'filler_cheek', 'facial_contouring',
    'v_line_surgery', 'malar_implant'
  ],
  '볼꺼짐': [
    'filler_cheek', 'fat_grafting', 'malar_implant',
    'restylane', 'juvederm', 'radiesse', 'sculptra',
    'micro_fat_grafting', 'prp_therapy'
  ],
  '볼처짐': [
    'thread_lift', 'facelift', 'rf_microneedling', 'mini_facelift',
    'ultherapy', 'thermage_flx', 'doublo_hifu', 'xerf',
    'pdo_thread', 'cog_thread', 'mint_thread'
  ],

  // 눈 부위 매칭 (확장)
  '겹쌍꺼풀': [
    'double_eyelid', 'thread_lift', 'ptosis_correction',
    'mini_facelift', 'brow_lift'
  ],
  '눈밑꺼짐': [
    'filler_under_eye', 'under_eye_fat_repositioning', 'under_eye_fat_removal',
    'restylane', 'juvederm', 'prp_facial', 'prf_facial',
    'micro_fat_grafting', 'exosome_therapy'
  ],
  '눈길이': [
    'epicanthoplasty', 'lateral_canthoplasty', 'double_eyelid',
    'ptosis_correction', 'brow_lift'
  ],
  '눈두덩이꺼짐': [
    'filler_forehead', 'brow_lift', 'forehead_augmentation',
    'fat_grafting', 'restylane', 'juvederm'
  ],
  '졸린눈': [
    'ptosis_correction', 'double_eyelid', 'brow_lift',
    'epicanthoplasty', 'lateral_canthoplasty'
  ],
  '눈밑지방': [
    'under_eye_fat_removal', 'under_eye_fat_repositioning',
    'filler_under_eye', 'thread_lift', 'rf_microneedling'
  ],
  '다크서클': [
    'filler_under_eye', 'laser_treatment', 'prp_facial', 'prf_facial',
    'ipl_photorejuvenation', 'nd_yag_laser', 'vitamin_injection',
    'mesotherapy', 'exosome_therapy', 'led_light_therapy'
  ],

  // 코 부위 매칭 (확장)
  '매부리코': [
    'rhinoplasty', 'revision_rhinoplasty', 'functional_rhinoplasty'
  ],
  '넓은코': [
    'rhinoplasty', 'alar_reduction', 'nose_tip_plasty',
    'revision_rhinoplasty', 'functional_rhinoplasty'
  ],
  '복코': [
    'rhinoplasty', 'nose_tip_plasty', 'functional_rhinoplasty',
    'revision_rhinoplasty'
  ],
  '낮은코': [
    'rhinoplasty', 'filler_nose', 'nose_tip_plasty',
    'restylane', 'juvederm', 'radiesse'
  ],
  '긴코': [
    'rhinoplasty', 'nose_tip_plasty', 'functional_rhinoplasty'
  ],
  '휜코': [
    'rhinoplasty', 'deviated_septum', 'functional_rhinoplasty',
    'revision_rhinoplasty'
  ],

  // 피부 부위 매칭 (대폭 확장)
  '피부처짐': [
    'thread_lift', 'rf_microneedling', 'ultrasound_therapy', 'facelift',
    'ultherapy', 'thermage_flx', 'doublo_hifu', 'xerf', 'oligio',
    'inmode', 'secret_rf', 'infini', 'pdo_thread', 'cog_thread',
    'mini_facelift', 'neck_lift'
  ],
  '피부탄력': [
    'rf_microneedling', 'microneedling', 'fractional_laser', 'thread_lift',
    'thermage_flx', 'ultherapy', 'doublo_hifu', 'secret_rf', 'infini',
    'prp_facial', 'vampire_facial', 'prf_facial', 'exosome_therapy',
    'collagen_injection', 'sculptra', 'led_light_therapy'
  ],
  '팔자주름': [
    'filler_nasolabial', 'botox_forehead', 'thread_lift', 'facelift',
    'restylane', 'juvederm', 'radiesse', 'sculptra',
    'rf_microneedling', 'fractional_laser', 'mini_facelift'
  ],
  '피부재생': [
    'prp_facial', 'vampire_facial', 'microneedling', 'prf_facial',
    'exosome_therapy', 'growth_factor_therapy', 'stem_cell_therapy',
    'rf_microneedling', 'fractional_laser', 'co2_laser_resurfacing',
    'erbium_laser', 'mesotherapy', 'dermaplaning'
  ],
  '화이트닝': [
    'whitening_injection', 'ipl_photorejuvenation', 'chemical_peel',
    'glutathione_injection', 'vitamin_injection', 'q_switched_laser',
    'picosecond_laser', 'picocare', 'picoplus', 'discovery_pico',
    'glycolic_acid_peel', 'mandelic_acid_peel'
  ],
  '모공': [
    'fractional_laser', 'microneedling', 'chemical_peel', 'rf_microneedling',
    'co2_laser_resurfacing', 'erbium_laser', 'secret_rf', 'infini',
    'glycolic_acid_peel', 'salicylic_acid_peel', 'tca_peel',
    'microdermabrasion', 'hydrafacial', 'aqua_peel'
  ],
  '기미': [
    'picosecond_laser', 'q_switched_laser', 'ipl_photorejuvenation',
    'picocare', 'picoplus', 'discovery_pico', 'melasma_laser',
    'chemical_peel', 'glycolic_acid_peel', 'kojic_acid_peel',
    'whitening_injection', 'glutathione_injection'
  ],
  '여드름': [
    'acne_laser', 'chemical_peel', 'ipl_photorejuvenation',
    'salicylic_acid_peel', 'glycolic_acid_peel', 'led_light_therapy',
    'rf_microneedling', 'fractional_laser', 'nd_yag_laser',
    'hydrafacial', 'oxygen_facial'
  ],
  '여드름흉터': [
    'fractional_laser', 'microneedling', 'co2_laser_resurfacing',
    'rf_microneedling', 'secret_rf', 'infini', 'erbium_laser',
    'tca_peel', 'vampire_facial', 'prp_facial', 'scar_laser'
  ],
  '주름/잔주름': [
    'botox_forehead', 'filler_nasolabial', 'fractional_laser',
    'thermage_flx', 'ultherapy', 'rf_microneedling', 'thread_lift',
    'chemical_peel', 'prp_facial', 'vampire_facial'
  ],
  '보습': [
    'hydrafacial', 'aqua_peel', 'oxygen_facial', 'collagen_mask',
    'mesotherapy', 'prp_facial', 'vampire_facial', 'led_light_therapy',
    'galvanic_facial', 'gold_facial', 'caviar_facial'
  ],

  // 몸매 부위 매칭 (확장)
  '체지방': [
    'liposuction', 'coolsculpting', 'fat_dissolving_injection',
    'cryolipolysis', 'cavitation', 'radiofrequency_body',
    'ultrasound_therapy', 'vanquish', 'trusculpt', 'emsculpt',
    'endermologie', 'velashape', 'lymphatic_massage'
  ],
  '뱃살': [
    'liposuction', 'tummy_tuck', 'coolsculpting', 'cryolipolysis',
    'cavitation', 'emsculpt', 'vanquish', 'trusculpt',
    'abdominal_etching', 'radiofrequency_body'
  ],
  '허벅지살': [
    'liposuction', 'thigh_lift', 'coolsculpting', 'cryolipolysis',
    'cavitation', 'radiofrequency_body', 'endermologie',
    'velashape', 'lymphatic_massage'
  ],
  '팔뚝살': [
    'liposuction', 'arm_lift', 'coolsculpting', 'cryolipolysis',
    'cavitation', 'radiofrequency_body', 'endermologie'
  ],
  '종아리알/종아리근육': [
    'botox_calf', 'calf_reduction'
  ],
  '샐룰라이트': [
    'cellulite_treatment', 'radiofrequency_body', 'endermologie',
    'velashape', 'cavitation', 'lymphatic_massage', 'body_wrapping'
  ],
  '붓기': [
    'lymphatic_massage', 'radiofrequency_body', 'endermologie',
    'body_wrapping', 'ultrasound_therapy'
  ],

  // 가슴 부위 매칭 (확장)
  '작은가슴': [
    'breast_augmentation', 'fat_grafting', 'breast_fat_grafting',
    'hybrid_breast_augmentation', 'micro_fat_grafting'
  ],
  '큰가슴': [
    'breast_reduction'
  ],
  '가슴처짐': [
    'breast_lift', 'breast_augmentation', 'hybrid_breast_augmentation',
    'breast_fat_grafting'
  ],
  '짝가슴/가슴비대칭': [
    'breast_augmentation', 'fat_grafting', 'breast_revision',
    'hybrid_breast_augmentation', 'tuberous_breast_correction'
  ],
  '여유증': [
    'gynecomastia', 'liposuction'
  ],

  // 모발 부위 매칭 (확장)
  '탈모': [
    'hair_transplant_fue', 'hair_transplant_fut', 'prp_facial',
    'mesotherapy', 'led_light_therapy', 'growth_factor_therapy',
    'exosome_therapy', 'stem_cell_therapy'
  ],
  '헤어라인/넓은이마': [
    'hairline_lowering', 'hair_transplant_fue', 'hairline_lowering_surgery',
    'forehead_reduction', 'scalp_tattoo'
  ],
  '헤어라인정리': [
    'laser_hair_removal', 'hairline_lowering', 'diode_laser',
    'alexandrite_laser', 'soprano_titanium'
  ],

  // 신규 추가 부위별 매칭
  '입술': [
    'filler_lips', 'lip_augmentation_surgery', 'cupid_bow_lip_surgery',
    'restylane', 'juvederm', 'botox_lip_flip', 'lip_tattoo'
  ],
  '잇몸라인': [
    'gummy_smile_correction', 'smile_lift_surgery', 'botox_jaw'
  ],
  '목주름': [
    'neck_lift', 'botox_neck_bands', 'thread_lift', 'ultherapy',
    'thermage_flx', 'rf_microneedling'
  ],
  '손등': [
    'filler_hand', 'laser_treatment', 'ipl_photorejuvenation',
    'age_spot_laser', 'chemical_peel'
  ],
  '다한증': [
    'botox_hyperhidrosis'
  ],
  '흉터': [
    'scar_treatment', 'scar_laser', 'fractional_laser',
    'co2_laser_resurfacing', 'microneedling', 'prp_facial'
  ],
  '튼살': [
    'stretch_mark_treatment', 'fractional_laser', 'rf_microneedling',
    'microneedling', 'prp_facial'
  ],
  '타투제거': [
    'tattoo_removal_laser', 'picosecond_laser', 'q_switched_laser',
    'picocare', 'picoplus', 'discovery_pico'
  ],
  '혈관': [
    'vascular_laser', 'ipl_photorejuvenation', 'nd_yag_laser'
  ],
  '주근깨': [
    'freckle_removal_laser', 'picosecond_laser', 'q_switched_laser',
    'ipl_photorejuvenation', 'chemical_peel'
  ],
  '노인성반점': [
    'age_spot_laser', 'picosecond_laser', 'q_switched_laser',
    'ipl_photorejuvenation', 'chemical_peel'
  ]
};

// 치료 유형별 추천 시스템
export const treatmentTypeRecommendations = {
  '시술': {
    primary: [
      'injectables',           // 주사치료 (보톡스, 필러 등)
      'laser_treatments',      // 레이저 치료
      'energy_based_treatments', // 에너지 기반 치료 (고주파, 초음파)
      'skin_treatments'        // 피부관리 (필링, 스킨케어)
    ],
    fallback: [
      'body_treatments',       // 바디케어
      'permanent_makeup',      // 반영구화장
      'regenerative_medicine', // 재생의학
      'wellness'               // 웰니스
    ]
  },
  '수술': {
    primary: [
      'facial_surgery',        // 안면성형
      'body_surgery',          // 몸매성형
      'hair_surgery'           // 모발이식
    ],
    fallback: [
      'dental_aesthetic'       // 치과 미용
    ]
  },
  '둘 다 찾고 있어요': {
    primary: [
      'injectables',           // 주사치료
      'facial_surgery',        // 안면성형
      'laser_treatments',      // 레이저 치료
      'energy_based_treatments', // 에너지 기반 치료
      'body_surgery'           // 몸매성형
    ],
    fallback: [
      'skin_treatments',       // 피부관리
      'body_treatments',       // 바디케어
      'hair_surgery',          // 모발이식
      'dental_aesthetic',      // 치과 미용
      'permanent_makeup',      // 반영구화장
      'regenerative_medicine', // 재생의학
      'wellness'               // 웰니스
    ]
  }
};

// 난이도별 색상 코딩
export const difficultyColors = {
  'low': '#10B981',      // 초록색 - 쉬움
  'medium': '#F59E0B',   // 주황색 - 보통
  'high': '#EF4444',     // 빨간색 - 어려움
  'very_high': '#7C2D12' // 진한 빨간색 - 매우 어려움
};

// 회복 기간별 색상 코딩
export const recoveryColors = {
  '즉시': '#10B981',
  '1-2일': '#84CC16',
  '3-5일': '#F59E0B',
  '1주': '#F59E0B',
  '1-2주': '#EF4444',
  '2-3주': '#EF4444',
  '3-4주': '#DC2626',
  '4-6주': '#7C2D12',
  '6-8주': '#7C2D12'
};

export default {
  treatmentCategories,
  symptomTreatmentMapping,
  treatmentTypeRecommendations,
  difficultyColors,
  recoveryColors
}; 