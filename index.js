//Call for pokefetch everytime site loads
window.addEventListener("load", () => {
    pokefetchreload();
});

let currentData = null;

async function pokefetchreload() {

    //RNG setter everytime site loads
    const randomNumber = Math.floor(Math.random() * 1025) + 1;
    const rngReload = randomNumber;

    //Next button reloads website
    const next = document.getElementById("next");
    next.addEventListener("click", () => { location.reload(); });

    const pokemonName = rngReload;
    const responce = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

    //Turns responce into json file
    const data = await responce.json();
    console.log(data);

    //Make data global
    currentData = data;

    //Turn data into image
    const pokeSprite = data.sprites.other["official-artwork"].front_default;
    const pokeImg = document.getElementById("pokesprite");


    pokeImg.src = pokeSprite;
    pokeImg.style.opacity = 0;
    pokeImg.style.display = "block";

    await loadImage(pokeImg, pokeSprite);

    //Fade in/out animations

    anime({
        targets: pokeImg,
        opacity: 1,
        duration: 300,
        easing: 'easeInOutQuad'
    });
}

function pokefetch() {
    const guessInput = document.getElementById("guess").value.toLowerCase();
}

let hintIndex = -1;

async function pokeHint() {
    if (currentData) {
        //Fetch abilities
        const abilities = { name: "Abilities:", value: currentData.abilities.map(a => (capitalize(a.ability.name))).join(", ") };
        //Fetch generation
        const genresponce = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${currentData.name}/`);
        const genData = await genresponce.json();
        const gen = genData.generation.name;
        const genNumRoman = gen.split('-')[1]; // "i"
        const romanToNumber = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9 };
        const generation = { name: "Generation: ", value: romanToNumber[genNumRoman.toLowerCase()] };
        //Fetch type
        const type = { name: "Type: ", value: currentData.types.map(t => capitalize(t.type.name)).join(", ") };

        //Cycle through hint
        const hints = [abilities, type, generation];
        hintIndex = (hintIndex + 1) % hints.length;
        const hint = hints[hintIndex];
        console.log(hint);

        //Get the html id's
        const hintp = document.getElementById("hinttext");
        const hintcat = document.getElementById("hintcategory");

        //Fade in/out animation
        hintp.style.opacity = 0;
        hintcat.style.opacity = 0;

        await delay(200);

        hintp.textContent = hint.value;
        hintcat.textContent = hint.name;

        hintp.style.opacity = 1;
        hintcat.style.opacity = 1;

        console.log(hint);
    }
}

//Capitalize Function
function capitalize(str) {
    return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}


//Image loader
async function loadImage(imgElement, src) {
    return new Promise((resolve) => {
        imgElement.onload = resolve;
        imgElement.src = src;
    });
}

//Delayer
function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }