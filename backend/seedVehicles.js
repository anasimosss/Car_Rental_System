require("dotenv").config();
const connectDB = require("./src/config/db");
const Vehicle = require("./src/models/Vehicle");

const sampleVehicles = [
  {
    make: "Toyota",
    model: "Camry",
    year: 2023,
    category: "Compact",
    color: "Silver",
    licensePlate: "ABC-1234",
    vin: "1HGBH41JXMN109186",
    specifications: {
      mileage: 15000,
      fuelType: "Gasoline",
      transmission: "Automatic",
      seats: 5,
    },
    status: "Available",
    pricing: {
      daily: 50,
      weekly: 300,
      monthly: 1000,
    },
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500",
    ],
  },
  {
    make: "Honda",
    model: "CR-V",
    year: 2023,
    category: "SUV",
    color: "Black",
    licensePlate: "XYZ-5678",
    vin: "2HGBH41JXMN109187",
    specifications: {
      mileage: 12000,
      fuelType: "Gasoline",
      transmission: "Automatic",
      seats: 7,
    },
    status: "Available",
    pricing: {
      daily: 70,
      weekly: 420,
      monthly: 1400,
    },
    images: [
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=500",
    ],
  },
  {
    make: "Tesla",
    model: "Model 3",
    year: 2024,
    category: "Luxury",
    color: "White",
    licensePlate: "EV-9999",
    vin: "5YJ3E1EA1JF000001",
    specifications: {
      mileage: 5000,
      fuelType: "Electric",
      transmission: "Automatic",
      seats: 5,
    },
    status: "Available",
    pricing: {
      daily: 95,
      weekly: 570,
      monthly: 2000,
    },
    images: ["https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500"],
  },
  {
    make: "Ford",
    model: "F-150",
    year: 2023,
    category: "Other",
    color: "Blue",
    licensePlate: "TRK-4567",
    vin: "1FTFW1E51KFA00001",
    specifications: {
      mileage: 20000,
      fuelType: "Gasoline",
      transmission: "Automatic",
      seats: 5,
    },
    status: "Available",
    pricing: {
      daily: 85,
      weekly: 510,
      monthly: 1700,
    },
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500",
    ],
  },
  {
    make: "BMW",
    model: "5 Series",
    year: 2024,
    category: "Luxury",
    color: "Gray",
    licensePlate: "LUX-7890",
    vin: "WBA5A5C50ED000001",
    specifications: {
      mileage: 8000,
      fuelType: "Gasoline",
      transmission: "Automatic",
      seats: 5,
    },
    status: "Available",
    pricing: {
      daily: 120,
      weekly: 720,
      monthly: 2500,
    },
    images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500"],
  },
  {
    make: "Hyundai",
    model: "Elantra",
    year: 2023,
    category: "Economy",
    color: "Red",
    licensePlate: "ECO-1122",
    vin: "5NPD84LF1KH000001",
    specifications: {
      mileage: 18000,
      fuelType: "Gasoline",
      transmission: "Automatic",
      seats: 5,
    },
    status: "Available",
    pricing: {
      daily: 40,
      weekly: 240,
      monthly: 850,
    },
    images: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500",
    ],
  },
  {
    make: "Jeep",
    model: "Wrangler",
    year: 2023,
    category: "SUV",
    color: "Green",
    licensePlate: "JEP-3344",
    vin: "1C4HJXDG1LW000001",
    specifications: {
      mileage: 14000,
      fuelType: "Gasoline",
      transmission: "Manual",
      seats: 4,
    },
    status: "Available",
    pricing: {
      daily: 80,
      weekly: 480,
      monthly: 1600,
    },
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500",
    ],
  },
  {
    make: "Mercedes-Benz",
    model: "C-Class",
    year: 2024,
    category: "Luxury",
    color: "Black",
    licensePlate: "MBZ-5566",
    vin: "WDDWF8EB1KA000001",
    specifications: {
      mileage: 6000,
      fuelType: "Gasoline",
      transmission: "Automatic",
      seats: 5,
    },
    status: "Available",
    pricing: {
      daily: 110,
      weekly: 660,
      monthly: 2300,
    },
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500",
    ],
  },
  {
    make: "Chevrolet",
    model: "Suburban",
    year: 2023,
    category: "Van",
    color: "White",
    licensePlate: "VAN-7788",
    vin: "1GNSCJKC1LR000001",
    specifications: {
      mileage: 22000,
      fuelType: "Gasoline",
      transmission: "Automatic",
      seats: 8,
    },
    status: "Available",
    pricing: {
      daily: 90,
      weekly: 540,
      monthly: 1800,
    },
    images: [
      "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=500",
    ],
  },
  {
    make: "Mazda",
    model: "CX-5",
    year: 2023,
    category: "SUV",
    color: "Blue",
    licensePlate: "MAZ-4455",
    vin: "JM3KFBCM1L0000001",
    specifications: {
      mileage: 16000,
      fuelType: "Gasoline",
      transmission: "Automatic",
      seats: 5,
    },
    status: "Available",
    pricing: {
      daily: 65,
      weekly: 390,
      monthly: 1300,
    },
    images: [
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=500",
    ],
  },
];

const seedVehicles = async () => {
  try {
    await connectDB();
    const vehicles = await Promise.all(
      sampleVehicles.map((vehicle) =>
        Vehicle.findOrCreate({ where: { licensePlate: vehicle.licensePlate }, defaults: vehicle })
          .then(([record]) => record)
      )
    );
    console.log(
      `✅ Successfully added ${vehicles.length} vehicles to the database!`
    );

    vehicles.forEach((v) => {
      console.log(
        `  - ${v.year} ${v.make} ${v.model} (${v.category}) - $${v.pricing.daily}/day`
      );
    });

  } catch (error) {
    console.error("Error seeding vehicles:", error);
    process.exitCode = 1;
  } finally {
    await connectDB.sequelize.close();
  }
};

seedVehicles();
