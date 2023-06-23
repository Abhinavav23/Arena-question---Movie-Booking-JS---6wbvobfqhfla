import {fetchMovieAvailability,fetchMovieList} from "./api.js";

const mainContainerEl = document.querySelector('.main-container');
const seatSelectorContainerEl = document.querySelector('#booker');
const seatSelectorHeaderEl = document.querySelector('#booker>h3');
const seatSelectorButtonEl = document.querySelector('#book-ticket-btn');
const seatSelectorGrid = document.querySelector('#booker-grid-holder');

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
        seatSelectorHeaderEl.classList.remove('v-none');

        // const elToRemove = document.querySelector('.booking-grid');
        // if(elToRemove){
        //     elToRemove.remove();
        // }
    
        // seatSelectorGrid.innerHTML = ''

        while(seatSelectorGrid.lastChild){
            seatSelectorGrid.removeChild(seatSelectorGrid.lastChild)
        }

        // try running a loop on the node list and remove elements

        createSeatElements(seats);
        createSeatElements(seats, true);
    })
}

const handleSelectedSeats = (e) => {
    const el = e.target;
    if(el.classList.contains('available-seat')){
        el.classList.toggle('selected-seat');
    }

    if(el.classList.contains('selected-seat')){
        selectedSeats.push(el.textContent)
    } else{
        // remove the element from the array which is eq to the clicked el
        selectedSeats = selectedSeats.filter(id => id !== el.textContent)
    }

    if(selectedSeats.length > 0){
        seatSelectorButtonEl.classList.remove('v-none');
    } else{
        seatSelectorButtonEl.classList.add('v-none');
    }
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
        seat.addEventListener('click', handleSelectedSeats)
        gridWrapper.append(seat)
    }
    seatSelectorGrid.append(gridWrapper);
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

const showFormToAddInfo = () => {
    // try this with methods
    seatSelectorButtonEl.classList.add('v-none');
    seatSelectorHeaderEl.classList.add('v-none');
    const formEl = `
    <section id="confirm-purchase">
        <h2>confirm your booking for seat No : ${selectedSeats.join(", ")}</h2>
        <form id="customer-detail-form">
            <label for="email">Email</label>
            <input type="email" id="email" required/>
            <br>
            <br>
            <label for="phone">phone No</label>
            <input type="text" id="phone" required/>
            <br>
            <br>
            <button type="submit">purchase</button>
        </form>
    </section>
    `
    seatSelectorGrid.innerHTML = ''
    seatSelectorGrid.innerHTML = formEl

    document.querySelector('#customer-detail-form').addEventListener('submit', () => {
        
        const email = document.querySelector('#email').value
        const phone = document.querySelector('#phone').value;
        seatSelectorGrid.innerHTML = ''
        console.log(email);
        console.log(phone);
        const successHtml = `
        <section id="success">
            <h2>Booking Details</h2>
            <div>seats: ${selectedSeats.join(", ")}</div>
            <div>Phone No: ${phone}</div>
            <div>Email: ${email}</div>
        </section>
        `

        seatSelectorGrid.innerHTML = successHtml
    })

}

seatSelectorButtonEl.addEventListener('click', () => {
    showFormToAddInfo()
});

showMovieList();