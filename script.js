const SUPABASE_URL = "https://eelsmcqdfixygtsfbwbs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlbHNtY3FkZml4eWd0c2Zid2JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwMjEyMzEsImV4cCI6MjA5NzU5NzIzMX0.fMu_YNrbMVfJGOmNc6A_LfVXsP_ay6guamnt0Oy6v7I";

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
