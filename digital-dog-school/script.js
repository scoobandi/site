document.getElementById("year").textContent = new Date().getFullYear();

document.querySelectorAll("[data-event]").forEach(function (el) {
  el.addEventListener("click", function () {
    var eventName = el.getAttribute("data-event");
    var location = el.getAttribute("data-location") || "";

    if (typeof fbq === "function") {
      fbq("trackCustom", eventName, { location: location, page: "dds" });
    }

    if (typeof gtag === "function") {
      gtag("event", eventName, { location: location, page: "dds" });
    }
  });
});

var proofLightbox = document.getElementById("proof-lightbox");
var proofLightboxImg = document.getElementById("proof-lightbox-img");
var proofLightboxClose = document.getElementById("proof-lightbox-close");

function closeProofLightbox() {
  if (!proofLightbox || !proofLightboxImg) return;
  proofLightbox.style.display = "none";
  proofLightboxImg.src = "";
}

document.querySelectorAll("[data-lightbox-src]").forEach(function (el) {
  el.addEventListener("click", function () {
    if (!proofLightbox || !proofLightboxImg) return;
    proofLightboxImg.src = el.getAttribute("data-lightbox-src") || el.src || "";
    proofLightboxImg.alt = el.alt || "Digital Dog School proof";
    proofLightbox.style.display = "flex";
  });
});

if (proofLightbox) {
  proofLightbox.addEventListener("click", function (event) {
    if (event.target === proofLightbox) closeProofLightbox();
  });
}

if (proofLightboxClose) {
  proofLightboxClose.addEventListener("click", closeProofLightbox);
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") closeProofLightbox();
});
