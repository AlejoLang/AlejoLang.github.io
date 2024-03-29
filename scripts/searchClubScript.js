import fetchData from './tools/fetch.js'

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
// Esconde el teclado de android

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

/* Cambia algunos caracteres que la API ignora para las consultas */

const normalizeSearch = (txt) => {
    let normalizedText = txt.normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .trim()
                            .replaceAll('/', '')
                            
    
    let index = normalizedText.indexOf('-');
    let allIndex = new Array();
    while(index != -1){
        allIndex.push(index);
        index = normalizedText.indexOf('-', index + 1);
    }
    
    let normalizedTextArr = normalizedText.split('');

    allIndex.forEach(index => {

        if(normalizedTextArr[index - 1] == ' '){
            normalizedTextArr.splice(index - 1, 1);
            index -= 1;
        }
        console.log(normalizedTextArr)
        if(normalizedTextArr[index + 1] == ' '){
            normalizedTextArr.splice(index + 1, 1);
        }

    });

    normalizedText = normalizedTextArr.join('');

    return normalizedText.replaceAll('.', '-')
                        .replaceAll(' ', '-');
}

//Funcion que busca y obtiene el JSON de la API de Chess.com
//Tambien quita el focus en el boton de busqueda y borra el texto del input

function search()
{
    const url = 'https://api.chess.com/pub/club/' + normalizeSearch(searchInp.value); console.log(normalizeSearch(searchInp.value))
    
    searchInp.value = "";
    searchBtn.blur();
    fetchData(url)
        .then(res => {displayResults(res);})
}

// Muestra los resultados si se encontro el ususarion, caso contario 
// alerta que el usuario no se encontro

async function displayResults(results)
{
    if(results.code == 0)  // Si no se encntro el nombre, alerta y sale de la funcion
    {
        document.getElementsByClassName('errorAlert')[0].showModal();
        return;
    }

    results.icon ??= './images/club-default.jpg'; // Si el club no tiene un avatar, se le asigna uno default

    resultSec.innerHTML = '';

    const country = await fetchData(results.country);
    
    let countryFlagLink = 'https://countryflagsapi.com/svg/' + country.name;

    if (country.name == 'Russia') {
        countryFlagLink = 'https://countryflagsapi.com/svg/' + country.code;
    } else if(country.code == 'FK'){
        country.name = 'Argentina';
        countryFlagLink = 'https://countryflagsapi.com/svg/Argentina';
    } else if(country.code == 'XX' || country.name == 'International' || !country.code){
        country.name = 'International';
        countryFlagLink = './images/flag-default.jpg';
    }
    
        const template =`
                    <a href="./infoClub.html?${results.url.slice(results.url.lastIndexOf('/') + 1)}
                    " class="club-listed">
                        <img src="${results.icon}" alt="${results.name}'s profile pic" class="club-listed-icon">
                        <div class="club-listed-info">
                            <p class="club-listed-info-name">${results.name}</p>
                            <img src="${countryFlagLink}" alt="${country.name}" class="club-listed-info-country-flag">
                            <div class = "club-listed-info-members">
                                <i class="fa-solid fa-users"></i>
                                ${results.members_count}
                            </div>
                            <p class="club-listed-info-description">${results.description.replaceAll(/<\/?[^>]+(>|$)/g, "")}</p>
                        </div>
                    </a>`;
    
    resultSec.insertAdjacentHTML('beforeend', template);
    
}

/* Codigo de https://codepen.io/geckotang/post/dialog-with-animation */

function closeModal()
{
    dialog = document.getElementsByClassName('errorAlert')[0];
    dialog.classList.add('hide');
    dialog.addEventListener('webkitAnimationEnd', function(){
        dialog.classList.remove('hide');
        dialog.close();
        dialog.removeEventListener('webkitAnimationEnd',  arguments.callee, false);
    }, false);
}

