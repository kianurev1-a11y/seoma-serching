import React, { useState } from 'react';
import {
  Download,
  RefreshCw,
  Settings,
  History,
  FileSpreadsheet,
  ChevronDown,
} from 'lucide-react';
import { AppConfig, NoticeType } from '../types';

interface HeaderProps {
  config: AppConfig;
  lastSyncTime: string | null;
  isSyncing: boolean;
  onManualCrawl: () => void;
  onOpenSettings: () => void;
  onOpenLogs: () => void;
  onExportExcel: (allTabs: boolean) => void;
  onOpenApiStatus: () => void;
  activeTab: NoticeType;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  lastSyncTime,
  isSyncing,
  onManualCrawl,
  onOpenSettings,
  onOpenLogs,
  onExportExcel,
  onOpenApiStatus,
  activeTab,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-4">
          {/* Brand & Subtitle */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              SEO
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  나라장터 입찰정보 자동검색 대시보드
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                  (주)세오 2026 공공입찰
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                사전규격 · 입찰공고 · 개찰결과 실시간 수집 &amp; 세오 기업기준 AI 입찰 적합도 분석
              </p>
            </div>
          </div>

          {/* Controls and Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* G2B OpenAPI Live Badge (Clickable to open diagnosis) */}
            <button
              id="btn-open-api-status"
              onClick={onOpenApiStatus}
              className="flex items-center text-xs text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-2.5 py-1.5 rounded-lg border border-blue-200 transition cursor-pointer shadow-2xs"
              title="클릭하여 조달청 나라장터 Open API 실시간 연결 상태 및 3대 오퍼레이션 진단창을 확인합니다."
            >
              <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
              <span className="font-semibold">조달청 나라장터 Open API 연동</span>
              <span className="ml-1.5 text-[10px] bg-blue-200/70 text-blue-800 px-1 rounded">진단</span>
            </button>

            {/* Sync Status Badge */}
            <div className="hidden lg:flex items-center text-xs text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              <span>스케줄: {config.scheduleMorning} / {config.scheduleAfternoon} KST</span>
              {lastSyncTime && (
                <span className="ml-2 pl-2 border-l border-slate-300 text-slate-400">
                  최근 수집 {lastSyncTime.split(' ')[1] || lastSyncTime}
                </span>
              )}
            </div>

            {/* Manual Sync Button */}
            <button
              id="btn-manual-crawl"
              onClick={onManualCrawl}
              disabled={isSyncing}
              className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 transition shadow-xs cursor-pointer"
              title="현재 등록된 키워드로 3개 구간의 공고를 즉시 수집하고 AI 적합도를 분석합니다."
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? '수집 및 AI 분석 중...' : '즉시 수집 실행'}
            </button>

            {/* Excel Download Dropdown */}
            <div className="relative">
              <button
                id="btn-excel-menu"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 active:bg-emerald-200 transition shadow-xs cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                <span>엑셀 다운로드</span>
                <ChevronDown className="w-3 h-3 ml-1 text-emerald-700" />
              </button>

              {showExportMenu && (
                <div
                  className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setShowExportMenu(false)}
                >
                  <button
                    onClick={() => {
                      onExportExcel(false);
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center"
                  >
                    <Download className="w-3.5 h-3.5 mr-2 text-slate-400" />
                    <span>현재 탭 ({activeTab}) 다운로드</span>
                  </button>
                  <button
                    onClick={() => {
                      onExportExcel(true);
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center border-t border-slate-100"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 mr-2 text-emerald-600" />
                    <span className="font-medium text-emerald-900">전체 3개 탭 통합 다운로드</span>
                  </button>
                </div>
              )}
            </div>

            {/* Logs Button */}
            <button
              id="btn-open-logs"
              onClick={onOpenLogs}
              className="inline-flex items-center px-2.5 py-2 text-xs font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition cursor-pointer"
              title="스케줄 및 수집 로그 이력 조회"
            >
              <History className="w-3.5 h-3.5 mr-1 text-slate-500" />
              <span>로그 이력</span>
            </button>

            {/* Settings Button */}
            <button
              id="btn-open-settings"
              onClick={onOpenSettings}
              className="inline-flex items-center px-2.5 py-2 text-xs font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition cursor-pointer"
              title="키워드, 세오 기업 기준 정보, 스케줄 설정"
            >
              <Settings className="w-3.5 h-3.5 mr-1 text-slate-500" />
              <span>관리자 설정</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
