const pokeApi = {};

function processNumber(number) {
    if (number >= 0 && number <= 9) {
        return `00${number}`;
    } else if (number >= 10 && number <= 99) {
        return `0${number}`;
    } else {
        return number;
    }
}

function pokedetailTopokemon(pokeDetail) {
    const pokemon = new Pokemon();
    pokemon.id = pokeDetail.id;
    pokemon.number = processNumber(pokeDetail.id);
    pokemon.name = pokeDetail.name;
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;
    pokemon.type = type;
    pokemon.types = types;
    return pokemon;
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(pokedetailTopokemon);
};

pokeApi.getPokemons = (offset = 0, limit = 151) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .catch((error) => {
            console.error("Erro ao buscar lista de Pokémon:", error);
            return [];
        });
};

document.addEventListener('DOMContentLoaded', function() {
    const formCarta = document.getElementById('formCarta');
    const pokemonSelect = document.getElementById('pokemon-carta');
    const categoriaSelect = document.getElementById('categoria-carta');
    const nomeAtaqueInput = document.getElementById('nome-ataque');
    const poderAtaqueInput = document.getElementById('poder-ataque');

    const pokemonNomeCarta = document.getElementById('pokemon-nome-carta');
    const pokemonCategoriaCarta = document.getElementById('pokemon-categoria-carta');
    const pokemonImagemCarta = document.getElementById('pokemon-imagem-carta');
    const ataqueNomeCarta = document.getElementById('ataque-nome-carta');
    const ataquePoderCarta = document.getElementById('ataque-poder-carta');

    const pokemonFileMap = {};
    for (let i = 1; i <= 151; i++) {
        const numberStr = String(i).padStart(3, '0');

    }

    async function populatePokemonSelect() {
        try {
            const pokemonsDetails = await pokeApi.getPokemons();
            if (pokemonsDetails && pokemonsDetails.length > 0) {
                pokemonsDetails.forEach((pokemon, index) => {
                    const option = document.createElement('option');
                    option.value = pokemon.name.toLowerCase();
                    option.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
                    pokemonSelect.appendChild(option);
                    pokemonFileMap[pokemon.name.toLowerCase()] = `poke_${index + 1}.gif`;
                });
            } else {
                console.warn("Nenhum Pokémon foi retornado da API.");
            }
            console.log("Mapeamento de Pokémon para arquivo:", pokemonFileMap);
        } catch (error) {
            console.error("Erro ao popular o select de Pokémon:", error);
        }
    }

    populatePokemonSelect();

    formCarta.addEventListener('submit', function(event) {
        event.preventDefault();

        const pokemonNomeSelecionado = pokemonSelect.value;
        const categoriaSelecionada = categoriaSelect.value;
        const nomeAtaque = nomeAtaqueInput.value;
        const poderAtaque = poderAtaqueInput.value;

        pokemonNomeCarta.textContent = pokemonNomeSelecionado.charAt(0).toUpperCase() + pokemonNomeSelecionado.slice(1);
        pokemonCategoriaCarta.textContent = categoriaSelecionada.charAt(0).toUpperCase() + categoriaSelecionada.slice(1);
        ataqueNomeCarta.textContent = nomeAtaque;
        ataquePoderCarta.textContent = poderAtaque;

        const imageName = pokemonFileMap[pokemonNomeSelecionado];
        if (imageName) {
            pokemonImagemCarta.src = `./pokemons/${imageName}`;
            pokemonImagemCarta.alt = `Imagem do Pokémon ${pokemonNomeSelecionado}`;
        } else {
            pokemonImagemCarta.src = "";
            pokemonImagemCarta.alt = "";
            console.warn(`Imagem não encontrada para o Pokémon: ${pokemonNomeSelecionado}`);
        }
    });
});

class Pokemon {
    id;
    number;
    name;
    type;
    types;
}