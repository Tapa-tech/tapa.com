/**
/**
 * PDF Generator Engine for The Tapa Co.
 * 
 * Supports:
 * - Full Article & Samagri content
 * - User name personalization
 * - Date timestamping
 * - Tapa Branding & Logo
 * - 100% accurate Devanagari/Hindi rendering without tofu/boxes (□)
 */

export interface PdfGeneratorOptions {
  title: string;
  subtitle?: string;
  category?: string;
  userName?: string;
  downloadDate?: string;
  mode?: 'full' | 'samagri';
  
  // Content Sections
  sotCard?: {
    heading?: string;
    claim?: string;
    source?: string;
  };
  storyText?: string;
  sankalpaText?: string;
  sankalpaMeaning?: string;
  sankalpaCards?: Array<{ k: string; v: string }>;
  vidhiDays?: Array<{ dayTitle: string; steps: string[] }>;
  samagriItems?: Array<{ itemName: string; itemDetails?: string }>;
  fastingOptions?: Array<{ title: string; description: string }>;
  mythsList?: Array<{ myth: string; correction: string }>;
}

export function generateGuidePdfHtml(options: PdfGeneratorOptions): string {
  const {
    title,
    subtitle = '',
    category = 'RITUAL GUIDE',
    userName = 'Valued Practitioner',
    downloadDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    mode = 'full',
    sotCard,
    storyText,
    sankalpaText,
    sankalpaMeaning,
    sankalpaCards = [],
    vidhiDays = [],
    samagriItems = [],
    fastingOptions = [],
    mythsList = [],
  } = options;

  const logoSvg = `
    <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#DE1B59"/>
      <text x="50%" y="62%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="'Tiro Devanagari Hindi', Georgia, serif" font-size="54" font-weight="900">तप</text>
    </svg>
  `;

  return `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="utf-8" />
  <title>${title} — The Tapa Co. Guide</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi:ital@0;1&family=Noto+Serif+Devanagari:wght@400;600;700&display=swap');

    @media print {
      @page {
        margin: 15mm 12mm 15mm 12mm;
        size: A4;
      }
      body {
        margin: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .no-print {
        display: none !important;
      }
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Noto Serif Devanagari', 'Tiro Devanagari Hindi', Georgia, serif;
      color: #1F2937;
      background: #FFFFFF;
      line-height: 1.6;
      padding: 24px 32px;
      max-width: 800px;
      margin: 0 auto;
    }

    /* HEADER & BRANDING */
    .header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #DE1B59;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }

    .brand-block {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-title {
      font-family: 'Tiro Devanagari Hindi', Georgia, serif;
      font-size: 20px;
      font-weight: 700;
      color: #111827;
      line-height: 1.1;
    }

    .brand-sub {
      font-size: 10px;
      font-weight: 700;
      color: #DE1B59;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .meta-personalized {
      text-align: right;
      font-size: 11px;
      color: #6B7280;
      line-height: 1.4;
    }

    .meta-personalized b {
      color: #DE1B59;
    }

    /* TITLE SECTION */
    .hero-box {
      background: #FDF2F5;
      border: 1px solid #FBCFE8;
      border-radius: 12px;
      padding: 20px 24px;
      margin-bottom: 24px;
    }

    .category-badge {
      display: inline-block;
      background: #DE1B59;
      color: #FFFFFF;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 8px;
    }

    .doc-title {
      font-family: 'Noto Serif Devanagari', Georgia, serif;
      font-size: 26px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 6px 0;
      line-height: 1.25;
    }

    .doc-subtitle {
      font-size: 13px;
      color: #4B5563;
      margin: 0;
    }

    /* SECTIONS & CARDS */
    .sec-card {
      background: #FFFFFF;
      border: 1px solid #E5E7EB;
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 20px;
      page-break-inside: avoid;
    }

    .sec-heading {
      font-size: 15px;
      font-weight: 700;
      color: #111827;
      border-bottom: 1px solid #E5E7EB;
      padding-bottom: 8px;
      margin: 0 0 12px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .sec-heading span {
      color: #DE1B59;
    }

    .devanagari-text {
      font-family: 'Tiro Devanagari Hindi', 'Noto Serif Devanagari', serif;
      font-size: 16px;
      line-height: 1.7;
      color: #1F2937;
    }

    .sankalpa-box {
      background: #FFFBEB;
      border: 1px solid #FCD34D;
      border-radius: 8px;
      padding: 16px;
      margin: 12px 0;
    }

    /* TABLE FOR SAMAGRI */
    .samagri-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
    }

    .samagri-table th, .samagri-table td {
      text-align: left;
      padding: 9px 12px;
      border-bottom: 1px solid #E5E7EB;
    }

    .samagri-table th {
      background: #F9FAFB;
      font-size: 11px;
      text-transform: uppercase;
      color: #6B7280;
      letter-spacing: 0.5px;
    }

    .samagri-table td {
      font-size: 13px;
      color: #1F2937;
    }

    .check-box {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 1.5px solid #9CA3AF;
      border-radius: 3px;
      margin-right: 8px;
      vertical-align: middle;
    }

    .myth-item {
      background: #F9FAFB;
      border-left: 3px solid #DE1B59;
      padding: 10px 14px;
      margin-bottom: 10px;
      border-radius: 0 6px 6px 0;
    }

    .myth-q {
      font-weight: 700;
      font-size: 13px;
      color: #991B1B;
      margin-bottom: 4px;
    }

    .myth-a {
      font-size: 12.5px;
      color: #1F2937;
    }

    /* FOOTER */
    .doc-footer {
      margin-top: 36px;
      padding-top: 16px;
      border-top: 1px solid #E5E7EB;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      color: #9CA3AF;
    }

    .print-btn-bar {
      margin-bottom: 20px;
      text-align: right;
    }

    .print-btn {
      background: #DE1B59;
      color: #FFFFFF;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(222, 27, 89, 0.2);
    }
  </style>
</head>
<body>
  <div class="print-btn-bar no-print">
    <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>

  <!-- HEADER BRANDING -->
  <div class="header-bar">
    <div class="brand-block">
      ${logoSvg}
      <div>
        <div class="brand-title">The Tapa Co.</div>
        <div class="brand-sub">AUTHENTIC DHARMIC KNOWLEDGE</div>
      </div>
    </div>
    <div class="meta-personalized">
      <div>PREPARED FOR: <b>${userName}</b></div>
      <div>DATE: <b>${downloadDate}</b></div>
    </div>
  </div>

  <!-- HERO TITLE BOX -->
  <div class="hero-box">
    <span class="category-badge">${category}</span>
    <h1 class="doc-title">${title}</h1>
    ${subtitle ? `<p class="doc-subtitle">${subtitle}</p>` : ''}
  </div>

  ${
    sotCard?.claim
      ? `
  <div class="sec-card">
    <div class="sec-heading"><span>◆</span> Scriptural Source of Truth</div>
    <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${sotCard.claim}</div>
    ${sotCard.source ? `<div style="font-size: 12px; color: #6B7280;">Source: ${sotCard.source}</div>` : ''}
  </div>
  `
      : ''
  }

  ${
    mode === 'full' && storyText
      ? `
  <div class="sec-card">
    <div class="sec-heading"><span>📖</span> Story & Spiritual Context</div>
    <div class="devanagari-text">${storyText}</div>
  </div>
  `
      : ''
  }

  ${
    mode === 'full' && (sankalpaText || sankalpaMeaning)
      ? `
  <div class="sec-card">
    <div class="sec-heading"><span>✋</span> Sankalpa (Sacred Vow)</div>
    <div class="sankalpa-box">
      ${sankalpaText ? `<div class="devanagari-text" style="font-weight: 600; color: #92400E; margin-bottom: 6px;">${sankalpaText}</div>` : ''}
      ${sankalpaMeaning ? `<div style="font-size: 13px; color: #78350F;">${sankalpaMeaning}</div>` : ''}
    </div>
    ${
      sankalpaCards.length > 0
        ? `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px;">
        ${sankalpaCards
          .map(
            (c) => `
          <div style="background: #FAFAFA; border: 1px solid #E5E7EB; border-radius: 6px; padding: 8px 10px; font-size: 12px;">
            <b style="color: #DE1B59;">${c.k}:</b> ${c.v}
          </div>
        `
          )
          .join('')}
      </div>
    `
        : ''
    }
  </div>
  `
      : ''
  }

  ${
    mode === 'full' && vidhiDays.length > 0
      ? `
  <div class="sec-card">
    <div class="sec-heading"><span>🪔</span> Vidhi (Step-by-Step Procedure)</div>
    ${vidhiDays
      .map(
        (day) => `
      <div style="margin-bottom: 12px;">
        <div style="font-weight: 700; font-size: 13px; color: #111827; margin-bottom: 4px;">${day.dayTitle}</div>
        <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #374151;">
          ${day.steps.map((step) => `<li>${step}</li>`).join('')}
        </ul>
      </div>
    `
      )
      .join('')}
  </div>
  `
      : ''
  }

  ${
    samagriItems.length > 0
      ? `
  <div class="sec-card">
    <div class="sec-heading"><span>🧺</span> Samagri (Materials) Checklist</div>
    <table class="samagri-table">
      <thead>
        <tr>
          <th style="width: 30px;"></th>
          <th>Item Name</th>
          <th>Details / Quantity</th>
        </tr>
      </thead>
      <tbody>
        ${samagriItems
          .map(
            (item) => `
          <tr>
            <td><span class="check-box"></span></td>
            <td style="font-weight: 600;">${item.itemName}</td>
            <td style="color: #6B7280;">${item.itemDetails || '—'}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  </div>
  `
      : ''
  }

  ${
    mode === 'full' && fastingOptions.length > 0
      ? `
  <div class="sec-card">
    <div class="sec-heading"><span>🍎</span> Fasting Guidelines</div>
    ${fastingOptions
      .map(
        (opt) => `
      <div style="margin-bottom: 8px;">
        <b style="font-size: 13px; color: #111827;">${opt.title}:</b>
        <span style="font-size: 13px; color: #4B5563;">${opt.description}</span>
      </div>
    `
      )
      .join('')}
  </div>
  `
      : ''
  }

  ${
    mode === 'full' && mythsList.length > 0
      ? `
  <div class="sec-card">
    <div class="sec-heading"><span>✕</span> Common Myths & Scriptural Corrections</div>
    ${mythsList
      .map(
        (m) => `
      <div class="myth-item">
        <div class="myth-q">MYTH: ${m.myth}</div>
        <div class="myth-a"><b>CORRECTION:</b> ${m.correction}</div>
      </div>
    `
      )
      .join('')}
  </div>
  `
      : ''
  }

  <!-- FOOTER -->
  <div class="doc-footer">
    <div>The Tapa Co. • Authentic Scriptural Guides</div>
    <div>Page 1 of 1</div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>`;
}
