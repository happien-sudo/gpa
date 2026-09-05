/**
 * 고교학점제 학점 이수 및 교육과정 검증 엔진
 */

export const GRADUATION_MIN_CREDITS = 174;
export const CORE_MAX_CREDITS = 81;
export const STEM_MIN_CREDITS = 79; // 과학중점과정 과·수·정 총 이수 기준 (총 교과 174학점의 45% 이상: 78.3 -> 79학점)
export const SCI_ADVANCED_MIN_COUNT = 6; // 과학 진로선택 필수 이수 과목 수

export const REQUIRED_SCI_GENERAL_NAMES = ["물리학", "화학", "생명과학", "지구과학"];

/**
 * 학생의 과목 선택 상태를 진단하여 종합 결과 객체를 반환합니다.
 * @param {Set<string>} selectedIds - 선택된 과목 ID Set
 * @param {Array<Object>} subjects - 전체 과목 목록
 * @param {Object} selectGroups - 선택군 정의 목록
 * @param {boolean} isScienceTrack - 과학중점과정 적용 여부
 * @returns {Object} 진단 결과
 */
export function validateCurriculum(selectedIds, subjects, selectGroups, isScienceTrack = false) {
  let totalCredits = 0;
  let korCredits = 0;
  let mathCredits = 0;
  let engCredits = 0;
  let socCredits = 0;
  let sciCredits = 0;
  let peCredits = 0;
  let artCredits = 0;
  let techEtcCredits = 0;
  let infoCredits = 0;

  const selectedSubjectsList = [];
  const selectedSubjectNames = new Set();

  // 과목군별 선택 과목 카운트
  const groupCounts = {};
  Object.keys(selectGroups).forEach(gid => {
    groupCounts[gid] = 0;
  });

  // 과학중점과정 분석용
  const selectedSciGeneral = new Set();
  let sciAdvancedCount = 0;
  const sciAdvancedSelectedList = [];

  // 선택된 과목 순회 및 집계
  subjects.forEach(sub => {
    if (selectedIds.has(sub.id)) {
      selectedSubjectsList.push(sub);
      selectedSubjectNames.add(sub.name);
      totalCredits += sub.credits;

      // 교과군별 학점 집계
      switch (sub.category) {
        case "국어":
          korCredits += sub.credits;
          break;
        case "수학":
          mathCredits += sub.credits;
          break;
        case "영어":
          engCredits += sub.credits;
          break;
        case "사회":
          socCredits += sub.credits;
          break;
        case "과학":
          sciCredits += sub.credits;
          break;
        case "체육":
          peCredits += sub.credits;
          break;
        case "예술":
          artCredits += sub.credits;
          break;
        default:
          techEtcCredits += sub.credits;
          break;
      }

      // 정보 교과 판별 (독립 학점 집계)
      const isInfoSubject = sub.isInfo || 
        ["정보", "인공지능 기초", "데이터 과학", "소프트웨어와 생활", "프로그래밍", "컴퓨터 과학", "정보과학"].includes(sub.name);
      if (isInfoSubject) {
        infoCredits += sub.credits;
      }

      // 선택군 카운팅
      if (sub.group && groupCounts[sub.group] !== undefined) {
        groupCounts[sub.group]++;
      }

      // 과학중점과정: 물화생지 일반선택 4과목 여부
      if (REQUIRED_SCI_GENERAL_NAMES.includes(sub.name)) {
        selectedSciGeneral.add(sub.name);
      }

      // 과학중점과정: 과학 진로선택 (또는 융합선택 심화 과목)
      const isSciElective = sub.category === "과학" && 
        (sub.isSciAdvanced || sub.subjectType === "진로선택" || sub.subjectType === "융합선택") && 
        !REQUIRED_SCI_GENERAL_NAMES.includes(sub.name);

      if (isSciElective) {
        sciAdvancedCount++;
        sciAdvancedSelectedList.push(sub.name);
      }
    }
  });

  // 기초 교과 합계 (국어 + 영어 + 수학)
  const coreCredits = korCredits + mathCredits + engCredits;
  const corePercentage = totalCredits > 0 ? ((coreCredits / totalCredits) * 100).toFixed(1) : 0;

  // 과학중점과정 합계 (과학 + 수학 + 정보)
  const stemTotalCredits = sciCredits + mathCredits + infoCredits;
  const stemPercentage = totalCredits > 0 ? ((stemTotalCredits / totalCredits) * 100).toFixed(1) : 0;

  // 물화생지 필수 이수 현황
  const missingSciGeneral = REQUIRED_SCI_GENERAL_NAMES.filter(name => !selectedSciGeneral.has(name));
  const sciGeneralCompleted = missingSciGeneral.length === 0;

  // 과학 진로선택 6과목 충족 현황
  const sciAdvancedCompleted = sciAdvancedCount >= SCI_ADVANCED_MIN_COUNT;

  // 선택군별 검증
  const groupStatus = {};
  let hasGroupOverflow = false;
  let hasGroupUnderflow = false;

  Object.entries(selectGroups).forEach(([gid, group]) => {
    const count = groupCounts[gid] || 0;
    const isCompleted = count === group.max;
    const isOver = count > group.max;
    const isUnder = count < group.max;

    if (isOver) hasGroupOverflow = true;
    if (isUnder) hasGroupUnderflow = true;

    groupStatus[gid] = {
      count,
      max: group.max,
      isCompleted,
      isOver,
      isUnder,
      remaining: group.max - count
    };
  });

  // 판정 규칙
  const isTotalCreditValid = totalCredits >= GRADUATION_MIN_CREDITS;
  const isCoreCreditValid = coreCredits <= CORE_MAX_CREDITS;
  const isStemCreditValid = stemTotalCredits >= STEM_MIN_CREDITS;

  let isScienceTrackValid = true;
  if (isScienceTrack) {
    isScienceTrackValid = isStemCreditValid && sciGeneralCompleted && sciAdvancedCompleted;
  }

  // 이슈 목록 및 조언 생성
  const issues = [];
  const warnings = [];
  const successes = [];

  // 1. 졸업 총 학점 검증
  if (!isTotalCreditValid) {
    issues.push({
      type: "total_under",
      title: "총 이수 학점 부족",
      message: `교과 총 이수 학점이 기준(174학점)보다 ${GRADUATION_MIN_CREDITS - totalCredits}학점 부족합니다. (현재: ${totalCredits}학점)`
    });
  } else {
    successes.push({
      type: "total_ok",
      title: "총 이수 학점 충족",
      message: `졸업 기준 학점(174학점)을 충족하였습니다. (현재: ${totalCredits}학점)`
    });
  }

  // 2. 국영수 제한 검증
  if (!isCoreCreditValid) {
    issues.push({
      type: "core_overflow",
      title: "국·영·수 이수 학점 초과",
      message: `국어·영어·수학 합산이 제한(81학점)보다 ${coreCredits - CORE_MAX_CREDITS}학점 초과했습니다. (현재: ${coreCredits}학점)`
    });
  } else {
    successes.push({
      type: "core_ok",
      title: "국·영·수 학점 적정",
      message: `국어·영어·수학 합산이 제한(81학점 이하) 내에 있어 안전합니다. (현재: ${coreCredits}학점)`
    });
  }

  // 3. 선택군 선택 수 초과/미달 검증
  if (hasGroupOverflow) {
    issues.push({
      type: "group_overflow",
      title: "선택과목 지정 개수 초과",
      message: "선택군에서 지정된 최대 선택 과목 수보다 많이 선택한 그룹이 있습니다."
    });
  } else if (hasGroupUnderflow) {
    warnings.push({
      type: "group_underflow",
      title: "선택과목 미선택 존재",
      message: "아직 선택을 완료하지 않은 선택군이 있습니다. 학년별 탭을 확인하세요."
    });
  }

  // 4. 과학중점과정 검증 (활성화된 경우)
  if (isScienceTrack) {
    if (!sciGeneralCompleted) {
      issues.push({
        type: "sci_general_missing",
        title: "물·화·생·지 일반선택 미이수",
        message: `과학중점과정 필수 4과목 중 [${missingSciGeneral.join(", ")}] 과목이 누락되었습니다.`
      });
    } else {
      successes.push({
        type: "sci_general_ok",
        title: "물·화·생·지 4과목 이수 완료",
        message: "물리학, 화학, 생명과학, 지구과학 4과목을 모두 수강하였습니다."
      });
    }

    if (!sciAdvancedCompleted) {
      issues.push({
        type: "sci_advanced_missing",
        title: "과학 진로선택 과목 수 부족",
        message: `과학 교과(군) 진로선택과목은 6과목 이상 이수해야 합니다. (현재: ${sciAdvancedCount} / 6과목)`
      });
    } else {
      successes.push({
        type: "sci_advanced_ok",
        title: "과학 진로선택 요건 충족",
        message: `과학 진로선택과목을 6과목 이상(${sciAdvancedCount}과목) 이수하였습니다.`
      });
    }

    if (!isStemCreditValid) {
      issues.push({
        type: "stem_credit_under",
        title: "과·수·정 총 이수학점 부족",
        message: `과학중점과정 기준(총 79학점 이상)보다 ${STEM_MIN_CREDITS - stemTotalCredits}학점 부족합니다. (현재: ${stemTotalCredits}학점)`
      });
    } else {
      successes.push({
        type: "stem_credit_ok",
        title: "과·수·정 총 이수학점 충족",
        message: `과학, 수학, 정보 총 이수학점이 ${stemTotalCredits}학점으로 기준(79학점 이상)을 충족합니다.`
      });
    }
  }

  // 최종 상태 판정
  let overallStatus = "in_progress"; // 'success' | 'danger' | 'warning' | 'in_progress'
  let bannerTitle = "📝 교육과정 설계 진행 중...";
  let bannerDesc = "각 학년/학기 탭에서 선택과목을 지정하여 나만의 교육과정을 완성해 보세요.";

  if (!isCoreCreditValid) {
    overallStatus = "danger";
    bannerTitle = "🚨 국·영·수 학점 한도 초과!";
    bannerDesc = `국어·영어·수학 합산이 81학점을 초과했습니다 (${coreCredits}학점). 선택을 조정해 주세요.`;
  } else if (hasGroupOverflow) {
    overallStatus = "danger";
    bannerTitle = "⚠️ 선택 과목 수 초과!";
    bannerDesc = "한 군에서 허용된 과목 수보다 많이 선택되었습니다. 초과된 과목을 해제해 주세요.";
  } else if (isScienceTrack && (!sciGeneralCompleted || !sciAdvancedCompleted || !isStemCreditValid)) {
    overallStatus = "warning";
    bannerTitle = "🧪 과학중점과정 요건 보완 필요";
    bannerDesc = "물·화·생·지 필수 이수, 진로선택 6과목, 과·수·정 학점 요건을 확인하세요.";
  } else if (!isTotalCreditValid || hasGroupUnderflow) {
    overallStatus = "in_progress";
    bannerTitle = "✏️ 과목 선택 진행 중...";
    const leftCredits = Math.max(0, GRADUATION_MIN_CREDITS - totalCredits);
    bannerDesc = `현재 ${totalCredits}학점 이수 중입니다. (졸업 기준까지 ${leftCredits}학점 추가 필요)`;
  } else if (isTotalCreditValid && isCoreCreditValid && (!isScienceTrack || isScienceTrackValid)) {
    overallStatus = "success";
    bannerTitle = "🎉 나만의 교육과정 설계 완료!";
    bannerDesc = isScienceTrack 
      ? "졸업 요건과 과학중점과정 필수 이수 기준을 모두 완벽하게 충족하였습니다!" 
      : "고등학교 졸업 요건 및 교육과정 이수 기준을 모두 충족하였습니다!";
  }

  return {
    totalCredits,
    targetTotalCredits: GRADUATION_MIN_CREDITS,
    isTotalCreditValid,

    coreCredits,
    maxCoreCredits: CORE_MAX_CREDITS,
    isCoreCreditValid,
    corePercentage,

    categoryBreakdown: {
      "국어": korCredits,
      "수학": mathCredits,
      "영어": engCredits,
      "사회": socCredits,
      "과학": sciCredits,
      "체육": peCredits,
      "예술": artCredits,
      "기술·가정/정보/제2외국어/한문/교양": techEtcCredits
    },

    scienceTrack: {
      isActive: isScienceTrack,
      isValid: isScienceTrackValid,
      stemTotalCredits,
      targetStemCredits: STEM_MIN_CREDITS,
      isStemCreditValid,
      stemPercentage,
      sciCredits,
      mathCredits,
      infoCredits,
      sciGeneralCompleted,
      selectedSciGeneral: Array.from(selectedSciGeneral),
      missingSciGeneral,
      sciAdvancedCount,
      targetSciAdvancedCount: SCI_ADVANCED_MIN_COUNT,
      sciAdvancedCompleted,
      sciAdvancedSelectedList
    },

    groupStatus,
    hasGroupOverflow,
    hasGroupUnderflow,

    overallStatus,
    bannerTitle,
    bannerDesc,
    issues,
    warnings,
    successes
  };
}
