import React from 'react';
import { X, History, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { CrawlLog } from '../types';

interface LogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: CrawlLog[];
}

export const LogsModal: React.FC<LogsModalProps> = ({ isOpen, onClose, logs }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                나라장터 자동 수집 및 AI 분석 실행 로그 (F-1)
              </h2>
              <p className="text-xs text-slate-500">
                매일 09:00 / 15:00 정기 스케줄 및 수동 즉시 실행 히스토리
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logs Table */}
        <div className="p-5 overflow-y-auto flex-1">
          {logs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              기록된 수집 로그가 없습니다.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      {log.status === 'success' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3 h-3 mr-1 text-emerald-600" />
                          정상 완료
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800">
                          <AlertCircle className="w-3 h-3 mr-1 text-rose-600" />
                          오류
                        </span>
                      )}

                      <span className="font-mono text-slate-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-slate-400" />
                        {log.timestamp}
                      </span>

                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                        {log.trigger === 'scheduled' ? '정기 스케줄' : '수동 즉시실행'}
                      </span>
                    </div>

                    <p className="text-slate-800 font-medium">{log.message}</p>
                  </div>

                  <div className="flex items-center space-x-3 text-right shrink-0 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-400 block">수집 공고</span>
                      <span className="font-bold text-slate-800 text-sm">
                        {log.collectedCount}건
                      </span>
                    </div>
                    <div className="border-l border-slate-200 pl-3">
                      <span className="text-[10px] text-emerald-600 block">적합 판정</span>
                      <span className="font-bold text-emerald-700 text-sm">
                        {log.fitCount}건
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
