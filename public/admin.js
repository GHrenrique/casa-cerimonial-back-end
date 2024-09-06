document.getElementById('planForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const planId = document.getElementById('planId').value; 
    const title = document.getElementById('title').value;
    const services = document.getElementById('services').value.split(',').map(service => service.trim());
    const price = document.getElementById('price').value;
    const installments = document.getElementById('installments').value;
    const pixPrice = document.getElementById('pixPrice').value;

    const newPlan = { title, services, price, installments, pixPrice };

    try {
        let response;

        if (planId) {
           
            response = await fetch(`https://casa-cerimonial-back-end.vercel.app/admin/plans/${planId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPlan)
            });
        } else {
        
            response = await fetch('https://casa-cerimonial-back-end.vercel.app/admin/plans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPlan)
            });
        }

        if (response.ok) {
            alert('Plano salvo com sucesso!');
            document.getElementById('planForm').reset();
            document.getElementById('planId').value = '';
            fetchPlans();
        } else {
            alert('Erro ao salvar o plano');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
});


async function fetchPlans() {
    const response = await fetch('https://casa-cerimonial-back-end.vercel.app/admin/plans');
    const plans = await response.json();

    const plansList = document.getElementById('plansList');
    plansList.innerHTML = ''; // Limpa os planos anteriores

    plans.forEach(plan => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        li.innerHTML = `
        ${plan.title} - R$${plan.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        <div>
            <button class="btn btn-warning btn-sm me-2" onclick="editPlan('${plan._id}')">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="deletePlan('${plan._id}')">Deletar</button>
        </div>
    `;

        plansList.appendChild(li);
    });
}

// Função para editar um plano
async function editPlan(planId) {
    const response = await fetch(`https://casa-cerimonial-back-end.vercel.app/admin/plans/${planId}`);
    const plan = await response.json();

    // Preenche o formulário com os dados do plano para editar
    document.getElementById('planId').value = planId;
    document.getElementById('title').value = plan.title;
    document.getElementById('services').value = plan.services.join(', ');
    document.getElementById('price').value = plan.price;
    document.getElementById('installments').value = plan.installments;
    document.getElementById('pixPrice').value = plan.pixPrice;
}

// Função para deletar um plano
async function deletePlan(planId) {
    const confirmDelete = confirm('Tem certeza que deseja deletar este plano?');

    if (confirmDelete) {
        try {
            const response = await fetch(`https://casa-cerimonial-back-end.vercel.app/admin/plans/${planId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Plano deletado com sucesso!');
                fetchPlans(); // Atualiza a lista de planos
            } else {
                alert('Erro ao deletar o plano');
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    }
}

document.getElementById('pixPrice').addEventListener('input', function(e) {
    var value = e.target.value.replace(/\D/g, ''); // Remove qualquer caractere que não seja número
    value = (value / 100).toFixed(2); // Converte o valor para número com 2 casas decimais
    value = value.replace(".", ","); // Troca o ponto decimal por vírgula
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Adiciona pontos como separador de milhar
    e.target.value = value;
});


// Carrega os planos ao carregar a página
window.onload = fetchPlans;
