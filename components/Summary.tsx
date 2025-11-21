import React from 'react';
import { CalculationResult } from '../types';
import { formatCurrency } from '../utils/calculator';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Props {
  result: CalculationResult;
  loanAmount: number;
}

const Summary: React.FC<Props> = ({ result, loanAmount }) => {
  const data = [
    { name: '대출 원금', value: loanAmount, color: '#3b82f6' }, // blue-500
    { name: '총 이자', value: result.totalInterest, color: '#f97316' }, // orange-500
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
        상환 요약
      </h2>

      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/2 h-64 relative">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <div className="text-xs text-slate-500">총 상환금액</div>
                <div className="text-sm font-bold text-slate-800">{formatCurrency(result.totalPayment)}</div>
             </div>
        </div>

        <div className="w-full md:w-1/2 space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">총 대출 원금</p>
            <p className="text-xl font-bold text-slate-900">{formatCurrency(loanAmount)}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
            <p className="text-sm text-orange-600 mb-1">총 이자 비용</p>
            <p className="text-xl font-bold text-orange-700">{formatCurrency(result.totalInterest)}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
             <p className="text-sm text-blue-600 mb-1">
               {result.schedule.length > 0 ? "1회차 월 상환금" : "월 평균 상환금"}
             </p>
             <p className="text-xl font-bold text-blue-700">
               {result.schedule.length > 0 ? formatCurrency(result.schedule[0].totalPayment) : 0}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;