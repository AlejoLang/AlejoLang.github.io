let clubName = location.search.substring(1),
    mainContent = document.getElementsByClassName('main-content')[0];

async function getClubData(url){
    return await fetch(url)
        .then((data) => {return data.json();})
        .catch((err) => {alert('Error obteniendo el informacion del club: ' + err)});
}

async function getClubCountry(url){
    return await fetch(url)
        .then((data) => {return data.json();})
        .catch((err) => {alert('Error obteniendo la informacion del pais del club: ' + err)});
}

async function getAdminData(url){
    return await fetch(url)
        .then((data) => {return data.json();})
        .catch((err) => {alert('Error obteniendo la informacion de las administradores: ' + err)});
}

async function displayClubPrincipalInformation(clubData){

    let clubCountry = await getClubCountry(clubData.country);
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

    const template = `
        <div class="main-info-clubPrincipal">
            <img src="${clubData.icon}" alt="${clubData.name}" class="main-info-clubPrincipal-clubImg">
            <div class="main-info-clubPrincipal-clubInfo">
                <div class="main-info-clubPrincipal-clubInfo-header">
                    <p class="main-info-clubPrincipal-clubInfo-clubName">${clubData.name}</p>
                    <img src="${clubFlagLink}" alt="${clubCountry.name}" class="main-info-clubPrincipal-clubInfo-clubFlag">
                </div>
                <div class="main-info-clubPrincipal-clubInfo-other">
                    <div class="main-info-clubPrincipal-clubInfo-avgDailyRating">
                        <i class="fa-solid fa-ranking-star"></i>
                        ${clubData.average_daily_rating}
                    </div>
                    <div class="main-info-clubPrincipal-clubInfo-members">
                        <i class="fa-solid fa-users"></i>
                        ${clubData.members_count}
                    </div>
                    <div class="main-info-clubPrincipal-clubInfo-creationDate">
                        <i class="fa fa-solid fa-stopwatch"></i>
                        ${
                            new Date(clubData.created * 1000)
                                .toLocaleDateString('es-AR', {year:"numeric", month: "short", day:"numeric"})
                        }
                    </div>
                    <div class="main-info-clubPrincipal-clubInfo-lastActivity">
                        <i class="fa fa-clock"></i>
                        ${transformLastOnlineHours(clubData.last_activity)}
                    </div>
                </div>
            </div>
        </div>
    `;

    return template;
}

async function displayClubDescription(clubDescription){
    const template = `
        <div class="main-info-clubDescription">
            <p class="main-info-clubDescription-title">Descripción: </p>
            <p class="main-info-clubDescription-description">
                ${clubDescription}
            </p>
        </div>
    `;
    return template;
}

async function displayClubAdmins(clubAdmins){
    let template = `
        <div class="main-info-clubAdmins">
            <p class="main-info-clubAdmins-title">Admins: </p>
            <ul class="main-info-clubAdmins-adminsList">
    `;

    for(let i = 0; i<clubAdmins.length; i++){
        await addAdmins(clubAdmins[i]);
    }
    
    async function addAdmins(adminLink){
        let adminData = await getAdminData(adminLink);
        if (!adminData.avatar){ adminData.avatar = './images/user-default.png'; }
        const adminTemplate = `
            <li>
                <a href="./infoPlayer?${adminData.username}" class="main-info-clubAdmins-adminList-admin">
                    <img src="${adminData.avatar}" alt="${adminData.username}" class="main-info-clubAdmins-adminList-adminImg">
                    <p class="main-info-clubAdmins-adminList-adminName">${adminData.username}</p>
                </a>
            </li>
        `;
        template += adminTemplate;
        delay(1000);
    }
    template += `</ul></div>`;
    return template;
}

async function displayClubPrincipalData(){
    const clubUrl = 'https://api.chess.com/pub/club/' + clubName;
    const clubData = await getClubData(clubUrl);
    if(!clubData){return;}
    
    const clubPrincipalInfo = await displayClubPrincipalInformation(clubData);
    const clubDescription = await displayClubDescription(clubData.description);
    const clubAdmins = await displayClubAdmins(clubData.admin);

    const clubPrincipalData = `
        <div class="main-info">
            ${clubPrincipalInfo}
            ${clubDescription}
            ${clubAdmins }
        </div>
    `;
    mainContent.insertAdjacentHTML('beforeend', clubPrincipalData)
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function transformLastOnlineHours(time)
{
    let res;
    dif = new Date() - new Date(time * 1000);

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
    await delay(1000);
}