const trainerCredentials = { username: "treinador", password: "1234" };
let pacientes = [];
let currentPaciente = null;
let selectedArea = null;

function escolherArea(area) {
    selectedArea = area;
    document.getElementById("inicio").classList.add("hidden");
    document.getElementById("login").classList.remove("hidden");

    const titulo = document.getElementById("login-titulo");
    if (area === "aluno") {
        titulo.textContent = "Login - Área do Aluno";
        document.body.style.backgroundColor = "#e8f5e9"; // Verde claro
    } else if (area === "personal") {
        titulo.textContent = "Login - Área do Personal";
        document.body.style.backgroundColor = "#e3f2fd"; // Azul claro
    }
}

function voltarAoInicio() {
    selectedArea = null;
    document.getElementById("login").classList.add("hidden");
    document.getElementById("inicio").classList.remove("hidden");
    document.body.style.backgroundColor = "#f4f4f9"; // Cor padrão
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
}

function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Por favor, preencha o nome e a senha.");
        return;
    }

    if (selectedArea === "personal" && username === trainerCredentials.username) {
        if (password === trainerCredentials.password) {
            document.getElementById("login").classList.add("hidden");
            document.getElementById("treinador-area").classList.remove("hidden");
            atualizarPacientesList();
        } else {
            alert("Senha incorreta para o personal.");
        }
    } else if (selectedArea === "aluno") {
        currentPaciente = username;
        let pacienteExistente = pacientes.find(p => p.nome === username);

        if (!pacienteExistente) {
            pacienteExistente = { nome: username, respostas: {}, treino: "" };
            pacientes.push(pacienteExistente);
        }

        document.getElementById("login").classList.add("hidden");
        document.getElementById("paciente-area").classList.remove("hidden");
        exibirTreinoParaPaciente();
    } else {
        alert("Credenciais inválidas.");
    }
}

function voltarAoLogin() {
    currentPaciente = null;
    document.getElementById("paciente-area").classList.add("hidden");
    document.getElementById("treinador-area").classList.add("hidden");
    document.getElementById("login").classList.remove("hidden");
}

function submitPaciente() {
    const respostas = {};
    const inputs = document.querySelectorAll("#paciente-form input:checked");
    inputs.forEach(input => {
        respostas[input.name] = input.value;
    });

    const paciente = pacientes.find(p => p.nome === currentPaciente);
    if (paciente) {
        paciente.respostas = respostas;
        alert("Respostas enviadas com sucesso!");
    }
}

function atualizarPacientesList() {
    const select = document.getElementById("paciente-selecao");
    select.innerHTML = '<option value="">Selecione um paciente</option>';
    pacientes.forEach(p => {
        const option = document.createElement("option");
        option.value = p.nome;
        option.textContent = p.nome;
        select.appendChild(option);
    });

    // Atualiza a área de respostas quando muda a lista
    exibirRespostasPaciente("");
}

function exibirRespostasPaciente(nomePaciente) {
    const respostasDiv = document.getElementById("respostas-paciente");
    const paciente = pacientes.find(p => p.nome === nomePaciente);

    if (paciente && Object.keys(paciente.respostas).length > 0) {
        let respostasHTML = "<h3>Respostas do Paciente:</h3><ul>";
        for (const [pergunta, resposta] of Object.entries(paciente.respostas)) {
            respostasHTML += `<li><strong>${pergunta}:</strong> ${resposta}</li>`;
        }
        respostasHTML += "</ul>";
        respostasDiv.innerHTML = respostasHTML;
    } else {
        respostasDiv.innerHTML = "<p>Selecione um paciente para ver as respostas.</p>";
    }
}

function enviarTreino() {
    const nomePaciente = document.getElementById("paciente-selecao").value;
    const textoTreino = document.getElementById("treino-texto").value.trim();

    if (!nomePaciente || !textoTreino) {
        alert("Por favor, selecione um paciente e insira o treino.");
        return;
    }

    const paciente = pacientes.find(p => p.nome === nomePaciente);
    if (paciente) {
        paciente.treino = textoTreino;
        alert(`Treino enviado com sucesso para ${nomePaciente}!`);
    }
}

function exibirTreinoParaPaciente() {
    const paciente = pacientes.find(p => p.nome === currentPaciente);
    const treinoArea = document.getElementById("treino-texto-paciente");

    if (paciente && paciente.treino) {
        treinoArea.textContent = paciente.treino;
    } else {
        treinoArea.textContent = "Ainda não foi enviado um treino para você.";
    }
}

document.getElementById("paciente-selecao").addEventListener("change", function () {
    exibirRespostasPaciente(this.value);
});
function exportarRespostasPDF(nomePaciente) {
    const { jsPDF } = window.jspdf;
    const paciente = pacientes.find(p => p.nome === nomePaciente);

    if (!paciente || Object.keys(paciente.respostas).length === 0) {
        alert("Nenhuma resposta disponível para exportação.");
        return;
    }

    const pdf = new jsPDF();
    pdf.setFontSize(14);
    pdf.text(`Respostas do Paciente: ${nomePaciente}`, 10, 10);

    let y = 20;
    for (const [pergunta, resposta] of Object.entries(paciente.respostas)) {
        pdf.text(`${pergunta}: ${resposta}`, 10, y);
        y += 10;
        if (y > 280) { // Se ultrapassar o limite da página
            pdf.addPage();
            y = 10;
        }
    }

    pdf.save(`Respostas_${nomePaciente}.pdf`);
}

function enviarTreino() {
    const nomePaciente = document.getElementById("paciente-selecao").value;
    const textoTreino = document.getElementById("treino-texto").value.trim();

    if (!nomePaciente || !textoTreino) {
        alert("Por favor, selecione um paciente e insira o treino.");
        return;
    }

    const paciente = pacientes.find(p => p.nome === nomePaciente);
    if (paciente) {
        paciente.treino = textoTreino;

        // Gerar o PDF do treino
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        pdf.setFontSize(14);
        pdf.text(`Treino para: ${nomePaciente}`, 10, 10);
        pdf.setFontSize(12);
        const linhas = pdf.splitTextToSize(textoTreino, 180); // Quebra o texto em linhas
        pdf.text(linhas, 10, 20);

        // Salvar o PDF para download
        const nomeArquivo = `Treino_${nomePaciente}.pdf`;
        pdf.save(nomeArquivo);

        alert(`Treino enviado com sucesso para ${nomePaciente}!`);
    }
}

function exibirTreinoParaPaciente() {
    const paciente = pacientes.find(p => p.nome === currentPaciente);
    const treinoArea = document.getElementById("treino-texto-paciente");

    if (paciente && paciente.treino) {
        treinoArea.innerHTML = `
            <p>Treino disponível:</p>
            <a href="#" onclick="baixarTreinoPDF('${paciente.nome}')">Clique aqui para baixar o treino em PDF</a>
        `;
    } else {
        treinoArea.textContent = "Ainda não foi enviado um treino para você.";
    }
}

function baixarTreinoPDF(nomePaciente) {
    const { jsPDF } = window.jspdf;
    const paciente = pacientes.find(p => p.nome === nomePaciente);

    if (paciente && paciente.treino) {
        const pdf = new jsPDF();
        pdf.setFontSize(14);
        pdf.text(`Treino para: ${nomePaciente}`, 10, 10);
        pdf.setFontSize(12);
        const linhas = pdf.splitTextToSize(paciente.treino, 180);
        pdf.text(linhas, 10, 20);

        pdf.save(`Treino_${nomePaciente}.pdf`);
    } else {
        alert("Nenhum treino disponível para exportação.");
    }
}
