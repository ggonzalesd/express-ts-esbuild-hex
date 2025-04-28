import { container } from 'tsyringe';

import path from 'node:path';

import mjml2html from 'mjml';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';

import { fileCacher } from '@@tool/cache/fileCacher.lib';

import {
  ConfigService,
  EmailService,
  EmailServiceTemplates,
} from '@@app/ports';

import { DEP_ENVIRONMENT } from '@@const/injection.enum';
import { DepEmail } from '@@const/dependencies.enum';

export class MjmlMailAdapter implements EmailService {
  private transporter: nodemailer.Transporter;
  private cacheTemplate: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor(private env: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.env.SMTP_HOST,
      port: this.env.SMTP_PORT,
      secure: this.env.SMTP_SECURE === 'tls',
      auth: this.env.IS_PRODUCTION
        ? {
            user: this.env.SMTP_USER,
            pass: this.env.SMTP_PASS,
          }
        : undefined,
    });
  }

  private makeHtml(
    templateName: EmailServiceTemplates,
    data?: unknown | null,
  ): string {
    if (this.cacheTemplate.has(templateName)) {
      const template = this.cacheTemplate.get(templateName)!;
      return template(data);
    }

    const mailContent = fileCacher(
      path.resolve(this.env.EMAIL_FOLDER, templateName + '.mjml'),
    );

    const { html } = mjml2html(mailContent);
    const template = handlebars.compile(html);
    this.cacheTemplate.set(templateName, template);

    const emailHtml = template(data);

    return emailHtml;
  }

  sendEmail(
    to: string,
    subject: string,
    template: EmailServiceTemplates,
    data?: unknown | null,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: this.env.EMAIL_FROM,
        to,
        subject,
        html: this.makeHtml(template, data),
      };

      this.transporter.sendMail(mailOptions, (error) => {
        if (error) {
          return reject(error);
        }
        resolve();
      });
    });
  }
}

container.register<EmailService>(DepEmail.MJML, {
  useValue: new MjmlMailAdapter(container.resolve(DEP_ENVIRONMENT)),
});
