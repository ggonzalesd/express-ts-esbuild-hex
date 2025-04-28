import { inject, injectable } from 'tsyringe';

import {
  EmailService,
  EmailServiceTemplates,
} from '@@app/ports/EmailService.port';

import { DEP_EMAIL } from '@@const/injection.enum';

@injectable()
export class MailerService {
  constructor(@inject(DEP_EMAIL) private emailService: EmailService) {}

  async verifyEmail(to: string, verificationLink: string) {
    const subject = 'Verify your email address';
    const data = { verificationLink, to };

    await this.emailService.sendEmail(
      to,
      subject,
      EmailServiceTemplates.VERIFY_EMAIL,
      data,
    );
  }
}
