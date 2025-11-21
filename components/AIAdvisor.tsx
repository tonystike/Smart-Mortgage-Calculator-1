import React, { useState } from 'react';
import { LoanInput, CalculationResult } from '../types';
import { getAIAdvice } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface Props {
  input: LoanInput;
  result: CalculationResult;
}

const AIAdvisor: React.FC<Props> = ({ input, result }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetAdvice = async () => {
    setLoading(true);
    const response = await getAIAdvice(input, result);
    setAdvice(response);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
            </svg>
            AI 금융 조언
          </h2>
          <p className="text-indigo-600/80 text-sm mt-1">현재 대출 조건에 대한 Gemini AI의 분석을 받아보세요.</p>
        </div>
        <button
          onClick={handleGetAdvice}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              분석 중...
            </>
          ) : (
            '분석 요청하기'
          )}
        </button>
      </div>

      {advice && (
        <div className="bg-white p-6 rounded-xl border border-indigo-100 prose prose-sm max-w-none prose-headings:text-indigo-900 prose-p:text-slate-600 prose-strong:text-indigo-800 prose-li:text-slate-600">
          <ReactMarkdown>{advice}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default AIAdvisor;