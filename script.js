const countElement = document.querySelector("#count");
const incrementButton = document.querySelector("#incrementButton");

let count = 0;

incrementButton.addEventListener("click", () => {
  count += 1;
  countElement.textContent = count;
});
