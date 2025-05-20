const pokelist = document.getElementById('pokemons')
const limit = 151
const maxRecords =  151
let countRecords = 0
const minRecords = 0
let offset = 0

pokelist.addEventListener('click', async (event) => {
    const li = event.target.closest('.pokemon')
    if (!li) return

    const name = li.querySelector('.name').textContent
    const details = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(res => res.json())
    const species = await fetch(details.species.url).then(res => res.json())
    const evolutionChain = await fetch(species.evolution_chain.url).then(res => res.json())

    const evolutions = []
    let evoData = evolutionChain.chain
    do {
        evolutions.push(evoData.species.name)
        evoData = evoData.evolves_to[0]
    } while (evoData && evoData.hasOwnProperty('evolves_to'))

    const moves = details.moves.slice(0, 5).map(m => m.move.name)

    alert(`
    Nome: ${details.name}
    Tipo(s): ${details.types.map(t => t.type.name).join(', ')}
    Evolução: ${evolutions.join(' → ')}
    Melhores ataques: ${moves.join(', ')}
    `)
})
function loadPokemonItens(offset, limit) {

    if (countRecords / maxRecords < 1) {

    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) => `
        <li class="pokemon ${pokemon.type}" id="pokemon">
        <div class="pokeinfo">              
            <span class="name" style="font-weight: bold;">${pokemon.name}</span>
            <span class="number">#${pokemon.number}</span>
            <ol class="types">
                ${pokemon.types.map((type) => `<li class="type">${type}</li>`).join('')}
            </ol>
        </div> 
        <div class="pokeimg">
            <img src="assets/img/pokemons/poke_${pokemon.id}.gif" alt="">
            <img class="imgbackground" src="https://pokemoncalc.web.app/en/assets/pokeball.svg" alt="${pokemon.name}">
        </div>
        
        </li>
        `).join('')
        pokelist.innerHTML += newHtml
        

})}
}

loadPokemonItens(offset, limit)

const selectPokemon = document.querySelector('#pokemons-selection')
const selectHabili1 = document.querySelector('#habili1')
const selectHabili2 = document.querySelector('#habili2')

// Inicializa Select2
$(document).ready(() => {
    $('#pokemons-selection, #habili1, #habili2').select2()
})

pokeApi.getPokemons(0, 151).then(pokemons => {
    pokemons.forEach(pokemon => {
        const option = document.createElement('option')
        option.value = pokemon.name
        option.textContent = pokemon.name
        selectPokemon.appendChild(option)
    })
    console.log("")
    $('#pokemons-selection').on('change', async function () {
        const selectedName = this.value
        const details = await fetch(`https://pokeapi.co/api/v2/pokemon/${selectedName}`).then(res => res.json())

        const abilities = details.abilities.map(a => a.ability.name)

        // Limpa selects
        selectHabili1.innerHTML = ''
        selectHabili2.innerHTML = ''

        // Adiciona habilidades
        abilities.forEach(ability => {
            const opt1 = document.createElement('option')
            const opt2 = document.createElement('option')
            opt1.value = opt2.value = ability
            opt1.textContent = opt2.textContent = ability
            selectHabili1.appendChild(opt1)
            selectHabili2.appendChild(opt2)
        })

        // Atualiza Select2
        $('#habili1, #habili2').select2()
    })

    
})
