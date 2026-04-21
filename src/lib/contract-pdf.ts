import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

// Fix PDFKit font path for Turbopack/Next.js environments
// PDFKit tries to open fonts via a hardcoded /ROOT path that doesn't exist.
// We pre-load the font buffers from our own pdf-fonts directory and pass them directly.
const PDFKIT_FONT_DIR = path.join(process.cwd(), "pdf-fonts");

function loadFontBuffer(name: string): Buffer | null {
  try {
    return fs.readFileSync(path.join(PDFKIT_FONT_DIR, name));
  } catch {
    return null;
  }
}

const HELVETICA_BUFFER = loadFontBuffer("Helvetica.afm");
const HELVETICA_BOLD_BUFFER = loadFontBuffer("Helvetica-Bold.afm");
const HELVETICA_OBLIQUE_BUFFER = loadFontBuffer("Helvetica-Oblique.afm");

type ContractPdfData = {
  referenceNumber: string;
  contractSignatureImage?: string | null;
  contractSignedAt?: Date | string | null;
  contractVehicleTitle: string | null;
  contractVehicleYearModel: string | null;
  contractVehicleMileage: string | null;
  contractVehicleTransmission: string | null;
  contractVehicleFuelType: string | null;
  contractDepositAmount: string | null;
  contractLicensingFee: string | null;
  contractMonthlyPayment: string | null;
  contractTotalPayableNow: string | null;
  contractTerm: string | null;
  contractClientFullName: string | null;
  contractClientEmail: string | null;
  contractClientPhone: string | null;
  contractClientIdentityType: string | null;
  contractClientIdentityNumber: string | null;
  contractClientAddress: string | null;
  contractTerms: string | null;
  contractIssuedAt: Date | string | null;
};

const NAVY = "#1b2345";
const GOLD = "#c9973a";
const LIGHT_BLUE = "#e8eef7";
const BORDER = "#c8d4e8";
const GRAY = "#68708a";
const DARK = "#39425d";

function fmtDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function fmtTerm(term: string | null | undefined) {
  if (!term) return "54 Months";
  const cleaned = term.trim().replace(/\s*months?\s*$/i, "");
  return `${cleaned} Months`;
}

export async function generateContractPdf(data: ContractPdfData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      if (!HELVETICA_BUFFER) {
        reject(new Error("PDF fonts not available. Run: cp node_modules/pdfkit/js/data/*.afm pdf-fonts/"));
        return;
      }
      const doc = new PDFDocument({
        size: "A4",
        margin: 40,
        bufferPages: true,
        font: HELVETICA_BUFFER as any,
      });
      // Register all font variants we use, from pre-loaded buffers
      try {
        if (HELVETICA_BOLD_BUFFER) doc.registerFont("Helvetica-Bold", HELVETICA_BOLD_BUFFER as any);
        if (HELVETICA_OBLIQUE_BUFFER) doc.registerFont("Helvetica-Oblique", HELVETICA_OBLIQUE_BUFFER as any);
        doc.registerFont("Helvetica", HELVETICA_BUFFER as any);
        doc.font("Helvetica");
      } catch (fontErr) {
        console.warn("Font registration warning:", fontErr);
      }

      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const pageWidth = doc.page.width - 80;
      const leftX = 40;

      // ── Logo ──────────────────────────────────────────────────────
      const logoPath = path.join(process.cwd(), "public", "autoaccess-logo.png");
      let logoAdded = false;
      try {
        if (fs.existsSync(logoPath)) {
          doc.image(logoPath, leftX, 40, { width: 54, height: 54 });
          logoAdded = true;
        }
      } catch {
        // ignore
      }

      // ── Header text ───────────────────────────────────────────────
      const headerTextX = logoAdded ? leftX + 70 : leftX;
      doc
        .fillColor(NAVY)
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("Access Holdings (Pty) Ltd T/A Auto Access", headerTextX, 42);
      doc
        .fillColor(GRAY)
        .fontSize(7.5)
        .font("Helvetica")
        .text("Reg No: 1999/002599/10", headerTextX, 57)
        .text("22 Eiland St, Eiland Park, Paarl, 7646, South Africa", headerTextX, 68)
        .text("Tel: 087 012 6734  |  021 211 0015  |  admin@autoaccess.co.za", headerTextX, 79);

      // ── Document title (right) ────────────────────────────────────
      doc
        .fillColor(NAVY)
        .fontSize(15)
        .font("Helvetica-Bold")
        .text("Vehicle Rental Agreement", 0, 44, { width: pageWidth + 40, align: "right" });
      doc
        .fillColor(GRAY)
        .fontSize(8.5)
        .font("Helvetica")
        .text("Rent-to-Own Contract", 0, 63, { width: pageWidth + 40, align: "right" });

      // Divider
      doc
        .moveTo(leftX, 102)
        .lineTo(leftX + pageWidth, 102)
        .lineWidth(2.5)
        .strokeColor(NAVY)
        .stroke();

      // ── Ref row ───────────────────────────────────────────────────
      let y = 112;
      doc.rect(leftX, y, pageWidth, 22).fillColor("#f5f7fb").fill();
      doc.rect(leftX, y, 3, 22).fillColor(GOLD).fill();
      doc
        .fillColor(GRAY)
        .fontSize(8)
        .font("Helvetica")
        .text(`Contract No: `, leftX + 10, y + 7, { continued: true })
        .fillColor(NAVY)
        .font("Helvetica-Bold")
        .text(data.referenceNumber);
      doc
        .fillColor(GRAY)
        .font("Helvetica")
        .text(`Date Issued: `, leftX + pageWidth / 3, y + 7, { continued: true })
        .fillColor(NAVY)
        .font("Helvetica-Bold")
        .text(fmtDate(data.contractIssuedAt));
      doc
        .fillColor(GRAY)
        .font("Helvetica")
        .text(`Contract Term: `, leftX + (pageWidth / 3) * 2, y + 7, { continued: true })
        .fillColor(NAVY)
        .font("Helvetica-Bold")
        .text(fmtTerm(data.contractTerm));

      y += 34;

      // ── Helper: section header ────────────────────────────────────
      const sectionHeader = (title: string) => {
        doc.rect(leftX, y, pageWidth, 18).fillColor(NAVY).fill();
        doc
          .fillColor("#ffffff")
          .fontSize(8.5)
          .font("Helvetica-Bold")
          .text(title.toUpperCase(), leftX + 10, y + 5, { characterSpacing: 1 });
        y += 18;
      };

      // ── Parties section ───────────────────────────────────────────
      sectionHeader("1. Parties to this Agreement");
      const partyHeight = 100;
      const partyWidth = pageWidth / 2;

      // Rentor (left, light blue background)
      doc.rect(leftX, y, partyWidth, partyHeight).fillColor(LIGHT_BLUE).fill();
      doc.rect(leftX, y, partyWidth, partyHeight).lineWidth(0.5).strokeColor(BORDER).stroke();
      doc.fillColor(NAVY).fontSize(7).font("Helvetica-Bold").text("THE RENTOR (OWNER)", leftX + 10, y + 8, { characterSpacing: 1 });
      doc.fillColor(NAVY).fontSize(9).font("Helvetica-Bold").text("Access Holdings (Pty) Ltd T/A Auto Access", leftX + 10, y + 22);
      doc.fillColor(DARK).fontSize(8).font("Helvetica")
        .text("Reg No: 1999/002599/10", leftX + 10, y + 36)
        .text("22 Eiland St, Eiland Park, Paarl, 7646", leftX + 10, y + 48)
        .text("Tel: 087 012 6734 | 021 211 0015", leftX + 10, y + 60)
        .text("admin@autoaccess.co.za", leftX + 10, y + 72);
      doc.fillColor(GRAY).fontSize(7).font("Helvetica-Oblique")
        .text('(Hereinafter "the Rentor / Owner")', leftX + 10, y + 86);

      // Rentee (right, white background)
      const rightX = leftX + partyWidth;
      doc.rect(rightX, y, partyWidth, partyHeight).fillColor("#ffffff").fill();
      doc.rect(rightX, y, partyWidth, partyHeight).lineWidth(0.5).strokeColor(BORDER).stroke();
      doc.fillColor(NAVY).fontSize(7).font("Helvetica-Bold").text("THE RENTEE (CLIENT)", rightX + 10, y + 8, { characterSpacing: 1 });
      doc.fillColor(NAVY).fontSize(9).font("Helvetica-Bold").text(data.contractClientFullName || "—", rightX + 10, y + 22);
      const idType = data.contractClientIdentityType || "ID Number";
      doc.fillColor(DARK).fontSize(8).font("Helvetica")
        .text(`${idType}: ${data.contractClientIdentityNumber || "—"}`, rightX + 10, y + 36)
        .text(`Email: ${data.contractClientEmail || "—"}`, rightX + 10, y + 48)
        .text(`Phone: ${data.contractClientPhone || "—"}`, rightX + 10, y + 60)
        .text(`Address: ${data.contractClientAddress || "—"}`, rightX + 10, y + 72, {
          width: partyWidth - 20,
          ellipsis: true,
        });
      doc.fillColor(GRAY).fontSize(7).font("Helvetica-Oblique")
        .text('(Hereinafter "the Rentee / Client")', rightX + 10, y + 86);

      y += partyHeight + 10;

      // ── Vehicle section ───────────────────────────────────────────
      sectionHeader("2. Vehicle Information");
      const vehicleHeight = 80;
      doc.rect(leftX, y, pageWidth, vehicleHeight).fillColor("#ffffff").fill();
      doc.rect(leftX, y, pageWidth, vehicleHeight).lineWidth(0.5).strokeColor(BORDER).stroke();
      const gridX = leftX;
      const cellW = pageWidth / 3;
      const cellH = vehicleHeight / 2;
      const cells: [string, string][] = [
        ["Vehicle", data.contractVehicleTitle || "—"],
        ["Year Model", data.contractVehicleYearModel || "—"],
        ["Mileage", data.contractVehicleMileage || "—"],
        ["Transmission", data.contractVehicleTransmission || "—"],
        ["Fuel Type", data.contractVehicleFuelType || "—"],
        ["Contract Term", fmtTerm(data.contractTerm)],
      ];
      cells.forEach(([label, value], idx) => {
        const col = idx % 3;
        const row = Math.floor(idx / 3);
        const cx = gridX + col * cellW;
        const cy = y + row * cellH;
        // Cell border
        doc.rect(cx, cy, cellW, cellH).lineWidth(0.3).strokeColor("#e8eef7").stroke();
        doc.fillColor(GRAY).fontSize(7).font("Helvetica").text(label.toUpperCase(), cx + 8, cy + 8, { characterSpacing: 0.5 });
        doc.fillColor(NAVY).fontSize(9).font("Helvetica-Bold").text(value, cx + 8, cy + 20, {
          width: cellW - 16,
          ellipsis: true,
        });
      });
      y += vehicleHeight + 10;

      // ── Financial summary ─────────────────────────────────────────
      sectionHeader("3. Rental Fees & Financial Summary");
      const finHeight = 48;
      doc.rect(leftX, y, pageWidth, finHeight).fillColor(NAVY).fill();
      const finCells: [string, string][] = [
        ["Monthly Instalment", data.contractMonthlyPayment || "—"],
        ["Deposit", data.contractDepositAmount || "—"],
        ["Licensing & Reg Fee", data.contractLicensingFee || "—"],
        ["Total Required Now", data.contractTotalPayableNow || "—"],
      ];
      const fcellW = pageWidth / 4;
      finCells.forEach(([label, value], idx) => {
        const fx = leftX + idx * fcellW;
        if (idx > 0) {
          doc.moveTo(fx, y + 6).lineTo(fx, y + finHeight - 6).strokeColor("#2c4270").lineWidth(0.5).stroke();
        }
        doc.fillColor("#c8d4e8").fontSize(7).font("Helvetica").text(label.toUpperCase(), fx, y + 10, {
          width: fcellW,
          align: "center",
          characterSpacing: 0.5,
        });
        doc.fillColor(GOLD).fontSize(12).font("Helvetica-Bold").text(value, fx, y + 24, {
          width: fcellW,
          align: "center",
        });
      });
      y += finHeight + 6;

      doc.fillColor(GRAY).fontSize(7.5).font("Helvetica-Oblique").text(
        "Note: Monthly instalment includes service plan. All amounts inclusive of VAT where applicable. The total monthly rental escalates by 4% annually on the anniversary of the delivery date.",
        leftX,
        y,
        { width: pageWidth }
      );
      y += 22;

      // ── Terms and Conditions ──────────────────────────────────────
      const termsText = data.contractTerms || "";
      sectionHeader("4. Terms and Conditions");

      // Add the terms text spanning multiple pages naturally
      doc.fillColor(DARK).fontSize(8).font("Helvetica");
      const termsStartY = y;
      // Create a text area that flows across pages
      doc.text(termsText, leftX + 8, termsStartY, {
        width: pageWidth - 16,
        align: "left",
        lineGap: 2,
      });

      y = doc.y + 16;

      // Ensure signature block fits; else new page
      if (y > doc.page.height - 120) {
        doc.addPage();
        y = 50;
      }

      // ── Signature block ───────────────────────────────────────────
      const sigW = (pageWidth - 40) / 2;
      const sigY = y + 40;
      // Draw company stamp above the Rentor signature line
      try {
        const stampPath = path.join(process.cwd(), "public", "company-stamp.png");
        if (fs.existsSync(stampPath)) {
          doc.save();
          const stampW = 130;
          const stampX = leftX + sigW - stampW + 10;
          const stampY = sigY - 70;
          // Slight rotation for realism
          doc.rotate(-5, { origin: [stampX + stampW / 2, stampY + 50] });
          doc.opacity(0.88);
          doc.image(stampPath, stampX, stampY, { width: stampW });
          doc.opacity(1);
          doc.restore();
        }
      } catch (stampErr) {
        console.warn("Could not draw stamp:", stampErr);
      }

      doc.moveTo(leftX, sigY).lineTo(leftX + sigW, sigY).lineWidth(1.2).strokeColor(NAVY).stroke();
      doc.fillColor(GRAY).fontSize(7).font("Helvetica-Bold").text("RENTOR — AUTHORISED SIGNATORY", leftX, sigY + 6, { characterSpacing: 1 });
      doc.fillColor("#a3aac0").fontSize(8).font("Helvetica").text("Access Holdings (Pty) Ltd T/A Auto Access", leftX, sigY + 18);

      doc.moveTo(leftX + sigW + 40, sigY).lineTo(leftX + sigW * 2 + 40, sigY).lineWidth(1.2).strokeColor(NAVY).stroke();
      doc.fillColor(GRAY).fontSize(7).font("Helvetica-Bold").text("RENTEE — CLIENT SIGNATURE", leftX + sigW + 40, sigY + 6, { characterSpacing: 1 });
      doc.fillColor("#a3aac0").fontSize(8).font("Helvetica").text(data.contractClientFullName || "Client", leftX + sigW + 40, sigY + 18);

      // Draw client signature image above the Rentee signature line if exists
      if (data.contractSignatureImage && data.contractSignatureImage.startsWith("data:image/png;base64,")) {
        try {
          const sigBase64 = data.contractSignatureImage.replace(/^data:image\/png;base64,/, "");
          const sigBuf = Buffer.from(sigBase64, "base64");
          doc.image(sigBuf, leftX + sigW + 40, sigY - 55, { width: 160, height: 50 });
          // Signed date under the line
          if (data.contractSignedAt) {
            const signedDate = new Date(data.contractSignedAt).toLocaleDateString("en-ZA", {
              year: "numeric", month: "long", day: "numeric"
            });
            doc.fillColor(GRAY).fontSize(7).font("Helvetica-Oblique")
              .text(`Signed electronically on ${signedDate}`, leftX + sigW + 40, sigY + 30);
          }
        } catch (e) {
          console.warn("Could not draw signature:", e);
        }
      }

      // ── Footer on every page ──────────────────────────────────────
      const range = doc.bufferedPageRange();
      for (let i = 0; i < range.count; i++) {
        doc.switchToPage(i);
        const footerY = doc.page.height - 30;
        doc.moveTo(leftX, footerY).lineTo(leftX + pageWidth, footerY).lineWidth(1).strokeColor(GOLD).stroke();
        doc.fillColor("#a3aac0").fontSize(7).font("Helvetica").text(
          `Access Holdings (Pty) Ltd T/A Auto Access  |  Reg No: 1999/002599/10  |  admin@autoaccess.co.za  |  Ref: ${data.referenceNumber}  |  Page ${i + 1} of ${range.count}`,
          leftX,
          footerY + 6,
          { width: pageWidth, align: "center" }
        );
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
