let inputSelector = document.getElementsByClassName('title-input-selection')[0];
let resultSection = document.getElementsByClassName('results')[0];
let mainHeader = document.getElementsByClassName('main-content-header')[0];
let searchBtn = document.getElementsByClassName('searchPlayersBtn')[0];

let index = 1; //indice para el paginador
let maxIndex;
let playersList;
let control = false;

async function getTitledPlayers(urlTit) {
    let data = await fetch(urlTit);
    return data.json();
}

async function getPlayerInfo(urlPlayer) {
    let data = await fetch(urlPlayer);
    return data.json();
}

async function getUserFlagCode(urlCountry) {
    let data = await fetch(urlCountry);
    return data.json();
}

async function searchPlayers() {
    if (inputSelector.value) {
        index = 1;
        document.getElementsByClassName('paginator-index')[0].textContent = index;
        control = true;
        await delay(1000);

        let url = 'https://api.chess.com/pub/titled/' + inputSelector.value;
        playersList = await getTitledPlayers(url);
        maxIndex = Math.ceil(playersList.players.length / 20);

        document?.getElementsByClassName('results-tit')[0]?.remove();
        mainHeader.insertAdjacentHTML('beforeend',
            `<h2 class="results-tit">Resultados de ${inputSelector.value}:</h2>`);

        displayPlayers(playersList.players);

        inputSelector.value = '';
    } else {
        document.getElementsByClassName('errorAlert')[0].showModal();
    }
    searchBtn.blur();
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function displayPlayers(players) {
    resultSection.innerHTML = '';
    document.getElementsByClassName('lds-ring-div')[0].style.display = 'flex';

    let interruption = false; //Variable que detecta si se produjo un retorno de la funcion
    let finTemplate = ``;

    control = false;

    for (let i = (index - 1) * 20; i < index * 20; i++) {

        if (control) {
            interruption = true;
            control = false;
            return 0;
        }
        if (i >= players.length) { break; }

        await displayPlayer(players[i]);

        async function displayPlayer(player) {
            let url = 'https://api.chess.com/pub/player/' + player + '/';

            let playerInfo = await getPlayerInfo(url);

            if (!playerInfo.avatar) { playerInfo.avatar = './images/user-default.png'; }

            let userFlagCode = await getUserFlagCode(playerInfo.country);
            let userFlag = 'https://countryflagsapi.com/svg/' + userFlagCode.name;

            if (userFlagCode.name == 'Russia') {
                userFlag = 'https://countryflagsapi.com/svg/' + userFlagCode.code;
            } else if(userFlagCode.code == 'FK'){
                userFlagCode.name = 'Argentina';
                userFlag = 'https://countryflagsapi.com/svg/Argentina';
            } else if(userFlagCode.code == 'XX' || userFlagCode.name == 'International' || !userFlagCode.code){
                userFlagCode.name = 'International';
                userFlag = './images/flag-default';
            }

            finTemplate += `
                    <a href="./infoPlayer.html?${playerInfo.username}" class="user-listed">
                        <img src="${playerInfo.avatar}" alt="${playerInfo.name}'s profile pic" class="user-listed-profile-pic">
                        <div class="user-listed-info">
                            <p class="user-listed-info-name">${playerInfo.username}</p>
                            <img src="${userFlag}" alt="${userFlagCode.name}" class="user-listed-info-country-flag">
                        </div>
                    </a>`;
        };
    }

    document.getElementsByClassName('lds-ring-div')[0].style.display = 'none';
    if (!interruption) {
        interruption = false;
        resultSection.insertAdjacentHTML('beforeend', finTemplate);
    }
}

async function handlePaginator(action) {
    indexNum = document.getElementsByClassName('paginator-index')[0];
    if (maxIndex) {
        if (action == 'goFirstPage' && index != 1) {
            control = true;
            await delay(1000);
            index = 1;
            indexNum.textContent = index;
            displayPlayers(playersList.players);
        }
        if (action == 'returnPage' && index > 1) {
            control = true;
            await delay(1000);
            index--;
            indexNum.textContent = index;
            displayPlayers(playersList.players);
        }
        if (action == 'nextPage' && index < maxIndex) {
            control = true;
            await delay(1000);
            index++;
            indexNum.textContent = index;
            displayPlayers(playersList.players);
        }
        if (action == 'goLastPage' && index != maxIndex && maxIndex > 1) {
            control = true;
            await delay(1000);
            index = maxIndex;
            indexNum.textContent = index;
            displayPlayers(playersList.players);
        }
    }
}

/*Codigo de https://codepen.io/geckotang/post/dialog-with-animation*/

function closeModal() {
    dialog = document.getElementsByClassName('errorAlert')[0];
    dialog.classList.add('hide');
    dialog.addEventListener('webkitAnimationEnd', function() {
        dialog.classList.remove('hide');
        dialog.close();
        dialog.removeEventListener('webkitAnimationEnd', arguments.callee, false);
    }, false);
}