import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Logo = ({ style, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 557 557"
    className={className}
    style={style}
  >
    <polygon
      fill="currentColor"
      points="42,160 179,246 179,396 377,396 377,341 206,340 206,160"
    />
    <polygon
      fill="currentColor"
      points="377,245 514,160 377,160"
    />
  </svg>
);

const Intro = ({ onIntroComplete }) => {
  const [isComplete, setIsComplete] = useState(false);
  const { scrollY } = useScroll();
  
  // 인트로 구간 높이 (뷰포트 1.5배 정도의 스크롤 거리)
  const introHeight = typeof window !== 'undefined' ? window.innerHeight * 1.5 : 1000;
  
  // 스크롤 진행률 0~1로 정규화
  const scrollProgress = useTransform(scrollY, [0, introHeight], [0, 1]);
  
  // 로고 scale: 1 → 2 (확대)
  const logoScale = useTransform(scrollProgress, [0, 1], [1, 2]);
  
  // 로고 opacity: 1 → 0 (투명화)
  const logoOpacity = useTransform(scrollProgress, [0, 0.8, 1], [1, 0.3, 0]);
  
  // 검정 오버레이 opacity: 1 → 0
  const overlayOpacity = useTransform(scrollProgress, [0, 0.9, 1], [1, 0.2, 0]);
  
  // 스크롤 힌트 opacity: 초반에 빠르게 사라짐
  const hintOpacity = useTransform(scrollProgress, [0, 0.15], [1, 0]);
  
  // 인트로 완료 감지
  useEffect(() => {
    const unsubscribe = scrollProgress.on('change', (value) => {
      if (value >= 1 && !isComplete) {
        setIsComplete(true);
        if (onIntroComplete) {
          onIntroComplete();
        }
      } else if (value < 1 && isComplete) {
        setIsComplete(false);
      }
    });
    
    return () => unsubscribe();
  }, [scrollProgress, isComplete, onIntroComplete]);

  // 인트로 완료 시 숨김
  if (isComplete) {
    return null;
  }

  return (
    <motion.div
      className="intro-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1000,
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* 검정 배경 오버레이 */}
      <motion.div
        className="intro-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#000000',
          opacity: overlayOpacity,
        }}
      />
      
      {/* 중앙 로고 - flex 중앙 정렬 */}
      <motion.div
        className="intro-logo-wrapper"
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          scale: logoScale,
          opacity: logoOpacity,
        }}
      >
        <Logo
          className="intro-logo"
          style={{
            width: '35vmin',
            height: '35vmin',
            color: '#FF770F',
          }}
        />
      </motion.div>
      
      {/* 스크롤 유도 힌트 */}
      <motion.div
        className="intro-scroll-hint"
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: hintOpacity,
          color: '#FF770F',
          fontSize: '14px',
          fontWeight: '300',
          letterSpacing: '2px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span>SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '20px',
            height: '20px',
            borderLeft: '2px solid #FF770F',
            borderBottom: '2px solid #FF770F',
            transform: 'rotate(-45deg)',
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Intro;
