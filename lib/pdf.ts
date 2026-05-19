import { sampleUser } from "./data";
import type { Invoice, InvoiceLineItem } from "./store-context";

const fmtINR = (n: number) =>
  `Rs. ${n.toLocaleString("en-IN", { minimumFractionDigits: 0 })}`;

const fmtDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const INDIGO: [number, number, number] = [99, 102, 241];
const DARK: [number, number, number]   = [15, 23, 42];
const GRAY: [number, number, number]   = [100, 116, 139];
const SNOW: [number, number, number]   = [248, 250, 252];

export async function downloadInvoicePDF(invoice: Invoice) {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();

  /* ── Header strip ── */
  doc.setFillColor(...INDIGO);
  doc.rect(0, 0, W, 30, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(sampleUser.businessName, 15, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(210, 215, 255);
  doc.text(sampleUser.address, 15, 19);
  doc.text(`GSTIN: ${sampleUser.gst}  |  Ph: ${sampleUser.phone}`, 15, 25);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("INVOICE", W - 15, 15, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(210, 215, 255);
  doc.text(invoice.id, W - 15, 23, { align: "right" });

  /* ── Bill-to & Invoice meta ── */
  let y = 42;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...GRAY);
  doc.text("BILL TO", 15, y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...DARK);
  doc.text(invoice.customer, 15, y + 7);

  const statusLabel = invoice.status.toUpperCase();
  const statusColor: [number, number, number] =
    invoice.status === "paid"    ? [16, 185, 129] :
    invoice.status === "overdue" ? [239, 68, 68]  :
                                   [245, 158, 11];

  const meta = [
    ["Date:", fmtDate(invoice.date)],
    ["Status:", statusLabel],
  ];

  let ry = y;
  for (const [label, val] of meta) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...GRAY);
    doc.text(label, W - 70, ry);

    if (label === "Status:") {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...statusColor);
    } else {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...DARK);
    }
    doc.text(val, W - 15, ry, { align: "right" });
    ry += 8;
  }

  y += 22;

  /* ── Divider ── */
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(15, y, W - 15, y);
  y += 8;

  /* ── Items table ── */
  const hasLineItems = !!invoice.lineItems?.length;
  let subtotal = 0;
  let tableBody: (string | number)[][];

  if (hasLineItems) {
    tableBody = invoice.lineItems!.map((item: InvoiceLineItem, i: number) => {
      const amt = item.qty * item.price;
      subtotal += amt;
      return [i + 1, item.name, item.qty, fmtINR(item.price), fmtINR(amt)];
    });
  } else {
    subtotal = invoice.amount / 1.18;
    tableBody = invoice.items.map((desc: string, i: number) => [i + 1, desc, "—", "—", "—"]);
  }

  autoTable(doc, {
    startY: y,
    head: [["#", "Description", "Qty", "Unit Rate", "Amount"]],
    body: tableBody,
    styles: { fontSize: 9, cellPadding: { top: 4, bottom: 4, left: 4, right: 4 } },
    headStyles: { fillColor: INDIGO, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
    alternateRowStyles: { fillColor: SNOW },
    columnStyles: {
      0: { halign: "center", cellWidth: 12 },
      1: { halign: "left" },
      2: { halign: "center", cellWidth: 18 },
      3: { halign: "right", cellWidth: 36 },
      4: { halign: "right", cellWidth: 36 },
    },
    margin: { left: 15, right: 15 },
  });

  /* ── Totals ── */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tableEndY: number = (doc as any).lastAutoTable.finalY + 10;
  const gst   = invoice.amount - subtotal;
  const total = invoice.amount;
  const boxX  = W - 90;
  const boxW  = 75;
  const boxH  = hasLineItems ? 34 : 18;

  doc.setFillColor(...SNOW);
  doc.roundedRect(boxX, tableEndY, boxW, boxH, 2, 2, "F");

  let ty = tableEndY + 9;

  const totalRow = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 10 : 9);
    doc.setTextColor(...(bold ? DARK : GRAY));
    doc.text(label, boxX + boxW - 42, ty);
    doc.text(value, boxX + boxW - 3, ty, { align: "right" });
    ty += 8;
  };

  if (hasLineItems) {
    totalRow("Subtotal:", fmtINR(subtotal));
    totalRow("GST (18%):", fmtINR(gst));
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(boxX + 3, ty - 3, boxX + boxW - 3, ty - 3);
  }
  totalRow("TOTAL:", fmtINR(total), true);

  /* ── Footer ── */
  const H = doc.internal.pageSize.getHeight();
  doc.setFillColor(...INDIGO);
  doc.rect(0, H - 22, W, 22, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("Thank you for your business!", W / 2, H - 13, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(210, 215, 255);
  doc.text(
    `${sampleUser.businessName}  |  ${sampleUser.email}  |  +91 ${sampleUser.phone}`,
    W / 2,
    H - 7,
    { align: "center" }
  );

  doc.save(`${invoice.id}.pdf`);
}
