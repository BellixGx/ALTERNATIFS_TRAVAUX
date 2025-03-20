/* eslint-disable no-restricted-globals */
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

self.onmessage = function (event) {
    const { report, logoBase64 } = event.data;

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210;
    const pageHeight = 297;
    let yPosition = 20;
    const bottomMargin = 40;

    const logoSize = 80; // New resized logo dimensions

    const logoX = (pageWidth - logoSize) / 2; // Center horizontally
    const logoY = -15; // Top margin
    
    pdf.addImage(logoBase64, "PNG", logoX, logoY, logoSize, logoSize);
    yPosition = logoY + logoSize  ; // Space for next content
    

    // **Title**
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Salary Report", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    // **Date Range**
    pdf.setFontSize(12);
    const dateRangeText = `From: ${report.startDate} To: ${report.endDate}`;
    pdf.text(dateRangeText, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 15;

    // **Table Data**
    const tableData = report.data.map((record) => [
        record.name,
        record.job,
        record.prix.toFixed(2), 
        record.total_days_present,
        record.total_days_absent,
        record.total_salary.toFixed(2),
        record.total_advances.toFixed(2),
        record.final_salary.toFixed(2),
    ]);

    const tableColumns = [
        "Name", "Job", "Daily Salary", "Days Present", "Days Absent", "Total Salary", "Advances", "Final Salary"
    ];

    // **Total Salary Calculation**
    const totalFinalSalary = report.data.reduce((sum, record) => sum + record.final_salary, 0);
    tableData.push([
        "", "", "", "", "", "", 
        { content: "TOTAL", styles: { fontStyle: "bold", halign: "right", textColor: [0, 0, 0] } }, 
        { content: totalFinalSalary.toFixed(2), styles: { fontStyle: "bold", textColor: [0, 0, 0] } }
    ]);

    // **Generate Table with Proper Styling**
    autoTable(pdf, {
        startY: yPosition,
        head: [tableColumns],
        body: tableData,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [0, 102, 204] },
        margin: { top: 5, bottom: bottomMargin }, 
        tableWidth: "auto",
        pageBreak: "auto",
        didParseCell: function (data) {
            // **Remove Border for the "TOTAL" Row**
            if (data.row.index === tableData.length - 1) {
                data.cell.styles.lineWidth = 0;
            }
        }
    });

    // **Ensure Footer Stays on First Page**
    pdf.setPage(1);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");

    const addressText = `
    LOT BADES IMMEUBLE 6 BLOC 23 2EME ETAGE APP N°10 AL HOCEIMA
    COMPTE BANCAIRE : 007 050 000 426 400 000 021 015 ATTIJARWAFA BANK AGENCE DAR AL MOUKAWIL
    AL HOCEIMA PATENTE: 56502179 - RC: 3083 - IF: 45911826 - C.N.S.S:1907230 - I.C.E:002537075000084
    GSM: 0663208944 EMAIL: ALTERNATIFSTRAVAUX@GMAIL.COM
`;

const maxWidth = pageWidth - 26;
const wrappedText = pdf.splitTextToSize(addressText.trim(), maxWidth);

pdf.text(wrappedText, pageWidth / 2, pageHeight - 25, { align: "center" });

    // **Send PDF as Blob**
    const pdfBlob = pdf.output("blob");
    self.postMessage({ pdfBlob });
};

/* eslint-enable no-restricted-globals */
