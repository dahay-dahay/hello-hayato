const countElement = document.querySelector("#count");
const decrementButton = document.querySelector("#decrementButton");
const resetButton = document.querySelector("#resetButton");
const incrementButton = document.querySelector("#incrementButton");

let count = 0;

const updateCount = () => {
  countElement.textContent = count;
};

decrementButton.addEventListener("click", () => {
  count -= 1;
  updateCount();
});

resetButton.addEventListener("click", () => {
  count = 0;
  updateCount();
});

incrementButton.addEventListener("click", () => {
  count += 1;
  updateCount();
});
