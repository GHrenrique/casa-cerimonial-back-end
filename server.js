const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const Plan = require('./models/Plan'); // Importando o modelo Plan

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para tratar requisições JSON
app.use(bodyParser.json());

// Habilitar CORS
app.use(cors());

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

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

// Rota para listar planos (sem autenticação)
app.get('/admin/plans', async (req, res) => {
    try {
        const plans = await Plan.find(); // Buscar todos os planos do MongoDB
        if (!plans.length) {
            return res.status(404).json({ message: 'Nenhum plano encontrado' });
        }
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar os planos', error });
    }
});

// Rota para buscar um plano específico pelo ID (sem autenticação)
app.get('/admin/plans/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const plan = await Plan.findById(id); // Busca o plano pelo ID
        if (!plan) {
            return res.status(404).json({ message: 'Plano não encontrado' });
        }
        res.json(plan);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar o plano', error });
    }
});

// Rota para adicionar um novo plano (sem autenticação)
app.post('/admin/plans', async (req, res) => {
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

// Rota para editar um plano (sem autenticação)
app.put('/admin/plans/:id', async (req, res) => {
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

// Rota para deletar um plano pelo ID (sem autenticação)
app.delete('/admin/plans/:id', async (req, res) => {
    const { id } = req.params;  // Pegando o ID do plano a ser deletado

    try {
        const deletedPlan = await Plan.findByIdAndDelete(id);  // Deleta o plano pelo ID

        if (!deletedPlan) {
            return res.status(404).json({ message: 'Plano não encontrado' });
        }

        res.json({ message: 'Plano deletado com sucesso', deletedPlan });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar o plano', error });
    }
});

// Rota para deletar todos os planos
app.delete('/admin/plans', async (req, res) => {
    try {
        await Plan.deleteMany(); // Deleta todos os documentos da coleção de planos
        res.json({ message: 'Todos os planos foram deletados' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar os planos', error });
    }
});

// Inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
