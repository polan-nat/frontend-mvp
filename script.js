const url = "http://localhost:5000/buscar_usuarios";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("createData");
    const enviarButton = document.getElementById("Enviar");
    const tbody = document.querySelector('#dataList tbody');

    // Função para buscar e exibir usuários
    function fetchAndDisplayUsers() {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar usuários');
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data.data)) {
                    const userData = data.data; // Acessa a lista de usuários dentro da propriedade 'data'
                    tbody.innerHTML = "";

                    userData.forEach(user => {
                        const row = document.createElement('tr');

                        const idCell = document.createElement('td');
                        idCell.textContent = user.id;
                        row.appendChild(idCell);

                        const nomeCell = document.createElement('td');
                        nomeCell.textContent = user.nome;
                        row.appendChild(nomeCell);

                        const sobrenomeCell = document.createElement('td');
                        sobrenomeCell.textContent = user.sobrenome;
                        row.appendChild(sobrenomeCell);

                        const emailCell = document.createElement('td');
                        emailCell.textContent = user.email;
                        row.appendChild(emailCell);

                        // Insere botão de exclusão
                        const deleteButton = document.createElement('button');
                        deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
                        deleteButton.addEventListener('click', () => {
                            const userId = user.id; // Obtém o ID do usuário a partir do objeto 'user'
                            deleteRow(userId);
                        });

                        const actionsCell = document.createElement('td');
                        actionsCell.appendChild(deleteButton);
                        row.appendChild(actionsCell);

                        tbody.appendChild(row);
                    });
                } else {
                    throw new Error('Os dados retornados não estão em um formato esperado');
                }
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    }

    // Função para enviar dados do formulário e adicionar novo usuário
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const nome = document.getElementById("nome").value;
        const sobrenome = document.getElementById("sobrenome").value;
        const email = document.getElementById("email").value;

        const formData = {
            nome: nome,
            sobrenome: sobrenome,
            email: email
        };

        fetch("http://localhost:5000/cadastrar_usuario", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao adicionar usuário');
                }
                return response.json();
            })
            .then(data => {
                console.log('Resposta do servidor:', data);
                fetchAndDisplayUsers(); // A tabela é atualizada após adicionar usuário
                location.reload(); // Recarrega a página
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    });

    // Função para excluir um usuário
    function deleteRow(userId) {
        fetch(`http://localhost:5000/deletar_usuario/${userId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao deletar usuário');
                }
                return response.json();
            })
            .then(data => {
                console.log('Resposta do servidor:', data);
                fetchAndDisplayUsers(); // A tabela é atualizada após a exclusão
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    }

    // Inicializa a exibição de usuários ao carregar a página
    fetchAndDisplayUsers();
});
