"use strict";

const menu = document.querySelector(".menu-btn");
const closeNavbarBtn = document.querySelector(".close-navbar-btn");
const mobileNavbar = document.querySelector(".mobile-navbar");
const body = document.body;
const darkMode = document.querySelector(".darkMode");
const darkModes = document.querySelectorAll(".darkMode");
const lightMode = document.querySelector(".lightMode");
const lightModes = document.querySelectorAll(".lightMode");
const listingFilterBtn = document.querySelector(".listing-filter-btn");
const listingFilterSidebar = document.querySelector(".listing-sidebar");
const listingFilterSidebarOverlay = document.querySelector(
  ".listing-sidebar-overlay"
);
const dashboardHeaderBtn = document.querySelector(".dashboard-header-btn");
const dashboardSidebar = document.querySelector(".dashboard-sidebar");
const dashboardSidebarOverlay = document.querySelector(
  ".dashboard-sidebar-overlay"
);
const mapBtn = document.querySelector(".map-btn");
const mapcontent = document.querySelector(".map-content");
const closeLeftSidebar = document.querySelector(".close-left-sidebar");

// mapbtn functionality
if (mapBtn) {
  mapBtn.addEventListener("click", () => {
    mapcontent.classList.toggle("open");
  });
}

if (dashboardHeaderBtn) {
  dashboardHeaderBtn.addEventListener("click", () => {
    dashboardSidebar.classList.add("left-0");
    dashboardSidebar.classList.remove("-left-64");
    dashboardSidebarOverlay.classList.remove("hidden");
    dashboardSidebarOverlay.classList.add("block");
  });
  dashboardSidebarOverlay.addEventListener("click", () => {
    dashboardSidebar.classList.remove("left-0");
    dashboardSidebar.classList.add("-left-64");
    dashboardSidebarOverlay.classList.add("hidden");
    dashboardSidebarOverlay.classList.remove("block");
  });
}

// sticky-header
const stickyHeader = document.querySelector(".sticky-header");
if (stickyHeader) {
  window.addEventListener("scroll", function () {
    if (window.scrollY > 0) {
      body.classList.add("body-header");
      stickyHeader.classList.add(
        "bg-white",
        "fixed",
        "left-0",
        "dark:bg-background",
        "text-gray-800",
        "dark:text-gray-100",
        "z-50",
        "top-0"
      );
      stickyHeader.classList.remove("relative");
    } else {
      body.classList.remove("body-header");

      stickyHeader.classList.remove(
        "bg-white",
        "fixed",
        "-top-20",
        "z-50",
        "text-gray-800",
        "top-0"
      );
    }
  });
}

// hero-section-header
const heroStickyHeader = document.querySelector(".hero-sticky-header");
if (heroStickyHeader) {
  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      body.classList.add("body-header");
      heroStickyHeader.classList.add(
        "bg-white",
        "fixed",
        "-top-20",
        "left-0",
        "dark:bg-background",
        "text-gray-800",
        "dark:text-gray-100",
        "z-50",
        "slideDown"
      );
      heroStickyHeader.classList.remove("relative");
    } else {
      body.classList.remove("body-header");

      heroStickyHeader.classList.remove(
        "bg-white",
        "fixed",
        "-top-20",
        "z-50",
        "dark:bg-background",
        "text-gray-800",
        "slideDown"
      );
    }
  });
}

// listing sidebar toggle
if (listingFilterBtn) {
  listingFilterBtn.addEventListener("click", () => {
    listingFilterSidebar.classList.add("left-0");
    listingFilterSidebar.classList.remove("-left-full");
    // listingFilterSidebarOverlay.classList.add("block");
    // listingFilterSidebarOverlay.classList.remove("hidden");
  });
  listingFilterSidebarOverlay.addEventListener("click", () => {
    listingFilterSidebar.classList.remove("left-0");
    listingFilterSidebar.classList.add("-left-full");
    // listingFilterSidebarOverlay.classList.remove("block");
    // listingFilterSidebarOverlay.classList.add("hidden");
  });
}

if (closeLeftSidebar) {
  closeLeftSidebar.addEventListener("click", () => {
    listingFilterSidebar.classList.remove("left-0");
    listingFilterSidebar.classList.add("-left-full");
  });
}

if (menu) {
  menu.addEventListener("click", () => {
    mobileNavbar.classList.remove("-left-full");
    mobileNavbar.classList.add("left-0");
  });
  closeNavbarBtn.addEventListener("click", () => {
    mobileNavbar.classList.add("-left-full");
    mobileNavbar.classList.remove("left-0");
  });
}

if (darkMode) {
  darkMode.addEventListener("click", () => {
    body.classList.add("dark");
    darkMode.classList.add("hidden");
    lightMode.classList.remove("hidden");
  });
  lightMode.addEventListener("click", () => {
    body.classList.remove("dark");
    darkMode.classList.remove("hidden");
    lightMode.classList.add("hidden");
  });
}

// dropdown started
document.addEventListener("click", (e) => {
  const isDropdownButton = e.target.matches("[data-dropdown-button]");

  if (!isDropdownButton && e.target.closest("[data-dropdown]") != null) return;

  let currentDropdown;
  if (isDropdownButton) {
    currentDropdown = e.target.closest("[data-dropdown]");
    currentDropdown.classList.toggle("active");
  }

  document.querySelectorAll("[data-dropdown].active").forEach((dropdown) => {
    if (dropdown === currentDropdown) return;
    dropdown.classList.remove("active");
  });
});

// end dropdown

const scrollTopBtn = document.querySelector(".scroll-top-btn");

if (scrollTopBtn) {
  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function () {
    scrollFunction();
  };

  function scrollFunction() {
    if (
      document.body.scrollTop > 500 ||
      document.documentElement.scrollTop > 500
    ) {
      scrollTopBtn.classList.add("opacity-1");
      scrollTopBtn.classList.remove("opacity-0");
    } else {
      scrollTopBtn.classList.remove("opacity-1");
      scrollTopBtn.classList.add("opacity-0");
    }
  }
  // When the user clicks on the button, scroll to the top of the document

  scrollTopBtn.addEventListener("click", () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });
}

// preloader js
const loader = document.querySelector(".loader");
if (loader) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("preload-disappear");
    }, 300);
  });
}

// google map
// map started
let map;

function initMap() {
  var options = {
    center: { lat: 42.3601, lng: -71.0589 },
    zoom: 8,
  };

  var map = new google.maps.Map(document.getElementById("map"), options);

  let markers = [
    {
      coords: { lat: 42.4668, lng: -70.949493 },
      iconImage:
        "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      content:
        '<img class="w-44 mb-4 h-auto rounded-lg" src="img/Image/landing-page-image/researching.jpg"> <a href="#" class="text-base mb-3 focus:outline-none font-semibold hover:text-blue-500">UI Lib</a> <p class="text-gray-500"> 3043 24th Street East, Austin,</p>',
    },
    {
      coords: { lat: 42.2626, lng: -71.8023 },
      iconImage:
        "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      content:
        '<img class="w-44  mb-4 h-auto object-cover rounded-lg" src="img/Image/landing-page-image/home-decor.jpg"> <a href="#" class="text-base mb-3 focus:outline-none font-semibold hover:text-blue-500">Resturant</a> <p class="text-gray-500"> 3043 24th New York, Austin,</p>',
    },
    {
      coords: { lat: 42.8584, lng: -70.93 },
      iconImage:
        "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      content:
        '<img class="w-44 mb-4 h-auto rounded-lg" src="img/Image/landing-page-image/concert.jpg"> <a href="#" class="text-base mb-3 focus:outline-none font-semibold hover:text-blue-500">Concert</a> <p class="text-gray-500"> 3043 24th New York, Austin,</p>',
    },
    {
      coords: { lat: 42.6526, lng: -73.7562 },
      iconImage:
        "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      content:
        ' <img class="w-44 mb-4 h-auto rounded-lg" src="img/Image/landing-page-image/coffee-house.jpg"> <a href="#" class="text-base mb-3 focus:outline-none font-semibold hover:text-blue-500">Starbucks</a> <p class="text-gray-500"> 3043 24th New York, Austin,</p>',
    },
    {
      coords: { lat: 42.6526, lng: -71.7562 },
      iconImage:
        "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      content:
        ' <img class="w-44 mb-4 h-auto rounded-lg" src="img/Image/resturant/2.jpg"> <a href="#" class="text-base mb-3 focus:outline-none font-semibold hover:text-blue-500">Starbucks</a> <p class="text-gray-500"> 3043 24th New York, Austin,</p>',
    },
  ];

  // addMarker({
  //   coords: { lat: 42.4668, lng: -70.949493 },
  //   iconImage:
  //     "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
  //   content: '<h6 class="font-semibold">UI Lib</h6>',
  // });

  // add marker functions
  const infoWindows = [];
  function addMarker({ coords, iconImage, content }, markerId) {
    const marker = new google.maps.Marker({
      position: coords,
      map,
      // icon: props.iconImage,
    });

    // check for custom icons
    if (iconImage) {
      // set icon image
      marker.setIcon(iconImage);
    }
    // check content
    if (content) {
      const infoWindow = new google.maps.InfoWindow({
        content,
      });
      infoWindows.push(infoWindow);
      marker.addListener("click", () => {
        infoWindows.forEach((infoWindow) => {
          infoWindow.close();
        });
        infoWindow.open(map, marker);
      });
      const card = document.getElementById(`${markerId}`);
      card?.addEventListener("mouseover", () => {
        infoWindows.forEach((infoWindow) => {
          infoWindow.close();
        });
        infoWindow.open(map, marker);
      });
    }
  }

  for (var i = 0; i < markers.length; i++) {
    addMarker(markers[i], `map-${i + 1}`);
  }
}

window.initMap = initMap;
