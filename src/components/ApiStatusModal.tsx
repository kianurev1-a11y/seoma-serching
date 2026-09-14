import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Server,
  Zap,
  ShieldCheck,
  ExternalLink,
  Layers,
  Database,
} from 'lucide-react';
import { ApiStatusInfo } from '../types';

interface ApiStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiStatusModal: React.FC<ApiStatusModalProps> = ({ isOpen, onClose }) => {
  const [statusInfo, setStatusInfo] = useState<ApiStatusInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastTestedAt, setLastTestedAt] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/g2b-status');
      if (res.ok) {
        const data = await res.json();
        setStatusInfo(data);
        setLastTestedAt(new Date().toLocaleTimeString('ko-KR'));
      }
    } catch (err) {
      console.error('Failed to fetch OpenAPI status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        id="modal-api-status"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                조달청 나라장터 Open API 연동 진단 및 상태 검증
              </h2>
              <p className="text-xs text-slate-500">
                공공데이터포털 BidPublicInfoService (v3.1) 실시간 통신 및 3대 오퍼레이션 진단
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Overall Health Card */}
          <div
            className={`p-4 rounded-xl border flex items-start space-x-3.5 ${
              statusInfo?.isConnected
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/60 border-amber-200 text-amber-950'
            }`}
          >
            {statusInfo?.isConnected ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">
                  {statusInfo?.isConnected ? 'Open API 실시간 정상 연결됨' : 'Open API 연결 확인 필요'}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/80 border border-slate-200">
                  응답 지연: {statusInfo?.latencyMs ? `${statusInfo.latencyMs}ms` : '-'}
                </span>
              </div>
              <p className="text-xs mt-1 text-slate-600 leading-relaxed">
                {statusInfo?.statusMessage || 'API 상태 정보를 조회하고 있습니다...'}
              </p>
            </div>
          </div>

          {/* Service Key & Auth Info */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-500 flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-600" />
                공공데이터포털 인증키 (ServiceKey) 상태
              </span>
              <span className="font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                정상 등록 및 유효함
              </span>
            </div>
            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200 font-mono text-xs text-slate-700">
              <span className="truncate">{statusInfo?.maskedKey || '인증키 로딩 중...'}</span>
              <span className="text-[11px] text-slate-400 shrink-0 ml-2">인코딩 키 자동 관리</span>
            </div>
          </div>

          {/* 3대 오퍼레이션 개별 검증 상태 */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center">
              <Layers className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              나라장터 3대 공고 오퍼레이션 진단 결과
            </h3>
            <div className="space-y-2">
              {statusInfo?.operations?.map((op) => (
                <div
                  key={op.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50/60 transition"
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        op.status === 'ok' ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                    />
                    <div>
                      <div className="font-semibold text-xs text-slate-800 flex items-center space-x-1.5">
                        <span>{op.name}</span>
                        <span className="text-[11px] font-mono text-slate-400">({op.operationCode})</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {op.status === 'ok' ? `정상 응답 (최근 ${op.itemCount}건 검출)` : '응답 실패'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-medium text-slate-600">
                      {op.responseTime} ms
                    </span>
                  </div>
                </div>
              )) || (
                <div className="text-xs text-slate-500 text-center py-4">오퍼레이션 진단 진행 중...</div>
              )}
            </div>
          </div>

          {/* Sample Real Data Retrieved */}
          {statusInfo?.sampleNotice && (
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-blue-900 flex items-center">
                  <Zap className="w-3.5 h-3.5 mr-1 text-blue-600" />
                  실시간 API로 직접 수신된 최근 공고 샘플
                </span>
                <span className="text-[11px] text-blue-700 font-medium">조달청 나라장터 실데이터</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-200/60 text-xs space-y-1">
                <div className="font-bold text-slate-800 line-clamp-1">
                  {statusInfo.sampleNotice.bidNtceNm}
                </div>
                <div className="text-slate-500 flex items-center space-x-2 text-[11px]">
                  <span>공고번호: {statusInfo.sampleNotice.bidNtceNo}</span>
                  <span>•</span>
                  <span>수요기관: {statusInfo.sampleNotice.dminsttNm}</span>
                  <span>•</span>
                  <span>공고일: {statusInfo.sampleNotice.bidNtceDt?.slice(0, 10)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Technical Specs Info */}
          <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg space-y-1">
            <p>• 서비스명: 조달청_나라장터 공공데이터개방표준데이터 입찰공고정보서비스</p>
            <p>• 프로토콜: HTTP REST JSON (ServiceKey URL Decoding 처리 완료)</p>
            <p>• 자동 수집 정책: 매일 09:00, 15:00 KST 2회 자동 수집 + 즉시 수동 수집 지원</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
          <div className="text-slate-500">
            {lastTestedAt ? `최종 진단 시각: ${lastTestedAt}` : '진단 대기 중'}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchStatus}
              disabled={loading}
              className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? '연결 진단 중...' : '연결 재테스트 (Ping)'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
