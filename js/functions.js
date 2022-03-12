//ready
document.addEventListener("DOMContentLoaded", function (e) {

    //botão do menu
    document.querySelector(`#toggle-menu`).addEventListener("click", function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        document.querySelector(`#sidenav`).classList.toggle("active");
        this.classList.toggle("active");

        let overlay = document.querySelector(`#overlay`);

        overlay.classList.toggle("active");

    });
    document.querySelector(`#overlay`).addEventListener("click", function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        document.querySelector(`#sidenav`).classList.toggle("active");
        document.querySelector(`#toggle-menu`).classList.toggle("active");

        this.classList.toggle("active");

    });




});
var modalEl = document.querySelector(`#modal`);
var modal = new bootstrap.Modal(modalEl);


/* function fadeIn(el, time, display, opacity){
    let transition = time / 10;

    el.style.transition = `${transition}s ease-in-out ${transition}s`;

    el.style.display = display;

    el.style.opacity = opacity;

}

function fadeOut(el, time){
    let transition = time / 10;

    el.style.transition = `${transition}s ease-in-out ${transition}s`;
    
    el.style.opacity = 0;
    
    el.style.display = "none";

} */

let retTodos
let result

let json = [];

async function buscarPokemonsAPI() {

    let cont = 0
    let falhas = 0
    let contGeral = 0

    retTodos = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1126`);

    if (retTodos.ok) {

        modal.show();
        let total = document.querySelector(`.modal-body #total`)
        let concluido = document.querySelector(`.modal-body #concluido`)
        let falha = document.querySelector(`.modal-body #falha`)
        let atual = document.querySelector(`.modal-body #atual`)
        let progressBar = document.querySelector(`.modal-body .progress-bar`)

        
        result = await retTodos.json()
        let totalReq = parseInt(result.results.length) 

        progressBar.setAttribute(`aria-valuemax`, result.results.length)
        total.innerHTML = result.results.length

        //console.log(result)
        for (pkmn of result.results) {
            let retPkmn = await fetch(`${pkmn.url}`);

            if (retPkmn.ok) {

                cont++

                concluido.innerHTML = cont

                let resultPkmn = await retPkmn.json();
                //console.log(resultPkmn);

                let tipo = resultPkmn.types[0].type.name + (resultPkmn.types.length > 1 ? ` - ${resultPkmn.types[1].type.name}` : '');

                json.push({
                    pekedex: resultPkmn.id,
                    name: resultPkmn.name,
                    sprite: resultPkmn.sprites.front_default,
                    type: tipo,

                });
            } else {

                falhas++

                falha.innerHTML = falhas

            }

            contGeral++;

            atual.innerHTML = contGeral;

            progressBar.setAttribute(`aria-valuenow`, contGeral)
            let width = ( (contGeral * 100) / totalReq)
            progressBar.style.width = `${width}%`

            if(contGeral > 75){

                break;
            }

        }
        console.log(json);

        let retSalvar = await fetch(`http://localhost:4001/salvar-pokemons`, {
            method: 'POST',
            body: JSON.stringify(json),
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            }
        })
        console.log(retSalvar.json());
    } else {
        Swal.fire({
            title: 'Não deu :(',
            text: 'Falhou na busca da lista',
            status: 'error'
        })
    }
}