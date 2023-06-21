import {fetchMovieAvailability,fetchMovieList} from "./api.js";

const mainContainerEl = document.querySelector('.main-container');


const createHtmlElandAddContent = (elName, content) => {
    const el = document.createElement(elName);
    if(content){
        el.textContent = content
    }
    return el
}

const createOneMovie = (movieData) => {
    const {name, imgUrl} = movieData;
    // // creating required elements
    // const movieNameEl = createHtmlElandAddContent('p', name);
    // const movieImageEl = createHtmlElandAddContent('img');
    // const movieContainerEl = createHtmlElandAddContent('a');

    // // adding properties
    // movieImageEl.setAttribute('src', imgUrl);
    // // movieImageEl.classList.add('image-container');
    // // appending elements
    // movieContainerEl.append(movieImageEl,movieNameEl);
    // return movieContainerEl

    const movieContainerEl = `<a class="movie-link" href="/${name}">
    <div class="movie" data-d="${name}">
    <div class="movie-img-wrapper" style="background-image: url('${imgUrl}'); background-size: cover;">
    </div>
    <h4>${name}</h4>
    </div>
    </a>`
    return movieContainerEl
}

const showMovieList = () => {
    // show the loader
    const loader = createHtmlElandAddContent('p', 'loading...');
    mainContainerEl.appendChild(loader)
    // console.log(loader);

    fetchMovieList()
    .then((movieList) => {
        
        // remove the loader and show the data
        loader.remove();
        let combinedMovieEl;
        movieList.forEach(movie => {
            const movieEl = createOneMovie(movie);
            console.log(movieEl);
            combinedMovieEl = mainContainerEl.innerHTML + movieEl
            mainContainerEl.innerHTML = combinedMovieEl;
        });
        
        
    })
}

showMovieList();