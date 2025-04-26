import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export const Pedido = sequelize.define("Pedido", {
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nome_cliente: {
        type: DataTypes.STRING,
        allowNull: false
    },
    qtde_pessoas: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    mes_previsto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    valor_disp_pagar: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: "pedidos",
    timestamps: true // cria createdAt e updatedAt
});
