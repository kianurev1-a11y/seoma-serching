/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { FilterBar } from './components/FilterBar';
import { NoticeTable } from './components/NoticeTable';
import { NoticeDetailModal } from './components/NoticeDetailModal';
import { SettingsModal } from './components/SettingsModal';
import { LogsModal } from './components/LogsModal';
import { ApiStatusModal } from './components/ApiStatusModal';
import {
  BidNotice,
  AppConfig,
  CrawlLog,
  NoticeType,
  DashboardFilter,
} from './types';
import { DEFAULT_CONFIG, INITIAL_NOTICES, INITIAL_LOGS } from './data/mockNotices';
import { exportNoticesToExcel } from './utils/excelExport';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [notices, setNotices] = useState<BidNotice[]>(INITIAL_NOTICES);
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [logs, setLogs] = useState<CrawlLog[]>(INITIAL_LOGS);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>('2026-09-14 09:00:15');
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Tab: 사전규격 / 입찰공고 / 개찰결과
  const [activeTab, setActiveTab] = useState<NoticeType>('입찰공고');

  // Filter & Sort State
  const [filter, setFilter] = useState<DashboardFilter>({
    tab: '입찰공고',
    searchKeyword: '',
    selectedMatchedKeyword: 'ALL',
    fitnessFilter: 'ALL',
    dateRange: '7days',
    sortBy: 'noticeDate',
    sortOrder: 'desc',
  });

  // Modals
  const [selectedNotice, setSelectedNotice] = useState<BidNotice | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isApiStatusOpen, setIsApiStatusOpen] = useState(false);

  // Load initial data from server APIs
  useEffect(() => {
    async function loadData() {
      try {
        const [noticesRes, configRes, logsRes] = await Promise.allSettled([
          fetch('/api/notices').then((r) => r.json()),
          fetch('/api/config').then((r) => r.json()),
          fetch('/api/logs').then((r) => r.json()),
        ]);

        if (noticesRes.status === 'fulfilled' && noticesRes.value?.notices) {
          setNotices(noticesRes.value.notices);
        }
        if (configRes.status === 'fulfilled' && configRes.value?.keywords) {
          setConfig(configRes.value);
        }
        if (logsRes.status === 'fulfilled' && Array.isArray(logsRes.value)) {
          setLogs(logsRes.value);
          if (logsRes.value[0]?.timestamp) {
            setLastSyncTime(logsRes.value[0].timestamp);
          }
        }
      } catch (err) {
        console.warn('Using local fallback state:', err);
      }
    }
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Manual Crawl Trigger (PRD F-1)
  const handleManualCrawl = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trigger: 'manual' }),
      });

      if (res.ok) {
        const data = await res.json();
        // Refresh notices and logs
        const refreshed = await fetch('/api/notices').then((r) => r.json());
        if (refreshed.notices) {
          setNotices(refreshed.notices);
        }
        if (data.newLog) {
          setLogs((prev) => [data.newLog, ...prev]);
          setLastSyncTime(data.newLog.timestamp);
        }
        showToast(
          `나라장터 수집 완료: 신규 ${data.addedCount || 0}건 수집 및 AI 적합도 분석이 완료되었습니다.`
        );
      } else {
        showToast('수집 요청 처리 중 일시적인 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('Crawl failed:', err);
      showToast('네트워크 오류로 수집을 완료하지 못했습니다.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Save Settings (PRD F-5)
  const handleSaveConfig = async (newConfig: AppConfig) => {
    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data.config || newConfig);
        showToast('키워드 및 세오 적합도 판단 기준 설정이 저장되었습니다.');
      } else {
        setConfig(newConfig);
        showToast('로컬 설정이 반영되었습니다.');
      }
    } catch {
      setConfig(newConfig);
      showToast('로컬 설정이 반영되었습니다.');
    }
  };

  // AI Reevaluate Single Notice (PRD F-2)
  const handleReevaluate = async (notice: BidNotice) => {
    try {
      const res = await fetch('/api/ai-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notice),
      });

      if (res.ok) {
        const evaluated = await res.json();
        const updatedNotice: BidNotice = {
          ...notice,
          fitnessResult: evaluated.fitnessResult,
          fitnessScore: evaluated.fitnessScore,
          matchedCriteria: evaluated.matchedCriteria,
          fitnessReason: evaluated.fitnessReason,
        };

        // Update notice in state
        setNotices((prev) =>
          prev.map((n) => (n.id === notice.id ? updatedNotice : n))
        );
        setSelectedNotice(updatedNotice);
        showToast(`AI 분석 완료: '${updatedNotice.fitnessResult}'으로 재평가되었습니다.`);
      }
    } catch (err) {
      console.error('Re-evaluation error:', err);
      showToast('AI 평가 중 오류가 발생했습니다.');
    }
  };

  // Export to Excel (PRD F-4)
  const handleExportExcel = (allTabs: boolean) => {
    exportNoticesToExcel(filteredNotices, activeTab, allTabs);
    showToast(
      allTabs
        ? '사전규격·입찰공고·개찰결과 3개 탭 전체 엑셀 파일 다운로드가 시작되었습니다.'
        : `'${activeTab}' 엑셀 파일 다운로드가 시작되었습니다.`
    );
  };

  // Filter and Sort Handlers
  const handleSort = (column: keyof BidNotice) => {
    setFilter((prev) => ({
      ...prev,
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleUpdateFilter = (partial: Partial<DashboardFilter>) => {
    setFilter((prev) => ({ ...prev, ...partial }));
  };

  // Tab Counts across the full dataset
  const tabCounts = useMemo(() => {
    return {
      사전규격: notices.filter((n) => n.noticeType === '사전규격').length,
      입찰공고: notices.filter((n) => n.noticeType === '입찰공고').length,
      개찰결과: notices.filter((n) => n.noticeType === '개찰결과').length,
    };
  }, [notices]);

  // Filtered & Sorted Notices
  const filteredNotices = useMemo(() => {
    return notices
      .filter((n) => {
        // Tab filter
        if (n.noticeType !== activeTab) return false;

        // Search text
        if (filter.searchKeyword.trim()) {
          const q = filter.searchKeyword.trim().toLowerCase();
          const matchName = n.noticeName.toLowerCase().includes(q);
          const matchOrg = n.organization.toLowerCase().includes(q);
          const matchNo = n.noticeNo.toLowerCase().includes(q);
          if (!matchName && !matchOrg && !matchNo) return false;
        }

        // Matched Keyword filter
        if (filter.selectedMatchedKeyword !== 'ALL') {
          if (n.matchedKeyword !== filter.selectedMatchedKeyword) return false;
        }

        // Fitness filter
        if (filter.fitnessFilter !== 'ALL') {
          if (n.fitnessResult !== filter.fitnessFilter) return false;
        }

        // Date range filter
        if (filter.dateRange === 'today') {
          const todayStr = new Date().toISOString().slice(0, 10);
          if (n.noticeDate !== todayStr && !n.collectedAt.includes(todayStr)) return false;
        } else if (filter.dateRange === '3days') {
          const cutoff = new Date();
          cutoff.setDate(cutoff.getDate() - 3);
          if (new Date(n.noticeDate) < cutoff) return false;
        } else if (filter.dateRange === '7days') {
          const cutoff = new Date();
          cutoff.setDate(cutoff.getDate() - 7);
          if (new Date(n.noticeDate) < cutoff) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const col = filter.sortBy;
        const factor = filter.sortOrder === 'asc' ? 1 : -1;

        const valA = a[col];
        const valB = b[col];

        if (valA === undefined) return 1;
        if (valB === undefined) return -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * factor;
        }
        return String(valA).localeCompare(String(valB)) * factor;
      });
  }, [notices, activeTab, filter]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center space-x-2 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        config={config}
        lastSyncTime={lastSyncTime}
        isSyncing={isSyncing}
        onManualCrawl={handleManualCrawl}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLogs={() => setIsLogsOpen(true)}
        onExportExcel={handleExportExcel}
        onOpenApiStatus={() => setIsApiStatusOpen(true)}
        activeTab={activeTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Banner Alert for SEO Fit Engine */}
        <div className="mb-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 relative z-10">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                <Sparkles className="w-3 h-3 mr-1 text-blue-300" />
                세오 맞춤형 입찰 AI
              </span>
              <span className="text-xs text-blue-200">
                매일 09:00 / 15:00 2회 자동 수집 중 (최근 7일 rolling window)
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
              지능형교통·CCTV·통합관제·라이다 공고 자동 선별 및 적합도 실시간 평가
            </h2>
            <p className="text-xs text-blue-200/80 max-w-3xl leading-relaxed">
              조달청 나라장터 Open API 연계를 통해 사전규격, 입찰공고, 개찰결과를 전수 수집하며,
              세오의 사업자등록 면허·보유실적·인증 요건 충족 여부를 AI가 자동 판정합니다.
            </p>
          </div>

          <div className="flex items-center gap-2 relative z-10 shrink-0">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition border border-white/20 cursor-pointer"
            >
              세오 판단 기준 관리
            </button>
            <button
              onClick={handleManualCrawl}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow-xs transition disabled:opacity-60 cursor-pointer"
            >
              {isSyncing ? '수집 중...' : '지금 최신 공고 갱신'}
            </button>
          </div>
        </div>

        {/* Overview Stats Bar */}
        <StatsBar notices={notices} />

        {/* Filter and Search Controls */}
        <FilterBar
          filter={filter}
          onChangeFilter={handleUpdateFilter}
          keywords={config.keywords}
          totalFilteredCount={filteredNotices.length}
        />

        {/* Data Table */}
        <NoticeTable
          notices={filteredNotices}
          activeTab={activeTab}
          onChangeTab={(tab) => {
            setActiveTab(tab);
            handleUpdateFilter({ tab });
          }}
          tabCounts={tabCounts}
          filter={filter}
          onSort={handleSort}
          onSelectNotice={(n) => setSelectedNotice(n)}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 주식회사 세오 (SEO) MA사업본부 · 나라장터(G2B) 입찰정보 자동검색 시스템 v1.0
          </span>
          <span className="text-slate-400">
            조달청 Open API 연동 규격 준수 · Rolling 7일 수집 및 AI 입찰 적합도 분석
          </span>
        </div>
      </footer>

      {/* Detail Modal */}
      <NoticeDetailModal
        notice={selectedNotice}
        onClose={() => setSelectedNotice(null)}
        criteria={config.companyCriteria}
        onReevaluate={handleReevaluate}
      />

      {/* Settings Modal (PRD F-5) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
      />

      {/* Logs Modal (PRD F-1) */}
      <LogsModal
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
        logs={logs}
      />

      {/* API Status & Diagnosis Modal */}
      <ApiStatusModal
        isOpen={isApiStatusOpen}
        onClose={() => setIsApiStatusOpen(false)}
      />
    </div>
  );
}
