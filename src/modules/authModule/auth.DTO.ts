export interface Signup {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface ConfirmEmail {
  email: string;
  otp: string;
}

export interface ResendConfirmEmailCode {
  email: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface ForgotPassword {
  email: string;
}

export interface VerifyPasswordResetCode {
  email: string;
  otp: string;
}
