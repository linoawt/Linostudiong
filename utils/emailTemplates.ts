
/**
 * Lino Studio NG - Email Template Utility
 * Generates responsive HTML emails with a claymorphic aesthetic.
 */

export type EmailType = 'PROJECT_UPDATE' | 'COMPLETION' | 'GENERAL_MESSAGE';

interface EmailData {
  title: string;
  recipientName: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
  referenceCode?: string;
}

export const getClaymorphicEmailTemplate = (type: EmailType, data: EmailData): string => {
  const accentColor = '#4F46E5';
  const bgColor = '#F0F4F8';

  const typeConfig = {
    PROJECT_UPDATE: { icon: '🚀', label: 'In-Progress Update' },
    COMPLETION: { icon: '✨', label: 'Project Delivered' },
    GENERAL_MESSAGE: { icon: '📩', label: 'New Notification' }
  };

  const { icon, label } = typeConfig[type];

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: ${bgColor}; margin: 0; padding: 20px; }
        .wrapper { max-width: 600px; margin: 0 auto; background-color: ${bgColor}; padding: 30px; border-radius: 40px; }
        .card { 
          background-color: #ffffff; 
          border-radius: 35px; 
          padding: 40px; 
          box-shadow: 20px 20px 60px #cbd5e0, -20px -20px 60px #ffffff;
          text-align: center;
        }
        .icon-box {
          width: 80px;
          height: 80px;
          margin: 0 auto 25px;
          background-color: #ffffff;
          border-radius: 25px;
          box-shadow: inset 8px 8px 16px #cbd5e0, inset -8px -8px 16px #ffffff;
          display: table;
        }
        .icon-box span {
          display: table-cell;
          vertical-align: middle;
          font-size: 35px;
        }
        .label {
          font-size: 10px;
          font-weight: 900;
          color: ${accentColor};
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 10px;
        }
        h1 { font-size: 24px; font-weight: 800; color: #1a1a2e; margin: 0 0 20px; }
        p { font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 30px; }
        .button {
          display: inline-block;
          background-color: ${accentColor};
          color: #ffffff !important;
          padding: 18px 35px;
          border-radius: 20px;
          text-decoration: none;
          font-weight: 700;
          box-shadow: 0 10px 20px rgba(79, 70, 229, 0.2);
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #a0aec0;
          text-align: center;
        }
        .ref-code {
          font-family: monospace;
          background: #f1f5f9;
          padding: 5px 10px;
          border-radius: 8px;
          color: #4a5568;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="card">
          <div class="icon-box"><span>${icon}</span></div>
          <div class="label">${label}</div>
          <h1>${data.title}</h1>
          <p>Hi ${data.recipientName},<br><br>${data.message}</p>
          ${data.actionUrl ? `<a href="${data.actionUrl}" class="button">${data.actionText || 'View Details'}</a>` : ''}
          ${data.referenceCode ? `<div style="margin-top: 30px; font-size: 11px;">Ref Code: <span class="ref-code">${data.referenceCode}</span></div>` : ''}
        </div>
        <div class="footer">
          &copy; 2025 Lino Studio NG &bull; Designing Identity. Building Reality.
        </div>
      </div>
    </body>
    </html>
  `;
};
