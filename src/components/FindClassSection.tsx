import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArtClass, SheetConfig } from '../types';
import { DEFAULT_CLASSES, fetchGoogleSheetClasses } from '../data/mockClasses';
import { RefreshCw, CheckCircle2, AlertCircle, Settings } from 'lucide-react';
// 웹에 게시(CSV)한 구글 시트 주소를 여기에 입력해두면 모든 방문자에게 실시간 자동 반영됩니다.
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_CfIeU_9v52aWFFWwN8SrKSNtYR2weTK3WE02NLrOxHyN-7s5SJOHk9TXuvcgIgEfcC_eLq-_3IIj/pub?gid=1552204772&single=true&output=csv';

export default function FindClassSection() {
  const [classes, setClasses] = useState<ArtClass[]>(DEFAULT_CLASSES);
  const [loading, setLoading] = useState(false);
  
  // Sheet configuration
  const [sheetConfig, setSheetConfig] = useState<SheetConfig>({
    sheetUrl: GOOGLE_SHEET_CSV_URL,
    isCustomUrl: !!GOOGLE_SHEET_CSV_URL,
  });
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Load classes initially or from localStorage/constant URL
  useEffect(() => {
    const activeUrl = GOOGLE_SHEET_CSV_URL || localStorage.getItem('itsme_sheet_url');
    if (activeUrl) {
      syncData(activeUrl);
    } else {
      setClasses(DEFAULT_CLASSES);
    }
  }, []);

  const syncData = async (url: string) => {
    if (!url) return;
    setLoading(true);
    setSyncStatus('idle');
    setErrorMessage('');
    
    try {
      const data = await fetchGoogleSheetClasses(url);
      setClasses(data);
      setSyncStatus('success');
      localStorage.setItem('itsme_sheet_url', url);
    } catch (err: any) {
      setSyncStatus('error');
      setErrorMessage(err.message || '구글 시트를 읽어오는 도중 에러가 발생했습니다. 열 형식을 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sheetConfig.sheetUrl.trim()) {
      syncData(sheetConfig.sheetUrl.trim());
    }
  };

  const resetToDefault = () => {
    setClasses(DEFAULT_CLASSES);
    setSheetConfig({ sheetUrl: '', isCustomUrl: false });
    setSyncStatus('idle');
    setErrorMessage('');
    localStorage.removeItem('itsme_sheet_url');
  };

  // Filter classes to only show items marked as visible
  const displayClasses = classes.filter(item => item.isVisible);

  return (
    <div id="classes" className="scroll-section w-full bg-transparent py-20 md:py-28 select-none relative min-h-[120vh] flex flex-col justify-start pb-[20vh]">
      
      {/* Centered Main Content */}
      <div className="max-w-[700px] mx-auto px-6 w-full flex-1 flex flex-col justify-center py-8">
        {/* Find a Class Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-2 mb-16"
        >
          <h2 className="text-[33px] font-handy font-normal text-[#FF5F1F] tracking-wide">
            Find a Class
          </h2>
          <p className="text-[14px] font-sans font-light text-[#4F4A45]">
            지금 우리 아이와 가장 가까운 이츠미아트클럽을 만나보세요.
          </p>
        </motion.div>

        {/* Classes Clean Centered List - Borderless, max-width 450px, left-aligned */}
        <div className="space-y-0 divide-y divide-neutral-200/50">
          {displayClasses.map((item, index) => {
            const isClickable = item.isActive && item.link && item.link !== '#';
            
            return (
              <motion.div 
                key={item.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="py-6 flex flex-col items-start text-left max-w-[450px] mx-auto w-full space-y-2.5 group bg-transparent"
              >
                {/* Category / Status badge-style light text - font-light */}
                <span className="text-[11px] md:text-xs font-sans tracking-widest text-neutral-400 font-light">
                  {item.status}
                </span>

                {/* Main title - font-bold */}
                <h3 className="text-base md:text-lg font-bold text-neutral-900 tracking-tight leading-snug">
                  {item.className}
                </h3>

                {/* Booking link or gray status label - font-medium */}
                <div className="pt-1">
                  {isClickable ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs md:text-sm text-neutral-800 hover:text-orange-500 font-medium tracking-wide transition-colors duration-300 flex items-center justify-center gap-0.5 cursor-pointer"
                    >
                      {item.actionText}
                    </a>
                  ) : (
                    <span className="text-xs md:text-sm text-neutral-400 font-medium tracking-wide cursor-not-allowed">
                      {item.actionText}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
