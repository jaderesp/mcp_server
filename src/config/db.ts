import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("mcp_dev", "watszap", "adm192*#1", {
    host: "localhost",
    dialect: "mysql",
});
