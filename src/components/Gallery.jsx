import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

// ========================================
// Google Drive 링크 변환 유틸리티
// ========================================

/**
 * Google Drive 공유 링크를 직접 이미지 URL로 변환
 * 지원 형식:
 *   a) https://drive.google.com/file/d/<FILE_ID>/view?...
 *   b) https://drive.google.com/open?id=<FILE_ID>
 *   c) https://drive.google.com/uc?export=view&id=<FILE_ID>
 *   d) FILE_ID만 (영문숫자, -, _ 로만 구성된 문자열)
 * 
 * @param {string} rawLink - 원본 Google Drive 링크 또는 FILE_ID
 * @returns {{ url: string, valid: boolean }} - 변환된 URL과 유효성
 */
const convertDriveLink = (rawLink) => {
  if (!rawLink || typeof rawLink !== 'string') {
    console.warn('[Gallery] 유효하지 않은 링크:', rawLink);
    return { url: null, valid: false };
  }

  const trimmed = rawLink.trim();
  let fileId = null;

  // 패턴 1: /file/d/{FILE_ID}/view
  const pattern1 = /\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match1 = trimmed.match(pattern1);
  if (match1) {
    fileId = match1[1];
  }

  // 패턴 2: open?id={FILE_ID} 또는 uc?export=view&id={FILE_ID}
  if (!fileId) {
    const pattern2 = /[?&]id=([a-zA-Z0-9_-]+)/;
    const match2 = trimmed.match(pattern2);
    if (match2) {
      fileId = match2[1];
    }
  }

  // 패턴 3: FILE_ID만 (알파벳, 숫자, -, _ 로만 구성, 최소 10자 이상)
  if (!fileId && /^[a-zA-Z0-9_-]{10,}$/.test(trimmed)) {
    fileId = trimmed;
  }

  if (fileId) {
    // lh3.googleusercontent.com 직접 링크 사용 (더 안정적)
    return {
      url: `https://lh3.googleusercontent.com/d/${fileId}`,
      valid: true,
    };
  }

  console.warn('[Gallery] FILE_ID 추출 실패:', rawLink);
  return { url: null, valid: false };
};

// ========================================
// 원본 Google Drive 링크 배열
// ========================================
const RAW_GALLERY_LINKS = [
  'https://drive.google.com/file/d/1k4nG0xWjgE3LINfsEi6m417zM3Jitnr1/view',
  'https://drive.google.com/file/d/1tNgApbwszPyGIxkNA56XZWXGxReHHyBm/view',
  'https://drive.google.com/file/d/1a8Ny5Eb5VCEKj6tZ1eKK8uizrrYgXGZA/view',
  'https://drive.google.com/file/d/12PrBYLryxU1Y8Tb-sr2L2ihSAuYS1gFh/view',
  'https://drive.google.com/file/d/1dg4hf-Gf3718MFMuHrF2VkUrD16uoh_P/view',
  'https://drive.google.com/file/d/1lxgvqCyNBW9Yw7-cJmYaMPRu-azC0Noz/view',
  'https://drive.google.com/file/d/1R0FWEXaJ4WxD71qoBHKXamqTNEjrs1aG/view',
  'https://drive.google.com/file/d/1EwmtFeUoLIMCAKg4Y_HWY0ajH1JWTRsi/view',
  'https://drive.google.com/file/d/177p_b9PpEKLT14r-Be0Q95jafsq-xke3/view',
  'https://drive.google.com/file/d/1n8Y94j1iQo1wpPnjL5sFiHNtTYKLNNYK/view',
  'https://drive.google.com/file/d/1GBYIHpevvPpX9f_hBQK6HMSRBo2NdHqd/view',
  'https://drive.google.com/file/d/1hVmXyGryyret1naKDnxA6cVCQlIFnwtw/view',
];

// 변환된 이미지 배열 생성
const GALLERY_IMAGES = RAW_GALLERY_LINKS.map((link, index) => {
  const result = convertDriveLink(link);
  return {
    id: index + 1,
    url: result.url,
    valid: result.valid,
    alt: `활동 사진 ${index + 1}`,
  };
});

// ========================================
// 이미지 로드 실패 플레이스홀더 컴포넌트
// ========================================
const ImagePlaceholder = ({ alt }) => (
  <div className="gallery-placeholder-card">
    <div className="gallery-placeholder-icon">📷</div>
    <p className="gallery-placeholder-text">이미지 로드 실패</p>
    <p className="gallery-placeholder-alt">{alt}</p>
  </div>
);

// ========================================
// 갤러리 카드 컴포넌트
// ========================================
const GalleryCard = ({ image, onError, onClick }) => {
  const [hasError, setHasError] = useState(false);

  const handleImageError = useCallback(() => {
    if (!hasError) {
      console.warn(`[Gallery] 이미지 로드 실패: ${image.alt} (${image.url})`);
      setHasError(true);
      if (onError) onError(image.id);
    }
  }, [hasError, image, onError]);

  // 유효하지 않은 URL이거나 에러 발생 시 플레이스홀더 표시
  if (!image.valid || !image.url || hasError) {
    return <ImagePlaceholder alt={image.alt} />;
  }

  return (
    <div 
      className="gallery-card-inner gallery-card-clickable"
      onClick={() => onClick && onClick(image)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick && onClick(image)}
    >
      <img
        src={image.url}
        alt={image.alt}
        loading="lazy"
        onError={handleImageError}
      />
    </div>
  );
};

// ========================================
// Gallery 메인 컴포넌트
// ========================================
const Gallery = () => {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const firstCardRef = useRef(null);
  
  // 오버레이 표시 여부 (갤러리 섹션 내부 + progress < 0.75 일 때만)
  const [showOverlay, setShowOverlay] = useState(false);
  
  // 이미지 모달 상태
  const [selectedImage, setSelectedImage] = useState(null);

  // 모달 열기/닫기
  const openImageModal = useCallback((image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeImageModal = useCallback(() => {
    setSelectedImage(null);
    document.body.style.overflow = '';
  }, []);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedImage) {
        closeImageModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, closeImageModal]);

  // 그리드 1번 카드의 stage-local 좌표 (실시간 계산)
  const [card1Position, setCard1Position] = useState({
    // 퍼센트 기준 (stage 기준)
    leftPercent: 0,
    topPercent: 0,
    widthPercent: 25, // 4열 기준 기본값
    heightPercent: 25,
  });

  // 스크롤 진행률 (갤러리 섹션 기준)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // 그리드 1번 카드의 stage-local 좌표 계산
  const updateCard1Position = useCallback(() => {
    if (!stageRef.current || !firstCardRef.current) return;

    const stageRect = stageRef.current.getBoundingClientRect();
    const cardRect = firstCardRef.current.getBoundingClientRect();

    // stage 기준 상대 좌표 (퍼센트로 변환)
    const leftPercent = ((cardRect.left - stageRect.left) / stageRect.width) * 100;
    const topPercent = ((cardRect.top - stageRect.top) / stageRect.height) * 100;
    const widthPercent = (cardRect.width / stageRect.width) * 100;
    const heightPercent = (cardRect.height / stageRect.height) * 100;

    setCard1Position({
      leftPercent,
      topPercent,
      widthPercent,
      heightPercent,
    });
  }, []);

  // 초기 및 리사이즈 시 그리드 1번 카드 좌표 업데이트
  useEffect(() => {
    // 초기 렌더링 후 좌표 계산 (약간의 딜레이)
    const timer = setTimeout(updateCard1Position, 100);

    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', updateCard1Position);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateCard1Position);
    };
  }, [updateCard1Position]);

  // scrollYProgress 변화 감지하여 오버레이 표시 여부 결정
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    // progress가 0~0.75 범위 내일 때만 오버레이 표시
    const shouldShow = latest >= 0 && latest <= 0.75;
    setShowOverlay(shouldShow);
  });

  // ============================================
  // 대표 오버레이 애니메이션 (중앙 → 그리드 1번)
  // ============================================
  // 
  // progress 구간:
  //   0.0 ~ 0.35 : 중앙 고정 (stage 전체 덮음)
  //   0.35 ~ 0.65 : 중앙 → 그리드 1번으로 이동 + 축소
  //   0.55 ~ 0.70 : 페이드 아웃
  //
  // 시작 상태 (progress=0):
  //   - left: 50%, top: 50%, transform: translate(-50%, -50%)
  //   - width: 100%, height: 100%
  //
  // 종료 상태 (progress=0.65+):
  //   - left: card1.leftPercent%, top: card1.topPercent%
  //   - transform: translate(0, 0)
  //   - width: card1.widthPercent%, height: card1.heightPercent%
  // ============================================

  // 위치: 중앙(50%) → 그리드 1번 좌표 (퍼센트 문자열로 변환)
  const heroLeft = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65],
    [50, 50, card1Position.leftPercent],
    { clamp: true }
  );
  const heroLeftPercent = useTransform(heroLeft, (v) => `${v}%`);

  const heroTop = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65],
    [50, 50, card1Position.topPercent],
    { clamp: true }
  );
  const heroTopPercent = useTransform(heroTop, (v) => `${v}%`);

  // translate: -50% → 0 (중앙 anchor → 좌상단 anchor)
  const heroTranslateX = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65],
    [-50, -50, 0],
    { clamp: true }
  );
  const heroTranslateXPercent = useTransform(heroTranslateX, (v) => `${v}%`);

  const heroTranslateY = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65],
    [-50, -50, 0],
    { clamp: true }
  );
  const heroTranslateYPercent = useTransform(heroTranslateY, (v) => `${v}%`);

  // 크기: 100% → 그리드 1번 카드 크기
  const heroWidth = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65],
    [100, 100, card1Position.widthPercent],
    { clamp: true }
  );
  const heroWidthPercent = useTransform(heroWidth, (v) => `${v}%`);

  const heroHeight = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65],
    [100, 100, card1Position.heightPercent],
    { clamp: true }
  );
  const heroHeightPercent = useTransform(heroHeight, (v) => `${v}%`);

  // 불투명도: 페이드 아웃
  const heroOpacity = useTransform(scrollYProgress, [0.55, 0.70], [1, 0]);

  // === 그리드 이미지 애니메이션 ===
  // 그리드 첫 번째 카드 (대표 이미지가 수렴할 위치)
  const firstCardOpacity = useTransform(scrollYProgress, [0.60, 0.75], [0, 1]);
  const firstCardScale = useTransform(scrollYProgress, [0.60, 0.75], [0.9, 1]);
  
  // 나머지 그리드 카드들
  const gridOpacity = useTransform(scrollYProgress, [0.20, 0.50], [0, 1]);
  const gridScale = useTransform(scrollYProgress, [0.20, 0.50], [0.9, 1]);

  // === 타이틀 애니메이션 ===
  const titleOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 1]);

  // 첫 번째 이미지 (대표)
  const heroImage = GALLERY_IMAGES[0];
  // 나머지 이미지들
  const otherImages = GALLERY_IMAGES.slice(1);

  return (
    <section id="gallery" className="gallery-section" ref={containerRef}>
      {/* 스크롤 공간 확보용 래퍼 */}
      <div className="gallery-scroll-container">

        {/* Sticky 컨테이너 */}
        <div className="gallery-sticky">

          {/* A) 갤러리 헤더: 타이틀 + 설명 (항상 중앙, 그리드 위) */}
          <motion.div
            className="gallery-header"
            style={{ opacity: titleOpacity }}
          >
            <h2 className="section-title">갤러리</h2>
            <p className="section-text">우리의 활동 모습을 사진으로 만나보세요.</p>
          </motion.div>

          {/* B) 갤러리 스테이지: 그리드 + 오버레이가 놓일 무대 */}
          <div className="gallery-stage" ref={stageRef}>
            
            {/* 그리드 컨테이너 (최종 상태용) */}
            <div className="gallery-grid">

              {/* 그리드 첫 번째 칸 (대표 이미지 자리) */}
              <motion.div
                ref={firstCardRef}
                className="gallery-card gallery-card-first"
                style={{
                  opacity: firstCardOpacity,
                  scale: firstCardScale,
                }}
              >
                <GalleryCard image={heroImage} onClick={openImageModal} />
              </motion.div>

              {/* 나머지 11개 이미지들 */}
              {otherImages.map((image) => (
                <motion.div
                  key={image.id}
                  className="gallery-card"
                  style={{
                    opacity: gridOpacity,
                    scale: gridScale,
                  }}
                >
                  <GalleryCard image={image} onClick={openImageModal} />
                </motion.div>
              ))}

            </div>

            {/* 대표 이미지 오버레이 (stage 중앙 → 그리드 1번으로 수렴) */}
            {showOverlay && (
              <motion.div
                className="gallery-hero-overlay"
                style={{
                  left: heroLeftPercent,
                  top: heroTopPercent,
                  width: heroWidthPercent,
                  height: heroHeightPercent,
                  x: heroTranslateXPercent,
                  y: heroTranslateYPercent,
                  opacity: heroOpacity,
                }}
              >
                <div className="gallery-hero-card">
                  <GalleryCard image={heroImage} onClick={openImageModal} />
                </div>
              </motion.div>
            )}

          </div>

        </div>
      </div>

      {/* 이미지 확대 모달 */}
      {selectedImage && (
        <div className="gallery-modal-overlay" onClick={closeImageModal}>
          <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>
            <button className="gallery-modal-close" onClick={closeImageModal}>
              ✕
            </button>
            <img 
              src={selectedImage.url} 
              alt={selectedImage.alt}
              className="gallery-modal-image"
            />
            <p className="gallery-modal-caption">{selectedImage.alt}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
