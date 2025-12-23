import React, { useEffect, useMemo, useState } from "react";

function toNum(x) {
  const n = typeof x === "string" ? Number(x.replace(/,/g, "")) : Number(x);
  return Number.isFinite(n) ? n : 0;
}

function fmt(n) {
  const v = toNum(n);
  return v
    ? new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(v)
    : n || "-";
}

function sumCIF(items) {
  return (items || []).reduce((s, r) => s + toNum(r?.cif), 0);
}

export default function InvoicePreview({ invoiceData, templateData, contentOnly = false }) {
  // Extract template design settings
  const design = templateData?.design || {};
  const accentColor = design.accentColor || "#3B82F6";
  const letterheadUrl = design.letterheadUrl || null;
  const termsText = design.termsText || "";
  const bottomLayerUrl = design.bottomLayerUrl || null;

  const invoiceIdDisplay =
    invoiceData?.invoiceId ||
    invoiceData?.invoiceNo ||
    invoiceData?.invoiceDetails?.invoiceNo ||
    "--";
  const fuelTypeDisplay =
    invoiceData?.fuelType ||
    invoiceData?.invoiceDetails?.fuelType ||
    "--";
  const engineCCDisplay =
    invoiceData?.engineCC ||
    invoiceData?.engineCapacity ||
    invoiceData?.invoiceDetails?.engineCC ||
    invoiceData?.invoiceDetails?.engineCapacity ||
    "--";

  const [vehicleObjectUrl, setVehicleObjectUrl] = useState("");

  const resolvedVehicleImageSrc = useMemo(() => {
    if (invoiceData?.vehicleImageUrl) return invoiceData.vehicleImageUrl;
    if (typeof invoiceData?.vehicleImage === "string") return invoiceData.vehicleImage;
    return vehicleObjectUrl;
  }, [invoiceData?.vehicleImageUrl, invoiceData?.vehicleImage, vehicleObjectUrl]);

  useEffect(() => {
    if (invoiceData?.vehicleImageUrl) return;
    if (typeof invoiceData?.vehicleImage === "string") return;

    const maybeFile = invoiceData?.vehicleImage;
    const isBlobLike =
      typeof maybeFile === "object" &&
      maybeFile !== null &&
      typeof maybeFile.size === "number";

    if (!isBlobLike) return;

    const url = URL.createObjectURL(maybeFile);
    setVehicleObjectUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [invoiceData?.vehicleImage, invoiceData?.vehicleImageUrl]);

  // Check for dark mode (you might want to use a context or prop for this)
  const isDarkMode = 
    document.documentElement.classList.contains("dark") ||
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const displayDate =
    invoiceData?.date ||
    invoiceData?.reportDate ||
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "numeric",
      year: "numeric",
    });

  const dutyRows = [
    { label: "CID (20%)", value: invoiceData?.cid },
    { label: "Surcharge (50% of CID)", value: invoiceData?.surcharge },
    { label: "XID (CC × 3450)", value: invoiceData?.xid },
    { label: "VEL (15,000 LKR)", value: invoiceData?.luxuryTax },
    { label: "VAT (18%)", value: invoiceData?.vat },
    { label: "COM/EXM/SEL (1,750 LKR)", value: invoiceData?.vetAndCom },
  ];

  const content = (
    <div
      className="p-8 md:p-10 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600"
      style={{ minHeight: 400 }}
    >
        {/* INVOICE ID & DATE (match PDF layout) */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Invoice ID</div>
            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {invoiceIdDisplay}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 dark:text-gray-400">Date</div>
            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{displayDate}</div>
          </div>
        </div>

        {/* DIVIDER */}
        <div
          className="w-full h-0.5 mb-4"
          style={{ backgroundColor: accentColor }}
        />

        {/* VEHICLE IMAGE + INFO (match PDF layout) */}
        <div className="flex gap-4 mb-4">
          {/* Left: Vehicle Image */}
          <div className="w-[35%]">
            {resolvedVehicleImageSrc ? (
              <img
                src={resolvedVehicleImageSrc}
                alt="Vehicle"
                className="w-full h-32 rounded border border-gray-200 dark:border-gray-600 object-cover"
              />
            ) : (
              <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-400 text-sm">
                Vehicle Image
              </div>
            )}
          </div>
          <div className="w-[65%]">
            <div className="text-sm font-semibold mb-2" style={{ color: accentColor }}>
              VEHICLE INFORMATION
            </div>

            <div className="space-y-1 text-xs">
              {[
                { label: "Vehicle Name:", value: invoiceData?.vehicleName },
                { label: "Grade:", value: invoiceData?.vehicleGrade },
                { label: "Year:", value: invoiceData?.year },
                { label: "Mileage:", value: invoiceData?.mileage },
                { label: "Vehicle Type:", value: invoiceData?.vehicleType },
                { label: "Fuel Type:", value: fuelTypeDisplay },
                { label: "Engine CC:", value: engineCCDisplay },
                { label: "Report Date:", value: invoiceData?.reportDate },
              ].map((row) => (
                <div key={row.label} className="flex">
                  <div className="w-28 text-gray-600 dark:text-gray-400 font-medium">
                    {row.label}
                  </div>
                  <div className="flex-1 text-gray-900 dark:text-gray-100">
                    {row.value || "--"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DETAILS (full width, match PDF layout) */}
        <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded p-3 mb-4">
          <div className="text-sm font-semibold mb-2" style={{ color: accentColor }}>
            DETAILS
          </div>
          <div className="text-xs text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
            {invoiceData?.details || "No details provided."}
          </div>
        </div>

        {/* DUTY + PRICE SUMMARY SIDE BY SIDE (match PDF layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Custom Duty Breakdown */}
          <div>
            <div className="text-sm font-semibold mb-2" style={{ color: accentColor }}>
              CUSTOM DUTY BREAKDOWN
            </div>
            <div className="border border-gray-300 dark:border-gray-600 rounded overflow-hidden bg-white dark:bg-gray-900">
              <div className="flex text-xs font-semibold bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-[1.6] px-3 py-2 text-gray-700 dark:text-gray-200">Description</div>
                <div className="flex-1 px-3 py-2 text-right text-gray-700 dark:text-gray-200">Amount (LKR)</div>
              </div>
              {dutyRows.map((r) => (
                <div
                  key={r.label}
                  className="flex text-xs border-b border-gray-200 dark:border-gray-700"
                >
                  <div className="flex-[1.6] px-3 py-2 text-gray-800 dark:text-gray-100">{r.label}</div>
                  <div className="flex-1 px-3 py-2 text-right text-gray-800 dark:text-gray-100">{fmt(r.value)}</div>
                </div>
              ))}
              <div className="flex text-xs font-bold" style={{ backgroundColor: `${accentColor}22` }}>
                <div className="flex-[1.6] px-3 py-2" style={{ color: accentColor }}>
                  Total Duty
                </div>
                <div className="flex-1 px-3 py-2 text-right" style={{ color: accentColor }}>
                  {fmt(invoiceData?.totalDuty)}
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div>
            <div className="text-sm font-semibold mb-2" style={{ color: accentColor }}>
              PRICE SUMMARY
            </div>
            <div className="border border-gray-300 dark:border-gray-600 rounded overflow-hidden bg-white dark:bg-gray-900">
              <div className="flex text-xs font-semibold bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-[1.6] px-3 py-2 text-gray-700 dark:text-gray-200">Description</div>
                <div className="flex-1 px-3 py-2 text-right text-gray-700 dark:text-gray-200">Amount</div>
              </div>

              {[
                {
                  label: "Currency",
                  value: invoiceData?.currency || "JPY",
                },
                {
                  label: `Price (${invoiceData?.currency || "JPY"})`,
                  value: fmt(invoiceData?.priceValue || invoiceData?.priceYen),
                },
                {
                  label: `${invoiceData?.currency || "JPY"} to LKR Rate`,
                  value: (invoiceData?.currencyRate || invoiceData?.yenRate)?.toFixed?.(2) || "2.00",
                },
                { label: "Price (LKR)", value: fmt(invoiceData?.priceLkr) },
                { label: "Total Customs Duty", value: fmt(invoiceData?.totalCustomsDuty) },
                { label: "Clearing Charges", value: fmt(invoiceData?.clearingCharges) },
              ].map((r) => (
                <div
                  key={r.label}
                  className="flex text-xs border-b border-gray-200 dark:border-gray-700"
                >
                  <div className="flex-[1.6] px-3 py-2 text-gray-800 dark:text-gray-100">{r.label}</div>
                  <div className="flex-1 px-3 py-2 text-right text-gray-800 dark:text-gray-100">{r.value}</div>
                </div>
              ))}

              <div className="flex text-xs font-bold" style={{ backgroundColor: `${accentColor}22` }}>
                <div className="flex-[1.6] px-3 py-2" style={{ color: accentColor }}>
                  Total Price
                </div>
                <div className="flex-1 px-3 py-2 text-right" style={{ color: accentColor }}>
                  {fmt(invoiceData?.totalPriceApprox)}
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );

  if (contentOnly) return content;

  return (
    <div
      className="relative mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700"
      style={{
        maxWidth: 800,
        minHeight: 900,
        boxShadow:
          "0 4px 24px 0 rgba(0,0,0,0.10), 0 1.5px 4px 0 rgba(0,0,0,0.07)",
        borderRadius: 18,
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <div
        className="flex items-center justify-center border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 h-32 md:h-36 px-6"
        style={{
          boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
          minHeight: 110,
        }}
      >
        {letterheadUrl ? (
          <img
            src={letterheadUrl}
            alt="Letterhead"
            className="max-h-28 md:max-h-32 w-auto object-contain"
            style={{ maxWidth: "100%" }}
          />
        ) : (
          <div className="h-20 flex items-center justify-center text-gray-400 w-full">
            No letterhead selected
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      {content}

      {/* FOOTER - Terms & Conditions */}
      {termsText && (
        <div
          className="p-8 md:p-10"
          style={{
            background: accentColor + (isDarkMode ? "22" : "0A"),
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            borderBottomLeftRadius: bottomLayerUrl ? 0 : 18,
            borderBottomRightRadius: bottomLayerUrl ? 0 : 18,
            borderTop: "1px solid #e5e7eb",
            minHeight: 120,
          }}
        >
          <h3
            className="font-semibold mb-2"
            style={{ color: accentColor, fontSize: 18 }}
          >
            Terms & Conditions
          </h3>
          <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-100">
            {termsText}
          </pre>
        </div>
      )}

      {/* BOTTOM IMAGE */}
      {bottomLayerUrl && (
        <div
          className="flex justify-end items-end px-8 pb-6 pt-2"
          style={{
            background: isDarkMode ? "#222" : "#f9fafb",
            borderBottomLeftRadius: 18,
            borderBottomRightRadius: 18,
          }}
        >
          <img
            src={bottomLayerUrl}
            alt="Bottom layer"
            className="h-16 md:h-20 object-contain"
            style={{ maxWidth: 220 }}
          />
        </div>
      )}
    </div>
  );
}