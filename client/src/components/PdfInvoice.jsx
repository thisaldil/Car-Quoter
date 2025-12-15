import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";



const PdfInvoice = ({ invoiceData = {}, templateData = {} }) => {
  const design = templateData.design || {};
  const accentColor = design.accentColor || "#1e40af";
  const letterheadUrl = design.letterheadUrl || null;
  const termsText = (invoiceData.termsText ?? design.termsText) || "";
  const bottomLayerUrl = design.bottomLayerUrl || null;

  const bookingRef =
    invoiceData.bookingReference || invoiceData.invoiceNo || "";
  const displayDate =
    invoiceData.date ||
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "numeric",
      year: "numeric",
    });

  

  const items = Array.isArray(invoiceData.items) ? invoiceData.items : [];
  const totalCIF = items.reduce((sum, r) => sum + toNum(r?.cif), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.pageContainer}>
          {/* Letterhead */}
          {letterheadUrl ? (
            <Image src={letterheadUrl} style={styles.letterhead} />
          ) : (
            <View style={styles.letterheadFallback} />
          )}

          {/* Main content */}
          <View style={styles.mainContent}>
            {/* Invoice Header */}
            <View style={styles.invoiceHeader}>
              <View style={styles.invoiceHeaderLeft}>
                <View style={styles.invoiceMetaRow}>
                  <Text style={styles.metaLabel}>Invoice ID:</Text>
                  <Text style={styles.metaValue}>{safe(invoiceData.invoiceId)}</Text>
                </View>
               
                <View style={styles.invoiceMetaRow}>
                  <Text style={styles.metaLabel}>Date:</Text>
                  <Text style={styles.metaValue}>{displayDate}</Text>
                </View>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Vehicle Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>VEHICLE INFORMATION</Text>
              <View style={styles.vehicleContent}>
                <View style={styles.vehicleDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Vehicle Name:</Text>
                    <Text style={styles.detailValue}>{safe(invoiceData.vehicleName) || "--"}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Grade:</Text>
                    <Text style={styles.detailValue}>{safe(invoiceData.vehicleGrade) || "--"}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Year:</Text>
                    <Text style={styles.detailValue}>{safe(invoiceData.year) || "--"}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Mileage:</Text>
                    <Text style={styles.detailValue}>{safe(invoiceData.mileage) || "--"}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Vehicle Type:</Text>
                    <Text style={styles.detailValue}>{safe(invoiceData.vehicleType) || "--"}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Fuel Type:</Text>
                    <Text style={styles.detailValue}>{safe(invoiceData.fuelType) || "--"}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Engine CC:</Text>
                    <Text style={styles.detailValue}>{safe(invoiceData.engineCC) || "--"}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Report Date:</Text>
                    <Text style={styles.detailValue}>{safe(invoiceData.reportDate) || "--"}</Text>
                  </View>
                  {invoiceData.details && (
                    <View style={styles.detailRowFull}>
                      <Text style={styles.detailLabel}>Details:</Text>
                      <Text style={styles.detailValue}>{safe(invoiceData.details)}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.vehicleImageContainer}>
                  {invoiceData?.vehicleImage ? (
                    <Image src={invoiceData.vehicleImage} style={styles.vehicleImage} />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Text style={styles.placeholderText}>No Image Available</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Custom Duty Breakdown */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>CUSTOM DUTY BREAKDOWN</Text>
              <View style={styles.tableContainer}>
                <View style={styles.tableRow}>
                  <View style={[styles.tableCell, styles.tableCellHeader]}>
                    <Text style={styles.tableCellText}>Description</Text>
                  </View>
                  <View style={[styles.tableCell, styles.tableCellHeader, styles.tableCellRight]}>
                    <Text style={styles.tableCellText}>Amount (LKR)</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellText}>CID (20%)</Text>
                  </View>
                  <View style={[styles.tableCell, styles.tableCellRight]}>
                    <Text style={styles.tableCellText}>{fmt(invoiceData.cid)}</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellText}>Surcharge (50% of CID)</Text>
                  </View>
                  <View style={[styles.tableCell, styles.tableCellRight]}>
                    <Text style={styles.tableCellText}>{fmt(invoiceData.surcharge)}</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellText}>XID (CC × 3450)</Text>
                  </View>
                  <View style={[styles.tableCell, styles.tableCellRight]}>
                    <Text style={styles.tableCellText}>{fmt(invoiceData.xid)}</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellText}>VEL (15,000 LKR)</Text>
                  </View>
                  <View style={[styles.tableCell, styles.tableCellRight]}>
                    <Text style={styles.tableCellText}>{fmt(invoiceData.luxuryTax)}</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellText}>VAT (18%)</Text>
                  </View>
                  <View style={[styles.tableCell, styles.tableCellRight]}>
                    <Text style={styles.tableCellText}>{fmt(invoiceData.vat)}</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellText}>COM/EXM/SEL (1,750 LKR)</Text>
                  </View>
                  <View style={[styles.tableCell, styles.tableCellRight]}>
                    <Text style={styles.tableCellText}>{fmt(invoiceData.vetAndCom)}</Text>
                  </View>
                </View>
                <View style={[styles.tableRow, styles.tableTotalRow]}>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableTotalText}>Total Duty</Text>
                  </View>
                  <View style={[styles.tableCell, styles.tableCellRight]}>
                    <Text style={styles.tableTotalText}>{fmt(invoiceData.totalDuty)}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Price Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PRICE SUMMARY</Text>
              <View style={styles.tableContainer}>
                <View style={styles.tableRow}>
                  <View style={[styles.tableCell, styles.tableCellHeader]}>
                    <Text style={styles.tableCellText}>Description</Text>
                  </View>
                  <View style={[styles.tableCell, styles.tableCellHeader, styles.tableCellRight]}>
                    <Text style={styles.tableCellText}>Amount</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellText}>Price ({invoiceData.currency || "JPY"})</Text>
                  </View>
                  <View style={[styles.tableCell, styles.tableCellRight]}>
                    <Text style={styles.tableCellText}>{fmt(invoiceData.priceValue || invoiceData.priceYen)}</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellText}>{invoiceData.currency || "JPY"} to LKR Rate</Text>
                  </View>
                  <View style={[styles.tableCell, styles.tableCellRight]}>
                    <Text style={styles.tableCellText}>{safe((invoiceData.currencyRate || invoiceData.yenRate)?.toFixed?.(2) || "2.00")}</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellText}>Price (LKR)</Text>
                  </View>
                  <View style={[styles.tableCell, styles.tableCellRight]}>
                    <Text style={styles.tableCellText}>{fmt(invoiceData.priceLkr)}</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellText}>Total Customs Duty</Text>
                  </View>
                  <View style={[styles.tableCell, styles.tableCellRight]}>
                    <Text style={styles.tableCellText}>{fmt(invoiceData.totalCustomsDuty)}</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableCellText}>Clearing Charges</Text>
                  </View>
                  <View style={[styles.tableCell, styles.tableCellRight]}>
                    <Text style={styles.tableCellText}>{fmt(invoiceData.clearingCharges)}</Text>
                  </View>
                </View>
                <View style={[styles.tableRow, styles.tableTotalRow]}>
                  <View style={styles.tableCell}>
                    <Text style={styles.tableTotalText}>Total Price</Text>
                  </View>
                  <View style={[styles.tableCell, styles.tableCellRight]}>
                    <Text style={styles.tableTotalText}>{fmt(invoiceData.totalPriceApprox)}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Spacer */}
          <View style={{ flex: 1 }} />

          {/* Terms & Conditions */}
          {!!termsText && (
            <View style={styles.termsSection}>
              <Text style={styles.termsTitle}>TERMS & CONDITIONS</Text>
              <Text style={styles.termsBody}>{termsText}</Text>
            </View>
          )}

          {/* Bottom signature */}
          {!!bottomLayerUrl && (
            <View style={styles.signatureRow}>
              <Image src={bottomLayerUrl} style={styles.signatureImg} />
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

/* ---------- helpers ---------- */
function toNum(x) {
  const n = typeof x === "string" ? Number(x.replace(/,/g, "")) : Number(x);
  return Number.isFinite(n) ? n : 0;
}
function fmt(n) {
  const v = toNum(n);
  if (!v) return n ? String(n) : "-";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v);
}
function safe(s) {
  return s == null ? "" : String(s);
}
function line(s) {
  return s ? `\n${s}` : "";
}
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  page: {
    paddingTop: 0,
    paddingHorizontal: 0,
    paddingBottom: 0,
    fontSize: 10,
    color: "#1f2937",
    backgroundColor: "#fff",
  },

  pageContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100%",
  },

  letterhead: {
    width: "100%",
    height: 80,
    objectFit: "contain",
  },
  letterheadFallback: {
    width: "100%",
    height: 80,
    backgroundColor: "#1e40af",
  },

  mainContent: {
    paddingHorizontal: 40,
    paddingVertical: 30,
    flexGrow: 1,
  },

  invoiceHeader: {
    marginBottom: 20,
  },
  invoiceHeaderLeft: {
    flexDirection: "column",
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  invoiceMetaRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  metaLabel: {
    fontSize: 10,
    color: "#6b7280",
    width: 80,
  },
  metaValue: {
    fontSize: 10,
    color: "#111827",
    fontWeight: "bold",
  },

  divider: {
    height: 2,
    backgroundColor: "#1e40af",
    marginBottom: 20,
  },

  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
    letterSpacing: 0.3,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 4,
  },

  vehicleContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  vehicleDetails: {
    flex: 1,
    paddingRight: 20,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  detailRowFull: {
    flexDirection: "column",
    marginTop: 4,
  },
  detailLabel: {
    fontSize: 9,
    color: "#6b7280",
    width: 100,
  },
  detailValue: {
    fontSize: 10,
    color: "#111827",
    flex: 1,
  },

  vehicleImageContainer: {
    width: 180,
  },
  vehicleImage: {
    width: 180,
    height: 120,
    objectFit: "cover",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  imagePlaceholder: {
    width: 180,
    height: 120,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 9,
    color: "#9ca3af",
  },

  tableContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
  },
  tableCellHeader: {
    backgroundColor: "#f3f4f6",
    fontWeight: "bold",
  },
  tableCell: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#d1d5db",
  },
  tableCellRight: {
    borderRightWidth: 0,
    alignItems: "flex-end",
  },
  tableCellText: {
    fontSize: 9,
    color: "#374151",
  },
  tableTotalRow: {
    backgroundColor: "#f9fafb",
    borderBottomWidth: 0,
  },
  tableTotalText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#111827",
  },

  termsSection: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: "#f9fafb",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    flexShrink: 0,
  },
  termsTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  termsBody: {
    fontSize: 9,
    color: "#4b5563",
    lineHeight: 1.5,
  },

  signatureRow: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    alignItems: "flex-end",
    flexShrink: 0,
  },
  signatureImg: {
    width: 140,
    height: 60,
    objectFit: "contain",
  },
});

export default PdfInvoice;