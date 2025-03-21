// remove aside popup on top of screen:
document.querySelector("aside.sticky")?.remove();

let allPayWalledImages = document.querySelectorAll(
  'div.blur-0 img[alt="Square Go screen"]',
);

allPayWalledImages.forEach((img, index) => {
  // extract image url without param:
  img.src = img.src.split("?")[0];

  // remove class backgrop-blur from parent container
  img.parentElement.classList.forEach(
    (cls) => cls.includes("blur") && img.parentElement.classList.remove(cls),
  );

  console.log(`Unblur successully image: ${index}`);
});
