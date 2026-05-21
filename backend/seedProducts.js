const mongoose = require("mongoose");

const Product = require("./models/Product");

mongoose.connect(
  "mongodb://dharsini1210_db_user:admin123@ac-27wgvqf-shard-00-00.a6xdslr.mongodb.net:27017,ac-27wgvqf-shard-00-01.a6xdslr.mongodb.net:27017,ac-27wgvqf-shard-00-02.a6xdslr.mongodb.net:27017/?ssl=true&replicaSet=atlas-p04cfk-shard-0&authSource=admin&appName=priyadharsini"
);

const products = [

  {
    name: "Front Load Washing Machine",
    image:
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1",

    category: "Appliances",

    pricePerMonth: 2500,

    deposit: 3000,

    stock: 5,

    available: true,

    description:
      "Premium front load washing machine with smart inverter technology.",
  },

  {
    name: "Smart LED TV 43 inch",

    image:
      "https://images.unsplash.com/photo-1593784991095-a205069470b6",

    category: "Electronics",

    pricePerMonth: 2200,

    deposit: 2500,

    stock: 6,

    available: true,

    description:
      "Full HD Smart Android LED TV with OTT support.",
  },

  {
    name: "Double Door Refrigerator",

    image:
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30",

    category: "Appliances",

    pricePerMonth: 2800,

    deposit: 3500,

    stock: 4,

    available: true,

    description:
      "Energy efficient double door refrigerator.",
  },

  {
    name: "Wooden Study Table",

    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",

    category: "Furniture",

    pricePerMonth: 1200,

    deposit: 1500,

    stock: 10,

    available: true,

    description:
      "Modern wooden study table perfect for home office.",
  },

];

const seedData = async () => {

  try {

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log("Products Added Successfully ✅");

    process.exit();

  } catch (error) {

    console.log(error);

    process.exit(1);
  }
};

seedData();