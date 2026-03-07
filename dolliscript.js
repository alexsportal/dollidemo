let currentEyeColor = "brown";
let currentHairColor = "blonde";
let currentHairId = "basehair";
let currentBrowId = "browshape2";
let currentNoseId = "noseshape3";
const darkSkinIndices = [1, 2, 3];
let slideIndex = 1;
const eyeColorMap = { blue: 0, green: 1, brown: 2 };
const hairColorMap = { black: 0, blonde: 1, brown: 2, orange: 3 };

function updateEyesForSkin(slideIndex) {
  const isDark = darkSkinIndices.includes(slideIndex);
  const activeShape = document.querySelector(".eyeshape[style*='display:block'], .eyeshape[style*='display: block']")
                   || document.getElementById("shape-doe");
  if (!activeShape) return;

  const darkEyes = activeShape.querySelectorAll(".darkeyes");
  const lightEyes = activeShape.querySelectorAll(".lighteyes");

  darkEyes.forEach(img => img.style.display = "none");
  lightEyes.forEach(img => img.style.display = "none");

  if (isDark) {
    darkEyes.forEach(img => {
      if (img.src.includes(currentEyeColor)) img.style.display = "block";
    });
  } else {
    lightEyes.forEach(img => {
      if (img.src.includes(currentEyeColor)) img.style.display = "block";
    });
  }
}

function updateNosesForSkin(slideIndex) {
  const isDark = darkSkinIndices.includes(slideIndex);
  const activeNose = document.getElementById(currentNoseId);
  if (!activeNose) return;

  activeNose.querySelectorAll(".nosedark").forEach(img => img.style.display = isDark ? "block" : "none");
  activeNose.querySelectorAll(".noselight").forEach(img => img.style.display = isDark ? "none" : "block");
}

function updateBrowColor(color) {
  const activeBrow = document.getElementById(currentBrowId);
  if (!activeBrow) return;
  activeBrow.querySelectorAll(".eyebrows").forEach(img => {
    img.style.display = img.src.includes(color) ? "block" : "none";
  });
}

function setOutline(category, index) {
  const dots = document.querySelectorAll(`.coloroption[data-category="${category}"]`);
  dots.forEach(dot => dot.classList.remove("outline"));
  if (dots[index]) dots[index].classList.add("outline");
}

function showEyeColorDisplay(color) {
  const eyeDisplays = document.getElementsByClassName("eyecolorsdisplay");
  for (let i = 0; i < eyeDisplays.length; i++) {
    eyeDisplays[i].style.display = "none";
  }
  const index = eyeColorMap[color];
  if (index !== undefined) eyeDisplays[index].style.display = "block";
}

function showHairColorDisplay(color) {
  const hairDisplays = document.getElementsByClassName("haircolorsdisplay");
  for (let i = 0; i < hairDisplays.length; i++) {
    hairDisplays[i].style.display = "none";
  }
  const index = hairColorMap[color];
  if (index !== undefined) hairDisplays[index].style.display = "block";
}

function showColorOptions(category) {
  const all = document.querySelectorAll(".coloroption");
  all.forEach(el => el.style.display = "none");

  const active = document.querySelectorAll(`.coloroption[data-category="${category}"]`);
  active.forEach(el => el.style.display = "block");

  const skinDisplays = document.getElementsByClassName("skincolorsdisplay");
  for (let i = 0; i < skinDisplays.length; i++) {
    skinDisplays[i].style.display = "none";
  }
  if (category === "skin") {
    skinDisplays[slideIndex - 1].style.display = "block";
  }

  const eyeDisplays = document.getElementsByClassName("eyecolorsdisplay");
  for (let i = 0; i < eyeDisplays.length; i++) {
    eyeDisplays[i].style.display = "none";
  }
  if (category === "eyes") {
    showEyeColorDisplay(currentEyeColor);
  }

  const hairDisplays = document.getElementsByClassName("haircolorsdisplay");
  for (let i = 0; i < hairDisplays.length; i++) {
    hairDisplays[i].style.display = "none";
  }
  if (category === "hairs") {
    showHairColorDisplay(currentHairColor);
  }

  activeColorCategory = category;
}

function hideAllColorOptions() {
  const all = document.querySelectorAll(".coloroption");
  all.forEach(el => el.style.display = "none");

  const eyeDisplays = document.getElementsByClassName("eyecolorsdisplay");
  for (let i = 0; i < eyeDisplays.length; i++) {
    eyeDisplays[i].style.display = "none";
  }

  const hairDisplays = document.getElementsByClassName("haircolorsdisplay");
  for (let i = 0; i < hairDisplays.length; i++) {
    hairDisplays[i].style.display = "none";
  }

  activeColorCategory = null;
}

let activeColorCategory = null;

function changeSkin(n) {
  skinSlides(n);
  showColorOptions("skin");
  setOutline("skin", n - 1);
}

function changeEyeShape(shapeId, el) {
  const shapes = document.getElementsByClassName("eyeshape");
  for (let i = 0; i < shapes.length; i++) {
    shapes[i].style.display = "none";
  }
  document.getElementById(shapeId).style.display = "block";
  showColorOptions("eyes");
  updateEyesForSkin(slideIndex);

  showEyeColorDisplay(currentEyeColor);
  setOutline("eyes", eyeColorMap[currentEyeColor] ?? 2);

  const eyeDots = document.getElementsByClassName("beautyoptionseyes");
  for (let i = 0; i < eyeDots.length; i++) {
    eyeDots[i].classList.remove("active");
  }
  el.classList.add("active");
}

function changeNoseShape(shapeId, el) {
  document.querySelectorAll(".noseshape").forEach(s => s.style.display = "none");
  currentNoseId = shapeId;
  document.getElementById(shapeId).style.display = "block";
  updateNosesForSkin(slideIndex);

  document.querySelectorAll(".beautyoptionsnose").forEach(dot => dot.classList.remove("active"));
  el.classList.add("active");
}

function changeHairShape(shapeId, el) {
  document.querySelectorAll(".hairshape").forEach(s => s.style.display = "none");
  currentHairId = shapeId;
  document.getElementById(shapeId).style.display = "block";
  showColorOptions("hairs");

  showHairColorDisplay(currentHairColor);
  setOutline("hairs", hairColorMap[currentHairColor] ?? 0);

  document.querySelectorAll(".beautyoptionsbrows, .beautyoptionshair").forEach(dot => dot.classList.remove("active"));
  el.classList.add("active");
}

function changeBrowShape(shapeId, el) {
  document.querySelectorAll(".browshape").forEach(s => s.style.display = "none");
  currentBrowId = shapeId;
  document.getElementById(shapeId).style.display = "block";
  updateBrowColor(currentHairColor);
  showColorOptions("hairs");
  showHairColorDisplay(currentHairColor);
  setOutline("hairs", hairColorMap[currentHairColor] ?? 0);

  document.querySelectorAll(".beautyoptionsbrows, .beautyoptionshair").forEach(dot => dot.classList.remove("active"));
  el.classList.add("active");
}

function changeHairColor(color, el) {
  currentHairColor = color;

  showHairColorDisplay(color);

  const hairColorDots = document.querySelectorAll('.coloroption[data-category="hairs"]');
  hairColorDots.forEach(dot => dot.classList.remove("outline"));
  el.classList.add("outline");

  const activeShape = document.getElementById(currentHairId);
  if (!activeShape) return;

  activeShape.querySelectorAll("img").forEach(img => {
    img.style.display = img.src.includes(color) ? "block" : "none";
  });

  updateBrowColor(color);
}

function changeEyeColor(color, el) {
  currentEyeColor = color;

  showEyeColorDisplay(color);

  const eyeColorDots = document.querySelectorAll('.coloroption[data-category="eyes"]');
  eyeColorDots.forEach(dot => dot.classList.remove("outline"));
  el.classList.add("outline");

  const shapes = document.getElementsByClassName("eyeshape");
  let activeShape;
  for (let i = 0; i < shapes.length; i++) {
    if (shapes[i].style.display === "block") {
      activeShape = shapes[i];
      break;
    }
  }
  if (!activeShape) return;

  const isDark = darkSkinIndices.includes(slideIndex);
  const allEyes = activeShape.querySelectorAll(".darkeyes, .lighteyes");
  allEyes.forEach(img => {
    const rightColor = img.src.includes(color);
    const rightShade = isDark ? img.classList.contains("darkeyes") : img.classList.contains("lighteyes");
    img.style.display = (rightColor && rightShade) ? "block" : "none";
  });
}

function skinSlides(n) {
  let skin = document.getElementsByClassName("skins");
  let dots = document.getElementsByClassName("beautyoptionsskin");
  let skincolorsDisplay = document.getElementsByClassName("skincolorsdisplay");

  if (n > skin.length) { slideIndex = 1; }
  else if (n < 1) { slideIndex = skin.length; }
  else { slideIndex = n; }

  for (let i = 0; i < skin.length; i++) { skin[i].style.display = "none"; }
  for (let i = 0; i < skincolorsDisplay.length; i++) { skincolorsDisplay[i].style.display = "none"; }
  for (let i = 0; i < dots.length; i++) { dots[i].classList.remove("active"); }

  skin[slideIndex-1].style.display = "block";
  dots[slideIndex-1].classList.add("active");
  skincolorsDisplay[slideIndex-1].style.display = "block";

  updateEyesForSkin(slideIndex);
  updateNosesForSkin(slideIndex);
}

window.onload = function() {
  const eyeDisplays = document.getElementsByClassName("eyecolorsdisplay");
  for (let i = 0; i < eyeDisplays.length; i++) {
    eyeDisplays[i].style.display = "none";
  }

  const hairDisplays = document.getElementsByClassName("haircolorsdisplay");
  for (let i = 0; i < hairDisplays.length; i++) {
    hairDisplays[i].style.display = "none";
  }

  showColorOptions("skin");
  setOutline("skin", 0);
  updateEyesForSkin(slideIndex);
  updateNosesForSkin(slideIndex);
  updateBrowColor(currentHairColor);
};