export const productCategories = [
  "All equipment",
  "Solar panels",
  "Inverters",
  "Batteries",
  "Electrical cables",
  "Protection & distribution",
  "Mounting & accessories",
  "Charge controllers",
  "Switches & controls",
  "Conduits & fittings",
] as const;

export const products = [
  { id: "panel-01", name: "Monocrystalline PV module", category: "Solar panels", description: "High-efficiency solar modules for commercial rooftops and ground-mounted projects.", spec: "455 W · Mono PERC · Tier 1 sourcing", image: "solar" },
  { id: "panel-02", name: "Commercial PV array package", category: "Solar panels", description: "Right-sized panel packages for facilities, estates and distributed energy projects.", spec: "Project-quoted · Site requirements reviewed", image: "solar" },
  { id: "inverter-01", name: "Hybrid solar inverter", category: "Inverters", description: "An integrated inverter platform for solar, storage and dependable backup.", spec: "8 kVA · Single phase · 48 V", image: "solar" },
  { id: "inverter-02", name: "Three-phase industrial inverter", category: "Inverters", description: "Commercial conversion equipment matched to real facility demand.", spec: "30 kW · Three phase · Grid compatible", image: "solar" },
  { id: "battery-01", name: "Lithium energy storage", category: "Batteries", description: "Modular storage to support continuity and make better use of solar generation.", spec: "5.12 kWh · LiFePO₄ · Rack mount", image: "solar" },
  { id: "battery-02", name: "Deep-cycle solar battery bank", category: "Batteries", description: "Long-life storage choices for properly specified commercial installations.", spec: "200 Ah · 12 V · Deep cycle", image: "solar" },
  { id: "cable-01", name: "Solar DC cable", category: "Electrical cables", description: "UV-resistant, insulated cable for professional solar array installations.", spec: "6 mm² · Double insulated · Per metre", image: "cable" },
  { id: "cable-02", name: "Armoured power cable", category: "Electrical cables", description: "Durable cable options selected to suit site loads and routing conditions.", spec: "4-core · 16 mm² · Size by request", image: "cable" },
  { id: "cable-03", name: "Building wire", category: "Electrical cables", description: "Insulated copper conductors for correctly specified building circuits.", spec: "Conductor size and insulation rated to project needs", image: "cable" },
  { id: "protection-01", name: "Modular circuit protection", category: "Protection & distribution", description: "Breakers and isolation components for safe, well-ordered installations.", spec: "Single / three phase · Spec verified", image: "electrical" },
  { id: "protection-02", name: "Distribution board", category: "Protection & distribution", description: "Distribution equipment configured around actual circuits and project scope.", spec: "Metal enclosure · Multiple ways · Quoted to order", image: "electrical" },
  { id: "mounting-01", name: "Solar module mounting kit", category: "Mounting & accessories", description: "Reliable mounting rails and hardware for common commercial roof profiles.", spec: "Roof-specific · Corrosion-resistant", image: "solar" },
  { id: "controller-01", name: "MPPT solar charge controller", category: "Charge controllers", description: "Charge control matched to system voltage, array capacity and battery chemistry.", spec: "MPPT · 100 A · 12 / 24 / 48 V", image: "solar" },
  { id: "switch-01", name: "Industrial isolator switch", category: "Switches & controls", description: "Isolation options selected for the circuit, environment and equipment duty.", spec: "Single / three phase · Rating confirmed to specification", image: "electrical" },
  { id: "switch-02", name: "Changeover switch", category: "Switches & controls", description: "Manual source-transfer equipment for appropriately designed installations.", spec: "Current rating and pole configuration project-quoted", image: "electrical" },
  { id: "conduit-01", name: "Electrical conduit & fittings", category: "Conduits & fittings", description: "Routing protection options matched to installation environment and layout.", spec: "Material, diameter and fittings confirmed per project", image: "electrical" },
] as const;

export const inventory = [
  { id: "gen-01", name: "Industrial standby generator", brand: "Perkins engine · Stamford alternator", capacity: "250 kVA", year: "2019", hours: "1,240 run hours", condition: "Excellent", report: "Load-bank tested to 80% rated capacity. Oil pressure, cooling circuit and alternator insulation checked. Service documentation reviewed.", availability: "Ready for assessment" },
  { id: "gen-02", name: "Commercial backup generator", brand: "Cummins engine · Stamford alternator", capacity: "100 kVA", year: "2020", hours: "860 run hours", condition: "Very good", report: "Fuel and cooling systems inspected. Electrical outputs validated. Preventive maintenance completed; load test report available for review.", availability: "Inspection report available" },
  { id: "gen-03", name: "Industrial power generator", brand: "Caterpillar engine · Brush alternator", capacity: "500 kVA", year: "2017", hours: "2,110 run hours", condition: "Very good", report: "Inspected and serviced before resale. Control panel, voltage regulation and transfer compatibility tested and documented.", availability: "Project matched" },
] as const;

export type QuoteItem = { id: string; quantity: number };

export const formatQuantity = (quantity: number) => new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(quantity);