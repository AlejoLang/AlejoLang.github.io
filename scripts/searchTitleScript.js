let inputSelector = document.getElementsByClassName('title-input-selection')[0];
let resultSection = document.getElementsByClassName('results')[0];
let mainHeader = document.getElementsByClassName('main-content-header')[0];
let searchBtn = document.getElementsByClassName('searchPlayersBtn')[0];

let index = 1; //indice para el paginador
let maxIndex;
let playersList;
let control = false;

async function getTitledPlayers(urlTit)
{
    let data = await fetch(urlTit);
    return data.json();
}

async function getPlayerInfo(urlPlayer)
{
    let data = await fetch(urlPlayer);
    return data.json();
}

async function getUserFlagCode(urlCountry)
{
    let data = await fetch(urlCountry);
    return data.json();
}

async function searchPlayers()
{

    if(inputSelector.value)
    {
        handlePaginator('goFirstPage');
        control = true;

        let url = 'https://api.chess.com/pub/titled/' + inputSelector.value;
        playersList = await getTitledPlayers(url);
        maxIndex = Math.ceil(playersList.players.length / 20);

        document?.getElementsByClassName('results-tit')[0]?.remove();
        mainHeader.insertAdjacentHTML('beforeend', 
            `<h2 class="results-tit">Resultados de ${inputSelector.value}:</h2>`);
    
        displayPlayers(playersList.players);

        inputSelector.value = '';
    } else {
        alert('No se ha seleccionado una opcion');
    }
    searchBtn.blur();
}
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function displayPlayers(players)
{
    resultSection.innerHTML = '';
    document.getElementsByClassName('lds-ring-div')[0].style.display = 'flex';

    let interruption = false; //Variable que detecta si se produjo un retorno de la funcion
    let finTemplate = ``;
    console.log('1 Fuera del for, control = '+ control);
    control = false;
    console.log('2 Fuera del for, control = '+ control);

    for(let i = (index - 1) * 20; i < index * 20; i++){
        console.log('1 Dentro del for, control = '+ control);
        if(control){interruption = true; control = false; console.log('Dentro del if'); return;}
        console.log(i)
        if(i > maxIndex * 20){return;}
        console.log('2 Dentro del for, control = '+ control);

        await displayPlayer(players[i]);

        async function displayPlayer (player) {
            let url = 'https://api.chess.com/pub/player/' + player + '/';
            
            let playerInfo = await getPlayerInfo(url);

            if (!playerInfo.avatar) { playerInfo.avatar = './Images/user-default.png'; }

            let userFlagCode = await getUserFlagCode(playerInfo.country);
            userFlag = 'https://countryflagsapi.com/svg/' + userFlagCode.code;

            if (userFlagCode.code == 'XX' || userFlagCode.name == 'International') {
                userFlag = './images/flag-default.jpg';
            }

            finTemplate += `
                    <a href="./infoplayer.html?${playerInfo.username}" class="user-listed">
                        <img src="${playerInfo.avatar}" alt="${playerInfo.name}'s profile pic" class="user-listed-profile-pic">
                        <div class="user-listed-info">
                            <p class="user-listed-info-name">${playerInfo.username}</p>
                            <img src="${userFlag}" alt="${userFlagCode}" class="user-listed-info-country-flag">
                        </div>
                    </a>`;
        };
    }
    document.getElementsByClassName('lds-ring-div')[0].style.display = 'none';
    if(!interruption){resultSection.insertAdjacentHTML('beforeend', finTemplate);}
}

function handlePaginator(action)
{
    control = true;
    console.log('Cambio del control a true');
    indexNum = document.getElementsByClassName('paginator-index')[0];
    if(maxIndex) {
        if(action == 'goFirstPage' && index != 1) {
            index = 1;
            indexNum.textContent = index;
            displayPlayers(playersList.players);
        }
        if(action == 'returnPage' && index > 1) {
            index--;
            indexNum.textContent = index;
            displayPlayers(playersList.players);
        }
        if(action == 'nextPage' && index <= maxIndex) {
            index++;
            indexNum.textContent = index;
            displayPlayers(playersList.players);
        }
        if(action == 'goLastPage' && index != maxIndex) {
            index = maxIndex;
            indexNum.textContent = index;
            displayPlayers(playersList.players);
        }
    }
}