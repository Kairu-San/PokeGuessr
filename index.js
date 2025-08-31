//Call for pokefetch everytime site loads
window.addEventListener("load", () => {
    pokefetch();
});

async function pokefetch() {

    //RNG setter everytime site loads
    const randomNumber = Math.floor(Math.random() * 1025) + 1;

    // Calls pokemon from input
    const rngReload = randomNumber;
    const guessInput = document.getElementById("guess").value.toLowerCase();

    const pokemonName = rngReload;
    const responce = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);



    if (!responce.ok) {
        throw new Error("Could not fetch resource");
    }

    const data = await responce.json();
    console.log(data);
    const pokeSprite = data.sprites.other["official-artwork"].front_default;
    const pokeImg = document.getElementById("pokesprite");

    pokeImg.src = pokeSprite;
    

}