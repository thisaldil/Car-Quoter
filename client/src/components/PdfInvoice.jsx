import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const INVOICE_TYPE_LABELS = {
  type1: "PERFORMA INVOICE",
  type2: "COMMERCIAL INVOICE",
  type3: "INVOICE",
  type4: "CASH RECEIPT",
};

const PdfInvoice = ({ invoiceData = {}, templateData = {} }) => {
  const design = templateData.design || {};
  const accentColor = design.accentColor || "#3B82F6";
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

  // Get the correct invoice type label
  const invoiceTypeLabel =
    INVOICE_TYPE_LABELS[invoiceData?.invoiceType] ||
    invoiceData?.invoiceType ||
    "INVOICE";

  const items = Array.isArray(invoiceData.items) ? invoiceData.items : [];
  const totalCIF = items.reduce((sum, r) => sum + toNum(r?.cif), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Wrap everything in a flex container */}
        <View style={styles.pageContainer}>
          {/* Letterhead bar (full width) */}
          {letterheadUrl ? (
            <Image src={letterheadUrl} style={styles.letterhead} />
          ) : (
            <View style={styles.letterheadFallback} />
          )}

          {/* Main content section - grows to fill space */}
          <View style={styles.mainContent}>
           

            {/* Invoice ID Badge */}
            <View style={styles.badgeRow}>
              <Text style={styles.badgeText}>Invoice ID: {safe(invoiceData.invoiceId)}</Text>
            </View>

            {/* Vehicle Info & Image Side-by-Side */}
            <View style={styles.vehicleSection}>
              <View style={styles.colLeft}>
                <Text style={styles.sectionHeading}>Vehicle Information</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Name:</Text>
                  <Text style={styles.infoText}>{safe(invoiceData.vehicleName) || "--"}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Grade:</Text>
                  <Text style={styles.infoText}>{safe(invoiceData.vehicleGrade) || "--"}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Year:</Text>
                  <Text style={styles.infoText}>{safe(invoiceData.year) || "--"}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Mileage:</Text>
                  <Text style={styles.infoText}>{safe(invoiceData.mileage) || "--"}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Report Date:</Text>
                  <Text style={styles.infoText}>{safe(invoiceData.reportDate) || "--"}</Text>
                </View>
                {invoiceData.details && (
                  <View style={{ marginTop: 6 }}>
                    <Text style={styles.infoLabel}>Details:</Text>
                    <Text style={styles.infoText}>{safe(invoiceData.details)}</Text>
                  </View>
                )}
              </View>

              <View style={styles.colRight}>
                {(invoiceData.vehicleImage || invoiceData.vehicleImageUrl) ? (
                  <Image src={invoiceData.vehicleImage || invoiceData.vehicleImageUrl} style={styles.vehicleImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.placeholderText}>No Image</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Custom Duty Breakdown */}
            <View style={{ marginTop: 10 }}>
              <Text style={[styles.sectionHeading, { marginBottom: 6 }]}>Custom Duty Breakdown</Text>
              <View style={styles.gridRow}>
                <View style={styles.dutyBox}>
                  <Text style={styles.dutyLabel}>CID (30%)</Text>
                  <Text style={styles.dutyValue}>{fmt(invoiceData.cid)}</Text>
                </View>
                <View style={styles.dutyBox}>
                  <Text style={styles.dutyLabel}>Surcharge (10%)</Text>
                  <Text style={styles.dutyValue}>{fmt(invoiceData.surcharge)}</Text>
                </View>
                <View style={styles.dutyBox}>
                  <Text style={styles.dutyLabel}>XID (8%)</Text>
                  <Text style={styles.dutyValue}>{fmt(invoiceData.xid)}</Text>
                </View>
                <View style={styles.dutyBox}>
                  <Text style={styles.dutyLabel}>Luxury Tax (15%)</Text>
                  <Text style={styles.dutyValue}>{fmt(invoiceData.luxuryTax)}</Text>
                </View>
                <View style={styles.dutyBox}>
                  <Text style={styles.dutyLabel}>VAT (18%)</Text>
                  <Text style={styles.dutyValue}>{fmt(invoiceData.vat)}</Text>
                </View>
                <View style={styles.dutyBox}>
                  <Text style={styles.dutyLabel}>Vet & Com (2%)</Text>
                  <Text style={styles.dutyValue}>{fmt(invoiceData.vetAndCom)}</Text>
                </View>
                <View style={styles.totalDutyBox}>
                  <Text style={styles.dutyLabel}>Total Duty</Text>
                  <Text style={styles.totalDutyValue}>{fmt(invoiceData.totalDuty)}</Text>
                </View>
              </View>
            </View>

            {/* Price Section */}
            <View style={{ marginTop: 10 }}>
              <Text style={[styles.sectionHeading, { marginBottom: 6 }]}>Price Section</Text>
              <View style={styles.priceRow}>
                <View style={styles.priceBox}>
                  <Text style={styles.priceLabel}>Price (¥)</Text>
                  <Text style={styles.priceValue}>{fmt(invoiceData.priceYen)}</Text>
                </View>
                <View style={styles.priceBox}>
                  <Text style={styles.priceLabel}>Yen Rate</Text>
                  <Text style={styles.priceValue}>{safe(invoiceData.yenRate?.toFixed?.(2) || "2.00")}</Text>
                </View>
                <View style={styles.priceBox}>
                  <Text style={styles.priceLabel}>Price (LKR)</Text>
                  <Text style={styles.priceValue}>{fmt(invoiceData.priceLkr)}</Text>
                </View>
                <View style={styles.priceBox}>
                  <Text style={styles.priceLabel}>Total Customs Duty</Text>
                  <Text style={styles.priceValue}>{fmt(invoiceData.totalCustomsDuty)}</Text>
                </View>
                <View style={styles.priceBox}>
                  <Text style={styles.priceLabel}>Clearing Charges</Text>
                  <Text style={styles.priceValue}>{fmt(invoiceData.clearingCharges)}</Text>
                </View>
                <View style={styles.priceTotalBox}>
                  <Text style={styles.priceLabel}>Total Price</Text>
                  <Text style={styles.priceTotalValue}>{fmt(invoiceData.totalPriceApprox)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Spacer to push footer to bottom */}
          <View style={{ flex: 1 }} />

          {/* Terms & Conditions - Colored footer section */}
          {!!termsText && (
            <View
              style={[
                styles.termsSection,
                { backgroundColor: hexToRgba(accentColor, 0.08) },
              ]}
            >
              <Text style={[styles.termsTitle, { color: accentColor }]}>
                Terms & Conditions
              </Text>
              <Text style={styles.termsBody}>{termsText}</Text>
            </View>
          )}

          {/* Bottom signature image (align right) */}
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

/* ---------- styles (React-PDF / RN style) ---------- */
const styles = StyleSheet.create({
  page: {
    paddingTop: 0,
    paddingHorizontal: 0,
    paddingBottom: 0,
    fontSize: 10,
    color: "#111",
    backgroundColor: "#fff",
  },

  // NEW: Flex container for the entire page
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
    backgroundColor: "#f9fafb",
  },

  mainContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: "#f9fafb",
    flexGrow: 1, // Allow content to grow
  },

  titleRow: {
    alignItems: "center",
    marginBottom: 16,
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textDecoration: "underline",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  blockLeft: {
    width: "55%",
    flexDirection: "row",
  },
  blockRight: {
    width: "45%",
    alignItems: "flex-end",
  },
  blockLabel: {
    fontSize: 10,
    color: "#6b7280",
    marginRight: 8,
  },
  blockText: {
    fontSize: 10,
    lineHeight: 1.4,
    color: "#111827",
  },

  metaText: {
    fontSize: 10,
    color: "#374151",
    marginTop: 2,
  },
  metaStrong: {
    fontWeight: "bold",
    color: "#111827",
  },

  section: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "bold",
    marginRight: 4,
  },
  sectionText: {
    fontSize: 10,
  },

  table: {
    marginTop: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  tr: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
  },
  trHead: {
    backgroundColor: "#f3f4f6",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
  },
  th: {
    flex: 1,
    fontSize: 8,
    fontWeight: "bold",
    paddingVertical: 4,
    paddingHorizontal: 2,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#d1d5db",
  },
  td: {
    flex: 1,
    fontSize: 8,
    paddingVertical: 4,
    paddingHorizontal: 2,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#d1d5db",
  },
  noRightBorder: {
    borderRightWidth: 0,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: "bold",
    marginRight: 6,
  },
  totalValue: {
    fontSize: 11,
    fontWeight: "bold",
  },

  termsSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    flexShrink: 0, // Prevent shrinking
  },
  termsTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 6,
  },
  termsBody: {
    fontSize: 9,
    color: "#1f2937",
    lineHeight: 1.4,
  },

  signatureRow: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: "flex-end",
    backgroundColor: "#f9fafb",
    flexShrink: 0, // Prevent shrinking
  },
  signatureImg: {
    width: 120,
    height: 50,
    objectFit: "contain",
  },

  /* New layout styles */
  badgeRow: {
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 9,
    fontFamily: undefined,
    backgroundColor: "#eef2ff",
    color: "#1e3a8a",
    padding: 6,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  vehicleSection: {
    flexDirection: "row",
    marginTop: 6,
    marginBottom: 6,
  },
  colLeft: {
    width: "60%",
    paddingRight: 8,
  },
  colRight: {
    width: "40%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  infoLabel: {
    width: "30%",
    fontSize: 9,
    color: "#6b7280",
  },
  infoText: {
    width: "70%",
    fontSize: 10,
  },
  vehicleImage: {
    width: 160,
    height: 110,
    objectFit: "cover",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  imagePlaceholder: {
    width: 160,
    height: 110,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 9,
    color: "#6b7280",
  },
  gridRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 6,
  },
  dutyBox: {
    width: "45%",
    padding: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  dutyLabel: {
    fontSize: 9,
    color: "#6b7280",
  },
  dutyValue: {
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 4,
  },
  totalDutyBox: {
    width: "100%",
    padding: 8,
    borderWidth: 1,
    borderColor: "#f97316",
    backgroundColor: "#fff7ed",
  },
  totalDutyValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#c2410c",
    marginTop: 4,
  },
  priceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  priceBox: {
    width: "30%",
    padding: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  priceLabel: {
    fontSize: 9,
    color: "#6b7280",
  },
  priceValue: {
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 4,
  },
  priceTotalBox: {
    width: "100%",
    padding: 8,
    borderWidth: 1,
    borderColor: "#7c3aed",
    backgroundColor: "#faf5ff",
  },
  priceTotalValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#6d28d9",
    marginTop: 4,
  },
});

export default PdfInvoice;