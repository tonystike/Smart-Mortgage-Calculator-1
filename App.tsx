import React, { useState, useMemo } from 'react';
import InputForm from './components/InputForm';
import Summary from './components/Summary';
import ScheduleTable from './components/ScheduleTable';
import AIAdvisor from './components/AIAdvisor';
import { LoanInput, RepaymentMethod, CalculationResult } from './types';
import { calculateLoan } from './utils/calculator';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const App: React.FC = () => {
  const [input, setInput] = useState<LoanInput>({
    amount: 300000000, // Default 3억
    rate: 4.5, // Default 4.5%
    term: 30, // Default 30 years
    method: RepaymentMethod.EqualPrincipalAndInterest,
  });

  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleCalculate = () => {
    const calcResult = calculateLoan(input.amount, input.rate, input.term, input.method);
    setResult(calcResult);
  };

  // Calculate initially on mount
  React.useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Chart Data sampling (showing every 12th month for cleanliness if too long)
  const chartData = useMemo(() => {
    if (!result) return [];
    // If loan is > 10 years, sample annually, else monthly
    const samplingRate = input.term > 10 ? 12 : 1;
    return result.schedule.filter((_, idx) => (idx + 1) % samplingRate === 0).map(item => ({
      name: `${Math.ceil(item.month / 12)}년차`,
      원금: item.principal,
      이자: item.interest,
      잔금: item.balance
    }));
  }, [result, input.term]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            주택담보대출 계산기
          </h1>
          <p className="text-slate-500 text-lg">
            복잡한 대출 상환, 한눈에 확인하고 AI 조언까지 받아보세요.
          </p>
        </div>

        {/* Top Section: Inputs & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <InputForm
              input={input}
              onChange={setInput}
              onCalculate={handleCalculate}
            />
          </div>
          <div className="lg:col-span-2">
            {result && <Summary result={result} loanAmount={input.amount} />}
          </div>
        </div>

        {/* Charts & AI Advice */}
        {result && (
          <>
            {/* Chart Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6">연도별 상환금 구성 추이</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                    <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <YAxis 
                      tickFormatter={(val) => `${(val / 10000).toLocaleString()}만`}
                      tick={{fontSize: 12, fill: '#64748b'}} 
                      axisLine={false} 
                      tickLine={false}
                    />
                    <Tooltip 
                      formatter={(value: number) => new Intl.NumberFormat('ko-KR').format(value)}
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="이자" 
                      stackId="1" 
                      stroke="#f97316" 
                      fillOpacity={1} 
                      fill="url(#colorInterest)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="원금" 
                      stackId="1" 
                      stroke="#3b82f6" 
                      fillOpacity={1} 
                      fill="url(#colorPrincipal)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <AIAdvisor input={input} result={result} />
            
            {/* Detailed Table */}
            <ScheduleTable schedule={result.schedule} />
          </>
        )}
      </div>
    </div>
  );
};

export default App;