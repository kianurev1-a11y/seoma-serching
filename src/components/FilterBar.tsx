import React from 'react';
import { Search, RotateCcw, Filter, Calendar } from 'lucide-react';
import { DashboardFilter, FitnessResult } from '../types';

interface FilterBarProps {
  filter: DashboardFilter;
  onChangeFilter: (newFilter: Partial<DashboardFilter>) => void;
  keywords: string[];
  totalFilteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onChangeFilter,
  keywords,
  totalFilteredCount,
}) => {
  const fitnessOptions: { label: string; value: 'ALL' | FitnessResult; color: string }[] = [
    { label: '전체 적합도', value: 'ALL', color: 'hover:bg-slate-100 text-slate-700' },
    { label: '적합 (추천)', value: '적합', color: 'hover:bg-emerald-50 text-emerald-800 border-emerald-300' },
    { label: '보류 (검토요망)', value: '보류', color: 'hover:bg-amber-50 text-amber-800 border-amber-300' },
    { label: '부적합 (제외)', value: '부적합', color: 'hover:bg-slate-100 text-slate-500' },
  ];

  const dateOptions: { label: string; value: DashboardFilter['dateRange'] }[] = [
    { label: '최근 7일 (기본)', value: '7days' },
    { label: '최근 3일', value: '3days' },
    { label: '오늘 등록', value: 'today' },
    { label: '전체 기간', value: 'all' },
  ];

  const handleReset = () => {
    onChangeFilter({
      searchKeyword: '',
      selectedMatchedKeyword: 'ALL',
      fitnessFilter: 'ALL',
      dateRange: '7days',
    });
  };

  const isFiltered =
    filter.searchKeyword !== '' ||
    filter.selectedMatchedKeyword !== 'ALL' ||
    filter.fitnessFilter !== 'ALL' ||
    filter.dateRange !== '7days';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 mb-5 space-y-3.5">
      {/* Search Input & Quick Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="filter-search-input"
            type="text"
            value={filter.searchKeyword}
            onChange={(e) => onChangeFilter({ searchKeyword: e.target.value })}
            placeholder="공고명, 수요기관, 공고번호 검색..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
          {filter.searchKeyword && (
            <button
              onClick={() => onChangeFilter({ searchKeyword: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              지우기
            </button>
          )}
        </div>

        {/* Date Filter & Reset */}
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
            {dateOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChangeFilter({ dateRange: opt.value })}
                className={`px-2 py-1 text-xs font-medium rounded-md transition cursor-pointer ${
                  filter.dateRange === opt.value
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {isFiltered && (
            <button
              onClick={handleReset}
              className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition cursor-pointer"
              title="필터 초기화"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1 text-slate-400" />
              초기화
            </button>
          )}
        </div>
      </div>

      {/* Fitness Pill Filter */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
        <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center">
          <Filter className="w-3 h-3 mr-1" />
          AI 적합도:
        </span>
        {fitnessOptions.map((opt) => {
          const isSelected = filter.fitnessFilter === opt.value;
          let activeStyles = 'bg-slate-800 text-white font-semibold';
          if (opt.value === '적합') activeStyles = 'bg-emerald-600 text-white font-semibold shadow-xs';
          if (opt.value === '보류') activeStyles = 'bg-amber-600 text-white font-semibold shadow-xs';
          if (opt.value === '부적합') activeStyles = 'bg-slate-600 text-white font-semibold';

          return (
            <button
              key={opt.value}
              onClick={() => onChangeFilter({ fitnessFilter: opt.value })}
              className={`px-2.5 py-1 rounded-md text-xs transition border cursor-pointer ${
                isSelected
                  ? activeStyles
                  : `bg-white border-slate-200 ${opt.color}`
              }`}
            >
              {opt.label}
            </button>
          );
        })}

        <div className="ml-auto text-xs text-slate-500 font-medium">
          조회 결과: <span className="font-bold text-blue-600">{totalFilteredCount}</span>건
        </div>
      </div>

      {/* Keywords Carousel / Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        <span className="text-slate-400 shrink-0 mr-1 font-medium">매칭 키워드:</span>
        <button
          onClick={() => onChangeFilter({ selectedMatchedKeyword: 'ALL' })}
          className={`shrink-0 px-2.5 py-1 rounded-full text-xs transition cursor-pointer ${
            filter.selectedMatchedKeyword === 'ALL'
              ? 'bg-blue-600 text-white font-medium shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          전체 ({keywords.length})
        </button>

        {keywords.map((kw) => {
          const isSelected = filter.selectedMatchedKeyword === kw;
          return (
            <button
              key={kw}
              onClick={() => onChangeFilter({ selectedMatchedKeyword: isSelected ? 'ALL' : kw })}
              className={`shrink-0 px-2.5 py-1 rounded-full text-xs transition cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white font-medium shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              #{kw}
            </button>
          );
        })}
      </div>
    </div>
  );
};
