// COHORT DATE: update this one value before publishing.
const COHORT_START_DATE = "[COHORT START DATE]";

document.querySelectorAll(".cohort-date").forEach((element) => {
  element.textContent = COHORT_START_DATE;
});

document.getElementById("year").textContent = new Date().getFullYear();
