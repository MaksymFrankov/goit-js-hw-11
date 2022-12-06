import imgCardTpl from './tamplates/imgCard.hbs';

const refs = {
    gallery: document.querySelector(".gallery")
}



const options = {
KEY : '31754990-fc9ecefcb1bab85f0803676bc',
q : 'work out',
image_type : 'photo',
orientation :  'horizontal',
safesearch : true,
url : `https://pixabay.com/api/`,
}

function fetchImg() {
    let res;
     res =  fetch (`${options.url}?key=${options.KEY}&q=${options.q}&image_type=${options.image_type}&orientation=${options.orientation}&sefesearch=${options.safesearch}`)
         .then(res => {
             return res.json();
         })
         .then(images => {
             console.log(images.hits);
             refs.gallery.innerHTML = imgCardTpl(images.hits);
         })

};


fetchImg()