import imgCardTpl from './tamplates/imgCard.hbs';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    gallery: document.querySelector(".gallery"),
    searchBtn: document.querySelector(".submitBtn"),
    inputedQ: document.querySelector(".input"),
    loadMoreBtn: document.getElementById("load-more"),
}

const options = {
    KEY : '31754990-fc9ecefcb1bab85f0803676bc',
    PER_PAGE: 40,
    DEBOUNCE_DELAY: 300,
    q : '',
    image_type : 'photo',
    orientation :  'horizontal',
    safesearch : true,
    url: `https://pixabay.com/api/`,
    page: 1,
    
}

refs.searchBtn.addEventListener('click' ,onSearchBtnClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);


function onSearchBtnClick(e) {
    e.preventDefault();
    options.q = refs.inputedQ.value;
    fetchImg();
    toggleHidden();
}

function onLoadMoreBtnClick() {
    options.page++;
    fetchImg();
}

function fetchImg() {
    let res;
     res =  fetch (`${options.url}?key=${options.KEY}&q=${options.q}&image_type=${options.image_type}&orientation=${options.orientation}&sefesearch=${options.safesearch}&page=${options.page}&per_page=${options.PER_PAGE}`)
         .then(res => {
            return res.json();
         })
         .then(images => {
            console.log(images);
             if (images.hits.length > 0) {
                 refs.gallery.innerHTML = imgCardTpl(images.hits);
             }
             else  {
                  Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
             }
         })

};

function toggleHidden() {
    refs.loadMoreBtn.classList.toggle("hidden");
    
    // add / remove
}

function onFetchError(err) {
    console.log(err);
}
