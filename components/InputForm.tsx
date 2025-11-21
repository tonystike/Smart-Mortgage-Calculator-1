import React from 'react';
import { LoanInput, RepaymentMethod } from '../types';

interface Props {
  input: LoanInput;
  onChange: (input: LoanInput) => void;
  onCalculate: () => void;
}

const InputForm: React.FC<Props> = ({ input, onChange, onCalculate }) => {
  const handleChange = (field: keyof LoanInput, value: any) => {
    onChange({ ...input, [field]: value });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        대출 조건 입력
      </h2>
      
      <div className="space-y-4">
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">대출금액 (원)</label>
          <div className="relative">
            <input
              type="number"
              value={input.amount}
              onChange={(e) => handleChange('amount', Number(e.target.value))}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="예: 300000000"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">원</div>
          </div>
          <p className="text-xs text-slate-400 mt-1 text-right">
            {(input.amount / 100000000).toFixed(2)} 억원
          </p>
        </div>

        {/* Rate & Term Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">연이자율 (%)</label>
            <input
              type="number"
              step="0.1"
              value={input.rate}
              onChange={(e) => handleChange('rate', Number(e.target.value))}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">대출기간 (년)</label>
            <input
              type="number"
              value={input.term}
              onChange={(e) => handleChange('term', Number(e.target.value))}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Method */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">상환방식</label>
          <select
            value={input.method}
            onChange={(e) => handleChange('method', e.target.value as RepaymentMethod)}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white transition-all cursor-pointer"
          >
            <option value={RepaymentMethod.EqualPrincipalAndInterest}>원리금균등분할상환 (매달 같은 금액)</option>
            <option value={RepaymentMethod.EqualPrincipal}>원금균등분할상환 (매달 원금 일정, 이자 감소)</option>
            <option value={RepaymentMethod.Maturity}>원금일시상환 (이자만 내다가 만기에 원금 상환)</option>
          </select>
        </div>

        <button
          onClick={onCalculate}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-lg shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
        >
          계산하기
        </button>
      </div>
    </div>
  );
};

export default InputForm;