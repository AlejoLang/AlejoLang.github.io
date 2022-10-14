/*Codigo de https://codepen.io/geckotang/post/dialog-with-animation*/


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