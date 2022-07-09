let toggleColorModeBtn = document.getElementsByClassName('toggleColorMode')[0];
let lightModeLink = document.getElementById('lightModeLink');

/* Configuracion de los valores iniciales*/

if(localStorage.getItem('colorSch')){
    toggleColorModeBtn.value = localStorage.getItem('colorSch');
    if(toggleColorModeBtn.value == 0){
        lightModeLink.setAttribute('href', '');
    } else {
        lightModeLink.setAttribute('href', './styles/lightMode.css');
    }
} else {
    if(window.matchMedia("(prefers-color-scheme: light)").matches)
    {
        toggleColorModeBtn.value = 1;
        lightModeLink.setAttribute('href', './styles/lightMode.css');
    } else
    {
        toggleColorModeBtn.value = 0;
        lightModeLink.setAttribute('href', '');
    }
}

/* Cambio de color */ 

function handleColorChange(){

    if(toggleColorModeBtn.value == 1){
        toggleColorModeBtn.value = 0;
        lightModeLink.setAttribute('href', '');
    } else {
        toggleColorModeBtn.value = 1;
        lightModeLink.setAttribute('href', './styles/lightMode.css');
    }
    localStorage.setItem('colorSch', toggleColorModeBtn.value);
}
