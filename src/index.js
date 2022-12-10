import imgCardTpl from './tamplates/imgCard.hbs';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import debounce from "lodash.debounce";
import axios from 'axios';


const refs = {
    gallery: document.querySelector(".gallery"),
    searchBtn: document.querySelector(".submitBtn"),
    inputedQ: document.querySelector(".input"),
    loadMoreBtn: document.getElementById("load-more"),
}

const options = {
    key : '31754990-fc9ecefcb1bab85f0803676bc',
    per_page: 40,
    q : '',
    image_type : 'photo',
    orientation :  'horizontal',
    safesearch : true,
    page: 1,
}
const host = `https://pixabay.com/api/`;

refs.searchBtn.addEventListener('click' ,onSearchBtnClick);


function onSearchBtnClick(e) {
    e.preventDefault();
    window.removeEventListener("scroll", handleInfinityScroll);
    options.q = refs.inputedQ.value;
    refs.gallery.innerHTML = '';
    options.page = 1;
    fetchImg();
}





async function fetchImg() {
    let url = [];
    for (const param in options)
    {
        url.push(`${param}=${options[param]}`);
    }
    await axios.get(`${host}?${url.join('&')}`)
        .then(res => {
            if (res.data.totalHits > 0) {
                renderGallery(res.data);
                NotifyFoundImages(res.data.totalHits);
                ScrollPage();
                window.addEventListener("scroll", handleInfinityScroll);
            }
            else {
                NotifyNoImagesFound()
            }
        })
        .catch(err => onFetchError(err))

};

function renderGallery(images) {
    if (images.hits.length > 0) {
        refs.gallery.innerHTML += imgCardTpl(images.hits);
    }
    else {
        EndOfRange();
    }

    ActivateLightbox();
}


function onFetchError(err) {
    if (err.response.status == 400)
        EndOfRange();
    //console.log(err)
}

const EndOfRange = debounce(() => { Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.") }, 3000, { 'maxWait': 0, 'leading': true, 'trailing':false});



const handleInfinityScroll = () => {
    const EndOfPage = window.innerHeight + window.scrollY >= document.body.offsetHeight;

    if (EndOfPage) {
        options.page++;
        fetchImg();
    }
}

function NotifyFoundImages(count) {
    if (options.page == 1 && count > 0)
        Notiflix.Notify.info(`Hooray! We found ${count} images.`)
}

function ScrollPage()
{
    if (options.page == 1) return;

    const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();
    
    window.scrollTo({
        top: window.scrollY + cardHeight,
        behavior: "smooth"
    })
}

function NotifyNoImagesFound() {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");

    }
    
function ActivateLightbox() {
        let gallery = new SimpleLightbox(".gallery a", {
        captionsData: "alt",
        captionsDelay: 250,
        doubleTapZoom: 1,
        scrollZoom: false
    });

    gallery.on('shown.simplelightbox', function () {
        let el = document.querySelector(".sl-image");
        el.addEventListener('click', (el) => gallery.close(el));
    });
}

// function onLoadMoreBtnClick() {
//     fetchImg();
// }
// function toggleHidden() {
//     refs.loadMoreBtn.classList.toggle("hidden");
// }