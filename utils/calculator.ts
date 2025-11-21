import { CalculationResult, RepaymentMethod, AmortizationItem } from '../types';

export const calculateLoan = (
  amount: number, 
  ratePercent: number, 
  termYears: number, 
  method: RepaymentMethod
): CalculationResult => {
  const principal = amount;
  const monthlyRate = ratePercent / 100 / 12;
  const months = termYears * 12;
  
  let schedule: AmortizationItem[] = [];
  let totalInterest = 0;
  let totalPayment = 0;

  if (method === RepaymentMethod.Maturity) {
    // 원금일시상환: Interest only every month, Principal at the end
    for (let i = 1; i <= months; i++) {
      const interest = principal * monthlyRate;
      const paymentPrincipal = i === months ? principal : 0;
      const payment = interest + paymentPrincipal;
      const balance = i === months ? 0 : principal;

      schedule.push({
        month: i,
        principal: paymentPrincipal,
        interest: interest,
        totalPayment: payment,
        balance: balance
      });

      totalInterest += interest;
    }
    totalPayment = totalInterest + principal;

  } else if (method === RepaymentMethod.EqualPrincipal) {
    // 원금균등분할상환: Fixed Principal, Decreasing Interest
    const monthlyPrincipal = principal / months;
    let currentBalance = principal;

    for (let i = 1; i <= months; i++) {
      const interest = currentBalance * monthlyRate;
      const payment = monthlyPrincipal + interest;
      currentBalance -= monthlyPrincipal;
      
      // Adjust for floating point errors at the last month if needed
      if (i === months && Math.abs(currentBalance) < 10) {
        currentBalance = 0;
      }

      schedule.push({
        month: i,
        principal: monthlyPrincipal,
        interest: interest,
        totalPayment: payment,
        balance: Math.max(0, currentBalance)
      });

      totalInterest += interest;
    }
    totalPayment = totalInterest + principal;

  } else if (method === RepaymentMethod.EqualPrincipalAndInterest) {
    // 원리금균등분할상환: Fixed Total Payment
    // PMT = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const pmt = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    let currentBalance = principal;

    for (let i = 1; i <= months; i++) {
      const interest = currentBalance * monthlyRate;
      let monthlyPrincipal = pmt - interest;
      
      // Handle last month precision
      if (i === months) {
        monthlyPrincipal = currentBalance;
      }
      
      let payment = monthlyPrincipal + interest;
      currentBalance -= monthlyPrincipal;

      schedule.push({
        month: i,
        principal: monthlyPrincipal,
        interest: interest,
        totalPayment: payment,
        balance: Math.max(0, currentBalance)
      });

      totalInterest += interest;
    }
    totalPayment = schedule.reduce((acc, item) => acc + item.totalPayment, 0);
  }

  return {
    totalInterest,
    totalPayment,
    schedule
  };
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0
  }).format(value);
};