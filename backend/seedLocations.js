require("dotenv").config();
const connectDB = require("./src/config/db");
const Location = require("./src/models/Location");

const sampleLocations = [
  {
    name: "Downtown Office",
    address: "123 Main Street",
    city: "Seattle",
    state: "WA",
    zipCode: "98101",
    country: "USA",
    phone: "+1-206-555-0100",
    email: "downtown@carrental.com",
    hours: "Mon-Fri: 8:00 AM - 6:00 PM, Sat-Sun: 9:00 AM - 5:00 PM",
  },
  {
    name: "Airport Location",
    address: "17801 International Blvd",
    city: "Seattle",
    state: "WA",
    zipCode: "98158",
    country: "USA",
    phone: "+1-206-555-0200",
    email: "airport@carrental.com",
    hours: "24/7",
  },
  {
    name: "Northgate Branch",
    address: "456 Northgate Way",
    city: "Seattle",
    state: "WA",
    zipCode: "98125",
    country: "USA",
    phone: "+1-206-555-0300",
    email: "northgate@carrental.com",
    hours: "Mon-Sat: 9:00 AM - 7:00 PM, Sun: 10:00 AM - 4:00 PM",
  },
  {
    name: "Bellevue Center",
    address: "789 Bellevue Square",
    city: "Bellevue",
    state: "WA",
    zipCode: "98004",
    country: "USA",
    phone: "+1-425-555-0400",
    email: "bellevue@carrental.com",
    hours: "Mon-Fri: 8:30 AM - 6:30 PM, Sat-Sun: 9:00 AM - 5:00 PM",
  },
  {
    name: "Tacoma Station",
    address: "321 Commerce Street",
    city: "Tacoma",
    state: "WA",
    zipCode: "98402",
    country: "USA",
    phone: "+1-253-555-0500",
    email: "tacoma@carrental.com",
    hours: "Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 4:00 PM, Sun: Closed",
  },
];

const seedLocations = async () => {
  try {
    await connectDB();
    const locations = await Promise.all(
      sampleLocations.map((location) =>
        Location.findOrCreate({ where: { name: location.name }, defaults: location })
          .then(([record]) => record)
      )
    );
    console.log(
      `✅ Successfully added ${locations.length} locations to the database!`
    );

    locations.forEach((loc) => {
      console.log(`  - ${loc.name} (${loc.city}, ${loc.state})`);
    });

  } catch (error) {
    console.error("Error seeding locations:", error);
    process.exitCode = 1;
  } finally {
    await connectDB.sequelize.close();
  }
};

seedLocations();
