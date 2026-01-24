export interface UserSignatureData {
  employeeId: string;
  employeeName: string;
  rol: number;
  signatureImagePath: string;
  status: number;
  userId: number;
  userName: string;
}

export interface AnswerSignProps {
  onComplete: (isValid: boolean, url?: string) => void;
}
