import * as XLSX from 'xlsx';
import { BidNotice, NoticeType } from '../types';

export function exportNoticesToExcel(
  notices: BidNotice[],
  activeTab: NoticeType,
  exportAllTabs: boolean = false
) {
  const wb = XLSX.utils.book_new();

  const formatNoticeForExcel = (n: BidNotice) => {
    const base = {
      구분: n.noticeType,
      공고번호: n.noticeNo,
      공고명: n.noticeName,
      수요기관: n.organization,
      공고일: n.noticeDate,
      마감일시: n.deadlineDate,
      '예산액(원)': n.budgetAmount.toLocaleString('ko-KR'),
      계약방법: n.contractMethod,
      분류: n.category,
      매칭키워드: n.matchedKeyword,
      'AI 적합도': n.fitnessResult,
      '적합도 점수': `${n.fitnessScore}점`,
      '판단 근거': n.fitnessReason,
      '매칭된 세오 기준': n.matchedCriteria.join('; '),
      참가자격: n.qualification,
      사업개요: n.businessSummary,
      원문링크: n.sourceUrl,
      수집일시: n.collectedAt,
    };

    if (n.noticeType === '개찰결과') {
      return {
        ...base,
        낙찰업체: n.winnerCompany || '-',
        '투찰금액(원)': n.bidAmount ? n.bidAmount.toLocaleString('ko-KR') : '-',
        기술평가점수: n.techScore !== undefined ? `${n.techScore}점` : '-',
        가격평가점수: n.priceScore !== undefined ? `${n.priceScore}점` : '-',
        낙찰률: n.successRate !== undefined ? `${n.successRate}%` : '-',
      };
    }

    return base;
  };

  if (exportAllTabs) {
    const tabs: NoticeType[] = ['사전규격', '입찰공고', '개찰결과'];
    tabs.forEach((tab) => {
      const tabData = notices.filter((n) => n.noticeType === tab).map(formatNoticeForExcel);
      const ws = XLSX.utils.json_to_sheet(tabData.length > 0 ? tabData : [{ 안내: '수집된 데이터가 없습니다.' }]);
      XLSX.utils.book_append_sheet(wb, ws, tab);
    });
  } else {
    const filtered = notices.filter((n) => n.noticeType === activeTab).map(formatNoticeForExcel);
    const ws = XLSX.utils.json_to_sheet(filtered.length > 0 ? filtered : [{ 안내: '수집된 데이터가 없습니다.' }]);
    XLSX.utils.book_append_sheet(wb, ws, activeTab);
  }

  // File naming rule from PRD: 나라장터_입찰정보_YYYYMMDD_HHmm.xlsx
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const fileName = `나라장터_입찰정보_${yyyy}${mm}${dd}_${hh}${min}.xlsx`;

  XLSX.writeFile(wb, fileName);
}
