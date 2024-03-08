document.addEventListener("DOMContentLoaded", function () {
  const $button = document.querySelector("#sidebar-toggle");
  const $wrapper = document.querySelector("#wrapper");

  if ($button === null) {
    console.log("nullllll");
    return;
  }

  $button.addEventListener("click", (e) => {
    e.preventDefault();
    $wrapper.classList.toggle("toggled");
  });
});
