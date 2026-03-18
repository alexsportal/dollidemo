let currentInfoSectionIndex = 0;

function goToInfoSection(index) {
  currentInfoSectionIndex = index;

  const containers = document.querySelectorAll(".infocontainer");
  containers.forEach((c, i) => {
    c.style.display = i === index ? "block" : "none";
  });

  document.querySelectorAll("#infomenu .menubutton").forEach((btn, i) => {
    btn.classList.toggle("active", i === index);
  });
}

function openInfo() {
  document.getElementById('infooverlay').style.display = 'block';
}

function closeInfo() {
  document.getElementById('infooverlay').style.display = 'none';
}

setTimeout(function() {
  document.querySelectorAll(".infocontainer").forEach((c, i) => {
    c.style.display = i === 0 ? "block" : "none";
  });
  document.querySelector("#infomenu .menubutton")?.classList.add("active");
}, 100);