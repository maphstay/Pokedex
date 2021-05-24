let url = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=10';
let accumulator = '';
let nextUrl = '';

async function loadOnDemand(url) {
    const pokedex = await (await fetch(url)).json();

    for (let i = 0; i < pokedex.results.length; i++) {
        const pokemon = await (await fetch(pokedex.results[i].url)).json();
        generateCard(pokemon);
    }

    nextUrl = pokedex.next

    let headerHeight = document.querySelector('#header').scrollHeight;
    let footerHeight = document.querySelector('#footer').scrollHeight;
    let contentList = inViewport($('#pokeUl')) + 20;
    let contentItem = inViewport($('#pokeUl li')) + 15;
    let html = inViewPortHeight($('body'));
    document.querySelector('body').style.height = html + 'px';
    document.querySelector('html').style.height = html + 'px';
    let totalHeight = html - headerHeight - footerHeight;
    let minusFooter = contentList;
    document.getElementById('content').style.minHeight = contentItem + 'px';
    document.getElementById('content').style.height = ((totalHeight > minusFooter) ? minusFooter : totalHeight) + 'px';
    document.getElementById('content').style.maxheight = ((totalHeight > minusFooter) ? minusFooter : totalHeight) + 'px';
    document.getElementById('content').scrollBottom = -20;
};

function generateCard(pokemon) {
    let pokemon_id = pokemon.id
    let _types = ''
    let imageUrl = "";
    let spriteDefault = pokemon.sprites.front_default

    for (const item of pokemon.types) {
        _types += item.type.name.toUpperCase() + ' | '
    }

    if (spriteDefault != null) {
        imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon_id}.png`;
    } else {
        imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon_id}.png`;
    }

    accumulator += `
    <li class="card ${pokemon.types[0].type.name}">
        <img class="card-image" alt="${pokemon.name}" src="${imageUrl}"
        <p><h2 class="card-number">#${pokemon.id}</h2></p>
        <h2 class="card-name">${pokemon.name}</h2>
        <p class="card-subtitle">${_types.slice(0, -3)}</p>
       </li>
    `
    return createPokemonList(accumulator)
}

const createPokemonList = function (pokemons) {
    const ul = document.querySelector('[data-js="pokedex"]')
    ul.innerHTML = pokemons
}

function inViewport($el) {
    var elH = $el.outerHeight(),
        H = $(window).height(),
        r = $el[0].getBoundingClientRect(), t = r.top, b = r.bottom;
    return Math.max(0, t > 0 ? Math.min(elH, H - t) : Math.min(b, H));
}

function inViewPortHeight() {
    var actualHeight = window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight ||
        document.body.offsetHeight;
    return actualHeight;
}

loadOnDemand(url)

$(document).ready(function () {
    $("#content").scroll(function () {
        if ($(this).scrollTop() + $(this).height() == $(this).get(0).scrollHeight) {
            loadOnDemand(nextUrl)
        }
    })
})