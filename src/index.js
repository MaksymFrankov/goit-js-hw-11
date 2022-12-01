const options = {
key : '31754990-fc9ecefcb1bab85f0803676bc',
q : 'cat',
image_type : 'photo',
orientation :  'horizontal',
safesearch : true,
url : `https://pixabay.com/api/`,
}

async function fetchImg() {
    const res = await fetch (`${options.url}?key=${options.key}&q=${options.q}&image_type=${options.image_type}&orientation=${options.orientation}&sefesearch=${options.safesearch}`);
    console.log(res);

};
fetchImg()