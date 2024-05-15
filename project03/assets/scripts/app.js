const addFilm = document.getElementbyid('add-modal');
const btnadd = document.querySelector('header button');
const btndlt = document.getElementById('delete-modal');
const backdrop = document.getElementById('backdrop');

const btnCancel = addFilm.querySelector('.btn--passive');
const btnConfirmAdd = btnCancel.nextElementSibling;

const title = document.getElementById('title');
const image = document.getElementById('image-url');
const classific = document.getElementById('rating');
const listFilms = document.getElementById('movie-list');

const section = document.getElementById('entry-text');

//const userInputs = addMovieModal.querySelectorAll('input');

const filmes = [];

const refreshList = () => {

    if(filmes.length === 0){
        section.style.display = 'block';
    } else {section.style.display = 'none';}
    
    // WORKING ON IT ... percorrer o array e criar para cada objeto um elemento li e adicionar no UL (novo elemento no DOM)

}

const mostraModalFilm = () => {

    addFilm.classList.add('visible');
    backdrop.classList.toggle('visible');
}

const btnCancelHandler = () => { 
    addFilm.classList.remove('visible');
    backdrop.classList.toggle('visible');
}

const btnConfirmAddHandler = () => {

    const campTitle = title.value;
    const campImage = image.value;
    const campClass = classific.value;

    if( campTitle.trim() == '' || campImage.trim() == '' || campClass.trim() == ''){
        alert('Need to write in the camps.');
        return;
    }

    const newFilm = {
        id: '1',
        titulo: '007',
        image: 'teste',
        classification: 5
    };


    filmes.push(newFilm);
    addFilm.classList.remove('visible');
    backdrop.classList.toggle('visible');

    console.log(filmes);
    refreshList();
}

const fecharJanela = () => {

    btndlt.classList.remove('visible');
    backdrop.classList.toggle('visible');
}

btnadd.addEventListener('click', mostraModalFilm);
btnCancel.addEventListener('click', btnCancelHandler);
btnConfirmAdd.addEventListener('click', btnConfirmAddHandler);

