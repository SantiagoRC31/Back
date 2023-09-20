require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

const sequelize = new Sequelize(
  `postgres://fl0user:d6jfBMVIcmP1@ep-divine-lake-97253838.ap-southeast-1.aws.neon.tech:5432/automovil?sslmode=require`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  }
);
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Product, Category, Reviews, Users, Cart, Brand,UsersGoogle } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);

Category.belongsToMany(Product, {
  through: "Product_Category",
});
Product.belongsTo(Category);

Product.belongsToMany(Cart, { through: "Product_Carts" });
Cart.belongsToMany(Product, { through: "Product_Carts" });

Users.hasMany(Reviews);
Reviews.belongsTo(Users);

UsersGoogle.hasMany(Reviews);
Reviews.belongsTo(Users);

Product.hasMany(Reviews);
Reviews.belongsTo(Product);

Users.hasMany(Cart);
Cart.belongsTo(Users);

UsersGoogle.hasMany(Cart);
Cart.belongsTo(Users);


Brand.belongsToMany(Product, { through: "Product_Brands" });
Product.belongsTo(Brand);


module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
