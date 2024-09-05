const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Plan = require('./models/Plan'); // Importando o modelo Plan

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para tratar requisições JSON
app.use(bodyParser.json());

// Habilitar CORS
app.use(cors());

// Usar a variável de ambiente MONGODB_URI no Vercel ou uma URL local para desenvolvimento
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/meubancodedados";

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Conectado ao MongoDB Atlas');
}).catch((error) => {
    console.error('Erro ao conectar ao MongoDB Atlas', error);
});

// Mock de usuário e senha
const USERNAME = 'admin';
const PASSWORD = 'admin123';

// Verificação de login
const authenticate = (req, res, next) => {
    const { username, password } = req.body;
    if (username === USERNAME && password === PASSWORD) {
        next();
    } else {
        res.status(401).json({ message: 'Login inválido' });
    }
};

// Rota para login
app.post('/login', authenticate, (req, res) => {
    res.json({ message: 'Login bem-sucedido' });
});

// Rota para listar planos
app.get('/admin/plans', authenticate, async (req, res) => {
    try {
        const plans = await Plan.find(); // Buscar todos os planos do MongoDB
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar os planos', error });
    }
});

// Rota para adicionar um novo plano
app.post('/admin/plans', authenticate, async (req, res) => {
    const { title, services, price, installments, pixPrice } = req.body;

    // Validação simples
    if (!title || !services || !price || !installments || !pixPrice) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    try {
        const newPlan = new Plan({ title, services, price, installments, pixPrice });
        await newPlan.save(); // Salvando o novo plano no MongoDB
        res.json({ message: 'Plano cadastrado com sucesso', newPlan });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao salvar o plano', error });
    }
});

// Rota para editar um plano
app.put('/admin/plans/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { title, services, price, installments, pixPrice } = req.body;

    try {
        const updatedPlan = await Plan.findByIdAndUpdate(id, { title, services, price, installments, pixPrice }, { new: true });

        if (!updatedPlan) {
            return res.status(404).json({ message: 'Plano não encontrado' });
        }

        res.json({ message: 'Plano atualizado com sucesso', updatedPlan });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar o plano', error });
    }
});

// Inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
