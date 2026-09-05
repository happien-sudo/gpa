/**
 * 고교학점제 엑셀 표준 양식 다운로드 및 업로드/파싱 모듈 (SheetJS 기반)
 */

import { defaultSubjects, defaultSelectGroups } from "./defaultData.js";

/**
 * 학교별 표준 공통 엑셀 양식(.xlsx)을 생성하고 브라우저에서 다운로드합니다.
 * 기본 편성표 데이터를 예시로 담아 제공하므로 교사가 수정하기 매우 편리합니다.
 */
export function downloadStandardTemplate() {
  if (typeof XLSX === "undefined") {
    alert("엑셀 라이브러리(SheetJS)를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.");
    return;
  }

  // 1. 과목 편성표 데이터 시트 생성
  const tableData = [
    [
      "학년",
      "학기",
      "구분",
      "선택군코드",
      "선택군명",
      "선택군_최대선택수",
      "교과군",
      "과목명",
      "학점",
      "과목유형",
      "과학중점구분"
    ]
  ];

  defaultSubjects.forEach(sub => {
    const isFixed = sub.fixed;
    const groupInfo = sub.group ? defaultSelectGroups[sub.group] : null;

    let sciCategory = "해당없음";
    if (sub.isSciGeneral) sciCategory = "물화생지일반선택";
    else if (sub.isSciAdvanced) sciCategory = "과학진로선택";
    else if (sub.isInfo) sciCategory = "정보과목";

    tableData.push([
      sub.grade,
      sub.term,
      isFixed ? "학교지정" : "선택과목",
      sub.group || "",
      groupInfo ? groupInfo.name : "",
      groupInfo ? groupInfo.max : "",
      sub.category,
      sub.name,
      sub.credits,
      sub.subjectType || "일반선택",
      sciCategory
    ]);
  });

  const wsData = XLSX.utils.aoa_to_sheet(tableData);

  // 열 너비 자동 설정
  wsData["!cols"] = [
    { wch: 6 },  // 학년
    { wch: 6 },  // 학기
    { wch: 10 }, // 구분
    { wch: 12 }, // 선택군코드
    { wch: 32 }, // 선택군명
    { wch: 16 }, // 선택군_최대선택수
    { wch: 28 }, // 교과군
    { wch: 24 }, // 과목명
    { wch: 6 },  // 학점
    { wch: 12 }, // 과목유형
    { wch: 16 }  // 과학중점구분
  ];

  // 2. 작성 가이드 및 안내 시트 생성
  const guideData = [
    ["고교학점제 학교별 과목 편성표 표준 공통 엑셀 양식 작성 안내"],
    [""],
    ["항목", "설명", "입력 규칙 및 예시"],
    ["학년", "이수 학년 (숫자)", "1, 2, 3 중 입력"],
    ["학기", "이수 학기 (숫자)", "1, 2 중 입력"],
    ["구분", "학교지정(필수) 또는 선택과목", "'학교지정' 또는 '선택과목' 중 하나 입력"],
    ["선택군코드", "선택과목인 경우 묶음 코드 (영문/숫자)", "예: g2_1_s1, g3_1_s1 (학교지정 과목은 공란)"],
    ["선택군명", "선택과목 묶음의 사용자 표시 명칭", "예: 2학년 1학기 사회·과학 선택군 (학교지정은 공란)"],
    ["선택군_최대선택수", "해당 군에서 학생이 택해야 할 과목 수", "예: 4 (학교지정은 공란)"],
    ["교과군", "국가 교육과정 교과군 명칭", "국어, 수학, 영어, 사회, 과학, 체육, 예술, 기술·가정/정보/제2외국어/한문/교양"],
    ["과목명", "실제 개설 과목명", "예: 공통국어1, 물리학, 화법과 언어 등"],
    ["학점", "해당 과목의 이수 학점 (숫자)", "1, 2, 3, 4 등"],
    ["과목유형", "2022 개정 교육과정 과목 성격", "공통, 일반선택, 진로선택, 융합선택, 교양 중 입력"],
    ["과학중점구분", "과학중점과정 진단용 특수 태그", "'물화생지일반선택', '과학진로선택', '정보과목', '해당없음' 중 선택"],
    [""],
    ["※ 작성 팁:"],
    ["1. '과목편성표' 시트의 첫 번째 행(헤더 제목)은 변경하지 마세요."],
    ["2. 학교지정 과목은 학생이 앱을 열었을 때 자동으로 선택 및 잠금 처리됩니다."],
    ["3. 동일한 선택군에 속하는 과목들은 '선택군코드'와 '선택군명', '선택군_최대선택수'를 동일하게 기재해 주세요."],
    ["4. 저장이 완료된 엑셀 파일을 웹앱의 [엑셀 업로드] 버튼을 통해 불러오면 학교 전용 맞춤 진단기로 즉시 동작합니다."]
  ];

  const wsGuide = XLSX.utils.aoa_to_sheet(guideData);
  wsGuide["!cols"] = [
    { wch: 18 },
    { wch: 36 },
    { wch: 55 }
  ];

  // 워크북 조립
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wsData, "과목편성표");
  XLSX.utils.book_append_sheet(wb, wsGuide, "작성안내");

  // 파일 다운로드
  XLSX.writeFile(wb, "고교학점제_학교별_과목편성표_표준양식.xlsx");
}

/**
 * 사용자가 업로드한 엑셀 파일(.xlsx, .xls)을 읽어 앱의 subjects 및 selectGroups 형태로 변환합니다.
 * @param {File} file - 업로드된 File 객체
 * @returns {Promise<Object>} 파싱 결과
 */
export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("선택된 파일이 없습니다."));
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // '과목편성표' 시트 또는 첫 번째 시트 찾기
        let sheetName = "과목편성표";
        if (!workbook.SheetNames.includes(sheetName)) {
          sheetName = workbook.SheetNames[0];
        }

        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          throw new Error("엑셀 파일에 유효한 시트가 존재하지 않습니다.");
        }

        // 헤더를 포함한 2D 배열로 추출
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (!rows || rows.length < 2) {
          throw new Error("데이터 행이 존재하지 않습니다. 최소 1개 이상의 과목이 포함되어야 합니다.");
        }

        const headers = rows[0].map(h => (h ? String(h).trim() : ""));

        // 필수 헤더 인덱스 매핑
        const findCol = (namePatterns) => {
          return headers.findIndex(h => namePatterns.some(p => h.includes(p)));
        };

        const colGrade = findCol(["학년"]);
        const colTerm = findCol(["학기"]);
        const colType = findCol(["구분"]);
        const colGCode = findCol(["선택군코드", "그룹코드", "군코드"]);
        const colGName = findCol(["선택군명", "그룹명", "군명"]);
        const colGMax = findCol(["최대선택수", "선택수", "선택개수"]);
        const colCategory = findCol(["교과군", "교과"]);
        const colName = findCol(["과목명", "과목"]);
        const colCredits = findCol(["학점", "단위"]);
        const colSubjType = findCol(["과목유형", "과목구분"]);
        const colSciCat = findCol(["과학중점구분", "과학중점"]);

        if (colName === -1 || colCredits === -1) {
          throw new Error("엑셀 파일에 필수 열(과목명, 학점)이 누락되었습니다. 표준 양식을 확인해 주세요.");
        }

        const newSubjects = [];
        const newSelectGroups = {};

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;

          const rawName = colName !== -1 ? row[colName] : "";
          if (!rawName || String(rawName).trim() === "") continue;

          const name = String(rawName).trim();
          const grade = colGrade !== -1 && row[colGrade] ? parseInt(row[colGrade], 10) || 1 : 1;
          const term = colTerm !== -1 && row[colTerm] ? parseInt(row[colTerm], 10) || 1 : 1;
          const rawType = colType !== -1 && row[colType] ? String(row[colType]).trim() : "선택과목";
          const fixed = rawType.includes("지정") || rawType.includes("필수") || rawType.includes("공통");
          
          let credits = colCredits !== -1 && row[colCredits] ? parseInt(row[colCredits], 10) || 3 : 3;
          let category = colCategory !== -1 && row[colCategory] ? String(row[colCategory]).trim() : "기타";

          // 교과군 표준화
          if (category.includes("국어")) category = "국어";
          else if (category.includes("수학")) category = "수학";
          else if (category.includes("영어")) category = "영어";
          else if (category.includes("사회") || category.includes("역사") || category.includes("도덕")) category = "사회";
          else if (category.includes("과학")) category = "과학";
          else if (category.includes("체육")) category = "체육";
          else if (category.includes("예술") || category.includes("음악") || category.includes("미술")) category = "예술";
          else category = "기술·가정/정보/제2외국어/한문/교양";

          const subjectType = colSubjType !== -1 && row[colSubjType] ? String(row[colSubjType]).trim() : (fixed ? "공통" : "일반선택");

          // 선택군 처리
          let groupId = null;
          if (!fixed) {
            const rawGCode = colGCode !== -1 && row[colGCode] ? String(row[colGCode]).trim() : "";
            const rawGName = colGName !== -1 && row[colGName] ? String(row[colGName]).trim() : "";
            const rawGMax = colGMax !== -1 && row[colGMax] ? parseInt(row[colGMax], 10) || 1 : 1;

            if (rawGCode || rawGName) {
              groupId = rawGCode || `group_${grade}_${term}_${i}`;
              if (!newSelectGroups[groupId]) {
                newSelectGroups[groupId] = {
                  id: groupId,
                  name: rawGName || `${grade}학년 ${term}학기 선택군`,
                  max: rawGMax,
                  grade: grade,
                  term: term,
                  desc: `${rawGName || '선택군'} (${rawGMax}과목 선택)`
                };
              }
            }
          }

          // 과학중점 속성 처리
          const rawSciCat = colSciCat !== -1 && row[colSciCat] ? String(row[colSciCat]).trim() : "";
          const isSciGeneral = rawSciCat.includes("일반") || ["물리학", "화학", "생명과학", "지구과학"].includes(name);
          const isSciAdvanced = rawSciCat.includes("진로") || (category === "과학" && !isSciGeneral && (subjectType.includes("진로") || subjectType.includes("융합")));
          const isInfo = rawSciCat.includes("정보") || ["정보", "인공지능 기초", "데이터 과학", "소프트웨어와 생활"].includes(name);

          const subjectId = `sub_${grade}_${term}_${i}_${Math.random().toString(36).substring(2, 6)}`;

          newSubjects.push({
            id: subjectId,
            name,
            credits,
            category,
            fixed,
            grade,
            term,
            group: groupId,
            subjectType,
            isSciGeneral,
            isSciAdvanced,
            isInfo
          });
        }

        if (newSubjects.length === 0) {
          throw new Error("유효한 과목 데이터를 파싱하지 못했습니다.");
        }

        resolve({
          success: true,
          subjects: newSubjects,
          selectGroups: newSelectGroups,
          fileName: file.name,
          count: newSubjects.length
        });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = function () {
      reject(new Error("파일 읽기 중 오류가 발생했습니다."));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * 학생의 현재 과목 선택 내역 및 졸업/과학중점 진단 결과를 엑셀로 내보냅니다.
 * @param {Array<Object>} selectedSubjects - 선택된 과목 목록
 * @param {Object} validation - 검증 결과 객체
 * @param {string} schoolName - 학교명
 */
export function exportSelectionResult(selectedSubjects, validation, schoolName = "정명고등학교") {
  if (typeof XLSX === "undefined") {
    alert("엑셀 라이브러리(SheetJS)가 아직 준비되지 않았습니다.");
    return;
  }

  // 시트 1: 선택 과목 상세 내역
  const subRows = [
    ["고교학점제 과목 선택 및 이수 설계표"],
    [`학교명: ${schoolName}`, `출력일시: ${new Date().toLocaleString("ko-KR")}`],
    [""],
    ["학년", "학기", "구분", "교과군", "과목명", "학점", "과목유형"]
  ];

  // 학년, 학기 순으로 정렬
  const sorted = [...selectedSubjects].sort((a, b) => {
    if (a.grade !== b.grade) return a.grade - b.grade;
    if (a.term !== b.term) return a.term - b.term;
    return a.fixed === b.fixed ? 0 : a.fixed ? -1 : 1;
  });

  sorted.forEach(s => {
    subRows.push([
      `${s.grade}학년`,
      `${s.term}학기`,
      s.fixed ? "학교지정" : "선택과목",
      s.category,
      s.name,
      s.credits,
      s.subjectType || "일반"
    ]);
  });

  const wsSelected = XLSX.utils.aoa_to_sheet(subRows);
  wsSelected["!cols"] = [
    { wch: 10 },
    { wch: 10 },
    { wch: 12 },
    { wch: 28 },
    { wch: 24 },
    { wch: 8 },
    { wch: 12 }
  ];

  // 시트 2: 종합 진단 보고서
  const diagRows = [
    ["고교학점제 졸업 요건 및 교육과정 종합 진단서"],
    [""],
    ["진단 항목", "학생 이수 현황", "기준 요건", "판정 결과"],
    [
      "총 이수 학점",
      `${validation.totalCredits} 학점`,
      "174학점 이상",
      validation.isTotalCreditValid ? "충족 (이수 완료)" : `미달 (${174 - validation.totalCredits}학점 부족)`
    ],
    [
      "국·영·수 합산 학점",
      `${validation.coreCredits} 학점 (${validation.corePercentage}%)`,
      "81학점 이하",
      validation.isCoreCreditValid ? "안전 (기준 준수)" : `초과 (${validation.coreCredits - 81}학점 초과)`
    ]
  ];

  if (validation.scienceTrack && validation.scienceTrack.isActive) {
    const st = validation.scienceTrack;
    diagRows.push(
      ["[과학중점과정] 과·수·정 총 이수학점", `${st.stemTotalCredits} 학점`, "79학점 이상 (45%)", st.isStemCreditValid ? "충족" : `미달 (${79 - st.stemTotalCredits}학점 부족)`],
      ["[과학중점과정] 물·화·생·지 일반선택 4과목", st.sciGeneralCompleted ? "4과목 모두 수강" : `누락 과목: ${st.missingSciGeneral.join(", ")}`, "4과목 필수", st.sciGeneralCompleted ? "충족" : "미달"],
      ["[과학중점과정] 과학 진로선택 이수 과목수", `${st.sciAdvancedCount} 과목`, "6과목 이상", st.sciAdvancedCompleted ? "충족" : `미달 (${st.sciAdvancedCount}/6)`]
    );
  }

  diagRows.push([""]);
  diagRows.push(["교과(군)별 이수 학점 세부 내역"]);
  diagRows.push(["교과군", "이수 학점", "비중"]);

  Object.entries(validation.categoryBreakdown).forEach(([cat, cr]) => {
    const ratio = validation.totalCredits > 0 ? ((cr / validation.totalCredits) * 100).toFixed(1) : 0;
    diagRows.push([cat, `${cr}학점`, `${ratio}%`]);
  });

  const wsDiag = XLSX.utils.aoa_to_sheet(diagRows);
  wsDiag["!cols"] = [
    { wch: 32 },
    { wch: 22 },
    { wch: 20 },
    { wch: 22 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wsSelected, "선택과목목록");
  XLSX.utils.book_append_sheet(wb, wsDiag, "진단보고서");

  XLSX.writeFile(wb, `고교학점제_과목선택_진단결과_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
