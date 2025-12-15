const mongoose = require("mongoose");
const { Schema } = mongoose;

const invoiceSchema = new Schema(
  {
    invoiceId: { type: String, unique: true, sparse: true },
    userId: { type: String, required: true },
    date: { type: Date, default: Date.now },
    pdfUrl: { type: String, required: true },
    invoiceType: {
      type: String,
      required: true,
      enum: ["type1", "type2", "type3"],
      default: "type1"
    },
    template: {
      _id: { type: Schema.Types.ObjectId, ref: "Template" },
      company: {
        name: String,
        logo: String,
        address: String
      }
    },

    invoiceDetails: {
      vehicleName: String,
      vehicleGrade: String,
      details: String,
      mileage: String,
      fuelType: String,
      year: String,
      reportDate: String,
      vehicleType: String,
      model: String,
      engineCapacity: String,
      engineCC: Number,
      declaredValueYen: Number,
      currency: String,
      priceValue: Number,
      currencyRate: Number,
      cid: Number,
      surcharge: Number,
      xid: Number,
      luxuryTax: Number,
      vat: Number,
      vetCom: Number,
      vetAndCom: Number,
      totalDuty: Number,
      priceYen: Number,
      yenRate: Number,
      priceLkr: Number,
      totalCustomsDuty: Number,
      clearingCharges: Number,
      totalPriceApprox: Number,
      totalCost: Number,
      customsValue: Number,
      cidPercent: Number,
      surchargePercent: Number,
      xidPercent: Number,
      luxuryTaxPercent: Number,
      vatPercent: Number,
      vetComPercent: Number,
      consigneeName: String,
      invoiceNo: String,
      vehicleImage: String
    },

    priceDetails: {
      totalAmount: Number,
      paymentMethod: String,
      transactionId: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
