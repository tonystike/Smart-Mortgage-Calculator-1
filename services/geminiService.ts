import { GoogleGenAI } from "@google/genai";
import { LoanInput, CalculationResult, RepaymentMethod } from "../types";

const getRepaymentMethodName = (method: RepaymentMethod) => {
  switch (method) {
    case RepaymentMethod.Maturity: return "원금일시상환";
    case RepaymentMethod.EqualPrincipal: return "원금균등분할상환";
    case RepaymentMethod.EqualPrincipalAndInterest: return "원리금균등분할상환";
    default: return method;
  }
};

export const getAIAdvice = async (input: LoanInput, result: CalculationResult): Promise<string> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey.includes("본인의_GEMINI_API_KEY")) {
    return "API 키가 설정되지 않았습니다. Vercel 설정에서 API_KEY를 추가해주세요.";
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });

  const prompt = `
    당신은 전문 재무 설계사입니다. 사용자가 다음과 같은 주택담보대출 조건을 입력했습니다:
    
    - 대출금액: ${(input.amount / 10000).toLocaleString()} 억원 (${input.amount.toLocaleString()} 원)
    - 연이자율: ${input.rate}%
    - 대출기간: ${input.term}년
    - 상환방식: ${getRepaymentMethodName(input.method)}
    
    계산 결과:
    - 총 납입 이자: ${Math.round(result.totalInterest).toLocaleString()} 원
    - 총 상환 금액: ${Math.round(result.totalPayment).toLocaleString()} 원
    - 첫 달 납입금: ${Math.round(result.schedule[0].totalPayment).toLocaleString()} 원
    ${result.schedule.length > 1 ? `- 마지막 달 납입금: ${Math.round(result.schedule[result.schedule.length - 1].totalPayment).toLocaleString()} 원` : ''}

    이 대출 조건에 대한 분석과 조언을 제공해주세요. 다음 내용을 포함해야 합니다:
    1. 이 상환 방식의 장단점 설명.
    2. 현재 금리(${input.rate}%)가 적절한 수준인지에 대한 일반적인 코멘트 (2024-2025년 시장 상황 가정).
    3. 월 상환 부담을 줄이기 위한 팁이나 조기 상환 전략.
    4. 주의해야 할 잠재적 리스크.

    결과는 마크다운 형식으로 깔끔하게 작성해주세요. 한국어로 답변하세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful, professional financial advisor specializing in Korean real estate loans.",
      }
    });

    return response.text || "조언을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 조언을 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};