import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"; // continua usando Stdio
import { z } from "zod";
import axios from "axios";
import chalk from "chalk";
import express from "express"; // novo import
import { Request, Response } from "express"; // faltava isso!

const server = new McpServer({
    name: "MeuServidorCustom",
    version: "0.1.0"
});

// Tool para somar números
server.tool("add", { a: z.number(), b: z.number() }, async ({ a, b }) => {
    console.log(chalk.cyan(`📩 Tool chamada: "add" com a=${a}, b=${b}`));
    const resultado = a + b;
    console.log(chalk.green(`📤 Resultado: ${resultado}`));
    return {
        content: [{ type: "text", text: `Resultado da soma: ${resultado}` }]
    };
});

// Tool que chama API externa
server.tool("buscarUsuario", { userId: z.string() }, async ({ userId }) => {
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
server.resource("greeting", new ResourceTemplate("greeting://{name}", { list: undefined }), async (uri, { name }) => {
    console.log(chalk.yellow(`📩 Resource acessado: "greeting" para nome=${name}`));
    const mensagem = `Olá, ${name}! Seja bem-vindo(a)!`;
    console.log(chalk.green(`📤 Saudação gerada: ${mensagem}`));
    return {
        contents: [{
            uri: uri.href,
            text: mensagem
        }]
    };
});

(async () => {
    console.log(chalk.blue("\n🔵 Iniciando servidor MCP..."));

    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.log(chalk.green("🟢 Servidor MCP iniciado (usando Stdio)."));

    // Criar um servidor HTTP Express só para exibir status
    const app = express();
    const port = 3000;

    app.get("/", (req: Request, res: Response) => {
        console.log(chalk.magenta("🌐 Requisição recebida na rota '/' (status HTTP server)"));
        res.send("Servidor MCP está rodando via Stdio! 🚀");
    });

    app.listen(port, () => {
        console.log(chalk.green(`🟢 Servidor HTTP rodando em: http://localhost:${port}`));
    });
})();
