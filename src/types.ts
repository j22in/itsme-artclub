export interface ArtClass {
  id: string;
  isVisible: boolean; // 게시 (보이기/숨기기)
  status: string;     // 운영상태
  className: string;  // 운영클래스
  actionText: string; // 액션버튼
  link: string;       // 링크
  isActive: boolean;  // 버튼 활성화 (활성 여부)
}

export type CursorType = string;

export interface CursorInfo {
  type: CursorType;
  image: string;
  name: string;
  color: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  type: string;
  content: string;
  agreeToPrivacy: boolean;
}

export interface SheetConfig {
  sheetUrl: string;
  isCustomUrl: boolean;
}
