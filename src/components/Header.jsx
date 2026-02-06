import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

// 네비게이션 항목과 앵커 ID 매핑
const NAV_ITEMS = [
  { label: '소개', id: 'about' },
  { label: '활동 이력', id: 'history' },
  { label: '갤러리', id: 'gallery' },
  { label: '연락처', id: 'contact' },
];

const Header = ({ isVisible }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // 스크롤 감지: 헤더 배경 변화
  useEffect(() => {
    if (!isVisible) return;

    const handleScroll = () => {
      // 인트로 스페이서 이후 기준 (약 150vh 이후)
      const scrollThreshold = window.innerHeight * 1.6;
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 초기 상태 설정

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  // 현재 활성 섹션 감지
  useEffect(() => {
    if (!isVisible) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // 각 섹션 관찰
    NAV_ITEMS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [isVisible]);

  // 네비 클릭 시 부드러운 스크롤
  const handleNavClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = 70;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight - 20;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // 인트로 완료 전에는 완전히 렌더링하지 않음
  if (!isVisible) {
    return null;
  }

  return (
    <motion.header
      className={`header ${isScrolled ? 'header--scrolled' : ''}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* 좌측: 로고 + 텍스트 */}
      <div className="header-left">
        <Logo className="header-logo" />
        <span className="header-title">멋쟁이사자처럼 한서대</span>
      </div>
      
      {/* 우측: 네비게이션 */}
      <nav className="header-nav">
        {NAV_ITEMS.map(({ label, id }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`header-nav-link ${activeSection === id ? 'header-nav-link--active' : ''}`}
            onClick={(e) => handleNavClick(e, id)}
          >
            {label}
          </a>
        ))}
      </nav>
    </motion.header>
  );
};

export default Header;
