const navHomeBtnEl = document.querySelector("#nav-homeBtn");
const gameBtnEl = document.querySelector("#game-button");
const storyBtnEl = document.querySelector("#story-button");
const quizBtnEl = document.querySelector("#quiz-button");
const dropBtnEl = document.querySelector(".dropdown-button");
const imageHolderArrayEl = document.querySelectorAll('.slideshow-image');
const slides = document.getElementsByClassName("slides");
const closeBtnEl = document.querySelector("#close-button");

const filePath = window.location.pathname;
const page = filePath.split("/").pop();

const path = "../images/";
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
path + "Leonardo_Diffusion_XL_silhouette_of_a_women_at_night_high_on_t_0.jpg",
path + "cherry-blossom-fight.jpg",
path + "cherry-blossom-fight-alt.jpg",
path + "cherry-blossom.jpg",
path + "desert_warfare.jpg",
path + "desert_warfare_2.jpg",
path + "tropical_beach.jpg",];

let splashImages = [
path + "Leonardo_Diffusion_XL_silhouette_of_a_women_at_night_high_on_t_0.jpg",
path + "cherry-blossom-fight.jpg",
path + "cherry-blossom-fight-alt.jpg",
path + "cherry-blossom.jpg",
path + "desert_warfare.jpg",
path + "desert_warfare_2.jpg",
path + "tropical_beach.jpg",
];

let slideIndex = 0;
let cycleImageIndex = Math.floor(Math.random() * localImages.length);
let responseImageIndex = Math.floor(Math.random() * splashImages.length);

if(document.querySelector(".response-image")) { document.querySelector(".response-image").src = splashImages[responseImageIndex]; }
const getStoredImages = async () => {
    const storedImages = await fetch('../api/images', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
          },
      });
    
    const images = await storedImages.json();
}

const plusSlides = (n) => {
  showSlides(slideIndex += n);
}

const currentSlide = (n) => {
  showSlides(slideIndex = n);
}

const showSlides = async (n) => {
  let i;
  let dots = document.getElementsByClassName("dot");

  if(!slides || !dots) { return; }
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
};

dropBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector(".dropdown-container").classList.toggle("show");
});

closeBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector(".dropdown-container").classList.toggle("show");
})

getStoredImages();
if(page == "") {
    showSlides(slideIndex);
    cycleImages();
}
