const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');


const app = express();
const PORT = 3000;

// Middleware para tratar requisições JSON
app.use(bodyParser.json());

// Habilitar CORS
app.use(cors());
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

// Carregar dados dos planos
const getPlans = () => {
    const dataPath = path.join(__dirname, 'data', 'plans.json');
    if (fs.existsSync(dataPath)) {
        const plansData = fs.readFileSync(dataPath);
        return JSON.parse(plansData);
    }
    return [];
};

// Salvar dados dos planos
const savePlans = (plans) => {
    const dataPath = path.join(__dirname, 'data', 'plans.json');
    fs.writeFileSync(dataPath, JSON.stringify(plans, null, 2));
};

// Rota para login
app.post('/login', authenticate, (req, res) => {
    console.log(req.body); // Para debug
    res.json({ message: 'Login bem-sucedido' });
});

// Rota para listar planos
app.get('/admin/plans', (req, res) => {
    const plans = getPlans();
    res.json(plans);
});

// Rota para adicionar um novo plano
app.post('/admin/plans', authenticate, (req, res) => {
    const newPlan = req.body;
    let plans = getPlans();

    // Verificar se o plano já existe pelo ID
    const planExists = plans.find(plan => plan.id === newPlan.id);
    if (planExists) {
        return res.status(400).json({ message: 'Plano com este ID já existe' });
    }

    // Adiciona o novo plano
    plans.push(newPlan);
    savePlans(plans);
    res.json({ message: 'Plano cadastrado com sucesso', plans });
});

// Rota para editar um plano
app.put('/admin/plans/:id', authenticate, (req, res) => {
    const { id } = req.params;
    const updatedPlan = req.body;
    let plans = getPlans();

    const planIndex = plans.findIndex((plan) => plan.id === parseInt(id));
    if (planIndex !== -1) {
        plans[planIndex] = { ...plans[planIndex], ...updatedPlan };
        savePlans(plans);
        res.json({ message: 'Plano atualizado com sucesso', plans });
    } else {
        res.status(404).json({ message: 'Plano não encontrado' });
    }
});

// Iniciando o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
