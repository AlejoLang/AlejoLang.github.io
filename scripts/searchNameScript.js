let searchInp = document.getElementsByClassName('search-inp')[0],
    searchBtn = document.getElementsByClassName('search-button')[0],
    resultSec = document.getElementsByClassName('results')[0];

//Registra si se presiono la tecla Enter dentro del input para poder buscar

searchInp.addEventListener('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        search();
        hideKeyboard(searchInp);
    }
});

// Funcion sacada de 
// https://stackoverflow.com/questions/8335834/how-can-i-hide-the-android-keyboard-using-javascript
//Esconde el teclado de android

function hideKeyboard(element) {
    element.attr('readonly', 'readonly'); // Force keyboard to hide on input field.
    element.attr('disabled', 'true'); // Force keyboard to hide on textarea field.
    setTimeout(function() {
        element.blur();  //actually close the keyboard
        // Remove readonly attribute after keyboard is hidden.
        element.removeAttr('readonly');
        element.removeAttr('disabled');
    }, 100);
}

//Funcion que busca y obtiene el JSON de la API de Chess.com
//Tambien quita el focus en el boton de busqueda y borra el texto del input

function search()
{
    const url = 'https://api.chess.com/pub/player/' + searchInp.value.normalize("NFD")
                                                                    .replace(/[\u0300-\u036f]/g, "")
                                                                    .replaceAll(' ', '-');
    searchInp.value = "";
    searchBtn.blur();

    fetch(url)
    .then(data => { return data.json(); })
    .then(res => { displayResults(res); })
}

//Obtiene un el codigo de pais del usuario

async function getUserFlag(countryUrl)
{
    return fetch(countryUrl)
    .then(data => { return data.json(); })
    .then(res => { return res; })
}

// Muestra los resultados si se encontro el ususarion, caso contario 
// alerta que el usuario no se encontro

async function displayResults(results)
{
    if(results.code == 0) {alert("Nombre inválido"); return;} // Si no se encntro el nombre, alerta y sale de la funcion
    if(!results.avatar) {results.avatar = './Images/user-default.png'} // Si el usuario no tiene un avatar, se le asigna uno default

    resultSec.innerHTML = '';

    getUserFlag(results.country)
    .then(res => {return res.name;})
    .then(country => {

        let countryFlagLink;
        if(country != 'XX'){
            countryFlagLink = "https://countryflagsapi.com/svg/" + country;
        } else {
            countryFlagLink = "./images/flag-default.jpg"
        }

        const template =`
                    <a href="./infoplayer.html?${results.username}" class="user-listed">
                        <img src="${results.avatar}" alt="${results.name}'s profile pic" class="user-listed-profile-pic">
                        <div class="user-listed-info">
                            <p class="user-listed-info-name">${results.username}</p>
                            <img src="${countryFlagLink}" alt="${country}" class="user-listed-info-country-flag">
                        </div>
                    </a>`;
    
    resultSec.insertAdjacentHTML('beforeend', template);
    })
}
