import { ArtClass } from '../types';

export const DEFAULT_CLASSES: ArtClass[] = [
  {
    id: 'class-1',
    isVisible: true,
    status: '상시 운영',
    className: '이츠미아트클럽 성남 스튜디오',
    actionText: '네이버 예약하기 →',
    link: 'https://booking.naver.com',
    isActive: true
  },
  {
    id: 'class-2',
    isVisible: false, // 숨기기
    status: '대기 신청',
    className: '현대백화점 판교점 문화센터',
    actionText: '예약하러 가기 →',
    link: 'https://www.ehyundai.com',
    isActive: true
  },
  {
    id: 'class-3',
    isVisible: true,
    status: '접수 마감',
    className: '어린이도서관 클래스',
    actionText: '예약하러 가기 →',
    link: '',
    isActive: false
  },
  {
    id: 'class-4',
    isVisible: true,
    status: '접수 예정',
    className: 'Coming soon',
    actionText: '준비 중 입니다.',
    link: '',
    isActive: false
  }
];

/**
 * Parses Google Sheets Published CSV data into ArtClass array.
 * Highly robust fallback is included in case of network errors.
 */
export async function fetchGoogleSheetClasses(csvUrl: string): Promise<ArtClass[]> {
  if (!csvUrl) {
    return DEFAULT_CLASSES;
  }
  
  try {
    // Prevent browser caching by appending a cache buster timestamp
    const separator = csvUrl.includes('?') ? '&' : '?';
    const cacheBusterUrl = `${csvUrl}${separator}_t=${Date.now()}`;
    
    const response = await fetch(cacheBusterUrl);
    if (!response.ok) {
      throw new Error('네트워크 응답이 정상적이지 않습니다.');
    }
    let text = await response.text();
    // Remove UTF-8 BOM if present
    text = text.replace(/^\uFEFF/, '');
    
    return parseCSVToClasses(text);
  } catch (error) {
    console.error('구글 시트 로딩 에러, 기본 모의 데이터를 사용합니다:', error);
    throw error;
  }
}

function parseCSVToClasses(csvText: string): ArtClass[] {
  const lines = csvText.split(/\r?\n/);
  if (lines.length <= 1) return DEFAULT_CLASSES;

  const classes: ArtClass[] = [];
  
  // Skip header (Assumes columns: 게시, 운영상태, 운영클래스, 액션버튼, 링크, 버튼 활성화)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const columns: string[] = [];
    let insideQuote = false;
    let currentColumn = '';
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        columns.push(currentColumn.trim());
        currentColumn = '';
      } else {
        currentColumn += char;
      }
    }
    columns.push(currentColumn.trim());

    if (columns.length < 4) continue; // Minimum columns: 게시, 운영상태, 운영클래스, 액션버튼

    const rawIsVisible = columns[0].replace(/^"|"$/g, '').trim();
    const isVisible = rawIsVisible === '보이기';

    const status = columns[1].replace(/^"|"$/g, '').trim();
    const className = columns[2].replace(/^"|"$/g, '').trim();
    const actionText = columns[3].replace(/^"|"$/g, '').trim();
    
    const link = columns[4] ? columns[4].replace(/^"|"$/g, '').trim() : '';
    const rawIsActive = columns[5] ? columns[5].replace(/^"|"$/g, '').trim() : '';
    const isActive = rawIsActive === '활성';

    classes.push({
      id: `sheet-class-${i}`,
      isVisible,
      status,
      className,
      actionText,
      link,
      isActive
    });
  }

  return classes.length > 0 ? classes : DEFAULT_CLASSES;
}
