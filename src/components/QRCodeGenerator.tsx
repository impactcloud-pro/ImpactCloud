import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Download, 
  Copy, 
  QrCode,
  Smartphone,
  ExternalLink,
  Printer
} from 'lucide-react';

interface QRCodeGeneratorProps {
  url: string;
  title: string;
  description?: string;
  size?: number;
}

export function QRCodeGenerator({ url, title, description, size = 200 }: QRCodeGeneratorProps) {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
  };
  
  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qr-code-${title.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const printQR = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${title}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px;
                direction: rtl;
              }
              .qr-container {
                max-width: 600px;
                margin: 0 auto;
                border: 2px solid #ddd;
                padding: 30px;
                border-radius: 10px;
              }
              .qr-title {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
                color: #183259;
              }
              .qr-description {
                font-size: 16px;
                color: #666;
                margin-bottom: 20px;
              }
              .qr-image {
                margin: 20px 0;
              }
              .qr-url {
                font-size: 14px;
                color: #333;
                word-break: break-all;
                background: #f5f5f5;
                padding: 10px;
                border-radius: 5px;
                margin-top: 20px;
              }
              .logo {
                margin-bottom: 20px;
                color: #183259;
                font-size: 20px;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <div class="logo">أثرنا - منصة قياس الأثر الاجتماعي</div>
              <div class="qr-title">${title}</div>
              ${description ? `<div class="qr-description">${description}</div>` : ''}
              <div class="qr-image">
                <img src="${qrCodeUrl}" alt="QR Code" />
              </div>
              <div class="qr-url">
                <strong>الرابط:</strong><br/>
                ${url}
              </div>
              <div style="margin-top: 20px; font-size: 12px; color: #888;">
                امسح الرمز باستخدام كاميرا الجوال للوصول المباشر للاستبيان
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };
  
  return (
    <Card className="border-2 border-dashed border-gray-300 hover:border-[#183259] transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <QrCode className="h-4 w-4" />
          {title}
        </CardTitle>
        {description && (
          <p className="text-xs text-gray-600">{description}</p>
        )}
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="flex justify-center">
          <img 
            src={qrCodeUrl} 
            alt={`QR Code for ${title}`}
            className="border rounded-lg shadow-sm"
            width={size}
            height={size}
          />
        </div>
        
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <code className="break-all">{url}</code>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center">
          <Button size="sm" variant="outline" onClick={copyToClipboard}>
            <Copy className="h-3 w-3 ml-1" />
            نسخ الرابط
          </Button>
          <Button size="sm" variant="outline" onClick={downloadQR}>
            <Download className="h-3 w-3 ml-1" />
            تحميل QR
          </Button>
          <Button size="sm" variant="outline" onClick={printQR}>
            <Printer className="h-3 w-3 ml-1" />
            طباعة
          </Button>
          <Button size="sm" variant="outline" onClick={() => window.open(url, '_blank')}>
            <ExternalLink className="h-3 w-3 ml-1" />
            فتح
          </Button>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <Smartphone className="h-3 w-3" />
          <span>امسح بكاميرا الجوال</span>
        </div>
      </CardContent>
    </Card>
  );
}