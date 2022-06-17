let inputSelector = document.getElementsByClassName('title-input-selection')[0];
let resultSection = document.getElementsByClassName('results')[0];

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
        let url = 'https://api.chess.com/pub/titled/' + inputSelector.value;
        let playersList = await getTitledPlayers(url);
        displayPlayers(playersList.players);

        inputSelector.value = '';
    } else {
        alert('No se ha seleccionado una opcion');
    }

}


async function displayPlayers(players)
{
    resultSection.innerHTML = '';

    players.forEach(
    async function (player){
        let url = 'https://api.chess.com/pub/player/' + player;
        let playerInfo = await getPlayerInfo(url);

        if(!playerInfo.avatar) {playerInfo.avatar = './Images/user-default.png'}

        let userFlagCode = await getUserFlagCode(playerInfo.country);
        userFlag = 'https://countryflagsapi.com/svg/' + userFlagCode.code;
        
        if(userFlagCode.code == 'XX' || userFlagCode.name == 'International')
        {
            userFlag = './images/flag-default.jpg';
        }

        const template =`
                    <a href="./infoplayer.html?${playerInfo.username}" class="user-listed">
                        <img src="${playerInfo.avatar}" alt="${playerInfo.name}'s profile pic" class="user-listed-profile-pic">
                        <div class="user-listed-info">
                            <p class="user-listed-info-name">${playerInfo.username}</p>
                            <img src="${userFlag}" alt="${userFlagCode}" class="user-listed-info-country-flag">
                        </div>
                    </a>`;
    
        resultSection.insertAdjacentHTML('beforeend', template);
    });
}