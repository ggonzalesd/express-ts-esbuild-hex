export enum EmailServiceTemplates {
  WELCOME = 'welcome',
  VERIFY_EMAIL = 'verify-email',
  FORGOT_PASSWORD = 'forgot-password',
  RESET_PASSWORD = 'reset-password',
  VERIFY_EMAIL_SUCCESS = 'verify-email-success',
}

export interface EmailService {
  sendEmail(
    to: string,
    subject: string,
    template: EmailServiceTemplates,
    data?: unknown | null,
  ): Promise<void>;
}
