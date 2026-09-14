import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Clock,
  Briefcase,
  Award,
  ShieldCheck,
  RotateCcw,
  Check,
  Key,
  HelpCircle,
} from 'lucide-react';
import { AppConfig } from '../types';
import { DEFAULT_CONFIG } from '../data/mockNotices';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onSaveConfig: (newConfig: AppConfig) => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'keywords' | 'criteria' | 'company' | 'schedule' | 'api'>('keywords');
  const [editedConfig, setEditedConfig] = useState<AppConfig>({ ...config });
  const [newKeyword, setNewKeyword] = useState('');
  const [newBusinessType, setNewBusinessType] = useState('');
  const [newPerformance, setNewPerformance] = useState('');
  const [newCert, setNewCert] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAddKeyword = () => {
    const trimmed = newKeyword.trim();
    if (trimmed && !editedConfig.keywords.includes(trimmed)) {
      setEditedConfig({
        ...editedConfig,
        keywords: [...editedConfig.keywords, trimmed],
      });
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setEditedConfig({
      ...editedConfig,
      keywords: editedConfig.keywords.filter((k) => k !== kw),
    });
  };

  const handleAddBusinessType = () => {
    const trimmed = newBusinessType.trim();
    if (trimmed) {
      setEditedConfig({
        ...editedConfig,
        companyCriteria: {
          ...editedConfig.companyCriteria,
          businessTypes: [...editedConfig.companyCriteria.businessTypes, trimmed],
        },
      });
      setNewBusinessType('');
    }
  };

  const handleRemoveBusinessType = (index: number) => {
    setEditedConfig({
      ...editedConfig,
      companyCriteria: {
        ...editedConfig.companyCriteria,
        businessTypes: editedConfig.companyCriteria.businessTypes.filter((_, i) => i !== index),
      },
    });
  };

  const handleAddPerformance = () => {
    const trimmed = newPerformance.trim();
    if (trimmed) {
      setEditedConfig({
        ...editedConfig,
        companyCriteria: {
          ...editedConfig.companyCriteria,
          performances: [...editedConfig.companyCriteria.performances, trimmed],
        },
      });
      setNewPerformance('');
    }
  };

  const handleRemovePerformance = (index: number) => {
    setEditedConfig({
      ...editedConfig,
      companyCriteria: {
        ...editedConfig.companyCriteria,
        performances: editedConfig.companyCriteria.performances.filter((_, i) => i !== index),
      },
    });
  };

  const handleAddCert = () => {
    const trimmed = newCert.trim();
    if (trimmed) {
      setEditedConfig({
        ...editedConfig,
        companyCriteria: {
          ...editedConfig.companyCriteria,
          certifications: [...editedConfig.companyCriteria.certifications, trimmed],
        },
      });
      setNewCert('');
    }
  };

  const handleRemoveCert = (index: number) => {
    setEditedConfig({
      ...editedConfig,
      companyCriteria: {
        ...editedConfig.companyCriteria,
        certifications: editedConfig.companyCriteria.certifications.filter((_, i) => i !== index),
      },
    });
  };

  const handleResetToDefaults = () => {
    if (confirm('모든 키워드 및 세오 적합도 판단 기준을 기본값으로 복원하시겠습니까?')) {
      setEditedConfig({ ...DEFAULT_CONFIG });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveConfig(editedConfig);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 900);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[88vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/80">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              관리자 설정 및 기준 관리
            </h2>
            <p className="text-xs text-slate-500">
              수집 키워드, AI 적합도 판단 기준(업태·실적·인증), 스케줄 주기 설정
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation */}
        <div className="flex border-b border-slate-200 px-5 bg-white text-xs font-medium gap-6">
          <button
            onClick={() => setActiveSubTab('keywords')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              activeSubTab === 'keywords'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            수집 키워드 ({editedConfig.keywords.length})
          </button>
          <button
            onClick={() => setActiveSubTab('criteria')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              activeSubTab === 'criteria'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            세오 적합도 판단 기준 (F-2)
          </button>
          <button
            onClick={() => setActiveSubTab('company')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              activeSubTab === 'company'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            세오 2026 기업 프로필
          </button>
          <button
            onClick={() => setActiveSubTab('schedule')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              activeSubTab === 'schedule'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            자동 스케줄 설정
          </button>
          <button
            onClick={() => setActiveSubTab('api')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              activeSubTab === 'api'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            나라장터 Open API 가이드
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* TAB 1: Keywords Management */}
          {activeSubTab === 'keywords' && (
            <div className="space-y-4">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  새 키워드 등록
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                    placeholder="예: 지능형교통, 선별관제, 라이다 등..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <button
                    onClick={handleAddKeyword}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg inline-flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    추가
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  * 등록된 키워드는 매일 09:00/15:00 스케줄 및 즉시 수집 시 나라장터 3대 구간(사전규격·입찰공고·개찰결과) 검색에 사용됩니다.
                </p>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-2">
                  현재 등록된 키워드 목록 ({editedConfig.keywords.length}개)
                </label>
                <div className="flex flex-wrap gap-2">
                  {editedConfig.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-xs group"
                    >
                      <span>#{kw}</span>
                      <button
                        onClick={() => handleRemoveKeyword(kw)}
                        className="ml-2 text-slate-400 hover:text-rose-600 transition"
                        title="키워드 삭제"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Company Criteria (PRD F-2 & Review 1) */}
          {activeSubTab === 'criteria' && (
            <div className="space-y-6">
              <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 text-blue-900">
                <span className="font-bold block mb-1">
                  AI 입찰 적합도 판단 기준 (PRD F-2 요건)
                </span>
                <p className="text-[11px] leading-relaxed">
                  나라장터 공고가 수집되면 AI가 아래 3대 항목(업태·업종, 보유 실적, 보유 인증) 중{' '}
                  <strong className="font-semibold underline">2가지 이상 연관성</strong>이 충족될 경우 "적합(추천)"으로 판정합니다.
                  담당자 및 관리자는 세오의 최신 면허 및 실적 변경 시 실시간으로 수정할 수 있습니다.
                </p>
              </div>

              {/* 1. 업태 및 업종 코드 */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 flex items-center">
                  <Briefcase className="w-4 h-4 mr-1.5 text-blue-600" />
                  1. 사업자등록 업태 및 업종 코드 ({editedConfig.companyCriteria.businessTypes.length}건)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBusinessType}
                    onChange={(e) => setNewBusinessType(e.target.value)}
                    placeholder="예: 정보통신공사업(0036), 소프트웨어사업자(1426)..."
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                  <button
                    onClick={handleAddBusinessType}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg"
                  >
                    추가
                  </button>
                </div>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {editedConfig.companyCriteria.businessTypes.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
                    >
                      <span>{item}</span>
                      <button
                        onClick={() => handleRemoveBusinessType(idx)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. 보유 실적 */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 flex items-center">
                  <Award className="w-4 h-4 mr-1.5 text-emerald-600" />
                  2. 세오 주요 보유 실적 ({editedConfig.companyCriteria.performances.length}건)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPerformance}
                    onChange={(e) => setNewPerformance(e.target.value)}
                    placeholder="예: 스마트도시 통합플랫폼 구축, AI 선별관제 실적..."
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                  <button
                    onClick={handleAddPerformance}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg"
                  >
                    추가
                  </button>
                </div>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {editedConfig.companyCriteria.performances.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
                    >
                      <span>{item}</span>
                      <button
                        onClick={() => handleRemovePerformance(idx)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. 보유 인증 */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-purple-600" />
                  3. 세오 보유 인증 ({editedConfig.companyCriteria.certifications.length}건)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCert}
                    onChange={(e) => setNewCert(e.target.value)}
                    placeholder="예: GS 1등급, 중기부 성능인증, KISA 지능형 CCTV 인증..."
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                  <button
                    onClick={handleAddCert}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg"
                  >
                    추가
                  </button>
                </div>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {editedConfig.companyCriteria.certifications.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
                    >
                      <span>{item}</span>
                      <button
                        onClick={() => handleRemoveCert(idx)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: Company Profile (2026 SEO Company Profile) */}
          {activeSubTab === 'company' && (
            <div className="space-y-5 text-xs">
              {/* Overview Box */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/60 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[11px]">
                      (주)세오 2026 기업 프로필
                    </span>
                    <span className="text-slate-600 font-medium">안양 본사 · 스마트 ICT &amp; AI 영상 솔루션 전문기업</span>
                  </div>
                  <span className="text-[11px] text-blue-700 font-semibold">설립 2004.10.29 (22년 업력)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/80 p-3 rounded-lg border border-blue-100 mt-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px]">공동 대표이사</span>
                    <span className="font-bold">이형각 · 김호군</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">본사 위치</span>
                    <span className="font-bold">안양시 평촌스마트스퀘어</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">기업 매출 규모</span>
                    <span className="font-bold">435억원 (임직원 105명)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">핵심 수주 실적</span>
                    <span className="font-bold text-emerald-700">유지보수 39건 (143억원)</span>
                  </div>
                </div>
              </div>

              {/* 11 Keywords & 15 Target Agencies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 11 Keywords */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center">
                      <Briefcase className="w-3.5 h-3.5 mr-1 text-blue-600" />
                      2026 사업확장 핵심 키워드 (11개)
                    </span>
                    <span className="text-[11px] text-blue-600 font-medium">전체 수집 자동 연계</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      '유지보수',
                      'CCTV',
                      '감시종합',
                      '불법주정차',
                      '보안',
                      '방범',
                      '재난',
                      '지능형',
                      '어린이',
                      '관제',
                      '경계',
                    ].map((kw) => (
                      <span
                        key={kw}
                        className="px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-800 font-medium text-[11px]"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 pt-1">
                    * 기존 CCTV/관제 중심에서 지능형 보안·경계·어린이 보호구역·재난안전까지 수집 영역을 확장했습니다.
                  </p>
                </div>

                {/* 15 Target Agencies */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center">
                      <Award className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                      2026 전략 타겟 발주처 (15개)
                    </span>
                    <span className="text-[11px] text-indigo-600 font-medium">AI 심사 시 추가 가점</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      '국방',
                      '육군',
                      '해군',
                      '공군',
                      '해병대',
                      '경찰청',
                      '철도',
                      '공항',
                      '항만',
                      '방위사업청',
                      'ITS',
                      '지자체',
                      '관세청',
                      '한국어촌어항공단',
                      '한국도로교통공단',
                    ].map((ag) => (
                      <span
                        key={ag}
                        className="px-2 py-1 bg-indigo-50 border border-indigo-200 rounded-md text-indigo-900 font-medium text-[11px]"
                      >
                        {ag}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 pt-1">
                    * 국방/군/경찰/철도/항만 등 국가 중요시설 발주 공고 발견 시 적합도 및 추천 우선순위가 자동 상향됩니다.
                  </p>
                </div>
              </div>

              {/* 6 Specialized Products */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <span className="font-bold text-slate-800 block text-xs">
                  세오 6대 주력 특화 솔루션 및 신기술 (공고별 AI 자동 매칭 추천)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-slate-700">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-blue-900 block text-[11px]">
                      1. 방사형 레이어 GCN 행동인지 AI 영상분석
                    </span>
                    <span className="text-[11px] text-slate-500">
                      신체 관절 좌표 그래프 합성곱 신경망을 통한 폭력, 쓰러짐, 침입, 배회 즉각 탐지
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-blue-900 block text-[11px]">
                      2. CUBE HIDE 영상 암호화 모듈
                    </span>
                    <span className="text-[11px] text-slate-500">
                      국정원 KCMVP 검증 암호모듈 탑재, 영상 스트림 및 메타데이터 위·변조 방지
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-blue-900 block text-[11px]">
                      3. 60GHz 밀리미터파 레이더 복합 감시
                    </span>
                    <span className="text-[11px] text-slate-500">
                      야간, 안개, 폭우 등 가시거리 악조건에서도 100m 반경 내 고정밀 객체 추적
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-blue-900 block text-[11px]">
                      4. 3D LiDAR 포인트 클라우드 공간 침입 탐지
                    </span>
                    <span className="text-[11px] text-slate-500">
                      3차원 공간 포인트 클라우드 매핑을 통한 군 경계, 공항, 철도 외곽 울타리 감시
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-blue-900 block text-[11px]">
                      5. bluelock 지능형 침수·수위 감시 시스템
                    </span>
                    <span className="text-[11px] text-slate-500">
                      지하차도, 하천변 수위 감지 및 자동차단 시설 연동 재난안전 솔루션
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-blue-900 block text-[11px]">
                      6. 위험지역 안전관리 AI 특화 솔루션
                    </span>
                    <span className="text-[11px] text-slate-500">
                      산업현장 안전모/턱끈 미착용, 중장비 협착 위험구역 접근 실시간 알림
                    </span>
                  </div>
                </div>
              </div>

              {/* Core Certifications */}
              <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-1.5">
                <span className="font-bold text-emerald-900 block text-xs">
                  세오 보유 주요 국가인증 및 조달등록
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    '신제품(NEP) 인증',
                    '우수조달물품 지정',
                    '혁신제품 지정',
                    '국정원 KCMVP 암호모듈 검증',
                    'GS(Good Software) 1등급',
                    '중기부 성능인증(EPC)',
                    '품질보증조달물품',
                    '정보통신공사업 면허(0036)',
                    '소프트웨어사업자(1426)',
                    'CCTV 직접생산확인',
                    '비디오마일스톤 플래티넘 파트너',
                  ].map((cert) => (
                    <span
                      key={cert}
                      className="px-2 py-0.5 bg-white border border-emerald-300 text-emerald-900 rounded text-[11px]"
                    >
                      ✓ {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Schedule Settings */}
          {activeSubTab === 'schedule' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 text-sm block">
                    자동 스케줄 수집 활성화
                  </span>
                  <span className="text-slate-500 text-xs">
                    매일 오전/오후 정해진 시각에 서버 백그라운드에서 자동 수집 및 AI 분석을 수행합니다.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={editedConfig.autoScheduleEnabled}
                  onChange={(e) =>
                    setEditedConfig({ ...editedConfig, autoScheduleEnabled: e.target.checked })
                  }
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-200 rounded-xl space-y-2">
                  <label className="font-semibold text-slate-800 flex items-center">
                    <Clock className="w-4 h-4 mr-1.5 text-blue-600" />
                    오전 1회차 자동 수집 시각
                  </label>
                  <input
                    type="time"
                    value={editedConfig.scheduleMorning}
                    onChange={(e) =>
                      setEditedConfig({ ...editedConfig, scheduleMorning: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                  />
                  <span className="text-[11px] text-slate-400 block">기본값: 09:00 (KST)</span>
                </div>

                <div className="p-4 border border-slate-200 rounded-xl space-y-2">
                  <label className="font-semibold text-slate-800 flex items-center">
                    <Clock className="w-4 h-4 mr-1.5 text-indigo-600" />
                    오후 2회차 자동 수집 시각
                  </label>
                  <input
                    type="time"
                    value={editedConfig.scheduleAfternoon}
                    onChange={(e) =>
                      setEditedConfig({ ...editedConfig, scheduleAfternoon: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                  />
                  <span className="text-[11px] text-slate-400 block">기본값: 15:00 (KST)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: API Guide */}
          {activeSubTab === 'api' && (
            <div className="space-y-4 text-slate-700">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 flex items-center text-sm">
                  <Key className="w-4 h-4 mr-1.5 text-blue-600" />
                  나라장터 Open API 연동 안내 (공공데이터포털 data.go.kr)
                </h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  본 시스템은 조달청 나라장터 Open API와 호환되도록 설계되어 있습니다.
                  data.go.kr에서 세오 사업자 명의로 활용신청 후 발급받은 서비스키를 등록하거나,
                  시스템에 내장된 자동 시뮬레이션 엔진을 통해 즉시 모든 기능을 테스트할 수 있습니다.
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
                  <div className="flex items-start space-x-2">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <span><strong>사전규격:</strong> 조달청 사전규격 공개정보 서비스 (발주 예정 파악)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <span><strong>입찰공고:</strong> 조달청 입찰공고정보서비스 (용역/물품/공사별)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <span><strong>개찰결과:</strong> 조달청 개찰결과정보서비스 (낙찰업체, 투찰률 등)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="font-semibold text-slate-800 block mb-1">
                    공공데이터포털 Service Key (선택 입력)
                  </label>
                  <input
                    type="password"
                    value={editedConfig.openApiKey || ''}
                    onChange={(e) =>
                      setEditedConfig({ ...editedConfig, openApiKey: e.target.value })
                    }
                    placeholder="인증키가 미입력된 경우 고품질 지능형 시뮬레이션 데이터로 자동 동작합니다."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleResetToDefaults}
            className="inline-flex items-center text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            기본값 복원
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 mr-1 text-white" />
                  저장 완료
                </>
              ) : isSaving ? (
                '저장 중...'
              ) : (
                '설정 저장'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
