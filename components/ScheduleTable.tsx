import React, { useState } from 'react';
import { CalculationResult } from '../types';
import { formatCurrency } from '../utils/calculator';

interface Props {
  schedule: CalculationResult['schedule'];
}

const ScheduleTable: React.FC<Props> = ({ schedule }) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 12; // Show 1 year at a time

  const totalPages = Math.ceil(schedule.length / rowsPerPage);
  const currentRows = schedule.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  if (schedule.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">월별 상환 일정</h2>
        <div className="text-sm text-slate-500">
          {page + 1} / {totalPages} 페이지 ({Math.floor((page * rowsPerPage) / 12) + 1}년차)
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-center">회차</th>
              <th className="px-4 py-3">납입금</th>
              <th className="px-4 py-3">납입원금</th>
              <th className="px-4 py-3">이자</th>
              <th className="px-4 py-3">잔금</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentRows.map((row) => (
              <tr key={row.month} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-center text-slate-500">{row.month}</td>
                <td className="px-4 py-3 font-semibold text-slate-800">{formatCurrency(row.totalPayment)}</td>
                <td className="px-4 py-3 text-slate-600">{formatCurrency(row.principal)}</td>
                <td className="px-4 py-3 text-orange-500">{formatCurrency(row.interest)}</td>
                <td className="px-4 py-3 text-slate-400">{formatCurrency(row.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
        <button
          onClick={handlePrev}
          disabled={page === 0}
          className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
        >
          이전
        </button>
        <div className="text-sm text-slate-500 font-medium">
           {page * rowsPerPage + 1} - {Math.min((page + 1) * rowsPerPage, schedule.length)} 회차
        </div>
        <button
          onClick={handleNext}
          disabled={page === totalPages - 1}
          className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default ScheduleTable;