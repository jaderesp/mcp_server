import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("nome_do_banco", "usuario", "senha", {
    host: "localhost",
    dialect: "mysql",
});
