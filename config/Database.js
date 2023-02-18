import { Sequelize } from "sequelize";
 
const db = new Sequelize('testdb2', 'testauthuser', 'test', {
    host: "localhost",
    dialect: "postgres"
});
 
export default db;