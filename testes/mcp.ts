import { spawn } from 'child_process';

// Inicia o servidor MCP
const server = spawn('node', ['dist/src/app.js']); // seu servidor MCP

// Mostra o que o servidor MCP responder
server.stdout.on('data', (data) => {
    console.log(`📥 Resposta do MCP: ${data}`);
});

server.stderr.on('data', (data) => {
    console.error(`❌ Erro no MCP: ${data}`);
});

// Espera 2 segundos pra garantir que o servidor MCP iniciou
setTimeout(() => {
    // Prepara uma mensagem MCP de teste
    const mensagemMCP = {
        tool: "add",
        input: { a: 10, b: 5 }
    };

    console.log("🚀 Enviando mensagem MCP...");

    // Envia para o servidor
    server.stdin.write(JSON.stringify(mensagemMCP) + "\n");

}, 2000);
