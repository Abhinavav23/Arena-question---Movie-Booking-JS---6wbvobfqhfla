import {fetchMovieAvailability,fetchMovieList} from "./api.js";

const mainContainerEl = document.querySelector('.main-container');
const seatSelectorContainerEl = document.querySelector('#booker');
const seatSelectorHeaderEl = document.querySelector('#booker>h3');
const seatSelectorButtonEl = document.querySelector('#book-ticket-btn');
const seatSelectorGrid = document.querySelector('#booker-grid-holder');
console.log(seatSelectorHeaderEl);


const createHtmlElandAddContent = (elName, content) => {
    const el = document.createElement(elName);
    if(content){
        el.textContent = content
    }
    return el
}
const loader = createHtmlElandAddContent('p', 'loading...');
loader.setAttribute('id', 'loader');

let selectedSeats = [];

const fetchSeatAvailability = (movieName) => {
    seatSelectorContainerEl.appendChild(loader)
    fetchMovieAvailability(movieName)
    .then((seats) => {
        loader.remove();
        seatSelectorHeaderEl.classList.toggle('v-none');
        seatSelectorButtonEl.classList.toggle('v-none');
        console.log(seats);
        createSeatElements(seats);
        createSeatElements(seats, true);
    })
}

const createSeatElements = (availableSeats, nextSeats) => {
    const gridWrapper = createHtmlElandAddContent('div');
    gridWrapper.classList.add('booking-grid')
    const addValue = nextSeats ? 12: 0;
   
    for(let i = 1+addValue; i<13+addValue; i++){
        const seat = createHtmlElandAddContent('div', i);
        seat.setAttribute('id', `booking-grid-${i}`);
        const className = availableSeats.includes(i) ? 'available-seat' : 'unavailable-seat'
        seat.classList.add(className);
        seat.addEventListener('click', (e) => {
            const el = e.target;
            if(el.classList.contains('available-seat')){
                el.classList.toggle('selected-seat');
                selectedSeats.push(e.target.textContent)
            }
        })
        gridWrapper.append(seat)
    }
    seatSelectorGrid.append(gridWrapper);
    console.log(gridWrapper);
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

    
    const movieEl = `<a class="movie-link">
    <div class="movie" data-id="${name}">
    <div class="movie-img-wrapper" style="background-image: url('${imgUrl}'); background-size: cover;">
    </div>
    <h4>${name}</h4>
    </div>
    </a>`

    const movieContainerEl = createHtmlElandAddContent('div');
    movieContainerEl.innerHTML = movieEl
    movieContainerEl.addEventListener('click', (e) => {
        console.log(e.target.parentElement.dataset.id);
        // make an api call and get the data
        const {id} = e.target.parentElement.dataset
        fetchSeatAvailability(id)
    })
    return movieContainerEl
}

const showMovieList = () => {
    // show the loader
    mainContainerEl.appendChild(loader)
    // console.log(loader);

    fetchMovieList()
    .then((movieList) => {
        // remove the loader and show the data
        loader.remove();
        movieList.forEach(movie => {
            const movieEl = createOneMovie(movie);
            // combinedMovieEl = mainContainerEl.innerHTML + movieEl
            // mainContainerEl.innerHTML = combinedMovieEl;
            mainContainerEl.append(movieEl)
        });
    })
}

seatSelectorButtonEl.addEventListener('click', () => {
    console.log(selectedSeats);
});

showMovieList();