var linhas = 10;
var colunas = 10;
var tabuleiro = [];
var quadradoColoridoS = true; 
var quadradoColoridoG = true; 
var quadradoS = null;
var quadradoG = null;

window.onload = function () {
    gerartabuleiro();
    preencherQuadradosAleatoriamente();
    encontrarQuadradosSG();
    document.getElementById("restartButton").addEventListener("click", reiniciarJogo);
    document.querySelectorAll("button")[2].addEventListener("click", definirS);
    document.querySelectorAll("button")[3].addEventListener("click", definirG);
}

function gerartabuleiro() {
    for (let li = 0; li < linhas; li++) {
        var linha = [];
        for (let ci = 0; ci < colunas; ci++) {
            var quad = document.createElement("div");
            quad.id = li.toString() + "-" + ci.toString();
            document.getElementById("tabuleiro").append(quad);
            linha.push(quad);
        }
        tabuleiro.push(linha);
    }


    tabuleiro[9][2].classList.add("quadselectstart");
    tabuleiro[9][2].innerText = "S";
    tabuleiro[3][0].classList.add("quadselectgoal");
    tabuleiro[3][0].innerText = "G";

    tabuleiro[4][0].classList.add("barreira");
    tabuleiro[4][1].classList.add("barreira");
    tabuleiro[4][2].classList.add("barreira");
    tabuleiro[4][3].classList.add("barreira");
    tabuleiro[4][4].classList.add("barreira");
    tabuleiro[4][5].classList.add("barreira");
    tabuleiro[4][6].classList.add("barreira");
    tabuleiro[3][6].classList.add("barreira");
    tabuleiro[2][6].classList.add("barreira");
    tabuleiro[9][1].classList.add("barreira");
    tabuleiro[8][1].classList.add("barreira");
    tabuleiro[7][1].classList.add("barreira");
    tabuleiro[7][2].classList.add("barreira");
    tabuleiro[7][3].classList.add("barreira");
    tabuleiro[7][4].classList.add("barreira");
    tabuleiro[7][5].classList.add("barreira");

}

function preencherQuadradosAleatoriamente() {
    for (let li = 0; li < linhas; li++) {
        for (let ci = 0; ci < colunas; ci++) {
            var quad = tabuleiro[li][ci];
            if (!quad.classList.contains("quadselectstart") && !quad.classList.contains("quadselectgoal")) {
                var numeroAleatorio = Math.floor(Math.random() * 5) + 1;
                quad.innerText = numeroAleatorio;
            }
        }
    }
}

function calcularMelhorCaminho() {
    if (!quadradoColoridoS || !quadradoColoridoG || !quadradoS || !quadradoG) {
        alert("Por favor, defina os quadrados 'S' e 'G' antes de calcular o caminho.");
        return;
    }

    var goalNode = quadradoG;

    function heuristic(node, goal) {
        var x1 = node
        var y1 = node
        var x2 = goal
        var y2 = goal
        return (Math.abs(x1 - x2) + Math.abs(y1 - y2));
    }

    var startNode = quadradoS;
    var goalNode = quadradoG;
    var openSet = [startNode];
    var closedSet = [];
    var cameFrom = {};
    var gScore = {};
    var fScore = {};

    gScore[startNode.id] = 0;
    fScore[startNode.id] = heuristic(startNode, goalNode);

    while (openSet.length > 0) {
        var current = openSet[0];
        for (var i = 1; i < openSet.length; i++) {
            if (fScore[openSet[i].id] < fScore[current.id]) {
                current = openSet[i];
            }
        }
        if (current === goalNode) {

            var path = [];
            var node = goalNode;
            while (node !== startNode) {
                path.push(node);
                node = cameFrom[node.id];
            }
            path.push(startNode);
            path.reverse();

            var soma = 0;
            for (var i = 0; i < path.length; i++) {
                var numero = parseInt(path[i].innerText);
                if (!isNaN(numero)) {
                    soma += numero;
                    console.log("Coordenadas: " + path[i].id + ", Número: " + numero);

                    path[i].classList.add("caminho");
                }
            }

            console.log("Soma dos números ao longo do caminho: " + soma);
            var valorSomaElement = document.getElementById("valorSoma");
            valorSomaElement.innerText = "Custo do caminho: " + soma;
            return;
        }

        openSet.splice(openSet.indexOf(current), 1);
        closedSet.push(current);

        var neighbors = getNeighbors(current);
        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];

            if (closedSet.includes(neighbor)) {
                continue;
            }

            var tentative_gScore = gScore[current.id] + parseInt(neighbor.innerText);

            if (!openSet.includes(neighbor)) {
                openSet.push(neighbor);
            } else if (tentative_gScore >= gScore[neighbor.id]) {
                continue;
            }

            cameFrom[neighbor.id] = current;
            gScore[neighbor.id] = tentative_gScore;
            fScore[neighbor.id] = gScore[neighbor.id] + heuristic(neighbor, goalNode);

            if (neighbor === goalNode) {
                openSet = [goalNode];
            }
        }
    }

    alert("Não foi possível encontrar um caminho válido.");
}

function getNeighbors(node) {
    var neighbors = [];
    var x = parseInt(node.id.split("-")[1]);
    var y = parseInt(node.id.split("-")[0]);

    var neighborCoords = [
        { x: x, y: y - 1 },
        { x: x, y: y + 1 },
        { x: x - 1, y: y },
        { x: x + 1, y: y }
    ];

    var goalNeighbor = null;
    for (var i = 0; i < neighborCoords.length; i++) {
        var coord = neighborCoords[i];
        var neighborX = coord.x;
        var neighborY = coord.y;

        if (neighborX >= 0 && neighborX < colunas && neighborY >= 0 && neighborY < linhas) {
            var neighbor = tabuleiro[neighborY][neighborX];

            if (neighbor.innerText === "G") {
                goalNeighbor = neighbor;
            } else if (!neighbor.classList.contains("barreira")) {
                neighbors.push(neighbor);
            }
        }
    }

    if (goalNeighbor !== null) {
        neighbors.unshift(goalNeighbor);
    }

    return neighbors;
}

function encontrarQuadradosSG() {
    for (let li = 0; li < linhas; li++) {
        for (let ci = 0; ci < colunas; ci++) {
            var quad = tabuleiro[li][ci];
            if (quad.innerText === "S") {
                quadradoS = quad;
            }if (quad.innerText === "G") {
                quadradoG = quad;
            }
        }
    }
}

function limparCoresDosQuadrados() {
    for (let li = 0; li < linhas; li++) {
        for (let ci = 0; ci < colunas; ci++) {
            var quad = tabuleiro[li][ci];
            quad.classList.remove("caminho")
        }
    }
}

function definirS() {
    limparCoresDosQuadrados();

    var coordenadas = prompt("Insira as coordenadas para 'S' no formato linha-coluna (por exemplo, 2-3):");
    if (!coordenadas) return;

    var coordenadasArray = coordenadas.split("-");
    var linhaS = parseInt(coordenadasArray[0]);
    var colunaS = parseInt(coordenadasArray[1]);
    var quadradoSelecionado = tabuleiro[linhaS][colunaS];

    if (quadradoG === quadradoSelecionado) {
        alert("Não é possível definir 'S' no mesmo quadrado que 'G'.");
        return;
    }

    if (quadradoSelecionado.classList.contains("barreira")) {
        alert("Você não pode escolher uma parede como posição de 'S'.");
        return;
    }

    if (quadradoS) {
        quadradoS.classList.remove("quadselectstart");
        quadradoS.innerText = Math.floor(Math.random() * 6) + 1; // Novo número aleatório
    }

    quadradoS = quadradoSelecionado;

    quadradoS.classList.add("quadselectstart");
    quadradoS.innerText = "S";
}

function definirG() {
    limparCoresDosQuadrados();
    var coordenadas = prompt("Insira as coordenadas para 'G' no formato linha-coluna (por exemplo, 5-7):");
    if (!coordenadas) return;

    var coordenadasArray = coordenadas.split("-");
    var linhaG = parseInt(coordenadasArray[0]);
    var colunaG = parseInt(coordenadasArray[1]);
    var quadradoSelecionado = tabuleiro[linhaG][colunaG];

    if (quadradoS === quadradoSelecionado) {
        alert("Não é possível definir 'G' no mesmo quadrado que 'S'.");
        return;
    }

    if (quadradoSelecionado.classList.contains("barreira")) {
        alert("Você não pode escolher uma parede como posição de 'G'.");
        return;
    }

    if (quadradoG) {
        quadradoG.classList.remove("quadselectgoal");
        quadradoG.innerText = Math.floor(Math.random() * 6) + 1; 
    }

    quadradoG = quadradoSelecionado;
    quadradoG.classList.add("quadselectgoal");
    quadradoG.innerText = "G";
}

function reiniciarJogo() {
    location.href = 'tabuleiro.html'
}

function removerParede() {
    limparCoresDosQuadrados();
    var coordenadas = prompt("Insira as coordenadas do quadrado parede que deseja remover no formato linha-coluna (por exemplo, 4-2):");
    if (!coordenadas) return;

    var coordenadasArray = coordenadas.split("-");
    var linhaParede = parseInt(coordenadasArray[0]);
    var colunaParede = parseInt(coordenadasArray[1]);
    var quadradoSelecionado = tabuleiro[linhaParede][colunaParede];

    if (!quadradoSelecionado.classList.contains("barreira")) {
        alert("O quadrado selecionado não é uma parede.");
        return;
    }

    quadradoSelecionado.classList.remove("barreira");
    quadradoSelecionado.innerText = Math.floor(Math.random() * 6) + 1; 
}

function adicionarParede() {
    limparCoresDosQuadrados();
   
    var coordenadas = prompt("Insira as coordenadas onde deseja adicionar uma parede no formato linha-coluna (por exemplo, 4-2):");
    if (!coordenadas) return; 

    var coordenadasArray = coordenadas.split("-");
    var linhaParede = parseInt(coordenadasArray[0]);
    var colunaParede = parseInt(coordenadasArray[1]);
    var quadradoSelecionado = tabuleiro[linhaParede][colunaParede];

    
    if (quadradoSelecionado === quadradoS || quadradoSelecionado === quadradoG || quadradoSelecionado.classList.contains("barreira")) {
        alert("Não é possível adicionar uma parede neste quadrado.");
        return;
    }

    quadradoSelecionado.classList.add("barreira");
    quadradoSelecionado.innerText = "";
}
