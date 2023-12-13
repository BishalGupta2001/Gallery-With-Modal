let gallery = document.querySelector(".gallery");
let loading = document.querySelector(".loading");
let previous = document.querySelector(".previous");
let next = document.querySelector(".next");
let modal = document.querySelector(".modal");
let modalCloseButton = document.querySelector(".modalCloseButton");
let modalImageContainer = document.querySelector(".modalImageContainer");

modalCloseButton.addEventListener("click", closeModal);
previous.addEventListener("click", () => changeImages("prev"));
next.addEventListener("click", () => changeImages("next"));

let currentModalImageIndex = -1;
let images = [];

// fetching API Function
const fetchImage = async () => {
  try {
    const response = await (
      await fetch("https://api.slingacademy.com/v1/sample-data/photos?limit=40")
    ).json();
    images = response.photos;

    return addImagesToGallery(images);
  } catch (error) {
    console.log(error);
  } finally {
    closeLoading(); // and finally we call loading function that will close after async
  }
};

fetchImage();

function closeLoading() {
  loading.style.display = "none"; // loading selector ko off kardiye
}

function addImagesToGallery(photos) {
  photos.map((photo, index) => {
    // Create a container div for each image
    const imgDiv = document.createElement("div");

    // Create an image element
    const img = document.createElement("img");

    // Add a class to the container div
    imgDiv.classList.add("imageContainer");

    // Set the image source and alt attributes
    img.src = photo.url;
    img.alt = photo.title;

    // Add event listeners for image load and click
    img.addEventListener("load", () => handleImgLoad(imgDiv));
    img.addEventListener("click", () => openModal(index));

    // Append the image to the container div
    imgDiv.appendChild(img);

    // Append the container div to the gallery
    gallery.appendChild(imgDiv);
  });
}

function handleImgLoad(imgDiv) {
  imgDiv.classList.add("loaded");
}

// removes img from modal
function removeModalImage() {
  const img = modalImageContainer.querySelector("img");
  if (img) {
    modalImageContainer.removeChild(img);
  }
}

function addModalImage(index) {
  currentModalImageIndex = index;
  const img = document.createElement("img");

  img.src = images[index].url; // not understand
  img.alt = images[index].title; // not understand

  modalImageContainer.appendChild(img);
}

function openModal(index) {
  addModalImage(index);
  modal.style.display = "block";
}

function closeModal() {
  removeModalImage();
  modal.style.display = "none";
}

function changeImages(direction) {
  removeModalImage();

  if (direction == "prev") {
    currentModalImageIndex -= 1;
  } else if (direction == "next") {
    currentModalImageIndex += 1;
  }

  if (currentModalImageIndex < 0) {
    currentModalImageIndex = images.length - 1;
  } else if (currentModalImageIndex === images.length) {
    currentModalImageIndex = 0;
  }
  addModalImage(currentModalImageIndex);
}

document.addEventListener("keydown", (event) => {
  if (event.key == "ArrowLeft") {
    // img ko change karega
    changeImages("prev");
  } else if (event.key == "ArrowRight") {
    changeImages("next");
  } else if (event.key == "Escape") {
    closeModal();
  }
});
