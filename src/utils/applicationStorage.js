// ========================================
// localStorage 헬퍼 - 지원서 데이터 관리
// ========================================

const STORAGE_KEY = 'likelion_application_form';

/**
 * localStorage에서 지원서 데이터 불러오기
 * @returns {Object} 저장된 폼 데이터 또는 기본값
 */
export const loadApplicationData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('[ApplicationStorage] 데이터 로드 실패:', error);
  }

  // 기본 값
  return {
    name: '',
    department: '',
    contact: '',
    studentNo: '',
    techStack: [],
    applyPart: '',
    motivation: '',
    currentStep: 1,
  };
};

/**
 * localStorage에 지원서 데이터 저장
 * @param {Object} data - 저장할 폼 데이터
 */
export const saveApplicationData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('[ApplicationStorage] 데이터 저장 실패:', error);
  }
};

/**
 * localStorage에서 지원서 데이터 삭제 (제출 완료 후)
 */
export const clearApplicationData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('[ApplicationStorage] 데이터 삭제 실패:', error);
  }
};

export default {
  load: loadApplicationData,
  save: saveApplicationData,
  clear: clearApplicationData,
};
