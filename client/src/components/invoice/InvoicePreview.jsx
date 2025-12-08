import React from "react";

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

export default function InvoicePreview({ invoiceData, templateData }) {
  // Extract template design settings
  const design = templateData?.design || {};
  const accentColor = design.accentColor || "#3B82F6";
  const letterheadUrl = design.letterheadUrl || null;
  const termsText = design.termsText || "";
  const bottomLayerUrl = design.bottomLayerUrl || null;

  // Check for dark mode (you might want to use a context or prop for this)
  const isDarkMode = 
    document.documentElement.classList.contains("dark") ||
    window.matchMedia("(prefers-color-scheme: dark)").matches;

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
      <div
        className="p-8 md:p-10 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600"
        style={{ minHeight: 400 }}
      >
        {/* Invoice ID */}
        <div className="mb-4 font-mono text-xs bg-blue-50 dark:bg-blue-900 p-3 rounded text-blue-700 dark:text-blue-300">
          <span className="font-semibold">Invoice ID:</span> {invoiceData?.invoiceId || "--"}
        </div>

        {/* Vehicle Info & Image Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          {/* Left: Vehicle Details */}
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3" style={{ color: accentColor }}>
              Vehicle Information
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">Name:</span>
                <p className="text-gray-900 dark:text-gray-100">{invoiceData?.vehicleName || "--"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">Grade:</span>
                <p className="text-gray-900 dark:text-gray-100">{invoiceData?.vehicleGrade || "--"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">Year:</span>
                <p className="text-gray-900 dark:text-gray-100">{invoiceData?.year || "--"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">Mileage:</span>
                <p className="text-gray-900 dark:text-gray-100">{invoiceData?.mileage || "--"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">Report Date:</span>
                <p className="text-gray-900 dark:text-gray-100">{invoiceData?.reportDate || "--"}</p>
              </div>
              {invoiceData?.details && (
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Details:</span>
                  <p className="text-gray-900 dark:text-gray-100">{invoiceData.details}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Vehicle Image */}
          <div className="flex flex-col items-center justify-start">
            {invoiceData?.vehicleImageUrl ? (
              <div>
                <img
                  src={invoiceData.vehicleImageUrl}
                  alt="Vehicle"
                  className="max-h-64 max-w-xs rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md object-cover"
                />
              </div>
            ) : (
              <div className="h-48 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
        </div>

        {/* Custom Duty Breakdown Table */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2" style={{ color: accentColor }}>
            Custom Duty Breakdown
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="bg-white dark:bg-gray-700 p-2 rounded border border-gray-300 dark:border-gray-600">
              <div className="text-gray-600 dark:text-gray-400">CID (30%)</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {fmt(invoiceData?.cid)}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-700 p-2 rounded border border-gray-300 dark:border-gray-600">
              <div className="text-gray-600 dark:text-gray-400">Surcharge (10%)</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {fmt(invoiceData?.surcharge)}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-700 p-2 rounded border border-gray-300 dark:border-gray-600">
              <div className="text-gray-600 dark:text-gray-400">XID (8%)</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {fmt(invoiceData?.xid)}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-700 p-2 rounded border border-gray-300 dark:border-gray-600">
              <div className="text-gray-600 dark:text-gray-400">Luxury Tax (15%)</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {fmt(invoiceData?.luxuryTax)}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-700 p-2 rounded border border-gray-300 dark:border-gray-600">
              <div className="text-gray-600 dark:text-gray-400">VAT (18%)</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {fmt(invoiceData?.vat)}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-700 p-2 rounded border border-gray-300 dark:border-gray-600">
              <div className="text-gray-600 dark:text-gray-400">Vet & Com (2%)</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {fmt(invoiceData?.vetAndCom)}
              </div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900 p-2 rounded border-2 border-orange-300 dark:border-orange-600 col-span-2">
              <div className="text-gray-600 dark:text-gray-400">Total Duty</div>
              <div className="font-bold text-orange-700 dark:text-orange-300">
                {fmt(invoiceData?.totalDuty)}
              </div>
            </div>
          </div>
        </div>

        {/* Price Section Table */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2" style={{ color: accentColor }}>
            Price Section
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            <div className="bg-white dark:bg-gray-700 p-2 rounded border border-gray-300 dark:border-gray-600">
              <div className="text-gray-600 dark:text-gray-400">Price (¥)</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {fmt(invoiceData?.priceYen)}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-700 p-2 rounded border border-gray-300 dark:border-gray-600">
              <div className="text-gray-600 dark:text-gray-400">Yen Rate</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {invoiceData?.yenRate?.toFixed(2) || "2.00"}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-700 p-2 rounded border border-gray-300 dark:border-gray-600">
              <div className="text-gray-600 dark:text-gray-400">Price (LKR)</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {fmt(invoiceData?.priceLkr)}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-700 p-2 rounded border border-gray-300 dark:border-gray-600">
              <div className="text-gray-600 dark:text-gray-400">Total Customs Duty</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {fmt(invoiceData?.totalCustomsDuty)}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-700 p-2 rounded border border-gray-300 dark:border-gray-600">
              <div className="text-gray-600 dark:text-gray-400">Clearing Charges</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {fmt(invoiceData?.clearingCharges)}
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900 p-2 rounded border-2 border-purple-300 dark:border-purple-600">
              <div className="text-gray-600 dark:text-gray-400">Total Price</div>
              <div className="font-bold text-purple-700 dark:text-purple-300">
                {fmt(invoiceData?.totalPriceApprox)}
              </div>
            </div>
          </div>
        </div>
      </div>

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