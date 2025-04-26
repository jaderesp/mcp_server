import express, { Request, Response } from "express";
import { Pedido } from "../models/Pedido";

const app = express();
const port = 3000;

app.use(express.json());

// Criar Pedido
app.post("/pedido", async (req: Request, res: Response) => {
  try {
    const pedido = await Pedido.create(req.body);
    res.status(201).json(pedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar pedido." });
  }
});

// Listar Todos Pedidos
app.get("/pedidos", async (req: Request, res: Response) => {
  try {
    const pedidos = await Pedido.findAll();
    res.json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar pedidos." });
  }
});

// Buscar Pedido por ID
app.get("/pedido/:id", async (req: Request, res: Response) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }
    res.json(pedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar pedido." });
  }
});

// Atualizar Pedido
app.put("/pedido/:id", async (req: Request, res: Response) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }
    await pedido.update(req.body);
    res.json(pedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar pedido." });
  }
});

// Deletar Pedido
app.delete("/pedido/:id", async (req: Request, res: Response) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }
    await pedido.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar pedido." });
  }
});

