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
    next.addEventListener("click", async () => {
        if (!reveal) {

            //Checks if the input is correct
            const input = document.getElementById("guess").value.toLowerCase();
            if (input == currentData.name) {
                await pokeGuess(input);
            } else {

                //Reveal xmark
                const xmark = document.getElementsByClassName("xmark")[0];
                xmark.style.opacity = 1;
                //Reveal pokeImg
                anime({
                    targets: pokeImg,
                    filter: ['brightness(0%)', 'brightness(100%)'],
                    duration: 240,
                    easing: 'easeInOutQuad'
                });

                //reveal pokeName
                const showName = document.getElementById("correctName");
                showName.textContent = capitalize(currentData.name);
                colorize(showName);

                next.disabled = true;
                await delay(2000);
            }
        }

        location.reload();
    });
    const pokemonNo = rngReload;
    const responce = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNo}`);

    //Turns responce into json file
    const data = await responce.json();
    console.log(data);

    //Make data global
    currentData = data;

    //Turn data into image
    const pokeSprite = data.sprites.other["official-artwork"].front_default;
    pokeImg = document.getElementById("pokesprite");
    pokeImg.crossOrigin = "Anonymous";
    pokeImg.src = pokeSprite;
    pokeImg.style.opacity = 0;
    pokeImg.style.display = "block";

    //Pokemon Cries
    pokeImg.addEventListener("click", () => {
        if (!currentData) return;

        const pokeId = currentData.id;
        const audioUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokeId}.ogg`;

        const audio = new Audio(audioUrl);
        audio.volume = 0.10;
        audio.play().catch(err => console.log("Audio failed to play:", err));
    });

    await loadImage(pokeImg, pokeSprite);

    //Fade in/out animations
    anime({
        targets: pokeImg,
        opacity: 1,
        duration: 300,
        easing: 'easeInOutQuad'
    });
}

pokeFetch();
//Submits the enter from the form
function pokeFetch() {
    const form = document.getElementById("guessForm");

    //Entering form gets the typed value
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        pokemonGuess = document.getElementById("guess").value.toLowerCase();
        pokeGuess(pokemonGuess);

    });
}

let pokeImg = null;
let reveal = false;

//If guess is right, shows pokemon
async function pokeGuess(pokeName) {
    if (pokeName == currentData.name) {
        if (!reveal) {
            reveal = true;
            anime({
                targets: pokeImg,
                filter: ['brightness(0%)', 'brightness(100%)'],
                duration: 240,
                easing: 'easeInOutQuad'
            });

            const showName = document.getElementById("correctName");
            showName.textContent = capitalize(currentData.name);
            colorize(showName);

            //Reveal checkmark
            const checkmark = document.getElementsByClassName("checkmark")[0];
            checkmark.style.opacity = 1;

            await delay(2000);

            location.reload();
        }

        // Shake animation when input entered is wrong
    } else {
        const input = document.getElementById("guess");
        anime({
            targets: input,
            translateX: [
                { value: -50, duration: 50 },
                { value: 50, duration: 50 },
                { value: -50, duration: 50 },
                { value: 50, duration: 50 },
                { value: 0, duration: 50 }
            ],
            easing: 'easeInOutQuad'
        });
    }
}


function colorize(pokename) {
    //Reveal name
    const colorThief = new ColorThief();
    const dominantColor = colorThief.getColor(pokeImg);
    console.log("dominantColor ==> ", dominantColor);
    pokename.style.color = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;

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

//Pokesounds when pokeImg is pressed
async function pokeCry() {
    alert("nigga");
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

//If key is pressed it focuses the input
const input = document.getElementById("guess");
window.addEventListener("keydown", (e) => {
    input.focus();
});

