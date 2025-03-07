$(".button__criar").on("click", function(){
    $("#section__form").toggleClass("hidden");
})

$(".btnErro").on("click", function(){
    erro()
})

$('[data-formulario]').on("submit", (e) => {
    e.preventDefault();

    if(!e.target.elements["nome"].value || !e.target.elements["descricao"].value){
        alert("O nome e a descrição não podem estar vazias.")
        
    }else{
        const listaRespostas = {
            "id": 0,
            "name": e.target.elements["nome"].value,
            "description": e.target.elements["descricao"].value
        }
    
        let url = 'http://localhost:5010/api/chores';
        let xhr = new XMLHttpRequest(); 
        xhr.open('POST', url, true); 
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4){
                if(xhr.status != 201){
                    alert("Não foi possível cadastrar, tente novamente")
                }
            }
            buscaAfazeres();
        }
        xhr.send(JSON.stringify(listaRespostas)); 
    
    }
});

window.onload = buscaAfazeres();

function buscaAfazeres(){
    let url = 'http://localhost:5010/api/chores';
    let xhr = new XMLHttpRequest(); 
    xhr.open('GET', url, true); 
    xhr.onreadystatechange = function() { 
        if (xhr.readyState == 4) { 
            if (xhr.status == 200){
                $("#listaAfazeres").empty();
                CriaAfazeres(JSON.parse(xhr.responseText))
            }
        }
    } 
    xhr.send(); 
}

function CriaAfazeres(listaAfazeresJson){

    listaAfazeresJson.forEach(element => {
        const li = document.createElement('li')
        const div1 = document.createElement('div')
        const div2 = document.createElement('div')
        div2.id="div__btn"

        li.classList.add('item__lista')
        li.id = element.id;
        
        const titulo = document.createElement('input')
        titulo.id = "tituloAfazer"
        titulo.value = element.name;
        titulo.classList.add("title")
        
        const descricao = document.createElement('input')
        descricao.value = element.description;
        descricao.id = "descricaoAfazer"
        descricao.classList.add("text")

        const btnDeletar = document.createElement('button')
        btnDeletar.id = "btnDeletar"
        btnDeletar.textContent = "Excluir";
        btnDeletar.classList.add('btnExcluir');
        btnDeletar.onclick = () =>{
            excluiAfazer(element.id)
        };
        div2.append(btnDeletar)

        const btnAtualizar = document.createElement('button')
        btnAtualizar.id = "btnAtualizar"
        btnAtualizar.textContent = "Alterar";
        btnAtualizar.classList.add('btnAlterar');
        btnAtualizar.onclick= () =>{
            permiteEdicao(element);
        }
        div2.append(btnAtualizar)

        const btnSalvar = document.createElement('button')
        btnSalvar.id = "btnSalvar"
        btnSalvar.textContent = "Salvar";
        btnSalvar.classList.add('hidden');
        btnSalvar.onclick= () =>{
           atualizaAfazer(element)
        }
        div2.append(btnSalvar);
        
        div1.append(titulo);
        div1.append(descricao);

        li.append(div1);
        li.append(div2);

        $("#listaAfazeres").append(li);
    });
}

function excluiAfazer(id){
    console.log(`http://localhost:5010/api/chores/${id}`)
    $.ajax({
        url: `http://localhost:5010/api/chores/${id}`,
        type: 'DELETE',
        success: () => {
            alert("Excluido com sucesso!")
            buscaAfazeres();
        },
        error: () => {
            alert("Não foi possível excluir.")
        }
    });
}

function permiteEdicao(afazer){
    $(`#${afazer.id}`).find("#tituloAfazer").removeClass("title").addClass("input__text");
    $(`#${afazer.id}`).find("#descricaoAfazer").removeClass("text").addClass("input__text");
    $(`#${afazer.id}`).find("#btnDeletar").addClass("hidden")
    $(`#${afazer.id}`).find("#btnAtualizar").addClass("hidden")
    $(`#${afazer.id}`).find("#btnSalvar").removeClass("hidden").addClass("btnAlterar")

}

function atualizaAfazer(afazer){
    const aFazerAtualizado = {
        "id": afazer.id,
        "name": $(`#${afazer.id}`).find("#tituloAfazer").val(),
        "description": $(`#${afazer.id}`).find("#descricaoAfazer").val()
    }

    $.ajax({
        url: `http://localhost:5010/api/chores/${afazer.id}`,
        type: 'PUT',
        data: JSON.stringify(aFazerAtualizado),
        contentType: "application/json; charset=utf-8",
        success: () => {
            alert("Atualizado com sucesso!")
            buscaAfazeres();
        },
        error: () => {
            alert("Não foi possível atualizar.")
        }
    });
}

function erro(){
    $.ajax({
        type: "GET", 
        url: "http://localhost:5010/api/chores/erro",
        success: function () {
            alert("Busca feita com sucesso!")
        },
        error: function (request, status, error) {
            alert(`Erro ao fazer a busca. Mensagem de erro: ${error}`);
        }
    });
}
