//Call for pokefetch everytime site loads
window.addEventListener("load", () => {
    pokefetchreload()
    score = 0;
    localStorage.setItem("score", score);
    updateScoreboard();
});

//variable setters
let currentData = null;
let pokeImg = document.getElementById("pokesprite");
let reveal = false;
let hintIndex = -1;
let firstLoad = true;

//Pokemon Cries
pokeImg.addEventListener("click", () => {
    if (!currentData) return;

    const pokeId = currentData.id;
    const audioUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokeId}.ogg`;

    const audio = new Audio(audioUrl);
    audio.volume = 0.10;
    audio.play().catch(err => console.log("Audio failed to play:", err));
});


//reload site
async function pokefetchreload() {

    //RNG setter everytime site loads
    const randomNumber = Math.floor(Math.random() * 1025) + 1;
    const rngReload = randomNumber;
    const pokemonNo = rngReload;
    const responce = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNo}`);
    const data = await responce.json();
    console.log(data);

    //Make data global
    currentData = data;

    //Turn data into image
    const pokeSprite = data.sprites.other["official-artwork"].front_default;
    pokeImg.crossOrigin = "Anonymous";
    pokeImg.src = pokeSprite;
    pokeImg.style.opacity = 1;
    pokeImg.style.display = "block";

    await loadImage(pokeImg, pokeSprite);

    if (firstLoad) {
        await anime({
            targets: pokeImg,
            scale: [0, 1],
            duration: 100,
            easing: 'easeInOutQuad'
        }).finished;

        firstLoad = false;
    } else {

        anime({
            targets: [correctName, hints],
            translateY: [50, 0],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeInOutQuad'
        });
        await anime({
            targets: pokeImg,
            scale: [0, 1],
            duration: 100,
            easing: 'easeInOutQuad'
        }).finished;
    }
    pokeImg.style.transform = "";
}

//Next button reloads website
const next = document.getElementById("next");
next.addEventListener("click", async () => {
    next.disabled = true;
    if (!reveal) {

        //Checks if the input is correct
        const input = document.getElementById("guess").value.toLowerCase();
        if (input == currentData.name) {
            await pokeGuess(input);
        } else {

            //Reveal xmark
            anime({
                targets: '.xmark',
                scale: [0, 1],
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutExpo'
            });
            //Reveal pokeImg
            anime({
                targets: pokeImg,
                translateX: [
                    { value: -50, duration: 50 },
                    { value: 50, duration: 50 },
                    { value: -50, duration: 50 },
                    { value: 50, duration: 50 },
                    { value: 0, duration: 50 }
                ],
                duration: 200,
                easing: 'easeOutExpo'
            });

            anime({
                targets: pokeImg,
                filter: ['brightness(0%)', 'brightness(100%)'],
                duration: 300,
                easing: 'easeOutExpo'
            });

            //reveal pokeName
            const showName = document.getElementById("correctName");
            showName.textContent = capitalize(currentData.name);
            colorize(showName);

            await anime({
                targets: showName,
                scale: [0, 1],
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutExpo'
            }).finished;

            await delay(2000);

            anime({
                targets: '.xmark',
                scale: [1, 0],
                duration: 300,
                easing: 'easeInOutQuad'
            });
            await resetUI();
            await pokefetchreload();

        }
    }
    next.disabled = false;
});

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




//If guess is right, shows pokemon
async function pokeGuess(pokeName) {
    if (normalizeName(pokeName) === normalizeName(currentData.name)) {

        if (!reveal) {
            reveal = true;
            next.disabled = true;
            //Pokepoints per guess, minus points if hints used
            score += (hintIndex === -1) ? 10 : 5;
            updateScoreboard();

            anime({
                targets: pokeImg,
                filter: ['brightness(0%)', 'brightness(100%)'],
                duration: 300,
                easing: 'easeOutExpo'
            });

            anime({
                targets: pokeImg,
                scale: [1.5, 1],
                duration: 200,
                easing: 'easeOutExpo'
            });
            //reveal Name
            const showName = document.getElementById("correctName");
            showName.textContent = capitalize(currentData.name);
            colorize(showName);

            anime({
                targets: showName,
                scale: [0, 1],
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutExpo'
            }).finished;

            //Reveal checkmark
            await anime({
                targets: '.checkmark',
                scale: [0, 1],
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutExpo'
            });


            await delay(2000);
            anime({
                targets: [`.checkmark`],
                scale: [1, 0],
                duration: 300,
                easing: 'easeInOutQuad'
            }).finished;
            await resetUI();
            await pokefetchreload();
            next.disabled = false;
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
        hintp.textContent = hint.value;
        hintcat.textContent = hint.name;

        await anime({
            targets: [hintcat, hintp],
            translateY: [20, 0],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutExpo'
        }).finished;
    }
}


function updateScoreboard() {
    document.getElementById("score").textContent = `Score: ${score}`;
    localStorage.setItem("score", score);
}

//Capitalize Function
function capitalize(str) {
    return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function normalizeName(name) {
    return name.toLowerCase().replace(/-/g, " ").trim();
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

async function resetUI() {
    reveal = false;
    hintIndex = -1;

    //Fade in/out animations
    anime({
        targets: input,
        scale: [1, 0.9],        // text scales down to 0
        duration: 150,
        easing: 'easeInOutQuad',
        complete: () => {
            input.value = ""; // clear typed text
            input.style.transform = "scale(1)"; // reset scale
            input.style.transform = "";
        }
    });

    anime({
        targets: [correctName, hints],
        translateY: [0, 50],
        opacity: [1, 0],
        duration: 300,
        easing: 'easeInOutQuad'
    });

    await anime({
        targets: pokeImg,
        scale: [1, 0],
        duration: 200,
        easing: 'easeInOutQuad'
    }).finished;


    await anime({
        targets: pokeImg,
        filter: [`brightness(100%)`, `brightness(0%)`],
        duration: 300,
        easing: 'easeInOutQuad'
    }).finished;

    document.getElementById("guess").value = "";
    document.getElementById("correctName").textContent = "?";
    document.getElementById("correctName").style.color = "black";
    document.getElementById("hinttext").textContent = "";
    document.getElementById("hintcategory").textContent = "Hints: ";
};
