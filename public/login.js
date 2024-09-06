document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Verificação de login mockado (admin/admin)
    if (username === 'Casa Cerimonial' && password === 'admin@123') {
        // Login bem-sucedido, redireciona para a página de administração
        window.location.href = 'home.html';
    } else {
        // Exibe mensagem de erro
        document.getElementById('errorMessage').style.display = 'block';
    }
});
