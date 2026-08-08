let currentEyeColor = "brown";
let currentHairColor = "black";
let currentBrowColor = "black";
let currentLipColor = "pink";
let currentBlushColor = "dark";
let currentHairId = "hairstyle16";
let currentBrowId = "browshape1";
let currentNoseId = "noseshape2";
let currentLipId = "lipshape1";
let currentEyeId = "shape-nice";
let currentBlushId = "blush1";
let activeTopIds = new Set(["bandeau"]);
let currentTopId = "bandeau";
let currentTopColor = "black";
let currentLipHue = 0;
let currentTopHue = 0;
let currentHairHue = 0;
let currentBrowHue = 0;
let currentSectionIndex = 0;
let slideIndex = 1;
let activeColorCategory = null;
let activeSkinDetails = new Set();
let skinDetailOpacity = {};
let currentJewelryId = null;
let activeJewelryIds = new Set();
let currentJewelryColor = "gold";
let selectedTopEl = null;
let selectedMakeupEl = null;
let selectedJewelryEl = null;
let isZoomed = false;
let activeDetailId = null;

const undoStack = [];
const darkSkinIndices = [1, 2, 3];
const eyeColorMap = {purple: 0, blue: 1, green: 2, brown: 3};
const hairColorMap = { black: 0, brown: 1, blonde: 2, orange: 3 };
const browColorMap = { black: 0, brown: 1, blonde: 2, orange: 3 };
const lipColorMap = { brown: 0, plum: 1, pink: 2, lightpink: 3, red: 4};
const blushColorMap = { dark: 0, medium: 1, light: 2, rouge: 3 };
const topColorMap = { pink: 0, red: 1, yellow: 2, green: 3, blue: 4, purple: 5, magenta: 6, brown: 7, white: 8, black: 9 };
const sections = ["skin", "eyes", "brows", "nose", "lips", "hairs", "makeup", "tops", "jewelry", "bg"];
const jewelryColorMap = { gold: 0, silver: 1, red: 2, pink: 3, purple: 4, blue: 5, white: 6, green: 7, black: 8 };
const earringIds = ["droop", "hoop"];
const necklaceIds = ["choker", "chains", "moonchains", "heartchains", "necklacesmall", "necklacemed", "necklacelarge", "longnecklace"];

const colorHex = {
  gold: "linear-gradient(150deg, #ffd6ac, #976a45)",
  silver: "linear-gradient(150deg, #ffffff, #a1a1a1)",
  red: "linear-gradient(150deg, #CC0000, #FF4444)",
  pink: "linear-gradient(150deg, #FF69B4, #FFB6C1)",
  purple: "linear-gradient(150deg, #800080, #B44FBF)",
  blue: "linear-gradient(150deg, #175282, #4A90D9)",
  white: "linear-gradient(150deg, #FFFFFF, #e9cef8)",
  green: "linear-gradient(150deg, #008000, #4CAF50)",
  black: "linear-gradient(150deg, #222222, #555555)",
  brown: "linear-gradient(150deg, #8B4513, #C47A45)",
  blonde: "linear-gradient(150deg, #FAD689, #F5C242)",
  orange: "linear-gradient(150deg, #FF8C00, #FFA500)",
  plum: "linear-gradient(150deg, #8E4585, #C06BA0)",
  lightpink: "linear-gradient(150deg, #FFB6C1, #FFDDE1)",
  coral: "linear-gradient(150deg, #FF6B6B, #FF9A9A)"
};


// ─── MENU HOVER ───────────────────────────────────────────────

let openMenu = null;
let menuHoverEnabled = false;

function toggleMenu(menuId, el) {
    const overlay = document.getElementById(menuId + 'overlay');
    if (!overlay) return;

    const isOpen = overlay.style.display === 'block';

    document.querySelectorAll('.menuoverlay').forEach(o => o.style.display = 'none');
    document.querySelectorAll('.menubutton[data-menu]').forEach(b => b.classList.remove('active'));

    if (!isOpen) {
        overlay.style.display = 'block';
        el.classList.add('active');
        openMenu = menuId;
        menuHoverEnabled = true;
        document.querySelector('.inputcontainer').style.visibility = 'hidden';
    } else {
        openMenu = null;
        menuHoverEnabled = false;
        document.querySelector('.inputcontainer').style.visibility = 'visible';
    }
}

function closeMenus() {
    document.querySelectorAll('.menuoverlay').forEach(o => o.style.display = 'none');
    document.querySelectorAll('.menubutton[data-menu]').forEach(b => b.classList.remove('active'));
    openMenu = null;
    menuHoverEnabled = false;
}

function hoverMenu(menuId, el) {
    if (!menuHoverEnabled || openMenu === menuId) return;
    toggleMenu(menuId, el);
}

document.addEventListener('click', function(e) {
    if (!e.target.closest('.menubutton') && !e.target.closest('.menuoverlay')) {
        if (openMenu) {
            document.getElementById(openMenu + 'overlay').style.display = 'none';
            document.querySelector(`[data-menu="${openMenu}"]`)?.classList.remove('active');
            openMenu = null;
            menuHoverEnabled = false;
            document.querySelector('.inputcontainer').style.visibility = 'visible';
        }
    }
});

// ─── INFO BOX ───────────────────────────────────────────────

function openInfo() {
  document.getElementById('infooverlay').style.display = 'block';
}

function closeInfo() {
  document.getElementById('infooverlay').style.display = 'none';
}


// ─── ITEM BOX ───────────────────────────────────────────────
function openItems() {
    const items = document.getElementById("items");
    const container = document.getElementById("itemcontainer");
    const icon = document.querySelector("#openitems img");
    const isOpen = items.classList.contains("opening");

    if (isOpen) {
        items.classList.remove("opening");
        items.classList.add("closing");
        icon.style.transform = "rotate(180deg)";
        container.style.backgroundColor = "";
        setTimeout(() => { items.style.display = "none"; }, 300);
    } else {
        items.style.display = "block";
        items.classList.remove("closing");
        items.classList.add("opening");
        icon.style.transform = "rotate(360deg)";
        container.style.backgroundColor = "#c7a4b0c9";
    }

    icon.style.transition = "transform 0.3s ease";
}

// ─── SELECTED STATES ────────────────────────────────────────

function setSelectedTop(el) {
    if (selectedTopEl) selectedTopEl.classList.remove("selected");
    selectedTopEl = el;
    if (el) {
        el.classList.add("selected");
        const shapeId = el.getAttribute("onclick")?.match(/'([^']+)'/)?.[1];
        if (shapeId) {
            document.querySelectorAll(".itemthumbnail").forEach(t => t.classList.remove("active"));
            const thumb = document.querySelector(`.itemthumbnail[data-id="${shapeId}"]`);
            if (thumb) thumb.classList.add("active");
        }
    }
}

function setSelectedMakeup(el) {
    if (selectedMakeupEl) selectedMakeupEl.classList.remove("selected");
    selectedMakeupEl = el;
    if (el) {
        el.classList.add("selected");
        const shapeId = el.getAttribute("onclick")?.match(/'([^']+)'/)?.[1];
        if (shapeId) {
            document.querySelectorAll(".itemthumbnail").forEach(t => t.classList.remove("active"));
            const thumb = document.querySelector(`.itemthumbnail[data-id="${shapeId}"]`);
            if (thumb) thumb.classList.add("active");
        }
    }
}

function setSelectedJewelry(el) {
    if (selectedJewelryEl) selectedJewelryEl.classList.remove("selected");
    selectedJewelryEl = el;
    if (el) {
        el.classList.add("selected");
        const shapeId = el.getAttribute("onclick")?.match(/'([^']+)'/)?.[1];
        if (shapeId) {
            document.querySelectorAll(".itemthumbnail").forEach(t => t.classList.remove("active"));
            const thumb = document.querySelector(`.itemthumbnail[data-id="${shapeId}"]`);
            if (thumb) thumb.classList.add("active");
        }
    }
}

// ─── COLOR DISPLAY ──────────────────────────────────────────

function showFrontColorDisplay(category, color) {
    const front = document.getElementById("frontcolor");
    if (!front) return;

    const classMap = {
        hairs: "haircolorsdisplay",
        brows: "browcolorsdisplay",
        lips: "lipcolorsdisplay",
        tops: "topscolorsdisplay"
    };

    const indexMap = {
        hairs: hairColorMap[color],
        brows: browColorMap[color],
        lips: lipColorMap[color],
        tops: topColorMap[color]
    };

    const cls = classMap[category];
    const index = indexMap[category];

    if (cls !== undefined && index !== undefined) {
        const displays = document.getElementsByClassName(cls);
        if (displays[index]) {
            front.style.background = displays[index].style.background || displays[index].style.backgroundColor;
            front.style.filter = "none";
        }
    }
}

// ─── SAVE / UNDO ───────────────────────────────────────────────

function saveState() {
  undoStack.push({
    slideIndex: slideIndex,
    currentEyeId: currentEyeId,
    currentEyeColor: currentEyeColor,
    currentHairId: currentHairId,
    currentHairColor: currentHairColor,
    currentBrowId: currentBrowId,
    currentBrowColor: currentBrowColor,
    currentLipId: currentLipId,
    currentLipColor: currentLipColor,
    currentBlushId: currentBlushId,
    currentBlushColor: currentBlushColor,
    currentNoseId: currentNoseId,
    currentTopId: currentTopId,
    activeTopIds: [...activeTopIds],
    currentTopColor: currentTopColor,
    activeSkinDetails: [...activeSkinDetails],
    skinDetailOpacity: { ...skinDetailOpacity },
    activeJewelryIds: [...activeJewelryIds],
    currentJewelryId: currentJewelryId,
    currentJewelryColor: currentJewelryColor,
    bgImage: document.getElementById("beautyparlour").style.backgroundImage,
    bgColor: document.getElementById("beautyparlour").style.backgroundColor,
    blushVisible: document.getElementById(currentBlushId).style.display === "block",
  });
}

function undo() {
  if (undoStack.length === 0) return;
  const prev = undoStack.pop();

  skinSlides(prev.slideIndex);

  document.querySelectorAll(".eyeshape").forEach(s => s.style.display = "none");
  currentEyeId = prev.currentEyeId;
  document.getElementById(currentEyeId).style.display = "block";
  currentEyeColor = prev.currentEyeColor;
  updateEyesForSkin(prev.slideIndex);

  document.querySelectorAll(".hairshape").forEach(s => s.style.display = "none");
  currentHairId = prev.currentHairId;
  currentHairColor = prev.currentHairColor;
  document.getElementById(currentHairId).style.display = "block";
  document.getElementById(currentHairId).querySelectorAll("img").forEach(img => {
    img.style.display = img.dataset.color === currentHairColor ? "block" : "none";
  });

  document.querySelectorAll(".browshape").forEach(s => s.style.display = "none");
  currentBrowId = prev.currentBrowId;
  document.getElementById(currentBrowId).style.display = "block";
  updateBrowColor(prev.currentBrowColor);

  document.querySelectorAll(".lipshape").forEach(s => s.style.display = "none");
  currentLipId = prev.currentLipId;
  document.getElementById(currentLipId).style.display = "block";
  updateLipColor(prev.currentLipColor);

  document.querySelectorAll(".blushshape").forEach(s => s.style.display = "none");
  currentBlushId = prev.currentBlushId;
  document.getElementById(currentBlushId).style.display = prev.blushVisible ? "block" : "none";
  if (prev.blushVisible) updateBlushColor(prev.currentBlushColor);

  document.querySelectorAll(".noseshape").forEach(s => s.style.display = "none");
  currentNoseId = prev.currentNoseId;
  document.getElementById(currentNoseId).style.display = "block";
  updateNosesForSkin(prev.slideIndex);

  activeSkinDetails = new Set(prev.activeSkinDetails || []);
  skinDetailOpacity = prev.skinDetailOpacity || {};
  document.querySelectorAll('.skindetails img').forEach(img => img.style.display = 'none');
  activeSkinDetails.forEach(detailId => {
    const target = document.querySelector(`.skindetails img[src*="${detailId}"]`);
    if (target) {
      target.style.display = 'block';
      target.style.opacity = skinDetailOpacity[detailId] ?? 1;
    }
  });

  document.querySelectorAll(".topstyle").forEach(s => s.style.display = "none");
  activeTopIds = new Set(prev.activeTopIds || [prev.currentTopId]);
  currentTopId = prev.currentTopId;
  currentTopColor = prev.currentTopColor;
  activeTopIds.forEach(topId => {
    const shape = document.getElementById(topId);
    if (shape) shape.style.display = "block";
  });
  if (currentTopId) updateTopColor(prev.currentTopColor);

  document.querySelectorAll(".jewelryshape").forEach(s => s.style.display = "none");
  document.querySelectorAll(".jewelrystyle").forEach(img => img.style.display = "none");
  activeJewelryIds = new Set(prev.activeJewelryIds || []);
  currentJewelryId = prev.currentJewelryId;
  currentJewelryColor = prev.currentJewelryColor;
  activeJewelryIds.forEach(id => {
    const shape = document.getElementById(id);
    if (!shape) return;
    const img = shape.querySelector("img[style*='display: block'], img[style*='display:block']");
    if (!img) return;
    const jewelryClassMap = {
        droop: "for_earrings",
        hoop: "for_earrings",
        choker: "for_choker",
        heartchains: "for_chains",
        chains: "for_chains",
        moonchains: "for_chains",
        necklacesmall: "for_necklace",
        necklacemed: "for_necklace",
        necklacelarge: "for_necklace",
        longnecklace: "for_longnecklace"
    };
    const typeClass = jewelryClassMap[id] || "for_earrings";
    const thumb = createItemThumbnail(id, img.src, typeClass, "jewelry");
    if (selectedJewelryEl) {
        const selectedId = selectedJewelryEl.getAttribute("onclick")?.match(/'([^']+)'/)?.[1];
        if (selectedId === id) thumb.classList.add("active");
    }
    items.appendChild(thumb);
});
  document.getElementById("beautyparlour").style.backgroundImage = prev.bgImage;
  document.getElementById("beautyparlour").style.backgroundColor = prev.bgColor;

  goToSection(currentSectionIndex);
  renderItemContainer()
}

// ─── SKIN ──────────────────────────────────────────────────────

function changeSkin(n) {
  saveState();
  skinSlides(n);
  showColorOptions("skin");
  setOutline("skin", n - 1);
  activeSkinDetails.forEach(detailId => {
    const target = document.querySelector(`.skindetails img[src*="${detailId}"]`);
    if (target) {
      target.style.display = 'block';
      target.style.opacity = skinDetailOpacity[detailId] ?? 1;
    }
  });
}

function skinSlides(n) {
  let skin = document.getElementsByClassName("skins");
  let dots = document.getElementsByClassName("beautyoptionsskin");
  let skincolorsDisplay = document.getElementsByClassName("skincolorsdisplay");

  if (n > skin.length) { slideIndex = 1; }
  else if (n < 1) { slideIndex = skin.length; }
  else { slideIndex = n; }

  for (let i = 0; i < skin.length; i++) skin[i].style.display = "none";
  for (let i = 0; i < skincolorsDisplay.length; i++) skincolorsDisplay[i].style.display = "none";
  for (let i = 0; i < dots.length; i++) {
    const onclick = dots[i].getAttribute("onclick") || "";
    if (!onclick.includes("changeSkinDetail")) {
      dots[i].classList.remove("active");
    }
  }

  skin[slideIndex - 1].style.display = "block";
  let skintoneIndex = 0;
  for (let i = 0; i < dots.length; i++) {
    const onclick = dots[i].getAttribute("onclick") || "";
    if (!onclick.includes("changeSkinDetail")) {
      if (skintoneIndex === slideIndex - 1) {
        dots[i].classList.add("active");
        break;
      }
      skintoneIndex++;
    }
  }
  skincolorsDisplay[slideIndex - 1].style.display = "block";
  updateEyesForSkin(slideIndex);
  updateNosesForSkin(slideIndex);
}

// ─── EYES ──────────────────────────────────────────────────────

function updateEyesForSkin(slideIndex) {
  const isDark = darkSkinIndices.includes(slideIndex);
  const activeShape = document.querySelector(".eyeshape[style*='display:block'], .eyeshape[style*='display: block']")
                   || document.getElementById("shape-nice");
  if (!activeShape) return;

  activeShape.querySelectorAll(".darkeyes").forEach(img => img.style.display = "none");
  activeShape.querySelectorAll(".lighteyes").forEach(img => img.style.display = "none");

  if (isDark) {
    activeShape.querySelectorAll(".darkeyes").forEach(img => {
      if (img.src.includes(currentEyeColor)) img.style.display = "block";
    });
  } else {
    activeShape.querySelectorAll(".lighteyes").forEach(img => {
      if (img.src.includes(currentEyeColor)) img.style.display = "block";
    });
  }
}

function changeEyeShape(shapeId, el) {
  saveState();
  currentEyeId = shapeId;
  document.querySelectorAll(".eyeshape").forEach(s => s.style.display = "none");
  document.getElementById(shapeId).style.display = "block";
  updateEyesForSkin(slideIndex);
  showColorOptions("eyes");
  showEyeColorDisplay(currentEyeColor);
  setOutline("eyes", eyeColorMap[currentEyeColor] ?? 2);
  document.querySelectorAll(".beautyoptionseyes").forEach(dot => dot.classList.remove("active"));
  el.classList.add("active");
}

function changeEyeColor(color, el) {
  saveState();
  currentEyeColor = color;
  showEyeColorDisplay(color);
  document.querySelectorAll('.coloroption[data-category="eyes"]').forEach(dot => dot.classList.remove("outline"));
  el.classList.add("outline");
  const activeShape = document.querySelector(".eyeshape[style*='display:block'], .eyeshape[style*='display: block']")
                   || document.getElementById("shape-nice");
  if (!activeShape) return;
  const isDark = darkSkinIndices.includes(slideIndex);
  activeShape.querySelectorAll(".darkeyes, .lighteyes").forEach(img => {
    const rightColor = img.src.includes(color);
    const rightShade = isDark ? img.classList.contains("darkeyes") : img.classList.contains("lighteyes");
    img.style.display = (rightColor && rightShade) ? "block" : "none";
  });
}

function showEyeColorDisplay(color) {
  const displays = document.getElementsByClassName("eyecolorsdisplay");
  for (let i = 0; i < displays.length; i++) displays[i].style.display = "none";
  const index = eyeColorMap[color];
  if (index !== undefined) displays[index].style.display = "block";
}

// ─── BROWS ─────────────────────────────────────────────────────

function changeBrowShape(shapeId, el) {
  saveState();
  document.querySelectorAll(".browshape").forEach(s => s.style.display = "none");
  currentBrowId = shapeId;
  document.getElementById(shapeId).style.display = "block";
  updateBrowColor(currentBrowColor);
  showColorOptions("brows");
  showFrontColorDisplay("brows", currentBrowColor);
  setOutline("brows", browColorMap[currentBrowColor] ?? 0);
  document.querySelectorAll(".beautyoptionsbrows").forEach(dot => dot.classList.remove("active"));
  el.classList.add("active");
}

function changeBrowColor(color, el) {
  saveState();
  currentBrowColor = color;
  showFrontColorDisplay("brows", color);
  document.querySelectorAll('.coloroption[data-category="brows"]').forEach(dot => dot.classList.remove("outline"));
  el.classList.add("outline");
  const activeBrow = document.getElementById(currentBrowId);
  activeBrow?.querySelectorAll("img").forEach(img => img.style.filter = "");
  updateBrowColor(color);
}

function updateBrowColor(color) {
  currentBrowColor = color;
  const activeBrow = document.getElementById(currentBrowId);
  if (!activeBrow) return;
  activeBrow.querySelectorAll("img").forEach(img => {
    img.style.display = img.dataset.color === color ? "block" : "none";
  });
}

// ─── NOSE ──────────────────────────────────────────────────────

function changeNoseShape(shapeId, el) {
  saveState();
  document.querySelectorAll(".noseshape").forEach(s => s.style.display = "none");
  currentNoseId = shapeId;
  document.getElementById(shapeId).style.display = "block";
  updateNosesForSkin(slideIndex);
  document.querySelectorAll(".beautyoptionsnose").forEach(dot => dot.classList.remove("active"));
  el.classList.add("active");
}

function updateNosesForSkin(slideIndex) {
  const isDark = darkSkinIndices.includes(slideIndex);
  const activeNose = document.getElementById(currentNoseId);
  if (!activeNose) return;
  activeNose.querySelectorAll(".nosedark").forEach(img => img.style.display = isDark ? "block" : "none");
  activeNose.querySelectorAll(".noselight").forEach(img => img.style.display = isDark ? "none" : "block");
}

// ─── LIPS ──────────────────────────────────────────────────────

function changeLipShape(shapeId, el) {
  saveState();
  document.querySelectorAll(".lipshape").forEach(s => s.style.display = "none");
  currentLipId = shapeId;
  document.getElementById(shapeId).style.display = "block";
  updateLipColor(currentLipColor);
  showColorOptions("lips");
  showFrontColorDisplay("lips", currentLipColor);
  setOutline("lips", lipColorMap[currentLipColor] ?? 0);
  document.querySelectorAll(".beautyoptionslips").forEach(dot => dot.classList.remove("active"));
  el.classList.add("active");
}

function changeLipColor(color, el) {
  saveState();
  currentLipColor = color;
  showFrontColorDisplay("lips", color);
  document.querySelectorAll('.coloroption[data-category="lips"]').forEach(dot => dot.classList.remove("outline"));
  el.classList.add("outline");
  const activeLip = document.getElementById(currentLipId);
  activeLip?.querySelectorAll("img").forEach(img => img.style.filter = "");
  updateLipColor(color);
  currentLipHue = 0;
}

function updateLipColor(color) {
  currentLipColor = color;
  const activeLip = document.getElementById(currentLipId);
  if (!activeLip) return;
  activeLip.querySelectorAll("img").forEach(img => {
    img.style.display = img.dataset.color === color ? "block" : "none";
  });
}

// ─── HAIR ──────────────────────────────────────────────────────

function changeHairShape(shapeId, el) {
  saveState();
  document.querySelectorAll(".hairshape").forEach(s => s.style.display = "none");
  currentHairId = shapeId;
  document.getElementById(shapeId).style.display = "block";
  document.getElementById(shapeId).querySelectorAll("img").forEach(img => {
    img.style.display = img.dataset.color === currentHairColor ? "block" : "none";
  });
  showColorOptions("hairs");
  showFrontColorDisplay("hairs", currentHairColor);
  setOutline("hairs", hairColorMap[currentHairColor] ?? 0);
  document.querySelectorAll(".beautyoptionshair").forEach(dot => dot.classList.remove("active"));
  el.classList.add("active");
}

function changeHairColor(color, el) {
  saveState();
  currentHairColor = color;
  showFrontColorDisplay("hairs", color);
  document.querySelectorAll('.coloroption[data-category="hairs"]').forEach(dot => dot.classList.remove("outline"));
  el.classList.add("outline");
  const activeShape = document.getElementById(currentHairId);
  if (!activeShape) return;
  activeShape.querySelectorAll("img").forEach(img => {
    img.style.filter = "";
    img.style.display = img.dataset.color === color ? "block" : "none";
  });
}

// ─── BLUSH ─────────────────────────────────────────────────────

function changeBlushShape(shapeId, el) {
  saveState();
  const shape = document.getElementById(shapeId);
  const isVisible = shape.style.display === "block";

  if (isVisible) {
    if (selectedMakeupEl === el) setSelectedMakeup(null);
    shape.querySelectorAll(".blushes").forEach(img => img.style.display = "none");
    shape.style.display = "none";
    el.classList.remove("active");
  } else {
    setSelectedMakeup(el);
    shape.style.display = "block";
    currentBlushId = shapeId;
    updateBlushColor(currentBlushColor);
    showColorOptions("blush");
    showBlushColorDisplay(currentBlushColor);
    setOutline("blush", blushColorMap[currentBlushColor] ?? 0);
    el.classList.add("active");
  }
  renderItemContainer()
}

function changeBlushColor(color, el) {
  saveState();
  currentBlushColor = color;
  showBlushColorDisplay(color);
  document.querySelectorAll('.coloroption[data-category="blush"]').forEach(dot => dot.classList.remove("outline"));
  el.classList.add("outline");
  const activeBlush = document.getElementById(currentBlushId);
  activeBlush?.querySelectorAll("img").forEach(img => img.style.filter = "");
  document.getElementById("opacitypicker").value = 1;
  activeBlush?.querySelectorAll("img").forEach(img => img.style.opacity = 1);
  updateBlushColor(color);
  renderItemContainer()
}

function updateBlushColor(color) {
  currentBlushColor = color;
  const activeBlush = document.getElementById(currentBlushId);
  if (!activeBlush) return;
  activeBlush.querySelectorAll("img").forEach(img => {
    img.style.display = img.dataset.color === color ? "block" : "none";
  });
}

function showBlushColorDisplay(color) {
  const displays = document.getElementsByClassName("blushcolorsdisplay");
  for (let i = 0; i < displays.length; i++) displays[i].style.display = "none";
  const index = blushColorMap[color];
  if (index !== undefined) displays[index].style.display = "block";
}

// ─── SKIN DETAILS ──────────────────────────────────────────────


function changeSkinDetail(detailId, el) {
  saveState();
  activeDetailId = detailId;
  document.getElementById("opacitypicker").value = skinDetailOpacity[detailId] ?? 1;
  const target = document.querySelector(`.skindetails img[src*="${detailId}"]`);
  if (!target) return;

if (activeSkinDetails.has(detailId)) {
    target.style.display = 'none';
    activeSkinDetails.delete(detailId);
    if (el) el.classList.remove('active');
    if (activeSkinDetails.size === 0) {
        document.querySelector(".inputcontainer").style.display = "none";
    }
} else {
    target.style.display = 'block';
    target.style.opacity = skinDetailOpacity[detailId] ?? 1;
    activeSkinDetails.add(detailId);
    if (el) el.classList.add('active');
    document.getElementById("opacitypicker").value = skinDetailOpacity[detailId] ?? 1;
    document.querySelector(".inputcontainer").style.display = "flex";
    document.getElementById("opacitypicker").style.display = "block";
    document.getElementById("opacitylabel").style.display = "block";
}
}

// ─── JEWELRY ───────────────────────────────────────────────────

function updateJewelryColor(color) {
  const activeJewelry = document.getElementById(currentJewelryId);
  if (!activeJewelry) return;

  let matched = false;
  activeJewelry.querySelectorAll("img").forEach(img => {
    const fits = img.dataset.color === color;
    img.style.display = fits ? "block" : "none";
    if (fits) matched = true;
  });

  if (!matched) {
    const fallback = activeJewelry.querySelector("img");
    if (fallback) {
      fallback.style.display = "block";
      currentJewelryColor = fallback.dataset.color || "gold";
    }
  } else {
    currentJewelryColor = color;
  }
}

function changeJewelryColor(color, el) {
  saveState();
  currentJewelryColor = color;
  document.querySelectorAll('.coloroption[data-category="jewelry"]').forEach(dot => dot.classList.remove("outline"));
  el.classList.add("outline");
  updateJewelryColor(color);
  showJewelryColorDisplay(color);
  renderItemContainer()
}

function changeJewelryShape(shapeId, el) {
  saveState();
  const shape = document.getElementById(shapeId);
  const isVisible = shape.style.display === "block";
  const isEarring = earringIds.includes(shapeId);

  if (isVisible) {
    shape.style.display = "none";
    el.classList.remove("active");
    activeJewelryIds.delete(shapeId);
    if (currentJewelryId === shapeId) {
      currentJewelryId = activeJewelryIds.size > 0 ? [...activeJewelryIds][0] : null;
    }
    if (activeJewelryIds.size === 0) {
      showJewelryColors(null);
      showJewelryColorDisplay(null);
    }
  } else {
    if (isEarring) {
      earringIds.forEach(id => {
        if (id !== shapeId) {
          const other = document.getElementById(id);
          if (other) other.style.display = "none";
          activeJewelryIds.delete(id);
          const otherEl = document.querySelector(`.beautyoptionsjewelry[onclick*="${id}"]`);
          if (otherEl) otherEl.classList.remove("active");
        }
      });
    }

    shape.style.display = "block";
    activeJewelryIds.add(shapeId);
    currentJewelryId = shapeId;
    updateJewelryColor(currentJewelryColor);
    showJewelryColorDisplay(currentJewelryColor);
    el.classList.add("active");
    setSelectedJewelry(el);
    showColorOptions("jewelry");
    showJewelryColors(el.dataset.colors);
  }
  renderItemContainer()
}

function showJewelryColors(colorsString) {
  document.querySelectorAll('.coloroption[data-category="jewelry"]').forEach(dot => {
    if (!colorsString) {
      dot.style.display = "none";
      return;
    }
    const allowed = colorsString.split(",");
    dot.style.display = allowed.includes(dot.dataset.color) ? "inline-block" : "none";
  });
}

function showJewelryColorDisplay(color) {
  const frontDisplay = document.querySelector(".jewelrycolorsdisplay-front");
  const backDisplay = document.querySelector(".jewelrycolorsdisplay-back");
  const backBox = document.querySelector(".back");

  if (!color || activeJewelryIds.size === 0) {
    if (frontDisplay) frontDisplay.style.display = "none";
    if (backDisplay) backDisplay.style.display = "none";
    if (backBox) backBox.classList.remove("clickable");
    return;
  }

  const parts = color.split("-");
  const mainColor = parts[0];
  const secondaryColor = parts[1] || null;

if (frontDisplay) {
    frontDisplay.style.background = colorHex[mainColor] || mainColor;
    frontDisplay.style.display = "block";
}
if (backDisplay) {
    if (secondaryColor) {
        backDisplay.style.background = colorHex[secondaryColor] || secondaryColor;
        backDisplay.style.display = "block";
        if (backBox) backBox.classList.add("clickable");
    } else {
        backDisplay.style.display = "none";
        if (backBox) backBox.classList.remove("clickable");
    }
}
}

// ─── TOPS ──────────────────────────────────────────────────────

function changeTopShape(shapeId, el) {
  saveState();
  const shape = document.getElementById(shapeId);
  const isVisible = shape.style.display === "block";

  if (isVisible) {
    shape.style.display = "none";
    el.classList.remove("active");
    activeTopIds.delete(shapeId);
    if (currentTopId === shapeId) {
      currentTopId = activeTopIds.size > 0 ? [...activeTopIds][0] : null;
      const newEl = currentTopId
        ? document.querySelector(`.beautyoptionstops[onclick*="${currentTopId}"]`)
        : null;
      setSelectedTop(newEl);
    }
  } else {
    shape.style.display = "block";
    activeTopIds.add(shapeId);
    currentTopId = shapeId;
    updateTopColor(currentTopColor);
    el.classList.add("active");
    setSelectedTop(el);
    showColorOptions("tops");
    showFrontColorDisplay("tops", currentTopColor);
    setOutline("tops", topColorMap[currentTopColor] ?? 8);
  }

  if (el.dataset.nocolor) {
    document.querySelectorAll('.coloroption[data-category="tops"]').forEach(dot => dot.style.display = 'none');
    document.getElementById("huelabel").style.display = "none";
    document.querySelector(".inputcontainer").style.display = "none";
    document.getElementById("colorpicker").style.display = "none";
} else {
    showColorOptions("tops");
    showFrontColorDisplay("tops", currentTopColor);
    setOutline("tops", topColorMap[currentTopColor] ?? 8);
}
renderItemContainer()
}

function changeTopColor(color, el) {
  saveState();
  if (!currentTopId) return;
  const activeTop = document.getElementById(currentTopId);
  activeTop?.querySelectorAll("img").forEach(img => img.style.filter = "");
  document.querySelectorAll('.coloroption[data-category="tops"]').forEach(dot => dot.classList.remove("outline"));
  el.classList.add("outline");
  showFrontColorDisplay("tops", color);
  updateTopColor(color);
  currentTopHue = 0;
  renderItemContainer()
}

function updateTopColor(color) {
  const activeTop = document.getElementById(currentTopId);
  if (!activeTop) return;

  let matched = false;
  activeTop.querySelectorAll("img").forEach(img => {
    const fits = img.dataset.color === color;
    img.style.display = fits ? "block" : "none";
    if (fits) matched = true;
  });

  if (!matched) {
    const fallback = activeTop.querySelector("img");
    if (fallback) {
      fallback.style.display = "block";
      currentTopColor = fallback.dataset.color || "white";
    }
  } else {
    currentTopColor = color;
  }
}

// ─── BACKGROUND ────────────────────────────────────────────────

function changeBackground(imageUrl, el) {
  saveState();
  document.getElementById("beautyparlour").style.backgroundImage = `url(${imageUrl})`;
  document.getElementById("beautyparlour").style.backgroundColor = "";
  document.querySelectorAll(".beautyoptionsbg").forEach(dot => dot.classList.remove("active"));
  document.querySelectorAll(".coloroption[data-category='bg']").forEach(dot => dot.classList.remove("outline"));
  document.querySelectorAll(".bgcolorsdisplay").forEach(el => el.style.display = "none");
  el.classList.add("active");
}

function changeBackgroundColor(color, el) {
  saveState();
  document.getElementById("beautyparlour").style.backgroundImage = color;
  document.getElementById("beautyparlour").style.backgroundColor = "";
  document.querySelectorAll(".beautyoptionsbg").forEach(dot => dot.classList.remove("active"));
  document.querySelectorAll(".coloroption[data-category='bg']").forEach(dot => dot.classList.remove("outline"));
  el.classList.add("outline");
  const bgDots = document.querySelectorAll(".coloroption[data-category='bg']");
  const bgDisplays = document.getElementsByClassName("bgcolorsdisplay");
  for (let i = 0; i < bgDisplays.length; i++) bgDisplays[i].style.display = "none";
  bgDots.forEach((dot, i) => {
    if (dot === el && bgDisplays[i]) bgDisplays[i].style.display = "block";
  });
}
// ─── COLOR PANEL ───────────────────────────────────────────────

function setOutline(category, index) {
  const dots = document.querySelectorAll(`.coloroption[data-category="${category}"]`);
  dots.forEach(dot => dot.classList.remove("outline"));
  if (dots[index]) dots[index].classList.add("outline");
}

function showColorOptions(category) {
    document.getElementById("frontcolor").style.backgroundColor = "#f1f1f1";

  document.getElementById("huelabel").style.display =
    (category === "hairs" || category === "brows" || category === "tops" || category === "lips") ? "block" : "none";

  document.getElementById("opacitylabel").style.display =
    (category === "blush" || category === "makeup" || category === "skin") && category !== "nose" ? "block" : "none";

  const anySliderVisible =
    (category === "hairs" || category === "brows" || category === "lips" || category === "tops" ||
     category === "blush" || category === "makeup" || category === "skin" || category === "nose");
  document.querySelector(".inputcontainer").style.display = anySliderVisible ? "flex" : "none";

  document.getElementById("colorpicker").value = 0;
  document.getElementById("colorpicker").style.display =
    (category === "hairs" || category === "brows" || category === "tops" || category === "lips") ? "block" : "none";

  document.getElementById("opacitypicker").value = 1;
  document.getElementById("opacitypicker").style.display =
    (category === "blush" || category === "makeup" || category === "skin") && category !== "nose" ? "block" : "none";
  document.querySelectorAll(".coloroption").forEach(el => el.style.display = "none");
  document.querySelectorAll(`.coloroption[data-category="${category}"]`).forEach(el => {
    el.style.display = el.classList.contains("jewelry-dot") ? "inline-block" : "block";
  });

  document.querySelectorAll(".skincolorsdisplay").forEach(el => el.style.display = "none");
  document.querySelectorAll(".eyecolorsdisplay").forEach(el => el.style.display = "none");
  document.querySelectorAll(".blushcolorsdisplay").forEach(el => el.style.display = "none");
  document.querySelectorAll(".bgcolorsdisplay").forEach(el => el.style.display = "none");
  document.querySelectorAll(".jewelrycolorsdisplay-front, .jewelrycolorsdisplay-back").forEach(el => el.style.display = "none");

  if (category === "skin") {
    const skinDisplays = document.getElementsByClassName("skincolorsdisplay");
    if (skinDisplays[slideIndex - 1]) skinDisplays[slideIndex - 1].style.display = "block";
  }
  if (category === "skin") {
    const skinDisplays = document.getElementsByClassName("skincolorsdisplay");
    if (skinDisplays[slideIndex - 1]) skinDisplays[slideIndex - 1].style.display = "block";
    if (activeSkinDetails.size === 0) {
        document.getElementById("opacitylabel").style.display = "none";
        document.getElementById("opacitypicker").style.display = "none";
        document.querySelector(".inputcontainer").style.display = "none";
    }
}
  if (category === "nose") {
      const skinDisplays = document.getElementsByClassName("skincolorsdisplay");
      for (let i = 0; i < skinDisplays.length; i++) skinDisplays[i].style.display = "none";
      if (skinDisplays[slideIndex - 1]) skinDisplays[slideIndex - 1].style.display = "block";
      document.getElementById("opacitylabel").style.display = "none";
      document.getElementById("opacitypicker").style.display = "none";
      document.getElementById("huelabel").style.display = "none";
      document.getElementById("colorpicker").style.display = "none";
      document.querySelectorAll('.coloroption[data-category="skin"]').forEach(el => el.style.display = "block");
  }
  if (category === "eyes") showEyeColorDisplay(currentEyeColor);
if (category === "blush" || category === "makeup") {
    const blushOn = document.getElementById(currentBlushId)?.style.display === "block";
    if (blushOn) {
        showBlushColorDisplay(currentBlushColor);
        setOutline("blush", blushColorMap[currentBlushColor] ?? 0);
        document.querySelectorAll('.coloroption[data-category="blush"]').forEach(el => el.style.display = "block");
        document.getElementById("opacitylabel").style.display = "block";
        document.getElementById("opacitypicker").style.display = "block";
        document.querySelector(".inputcontainer").style.display = "block";
    } else {
        document.getElementById("opacitylabel").style.display = "none";
        document.getElementById("opacitypicker").style.display = "none";
        document.querySelector(".inputcontainer").style.display = "none";
    }
}
  if (category === "jewelry") showJewelryColorDisplay(currentJewelryColor);
  if (category === "hairs") showFrontColorDisplay("hairs", currentHairColor);
  if (category === "brows") showFrontColorDisplay("brows", currentBrowColor);
  if (category === "lips")  showFrontColorDisplay("lips", currentLipColor);
  if (category === "tops")  showFrontColorDisplay("tops", currentTopColor);


  activeColorCategory = category;
}

// ─── NAVIGATION ────────────────────────────────────────────────

function goToSection(index) {
  currentSectionIndex = index;
  const category = sections[index];

  const containers = document.querySelectorAll(".itemcontainer");
  containers.forEach((c, i) => {
    c.style.display = i === index ? "block" : "none";
  });

  document.querySelectorAll(".navbutton").forEach((btn, i) => {
    btn.classList.toggle("active", i === index);
    if (i === index) {
      btn.src = btn.dataset.active;
    } else {
      btn.src = btn.dataset.inactive;
    }
  });

  showColorOptions(category);

  if (category === "skin") {
    setOutline("skin", slideIndex - 1);
    let skintoneIndex = 0;
    document.querySelectorAll(".beautyoptionsskin").forEach((el) => {
      const onclick = el.getAttribute("onclick") || "";
      if (onclick.includes("changeSkinDetail")) {
        const match = onclick.match(/'([^']+)'/);
        if (match) el.classList.toggle("active", activeSkinDetails.has(match[1]));
      } else if (onclick.includes("changeSkin")) {
        el.classList.toggle("active", skintoneIndex === slideIndex - 1);
        skintoneIndex++;
      }
    });
  }
  if (category === "eyes") {
    setOutline("eyes", eyeColorMap[currentEyeColor] ?? 2);
    document.querySelectorAll(".beautyoptionseyes").forEach(el => {
      el.classList.toggle("active", el.getAttribute("onclick")?.includes(currentEyeId));
    });
  }
  if (category === "hairs") {
    setOutline("hairs", hairColorMap[currentHairColor] ?? 0);
    document.querySelectorAll(".beautyoptionshair").forEach(el => {
      el.classList.toggle("active", el.getAttribute("onclick")?.includes(currentHairId));
    });
  }
  if (category === "brows") {
    setOutline("brows", browColorMap[currentBrowColor] ?? 0);
    document.querySelectorAll(".beautyoptionsbrows").forEach(el => {
      el.classList.toggle("active", el.getAttribute("onclick")?.includes(currentBrowId));
    });
  }
  if (category === "lips") {
    setOutline("lips", lipColorMap[currentLipColor] ?? 0);
    document.querySelectorAll(".beautyoptionslips").forEach(el => {
      el.classList.toggle("active", el.getAttribute("onclick")?.includes(currentLipId));
    });
  }
  if (category === "nose") {
      document.querySelectorAll(".beautyoptionsnose").forEach(el => {
          el.classList.toggle("active", el.getAttribute("onclick")?.includes(currentNoseId));
      });
      const skinDisplays = document.getElementsByClassName("skincolorsdisplay");
      for (let i = 0; i < skinDisplays.length; i++) skinDisplays[i].style.display = "none";
      if (skinDisplays[slideIndex - 1]) skinDisplays[slideIndex - 1].style.display = "block";
      document.querySelector(".inputcontainer").style.display = "none";
  }
  if (category === "makeup") {
    setOutline("blush", blushColorMap[currentBlushColor] ?? 0);
    document.querySelectorAll(".beautyoptionsmakeup").forEach(el => {
      const shapeId = el.getAttribute("onclick")?.match(/'([^']+)'/)?.[1];
      if (shapeId) {
        const shape = document.getElementById(shapeId);
        el.classList.toggle("active", shape?.style.display === "block");
      }
    });
  }
  if (category === "tops") {
    setOutline("tops", topColorMap[currentTopColor] ?? 8);
    document.querySelectorAll(".beautyoptionstops").forEach(el => {
      const shapeId = el.getAttribute("onclick")?.match(/'([^']+)'/)?.[1];
      if (shapeId) {
        const shape = document.getElementById(shapeId);
        el.classList.toggle("active", shape?.style.display === "block");
      }
    });
  }
if (category === "jewelry") {
    document.querySelectorAll(".beautyoptionsjewelry").forEach(el => {
        const shapeId = el.getAttribute("onclick")?.match(/'([^']+)'/)?.[1];
        if (shapeId) {
            const shape = document.getElementById(shapeId);
            el.classList.toggle("active", shape?.style.display === "block");
        }
    });
    if (activeJewelryIds.size === 0) {
        showJewelryColors(null);
        showJewelryColorDisplay(null);
    } else if (currentJewelryId) {
        const activeEl = document.querySelector(`.beautyoptionsjewelry[onclick*="${currentJewelryId}"]`);
        if (activeEl) showJewelryColors(activeEl.dataset.colors);
    }
}
}

function scrollOptions(direction) {
  const container = document.querySelector(".itemcontainer[style*='block'] .optioncontainer");
  if (!container) return;
  const item = container.querySelector("div, img");
  if (!item) return;
  const itemWidth = item.offsetWidth + 6;
  const maxScroll = container.scrollWidth - container.clientWidth;
  const newScroll = Math.max(0, Math.min(container.scrollLeft + direction * itemWidth * 3, maxScroll));
  container.scrollTo({ left: newScroll, behavior: 'smooth' });
}

// ─── ON LOAD ───────────────────────────────────────────────────

window.onload = function () {
  ["eyecolorsdisplay", "blushcolorsdisplay", "bgcolorsdisplay"].forEach(cls => {
    Array.from(document.getElementsByClassName(cls)).forEach(el => el.style.display = "none");
  });

  document.querySelectorAll(".itemcontainer").forEach((c, i) => {
    c.style.display = i === 0 ? "block" : "none";
  });

  document.querySelectorAll(".jewelryshape").forEach(s => s.style.display = "none");

  document.querySelectorAll(".hairshape").forEach(s => s.style.display = "none");
  document.getElementById(currentHairId).style.display = "block";

  document.querySelectorAll(".browshape").forEach(s => s.style.display = "none");
  document.getElementById(currentBrowId).style.display = "block";

  document.querySelectorAll(".lipshape").forEach(s => s.style.display = "none");
  document.getElementById(currentLipId).style.display = "block";

  document.querySelectorAll(".blushshape").forEach(s => s.style.display = "none");
  document.getElementById(currentBlushId).style.display = "none";
  document.getElementById(currentBlushId).querySelectorAll(".blushes").forEach(img => img.style.display = "none");
  document.querySelectorAll(".beautyoptionsmakeup").forEach(el => el.classList.remove("active"));

  document.querySelectorAll(".topstyle").forEach(s => s.style.display = "none");
  document.getElementById("bandeau").style.display = "block";
  activeTopIds = new Set(["bandeau"]);
  updateTopColor(currentTopColor);
  const defaultTopEl = document.querySelector(".beautyoptionstops[onclick*='bandeau']");
  if (defaultTopEl) {
    defaultTopEl.classList.add("active");
    setSelectedTop(defaultTopEl);
  }

  const hairEl = document.getElementById(currentHairId);
  hairEl.querySelectorAll("img").forEach(img => {
    img.style.display = img.dataset.color === currentHairColor ? "block" : "none";
    img.style.filter = "";
  });

  updateBrowColor(currentBrowColor);
  updateLipColor(currentLipColor);
  updateEyesForSkin(slideIndex);
  updateNosesForSkin(slideIndex);
  showFrontColorDisplay("hairs", currentHairColor);

  let skintoneIndex = 0;
  document.querySelectorAll(".beautyoptionsskin").forEach((el) => {
    const onclick = el.getAttribute("onclick") || "";
    if (onclick.includes("changeSkinDetail")) {
      el.classList.remove("active");
    } else if (onclick.includes("changeSkin")) {
      el.classList.toggle("active", skintoneIndex === slideIndex - 1);
      skintoneIndex++;
    }
  });

  document.querySelectorAll(".beautyoptionsbg")[0]?.classList.add("active");
  document.querySelectorAll(".navbutton")[0].src = document.querySelectorAll(".navbutton")[0].dataset.active;
  document.querySelectorAll(".navbutton")[0].classList.add("active");

  showColorOptions("skin");
  setOutline("skin", 0);
  showFrontColorDisplay(currentHairColor);

const overlay = document.getElementById('loadingoverlay');
overlay.style.transition = 'opacity 0.5s ease';
overlay.style.opacity = '0';
setTimeout(function () {
    overlay.style.display = 'none';
}, 500);
  updateDollDropdown();


};

// ─── SAVED DOLLS ───────────────────────────────────────────────

function saveCurrentDoll() {
  const saved = JSON.parse(localStorage.getItem('savedDolls') || '[]');
  if (saved.length >= 5) {
    alert('You can only save up to 5 Dolls. Please delete one first.');
    return;
  }

  const name = prompt('Name your Doll:');
  if (!name) return;

  const state = {
    name: name,
    id: Date.now(),
    slideIndex: slideIndex,
    currentEyeId: currentEyeId,
    currentEyeColor: currentEyeColor,
    currentHairId: currentHairId,
    currentHairColor: currentHairColor,
    currentHairHue: currentHairHue,
    currentBrowId: currentBrowId,
    currentBrowColor: currentBrowColor,
    currentBrowHue: currentBrowHue,
    currentLipId: currentLipId,
    currentLipColor: currentLipColor,
    currentLipHue: currentLipHue,
    currentNoseId: currentNoseId,
    currentBlushId: currentBlushId,
    currentBlushColor: currentBlushColor,
    activeTopIds: [...activeTopIds],
    currentTopId: currentTopId,
    blushVisible: document.getElementById(currentBlushId)?.style.display === "block",
    currentTopColor: currentTopColor,
    currentTopHue: currentTopHue,
    bgImage: document.getElementById("beautyparlour").style.backgroundImage,
    bgColor: document.getElementById("beautyparlour").style.backgroundColor,
    activeSkinDetails: [...activeSkinDetails],
    skinDetailOpacity: { ...skinDetailOpacity },
    activeJewelryIds: [...activeJewelryIds],
    currentJewelryId: currentJewelryId,
    currentJewelryColor: currentJewelryColor
  };

  saved.push(state);
  localStorage.setItem('savedDolls', JSON.stringify(saved));
  updateDollDropdown();
  alert(`"${name}" saved!`);
}

function loadDoll(id) {
  const saved = JSON.parse(localStorage.getItem('savedDolls') || '[]');
  const state = saved.find(d => d.id === parseInt(id));
  if (!state) return;

  skinSlides(state.slideIndex);

  document.querySelectorAll(".eyeshape").forEach(s => s.style.display = "none");
  currentEyeId = state.currentEyeId;
  document.getElementById(currentEyeId).style.display = "block";
  currentEyeColor = state.currentEyeColor;
  updateEyesForSkin(state.slideIndex);

  document.querySelectorAll(".hairshape").forEach(s => s.style.display = "none");
  currentHairId = state.currentHairId;
  currentHairColor = state.currentHairColor;
  currentHairHue = state.currentHairHue;
  document.getElementById(currentHairId).style.display = "block";
  document.getElementById(currentHairId).querySelectorAll("img").forEach(img => {
    img.style.display = img.dataset.color === currentHairColor ? "block" : "none";
  });

  document.querySelectorAll(".browshape").forEach(s => s.style.display = "none");
  currentBrowId = state.currentBrowId;
  document.getElementById(currentBrowId).style.display = "block";
  updateBrowColor(state.currentBrowColor);

  document.querySelectorAll(".lipshape").forEach(s => s.style.display = "none");
  currentLipId = state.currentLipId;
  document.getElementById(currentLipId).style.display = "block";
  updateLipColor(state.currentLipColor);
  currentLipHue = state.currentLipHue;

  document.querySelectorAll(".noseshape").forEach(s => s.style.display = "none");
  currentNoseId = state.currentNoseId;
  document.getElementById(currentNoseId).style.display = "block";
  updateNosesForSkin(state.slideIndex);

  document.querySelectorAll(".blushshape").forEach(s => s.style.display = "none");
  currentBlushId = state.currentBlushId;
  document.getElementById(currentBlushId).style.display = state.blushVisible ? "block" : "none";
  if (state.blushVisible) updateBlushColor(state.currentBlushColor);

  document.querySelectorAll(".topstyle").forEach(s => s.style.display = "none");
  activeTopIds = new Set(state.activeTopIds || []);
  currentTopId = state.currentTopId;
  activeTopIds.forEach(topId => {
    const shape = document.getElementById(topId);
    if (shape) shape.style.display = "block";
    const el = document.querySelector(`.beautyoptionstops[onclick*="${topId}"]`);
    if (el) el.classList.add("active");
  });
  if (currentTopId) updateTopColor(state.currentTopColor);

  activeSkinDetails = new Set(state.activeSkinDetails || []);
  skinDetailOpacity = state.skinDetailOpacity || {};
  document.querySelectorAll('.skindetails img').forEach(img => img.style.display = 'none');
  activeSkinDetails.forEach(detailId => {
    const target = document.querySelector(`.skindetails img[src*="${detailId}"]`);
    if (target) {
      target.style.display = 'block';
      target.style.opacity = skinDetailOpacity[detailId] ?? 1;
    }
  });

document.querySelectorAll(".jewelryshape").forEach(s => s.style.display = "none");
document.querySelectorAll(".jewelrystyle").forEach(img => img.style.display = "none");
activeJewelryIds = new Set(state.activeJewelryIds || []);
currentJewelryId = state.currentJewelryId;
currentJewelryColor = state.currentJewelryColor;
activeJewelryIds.forEach(id => {
    const shape = document.getElementById(id);
    if (shape) shape.style.display = "block";
    const el = document.querySelector(`.beautyoptionsjewelry[onclick*="${id}"]`);
    if (el) el.classList.add("active");
    const savedCurrentId = currentJewelryId;
    currentJewelryId = id;
    updateJewelryColor(state.currentJewelryColor);
    currentJewelryId = savedCurrentId;
});

  document.getElementById("beautyparlour").style.backgroundImage = state.bgImage;
  document.getElementById("beautyparlour").style.backgroundColor = state.bgColor;

  goToSection(currentSectionIndex);
  renderItemContainer()
}

function deleteDoll(id) {
  if (!confirm('Delete this Doll?')) return;
  let saved = JSON.parse(localStorage.getItem('savedDolls') || '[]');
  saved = saved.filter(d => d.id !== parseInt(id));
  localStorage.setItem('savedDolls', JSON.stringify(saved));
  updateDollDropdown();
}

function updateDollDropdown() {
  const saved = JSON.parse(localStorage.getItem('savedDolls') || '[]');
  const overlay = document.getElementById('dollsoverlay');
  overlay.innerHTML = '';
  if (saved.length === 0) {
    overlay.innerHTML = '<div class="menusongs" style="color:#888;font-style:italic;">No saved Dolls</div>';
    return;
  }
  saved.forEach(doll => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.justifyContent = 'space-between';
    row.style.alignItems = 'center';
    const nameBtn = document.createElement('div');
    nameBtn.className = 'menusongs';
    nameBtn.textContent = doll.name;
    nameBtn.style.flex = '1';
    nameBtn.onclick = () => loadDoll(doll.id);
    const delBtn = document.createElement('div');
    delBtn.className = 'menusongs';
    delBtn.textContent = '✕';
    delBtn.style.padding = '0 8px';
    delBtn.onclick = (e) => { e.stopPropagation(); deleteDoll(doll.id); };
    row.appendChild(nameBtn);
    row.appendChild(delBtn);
    overlay.appendChild(row);
  });
}

function preloadImage(src) {
  const img = new Image();
  img.src = src;
}



// ─── ERROR ───────────────────────────────────────────────

window.onerror = function () {
  document.getElementById("erroroverlay").style.display = "flex";
  return true;
};

// ─── ZOOM TOGGLE ───────────────────────────────────────────────

function toggleZoom() {
  const imgs = document.querySelectorAll(".skins, .darkeyes, .lighteyes, .nosedark, .noselight, .eyebrows, .hairstyles, .lips, .blushes, .tops, .jewelrystyle");
  imgs.forEach(img => {
    if (isZoomed) {
      img.style.width = "1000px";
      img.style.height = "410px";
      img.style.left = "60%";
      img.style.transform = "translate(-50%, -50%)";
    } else {
      img.style.width = "732px";
      img.style.height = "410px";
      img.style.left = "60%";
      img.style.transform = "translate(-50%, -37%)";
    }
  });
  isZoomed = !isZoomed;
}

// ─── ACTIVE ITEMS ───────────────────────────────────────────────

function renderItemContainer() {
    const items = document.getElementById("items");
    items.innerHTML = "";

    activeTopIds.forEach(topId => {
        const shape = document.getElementById(topId);
        if (!shape) return;
        const img = shape.querySelector("img[style*='display: block'], img[style*='display:block']");
        if (!img) return;
        const thumb = createItemThumbnail(topId, img.src, "for_tops", "top");
        if (selectedTopEl) {
            const selectedId = selectedTopEl.getAttribute("onclick")?.match(/'([^']+)'/)?.[1];
            if (selectedId === topId) thumb.classList.add("active");
        }
        items.appendChild(thumb);
    });

   document.querySelectorAll(".blushshape").forEach(shape => {
    if (shape.style.display !== "block") return;
    const blushImg = shape.querySelector("img[style*='display: block'], img[style*='display:block']");
    if (!blushImg) return;
    const thumb = createItemThumbnail(shape.id, blushImg.src, "for_blushes", "blush");
    if (selectedMakeupEl) {
        const selectedId = selectedMakeupEl.getAttribute("onclick")?.match(/'([^']+)'/)?.[1];
        if (selectedId === shape.id) thumb.classList.add("active");
    }
    items.appendChild(thumb);
});

activeJewelryIds.forEach(id => {
    const shape = document.getElementById(id);
    if (!shape) return;
    const img = shape.querySelector("img[style*='display: block'], img[style*='display:block']");
    if (!img) return;
    const jewelryClassMap = {
        droop: "for_earrings",
        hoop: "for_earrings",
        choker: "for_choker",
        heartchains: "for_chains",
        chains: "for_chains",
        moonchains: "for_chains",
        necklacesmall: "for_necklace",
        necklacemed: "for_necklace",
        necklacelarge: "for_necklace",
        longnecklace: "for_longnecklace"
    };
    const typeClass = jewelryClassMap[id] || "for_earrings";
    const thumb = createItemThumbnail(id, img.src, typeClass, "jewelry");
    if (selectedJewelryEl) {
        const selectedId = selectedJewelryEl.getAttribute("onclick")?.match(/'([^']+)'/)?.[1];
        if (selectedId === id) thumb.classList.add("active");
    }
    items.appendChild(thumb);
});
}

function createItemThumbnail(id, imgSrc, typeClass, category) {
    const div = document.createElement("div");
    div.className = `itemthumbnail ${typeClass}`;
    div.style.backgroundImage = `url(${imgSrc})`;
    div.dataset.id = id;
    div.dataset.category = category;
    div.onclick = () => selectItemThumbnail(div, id, category);

    const del = document.createElement("div");
    del.className = "delete";
    const x = document.createElement("img");
    x.src = "DressupGame_Assets/Button_Icons/x.png";
    x.style.width = "8px";
    x.style.margin = "auto";
    x.alt = "Delete item";
    x.onclick = (e) => { 
        e.stopPropagation(); 
        const opacity = window.getComputedStyle(del).opacity;
        if (parseFloat(opacity) >= 1) deleteItem(id, category); 
    };    
    del.appendChild(x);
    div.appendChild(del);

    return div;
}

function selectItemThumbnail(el, id, category) {
    const del = el.querySelector(".delete");
    const delOpacity = del ? parseFloat(window.getComputedStyle(del).opacity) : 0;
    const isActive = el.classList.contains("active");

    if (isActive && delOpacity >= 1) {
        deleteItem(id, category);
        return;
    }

    document.querySelectorAll(".itemthumbnail").forEach(t => t.classList.remove("active"));
    el.classList.add("active");
  

    if (category === "top") {
        currentTopId = id;
        const btn = document.querySelector(`.beautyoptionstops[onclick*="${id}"]`);
        if (btn) setSelectedTop(btn);
        goToSection(sections.indexOf("tops"));
        showFrontColorDisplay("tops", currentTopColor);
    }
    if (category === "blush") {
        const btn = document.querySelector(`.beautyoptionsmakeup[onclick*="${id}"]`);
        if (btn) setSelectedMakeup(btn);
        goToSection(sections.indexOf("makeup"));
    }
    if (category === "jewelry") {
      const btn = document.querySelector(`.beautyoptionsjewelry[onclick*="${id}"]`);
      if (btn) {
          currentJewelryId = id;
          setSelectedJewelry(btn);
          showJewelryColors(btn.dataset.colors);
          showJewelryColorDisplay(currentJewelryColor);
    }
    goToSection(sections.indexOf("jewelry"));
}
}

function deleteItem(id, category) {
    if (category === "top") {
        const shape = document.getElementById(id);
        if (shape) shape.style.display = "none";
        activeTopIds.delete(id);
        const el = document.querySelector(`.beautyoptionstops[onclick*="${id}"]`);
        if (el) { el.classList.remove("active"); if (selectedTopEl === el) setSelectedTop(null); }
        if (currentTopId === id) {
            currentTopId = activeTopIds.size > 0 ? [...activeTopIds][0] : null;
        }
    }
    if (category === "blush") {
        const shape = document.getElementById(currentBlushId);
        if (shape) { shape.style.display = "none"; shape.querySelectorAll(".blushes").forEach(img => img.style.display = "none"); }
        const el = document.querySelector(`.beautyoptionsmakeup[onclick*="${currentBlushId}"]`);
        if (el) { el.classList.remove("active"); if (selectedMakeupEl === el) setSelectedMakeup(null); }
    }
    if (category === "jewelry") {
        const shape = document.getElementById(id);
        if (shape) shape.style.display = "none";
        activeJewelryIds.delete(id);
        const el = document.querySelector(`.beautyoptionsjewelry[onclick*="${id}"]`);
        if (el) { el.classList.remove("active"); if (selectedJewelryEl === el) setSelectedJewelry(null); }
        if (activeJewelryIds.size === 0) { showJewelryColors(null); showJewelryColorDisplay(null); }
    }
    renderItemContainer();
}




let mouseDown = false;
let startX, scrollLeft;
const slider = document.querySelector('.nav');

const startDragging = (e) => {
  mouseDown = true;
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
}

const stopDragging = (e) => {
  mouseDown = false;
}

const move = (e) => {
  e.preventDefault();
  if(!mouseDown) { return; }
  const x = e.pageX - slider.offsetLeft;
  const scroll = x - startX;
  slider.scrollLeft = scrollLeft - scroll;
}

// Add the event listeners
slider.addEventListener('mousemove', move, false);
slider.addEventListener('mousedown', startDragging, false);
slider.addEventListener('mouseup', stopDragging, false);
slider.addEventListener('mouseleave', stopDragging, false);