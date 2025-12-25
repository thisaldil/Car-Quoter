import React, { useMemo, useRef, useState } from "react";
import { PlusIcon, TrashIcon } from "lucide-react";
import axios from "axios";
import {
  getCloudinaryCloudName,
  getCloudinaryUploadPreset,
} from "../../utils/env";

const MAKES = [
  "TOYOTA",
  "NISSAN",
  "MAZDA",
  "MITSUBISHI",
  "HONDA",
  "SUZUKI",
  "SUBARU",
  "ISUZU",
  "DAIHATSU",
  "MITSUOKA",
  "LEXUS",
  "ALFAROMEO",
  "ASTON MARTIN",
  "AUDI",
  "BENTLEY",
  "BMW",
  "BMW ALPINA",
  "CADILLAC",
  "CHEVROLET",
  "CHRYSLER",
  "CITROEN",
  "DAIMLER",
  "DODGE",
  "FERRARI",
  "FIAT",
  "FORD",
  "FRUEHAUF",
  "GM",
  "GMC",
  "HINO",
  "HITACHI",
  "HUMMER",
  "HYUNDAI",
  "ISEKI",
  "JAGUAR",
  "JEEP",
  "KAWASAKI",
  "KOMATSU",
  "KUBOTA",
  "LAMBORGHINI",
  "LANCIA",
  "LAND ROVER",
  "LINCOLN",
  "LOTUS",
  "MASERATI",
  "MERCEDES BENZ",
  "MINI",
  "MORGAN",
  "PEUGEOT",
  "PONTIAC",
  "PORSCHE",
  "RENAULT",
  "ROLLS ROYCE",
  "ROVER",
  "SAAB",
  "SMART",
  "TADANO",
  "TCM",
  "TESLA",
  "TRAILER",
  "VOLKSWAGEN",
  "VOLVO",
  "WINNEBAGO",
  "YAMAHA",
  "YANMAR",
  "OTHERS",
];

const MODELS_BY_MAKE = {
  TOYOTA: [
    "Corolla",
    "Camry",
    "Yaris",
    "Aqua",
    "Vitz",
    "RAV4",
    "Harrier",
    "Land Cruiser",
    "Prado",
    "Hilux",
    "Hiace",
    "Crown",
    "Premio",
    "Allion",
    "Axio",
  ],
  NISSAN: [
    "Note",
    "March",
    "Serena",
    "X-Trail",
    "Skyline",
    "Fuga",
    "Elgrand",
    "Juke",
    "Dayz",
    "Tiida",
    "Bluebird Sylphy",
    "NV350 Caravan",
  ],
  MAZDA: [
    "Demio (2)",
    "Axela (3)",
    "Atenza (6)",
    "CX-3",
    "CX-5",
    "CX-8",
    "Roadster (MX-5)",
    "Bongo",
  ],
  MITSUBISHI: [
    "Outlander",
    "RVR",
    "Pajero",
    "Delica D:5",
    "EK Wagon",
    "Lancer",
    "Mirage",
  ],
  HONDA: [
    "Fit (Jazz)",
    "Civic",
    "Accord",
    "Vezel (HR-V)",
    "CR-V",
    "N-BOX",
    "Freed",
    "Stepwgn",
  ],
  SUZUKI: ["Swift", "Alto", "Wagon R", "Hustler", "Spacia", "Jimny", "Every"],
  SUBARU: ["Impreza", "Legacy", "Forester", "XV", "Levorg", "Outback", "WRX"],
  ISUZU: ["Elf", "Forward", "Giga", "D-MAX", "MU-X"],
  DAIHATSU: ["Mira", "Tanto", "Move", "Hijet", "Rocky", "Copen"],
  MITSUOKA: ["Viewt", "Himiko", "Galue"],
  LEXUS: ["IS", "ES", "GS", "LS", "CT", "RX", "NX", "UX", "LX", "GX"],
  ALFAROMEO: ["Giulietta", "Giulia", "Stelvio", "MiTo"],
  "ASTON MARTIN": ["Vantage", "DB9", "DB11", "Rapide"],
  AUDI: ["A3", "A4", "A6", "A8", "Q2", "Q3", "Q5", "Q7", "TT"],
  BENTLEY: ["Continental GT", "Flying Spur", "Bentayga"],
  BMW: [
    "1 Series",
    "3 Series",
    "5 Series",
    "7 Series",
    "X1",
    "X3",
    "X5",
    "i3",
    "i8",
  ],
  "BMW ALPINA": ["B3", "B5", "B7", "D3"],
  CADILLAC: ["CTS", "ATS", "Escalade", "XT5"],
  CHEVROLET: ["Camaro", "Corvette", "Cruze", "Trailblazer"],
  CHRYSLER: ["300", "Pacifica", "PT Cruiser"],
  CITROEN: ["C3", "C4", "C5", "Berlingo", "DS3"],
  DAIMLER: ["XJ", "Super V8"],
  DODGE: ["Charger", "Challenger", "Durango", "Ram"],
  FERRARI: ["458", "488", "California", "F8", "Portofino"],
  FIAT: ["500", "Panda", "Punto", "500X"],
  FORD: ["Focus", "Fiesta", "Mustang", "Explorer", "Ranger"],
  FRUEHAUF: ["Trailer"],
  GM: ["Sierra", "Silverado"],
  GMC: ["Sierra", "Yukon", "Acadia", "Terrain"],
  HINO: ["Dutro", "Ranger", "Profia"],
  HITACHI: ["Excavator", "Wheel Loader"],
  HUMMER: ["H1", "H2", "H3"],
  HYUNDAI: ["i10", "i20", "Elantra", "Sonata", "Tucson", "Santa Fe"],
  ISEKI: ["Tractor", "Combine"],
  JAGUAR: ["XE", "XF", "XJ", "F-PACE", "E-PACE", "F-TYPE"],
  JEEP: ["Wrangler", "Cherokee", "Grand Cherokee", "Renegade", "Compass"],
  KAWASAKI: ["Ninja 250", "Ninja 400", "Z1000", "Versys"],
  KOMATSU: ["Excavator", "Forklift", "Bulldozer"],
  KUBOTA: ["Tractor", "Combine", "Excavator"],
  LAMBORGHINI: ["Huracán", "Aventador", "Urus", "Gallardo"],
  LANCIA: ["Ypsilon", "Delta", "Thema"],
  "LAND ROVER": [
    "Defender",
    "Discovery",
    "Range Rover",
    "Range Rover Sport",
    "Evoque",
    "Velar",
  ],
  LINCOLN: ["MKZ", "Navigator", "Aviator", "Continental"],
  LOTUS: ["Elise", "Exige", "Evora", "Emira"],
  MASERATI: ["Ghibli", "Quattroporte", "Levante", "GranTurismo"],
  "MERCEDES BENZ": [
    "A-Class",
    "C-Class",
    "E-Class",
    "S-Class",
    "GLA",
    "GLC",
    "GLE",
    "GLS",
    "V-Class",
  ],
  MINI: ["One", "Cooper", "Clubman", "Countryman"],
  MORGAN: ["4/4", "Plus 4", "Plus 8"],
  PEUGEOT: ["208", "308", "508", "2008", "3008", "5008"],
  PONTIAC: ["G6", "G8", "Firebird", "Trans Am"],
  PORSCHE: [
    "911",
    "Cayman",
    "Boxster",
    "Panamera",
    "Macan",
    "Cayenne",
    "Taycan",
  ],
  RENAULT: ["Clio", "Megane", "Talisman", "Captur", "Kadjar"],
  "ROLLS ROYCE": ["Phantom", "Ghost", "Wraith", "Dawn", "Cullinan"],
  ROVER: ["25", "45", "75", "Mini (classic)"],
  SAAB: ["9-3", "9-5", "900"],
  SMART: ["fortwo", "forfour"],
  TADANO: ["Rough Terrain Crane", "All Terrain Crane"],
  TCM: ["Forklift", "Reach Truck"],
  TESLA: ["Model S", "Model 3", "Model X", "Model Y", "Cybertruck"],
  TRAILER: ["Flatbed", "Box", "Reefer"],
  VOLKSWAGEN: ["Polo", "Golf", "Passat", "Tiguan", "Touareg", "Transporter"],
  VOLVO: ["S60", "S90", "V60", "V90", "XC40", "XC60", "XC90"],
  WINNEBAGO: ["Brave", "Travato", "View"],
  YAMAHA: ["YZF-R3", "MT-07", "MT-09", "NMAX"],
  YANMAR: ["Tractor", "Combine Harvester"],
  OTHERS: ["Other"],
};

export default function CarInvoiceForm({ onSave }) {
  const cloudinaryUploadSeq = useRef(0);
  const CLOUDINARY_CLOUD_NAME = getCloudinaryCloudName();
  const CLOUDINARY_IMAGE_UPLOAD_PRESET = getCloudinaryUploadPreset();

  const [invoiceData, setInvoiceData] = useState({
    // Invoice ID
    invoiceId: `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,

    // Vehicle Information
    vehicleName: "",
    vehicleGrade: "",
    details: "",
    mileage: "",
    vehicleType: "",
    fuelType: "",
    engineCC: "",
    year: "",

    // Date
    reportDate: new Date().toISOString().slice(0, 10),

    // Custom Duty Breakdown
    cid: 0,
    surcharge: 0,
    xid: 0,
    luxuryTax: 0,
    vat: 0,
    vetAndCom: 0,
    totalDuty: 0,

    // Price Section
    currency: "JPY",
    priceValue: 0,
    currencyRate: 2,
    priceLkr: 0,
    totalCustomsDuty: 0,
    clearingCharges: 125000,
    totalPriceApprox: 0,

    // Image
    vehicleImage: null,
    vehicleImageUrl: "",
  });

  const [dragActive, setDragActive] = useState(false);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  // Get available models for selected make
  const availableModels = selectedMake ? MODELS_BY_MAKE[selectedMake] || [] : [];

  // Handle make selection
  const handleMakeChange = (e) => {
    const make = e.target.value;
    setSelectedMake(make);
    setSelectedModel(""); // Reset model when make changes
  };

  // Handle model selection
  const handleModelChange = (e) => {
    const model = e.target.value;
    setSelectedModel(model);
    // Auto-fill vehicle name with make and model
    if (selectedMake && model) {
      setInvoiceData((prev) => ({
        ...prev,
        vehicleName: `${selectedMake} ${model}`,
      }));
    }
  };

  // Auto-calculate duty values - Sri Lanka vehicle import tax structure
  const calculateDuties = (baseValue, currencyRate = invoiceData.currencyRate) => {
    // Tax Base (CIF value converted to LKR)
    const cifValue = baseValue * currencyRate;

    // CID = 20% of Tax Base
    const calculatedCid = (cifValue * 20) / 100;

    // SUR (Surcharge) = 50% of CID
    const calculatedSurcharge = (calculatedCid * 50) / 100;

    // XID (Excise Duty) = engineCC × 3450
    const engineCC = parseFloat(invoiceData.engineCC) || 0;
    const calculatedXid = engineCC * 3450;

    // VEL (Vehicle Entitlement Levy) = Fixed 15000 LKR
    const vehicleEntitlementLevy = 15000;

    // COM/EXM/SEL = Fixed 1750 LKR
    const comExmSel = 1750;

    // VAT Base = CIF + CID + SUR + XID + VEL + COM/EXM/SEL
    const vatBase = cifValue + calculatedCid + calculatedSurcharge + calculatedXid + vehicleEntitlementLevy + comExmSel;

    // VAT = 18% of VAT Base
    const calculatedVat = (vatBase * 18) / 100;

    // Total Duty = CID + SUR + XID + VAT + VEL + COM/EXM/SEL
    const calculatedTotalDuty =
      calculatedCid +
      calculatedSurcharge +
      calculatedXid +
      calculatedVat +
      vehicleEntitlementLevy +
      comExmSel;

    const calculatedPriceLkr = cifValue;
    const calculatedTotalCustomsDuty = calculatedTotalDuty;
    const calculatedTotalPrice =
      calculatedPriceLkr +
      calculatedTotalCustomsDuty +
      invoiceData.clearingCharges;

    return {
      cid: calculatedCid,
      surcharge: calculatedSurcharge,
      xid: calculatedXid,
      luxuryTax: vehicleEntitlementLevy,
      vat: calculatedVat,
      vetAndCom: comExmSel,
      totalDuty: calculatedTotalDuty,
      priceLkr: calculatedPriceLkr,
      totalCustomsDuty: calculatedTotalCustomsDuty,
      totalPriceApprox: calculatedTotalPrice,
    };
  };

  const handlePriceValueChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    const calculated = calculateDuties(value, invoiceData.currencyRate);
    setInvoiceData((prev) => ({
      ...prev,
      priceValue: value,
      ...calculated,
    }));
  };

  const handleCurrencyRateChange = (e) => {
    const value = parseFloat(e.target.value) || 2;
    const calculated = calculateDuties(invoiceData.priceValue, value);
    setInvoiceData((prev) => ({
      ...prev,
      currencyRate: value,
      ...calculated,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadVehicleImageToCloudinary = async (imageFile) => {
    if (!imageFile) return null;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_IMAGE_UPLOAD_PRESET) return null;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", CLOUDINARY_IMAGE_UPLOAD_PRESET);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );

    return res?.data?.secure_url || res?.data?.url || null;
  };

  const setVehicleImage = async (file) => {
    if (!file) return;

    const seq = ++cloudinaryUploadSeq.current;

    // Fast local preview first
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoiceData((prev) => ({
          ...prev,
          vehicleImage: file,
          vehicleImageUrl: String(reader.result || ""),
        }));
      };
      reader.readAsDataURL(file);
    } catch {
      setInvoiceData((prev) => ({
        ...prev,
        vehicleImage: file,
      }));
    }

    // Then upload to Cloudinary and replace with permanent URL
    try {
      const cloudUrl = await uploadVehicleImageToCloudinary(file);
      if (!cloudUrl) return;
      if (seq !== cloudinaryUploadSeq.current) return; // stale upload

      setInvoiceData((prev) => ({
        ...prev,
        vehicleImage: file,
        vehicleImageUrl: cloudUrl,
      }));
    } catch (err) {
      // Keep local preview if Cloudinary upload fails
      console.error("Cloudinary vehicle image upload failed:", err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVehicleImage(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setVehicleImage(file);
  };

  const handleSave = () => {
    onSave?.(invoiceData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Car Invoice Form
        </h1>

        {/* Main Layout: Left and Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Tables (2 columns on lg screens) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Table 1: Vehicle Information */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-700 mb-4 border-b-2 border-blue-500 pb-2">
                Vehicle Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Invoice ID (Auto-generated) */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Invoice ID (Auto-generated)
                  </label>
                  <input
                    type="text"
                    value={invoiceData.invoiceId}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 font-mono text-sm"
                    placeholder="Auto-generated Invoice ID"
                    readOnly
                  />
                </div>

                {/* Make Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Vehicle Make
                  </label>
                  <select
                    value={selectedMake}
                    onChange={handleMakeChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select Make --</option>
                    {MAKES.map((make) => (
                      <option key={make} value={make}>
                        {make}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Model Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Vehicle Model
                  </label>
                  <select
                    value={selectedModel}
                    onChange={handleModelChange}
                    disabled={!selectedMake}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">-- Select Model --</option>
                    {availableModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Vehicle Name (Auto-filled) */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Vehicle Name (Auto-filled)
                  </label>
                  <input
                    type="text"
                    name="vehicleName"
                    value={invoiceData.vehicleName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
                    placeholder="Auto-filled from Make & Model"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Vehicle Grade
                  </label>
                  <input
                    type="text"
                    name="vehicleGrade"
                    value={invoiceData.vehicleGrade}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter vehicle grade"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Vehicle Type
                  </label>
                  <select
                    name="vehicleType"
                    value={invoiceData.vehicleType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select Type --</option>
                    <option value="Car/Suv">Car/Suv</option>
                    <option value="Pickup">Pickup</option>
                  
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Details
                  </label>
                  <textarea
                    name="details"
                    value={invoiceData.details}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter vehicle details"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Mileage
                  </label>
                  <input
                    type="text"
                    name="mileage"
                    value={invoiceData.mileage}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 50000 km"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    name="year"
                    value={invoiceData.year}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 2020"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Fuel Type
                  </label>
                  <select
                    name="fuelType"
                    value={invoiceData.fuelType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select Fuel --</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol Hybrid">Petrol Hybrid</option>
                    <option value="Diesel Hybrid">Diesel Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Engine CC
                  </label>
                  <input
                    type="number"
                    name="engineCC"
                    value={invoiceData.engineCC}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 1500"
                  />
                </div>
              </div>
            </div>

            {/* Table 2: Date & Custom Duty Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Section */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-lg font-bold text-gray-700 mb-4 border-b-2 border-green-500 pb-2">
                  Date
                </h2>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Report Date
                  </label>
                  <input
                    type="date"
                    name="reportDate"
                    value={invoiceData.reportDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Custom Duty Breakdown */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-lg font-bold text-gray-700 mb-4 border-b-2 border-orange-500 pb-2">
                  Custom Duty Breakdown
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-gray-700">CID (20%):</span>
                    <span className="bg-gray-100 px-3 py-1 rounded text-gray-800">
                      {invoiceData.cid.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-gray-700">
                      Surcharge (50% of CID):
                    </span>
                    <span className="bg-gray-100 px-3 py-1 rounded text-gray-800">
                      {invoiceData.surcharge.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-gray-700">XID (CC × 3450):</span>
                    <span className="bg-gray-100 px-3 py-1 rounded text-gray-800">
                      {invoiceData.xid.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-gray-700">
                      VEL (15,000 LKR):
                    </span>
                    <span className="bg-gray-100 px-3 py-1 rounded text-gray-800">
                      {invoiceData.luxuryTax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-gray-700">VAT (18%):</span>
                    <span className="bg-gray-100 px-3 py-1 rounded text-gray-800">
                      {invoiceData.vat.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-gray-700">
                      COM/EXM/SEL (1,750 LKR):
                    </span>
                    <span className="bg-gray-100 px-3 py-1 rounded text-gray-800">
                      {invoiceData.vetAndCom.toFixed(2)}
                    </span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-gray-800">Total Duty:</span>
                    <span className="bg-orange-100 px-3 py-1 rounded text-orange-700">
                      {invoiceData.totalDuty.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Table 3: Price Section (Full Width) */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4 border-b-2 border-purple-500 pb-2">
                <h2 className="text-xl font-bold text-gray-700">
                  Price Section
                </h2>
                <div className="text-xs text-red-600 text-right leading-snug">
                  <div className="font-semibold">Selection order:</div>
                  <div>1) Select currency</div>
                  <div>2) Rate</div>
                  <div>3) Price</div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={invoiceData.currency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="JPY">JPY (¥)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="LKR">LKR (Rs)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {invoiceData.currency} to LKR Rate
                  </label>
                  <input
                    type="number"
                    name="currencyRate"
                    value={invoiceData.currencyRate}
                    onChange={handleCurrencyRateChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Price ({invoiceData.currency})
                  </label>
                  <input
                    type="number"
                    name="priceValue"
                    value={invoiceData.priceValue}
                    onChange={handlePriceValueChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Price (LKR)
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 flex items-center">
                    <span className="text-gray-700 font-semibold">
                      {invoiceData.priceLkr.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Total Customs Duty
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 flex items-center">
                    <span className="text-gray-700 font-semibold">
                      {invoiceData.totalCustomsDuty.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Clearing Charges
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 flex items-center">
                    <span className="text-gray-700 font-semibold">
                      {invoiceData.clearingCharges.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Total Price
                  </label>
                  <div className="w-full px-3 py-2 border border-2 border-purple-500 rounded-md bg-purple-50 flex items-center">
                    <span className="text-purple-700 font-bold text-lg">
                      {invoiceData.totalPriceApprox.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Image Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 sticky top-8">
              <h2 className="text-xl font-bold text-gray-700 mb-4 border-b-2 border-red-500 pb-2">
                Image Section
              </h2>

              {/* Drag and Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-gray-50 hover:border-gray-400"
                }`}
              >
                <input
                  type="file"
                  id="image-upload"
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer block"
                >
                  {invoiceData.vehicleImageUrl ? (
                    <div>
                      <img
                        src={invoiceData.vehicleImageUrl}
                        alt="Vehicle"
                        className="w-full h-64 object-cover rounded-md mb-3"
                      />
                      <p className="text-sm text-gray-600">
                        Click to change image
                      </p>
                    </div>
                  ) : (
                    <div>
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-18-8l-4 4m0 0l4 4m-4-4h16"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">
                        Drag and drop an image here, or click to select
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {/* Image URL Option */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Or paste Image URL
                </label>
                <input
                  type="url"
                  name="vehicleImageUrl"
                  value={invoiceData.vehicleImageUrl}
                  onChange={(e) =>
                    setInvoiceData((prev) => ({
                      ...prev,
                      vehicleImageUrl: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {invoiceData.vehicleImageUrl && !invoiceData.vehicleImageUrl.startsWith('data:') && (
                <img
                  src={invoiceData.vehicleImageUrl}
                  alt="Vehicle URL"
                  className="w-full h-64 object-cover rounded-md mt-3"
                />
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-12">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md"
          >
            Save Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
