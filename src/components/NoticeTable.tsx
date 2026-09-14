import React from 'react';
import {
  ExternalLink,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Paperclip,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Eye,
  FileSearch,
  Briefcase,
  Award,
} from 'lucide-react';
import { BidNotice, DashboardFilter, FitnessResult, NoticeType } from '../types';

interface NoticeTableProps {
  notices: BidNotice[];
  activeTab: NoticeType;
  onChangeTab: (tab: NoticeType) => void;
  tabCounts: {
    사전규격: number;
    입찰공고: number;
    개찰결과: number;
  };
  filter: DashboardFilter;
  onSort: (column: keyof BidNotice) => void;
  onSelectNotice: (notice: BidNotice) => void;
}

export const NoticeTable: React.FC<NoticeTableProps> = ({
  notices,
  activeTab,
  onChangeTab,
  tabCounts,
  filter,
  onSort,
  onSelectNotice,
}) => {
  const tabs: { id: NoticeType; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: '사전규격',
      label: '사전규격 공개',
      icon: <FileSearch className="w-4 h-4" />,
      desc: '발주 예정 사업 규격 조기 파악 및 제안',
    },
    {
      id: '입찰공고',
      label: '입찰공고 진행',
      icon: <Briefcase className="w-4 h-4" />,
      desc: '현재 투찰 진행 중인 용역·물품 공고',
    },
    {
      id: '개찰결과',
      label: '개찰결과 분석',
      icon: <Award className="w-4 h-4" />,
      desc: '낙찰업체, 투찰금액 및 낙찰률 이력',
    },
  ];

  const renderSortIcon = (column: keyof BidNotice) => {
    if (filter.sortBy !== column) {
      return <ArrowUpDown className="w-3 h-3 ml-1 text-slate-300 group-hover:text-slate-500" />;
    }
    return filter.sortOrder === 'asc' ? (
      <ArrowUp className="w-3 h-3 ml-1 text-blue-600" />
    ) : (
      <ArrowDown className="w-3 h-3 ml-1 text-blue-600" />
    );
  };

  const getFitnessBadge = (result: FitnessResult, score: number) => {
    if (result === '적합') {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CheckCircle className="w-3 h-3 mr-1 text-emerald-600" />
          적합 ({score}점)
        </span>
      );
    }
    if (result === '보류') {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
          <AlertCircle className="w-3 h-3 mr-1 text-amber-600" />
          보류 ({score}점)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
        <XCircle className="w-3 h-3 mr-1 text-slate-400" />
        부적합
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    if (!amount) return '-';
    if (amount >= 100000000) {
      const eok = (amount / 100000000).toFixed(2);
      return `${eok}억원`;
    }
    return `${amount.toLocaleString('ko-KR')}원`;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* 3 Main Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/70">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex-1 py-3.5 px-4 text-left sm:text-center transition-all relative cursor-pointer border-r last:border-r-0 border-slate-200 ${
                isActive
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 font-medium'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-0 right-0 h-0.5 bg-blue-600"></span>
              )}
              <div className="flex items-center justify-center space-x-2">
                <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                  {tab.icon}
                </span>
                <span className="text-sm tracking-tight">{tab.label}</span>
                <span
                  className={`ml-1.5 px-2 py-0.5 text-xs rounded-full ${
                    isActive
                      ? 'bg-blue-100 text-blue-800 font-bold'
                      : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {tabCounts[tab.id] || 0}
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 font-normal mt-0.5">
                {tab.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 border-collapse">
          <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-semibold border-b border-slate-200 select-none">
            <tr>
              <th
                onClick={() => onSort('fitnessResult')}
                className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 text-center w-28 group"
              >
                <div className="flex items-center justify-center">
                  <span>AI 적합도</span>
                  {renderSortIcon('fitnessResult')}
                </div>
              </th>
              <th
                onClick={() => onSort('noticeNo')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-100 w-36 group"
              >
                <div className="flex items-center">
                  <span>공고번호</span>
                  {renderSortIcon('noticeNo')}
                </div>
              </th>
              <th
                onClick={() => onSort('noticeName')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-100 min-w-[340px] group sticky left-0 bg-slate-50 z-10"
              >
                <div className="flex items-center">
                  <span>공고명 (나라장터 원문)</span>
                  {renderSortIcon('noticeName')}
                </div>
              </th>
              <th
                onClick={() => onSort('organization')}
                className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 w-36 group"
              >
                <div className="flex items-center">
                  <span>수요기관</span>
                  {renderSortIcon('organization')}
                </div>
              </th>
              <th
                onClick={() => onSort('noticeDate')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-100 w-28 text-center group"
              >
                <div className="flex items-center justify-center">
                  <span>공고일</span>
                  {renderSortIcon('noticeDate')}
                </div>
              </th>
              <th
                onClick={() => onSort('deadlineDate')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-100 w-32 text-center group"
              >
                <div className="flex items-center justify-center">
                  <span>마감일시</span>
                  {renderSortIcon('deadlineDate')}
                </div>
              </th>
              <th
                onClick={() => onSort('budgetAmount')}
                className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 w-32 text-right group"
              >
                <div className="flex items-center justify-end">
                  <span>추정예산</span>
                  {renderSortIcon('budgetAmount')}
                </div>
              </th>
              <th className="py-3 px-3 w-24 text-center">계약방법</th>
              <th className="py-3 px-3 w-28 text-center">매칭키워드</th>

              {/* Extra Columns for Bid Result */}
              {activeTab === '개찰결과' && (
                <>
                  <th className="py-3 px-3.5 w-32">낙찰업체</th>
                  <th
                    onClick={() => onSort('bidAmount')}
                    className="py-3 px-3 cursor-pointer hover:bg-slate-100 text-right group"
                  >
                    <div className="flex items-center justify-end">
                      <span>투찰금액</span>
                      {renderSortIcon('bidAmount')}
                    </div>
                  </th>
                  <th
                    onClick={() => onSort('successRate')}
                    className="py-3 px-3 cursor-pointer hover:bg-slate-100 text-center group"
                  >
                    <div className="flex items-center justify-center">
                      <span>낙찰률</span>
                      {renderSortIcon('successRate')}
                    </div>
                  </th>
                </>
              )}

              <th className="py-3 px-3 w-24 text-center">상세분석</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {notices.length === 0 ? (
              <tr>
                <td
                  colSpan={activeTab === '개찰결과' ? 13 : 10}
                  className="py-12 text-center text-slate-400 bg-slate-50/50"
                >
                  <p className="text-sm font-medium">검색 조건에 일치하는 입찰정보가 없습니다.</p>
                  <p className="text-xs text-slate-400 mt-1">
                    키워드 또는 AI 적합도 필터를 변경하거나 우측 상단 '즉시 수집 실행'을 클릭하세요.
                  </p>
                </td>
              </tr>
            ) : (
              notices.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-blue-50/40 transition-colors group ${
                    item.fitnessResult === '적합' ? 'bg-emerald-50/15' : ''
                  }`}
                >
                  {/* AI 적합도 배지 */}
                  <td className="py-3 px-3.5 text-center whitespace-nowrap">
                    <button
                      onClick={() => onSelectNotice(item)}
                      className="cursor-pointer hover:opacity-90"
                      title="클릭하여 AI 적합도 상세 근거 조회"
                    >
                      {getFitnessBadge(item.fitnessResult, item.fitnessScore)}
                    </button>
                  </td>

                  {/* 공고번호 */}
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {item.noticeNo}
                  </td>

                  {/* 공고명 (Sticky + External Link) */}
                  <td className="py-3 px-4 sticky left-0 bg-white group-hover:bg-blue-50/40 transition-colors z-10">
                    <div className="flex flex-col">
                      <div className="flex items-start space-x-1.5">
                        {item.isRealApi && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300 shrink-0">
                            조달청 실시간
                          </span>
                        )}
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-slate-900 hover:text-blue-600 hover:underline line-clamp-2 leading-relaxed flex items-center gap-1 text-xs sm:text-sm"
                          title="나라장터 원문 페이지로 이동"
                        >
                          <span>{item.noticeName}</span>
                          <ExternalLink className="w-3 h-3 shrink-0 text-slate-400 group-hover:text-blue-500" />
                        </a>
                      </div>

                      {/* Snippet / matched criteria */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-slate-600 truncate max-w-[420px]">
                          {item.fitnessReason}
                        </span>
                        {item.attachments && item.attachments.length > 0 && (
                          <span
                            className="inline-flex items-center text-[11px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded cursor-pointer hover:text-slate-700"
                            onClick={() => onSelectNotice(item)}
                            title={`첨부파일 ${item.attachments.length}건`}
                          >
                            <Paperclip className="w-2.5 h-2.5 mr-0.5" />
                            {item.attachments.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* 수요기관 */}
                  <td className="py-3 px-3.5 text-slate-700 font-medium whitespace-nowrap">
                    {item.organization}
                  </td>

                  {/* 공고일 */}
                  <td className="py-3 px-3 text-center text-slate-500 whitespace-nowrap font-mono text-[11px]">
                    {item.noticeDate}
                  </td>

                  {/* 마감일 */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <div className="flex flex-col items-center">
                      <span className="font-mono text-[11px] text-slate-700">
                        {item.deadlineDate.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center">
                        <Clock className="w-2.5 h-2.5 mr-0.5 text-slate-300" />
                        {item.deadlineDate.split(' ')[1] || ''}
                      </span>
                    </div>
                  </td>

                  {/* 예산액 */}
                  <td className="py-3 px-3.5 text-right font-semibold text-slate-800 whitespace-nowrap">
                    {formatCurrency(item.budgetAmount)}
                  </td>

                  {/* 계약방법 */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span className="inline-block text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {item.category} / {item.contractMethod.split(' ')[0]}
                    </span>
                  </td>

                  {/* 매칭 키워드 */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-200/70">
                      #{item.matchedKeyword}
                    </span>
                  </td>

                  {/* 개찰결과 전용 컬럼 */}
                  {activeTab === '개찰결과' && (
                    <>
                      <td className="py-3 px-3.5 font-medium text-slate-800 whitespace-nowrap">
                        {item.winnerCompany || '-'}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-700 whitespace-nowrap font-mono">
                        {item.bidAmount ? formatCurrency(item.bidAmount) : '-'}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {item.successRate ? (
                          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                            {item.successRate}%
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                    </>
                  )}

                  {/* 액션 버튼 */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <button
                      onClick={() => onSelectNotice(item)}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition cursor-pointer"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      상세
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
