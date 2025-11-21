export enum RepaymentMethod {
  Maturity = 'Maturity', // 원금일시상환
  EqualPrincipal = 'EqualPrincipal', // 원금균등분할상환
  EqualPrincipalAndInterest = 'EqualPrincipalAndInterest', // 원리금균등분할상환
}

export interface LoanInput {
  amount: number; // 대출금 (만원 단위 recommended for UI, converted for calc)
  rate: number; // 연이자 (%)
  term: number; // 기간 (년)
  method: RepaymentMethod;
}

export interface AmortizationItem {
  month: number;
  principal: number;
  interest: number;
  totalPayment: number;
  balance: number;
}

export interface CalculationResult {
  totalInterest: number;
  totalPayment: number;
  schedule: AmortizationItem[];
}