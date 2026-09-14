export type NoticeType = '사전규격' | '입찰공고' | '개찰결과';
export type FitnessResult = '적합' | '보류' | '부적합' | '미판정';

export interface Attachment {
  name: string;
  url: string;
  size?: string;
}

export interface BidNotice {
  id: string;
  noticeType: NoticeType;
  noticeNo: string;
  noticeName: string;
  organization: string; // 발주(수요)기관
  noticeDate: string; // YYYY-MM-DD
  deadlineDate: string; // YYYY-MM-DD HH:mm
  budgetAmount: number; // KRW (배정예산 또는 추정가격)
  contractMethod: string; // 계약방법 (일반경쟁, 제한경쟁, 수의계약 등)
  category: '용역' | '물품' | '공사' | '기타';
  qualification: string; // 참가자격 요약
  businessSummary: string; // 사업개요 / 세부품명
  attachments: Attachment[];
  sourceUrl: string; // 나라장터 원문 링크 (bidNtceDtlUrl)
  matchedKeyword: string;
  fitnessResult: FitnessResult;
  fitnessScore: number; // 0 ~ 100
  matchedCriteria: string[]; // 매칭된 세오 기준 항목들 (업태, 실적, 인증, 발주처 등)
  fitnessReason: string; // 판단 근거 상세
  collectedAt: string; // 수집 일시
  isRealApi?: boolean; // 조달청 OpenAPI 실시간 수집 여부
  
  // 나라장터 OpenAPI v1.2 연동 상세 항목
  ntceKindNm?: string; // 공고종류명 (등록공고, 변경공고, 재공고)
  sucsfbidMthdNm?: string; // 낙찰방법명 (협상에의한계약, 적격심사 등)
  techAbltEvlRt?: number; // 기술능력평가비율 (%)
  bidPrceEvlRt?: number; // 입찰가격평가비율 (%)
  sucsfbidLwltRate?: number; // 낙찰하한율 (%)
  indstrytyLmtYn?: string; // 업종제한여부 (Y/N)
  cmmnSpldmdMethdNm?: string; // 공동수급방식명
  rgnLmtBidLocplcJdgmBssNm?: string; // 참가가능지역/소재지

  // (주)세오 특화 분석 항목
  targetAgencyMatched?: boolean; // 세오 11대 확장 발주처 매칭 여부
  specializedProductMatch?: string; // 세오 6대 주력 제품 연계 추천

  // 개찰결과 전용 필드
  winnerCompany?: string; // 낙찰업체
  bidAmount?: number; // 투찰금액
  techScore?: number; // 기술평가점수
  priceScore?: number; // 가격평가점수
  successRate?: number; // 낙찰률 (%)
}

export interface CompanyCriteria {
  companyName: string;
  ceoName: string;
  establishedYear: string;
  businessRegistrationNo: string;
  headquarters: string;
  businessTypes: string[]; // 업태 및 업종 면허
  performances: string[]; // 보유 실적
  certifications: string[]; // 보유 인증 및 지정 (NEP, 혁신제품, 조달우수, GS, KCMVP 등)
  targetAgencies: string[]; // 핵심 확장 발주처 (국방, 경찰청, 철도, 지자체 등)
  specializedProducts: string[]; // 6대 주력 솔루션 (GCN, CUBE HIDE, 60GHz레이더, bluelock 등)
}

export interface AppConfig {
  keywords: string[];
  scheduleMorning: string; // "09:00"
  scheduleAfternoon: string; // "15:00"
  autoScheduleEnabled: boolean;
  openApiKey?: string;
  companyCriteria: CompanyCriteria;
}

export interface CrawlLog {
  id: string;
  timestamp: string;
  trigger: 'scheduled' | 'manual';
  status: 'success' | 'partial' | 'failed';
  collectedCount: number;
  fitCount: number;
  message: string;
  breakdown?: {
    preSpecCount: number;
    bidNoticeCount: number;
    resultCount: number;
  };
}

export interface ApiOperationStatus {
  id: string;
  name: string;
  operationCode: string;
  status: 'ok' | 'fail';
  responseTime: number;
  itemCount: number;
}

export interface ApiStatusInfo {
  isConnected: boolean;
  serviceKeyConfigured: boolean;
  maskedKey: string;
  statusMessage: string;
  latencyMs: number;
  operations: ApiOperationStatus[];
  sampleNotice?: {
    bidNtceNo: string;
    bidNtceNm: string;
    dminsttNm: string;
    bidNtceDt: string;
    budgetAmount?: number;
  } | null;
  timestamp: string;
}

export interface DashboardFilter {
  tab: NoticeType;
  searchKeyword: string;
  selectedMatchedKeyword: string; // 'ALL' or specific
  fitnessFilter: 'ALL' | FitnessResult;
  agencyFilter: string; // 'ALL' or specific target agency
  dateRange: 'all' | 'today' | '3days' | '7days';
  sortBy: keyof BidNotice;
  sortOrder: 'asc' | 'desc';
}
