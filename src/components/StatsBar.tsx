import React from 'react';
import { FileSearch, FileText, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import { BidNotice } from '../types';

interface StatsBarProps {
  notices: BidNotice[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ notices }) => {
  const preSpecCount = notices.filter((n) => n.noticeType === '사전규격').length;
  const bidNoticeCount = notices.filter((n) => n.noticeType === '입찰공고').length;
  const resultCount = notices.filter((n) => n.noticeType === '개찰결과').length;

  const fitCount = notices.filter((n) => n.fitnessResult === '적합').length;
  const pendingCount = notices.filter((n) => n.fitnessResult === '보류').length;
  const fitRate = notices.length > 0 ? Math.round((fitCount / notices.length) * 100) : 0;

  const totalBudget = notices.reduce((acc, curr) => acc + (curr.budgetAmount || 0), 0);
  const totalBudgetBillion = (totalBudget / 100000000).toFixed(1);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 mb-6">
      {/* 1. 전체 수집 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium">최근 7일 전체 공고</span>
          <FileText className="w-4 h-4 text-slate-400" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-slate-900">{notices.length}</span>
          <span className="text-xs text-slate-500">건</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          추정 예산 총 <span className="font-semibold text-slate-800">{totalBudgetBillion}억</span> 원
        </div>
      </div>

      {/* 2. 사전규격 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium">사전규격 공개</span>
          <FileSearch className="w-4 h-4 text-purple-500" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-purple-700">{preSpecCount}</span>
          <span className="text-xs text-slate-500">건</span>
        </div>
        <div className="text-[11px] text-purple-700/80 mt-1">
          발주 예정 조기 파악 규격
        </div>
      </div>

      {/* 3. 입찰공고 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium">입찰공고 진행</span>
          <TrendingUp className="w-4 h-4 text-blue-500" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-blue-700">{bidNoticeCount}</span>
          <span className="text-xs text-slate-500">건</span>
        </div>
        <div className="text-[11px] text-blue-700/80 mt-1">
          현재 투찰 진행 중인 공고
        </div>
      </div>

      {/* 4. 개찰결과 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-xs font-medium">개찰 완료 결과</span>
          <CheckCircle2 className="w-4 h-4 text-slate-500" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-slate-800">{resultCount}</span>
          <span className="text-xs text-slate-500">건</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          낙찰업체 및 투찰금액 분석
        </div>
      </div>

      {/* 5. AI 적합도 분석 요약 */}
      <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-emerald-50 to-teal-50/70 p-4 rounded-xl border border-emerald-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-emerald-800 mb-1">
          <span className="text-xs font-semibold flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            세오 적합 추천
          </span>
          <span className="text-xs font-bold text-emerald-700">{fitRate}%</span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-emerald-700">{fitCount}</span>
          <span className="text-xs text-emerald-800">건 적합</span>
          <span className="text-xs text-amber-700 ml-1">({pendingCount}건 보류)</span>
        </div>
        <div className="text-[11px] text-emerald-800 mt-1">
          2가지 이상 자격·실적 충족
        </div>
      </div>
    </div>
  );
};
