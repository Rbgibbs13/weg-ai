const navHomeBtnEl = document.querySelector("#nav-homeBtn");
const gameBtnEl = document.querySelector("#game-button");
const storyBtnEl = document.querySelector("#story-button");
const quizBtnEl = document.querySelector("#quiz-button");
const imageHolderArrayEl = document.querySelectorAll('.slideshow-image');
const slides = document.getElementsByClassName("slides");

const path = "../images/";
let cycleImageIndex = 0;
let slideIndex = 0;

let localImages = [
path + "Leonardo_Creative_A_forest_in_the_mountains_0.jpg",
path + "Leonardo_Creative_A_forest_in_the_mountains_0(1).jpg",
path + "Leonardo_Creative_A_forest_in_the_mountains_0(2).jpg",
path + "Leonardo_Creative_A_forest_in_the_mountains_0(3).jpg",
path + "Leonardo_Creative_A_forest_in_the_mountains_0(4).jpg",
path + "Leonardo_Creative_A_forest_in_the_mountains_1.jpg",
path + "Leonardo_Creative_A_forest_in_the_mountains_1(1).jpg",
path + "Leonardo_Creative_A_forest_in_the_mountains_1(2).jpg",
path + "Leonardo_Creative_A_forest_in_the_mountains_1(3).jpg",
path + "Leonardo_Creative_A_forest_in_the_mountains_3.jpg",
path + "Leonardo_Creative_A_forest_in_the_mountains_3(1).jpg",
path + "Leonardo_Creative_A_forest_in_the_mountains_3(2).jpg",
path + "Leonardo_Diffusion_XL_silhouette_of_a_women_at_night_high_on_t_0.jpg",];

const plusSlides = (n) => {
  showSlides(slideIndex += n);
}

const currentSlide = (n) => {
  showSlides(slideIndex = n);
}

const showSlides = (n) => {
  let i;
  let dots = document.getElementsByClassName("dot");

  if (n >= slides.length) {slideIndex = 0};
  if (n < 0) {slideIndex = slides.length - 1};

  for (i = 0; i < slides.length; i++) { slides[i].style.display = "none"; }
  for (i = 0; i < dots.length; i++) { dots[i].className = dots[i].className.replace(" active", ""); }

  slides[slideIndex].style.display = "block";
  dots[slideIndex].className += " active";
};

const cycleImages = () => {
    const cycle = setInterval(() => {
        fadeOutEffect(slides[slideIndex]);
    }, 10000);
};

const changeImage = () => {
    for(let i = 0; i < imageHolderArrayEl.length; i++) {
        if(cycleImageIndex + i >= localImages.length) {
            imageHolderArrayEl[i].src = localImages[i-1];
        } else {
            imageHolderArrayEl[i].src = localImages[cycleImageIndex + i];
        }
    };

    cycleImageIndex++;
    if(cycleImageIndex >= localImages.length) { cycleImageIndex = 0};
    currentSlide(slideIndex);
};

const fadeOutEffect = (element) => {
    const fadeOut = setInterval(() => {
        if(!element.style.opacity) {
            element.style.opacity = 1;
        }
        if(element.style.opacity > 0.1) {
            element.style.opacity -= 0.05;
        } else {
            changeImage();
            fadeInEffect(element);
            clearInterval(fadeOut);
        }
    }, 40);
};

const fadeInEffect = (element) => {
    const fadeIn = setInterval(() => {
        if(element.style.opacity < 1) {
            element.style.opacity -= -0.05;
        } else {
            clearInterval(fadeIn);
        }
    }, 40);
}

const goHome = async() => {
    const game = await fetch('/', {
        method: 'GET',
    }).then((res) => {
        res.json();
    }).then((data) => {
        console.log("Get success HOME route");
    }).catch((error) => {
        res.status(404).error(error);
    });
};

const startGame = async() => {
    await fetch('/game', {
        method: 'GET',
    }).then((res) => {
        res.json();
    }).then((data) => {
        console.log("Get success GAME route");
    }).catch((error) => {
        res.status(404).error(error);
    });
};

const startStory = async() => {
    await fetch('/story', {
        method: 'GET',
    }).then((res) => {
        res.json();
    }).then((data) => {
        console.log("Get success story route");
    }).catch((error) => {
        res.status(404).error(error);
    });
};

const startQuiz = async() => {
    await fetch('/quiz', {
        method: 'GET',
    }).then((res) => {
        res.json();
    }).then((data) => {
        console.log("Get success quiz route");
    }).catch((error) => {
        res.status(404).error(error);
    });
};

navHomeBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    goHome();
});
gameBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    startGame();
});
storyBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    startStory();
});
quizBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    startQuiz();
});

showSlides(slideIndex);
cycleImages();