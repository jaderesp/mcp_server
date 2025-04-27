// src/server.ts
import express, { Request, Response } from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import chalk from "chalk";
import { z } from "zod";
import axios from "axios";

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebSocketServerTransport } from "./mcp/WebSocketServerTransport";


import pedidosRouter from "./routes/Pedidos"; // Agora é um router Express separado!
import { Socket } from "dgram";

// ------------------------------------------------
// Criar o app Express normalmente
// ------------------------------------------------
const app = express();
app.use(express.json());

// Usar suas rotas de pedidos (CRUD)
app.use("/api/pedidos", pedidosRouter);

// ------------------------------------------------
// Criar HTTP Server para usar com WebSocket
// ------------------------------------------------
const httpServer = createServer(app);

// ------------------------------------------------
// MCP Server
// ------------------------------------------------
const mcpServer = new McpServer({
    name: "MeuServidorCustom",
    version: "0.1.0"
});

// Tool para somar números
mcpServer.tool("add", { a: z.number(), b: z.number() }, async ({ a, b }) => {
    console.log(chalk.cyan(`📩 Tool chamada: "add" com a=${a}, b=${b}`));
    const resultado = a + b;
    console.log(chalk.green(`📤 Resultado: ${resultado}`));
    return {
        content: [{ type: "text", text: `Resultado da soma: ${resultado}` }]
    };
});

// Tool que chama API externa
mcpServer.tool("buscarUsuario", { userId: z.string() }, async ({ userId }) => {
    console.log(chalk.cyan(`📩 Tool chamada: "buscarUsuario" com userId=${userId}`));
    try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`);
        const user = response.data;
        console.log(chalk.green(`📤 Usuário encontrado: ${user.name}`));
        return {
            content: [{ type: "text", text: `Usuário encontrado: ${user.name}` }]
        };
    } catch (error) {
        console.error(chalk.red(`❌ Erro ao buscar usuário: ${error}`));
        return {
            content: [{ type: "text", text: `Erro ao buscar usuário: ${userId}` }]
        };
    }
});

// Resource de saudação
mcpServer.resource(
    "greeting",
    new ResourceTemplate("greeting://{name}", { list: undefined }),
    async (uri, { name }) => {
        console.log(chalk.yellow(`📩 Resource acessado: "greeting" para nome=${name}`));
        const mensagem = `Olá, ${name}! Seja bem-vindo(a)!`;
        console.log(chalk.green(`📤 Saudação gerada: ${mensagem}`));
        return {
            contents: [{
                uri: uri.href,
                text: mensagem
            }]
        };
    }
);

// ------------------------------------------------
// WebSocket Server para MCP (em /ws)
// ------------------------------------------------
const wss = new WebSocketServer({
    server: httpServer,
    path: "/ws"
});

wss.on("connection", (socket: WebSocket) => {
    console.log(chalk.blue("🔵 Nova conexão WebSocket MCP recebida."));
    const transport: any = new WebSocketServerTransport(socket);
    mcpServer.connect(transport);
});

// ------------------------------------------------
// Rota principal só para teste
// ------------------------------------------------
app.get("/", (req: Request, res: Response) => {
    console.log(chalk.magenta("🌐 Requisição recebida na rota '/'"));
    res.send("Servidor HTTP rodando. Use WebSocket para acessar MCP.");
});

// ------------------------------------------------
// Start do servidor
// ------------------------------------------------
const PORT = 3000;

httpServer.listen(PORT, () => {
    console.log(chalk.green(`🟢 HTTP Server ouvindo em http://localhost:${PORT}`));
    console.log(chalk.green(`🔵 WebSocket MCP Server ouvindo em ws://localhost:${PORT}/ws`));
});
