import React, { useState } from 'react';
import './App.css';
import Intro from './components/Intro';
import Header from './components/Header';
import Gallery from './components/Gallery';

// ========================================
// 연락처 정보 상수 (수정 용이하게 분리)
// ========================================
const CONTACT_INFO = {
  email: 'hsu-official@likelion.org',
  instagram: '@likelion_hsu',
  instagramUrl: 'https://www.instagram.com/likelion_hsu/', // 더미 링크
  location: '충청남도 서산시 해미면 한서1로 46, 한서대학교',
  recruitPeriod: '매년 2~3월',
};

function App() {
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = () => {
    setIntroComplete(true);
  };

  return (
    <div className="App">
      {/* 인트로 레이어 (인트로 완료 전까지 표시) */}
      <Intro onIntroComplete={handleIntroComplete} />
      
      {/* 헤더 (인트로 완료 후에만 표시) */}
      <Header isVisible={introComplete} />
      
      {/* 인트로 스크롤 공간 확보 */}
      <div
        className="intro-scroll-spacer"
        style={{
          height: '150vh',
          width: '100%',
        }}
      />
      
      {/* 메인 콘텐츠 (인트로 뒤에 항상 존재, 비쳐 보임) */}
      <main className="main-content">
        
        {/* 소개 섹션 */}
        <section id="about" className="section section-about">
          <div className="section-inner">
            <h2 className="section-title">소개</h2>
            <p className="about-slogan">
              "아이디어를 현실로, 함께 만드는 IT 여정"
            </p>
            
            <div className="about-description">
              <p>
                ”내 아이디어를 내 손으로 실현하자!“라는 가치 아래, 
                전공/비전공자 구분 없이 코딩 교육을 통해 자신의 아이디어를 구현할 수 있는 국내 최대 IT 창업 전국연합동아리 입니다!
              </p>
              <p>
                한서대학교 멋쟁이사자처럼은 매년 새로운 기수를 모집하여
                웹/앱 개발 교육, 팀 프로젝트, 해커톤 참여 등 다양한 활동을 진행합니다.
                열정만 있다면 누구나 참여할 수 있습니다.
              </p>
            </div>

            <div className="about-cards">
              <article className="about-card">
                <div className="about-card-icon">💡</div>
                <h3 className="about-card-title">기획/디자인</h3>
                <p className="about-card-text">
                  FIGMA와 같은 툴을 활용해
                  아이디어를 시각화합니다.
                </p>
              </article>
              <article className="about-card">
                <div className="about-card-icon">💻</div>
                <h3 className="about-card-title">백엔드</h3>
                <p className="about-card-text">
                  서버와 데이터베이스를 구축해
                  안정적인 서비스를 만듭니다.
                </p>
              </article>
              <article className="about-card">
                <div className="about-card-icon">🤝</div>
                <h3 className="about-card-title">프론트엔드</h3>
                <p className="about-card-text">
                  사용자 친화적인 UI를 개발해
                  최적의 경험을 제공합니다.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* 활동 이력 섹션 */}
        <section id="history" className="section section-history">
          <div className="section-inner section-inner-wide">
            <h2 className="section-title">활동 이력</h2>
            <p className="section-text">
              한서대 멋쟁이사자처럼의 발자취를 소개합니다.
            </p>

              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <span className="timeline-date">2026.02</span>
                  <h3 className="timeline-title">
                    멋쟁이사자처럼 한서대 14기 시작
                    <span className="timeline-badge">🚀 시작</span>
                  </h3>
                  
                  <p className="timeline-text">
                    새로운 기수의 시작과 함께 멋쟁이사자처럼 한서대 14기가 출범했습니다!
                  </p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <span className="timeline-date">2025.12</span>
                  <h3 className="timeline-title">
                    교내 동아리 성과 발표제 1등
                    <span className="timeline-badge">🏆 수상</span>
                  </h3>
                  
                  <p className="timeline-text">
                    대외 활동 및 교외 활동 성과를 인정받아 한서대 동아리 성과 발표제에서 1등 수상
                  </p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <span className="timeline-date">2025.11</span>
                  <h3 className="timeline-title">
                    관광데이터 활용 공모전 최우수상 및 우수상 수상
                    <span className="timeline-badge">🏆 수상</span>
                  </h3>
                  <p className="timeline-text">
                    한국관광공사X카카오 주관 관광데이터 활용 공모전에서 344개 팀 중 상위 6팀 선정된 1팀 최우수상, 2팀 우수상 수상
                  </p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <span className="timeline-date">2025.09</span>
                  <h3 className="timeline-title">
                    한서대 축제 데이팅 앱 너랑나랑 출시
                    <span className="timeline-badge">🎉 행사</span>
                  </h3>
                  <p className="timeline-text">
                    교내 축제 기간 동안 사용할 수 있는 데이팅 앱 '너랑나랑' 출시 및 운영(가입자 수 1300명 돌파)
                  </p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <span className="timeline-date">2025.08</span>
                  <h3 className="timeline-title">
                    13기 중앙 해커톤 2차 예선 2팀 진출
                  </h3>
                  <p className="timeline-text">
                    수 많은 대학의 수 많은 팀을 제치고 한서대 멋사 13기에서 2개 팀이 중앙 해커톤 2차 예선에 진출!!
                  </p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <span className="timeline-date">2025.05</span>
                  <h3 className="timeline-title">중앙 아이디어톤 본선 진출</h3>
                  <p className="timeline-text">
                    한서대학교 멋쟁이사자처럼 13기 중앙 아이디어톤 본선 진출, 260개 팀 중 상위 14팀 선정
                  </p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <span className="timeline-date">2025.03</span>
                  <h3 className="timeline-title">
                    한서대 멋사 13기 출범
                    <span className="timeline-badge">🚀 시작</span>
                  </h3>
                  <p className="timeline-text">
                    멋쟁이사자처럼 본부 승인 후 한서대학교 공식 지부 설립
                  </p>
                </div>
              </div>
            </div>
        </section>

        {/* 갤러리 섹션 */}
        <Gallery />

        {/* 연락처 섹션 */}
        <section id="contact" className="section section-contact">
          <div className="contact-container">
            
            {/* 왼쪽: 안내문 + CTA */}
            <div className="contact-left">
              <h2 className="section-title">문의하기</h2>
              <p className="contact-description">
                멋쟁이사자처럼 한서대에 관심이 있으시다면 언제든 연락주세요.
                동아리 활동, 모집 일정, 협업 제안 등 무엇이든 환영합니다.
              </p>
              <p className="contact-recruit-info">
                📅 정기 모집: <strong>{CONTACT_INFO.recruitPeriod}</strong>
              </p>
              
              <div className="contact-cta-group">
                <a 
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="contact-cta contact-cta-primary"
                >
                  📧 메일 보내기
                </a>
              </div>
            </div>

            {/* 오른쪽: 연락처 카드들 */}
            <div className="contact-right">
              <div className="contact-cards">
                
                <div className="contact-card">
                  <div className="contact-card-icon">📧</div>
                  <div className="contact-card-content">
                    <h3 className="contact-card-title">이메일</h3>
                    <a 
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="contact-card-link"
                    >
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="contact-card-icon">📍</div>
                  <div className="contact-card-content">
                    <h3 className="contact-card-title">위치</h3>
                    <p className="contact-card-text">{CONTACT_INFO.location}</p>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="contact-card-icon">📱</div>
                  <div className="contact-card-content">
                    <h3 className="contact-card-title">인스타그램</h3>
                    <a 
                      href={CONTACT_INFO.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-card-link"
                    >
                      {CONTACT_INFO.instagram}
                    </a>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

      </main>

      {/* 푸터 */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">🦁</span>
            <span className="footer-name">멋쟁이사자처럼 한서대학교</span>
          </div>
          <p className="footer-tagline">
            아이디어를 현실로, 함께 만드는 IT 여정
          </p>
          <div className="footer-links">
            <a 
              href={`mailto:${CONTACT_INFO.email}`}
              className="footer-link"
            >
              {CONTACT_INFO.email}
            </a>
            <span className="footer-divider">|</span>
            <a 
              href={CONTACT_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Instagram
            </a>
          </div>
          <p className="footer-copyright">
            © 2026 멋쟁이사자처럼 한서대학교. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
