export interface NewTenderAlertProps {
  tenderTitle: string;
  contractingAuthority: string;
  voivodeship: string;
  budgetMax: number | null;
  deadline: string | null;
  aiScore: number | null;
  tenderId: string;
  baseUrl: string;
}

function formatBudget(budget: number | null): string {
  if (budget === null) return "Nie podano";
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(budget);
}

function formatDeadline(deadline: string | null): string {
  if (!deadline) return "Nie podano";
  return new Date(deadline).toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatScore(score: number | null): string {
  if (score === null) return "—";
  return `${Math.round(score * 100)}%`;
}

function getScoreColor(score: number | null): string {
  if (score === null) return "#64748b";
  if (score >= 0.75) return "#22c55e";
  if (score >= 0.5) return "#f59e0b";
  return "#ef4444";
}

export function renderNewTenderAlert(props: NewTenderAlertProps): string {
  const {
    tenderTitle,
    contractingAuthority,
    voivodeship,
    budgetMax,
    deadline,
    aiScore,
    tenderId,
    baseUrl,
  } = props;

  const tenderUrl = `${baseUrl}/dashboard/przetargi/${tenderId}`;
  const manageUrl = `${baseUrl}/dashboard/ustawienia`;
  const scoreColor = getScoreColor(aiScore);

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nowy przetarg — Eagle Eye</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,sans-serif;color:#f1f5f9;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0f172a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <span style="font-size:24px;font-weight:800;color:#0EA5E9;letter-spacing:-0.5px;">Eagle</span>
              <span style="font-size:24px;font-weight:800;color:#f1f5f9;letter-spacing:-0.5px;"> Eye</span>
              <p style="margin:8px 0 0;font-size:13px;color:#94a3b8;letter-spacing:0.5px;text-transform:uppercase;">System monitorowania przetargów</p>
            </td>
          </tr>

          <!-- Headline -->
          <tr>
            <td style="padding-bottom:24px;text-align:center;">
              <h1 style="margin:0;font-size:20px;font-weight:600;color:#f1f5f9;line-height:1.4;">
                Nowy przetarg dopasowany do Twojego profilu
              </h1>
            </td>
          </tr>

          <!-- Tender Card -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background-color:#1e293b;border-radius:12px;border:1px solid #334155;overflow:hidden;">

                <!-- Card Top Bar -->
                <tr>
                  <td style="background-color:#0c1a2e;padding:12px 24px;border-bottom:1px solid #334155;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td>
                          <span style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Nowy przetarg</span>
                        </td>
                        <td align="right">
                          <!-- AI Score Badge -->
                          <span style="display:inline-block;background-color:${scoreColor}22;border:1px solid ${scoreColor}55;border-radius:20px;padding:3px 10px;font-size:12px;font-weight:600;color:${scoreColor};">
                            AI Score: ${formatScore(aiScore)}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Card Body -->
                <tr>
                  <td style="padding:24px;">

                    <!-- Title -->
                    <h2 style="margin:0 0 16px;font-size:18px;font-weight:700;color:#f1f5f9;line-height:1.4;">
                      ${tenderTitle}
                    </h2>

                    <!-- Meta Grid -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="50%" style="padding-bottom:12px;vertical-align:top;">
                          <p style="margin:0 0 2px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Zamawiający</p>
                          <p style="margin:0;font-size:14px;color:#cbd5e1;font-weight:500;">${contractingAuthority}</p>
                        </td>
                        <td width="50%" style="padding-bottom:12px;vertical-align:top;padding-left:16px;">
                          <p style="margin:0 0 2px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Województwo</p>
                          <p style="margin:0;font-size:14px;color:#cbd5e1;font-weight:500;">${voivodeship}</p>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%" style="vertical-align:top;">
                          <p style="margin:0 0 2px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Budżet (maks.)</p>
                          <p style="margin:0;font-size:14px;color:#0EA5E9;font-weight:600;">${formatBudget(budgetMax)}</p>
                        </td>
                        <td width="50%" style="vertical-align:top;padding-left:16px;">
                          <p style="margin:0 0 2px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Termin składania ofert</p>
                          <p style="margin:0;font-size:14px;color:#cbd5e1;font-weight:500;">${formatDeadline(deadline)}</p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>

                <!-- CTA -->
                <tr>
                  <td style="padding:0 24px 24px;">
                    <a href="${tenderUrl}"
                      style="display:inline-block;background-color:#0EA5E9;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:12px 28px;border-radius:8px;">
                      Zobacz szczegóły →
                    </a>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:32px;text-align:center;border-top:1px solid #1e293b;margin-top:32px;">
              <p style="margin:0 0 8px;font-size:13px;color:#475569;line-height:1.6;">
                Otrzymujesz ten email, ponieważ masz włączone powiadomienia w Eagle Eye.
              </p>
              <a href="${manageUrl}" style="font-size:13px;color:#0EA5E9;text-decoration:underline;">
                Zarządzaj powiadomieniami
              </a>
              <p style="margin:16px 0 0;font-size:11px;color:#334155;">
                © ${new Date().getFullYear()} Eagle Eye · eagle-eye.hatedapps.pl
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
