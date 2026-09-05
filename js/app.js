/**
 * 고교학점제 과목 이수 진단기 - 메인 애플리케이션 제어 모듈
 */

import { defaultSubjects, defaultSelectGroups, categoryColors } from "./defaultData.js";
import { validateCurriculum } from "./validator.js";
import { initChart, updateChart } from "./chartManager.js";
import { downloadStandardTemplate, parseExcelFile, exportSelectionResult } from "./excelManager.js";

// 애플리케이션 상태 객체
const state = {
  subjects: [...defaultSubjects],
  selectGroups: { ...defaultSelectGroups },
  schoolName: "정명고등학교",
  currentGrade: 2, // 2학년 선택과목 화면을 기본 표시
  isScienceTrack: false, // 과학중점과정 모드 여부
  selectedSubjects: new Set(),
  lastValidationStatus: null
};

// ============================================================================
// 초기화 및 라이프사이클
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  loadSavedState();
  initDefaultSelections();
  setupEventListeners();
  renderGradeTabs();
  renderSemesters();
  initCategoryLegend();
  initChart("category-doughnut-chart");
  recalculate(false);

  if (window.lucide) {
    window.lucide.createIcons();
  }
});

/**
 * LocalStorage에서 저장된 상태 불러오기
 */
function loadSavedState() {
  try {
    // 1. 과학중점과정 모드 설정 복원
    const savedTrack = localStorage.getItem("highschool_is_science_track");
    if (savedTrack !== null) {
      state.isScienceTrack = savedTrack === "true";
      updateTrackButtonsUI();
    }

    // 2. 커스텀 학교 교육과정 엑셀 데이터 복원
    const savedCustomCurriculum = localStorage.getItem("highschool_custom_curriculum");
    if (savedCustomCurriculum) {
      const parsed = JSON.parse(savedCustomCurriculum);
      if (parsed.subjects && parsed.selectGroups) {
        state.subjects = parsed.subjects;
        state.selectGroups = parsed.selectGroups;
        state.schoolName = parsed.schoolName || "맞춤 편성 학교";
        updateSchoolBadge();
      }
    }

    // 3. 학생 선택 과목 내역 복원
    const savedSelections = localStorage.getItem("highschool_selected_subjects");
    if (savedSelections) {
      const ids = JSON.parse(savedSelections);
      state.selectedSubjects = new Set(ids);
    }
  } catch (err) {
    console.warn("로컬 저장소 데이터 로드 중 오류:", err);
  }
}

/**
 * 학교 지정 고정(fixed) 과목들을 기본 선택으로 등록
 */
function initDefaultSelections() {
  state.subjects.forEach(sub => {
    if (sub.fixed) {
      state.selectedSubjects.add(sub.id);
    }
  });
}

/**
 * 학교 명칭 배지 업데이트
 */
function updateSchoolBadge() {
  const badge = document.getElementById("school-badge");
  if (badge) {
    badge.textContent = state.schoolName;
  }
}

/**
 * 과정 토글 버튼 UI 갱신
 */
function updateTrackButtonsUI() {
  const btnGeneral = document.getElementById("btn-track-general");
  const btnScience = document.getElementById("btn-track-science");
  const sciWidget = document.getElementById("science-track-widget");

  if (state.isScienceTrack) {
    btnGeneral?.classList.remove("active");
    btnScience?.classList.add("active");
    if (sciWidget) {
      sciWidget.style.display = "flex";
      sciWidget.style.border = "1.5px solid #06b6d4";
    }
  } else {
    btnGeneral?.classList.add("active");
    btnScience?.classList.remove("active");
    if (sciWidget) {
      sciWidget.style.display = "flex";
      sciWidget.style.border = "1px solid rgba(103, 232, 249, 0.4)";
    }
  }
}

// ============================================================================
// 이벤트 리스너 등록
// ============================================================================
function setupEventListeners() {
  // 과정 선택 토글 (일반과정 / 과학중점과정)
  const btnGeneral = document.getElementById("btn-track-general");
  const btnScience = document.getElementById("btn-track-science");

  btnGeneral?.addEventListener("click", () => {
    if (state.isScienceTrack) {
      state.isScienceTrack = false;
      localStorage.setItem("highschool_is_science_track", "false");
      updateTrackButtonsUI();
      recalculate();
      showToast("일반과정 이수 진단 모드로 전환되었습니다.", "info");
    }
  });

  btnScience?.addEventListener("click", () => {
    if (!state.isScienceTrack) {
      state.isScienceTrack = true;
      localStorage.setItem("highschool_is_science_track", "true");
      updateTrackButtonsUI();
      recalculate();
      showToast("과학중점과정 진단 모드가 활성화되었습니다.", "info");
    }
  });

  // 선택 초기화 버튼
  const btnReset = document.getElementById("btn-reset-selections");
  btnReset?.addEventListener("click", () => {
    if (confirm("선택한 모든 과목을 초기화하시겠습니까? (학교지정 과목은 유지됩니다)")) {
      state.selectedSubjects.clear();
      initDefaultSelections();
      saveSelectionsToStorage();
      renderSemesters();
      recalculate();
      showToast("선택 과목이 초기화되었습니다.", "info");
    }
  });

  // 엑셀 모달 열기/닫기
  const btnOpenModal = document.getElementById("btn-open-excel-modal");
  const btnCloseModal = document.getElementById("btn-close-excel-modal");
  const excelModal = document.getElementById("excel-modal");

  btnOpenModal?.addEventListener("click", () => {
    excelModal?.classList.add("open");
  });

  btnCloseModal?.addEventListener("click", () => {
    excelModal?.classList.remove("open");
  });

  excelModal?.addEventListener("click", (e) => {
    if (e.target === excelModal) {
      excelModal.classList.remove("open");
    }
  });

  // 표준 엑셀 양식 다운로드 버튼
  const btnDownloadTpl = document.getElementById("btn-download-template");
  btnDownloadTpl?.addEventListener("click", () => {
    downloadStandardTemplate();
    showToast("표준 과목 편성표 엑셀 양식이 다운로드되었습니다.", "success");
  });

  // 기본 편성표 복원 버튼
  const btnRestoreDefault = document.getElementById("btn-restore-default");
  btnRestoreDefault?.addEventListener("click", () => {
    if (confirm("기본 교육과정(정명고등학교 기준 2022 개정 편성표)으로 복원하시겠습니까?")) {
      localStorage.removeItem("highschool_custom_curriculum");
      state.subjects = [...defaultSubjects];
      state.selectGroups = { ...defaultSelectGroups };
      state.schoolName = "정명고등학교";
      updateSchoolBadge();

      // 선택 과목 재설정
      state.selectedSubjects.clear();
      initDefaultSelections();
      saveSelectionsToStorage();

      renderSemesters();
      recalculate();
      excelModal?.classList.remove("open");
      showToast("기본 교육과정 편성표로 복원되었습니다.", "success");
    }
  });

  // 드래그 앤 드롭 업로드 영역
  const dropzone = document.getElementById("excel-dropzone");
  const fileInput = document.getElementById("excel-file-input");

  dropzone?.addEventListener("click", () => {
    fileInput?.click();
  });

  dropzone?.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("drag-over");
  });

  dropzone?.addEventListener("dragleave", () => {
    dropzone.classList.remove("drag-over");
  });

  dropzone?.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("drag-over");
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleExcelUpload(e.dataTransfer.files[0]);
    }
  });

  fileInput?.addEventListener("change", (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleExcelUpload(e.target.files[0]);
    }
  });

  // 학생 선택 결과 엑셀 내보내기 버튼
  const btnExport = document.getElementById("btn-export-result");
  btnExport?.addEventListener("click", () => {
    const selectedList = state.subjects.filter(s => state.selectedSubjects.has(s.id));
    const validation = validateCurriculum(state.selectedSubjects, state.subjects, state.selectGroups, state.isScienceTrack);
    exportSelectionResult(selectedList, validation, state.schoolName);
    showToast("과목 선택 및 진단 결과가 엑셀로 저장되었습니다.", "success");
  });
}

/**
 * 엑셀 파일 업로드 처리
 */
async function handleExcelUpload(file) {
  try {
    showToast("엑셀 파일을 분석하는 중입니다...", "info");
    const result = await parseExcelFile(file);

    if (result.success) {
      state.subjects = result.subjects;
      state.selectGroups = result.selectGroups;
      state.schoolName = file.name.replace(/\.[^/.]+$/, "").replace("고교학점제_학교별_과목편성표_표준양식", "맞춤 학교");
      updateSchoolBadge();

      // 고정 과목 자동 선택
      state.selectedSubjects.clear();
      initDefaultSelections();
      saveSelectionsToStorage();

      // 커스텀 데이터 로컬 스토리지에 저장
      localStorage.setItem("highschool_custom_curriculum", JSON.stringify({
        subjects: state.subjects,
        selectGroups: state.selectGroups,
        schoolName: state.schoolName
      }));

      renderSemesters();
      recalculate();

      document.getElementById("excel-modal")?.classList.remove("open");
      showToast(`성공! 총 ${result.count}개 과목이 새롭게 적용되었습니다.`, "success");
    }
  } catch (err) {
    showToast(`업로드 실패: ${err.message}`, "error");
  }
}

/**
 * 선택 상태를 localStorage에 저장
 */
function saveSelectionsToStorage() {
  localStorage.setItem("highschool_selected_subjects", JSON.stringify(Array.from(state.selectedSubjects)));
}

// ============================================================================
// 학년 탭 렌더링 & 전환
// ============================================================================
function renderGradeTabs() {
  const tabButtons = document.querySelectorAll(".grade-tab-btn");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const gradeAttr = e.currentTarget.getAttribute("data-grade");
      const grade = gradeAttr === "all" ? "all" : parseInt(gradeAttr, 10);
      switchGradeTab(grade);
    });
  });
}

function switchGradeTab(grade) {
  state.currentGrade = grade;

  const tabButtons = document.querySelectorAll(".grade-tab-btn");
  tabButtons.forEach(btn => {
    const g = btn.getAttribute("data-grade");
    if ((grade === "all" && g === "all") || parseInt(g, 10) === grade) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  renderSemesters();
}

// ============================================================================
// 학기별 과목 카드 렌더링
// ============================================================================
function renderSemesters() {
  const container = document.getElementById("semesters-container");
  if (!container) return;

  container.innerHTML = "";

  if (state.currentGrade === "all") {
    // 전체 학년 요약 뷰 (1학년, 2학년, 3학년 연속 출력)
    [1, 2, 3].forEach(grade => {
      [1, 2].forEach(term => {
        const termSubjects = state.subjects.filter(s => s.grade === grade && s.term === term);
        if (termSubjects.length > 0) {
          const card = createSemesterCard(grade, term, termSubjects);
          container.appendChild(card);
        }
      });
    });
  } else {
    // 선택된 학년의 1학기, 2학기 렌더링
    [1, 2].forEach(term => {
      const termSubjects = state.subjects.filter(s => s.grade === state.currentGrade && s.term === term);
      const card = createSemesterCard(state.currentGrade, term, termSubjects);
      container.appendChild(card);
    });
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/**
 * 개별 학기 카드 컴포넌트 생성
 */
function createSemesterCard(grade, term, termSubjects) {
  const card = document.createElement("div");
  card.className = "semester-card glass-card";

  // 학기 내 선택/지정된 학점 계산
  const termTotalCredits = termSubjects
    .filter(s => state.selectedSubjects.has(s.id))
    .reduce((sum, s) => sum + s.credits, 0);

  // 헤더
  const header = document.createElement("div");
  header.className = "semester-title-bar";
  header.innerHTML = `
    <div class="semester-title">
      <i data-lucide="calendar"></i>
      <span>${grade}학년 ${term}학기</span>
    </div>
    <span class="semester-term-credits">이수 학점: <strong>${termTotalCredits}학점</strong></span>
  `;
  card.appendChild(header);

  // 1. 학교 지정 공통/필수 과목 섹션
  const fixedList = termSubjects.filter(s => s.fixed);
  if (fixedList.length > 0) {
    const fixedSection = document.createElement("div");
    fixedSection.className = "subject-group-section";
    fixedSection.innerHTML = `
      <div class="group-section-header">
        <div class="group-title">
          <i data-lucide="lock" style="width: 15px; height: 15px; color: #64748b;"></i>
          <span>학교 지정 필수 이수 과목 (${fixedList.length}과목)</span>
        </div>
      </div>
    `;

    const fixedGrid = document.createElement("div");
    fixedGrid.className = "fixed-subjects-grid";

    fixedList.forEach(sub => {
      const catStyle = categoryColors[sub.category] || categoryColors["기술·가정/정보/제2외국어/한문/교양"];
      const chip = document.createElement("div");
      chip.className = "fixed-subject-chip";
      chip.innerHTML = `
        <div class="fixed-chip-left">
          <span class="fixed-category-pill" style="background: ${catStyle.bg}; color: ${catStyle.text};">
            ${sub.category.length > 8 ? '교양/기타' : sub.category}
          </span>
          <span class="fixed-subject-name" title="${sub.name}">${sub.name}</span>
        </div>
        <div class="fixed-chip-right">
          <span>${sub.credits}학점</span>
          <i data-lucide="check" style="width: 13px; height: 13px; color: #10b981;"></i>
        </div>
      `;
      fixedGrid.appendChild(chip);
    });

    fixedSection.appendChild(fixedGrid);
    card.appendChild(fixedSection);
  }

  // 2. 선택 과목군 섹션
  const selectList = termSubjects.filter(s => !s.fixed);
  if (selectList.length > 0) {
    // 선택군별로 그룹화
    const groupsMap = {};
    selectList.forEach(sub => {
      const gid = sub.group || `unknown_${grade}_${term}`;
      if (!groupsMap[gid]) {
        groupsMap[gid] = [];
      }
      groupsMap[gid].push(sub);
    });

    Object.entries(groupsMap).forEach(([gid, groupSubjects]) => {
      const groupInfo = state.selectGroups[gid] || {
        name: `${grade}학년 ${term}학기 선택군`,
        max: 1,
        desc: "선택과목 중 택 1"
      };

      const selectedInGroup = groupSubjects.filter(s => state.selectedSubjects.has(s.id)).length;
      const isCompleted = selectedInGroup === groupInfo.max;
      const isOver = selectedInGroup > groupInfo.max;

      let badgeClass = "badge-selecting";
      let badgeIcon = "clock";
      let badgeText = `선택 중 (${selectedInGroup} / ${groupInfo.max})`;

      if (isCompleted) {
        badgeClass = "badge-completed";
        badgeIcon = "check-circle";
        badgeText = `완료 (${selectedInGroup} / ${groupInfo.max})`;
      } else if (isOver) {
        badgeClass = "badge-overflow";
        badgeIcon = "alert-circle";
        badgeText = `초과 (${selectedInGroup} / ${groupInfo.max})`;
      }

      const selectSection = document.createElement("div");
      selectSection.className = "subject-group-section";
      selectSection.innerHTML = `
        <div class="group-section-header">
          <div class="group-title">
            <i data-lucide="check-square" style="width: 15px; height: 15px; color: #3b82f6;"></i>
            <span>${groupInfo.name}</span>
          </div>
          <span class="group-selection-badge ${badgeClass}">
            <i data-lucide="${badgeIcon}" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle;"></i>
            ${badgeText}
          </span>
        </div>
      `;

      const electiveGrid = document.createElement("div");
      electiveGrid.className = "elective-subjects-grid";

      groupSubjects.forEach(sub => {
        const isSelected = state.selectedSubjects.has(sub.id);
        const catStyle = categoryColors[sub.category] || categoryColors["기술·가정/정보/제2외국어/한문/교양"];

        const cardItem = document.createElement("div");
        cardItem.className = `subject-card ${isSelected ? 'selected' : ''}`;
        cardItem.setAttribute("data-id", sub.id);
        cardItem.style.borderLeftColor = catStyle.accent || "#3b82f6";

        // 특별 태그 (물화생지, 과학진로, 정보)
        let specialTag = "";
        if (sub.isSciGeneral) {
          specialTag = `<span style="font-size: 9px; background: #cffafe; color: #0891b2; padding: 1px 4px; border-radius: 3px; font-weight: 700; margin-left: 4px;">물·화·생·지</span>`;
        } else if (sub.isSciAdvanced) {
          specialTag = `<span style="font-size: 9px; background: #ede9fe; color: #6d28d9; padding: 1px 4px; border-radius: 3px; font-weight: 700; margin-left: 4px;">과진로</span>`;
        } else if (sub.isInfo) {
          specialTag = `<span style="font-size: 9px; background: #f1f5f9; color: #475569; padding: 1px 4px; border-radius: 3px; font-weight: 700; margin-left: 4px;">정보</span>`;
        }

        cardItem.innerHTML = `
          <div class="card-top">
            <div>
              <span class="card-category-pill" style="background: ${catStyle.bg}; color: ${catStyle.text};">
                ${sub.category}
              </span>
              ${specialTag}
            </div>
            <span class="card-type-tag">${sub.subjectType || "일반"}</span>
          </div>

          <div class="card-subject-name">${sub.name}</div>

          <div class="card-bottom">
            <span class="card-credits">${sub.credits}학점</span>
            <div class="pastel-checkbox">
              <i data-lucide="check"></i>
            </div>
          </div>
        `;

        cardItem.addEventListener("click", () => {
          handleToggleSubject(sub.id, cardItem);
        });

        electiveGrid.appendChild(cardItem);
      });

      selectSection.appendChild(electiveGrid);
      card.appendChild(selectSection);
    });
  }

  return card;
}

// ============================================================================
// 과목 선택 토글 및 그룹 한도 방어
// ============================================================================
function handleToggleSubject(subjectId, cardElement) {
  const subject = state.subjects.find(s => s.id === subjectId);
  if (!subject) return;

  if (subject.fixed) {
    showToast("학교지정 필수 과목은 선택을 해제할 수 없습니다.", "warning");
    return;
  }

  const isSelected = state.selectedSubjects.has(subjectId);

  if (!isSelected) {
    // 선택을 추가하려는 경우: 해당 선택군의 최대 선택 한도 검사
    const group = state.selectGroups[subject.group];
    if (group) {
      const selectedCount = state.subjects.filter(
        s => s.group === subject.group && state.selectedSubjects.has(s.id)
      ).length;

      if (selectedCount >= group.max) {
        showToast(`[${group.name}]은(는) 최대 ${group.max}과목까지만 선택할 수 있습니다.`, "warning");
        if (cardElement) {
          cardElement.classList.add("shake-card");
          setTimeout(() => cardElement.classList.remove("shake-card"), 450);
        }
        return;
      }
    }

    state.selectedSubjects.add(subjectId);
    showToast(`'${subject.name}' 과목을 선택하였습니다. (${subject.credits}학점)`, "success");
  } else {
    // 선택 해제
    state.selectedSubjects.delete(subjectId);
    showToast(`'${subject.name}' 과목 선택을 취소하였습니다.`, "info");
  }

  saveSelectionsToStorage();
  renderSemesters();
  recalculate();
}

// ============================================================================
// 검증 및 대시보드 업데이트
// ============================================================================
function recalculate(triggerAnimation = true) {
  const result = validateCurriculum(
    state.selectedSubjects,
    state.subjects,
    state.selectGroups,
    state.isScienceTrack
  );

  // 1. 총 이수 학점 카드 갱신
  const totalVal = document.getElementById("val-total-credits");
  const totalBadge = document.getElementById("badge-total-status");
  if (totalVal && totalBadge) {
    totalVal.textContent = result.totalCredits;
    totalBadge.className = "metric-status-badge";

    if (result.isTotalCreditValid) {
      totalBadge.classList.add("badge-pass");
      totalBadge.innerHTML = `<i data-lucide="check-circle" style="width: 12px; height: 12px;"></i> 충족 (174 이상)`;
    } else {
      totalBadge.classList.add("badge-warn");
      totalBadge.innerHTML = `<i data-lucide="clock" style="width: 12px; height: 12px;"></i> 미달 (-${result.targetTotalCredits - result.totalCredits}학점)`;
    }
  }

  // 2. 국·영·수 합산 카드 갱신
  const coreVal = document.getElementById("val-core-credits");
  const coreBadge = document.getElementById("badge-core-status");
  if (coreVal && coreBadge) {
    coreVal.textContent = result.coreCredits;
    coreBadge.className = "metric-status-badge";

    if (result.isCoreCreditValid) {
      coreBadge.classList.add("badge-pass");
      coreBadge.innerHTML = `<i data-lucide="shield-check" style="width: 12px; height: 12px;"></i> 안전 (${result.corePercentage}%)`;
    } else {
      coreBadge.classList.add("badge-fail");
      coreBadge.innerHTML = `<i data-lucide="alert-triangle" style="width: 12px; height: 12px;"></i> 초과 (+${result.coreCredits - result.maxCoreCredits}학점)`;
    }
  }

  // 3. 과학중점과정 위젯 갱신
  const st = result.scienceTrack;
  const stemVal = document.getElementById("val-stem-credits");
  const sciTrackPill = document.getElementById("sci-track-status-pill");
  const sciGenCountText = document.getElementById("sci-general-count-text");
  const badgeSciAdvanced = document.getElementById("badge-sci-advanced");

  if (stemVal) {
    stemVal.textContent = `${st.stemTotalCredits} / 79학점 (${st.stemPercentage}%)`;
    stemVal.style.color = st.isStemCreditValid ? "#059669" : "#d97706";
  }

  if (sciTrackPill) {
    sciTrackPill.className = "metric-target-tag";
    if (st.isValid) {
      sciTrackPill.textContent = "전체 충족";
      sciTrackPill.style.background = "#dcfce7";
      sciTrackPill.style.color = "#15803d";
    } else {
      sciTrackPill.textContent = "요건 보완 필요";
      sciTrackPill.style.background = "#fef3c7";
      sciTrackPill.style.color = "#b45309";
    }
  }

  // 물화생지 4과목 칩
  const chipMap = {
    "물리학": document.getElementById("chip-physics"),
    "화학": document.getElementById("chip-chemistry"),
    "생명과학": document.getElementById("chip-biology"),
    "지구과학": document.getElementById("chip-earth")
  };

  let sciGenCount = 0;
  Object.entries(chipMap).forEach(([name, el]) => {
    if (!el) return;
    const isSelected = st.selectedSciGeneral.includes(name);
    if (isSelected) {
      sciGenCount++;
      el.classList.add("active");
      el.innerHTML = `<i data-lucide="check-circle-2" style="width: 14px; height: 14px;"></i> ${name}`;
    } else {
      el.classList.remove("active");
      el.innerHTML = `<i data-lucide="circle" style="width: 14px; height: 14px;"></i> ${name}`;
    }
  });

  if (sciGenCountText) {
    sciGenCountText.textContent = `${sciGenCount} / 4`;
    sciGenCountText.style.color = sciGenCount === 4 ? "#059669" : "#d97706";
  }

  // 과학 진로선택 과목 수 배지
  if (badgeSciAdvanced) {
    badgeSciAdvanced.className = "metric-status-badge";
    if (st.sciAdvancedCompleted) {
      badgeSciAdvanced.classList.add("badge-pass");
      badgeSciAdvanced.innerHTML = `<i data-lucide="check-circle" style="width: 12px; height: 12px;"></i> 이수 완료 (${st.sciAdvancedCount}과목)`;
    } else {
      badgeSciAdvanced.classList.add("badge-warn");
      badgeSciAdvanced.innerHTML = `<i data-lucide="clock" style="width: 12px; height: 12px;"></i> 미달 (${st.sciAdvancedCount} / 6과목)`;
    }
  }

  // 4. 종합 판정 배너 갱신
  const banner = document.getElementById("status-banner");
  const bannerIcon = document.getElementById("banner-icon");
  const bannerTitle = document.getElementById("banner-title");
  const bannerDesc = document.getElementById("banner-desc");

  if (banner && bannerTitle && bannerDesc) {
    banner.className = `status-banner glass-card banner-${result.overallStatus}`;
    bannerTitle.textContent = result.bannerTitle;
    bannerDesc.textContent = result.bannerDesc;

    if (bannerIcon) {
      let iconName = "sparkles";
      if (result.overallStatus === "success") iconName = "party-popper";
      else if (result.overallStatus === "danger") iconName = "alert-triangle";
      else if (result.overallStatus === "warning") iconName = "alert-circle";

      bannerIcon.innerHTML = `<i data-lucide="${iconName}"></i>`;
    }

    // 졸업 요건 최초 달성 시 축하 폭죽 애니메이션!
    if (result.overallStatus === "success" && state.lastValidationStatus !== "success" && triggerAnimation) {
      fireCelebrationConfetti();
    }
  }

  state.lastValidationStatus = result.overallStatus;

  // 5. 차트 및 범례 갱신
  updateChart(result.categoryBreakdown);
  updateCategoryPills(result.categoryBreakdown, result.totalCredits);

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/**
 * 교과군별 범례 및 세부 이수 학점 표시
 */
function initCategoryLegend() {
  const container = document.getElementById("category-pills-container");
  if (!container) return;

  container.innerHTML = "";
  Object.keys(categoryColors).forEach(cat => {
    const color = categoryColors[cat];
    const item = document.createElement("div");
    item.className = "cat-pill-item";
    item.setAttribute("data-cat", cat);

    const label = cat.length > 8 ? "교양/기타" : cat;

    item.innerHTML = `
      <div class="cat-pill-name">
        <span class="cat-dot" style="background-color: ${color.accent};"></span>
        <span>${label}</span>
      </div>
      <span class="cat-pill-val" id="cat-val-${encodeURIComponent(cat)}">0학점</span>
    `;
    container.appendChild(item);
  });
}

function updateCategoryPills(breakdown, total) {
  Object.entries(breakdown).forEach(([cat, credits]) => {
    const valEl = document.getElementById(`cat-val-${encodeURIComponent(cat)}`);
    if (valEl) {
      const pct = total > 0 ? ((credits / total) * 100).toFixed(0) : 0;
      valEl.textContent = `${credits}학점 (${pct}%)`;
    }
  });
}

/**
 * 축하 폭죽 Confetti 애니메이션
 */
function fireCelebrationConfetti() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6ee7b7', '#93c5fd', '#c4b5fd', '#fcd34d', '#fda4af']
    });
  }
}

// ============================================================================
// 토스트 알림 컴포넌트
// ============================================================================
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  let iconName = "info";
  if (type === "success") iconName = "check-circle";
  else if (type === "warning") iconName = "alert-circle";
  else if (type === "error") iconName = "alert-triangle";

  toast.innerHTML = `
    <i data-lucide="${iconName}" style="width: 18px; height: 18px; flex-shrink: 0;"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  if (window.lucide) {
    window.lucide.createIcons();
  }

  setTimeout(() => {
    toast.classList.add("toast-out");
    setTimeout(() => toast.remove(), 260);
  }, 3200);
}
