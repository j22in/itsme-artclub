import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Settings } from 'lucide-react';

export default function ContactSection() {
  const [inquiryType, setInquiryType] = useState('출강 문의');
  const [details, setDetails] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Google Form configuration for admin, hidden cleanly
  const [googleFormConfig, setGoogleFormConfig] = useState({
    formId: '1FAIpQLSdp7gIWdg_XYAOAKU9wdvt8kqZLgGD1AjsE7mkOHBtrDjjyVw',
    entryType: 'entry.1544645650',
    entryName: 'entry.891444523',
    entryPhone: 'entry.869671899',
    entryEmail: 'entry.1607825344',
    entryContent: 'entry.1566088527',
    isCustomForm: true,
  });
  const [showConfig, setShowConfig] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate submission or execute Google Form submit
    setTimeout(() => {
      const formElement = document.getElementById('itsme-contact-form') as HTMLFormElement;
      if (formElement && googleFormConfig.isCustomForm) {
        formElement.submit();
      }
      setLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
    });
    setInquiryType('출강 문의');
    setDetails('');
    setIsSubmitted(false);
  };

  return (
    <div id="contact" className="scroll-section w-full bg-transparent py-20 md:py-28 select-none flex flex-col items-center relative z-10 pb-[25vh] min-h-screen justify-center">
      {/* Hidden iframe for Google Form submissions */}
      <iframe name="contact_hidden_iframe" id="contact_hidden_iframe" className="hidden" />

      <div className="max-w-[600px] w-full mx-auto px-6 space-y-12 text-center">
        {/* Artsy Orange Heading & Subtitle */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="space-y-3"
        >
          <h2 className="text-[33px] font-handy font-normal text-[#FF5F1F] tracking-wide">
            Business Partnership
          </h2>
          <p className="text-[13px] font-sans font-light text-[#4F4A45] max-w-lg mx-auto mt-3">
            이츠미아트클럽의 독보적인 감각 프로그램과 시너지 나는 협업을 펼쳐보세요.
          </p>
        </motion.div>

        {/* Action Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="space-y-1"
        >
          <h3 className="text-lg md:text-xl font-bold text-neutral-900 tracking-tight">
            출강 및 제휴 문의하기
          </h3>
          <p className="text-[11px] text-neutral-400 font-sans">
            필요한 정보를 입력하신 뒤 전송해주시면 신속히 응대하겠습니다.
          </p>
        </motion.div>

        {/* Completely borderless & shadowless form directly on white page background */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-md mx-auto w-full text-left"
        >
          {!isSubmitted ? (
            <form
              id="itsme-contact-form"
              target="contact_hidden_iframe"
              action={`https://docs.google.com/forms/d/e/${googleFormConfig.formId}/formResponse`}
              method="POST"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Inquiry Type (Dropdown Select as explicitly requested "출강제휴 문의종류는 드롭다운 선택이야.") */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-500 font-sans tracking-wide">
                  문의 분류
                </label>
                <div className="relative">
                  <select
                    name={googleFormConfig.entryType}
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-50 hover:bg-neutral-100 rounded-2xl text-xs font-sans text-neutral-800 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all border border-neutral-200/80 appearance-none cursor-pointer"
                  >
                    <option value="출강 문의">출강 문의 (학교, 기업, 기관 등)</option>
                    <option value="제휴 문의">제휴 및 파트너십 문의</option>
                    <option value="기타 문의">기타 문의사항</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-400 text-[10px]">
                    ▼
                  </div>
                </div>
              </div>

              {/* Name field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-500 font-sans tracking-wide">
                  담당자 성함 / 소속 기관
                </label>
                <input
                  type="text"
                  name={googleFormConfig.entryName}
                  required
                  placeholder="홍길동 / 이츠미컴퍼니"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 hover:bg-neutral-100 focus:bg-white rounded-2xl text-xs font-sans text-neutral-800 placeholder-neutral-400 focus:outline-none border border-neutral-200/80 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                />
              </div>

              {/* Phone field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-500 font-sans tracking-wide">
                  연락처 (전화번호)
                </label>
                <input
                  type="text"
                  name={googleFormConfig.entryPhone}
                  required
                  placeholder="010-1234-5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 hover:bg-neutral-100 focus:bg-white rounded-2xl text-xs font-sans text-neutral-800 placeholder-neutral-400 focus:outline-none border border-neutral-200/80 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                />
              </div>

              {/* Email field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-500 font-sans tracking-wide">
                  이메일 주소
                </label>
                <input
                  type="email"
                  name={googleFormConfig.entryEmail}
                  required
                  placeholder="itsme@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 hover:bg-neutral-100 focus:bg-white rounded-2xl text-xs font-sans text-neutral-800 placeholder-neutral-400 focus:outline-none border border-neutral-200/80 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                />
              </div>

              {/* Detailed inquiry content */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-500 font-sans tracking-wide">
                  상세 문의 및 제안 내용
                </label>
                <textarea
                  name={googleFormConfig.entryContent}
                  required
                  rows={4}
                  placeholder="출강 희망 인원, 일정, 지역 및 원하시는 제휴 방향을 자세히 남겨주시면 더욱 빠른 답변이 가능합니다."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 hover:bg-neutral-100 focus:bg-white rounded-2xl text-xs font-sans text-neutral-800 placeholder-neutral-400 focus:outline-none border border-neutral-200/80 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none"
                />
              </div>



              {/* Button: Orange block pill */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF5F1F] hover:bg-[#e24e16] text-white text-xs font-bold py-3.5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md focus:outline-none mt-2 cursor-pointer"
              >
                {loading ? '보내는 중...' : '문의 등록하기'}
              </button>
            </form>
          ) : (
            /* Submission success state directly in layout */
            <div className="text-center py-10 space-y-4">
              <CheckCircle className="w-12 h-12 text-[#FF5F1F] mx-auto animate-bounce" />
              <h4 className="text-base font-bold text-neutral-900">
                소중한 문의가 전송되었습니다!
              </h4>
              <p className="text-[11px] text-neutral-500 leading-relaxed font-sans max-w-sm mx-auto">
                담당자 검토 후 남겨주신 연락처와 이메일({formData.email})로 신속히 연락을 드리겠습니다. 감사합니다.
              </p>
              <button
                onClick={handleReset}
                className="text-xs text-neutral-400 hover:text-[#FF5F1F] underline transition-all pt-2 block mx-auto cursor-pointer"
              >
                새로 문의하기
              </button>
            </div>
          )}
        </motion.div>

        {/* 150px spacer below the form */}
        <div style={{ height: '150px' }} />

        {/* Instagram block */}
        <div className="flex flex-col items-center gap-3">
          <a
            href="https://www.instagram.com/itsme_artclub"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram @itsme_artclub"
            className="flex items-center justify-center"
          >
            {/* Instagram SVG icon - Black outline, 25px */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-[25px] h-[25px]"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="#000000" stroke="none" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/itsme_artclub"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-cormorant text-neutral-900 tracking-wide hover:text-[#FF5F1F] transition-colors duration-300"
          >
            @itsme_artclub
          </a>
        </div>

        {/* Kakao channel block */}
        <div className="flex flex-col items-center gap-3 mt-4">
          <a
            href="http://pf.kakao.com/_wlFGn/chat"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="카카오채널 이츠미아트클럽"
            className="flex items-center justify-center"
          >
            {/* Kakao chat SVG icon - Black outline, 25px */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-[25px] h-[25px]"
            >
              <path d="M12 21a9 9 0 1 0-9-9c0 1.48.36 2.89 1 4.12l-1.5 4.5 4.66-1.4A8.95 8.95 0 0 0 12 21Z" />
            </svg>
          </a>
          <a
            href="http://pf.kakao.com/_wlFGn/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-sans font-light text-neutral-900 tracking-wide hover:text-[#FF5F1F] transition-colors duration-300"
          >
            @이츠미아트클럽
          </a>
        </div>

        {/* 150px bottom spacer */}
        <div style={{ height: '150px' }} />

      </div>
    </div>
  );
}
