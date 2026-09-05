/**
 * 고교학점제 과목 데이터셋 (2022 개정 교육과정 및 표준 고교 편성표 기준)
 * 각 과목은 id, name, credits, category, grade, term, fixed, group, subjectType,
 * 그리고 과학중점과정 판별을 위한 속성(isSciGeneral, isSciAdvanced, isInfo)을 갖습니다.
 */

export const categoryColors = {
  "국어": {
    bg: "#FFE4E6",       // Pastel Rose Light
    border: "#FDA4AF",   // Pastel Rose Border
    text: "#BE123C",     // Deep Rose Text
    accent: "#FB7185"
  },
  "수학": {
    bg: "#DBEAFE",       // Pastel Sky Light
    border: "#93C5FD",   // Pastel Sky Border
    text: "#1D4ED8",     // Deep Sky Text
    accent: "#60A5FA"
  },
  "영어": {
    bg: "#D1FAE5",       // Pastel Mint Light
    border: "#6EE7B7",   // Pastel Mint Border
    text: "#047857",     // Deep Mint Text
    accent: "#34D399"
  },
  "사회": {
    bg: "#FFEDD5",       // Pastel Peach Light
    border: "#FDBA74",   // Pastel Peach Border
    text: "#C2410C",     // Deep Peach Text
    accent: "#FB923C"
  },
  "과학": {
    bg: "#CFFAFE",       // Pastel Ice Cyan Light
    border: "#67E8F9",   // Pastel Cyan Border
    text: "#0E7490",     // Deep Cyan Text
    accent: "#22D3EE"
  },
  "체육": {
    bg: "#FEE2E2",       // Pastel Coral Light
    border: "#FCA5A5",   // Pastel Coral Border
    text: "#B91C1C",     // Deep Red Text
    accent: "#F87171"
  },
  "예술": {
    bg: "#EDE9FE",       // Pastel Lavender Light
    border: "#C4B5FD",   // Pastel Lavender Border
    text: "#6D28D9",     // Deep Purple Text
    accent: "#A78BFA"
  },
  "기술·가정/정보/제2외국어/한문/교양": {
    bg: "#F1F5F9",       // Pastel Slate Light
    border: "#CBD5E1",   // Pastel Slate Border
    text: "#475569",     // Deep Slate Text
    accent: "#94A3B8"
  }
};

export const defaultSelectGroups = {
  "g2_1_s1": {
    id: "g2_1_s1",
    name: "2학년 1학기 사회·과학 선택군",
    max: 4,
    grade: 2,
    term: 1,
    desc: "사회 및 과학 과목 중 4과목 선택"
  },
  "g2_1_s2": {
    id: "g2_1_s2",
    name: "2학년 1학기 외국어·정보·한문 선택군",
    max: 1,
    grade: 2,
    term: 1,
    desc: "제2외국어, 정보, 한문 중 1과목 선택"
  },
  "g2_2_s1": {
    id: "g2_2_s1",
    name: "2학년 2학기 융합/선택과목군",
    max: 5,
    grade: 2,
    term: 2,
    desc: "국·영·수·사·과 심화/융합 선택과목 중 5과목 선택"
  },
  "g2_2_s2": {
    id: "g2_2_s2",
    name: "2학년 2학기 외국어·정보·한문·교양 선택군",
    max: 1,
    grade: 2,
    term: 2,
    desc: "외국어, 인공지능, 한문 과목 중 1과목 선택"
  },
  "g3_1_s1": {
    id: "g3_1_s1",
    name: "3학년 1학기 수학 진로선택군",
    max: 1,
    grade: 3,
    term: 1,
    desc: "미적분Ⅱ 또는 경제 수학 중 1과목 선택"
  },
  "g3_1_s2": {
    id: "g3_1_s2",
    name: "3학년 1학기 융합/선택과목군",
    max: 4,
    grade: 3,
    term: 1,
    desc: "국·영·수·사·과 심화 진로선택 과목 중 4과목 선택"
  },
  "g3_1_s3": {
    id: "g3_1_s3",
    name: "3학년 1학기 교양/외국어/정보 선택군",
    max: 1,
    grade: 3,
    term: 1,
    desc: "교양, 심화외국어, 데이터과학 중 1과목 선택"
  },
  "g3_2_s1": {
    id: "g3_2_s1",
    name: "3학년 2학기 융합/선택과목군",
    max: 4,
    grade: 3,
    term: 2,
    desc: "국·영·수·사·과 진로/융합선택 과목 중 4과목 선택"
  },
  "g3_2_s2": {
    id: "g3_2_s2",
    name: "3학년 2학기 외국어·교양/정보 선택군",
    max: 1,
    grade: 3,
    term: 2,
    desc: "외국어, 소프트웨어, 한문 중 1과목 선택"
  }
};

export const defaultSubjects = [
  // ==========================================
  // 1학년 1학기 (모두 학교 지정 공통과목)
  // ==========================================
  { id: "1_1_f1", name: "공통국어1", credits: 4, category: "국어", fixed: true, grade: 1, term: 1, group: null, subjectType: "공통" },
  { id: "1_1_f2", name: "공통수학1", credits: 4, category: "수학", fixed: true, grade: 1, term: 1, group: null, subjectType: "공통" },
  { id: "1_1_f3", name: "공통영어1", credits: 4, category: "영어", fixed: true, grade: 1, term: 1, group: null, subjectType: "공통" },
  { id: "1_1_f4", name: "한국사1", credits: 3, category: "사회", fixed: true, grade: 1, term: 1, group: null, subjectType: "공통" },
  { id: "1_1_f5", name: "통합사회1", credits: 4, category: "사회", fixed: true, grade: 1, term: 1, group: null, subjectType: "공통" },
  { id: "1_1_f6", name: "통합과학1", credits: 4, category: "과학", fixed: true, grade: 1, term: 1, group: null, subjectType: "공통" },
  { id: "1_1_f7", name: "과학탐구실험1", credits: 1, category: "과학", fixed: true, grade: 1, term: 1, group: null, subjectType: "공통" },
  { id: "1_1_f8", name: "체육1", credits: 2, category: "체육", fixed: true, grade: 1, term: 1, group: null, subjectType: "공통" },
  { id: "1_1_f9", name: "음악", credits: 2, category: "예술", fixed: true, grade: 1, term: 1, group: null, subjectType: "일반선택" },
  { id: "1_1_f10", name: "생태와 환경", credits: 2, category: "기술·가정/정보/제2외국어/한문/교양", fixed: true, grade: 1, term: 1, group: null, subjectType: "교양" },

  // ==========================================
  // 1학년 2학기 (모두 학교 지정 공통과목)
  // ==========================================
  { id: "1_2_f1", name: "공통국어2", credits: 4, category: "국어", fixed: true, grade: 1, term: 2, group: null, subjectType: "공통" },
  { id: "1_2_f2", name: "공통수학2", credits: 4, category: "수학", fixed: true, grade: 1, term: 2, group: null, subjectType: "공통" },
  { id: "1_2_f3", name: "공통영어2", credits: 4, category: "영어", fixed: true, grade: 1, term: 2, group: null, subjectType: "공통" },
  { id: "1_2_f4", name: "한국사2", credits: 3, category: "사회", fixed: true, grade: 1, term: 2, group: null, subjectType: "공통" },
  { id: "1_2_f5", name: "통합사회2", credits: 4, category: "사회", fixed: true, grade: 1, term: 2, group: null, subjectType: "공통" },
  { id: "1_2_f6", name: "통합과학2", credits: 4, category: "과학", fixed: true, grade: 1, term: 2, group: null, subjectType: "공통" },
  { id: "1_2_f7", name: "과학탐구실험2", credits: 1, category: "과학", fixed: true, grade: 1, term: 2, group: null, subjectType: "공통" },
  { id: "1_2_f8", name: "체육2", credits: 2, category: "체육", fixed: true, grade: 1, term: 2, group: null, subjectType: "공통" },
  { id: "1_2_f9", name: "미술", credits: 2, category: "예술", fixed: true, grade: 1, term: 2, group: null, subjectType: "일반선택" },
  { id: "1_2_f10", name: "세계시민", credits: 2, category: "기술·가정/정보/제2외국어/한문/교양", fixed: true, grade: 1, term: 2, group: null, subjectType: "교양" },

  // ==========================================
  // 2학년 1학기
  // ==========================================
  // 학교 지정 과목
  { id: "2_1_f1", name: "문학", credits: 3, category: "국어", fixed: true, grade: 2, term: 1, group: null, subjectType: "일반선택" },
  { id: "2_1_f2", name: "대수", credits: 3, category: "수학", fixed: true, grade: 2, term: 1, group: null, subjectType: "일반선택" },
  { id: "2_1_f3", name: "확률과 통계", credits: 3, category: "수학", fixed: true, grade: 2, term: 1, group: null, subjectType: "일반선택" },
  { id: "2_1_f4", name: "영어Ⅰ", credits: 3, category: "영어", fixed: true, grade: 2, term: 1, group: null, subjectType: "일반선택" },
  { id: "2_1_f5", name: "스포츠 생활1", credits: 2, category: "체육", fixed: true, grade: 2, term: 1, group: null, subjectType: "진로선택" },

  // 선택군 1: 사회·과학 선택 (택 4)
  { id: "2_1_s1_1", name: "사회와 문화", credits: 3, category: "사회", fixed: false, grade: 2, term: 1, group: "g2_1_s1", subjectType: "일반선택" },
  { id: "2_1_s1_2", name: "현대사회와 윤리", credits: 3, category: "사회", fixed: false, grade: 2, term: 1, group: "g2_1_s1", subjectType: "일반선택" },
  { id: "2_1_s1_3", name: "세계사", credits: 3, category: "사회", fixed: false, grade: 2, term: 1, group: "g2_1_s1", subjectType: "일반선택" },
  { id: "2_1_s1_4", name: "세계시민과 지리", credits: 3, category: "사회", fixed: false, grade: 2, term: 1, group: "g2_1_s1", subjectType: "일반선택" },
  { id: "2_1_s1_5", name: "물리학", credits: 3, category: "과학", fixed: false, grade: 2, term: 1, group: "g2_1_s1", subjectType: "일반선택", isSciGeneral: true },
  { id: "2_1_s1_6", name: "화학", credits: 3, category: "과학", fixed: false, grade: 2, term: 1, group: "g2_1_s1", subjectType: "일반선택", isSciGeneral: true },
  { id: "2_1_s1_7", name: "생명과학", credits: 3, category: "과학", fixed: false, grade: 2, term: 1, group: "g2_1_s1", subjectType: "일반선택", isSciGeneral: true },
  { id: "2_1_s1_8", name: "지구과학", credits: 3, category: "과학", fixed: false, grade: 2, term: 1, group: "g2_1_s1", subjectType: "일반선택", isSciGeneral: true },

  // 선택군 2: 외국어·정보·한문 선택 (택 1)
  { id: "2_1_s2_1", name: "중국어", credits: 3, category: "기술·가정/정보/제2외국어/한문/교양", fixed: false, grade: 2, term: 1, group: "g2_1_s2", subjectType: "일반선택" },
  { id: "2_1_s2_2", name: "일본어", credits: 3, category: "기술·가정/정보/제2외국어/한문/교양", fixed: false, grade: 2, term: 1, group: "g2_1_s2", subjectType: "일반선택" },
  { id: "2_1_s2_3", name: "정보", credits: 3, category: "기술·가정/정보/제2외국어/한문/교양", fixed: false, grade: 2, term: 1, group: "g2_1_s2", subjectType: "일반선택", isInfo: true },
  { id: "2_1_s2_4", name: "한문", credits: 3, category: "기술·가정/정보/제2외국어/한문/교양", fixed: false, grade: 2, term: 1, group: "g2_1_s2", subjectType: "일반선택" },

  // ==========================================
  // 2학년 2학기
  // ==========================================
  // 학교 지정 과목
  { id: "2_2_f1", name: "독서와 작문", credits: 3, category: "국어", fixed: true, grade: 2, term: 2, group: null, subjectType: "일반선택" },
  { id: "2_2_f2", name: "미적분Ⅰ", credits: 3, category: "수학", fixed: true, grade: 2, term: 2, group: null, subjectType: "일반선택" },
  { id: "2_2_f3", name: "영어Ⅱ", credits: 3, category: "영어", fixed: true, grade: 2, term: 2, group: null, subjectType: "일반선택" },
  { id: "2_2_f4", name: "스포츠 생활2", credits: 2, category: "체육", fixed: true, grade: 2, term: 2, group: null, subjectType: "진로선택" },

  // 선택군 1: 융합/선택과목군 (택 5)
  { id: "2_2_s1_1", name: "언어생활 탐구", credits: 3, category: "국어", fixed: false, grade: 2, term: 2, group: "g2_2_s1", subjectType: "융합선택" },
  { id: "2_2_s1_2", name: "기하", credits: 3, category: "수학", fixed: false, grade: 2, term: 2, group: "g2_2_s1", subjectType: "진로선택" },
  { id: "2_2_s1_3", name: "영미 문학 읽기", credits: 3, category: "영어", fixed: false, grade: 2, term: 2, group: "g2_2_s1", subjectType: "진로선택" },
  { id: "2_2_s1_4", name: "법과 사회", credits: 3, category: "사회", fixed: false, grade: 2, term: 2, group: "g2_2_s1", subjectType: "일반선택" },
  { id: "2_2_s1_5", name: "윤리와 사상", credits: 3, category: "사회", fixed: false, grade: 2, term: 2, group: "g2_2_s1", subjectType: "일반선택" },
  { id: "2_2_s1_6", name: "동아시아 역사 기행", credits: 3, category: "사회", fixed: false, grade: 2, term: 2, group: "g2_2_s1", subjectType: "진로선택" },
  { id: "2_2_s1_7", name: "한국지리 탐구", credits: 3, category: "사회", fixed: false, grade: 2, term: 2, group: "g2_2_s1", subjectType: "진로선택" },
  { id: "2_2_s1_8", name: "사회문제 탐구", credits: 3, category: "사회", fixed: false, grade: 2, term: 2, group: "g2_2_s1", subjectType: "융합선택" },
  { id: "2_2_s1_9", name: "역학과 에너지", credits: 3, category: "과학", fixed: false, grade: 2, term: 2, group: "g2_2_s1", subjectType: "진로선택", isSciAdvanced: true },
  { id: "2_2_s1_10", name: "화학 반응의 세계", credits: 3, category: "과학", fixed: false, grade: 2, term: 2, group: "g2_2_s1", subjectType: "진로선택", isSciAdvanced: true },
  { id: "2_2_s1_11", name: "세포와 물질대사", credits: 3, category: "과학", fixed: false, grade: 2, term: 2, group: "g2_2_s1", subjectType: "진로선택", isSciAdvanced: true },
  { id: "2_2_s1_12", name: "지구시스템과학", credits: 3, category: "과학", fixed: false, grade: 2, term: 2, group: "g2_2_s1", subjectType: "진로선택", isSciAdvanced: true },
  { id: "2_2_s1_13", name: "과학과제 연구", credits: 3, category: "과학", fixed: false, grade: 2, term: 2, group: "g2_2_s1", subjectType: "진로선택", isSciAdvanced: true },

  // 선택군 2: 외국어·정보·한문·교양 선택 (택 1)
  { id: "2_2_s2_1", name: "중국 문화", credits: 3, category: "기술·가정/정보/제2외국어/한문/교양", fixed: false, grade: 2, term: 2, group: "g2_2_s2", subjectType: "융합선택" },
  { id: "2_2_s2_2", name: "일본어 회화", credits: 3, category: "기술·가정/정보/제2외국어/한문/교양", fixed: false, grade: 2, term: 2, group: "g2_2_s2", subjectType: "진로선택" },
  { id: "2_2_s2_3", name: "인공지능 기초", credits: 3, category: "기술·가정/정보/제2외국어/한문/교양", fixed: false, grade: 2, term: 2, group: "g2_2_s2", subjectType: "진로선택", isInfo: true },
  { id: "2_2_s2_4", name: "언어생활과 한자", credits: 3, category: "기술·가정/정보/제2외국어/한문/교양", fixed: false, grade: 2, term: 2, group: "g2_2_s2", subjectType: "융합선택" },

  // ==========================================
  // 3학년 1학기
  // ==========================================
  // 학교 지정 과목
  { id: "3_1_f1", name: "화법과 언어", credits: 3, category: "국어", fixed: true, grade: 3, term: 1, group: null, subjectType: "일반선택" },
  { id: "3_1_f2", name: "영어 독해와 작문", credits: 3, category: "영어", fixed: true, grade: 3, term: 1, group: null, subjectType: "일반선택" },
  { id: "3_1_f3", name: "스포츠 과학", credits: 1, category: "체육", fixed: true, grade: 3, term: 1, group: null, subjectType: "진로선택" },
  { id: "3_1_f4", name: "음악 감상과 비평", credits: 3, category: "예술", fixed: true, grade: 3, term: 1, group: null, subjectType: "진로선택" },

  // 선택군 1: 수학 진로선택 (택 1)
  { id: "3_1_s1_1", name: "미적분Ⅱ", credits: 3, category: "수학", fixed: false, grade: 3, term: 1, group: "g3_1_s1", subjectType: "진로선택" },
  { id: "3_1_s1_2", name: "경제 수학", credits: 3, category: "수학", fixed: false, grade: 3, term: 1, group: "g3_1_s1", subjectType: "진로선택" },

  // 선택군 2: 융합/선택과목군 (택 4)
  { id: "3_1_s2_1", name: "문학과 영상", credits: 3, category: "국어", fixed: false, grade: 3, term: 1, group: "g3_1_s2", subjectType: "진로선택" },
  { id: "3_1_s2_2", name: "인공지능 수학", credits: 3, category: "수학", fixed: false, grade: 3, term: 1, group: "g3_1_s2", subjectType: "진로선택" },
  { id: "3_1_s2_3", name: "심화 영어", credits: 3, category: "영어", fixed: false, grade: 3, term: 1, group: "g3_1_s2", subjectType: "진로선택" },
  { id: "3_1_s2_4", name: "국제 관계의 이해", credits: 3, category: "사회", fixed: false, grade: 3, term: 1, group: "g3_1_s2", subjectType: "진로선택" },
  { id: "3_1_s2_5", name: "인문학과 윤리", credits: 3, category: "사회", fixed: false, grade: 3, term: 1, group: "g3_1_s2", subjectType: "진로선택" },
  { id: "3_1_s2_6", name: "도시의 미래 탐구", credits: 3, category: "사회", fixed: false, grade: 3, term: 1, group: "g3_1_s2", subjectType: "진로선택" },
  { id: "3_1_s2_7", name: "기후변화와 지속가능한 세계", credits: 3, category: "사회", fixed: false, grade: 3, term: 1, group: "g3_1_s2", subjectType: "융합선택" },
  { id: "3_1_s2_8", name: "전자기와 양자", credits: 3, category: "과학", fixed: false, grade: 3, term: 1, group: "g3_1_s2", subjectType: "진로선택", isSciAdvanced: true },
  { id: "3_1_s2_9", name: "물질과 에너지", credits: 3, category: "과학", fixed: false, grade: 3, term: 1, group: "g3_1_s2", subjectType: "진로선택", isSciAdvanced: true },
  { id: "3_1_s2_10", name: "생물의 유전", credits: 3, category: "과학", fixed: false, grade: 3, term: 1, group: "g3_1_s2", subjectType: "진로선택", isSciAdvanced: true },
  { id: "3_1_s2_11", name: "행성우주과학", credits: 3, category: "과학", fixed: false, grade: 3, term: 1, group: "g3_1_s2", subjectType: "진로선택", isSciAdvanced: true },

  // 선택군 3: 교양/외국어/정보 선택 (택 1)
  { id: "3_1_s3_1", name: "인간과 심리", credits: 3, category: "기술·가정/정보/제2외국어/한문/교양", fixed: false, grade: 3, term: 1, group: "g3_1_s3", subjectType: "교양" },
  { id: "3_1_s3_2", name: "심화 일본어", credits: 3, category: "기술·가정/정보/제2외국어/한문/교양", fixed: false, grade: 3, term: 1, group: "g3_1_s3", subjectType: "진로선택" },
  { id: "3_1_s3_3", name: "데이터 과학", credits: 3, category: "기술·가정/정보/제2외국어/한문/교양", fixed: false, grade: 3, term: 1, group: "g3_1_s3", subjectType: "진로선택", isInfo: true },
  { id: "3_1_s3_4", name: "생활과 한문", credits: 3, category: "기술·가정/정보/제2외국어/한문/교양", fixed: false, grade: 3, term: 1, group: "g3_1_s3", subjectType: "일반선택" },

  // ==========================================
  // 3학년 2학기
  // ==========================================
  // 학교 지정 과목
  { id: "3_2_f1", name: "독서 토론과 글쓰기", credits: 3, category: "국어", fixed: true, grade: 3, term: 2, group: null, subjectType: "융합선택" },
  { id: "3_2_f2", name: "심화 영어 독해와 작문", credits: 3, category: "영어", fixed: true, grade: 3, term: 2, group: null, subjectType: "진로선택" },
  { id: "3_2_f3", name: "스포츠 문화", credits: 1, category: "체육", fixed: true, grade: 3, term: 2, group: null, subjectType: "진로선택" },
  { id: "3_2_f4", name: "미술 감상과 비평", credits: 3, category: "예술", fixed: true, grade: 3, term: 2, group: null, subjectType: "진로선택" },
  { id: "3_2_f5", name: "융합사고 수학", credits: 3, category: "수학", fixed: true, grade: 3, term: 2, group: null, subjectType: "진로선택" },

  // 선택군 1: 융합/선택과목군 (택 4)
  { id: "3_2_s1_1", name: "주제 탐구 독서", credits: 3, category: "국어", fixed: false, grade: 3, term: 2, group: "g3_2_s1", subjectType: "진로선택" },
  { id: "3_2_s1_2", name: "수학과 문화", credits: 3, category: "수학", fixed: false, grade: 3, term: 2, group: "g3_2_s1", subjectType: "융합선택" },
  { id: "3_2_s1_3", name: "미디어 영어", credits: 3, category: "영어", fixed: false, grade: 3, term: 2, group: "g3_2_s1", subjectType: "융합선택" },
  { id: "3_2_s1_4", name: "여행지리", credits: 3, category: "사회", fixed: false, grade: 3, term: 2, group: "g3_2_s1", subjectType: "융합선택" },
  { id: "3_2_s1_5", name: "윤리문제 탐구", credits: 3, category: "사회", fixed: false, grade: 3, term: 2, group: "g3_2_s1", subjectType: "융합선택" },
  { id: "3_2_s1_6", name: "금융과 경제생활", credits: 3, category: "사회", fixed: false, grade: 3, term: 2, group: "g3_2_s1", subjectType: "융합선택" },
  { id: "3_2_s1_7", name: "역사로 탐구하는 현대세계", credits: 3, category: "사회", fixed: false, grade: 3, term: 2, group: "g3_2_s1", subjectType: "융합선택" },
  { id: "3_2_s1_8", name: "과학의 역사와 문화", credits: 3, category: "과학", fixed: false, grade: 3, term: 2, group: "g3_2_s1", subjectType: "융합선택", isSciAdvanced: true },
  { id: "3_2_s1_9", name: "기후변화와 환경생태", credits: 3, category: "과학", fixed: false, grade: 3, term: 2, group: "g3_2_s1", subjectType: "융합선택", isSciAdvanced: true },
  { id: "3_2_s1_10", name: "융합과학 탐구", credits: 3, category: "과학", fixed: false, grade: 3, term: 2, group: "g3_2_s1", subjectType: "융합선택", isSciAdvanced: true },

  // 선택군 2: 외국어·교양/정보 선택 (택 1)
  { id: "3_2_s2_1", name: "중국 언어와 역사의 이해1", credits: 3, category: "기술·가정/정보/제2외국어/한문/교양", fixed: false, grade: 3, term: 2, group: "g3_2_s2", subjectType: "진로선택" },
  { id: "3_2_s2_2", name: "일본 문화", credits: 3, category: "기술·가정/정보/제2외국어/한문/교양", fixed: false, grade: 3, term: 2, group: "g3_2_s2", subjectType: "융합선택" },
  { id: "3_2_s2_3", name: "소프트웨어와 생활", credits: 3, category: "기술·가정/정보/제2외국어/한문/교양", fixed: false, grade: 3, term: 2, group: "g3_2_s2", subjectType: "융합선택", isInfo: true },
  { id: "3_2_s2_4", name: "한문 고전 읽기", credits: 3, category: "기술·가정/정보/제2외국어/한문/교양", fixed: false, grade: 3, term: 2, group: "g3_2_s2", subjectType: "진로선택" }
];
