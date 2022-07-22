let username = location.search.substring(1),
    mainContent = document.getElementsByClassName('main-content')[0];

async function getUserData(urlUser)
{
    let data = await fetch(urlUser);
    return data.json();
}

async function getUserCountry(urlCountry)
{
    let data = await fetch(urlCountry);
    return data.json();
}

async function getUserStats(urlStats)
{
    let data = await fetch(urlStats);
    return data.json();
}

async function getUserClubs(urlClubs)
{
    let data = await fetch(urlClubs);
    return data.json();
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function displayUserPrincipalData()
{
    let userData = await getUserData('https://api.chess.com/pub/player/' + username);
    let userCountry = await getUserCountry(userData.country);

    let countryFlagLink = 'https://countryflagsapi.com/svg/' +  userCountry.name;

    if ( userCountry.name == 'Russia') {
        countryFlagLink = 'https://countryflagsapi.com/svg/' +  userCountry.code;
    } else if( userCountry.code == 'FK'){
        userCountry.name = 'Argentina';
        countryFlagLink = 'https://countryflagsapi.com/svg/Argentina';
    } else if( userCountry.code == 'XX' ||  userCountry.name == 'International' || !userCountry.code){
        userCountry.name = 'International';
        countryFlagLink = './images/flag-default';
    }

    const templatePrincipalInfoHeader = 
        `
        <div class="player-principal-info-header">
            <h1 class="player-principal-info-username">${userData.username}</h1>
            <div class="player-principal-info-icons">
                ${userData.is_streamer ?
                    `<div class="player-principal-info-icon-twitch">
                        <a href="${userData.twitch_url}" target="_blank" class="player-principal-info-twitch">
                        <i class="player-principal-info-twitch-icon fa fa-twitch"></i>
                        </a>
                    </div>
                    ` : ''
                }
                ${userData.status == 'staff' ?
                    `<div class="player-principal-info-icon-status">
                        <i class="player-principal-info-stat fa fa-hammer"></i>
                    </div>
                    ` : ''
                }
                ${userData.verified == true ?
                    `<div class="player-principal-info-icon-verified">
                        <i class="player-principal-info-verified fa fa-solid fa-check"></i>
                    </div>
                    ` : ''
                }
            </div>
        </div>
        `;

    const templatePrincipalInfoSubheader =
        `
        <div class="player-principal-info-subheader">
            ${userData.name ? `
                <p class="player-principal-info-fullname">
                    ${userData.name}
                </p> ` : ''
            }
            
            
            <div class="player-principal-info-location">
                ${userData.location ? `
                    <i class="player-principal-info-location-icon fa-solid fa-location-dot"></i>
                    <p class="player-principal-info-city">${userData.location}</p>` : ''}
                    <img src="${countryFlagLink}" class="player-principal-info-flag">
                </div>
        </div>
        `;
    
    const templatePrincipalInfoOther =
        `
        <div class="player-principal-info-other">
            <div class="player-principal-info-other-lastonline">
                <i class="player-principal-info-other-lastonline-icon fa fa-clock"></i>
                    ${
                        transformLastOnlineHours(userData.last_online)
                    }
                </div>
            <div class="player-principal-info-other-joined">
                <i class="player-principal-info-other-joined-icon fa fa-solid fa-stopwatch"></i>
                ${
                    new Date(userData.joined * 1000)
                    .toLocaleDateString('es-AR', 
                                        {year:"numeric", month: "short", day:"numeric"})
                }
            </div>
            <div class="player-principal-info-other-followers">
                <i class="player-principal-info-other-followers-icon fa fa-people-group"></i>
                ${userData.followers}
            </div>
        </div>
        `;

    const templatePlayerPrincipal = 
        `
        <section class="player-principal">
            <img src="${userData.avatar == undefined ? 
                        './images/user-default.png' : 
                        `${userData.avatar}`}" 
            alt="${userData.username}" class="player-principal-avatar">  
            <div class="player-principal-info">
                ${templatePrincipalInfoHeader}
                ${templatePrincipalInfoSubheader}
                ${templatePrincipalInfoOther}
            </div>
        </section>
        `;
    
    mainContent.insertAdjacentHTML('afterbegin', templatePlayerPrincipal);
    return 0;
}

async function displayUserStats()
{
    let userStats = await getUserStats('https://api.chess.com/pub/player/' + username + '/stats');
    delete userStats.lessons;
    let fide =  userStats.fide;
    delete userStats.fide;

    let statsDiv = document.getElementsByClassName('player-stats')[0];
    let totalWin = 0,
        totalLoss = 0,
        totalDraw = 0;

    let statsDivInfo = {
        chess_daily: {name:'Diario', icon:'fa-sun'},
        chess960_daily: {name:'Diario 960', icon:'fa-shuffle'},
        chess_blitz: {name:'Blitz', icon:'fa-bolt-lightning'},
        chess_bullet: {name:'Bala', icon:'fa-gun'},
        chess_rapid: {name:'Rápida', icon:'fa-stopwatch'},
        puzzle_rush: {name:'Puzzle Rush', icon:'fa-truck-fast'},
        tactics: {name:'Puzzle', icon:'fa-puzzle-piece'}
    };

    Object.keys(userStats).forEach(stat => {
        
        statValue = userStats[stat];
        
        if(Object.entries(statValue).length == 0){return;}
        let templateStats = `
        <div class="player-stats-blitz player-stats-info">
            <div class="player-stats-header">
                <div class="player-stats-header-title">
                    <i class="fa fas fa-solid ${statsDivInfo[stat].icon}"></i>
                    <p class="player-stats-header-title-tit">${statsDivInfo[stat].name}</p>
                </div>
                <div class="player-stats-header-secondsec">
                    <p class="player-stats-header-points">
                        ${statValue.last ? 
                        statValue.last.rating : (
                        statValue.highest ? 
                        statValue.highest.rating : 
                        statValue.best?.score)}
                    </p>
                    <button class="player-stats-header-button" onclick="openStatDropdown(event)" value = 0>
                        <i class="fa-solid fa-angle-down"></i>
                    </button>
                </div>
            </div>
            <div class="player-stats-content">
                <div class="player-stats-content-best player-stats-content-div">
                    <p class="player-stats-content-text">Mejor</p> 
                    <div class="player-stats-content-best-info">
                        <p class="player-stats-content-best-info-points">
                            ${statValue.best?.rating ? 
                            statValue.best.rating : (
                            statValue.best?.score ?
                            statValue.best.score : (
                            statValue.highest?.rating ?
                            statValue.highest.rating :
                            (
                                statValue.last ? 
                                statValue.last.rating : (
                                statValue.highest ? 
                                statValue.highest.rating : 
                                statValue.best?.score)
                            )
                            ))}
                        </p>
                        ${
                            statValue?.best ? `${
                                statValue.best?.date ? 
                                `
                                    <a href="${statValue.best.game}" class="player-stats-content-best-info-date" target="_blank">(
                                        ${(new Date(statValue.best.date * 1000)).toLocaleDateString('es-AR', 
                                        {year:"numeric", month: "short", day:"numeric"})}
                                    )</a>
                                ` : ''
                            }` : (
                                statValue.highest?.date ? 
                                    `
                                    <a href="${statValue.highest?.game}" class="player-stats-content-best-info-date" target="_blank">(
                                        ${(new Date(statValue.highest?.date * 1000)).toLocaleDateString('es-AR', 
                                        {year:"numeric", month: "short", day:"numeric"})}
                                    )</a> 
                                ` :
                                (
                                    statValue?.last ? `${
                                        statValue.last?.date ? 
                                        `
                                            <a href="${statValue.last.game}" class="player-stats-content-best-info-date" target="_blank">(
                                                ${(new Date(statValue.last.date * 1000)).toLocaleDateString('es-AR', 
                                                {year:"numeric", month: "short", day:"numeric"})}
                                            )</a>
                                        ` : ''
                                    }` : (
                                        statValue.lowest?.date ? 
                                            `
                                            <a href="${statValue.lowest?.game}" class="player-stats-content-best-info-date" target="_blank">(
                                                ${(new Date(statValue.lowest?.date * 1000)).toLocaleDateString('es-AR', 
                                                {year:"numeric", month: "short", day:"numeric"})}
                                            )</a> 
                                        ` : ''
                                ))
                    )}
                    </div>
                </div>
                <div class="player-stats-content-gamesplayed player-stats-content-div">
                    ${statValue?.record ? 
                    `
                        <p class="player-stats-content-text">Partidas Jugadas</p>
                        <p class="player-stats-content-gamesplayed-result">
                            ${statValue.record.win + statValue.record.loss + statValue.record.draw}
                        </p>
                    ` : (
                        statValue.best?.total_attempts ? 
                        `
                        <p class="player-stats-content-text">Intentos Totales</p>
                        <p class="player-stats-content-gamesplayed-result">
                            ${statValue.best.total_attempts}
                        </p>
                        ` : 
                        `
                        <p class="player-stats-content-text">Peor</p> 
                        <div class="player-stats-content-best-info">
                            <p class="player-stats-content-best-info-points-low">
                                ${statValue.lowest?.rating}
                            </p>
                        </div>
                        `
                    )}
                </div>
                
                    ${statValue?.record ? 
                    `
                    <div class="player-stats-content-rate player-stats-content-div">
                    <p class="player-stats-content-text player-stats-content-rate-text">G/P/E</p>
                    <div class="player-stats-content-rate-res">
                        <p class="player-stats-content-rate-res-win">
                            ${statValue.record.win} G
                        </p>
                        <p class="player-stats-content-rate-res-loss">
                            ${statValue.record.loss} P
                        </p>
                        <p class="player-stats-content-rate-res-draw">
                            ${statValue.record.draw} E
                        </p>
                    </div>
                    </div>
                    ` : '' }
            </div>
        </div>`;
        statsDiv.insertAdjacentHTML('beforeend', templateStats);
        totalWin += statValue?.record?.win ?? 0;
        totalLoss += statValue?.record?.loss ?? 0;
        totalDraw += statValue?.record?.draw ?? 0;
    });

    const templateTotalGamesPlayed = 
    `
        <div class="player-stats-mainHeader">
            <p class="player-stats-tittext">Estadisticas</p>
            <div class="player-stats-mainHeader-games">
            <p class="player-stats-content-text">Partidas Totales Jugadas: ${totalWin + totalLoss + totalDraw}</p>
            </div>
        </div>
    `;

    statsDiv.insertAdjacentHTML('afterbegin', templateTotalGamesPlayed);

    statsDiv.insertAdjacentHTML('beforeend', `
        <div class="player-stats-content-gamesplayed player-stats-content-div fide-div">
            <p class="player-stats-content-text">FIDE</p>
                <p class="player-stats-content-gamesplayed-result">
                ${fide ?? '0'}
            </p>
        </div>`);
    return 0;
}

async function displayUserClubs(){

    let userClubs = await getUserClubs('https://api.chess.com/pub/player/' + username + '/clubs');
    if(!userClubs){return;}
    let templateUserClubs = ``;
    
    Object.values(userClubs.clubs).forEach(club => {
        
        templateUserClubs += `
            <a class="player-clubs-listedClub" href="./infoClub?${club.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(' ', '-')}">
                <img src="${club.icon}" alt="${club.name + ' img'}" class="player-clubs-listedClub-clubImg">
                <p class="player-clubs-listedClubs-clubName">${club.name}</p>
            </a>
        `;
    });

    let templateUserClubsFinal = `
        <section class="player-clubs">
            <div class="player-clubs-info">
                <p class="player-clubs-info-title">Clubes</p>
                <p class="player-clubs-info-totalClubs">Clubes totales: ${userClubs.clubs.length}</p>
            </div>
            ${templateUserClubs}
        </section>
    `;

    mainContent.insertAdjacentHTML('beforeend', templateUserClubsFinal);
    return 0;
}

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

function openStatDropdown(e)
{
    let btn = e.target;
    let toChangeVisibilityContent = btn.closest('.player-stats-info')
                                    .getElementsByClassName('player-stats-content')[0];
    if(btn.value === 1)
    {
        btn.closest('.fa-solid').classList.remove('fa-angle-up');
        btn.closest('.fa-solid').classList.add('fa-angle-down');
        toChangeVisibilityContent.style.display = 'none';
        btn.value = 0;
    } else {
        btn.closest('.fa-solid').classList.add('fa-angle-up');
        btn.closest('.fa-solid').classList.remove('fa-angle-down');
        toChangeVisibilityContent.style.display = 'block';
        btn.value = 1;
    }
    btn.parentElement.blur();
}

window.addEventListener('onload', start());

async function start()
{
    displayUserPrincipalData();
    await delay(10);
    displayUserStats();
    await delay(10);
    displayUserClubs(); 
}