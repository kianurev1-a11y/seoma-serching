import { BidNotice, CompanyCriteria, FitnessResult } from '../types';

export interface EvaluationResult {
  fitnessResult: FitnessResult;
  fitnessScore: number;
  matchedCriteria: string[];
  fitnessReason: string;
  targetAgencyMatched?: boolean;
  specializedProductMatch?: string;
}

/**
 * Heuristic AI Rule Engine for evaluating bid suitability based on (주)세오 2026년 기업 기준 및 PRD F-2.
 * Rule:
 * 1. 세오 기준(업태/업종 면허, 보유 실적, 보유 인증, 타겟 발주처 가점) 중 2가지 이상 복합 매칭 시 '적합' (70~100점)
 * 2. 1개 항목 매칭 또는 지역제한/공동수급 검토 필요 시 '보류' (40~69점)
 * 3. 세오 사업 분야와 무관한 면허(철도신호, 배관, 순수토목 등) 또는 단순 경비/문구 등은 '부적합' (<40점)
 */
export function evaluateNoticeSuitability(
  notice: Pick<BidNotice, 'noticeName' | 'qualification' | 'organization' | 'businessSummary' | 'contractMethod'>,
  criteria: CompanyCriteria
): EvaluationResult {
  const fullText = `${notice.noticeName} ${notice.qualification || ''} ${notice.businessSummary || ''} ${notice.organization || ''} ${notice.contractMethod || ''}`.toLowerCase();

  const matchedBusinessTypes: string[] = [];
  const matchedPerformances: string[] = [];
  const matchedCertifications: string[] = [];
  const matchedAgencies: string[] = [];

  // 1. 업태·업종 면허 검증
  const businessPatterns = [
    { key: '정보통신공사', label: '정보통신공사업 면허 충족' },
    { key: '전기공사', label: '전기공사업 면허 충족' },
    { key: '소프트웨어사업자', label: '소프트웨어사업자(컴퓨터관련서비스사업) 자격 부합' },
    { key: '컴퓨터관련서비스', label: '소프트웨어사업자(컴퓨터관련서비스사업) 자격 부합' },
    { key: '직접생산', label: '영상감시장치 직접생산확인증명(4617162201) 보유' },
    { key: '영상감시장치', label: '영상감시장치 직접생산 요건 부합' },
    { key: '폐쇄회로', label: 'CCTV 및 영상감시설비 제조 자격 충족' },
    { key: '무인교통', label: '무인교통감시장치 제조 및 구축 자격 부합' },
    { key: '계장제어', label: '계장제어장치 제조 및 S/W개발 역량 부합' },
    { key: '스마트시티', label: '스마트시티 통합플랫폼 기반구축 전문역량 부합' },
  ];

  for (const p of businessPatterns) {
    if (fullText.includes(p.key.toLowerCase())) {
      if (!matchedBusinessTypes.includes(p.label)) matchedBusinessTypes.push(p.label);
    }
  }

  // 2. 보유 실적 검증 (수주 39건 143억 CCTV 유지보수 강점 반영)
  const performancePatterns = [
    { key: '유지관리', label: 'CCTV 통합관제 및 통신망 유지보수 실적 부합 (세오 1위 주력 분야)' },
    { key: '유지보수', label: 'CCTV 통합관제 및 통신망 유지보수 실적 부합 (세오 1위 주력 분야)' },
    { key: '통합관제', label: '지자체 통합관제센터 및 AI 선별관제 구축 실적 부합' },
    { key: '선별관제', label: 'AI 딥러닝 선별관제 및 객체인식 실적 충족' },
    { key: '방범', label: '방범 및 어린이보호구역 감시 시스템 구축 실적 부합' },
    { key: '불법주정차', label: '불법주정차 무인단속시스템(LPR) 구축 납품 실적 부합' },
    { key: '단속', label: '다차선 무인교통단속(과속·신호) 납품 실적 충족' },
    { key: '스마트시티', label: '스마트도시 통합플랫폼 5대 연계서비스 실적 충족' },
    { key: '스마트도시', label: '스마트도시 통합플랫폼 5대 연계서비스 실적 충족' },
    { key: '과학화경계', label: '군 JSA·사령부 과학화 경계감시 시스템 실적 충족' },
    { key: '경계감시', label: '국방 외곽침입경계 및 지능형 감시시스템 실적 충족' },
    { key: '물관리', label: '하천 AI 수위예측 및 수문 자동제어(bluelock) 실적 부합' },
    { key: '계장제어', label: '수처리 및 하천 계장제어시스템 구축 실적 부합' },
    { key: '안전관리', label: '위험지역 AI 인명안전 영상분석 실적 충족' },
    { key: '항만', label: '항만청·세관 감시관제 구축 실적 부합' },
    { key: '철도', label: '철도·지하철 승강장 CCTV 감시 실적 충족' },
  ];

  for (const p of performancePatterns) {
    if (fullText.includes(p.key.toLowerCase())) {
      if (!matchedPerformances.includes(p.label)) matchedPerformances.push(p.label);
    }
  }

  // 3. 보유 인증·지정 검증 (NEP, 혁신제품, 조달우수, GS 1등급, KCMVP)
  const certPatterns = [
    { key: '우수조달', label: '조달청 우수제품 등록 솔루션 보유 (CCTV·교통·계장제어 4개 지정)' },
    { key: '조달우수', label: '조달청 우수제품 등록 솔루션 보유 (CCTV·교통·계장제어 4개 지정)' },
    { key: 'nep', label: '산업통상자원부 신제품(NEP) 인증 보유 (암호화 영상감시장치)' },
    { key: '신제품', label: '산업통상자원부 신제품(NEP) 인증 보유 (암호화 영상감시장치)' },
    { key: '혁신제품', label: '국가지정 혁신제품 보유 (3D 포인트클라우드, 스마트물관리, 위험안전)' },
    { key: '암호화', label: '국정원 KCMVP 인증 실시간 CCTV 통신구간 암호화(CUBE HIDE) 충족' },
    { key: 'kcmvp', label: '국정원 KCMVP 인증 실시간 CCTV 통신구간 암호화(CUBE HIDE) 충족' },
    { key: 'gs', label: 'GS(Good Software) 1등급 인증 소프트웨어 보유' },
    { key: '품질보증', label: '조달청 품질보증조달물품 지정 (B+ 등급)' },
    { key: '성능인증', label: '중소벤처기업부 성능인증(EPC) 충족' },
  ];

  for (const p of certPatterns) {
    if (fullText.includes(p.key.toLowerCase())) {
      if (!matchedCertifications.includes(p.label)) matchedCertifications.push(p.label);
    }
  }

  // 4. 세오 11대 확장 발주처 및 수주 강점 발주처 가점
  const targetAgenciesList = criteria.targetAgencies || [
    '국방', '육군', '해군', '공군', '해병대', '경찰청', '철도', '공항', '항만', '방위사업청', 'ITS',
    '지자체', '관세청', '세관', '한국어촌어항공단', '한국도로교통공단'
  ];

  let targetAgencyMatched = false;
  for (const agency of targetAgenciesList) {
    if (notice.organization.includes(agency) || fullText.includes(agency.toLowerCase())) {
      targetAgencyMatched = true;
      matchedAgencies.push(`타겟 발주처 가점: ${agency} 관련 기관`);
    }
  }

  // 5. 세오 6대 주력 제품 연계 추천
  let specializedProductMatch = '세오 통합 영상보안 플랫폼';
  if (fullText.includes('과속') || fullText.includes('교통단속') || fullText.includes('불법주정차') || fullText.includes('레이더')) {
    specializedProductMatch = '60GHz 다차선 레이더 번호인식 통합형 무인교통단속시스템 (조달우수·혁신제품)';
  } else if (fullText.includes('물관리') || fullText.includes('수문') || fullText.includes('수위') || fullText.includes('하천')) {
    specializedProductMatch = 'bluelock 스마트 물 관리 계장제어시스템 (조달우수·혁신제품)';
  } else if (fullText.includes('암호') || fullText.includes('해킹') || fullText.includes('개인정보') || fullText.includes('보안관제')) {
    specializedProductMatch = 'CUBE HIDE 실시간 통신구간 암호화 영상감시장치 (NEP·KCMVP암호모듈·조달우수)';
  } else if (fullText.includes('라이다') || fullText.includes('3차원') || fullText.includes('포인트클라우드') || fullText.includes('도로감시')) {
    specializedProductMatch = '3차원 포인트 클라우드 데이터 기반 AI 무인교통감시장치 (2026 혁신제품)';
  } else if (fullText.includes('안전') || fullText.includes('작업자') || fullText.includes('발전소') || fullText.includes('이상행동')) {
    specializedProductMatch = '방사형 레이어 GCN 행동·상태인지 AI 시스템 / 산업안전 AI 영상분석';
  } else if (fullText.includes('cctv') || fullText.includes('선별관제') || fullText.includes('방범')) {
    specializedProductMatch = '방사형 레이어 GCN 행동 및 상태인지 AI CCTV 시스템 (조달우수·GS 1등급)';
  }

  // 6. 비관련 면허 및 제외 공고 검출 (단순 청소, 인쇄, 급식, 문구, 배관, 토목 등)
  const isIrrelevantLicense =
    fullText.includes('급식') ||
    fullText.includes('식자재') ||
    fullText.includes('청소용역') && !fullText.includes('cctv') ||
    fullText.includes('경비용역') && !fullText.includes('cctv') && !fullText.includes('관제') ||
    fullText.includes('인쇄') ||
    fullText.includes('배관공사') ||
    fullText.includes('토목공사') && !fullText.includes('cctv') && !fullText.includes('통신');

  const isLocalRestricted = fullText.includes('지역제한') && (fullText.includes('소재지') || fullText.includes('본사'));

  // 점수 계산 (4개 영역)
  const matchedCategoriesCount =
    (matchedBusinessTypes.length > 0 ? 1 : 0) +
    (matchedPerformances.length > 0 ? 1 : 0) +
    (matchedCertifications.length > 0 ? 1 : 0);

  const allMatchedCriteria = [
    ...matchedBusinessTypes.map((m) => `[업태·면허] ${m}`),
    ...matchedPerformances.map((m) => `[보유실적] ${m}`),
    ...matchedCertifications.map((m) => `[보유인증] ${m}`),
    ...matchedAgencies.map((m) => `[발주처] ${m}`),
  ];

  let fitnessResult: FitnessResult = '미판정';
  let fitnessScore = 0;
  let fitnessReason = '';

  if (isIrrelevantLicense) {
    fitnessResult = '부적합';
    fitnessScore = 15;
    fitnessReason = '타 분야 업종(단순노무/건설/식자재 등)이 주 과업으로, 세오의 핵심 역량(정보통신·CCTV·AI영상보안)과 상이함.';
  } else if (isLocalRestricted && matchedCategoriesCount < 2) {
    fitnessResult = '보류';
    fitnessScore = 48;
    fitnessReason = '관할 지역제한 요건이 공고서상에 존재하여 지역 협력사와의 공동수급체(공동이행방식) 구성 검토가 필수적임.';
  } else if (matchedCategoriesCount >= 2) {
    fitnessResult = '적합';
    // 기본 80점 + 카테고리당 5점 + 타겟발주처 가점 5점 + 유지보수 가점 5점
    let score = 80 + matchedCategoriesCount * 4;
    if (targetAgencyMatched) score += 5;
    if (fullText.includes('유지보수') || fullText.includes('유지관리')) score += 5;
    fitnessScore = Math.min(99, score);
    fitnessReason = `세오의 기준 항목 중 ${matchedCategoriesCount}개 차원(${allMatchedCriteria.slice(0, 2).join(', ')})이 복합 충족되며${targetAgencyMatched ? ', 타겟 발주처 가점이 반영된' : ''} 입찰 참여 최우선 권장 공고입니다. [추천제품: ${specializedProductMatch}]`;
  } else if (matchedCategoriesCount === 1 || targetAgencyMatched) {
    fitnessResult = '보류';
    fitnessScore = targetAgencyMatched ? 65 : 55;
    fitnessReason = `세오의 기준 항목 중 1개 차원(${allMatchedCriteria[0] || '일부 키워드'}) 매칭 상태로, 상세 과업지시서 및 참가자격 기준 추가 검토 후 입찰 참여 여부 결정을 권장합니다.`;
  } else {
    fitnessResult = '부적합';
    fitnessScore = 25;
    fitnessReason = '키워드는 검출되었으나 세오의 핵심 업태, 면허, 실적, 인증 기준에 대한 매칭 요건이 미달하여 부적합 판정되었습니다.';
  }

  return {
    fitnessResult,
    fitnessScore,
    matchedCriteria: allMatchedCriteria,
    fitnessReason,
    targetAgencyMatched,
    specializedProductMatch,
  };
}
