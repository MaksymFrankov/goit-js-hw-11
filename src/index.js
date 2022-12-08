import imgCardTpl from './tamplates/imgCard.hbs';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import debounce from "lodash.debounce";


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
    page: 0,
}
const host = `https://pixabay.com/api/`;

refs.searchBtn.addEventListener('click' ,onSearchBtnClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);


function onSearchBtnClick(e) {
    e.preventDefault();
    options.q = refs.inputedQ.value;
    refs.gallery.innerHTML = '';
    options.page = 0;
    fetchImg();
    toggleHidden();
}

function onLoadMoreBtnClick() {
    fetchImg();
}



function fetchImg() {
    options.page++;
    let res;
    /*
    `${options.url}?key=${options.KEY}&q=${options.q}&image_type=${options.image_type}&orientation=${options.orientation}&sefesearch=${options.safesearch}&page=${options.page}&per_page=${options.PER_PAGE}`
    */
    let url = [];
    for (const param in options)
    {
        url.push(`${param}=${options[param]}`);
    }
    res = fetch(`${host}?${url.join('&')}`)
        .then(res => {
            return res.json();
        })
        .then(res => {
            renderGallery(res);
            return res;
        })
        .then(res => {
            if (options.page == 1)
                Notiflix.Notify.info(`Hooray! We found ${res.totalHits} images.`)
        })
        .catch(err => onFetchError(err))

};

function renderGallery(images)
{
    console.log(images)
    if (images.hits.length > 0) {
        refs.gallery.innerHTML += imgCardTpl(images.hits);
    }
    else  {
         Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }

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

function toggleHidden() {
    refs.loadMoreBtn.classList.toggle("hidden");
    
    // add / remove
}

function onFetchError(err) {
    throttleFun();
}

const throttleFun = debounce(() => { Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.") }, 3000, { 'maxWait': 0, 'leading': true, 'trailing':false});

const handleInfinityScroll = () => {
    const EndOfPage = window.innerHeight + window.scrollY >= document.body.offsetHeight;

    if (EndOfPage) {
        fetchImg();
    }
}

window.addEventListener("scroll", handleInfinityScroll);




