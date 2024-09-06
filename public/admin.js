document.getElementById('planForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const services = document.getElementById('services').value.split(',').map(service => service.trim());
    const price = document.getElementById('price').value;
    const installments = document.getElementById('installments').value;
    const pixPrice = document.getElementById('pixPrice').value;

    const newPlan = { title, services, price, installments, pixPrice };

    try {
        const response = await fetch('https://casa-cerimonial-back-end.vercel.app/admin/plans', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPlan)
        });

        if (response.ok) {
            alert('Plano cadastrado com sucesso!');
            document.getElementById('planForm').reset();
            fetchPlans();
        } else {
            alert('Erro ao cadastrar o plano');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
});

// Função para buscar e exibir os planos cadastrados
async function fetchPlans() {
    const response = await fetch('https://casa-cerimonial-back-end.vercel.app/admin/plans');
    const plans = await response.json();

    const plansList = document.getElementById('plansList');
    plansList.innerHTML = ''; // Limpa os planos anteriores

    plans.forEach(plan => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = `${plan.title} - R$${plan.price}`;
        plansList.appendChild(li);
    });
}

// Carrega os planos ao carregar a página
window.onload = fetchPlans;
