import React, { useEffect, useMemo, useState } from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

// Helper functions
const safe = (val) => (val === null || val === undefined ? "" : String(val));
const toNum = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
};
const fmt = (val) => {
  const n = toNum(val);
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const clamp01 = (n) => Math.max(0, Math.min(1, n));
const hexToRgb = (hex) => {
  if (!hex) return null;
  const raw = String(hex).trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(raw)) return null;
  const full = raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return { r, g, b };
};
const withAlpha = (hex, alpha) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return undefined;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clamp01(alpha)})`;
};

const makeStyles = ({ accentColor = "#3B82F6" } = {}) => {
  const accentSoft = withAlpha(accentColor, 0.14) || "#dbeafe";
  const accentSofter = withAlpha(accentColor, 0.08) || "#eef2ff";
  const accentBorderSoft = withAlpha(accentColor, 0.35) || "#93c5fd";

  return StyleSheet.create({
    page: {
      backgroundColor: "#ffffff",
    },
    pageContainer: {
      flex: 1,
      padding: 20,
      paddingTop: 15,
      paddingBottom: 15,
    },

    // ===== LETTER HEAD =====
    letterhead: {
      width: "100%",
      height: "auto",
      marginBottom: 12,
    },
    letterheadFallback: {
      height: 50,
      marginBottom: 12,
    },

    // ===== INVOICE ID & DATE =====
    invoiceHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    invoiceId: {
      flexDirection: "column",
    },
    dateSection: {
      flexDirection: "column",
      alignItems: "flex-end",
    },
    label: {
      fontSize: 8,
      color: "#6b7280",
      marginBottom: 2,
    },
    value: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#111827",
    },

    // ===== DIVIDER =====
    divider: {
      width: "100%",
      height: 2,
      backgroundColor: accentColor,
      marginBottom: 12,
    },

    // ===== VEHICLE SECTION (IMAGE + INFO + DETAIL) =====
    vehicleSection: {
      marginBottom: 12,
    },
    splitRow: {
      flexDirection: "row",
      gap: 12,
    },
    imageColumn: {
      width: "35%",
    },
    infoColumn: {
      width: "65%",
    },

    // Vehicle Image
    vehicleImage: {
      width: "100%",
      height: 120,
      objectFit: "cover",
      borderRadius: 4,
      border: "1px solid #e5e7eb",
    },
    imagePlaceholder: {
      width: "100%",
      height: 120,
      backgroundColor: "#f3f4f6",
      borderRadius: 4,
      border: "1px solid #e5e7eb",
      justifyContent: "center",
      alignItems: "center",
    },
    placeholderText: {
      fontSize: 9,
      color: "#9ca3af",
    },

    // Info Block
    infoBlock: {
      marginBottom: 10,
    },
    blockTitle: {
      fontSize: 9,
      fontWeight: "bold",
      color: accentColor,
      marginBottom: 6,
      textTransform: "uppercase",
    },
    infoGrid: {
      gap: 2,
    },
    infoRow: {
      flexDirection: "row",
      marginBottom: 2,
    },
    infoLabel: {
      fontSize: 8,
      color: "#4b5563",
      width: 50,
      marginRight: 4,
      fontWeight: 500,
    },
    infoValue: {
      fontSize: 8,
      color: "#111827",
      flex: 1,
    },

    // Detail Block
    detailBlock: {
      marginTop: 10,
      backgroundColor: "#ffffff",
      padding: 8,
      borderRadius: 4,
      border: "1px solid #d1d5db",
    },
    detailText: {
      fontSize: 8,
      color: "#374151",
      lineHeight: 1.4,
    },

    // ===== SECTIONS =====
    section: {
      marginBottom: 12,
    },
    sectionRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 12,
    },
    sectionHalf: {
      flex: 1,
    },
    sectionTitle: {
      fontSize: 9,
      fontWeight: "bold",
      color: accentColor,
      marginBottom: 6,
      textTransform: "uppercase",
    },

    // ===== TABLE =====
    table: {
      border: "1px solid #d1d5db",
      borderRadius: 4,
      overflow: "hidden",
      width: "100%",
    },
    tableRow: {
      flexDirection: "row",
      borderBottom: "1px solid #e5e7eb",
    },
    tableHeader: {
      backgroundColor: "#f3f4f6",
    },
    tableColDesc: {
      flex: 1.6,
      padding: 4,
      paddingLeft: 6,
    },
    tableColAmount: {
      flex: 1,
      padding: 4,
      paddingRight: 6,
      justifyContent: "center",
    },
    tableHeaderText: {
      fontSize: 8,
      fontWeight: "bold",
      color: "#374151",
    },
    tableCellText: {
      fontSize: 8,
      color: "#1f2937",
    },
    tableTotalRow: {
      backgroundColor: accentSoft,
      borderBottom: "none",
    },
    tableTotalText: {
      fontSize: 9,
      fontWeight: "bold",
      color: accentColor,
    },

    // ===== UTILITY =====
    textRight: {
      textAlign: "right",
    },
    spacer: {
      flex: 1,
    },

    // ===== FOOTER =====
    footerSection: {
      marginTop: 10,
    },
    footerImage: {
      width: "100%",
      height: "auto",
    },

    // ===== TERMS (fallback if no footer) =====
    termsSection: {
      marginTop: 10,
      padding: 8,
      backgroundColor: accentSofter,
      borderRadius: 4,
      border: `1px solid ${accentBorderSoft}`,
    },
    termsTitle: {
      fontSize: 9,
      fontWeight: "bold",
      color: accentColor,
      marginBottom: 5,
    },
    termsText: {
      fontSize: 7,
      color: "#111827",
      lineHeight: 1.4,
    },
  });
};

const PdfInvoice = ({ invoiceData = {}, templateData = {} }) => {
  const design = templateData.design || {};
  const accentColor = design.accentColor || "#3B82F6";
  const styles = useMemo(() => makeStyles({ accentColor }), [accentColor]);
  const letterheadUrl = design.letterheadUrl || null;
  const termsText = (invoiceData.termsText ?? design.termsText) || "";
  const bottomLayerUrl = design.bottomLayerUrl || null;

  const invoiceIdDisplay = invoiceData?.invoiceId || invoiceData?.invoiceNo || "";
  const fuelTypeDisplay = invoiceData?.fuelType || "";
  const engineCCDisplay = invoiceData?.engineCC || invoiceData?.engineCapacity || "";

  const [vehicleImageSrc, setVehicleImageSrc] = useState("");

  const resolvedVehicleImageSrc = useMemo(() => {
    if (invoiceData?.vehicleImageUrl) return invoiceData.vehicleImageUrl;
    if (typeof invoiceData?.vehicleImage === "string") return invoiceData.vehicleImage;
    return vehicleImageSrc;
  }, [invoiceData?.vehicleImageUrl, invoiceData?.vehicleImage, vehicleImageSrc]);

  useEffect(() => {
    // If a File/Blob is provided (common from <input type="file">), convert to a data URL
    if (invoiceData?.vehicleImageUrl) return;
    const maybeFile = invoiceData?.vehicleImage;
    const isBlobLike =
      typeof maybeFile === "object" &&
      maybeFile !== null &&
      (typeof maybeFile.arrayBuffer === "function" ||
        typeof maybeFile.stream === "function" ||
        typeof maybeFile.size === "number");

    if (!isBlobLike) return;

    let cancelled = false;
    const reader = new FileReader();
    reader.onload = () => {
      if (!cancelled) setVehicleImageSrc(String(reader.result || ""));
    };
    reader.onerror = () => {
      if (!cancelled) setVehicleImageSrc("");
    };
    reader.readAsDataURL(maybeFile);

    return () => {
      cancelled = true;
    };
  }, [invoiceData?.vehicleImage, invoiceData?.vehicleImageUrl]);

  const displayDate =
    invoiceData.date ||
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "numeric",
      year: "numeric",
    });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.pageContainer}>
          
          {/* ========== LETTER HEAD ========== */}
          {letterheadUrl ? (
            <Image src={letterheadUrl} style={styles.letterhead} />
          ) : (
            <View style={styles.letterheadFallback} />
          )}

          {/* ========== INVOICE ID & DATE ========== */}
          <View style={styles.invoiceHeader}>
            <View style={styles.invoiceId}>
              <Text style={styles.label}>Invoice ID</Text>
              <Text style={styles.value}>{safe(invoiceIdDisplay) || "--"}</Text>
            </View>
            <View style={styles.dateSection}>
              <Text style={[styles.label, styles.textRight]}>Date</Text>
              <Text style={[styles.value, styles.textRight]}>{displayDate}</Text>
            </View>
          </View>

          {/* ========== DIVIDER ========== */}
          <View style={styles.divider} />

          {/* ========== VEHICLE IMAGE & VEHICLE INFORMATIONS AND DETAIL ========== */}
          <View style={styles.vehicleSection}>
            <View style={styles.splitRow}>
              {/* Left: Vehicle Image */}
              <View style={styles.imageColumn}>
                {resolvedVehicleImageSrc ? (
                  <Image 
                    src={resolvedVehicleImageSrc} 
                    style={styles.vehicleImage}
                    cache={false}
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.placeholderText}>Vehicle Image</Text>
                  </View>
                )}
              </View>

              {/* Right: Vehicle Informations and Detail */}
              <View style={styles.infoColumn}>
                {/* Vehicle Information */}
                <View style={styles.infoBlock}>
                  <Text style={styles.blockTitle}>VEHICLE INFORMATION</Text>
                  <View style={styles.infoGrid}>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Vehicle Name:</Text>
                      <Text style={styles.infoValue}>{safe(invoiceData.vehicleName) || "--"}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Grade:</Text>
                      <Text style={styles.infoValue}>{safe(invoiceData.vehicleGrade) || "--"}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Year:</Text>
                      <Text style={styles.infoValue}>{safe(invoiceData.year) || "--"}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Mileage:</Text>
                      <Text style={styles.infoValue}>{safe(invoiceData.mileage) || "--"}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Vehicle Type:</Text>
                      <Text style={styles.infoValue}>{safe(invoiceData.vehicleType) || "--"}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Fuel Type:</Text>
                      <Text style={styles.infoValue}>{safe(fuelTypeDisplay) || "--"}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Engine CC:</Text>
                      <Text style={styles.infoValue}>{safe(engineCCDisplay) || "--"}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Report Date:</Text>
                      <Text style={styles.infoValue}>{safe(invoiceData.reportDate) || "--"}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Details Section (Full Width) */}
            <View style={styles.detailBlock}>
              <Text style={styles.blockTitle}>DETAILS</Text>
              <Text style={styles.detailText}>
                {safe(invoiceData.details) || "No details provided."}
              </Text>
            </View>
          </View>

          {/* ========== DUTY + PRICE SUMMARY SIDE BY SIDE ========== */}
          <View style={styles.sectionRow}>
            <View style={styles.sectionHalf}>
              <Text style={styles.sectionTitle}>CUSTOM DUTY BREAKDOWN</Text>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <View style={styles.tableColDesc}>
                    <Text style={styles.tableHeaderText}>Description</Text>
                  </View>
                  <View style={styles.tableColAmount}>
                    <Text style={[styles.tableHeaderText, styles.textRight]}>Amount (LKR)</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColDesc}>
                    <Text style={styles.tableCellText}>CID (20%)</Text>
                  </View>
                  <View style={styles.tableColAmount}>
                    <Text style={[styles.tableCellText, styles.textRight]}>{fmt(invoiceData.cid)}</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColDesc}>
                    <Text style={styles.tableCellText}>Surcharge (50% of CID)</Text>
                  </View>
                  <View style={styles.tableColAmount}>
                    <Text style={[styles.tableCellText, styles.textRight]}>{fmt(invoiceData.surcharge)}</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColDesc}>
                    <Text style={styles.tableCellText}>XID (CC × 3450)</Text>
                  </View>
                  <View style={styles.tableColAmount}>
                    <Text style={[styles.tableCellText, styles.textRight]}>{fmt(invoiceData.xid)}</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColDesc}>
                    <Text style={styles.tableCellText}>VEL (15,000 LKR)</Text>
                  </View>
                  <View style={styles.tableColAmount}>
                    <Text style={[styles.tableCellText, styles.textRight]}>{fmt(invoiceData.luxuryTax)}</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColDesc}>
                    <Text style={styles.tableCellText}>VAT (18%)</Text>
                  </View>
                  <View style={styles.tableColAmount}>
                    <Text style={[styles.tableCellText, styles.textRight]}>{fmt(invoiceData.vat)}</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColDesc}>
                    <Text style={styles.tableCellText}>COM/EXM/SEL (1,750 LKR)</Text>
                  </View>
                  <View style={styles.tableColAmount}>
                    <Text style={[styles.tableCellText, styles.textRight]}>{fmt(invoiceData.vetAndCom)}</Text>
                  </View>
                </View>
                <View style={[styles.tableRow, styles.tableTotalRow]}>
                  <View style={styles.tableColDesc}>
                    <Text style={styles.tableTotalText}>Total Duty</Text>
                  </View>
                  <View style={styles.tableColAmount}>
                    <Text style={[styles.tableTotalText, styles.textRight]}>{fmt(invoiceData.totalDuty)}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.sectionHalf}>
              <Text style={styles.sectionTitle}>PRICE SUMMARY</Text>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <View style={styles.tableColDesc}>
                    <Text style={styles.tableHeaderText}>Description</Text>
                  </View>
                  <View style={styles.tableColAmount}>
                    <Text style={[styles.tableHeaderText, styles.textRight]}>Amount</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColDesc}>
                    <Text style={styles.tableCellText}>Currency</Text>
                  </View>
                  <View style={styles.tableColAmount}>
                    <Text style={[styles.tableCellText, styles.textRight]}>{safe(invoiceData.currency || "JPY")}</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColDesc}>
                    <Text style={styles.tableCellText}>Price ({invoiceData.currency || "JPY"})</Text>
                  </View>
                  <View style={styles.tableColAmount}>
                    <Text style={[styles.tableCellText, styles.textRight]}>{fmt(invoiceData.priceValue || invoiceData.priceYen)}</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColDesc}>
                    <Text style={styles.tableCellText}>{invoiceData.currency || "JPY"} to LKR Rate</Text>
                  </View>
                  <View style={styles.tableColAmount}>
                    <Text style={[styles.tableCellText, styles.textRight]}>{safe((invoiceData.currencyRate || invoiceData.yenRate)?.toFixed?.(2) || "2.00")}</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColDesc}>
                    <Text style={styles.tableCellText}>Price (LKR)</Text>
                  </View>
                  <View style={styles.tableColAmount}>
                    <Text style={[styles.tableCellText, styles.textRight]}>{fmt(invoiceData.priceLkr)}</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColDesc}>
                    <Text style={styles.tableCellText}>Total Customs Duty</Text>
                  </View>
                  <View style={styles.tableColAmount}>
                    <Text style={[styles.tableCellText, styles.textRight]}>{fmt(invoiceData.totalCustomsDuty)}</Text>
                  </View>
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableColDesc}>
                    <Text style={styles.tableCellText}>Clearing Charges</Text>
                  </View>
                  <View style={styles.tableColAmount}>
                    <Text style={[styles.tableCellText, styles.textRight]}>{fmt(invoiceData.clearingCharges)}</Text>
                  </View>
                </View>
                <View style={[styles.tableRow, styles.tableTotalRow]}>
                  <View style={styles.tableColDesc}>
                    <Text style={styles.tableTotalText}>Total Price</Text>
                  </View>
                  <View style={styles.tableColAmount}>
                    <Text style={[styles.tableTotalText, styles.textRight]}>{fmt(invoiceData.totalPriceApprox)}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* ========== FOOTER IMAGE ========== */}
          {!!bottomLayerUrl && (
            <View style={styles.footerSection}>
              <Image src={bottomLayerUrl} style={styles.footerImage} />
            </View>
          )}

          {/* Terms & Conditions (if no footer image) */}
          {!bottomLayerUrl && !!termsText && (
            <View style={styles.termsSection}>
              <Text style={styles.termsTitle}>TERMS & CONDITIONS</Text>
              <Text style={styles.termsText}>{termsText}</Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};
export default PdfInvoice;