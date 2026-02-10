import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadApplicationData, saveApplicationData, clearApplicationData } from '../utils/applicationStorage';

// ========================================
// 상수 정의
// ========================================

// 기술 스택 선택 옵션
const TECH_STACK_OPTIONS = [
  'Java',
  'Figma',
  'React',
  'Node.js',
  'Python',
  'AWS',
  'Docker',
  'Figma',
  'MySQL',
  'Redis',
  'Adobe Illustrator',
  'Git',
  'TypeScript',
  'Vue.js',
  'HTML/CSS',
  'JavaScript',
];

// 지원 파트 선택 옵션
const APPLY_PART_OPTIONS = [
  { value: '디자인', label: '💡 디자인' },
  { value: '백엔드', label: '💻 백엔드' },
  { value: '프론트엔드', label: '🤝 프론트엔드' },
];

const TOTAL_STEPS = 5;
const API_URL = 'https://api.likelionhsu.kr/api/common/applications';

// ========================================
// Logo 컴포넌트
// ========================================
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

// ========================================
// Step 컴포넌트들
// ========================================

// Step 1: 이름 입력
const Step1Name = ({ formData, updateFormData, onNext }) => {
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!formData.name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }
    setError('');
    onNext();
  };

  return (
    <div className="apply-step">
      <h2 className="apply-step-title">이름을 알려주세요</h2>
      <p className="apply-step-subtitle">지원서에 사용될 이름입니다.</p>

      <div className="apply-input-group">
        <input
          type="text"
          className={`apply-input ${error ? 'apply-input--error' : ''}`}
          placeholder="홍길동"
          value={formData.name}
          onChange={(e) => updateFormData('name', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleNext()}
          autoFocus
        />
        {error && <p className="apply-error">{error}</p>}
      </div>

      <div className="apply-buttons">
        <button className="apply-btn apply-btn--primary" onClick={handleNext}>
          다음
        </button>
      </div>
    </div>
  );
};

// Step 2: 학과 입력
const Step2Department = ({ formData, updateFormData, onPrev, onNext }) => {
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!formData.department.trim()) {
      setError('학과를 입력해주세요.');
      return;
    }
    setError('');
    onNext();
  };

  return (
    <div className="apply-step">
      <h2 className="apply-step-title">학과를 알려주세요</h2>
      <p className="apply-step-subtitle">한서대학교 소속 학과를 입력해주세요.</p>

      <div className="apply-input-group">
        <input
          type="text"
          className={`apply-input ${error ? 'apply-input--error' : ''}`}
          placeholder="항공소프트웨어공학과"
          value={formData.department}
          onChange={(e) => updateFormData('department', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleNext()}
          autoFocus
        />
        {error && <p className="apply-error">{error}</p>}
      </div>

      <div className="apply-buttons">
        <button className="apply-btn apply-btn--secondary" onClick={onPrev}>
          이전
        </button>
        <button className="apply-btn apply-btn--primary" onClick={handleNext}>
          다음
        </button>
      </div>
    </div>
  );
};

// Step 3: 연락처 + 학번 입력
const Step3ContactInfo = ({ formData, updateFormData, onPrev, onNext }) => {
  const [errors, setErrors] = useState({ contact: '', studentNo: '' });

  const handleNext = () => {
    const newErrors = { contact: '', studentNo: '' };

    if (!formData.contact.trim()) {
      newErrors.contact = '연락처를 입력해주세요.';
    }
    if (!formData.studentNo.trim()) {
      newErrors.studentNo = '학번을 입력해주세요.';
    }

    setErrors(newErrors);

    if (!newErrors.contact && !newErrors.studentNo) {
      onNext();
    }
  };

  return (
    <div className="apply-step">
      <h2 className="apply-step-title">연락처와 학번을 알려주세요</h2>
      <p className="apply-step-subtitle">합격 안내를 위해 정확하게 입력해주세요.</p>

      <div className="apply-input-group">
        <label className="apply-label">연락처 (전화번호)</label>
        <input
          type="tel"
          className={`apply-input ${errors.contact ? 'apply-input--error' : ''}`}
          placeholder="010-1234-5678"
          value={formData.contact}
          onChange={(e) => updateFormData('contact', e.target.value)}
        />
        {errors.contact && <p className="apply-error">{errors.contact}</p>}
      </div>

      <div className="apply-input-group">
        <label className="apply-label">학번</label>
        <input
          type="text"
          className={`apply-input ${errors.studentNo ? 'apply-input--error' : ''}`}
          placeholder="20241234"
          value={formData.studentNo}
          onChange={(e) => updateFormData('studentNo', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleNext()}
        />
        {errors.studentNo && <p className="apply-error">{errors.studentNo}</p>}
      </div>

      <div className="apply-buttons">
        <button className="apply-btn apply-btn--secondary" onClick={onPrev}>
          이전
        </button>
        <button className="apply-btn apply-btn--primary" onClick={handleNext}>
          다음
        </button>
      </div>
    </div>
  );
};

// Step 4: 기술 스택 선택
const Step4TechStack = ({ formData, updateFormData, onPrev, onNext }) => {
  const toggleTech = (tech) => {
    const current = formData.techStack || [];
    const updated = current.includes(tech)
      ? current.filter((t) => t !== tech)
      : [...current, tech];
    updateFormData('techStack', updated);
  };

  return (
    <div className="apply-step">
      <h2 className="apply-step-title">자신있는 기술을 선택해주세요</h2>
      <p className="apply-step-subtitle">
        여러 개 선택 가능합니다. 아직 경험이 없다면 건너뛰어도 됩니다.
      </p>

      <div className="apply-chips">
        {TECH_STACK_OPTIONS.map((tech) => (
          <button
            key={tech}
            className={`apply-chip ${
              (formData.techStack || []).includes(tech) ? 'apply-chip--selected' : ''
            }`}
            onClick={() => toggleTech(tech)}
            type="button"
          >
            {tech}
          </button>
        ))}
      </div>

      <div className="apply-selected-info">
        <span>선택: {(formData.techStack || []).length}개</span>
        {(formData.techStack || []).length > 0 && (
          <span className="apply-selected-list">
            {(formData.techStack || []).join(', ')}
          </span>
        )}
      </div>

      <div className="apply-buttons">
        <button className="apply-btn apply-btn--secondary" onClick={onPrev}>
          이전
        </button>
        <button className="apply-btn apply-btn--primary" onClick={onNext}>
          다음
        </button>
      </div>
    </div>
  );
};

// Step 5: 지원 파트 + 지원 동기 + 제출
const Step5Submit = ({ formData, updateFormData, onPrev, onSubmit, isSubmitting }) => {
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!formData.motivation.trim()) {
      setError('지원 동기를 입력해주세요.');
      return;
    }
    setError('');
    onSubmit();
  };

  return (
    <div className="apply-step">
      <h2 className="apply-step-title">마지막 단계입니다!</h2>
      <p className="apply-step-subtitle">지원 파트와 동기를 알려주세요.</p>

      {/* 지원 파트 선택 */}
      <div className="apply-input-group">
        <label className="apply-label">지원 파트 (선택)</label>
        <div className="apply-part-options">
          {APPLY_PART_OPTIONS.map((part) => (
            <button
              key={part.value}
              className={`apply-part-btn ${
                formData.applyPart === part.value ? 'apply-part-btn--selected' : ''
              }`}
              onClick={() => updateFormData('applyPart', part.value)}
              type="button"
            >
              {part.label}
            </button>
          ))}
        </div>
        <p className="apply-hint">선택하지 않으시면 "기획" 파트로 제출됩니다.</p>
      </div>

      {/* 지원 동기 */}
      <div className="apply-input-group">
        <label className="apply-label">지원 동기 *</label>
        <textarea
          className={`apply-textarea ${error ? 'apply-input--error' : ''}`}
          placeholder="멋쟁이사자처럼 한서대에 지원하게 된 동기를 자유롭게 작성해주세요."
          value={formData.motivation}
          onChange={(e) => updateFormData('motivation', e.target.value)}
          rows={6}
        />
        {error && <p className="apply-error">{error}</p>}
      </div>

      <div className="apply-buttons">
        <button
          className="apply-btn apply-btn--secondary"
          onClick={onPrev}
          disabled={isSubmitting}
        >
          이전
        </button>
        <button
          className="apply-btn apply-btn--submit"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? '제출 중...' : '🦁 지원하기'}
        </button>
      </div>
    </div>
  );
};

// ========================================
// 제출 완료 화면
// ========================================
const SubmitSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="apply-success">
      <div className="apply-success-icon">🎉</div>
      <h2 className="apply-success-title">지원이 완료되었습니다!</h2>
      <p className="apply-success-text">
        멋쟁이사자처럼 한서대에 지원해주셔서 감사합니다.
        <br />
        면접 일정은 입력하신 연락처로 안내드리겠습니다.
      </p>
      <button
        className="apply-btn apply-btn--primary"
        onClick={() => navigate('/')}
      >
        홈으로 돌아가기
      </button>
    </div>
  );
};

// ========================================
// ApplyPage 메인 컴포넌트
// ========================================
const ApplyPage = () => {
  // 폼 데이터 상태
  const [formData, setFormData] = useState(() => loadApplicationData());
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = loadApplicationData();
    return saved.currentStep || 1;
  });
  
  // 제출 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [submitError, setSubmitError] = useState('');

  // 폼 데이터 업데이트 함수
  const updateFormData = useCallback((field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      saveApplicationData({ ...updated, currentStep });
      return updated;
    });
  }, [currentStep]);

  // 현재 Step 저장
  useEffect(() => {
    saveApplicationData({ ...formData, currentStep });
  }, [currentStep, formData]);

  // Step 이동 함수
  const goToNextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // 제출 함수
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // applyPart가 비어있으면 "선택안함" 설정
      const applyPart = formData.applyPart?.trim() || '선택안함';
      
      // techStack 배열을 JSON 문자열로 변환
      const techStackString = JSON.stringify(formData.techStack || []);

      const body = {
        studentNo: formData.studentNo.trim(),
        name: formData.name.trim(),
        department: formData.department.trim(),
        contact: formData.contact.trim(),
        applyPart: applyPart,
        techStack: techStackString,
        motivation: formData.motivation.trim(),
      };

      console.log('[ApplyPage] 제출 데이터:', body);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      // 성공 처리
      clearApplicationData();
      setSubmitStatus('success');
    } catch (error) {
      console.error('[ApplyPage] 제출 실패:', error);
      setSubmitError('제출에 실패했습니다. 잠시 후 다시 시도해주세요.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 제출 성공 시 성공 화면 표시
  if (submitStatus === 'success') {
    return (
      <div className="apply-page">
        <div className="apply-container">
          <SubmitSuccess />
        </div>
      </div>
    );
  }

  // 현재 Step 렌더링
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Name
            formData={formData}
            updateFormData={updateFormData}
            onNext={goToNextStep}
          />
        );
      case 2:
        return (
          <Step2Department
            formData={formData}
            updateFormData={updateFormData}
            onPrev={goToPrevStep}
            onNext={goToNextStep}
          />
        );
      case 3:
        return (
          <Step3ContactInfo
            formData={formData}
            updateFormData={updateFormData}
            onPrev={goToPrevStep}
            onNext={goToNextStep}
          />
        );
      case 4:
        return (
          <Step4TechStack
            formData={formData}
            updateFormData={updateFormData}
            onPrev={goToPrevStep}
            onNext={goToNextStep}
          />
        );
      case 5:
        return (
          <Step5Submit
            formData={formData}
            updateFormData={updateFormData}
            onPrev={goToPrevStep}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="apply-page">
      {/* 헤더 */}
      <header className="apply-header">
        <Link to="/" className="apply-header-brand">
          <Logo className="apply-header-logo" />
          <span className="apply-header-title">멋쟁이사자처럼 한서대</span>
        </Link>
      </header>

      <div className="apply-container">
        {/* Progress Indicator */}
        <div className="apply-progress">
          <div className="apply-progress-bar">
            <div
              className="apply-progress-fill"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>
          <div className="apply-progress-text">
            <span>{currentStep} / {TOTAL_STEPS}</span>
          </div>
        </div>

        {/* Step Content */}
        {renderStep()}

        {/* 에러 메시지 */}
        {submitError && (
          <div className="apply-submit-error">
            <p>❌ {submitError}</p>
            <button
              className="apply-btn apply-btn--secondary"
              onClick={() => setSubmitError('')}
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyPage;
