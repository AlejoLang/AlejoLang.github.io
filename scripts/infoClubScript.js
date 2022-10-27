import fetchData from './tools/fetch.js'

let clubName = location.search.substring(1),
    mainContent = document.getElementsByClassName('main-content')[0];

async function displayClubPrincipalInformation(clubData){

    let clubCountry = await fetchData(clubData.country);
    let clubFlagLink;

    if ( clubCountry.name == 'Russia') {
        clubFlagLink = 'https://countryflagsapi.com/svg/' +  userCountry.code;
    } else if( clubCountry.code == 'FK'){
        clubCountry.name = 'Argentina';
        clubFlagLink = 'https://countryflagsapi.com/svg/Argentina';
    } else if( clubCountry.code == 'XX' ||  clubCountry.name == 'International' || !clubCountry.code){
        clubCountry.name = 'International';
        clubFlagLink = './images/flag-default.jpg';
    } else {
        clubFlagLink = 'https://countryflagsapi.com/svg/' +  clubCountry.name;
    }

    if(!clubData.icon){
        clubData.icon = './images/club-default.jpg';
    }

    document.querySelector('.main-info-clubPrincipal-clubImg')
        .src = clubData.icon;
    
    document.querySelector('.main-info-clubPrincipal-clubImg')
        .alt = clubData.name;
    
    document.querySelector('.main-info-clubPrincipal-clubInfo-clubName')
        .textContent = clubData.name;
    
    document.querySelector('.main-info-clubPrincipal-clubInfo-clubFlag')
        .src = clubFlagLink;

    document.querySelector('.main-info-clubPrincipal-clubInfo-clubFlag')
        .alt = clubCountry.name;

    document.querySelector('.main-info-clubPrincipal-clubInfo-avgDailyRating')
        .insertAdjacentText('beforeend', clubData.average_daily_rating);
    
    document.querySelector('.main-info-clubPrincipal-clubInfo-members')
        .insertAdjacentText('beforeend', clubData.members_count);

    document.querySelector('.main-info-clubPrincipal-clubInfo-creationDate')
        .insertAdjacentText('beforeend', new Date(clubData.created * 1000)
                                            .toLocaleDateString('es-AR', {year:"numeric", month: "short", day:"numeric"}));

    document.querySelector('.main-info-clubPrincipal-clubInfo-lastActivity')
        .insertAdjacentText('beforeend', transformLastOnlineHours(clubData.last_activity));

}

async function displayClubDescription(clubDescription){
    document.querySelector('.main-info-clubDescription-description')
        .textContent = `${clubDescription ? clubDescription : 'El club no tiene descripcion'}`
}

async function displayClubAdmins(clubAdmins){
    let template = ``;

    for(let i = 0; i<clubAdmins.length; i++){
        await addAdmins(clubAdmins[i]);
    }
    
    async function addAdmins(adminLink){
        let adminData = await fetchData(adminLink);
        if (!adminData.avatar){ adminData.avatar = './images/user-default.png'; }
        const adminTemplate = `
            <li>
                <a href="./infoPlayer.html?${adminData.username}" class="main-info-clubAdmins-adminList-admin">
                    <img src="${adminData.avatar}" alt="${adminData.username}" class="main-info-clubAdmins-adminList-adminImg">
                    <p class="main-info-clubAdmins-adminList-adminName">${adminData.username}</p>
                </a>
            </li>
        `;
        template += adminTemplate;
        delay(1000);
    }
    
    document.querySelector('.main-info-clubAdmins-adminsList')
        .innerHTML = template;

}

async function displayClubPrincipalData(){
    const clubUrl = 'https://api.chess.com/pub/club/' + clubName;
    const clubData = await fetchData(clubUrl);
    if(!clubData){return;}

    displayClubPrincipalInformation(clubData);
    displayClubDescription(clubData.description);
    displayClubAdmins(clubData.admin);
    
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function transformLastOnlineHours(time)
{
    let res;
    let dif = new Date() - new Date(time * 1000);

    dif /= 1000;
    if(dif >= 1){ res = `${Math.trunc(dif)} seg.`;}

    dif /= 60;
    if(dif >= 1){ res = `${Math.trunc(dif)} min.`;}
    
    dif /= 60;
    if(dif >= 1){ res = `${Math.trunc(dif)} hrs.`;}

    dif /= 24;
    if(dif >= 1 && dif <= 10){ res = `${Math.trunc(dif)} dias.`;} 
    else if(dif > 10){
        res = new Date(time * 1000)
                    .toLocaleDateString('es-AR', 
                    {year:"numeric", month: "short", day:"numeric"})
    }

    return res;
}

window.addEventListener('onload', start());

async function start()
{
    displayClubPrincipalData();
}