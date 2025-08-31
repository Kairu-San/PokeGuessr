//Call for pokefetch everytime site loads
window.addEventListener("load", () => {
    pokefetchreload();
});

async function pokefetchreload() {

    //RNG setter everytime site loads
    const randomNumber = Math.floor(Math.random() * 1025) + 1;
    const rngReload = randomNumber;
    
    //Next button reloads website
    const next = document.getElementById("next");
    next.addEventListener("click", () => {location.reload();});
    
    const pokemonName = rngReload;
    const responce = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

    //Turns responce into json file
    const data = await responce.json();
    console.log(data);
    
    const pokeSprite = data.sprites.other["official-artwork"].front_default;
    const pokeImg = document.getElementById("pokesprite");

    pokeImg.src = pokeSprite;
    pokeImg.style.display = "block";
    
}

function pokefetch() {
    const guessInput = document.getElementById("guess").value.toLowerCase();
}

