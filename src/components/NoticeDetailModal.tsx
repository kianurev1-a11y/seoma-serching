import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Download,
  Building2,
  Calendar,
  DollarSign,
  ShieldCheck,
  Award,
  Briefcase,
  RefreshCw,
} from 'lucide-react';
import { BidNotice, CompanyCriteria } from '../types';

interface NoticeDetailModalProps {
  notice: BidNotice | null;
  onClose: () => void;
  criteria: CompanyCriteria;
  onReevaluate: (notice: BidNotice) => Promise<void>;
}

export const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({
  notice,
  onClose,
  criteria,
  onReevaluate,
}) => {
  const [isEvaluating, setIsEvaluating] = useState(false);

  if (!notice) return null;

  const handleReeval = async () => {
    setIsEvaluating(true);
    try {
      await onReevaluate(notice);
    } finally {
      setIsEvaluating(false);
    }
  };

  const getFitnessBadge = () => {
    if (notice.fitnessResult === '적합') {
      return (
        <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold text-sm">입찰 추천 (적합)</span>
            <span className="text-xs ml-2 font-mono text-emerald-700">
              적합도 {notice.fitnessScore}점
            </span>
          </div>
        </div>
      );
    }
    if (notice.fitnessResult === '보류') {
      return (
        <div className="flex items-center space-x-2 bg-amber-50 text-amber-800 border border-amber-300 px-3 py-1.5 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold text-sm">추가 검토 요망 (보류)</span>
            <span className="text-xs ml-2 font-mono text-amber-700">
              적합도 {notice.fitnessScore}점
            </span>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-2 bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-lg">
        <XCircle className="w-5 h-5 text-slate-500 shrink-0" />
        <div>
          <span className="font-bold text-sm">입찰 부적합</span>
          <span className="text-xs ml-2 text-slate-500">기준 미충족</span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-200 bg-slate-50/70">
          <div className="space-y-1 pr-6">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                {notice.noticeType}
              </span>
              <span className="text-xs font-mono text-slate-500">{notice.noticeNo}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                #{notice.matchedKeyword}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {notice.noticeName}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Quick Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block mb-0.5 flex items-center">
                <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
                수요기관
              </span>
              <span className="font-semibold text-slate-800">{notice.organization}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5 flex items-center">
                <DollarSign className="w-3.5 h-3.5 mr-1 text-slate-400" />
                추정 예산
              </span>
              <span className="font-semibold text-slate-800">
                {notice.budgetAmount.toLocaleString('ko-KR')}원
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                공고일 / 마감일
              </span>
              <span className="font-semibold text-slate-800 font-mono">
                {notice.noticeDate} ~ {notice.deadlineDate}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5 flex items-center">
                <Briefcase className="w-3.5 h-3.5 mr-1 text-slate-400" />
                계약방법
              </span>
              <span className="font-semibold text-slate-800">
                {notice.category} ({notice.contractMethod})
              </span>
            </div>
          </div>

          {/* AI Suitability Assessment Card (Core PRD F-2 & SEO 2026 Profile) */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-xl border border-blue-200 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-blue-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    세오 2026 AI 입찰 적합도 심사 리포트
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    면허/업태 · 수주실적(유지보수 39건 143억 강점) · 인증 · 11대 확장 발주처 가점 4차원 복합 심사
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {getFitnessBadge()}
                <button
                  onClick={handleReeval}
                  disabled={isEvaluating}
                  className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 rounded-lg transition cursor-pointer shadow-xs disabled:opacity-50"
                  title="Gemini AI로 적합도를 다시 분석합니다."
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1 ${isEvaluating ? 'animate-spin' : ''}`} />
                  {isEvaluating ? '분석 중...' : 'AI 재심사'}
                </button>
              </div>
            </div>

            {/* Recommended Product & Target Agency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-blue-100/60 p-2.5 rounded-lg border border-blue-200">
                <span className="font-semibold text-blue-900 block mb-0.5">
                  ★ 세오 주력 솔루션 연계 추천:
                </span>
                <span className="font-bold text-blue-800 text-xs">
                  {notice.specializedProductMatch || '방사형 레이어 GCN 행동인지 AI CCTV 시스템'}
                </span>
              </div>
              <div className="bg-slate-100/80 p-2.5 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-700 block mb-0.5">
                  핵심 발주처 가점 매칭:
                </span>
                <span className={`font-bold text-xs ${notice.targetAgencyMatched ? 'text-emerald-700' : 'text-slate-600'}`}>
                  {notice.targetAgencyMatched ? '✓ 세오 11대 확장 타겟 발주처 가점 부여' : '일반 수요기관 (지자체/공공)'}
                </span>
              </div>
            </div>

            {/* Assessment Reason */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1">
                AI 심사평가 및 전략 제안:
              </span>
              <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                {notice.fitnessReason}
              </p>
            </div>

            {/* Matched Criteria Checklist */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">
                매칭된 세오 기준 항목 ({notice.matchedCriteria.length}건 매칭):
              </span>
              {notice.matchedCriteria.length > 0 ? (
                <div className="space-y-1.5">
                  {notice.matchedCriteria.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-2 bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 px-3 py-1.5 rounded-lg text-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic bg-white p-2 rounded-lg border border-slate-200">
                  매칭된 세오 기준 항목이 없습니다. (부적합 공고)
                </p>
              )}
            </div>

            {/* 3 Pillars of Company Criteria Reference */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-2 border-t border-blue-100/80">
              <div className="bg-white/80 p-2 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-700 flex items-center mb-1">
                  <Briefcase className="w-3 h-3 mr-1 text-blue-500" />
                  1. 업태·업종 기준
                </span>
                <p className="text-slate-500 line-clamp-2">
                  {criteria.businessTypes.join(', ')}
                </p>
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-700 flex items-center mb-1">
                  <Award className="w-3 h-3 mr-1 text-emerald-500" />
                  2. 보유 실적 기준
                </span>
                <p className="text-slate-500 line-clamp-2">
                  {criteria.performances.join(', ')}
                </p>
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-700 flex items-center mb-1">
                  <ShieldCheck className="w-3 h-3 mr-1 text-purple-500" />
                  3. 보유 인증 기준
                </span>
                <p className="text-slate-500 line-clamp-2">
                  {criteria.certifications.join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* Qualification Details */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center">
              <FileText className="w-3.5 h-3.5 mr-1 text-slate-400" />
              입찰참가자격 요건
            </h4>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {notice.qualification || '세부 참가자격은 과업지시서 및 나라장터 공고문을 참조하세요.'}
            </div>
          </div>

          {/* Business Summary */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center">
              <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
              사업 개요 및 주요 내용
            </h4>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {notice.businessSummary || '사업 개요 정보가 없습니다.'}
            </div>
          </div>

          {/* Attachments */}
          {notice.attachments && notice.attachments.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center">
                <Download className="w-3.5 h-3.5 mr-1 text-slate-400" />
                첨부파일 목록 ({notice.attachments.length}개)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {notice.attachments.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition text-xs"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="truncate text-slate-800 font-medium">{file.name}</span>
                      {file.size && (
                        <span className="text-[10px] text-slate-400">({file.size})</span>
                      )}
                    </div>
                    <a
                      href={file.url}
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`나라장터 원문 공고문에서 첨부파일('${file.name}')을 다운로드할 수 있습니다.`);
                      }}
                      className="text-blue-600 hover:text-blue-800 p-1 font-medium"
                    >
                      다운로드
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* For Result type, show Result Details */}
          {notice.noticeType === '개찰결과' && (
            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 text-xs space-y-2">
              <h4 className="font-bold text-amber-900 text-sm">개찰 및 낙찰 결과 정보</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-amber-700 block">낙찰예정업체:</span>
                  <span className="font-bold text-slate-900">{notice.winnerCompany || '-'}</span>
                </div>
                <div>
                  <span className="text-amber-700 block">투찰금액:</span>
                  <span className="font-bold text-slate-900">
                    {notice.bidAmount ? `${notice.bidAmount.toLocaleString()}원` : '-'}
                  </span>
                </div>
                <div>
                  <span className="text-amber-700 block">낙찰률:</span>
                  <span className="font-bold text-slate-900">
                    {notice.successRate ? `${notice.successRate}%` : '-'}
                  </span>
                </div>
                <div>
                  <span className="text-amber-700 block">기술/가격평가점수:</span>
                  <span className="font-bold text-slate-900">
                    {notice.techScore || '-'}점 / {notice.priceScore || '-'}점
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            수집일시: {notice.collectedAt}
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition"
            >
              닫기
            </button>
            <a
              href={notice.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition"
            >
              <span>나라장터 원문 바로가기</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
