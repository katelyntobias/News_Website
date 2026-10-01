/* =========================================================
   ARCHERS NETWORK
   SCRIPT.JS
========================================================= */


/* =========================================================
   HEADER — HIDE ON SCROLL DOWN
   SHOW ON SCROLL UP
========================================================= */

let lastScrollY = window.scrollY;

const header = document.querySelector("header");

if (header) {

    window.addEventListener("scroll", () => {

        const currentScrollY = window.scrollY;

        if (currentScrollY <= 20) {

            header.classList.remove("header-hidden");
            lastScrollY = currentScrollY;

            return;

        }

        if (currentScrollY > lastScrollY) {

            header.classList.add("header-hidden");

        } else {

            header.classList.remove("header-hidden");

        }

        lastScrollY = currentScrollY;

    });

}


/* =========================================================
   SEARCH OVERLAY
========================================================= */

const openSearch =
    document.getElementById("openSearch");

const closeSearch =
    document.getElementById("closeSearch");

const searchOverlay =
    document.getElementById("searchOverlay");

const searchInput =
    document.getElementById("searchInput");


if (openSearch && searchOverlay) {

    openSearch.addEventListener("click", () => {

        searchOverlay.classList.add("active");

        setTimeout(() => {

            if (searchInput) {

                searchInput.focus();

            }

        }, 250);

    });

}


if (closeSearch && searchOverlay) {

    closeSearch.addEventListener("click", () => {

        searchOverlay.classList.remove("active");

    });

}


if (searchOverlay) {

    searchOverlay.addEventListener("click", (event) => {

        if (event.target === searchOverlay) {

            searchOverlay.classList.remove("active");

        }

    });

}


document.addEventListener("keydown", (event) => {

    if (
        event.key === "Escape" &&
        searchOverlay &&
        searchOverlay.classList.contains("active")
    ) {

        searchOverlay.classList.remove("active");

    }

});


/* =========================================================
   AUTOMATIC DATES
========================================================= */

function formatArticleDate(dateString) {

    if (!dateString) {
        return "";
    }

    const publishedDate = new Date(dateString);

    if (Number.isNaN(publishedDate.getTime())) {
        return "";
    }

    const now = new Date();

    const difference =
        now.getTime() -
        publishedDate.getTime();

    const isDateOnly =
        !dateString.includes("T");


    /* DATE ONLY */

    if (isDateOnly) {

        const publishedDay =
            new Date(
                publishedDate.getFullYear(),
                publishedDate.getMonth(),
                publishedDate.getDate()
            );

        const currentDay =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );

        const calendarDifference =
            Math.round(
                (
                    currentDay.getTime() -
                    publishedDay.getTime()
                ) /
                (1000 * 60 * 60 * 24)
            );


        if (calendarDifference <= 0) {
            return "Today";
        }

        if (calendarDifference === 1) {
            return "Yesterday";
        }

        if (calendarDifference < 7) {
            return `${calendarDifference} days ago`;
        }

        return publishedDate.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );

    }


    /* EXACT TIMESTAMP */

    if (difference < 0) {
        return "Just now";
    }

    const seconds =
        Math.floor(difference / 1000);

    const minutes =
        Math.floor(seconds / 60);

    const hours =
        Math.floor(minutes / 60);

    const days =
        Math.floor(hours / 24);


    if (seconds < 60) {
        return "Just now";
    }

    if (minutes < 60) {

        return minutes === 1
            ? "1 minute ago"
            : `${minutes} minutes ago`;

    }

    if (hours < 24) {

        return hours === 1
            ? "1 hour ago"
            : `${hours} hours ago`;

    }

    if (days === 1) {
        return "Yesterday";
    }

    if (days < 7) {
        return `${days} days ago`;
    }

    return publishedDate.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


/* APPLY AUTOMATIC DATES */

function renderStaticDates() {

    const dateElements =
        document.querySelectorAll("[data-date]");

    dateElements.forEach(element => {

        const dateString =
            element.dataset.date;

        element.textContent =
            formatArticleDate(dateString);

    });

}

renderStaticDates();


/* =========================================================
   VIDEO CAROUSEL
   4 VIDEOS VISIBLE
   MOVES ONE VIDEO AT A TIME
========================================================= */

const videoTrack =
    document.querySelector(".video-track");

const previousButton =
    document.querySelector(".carousel-button.previous");

const nextButton =
    document.querySelector(".carousel-button.next");


if (videoTrack && previousButton && nextButton) {

    const videos =
        Array.from(
            videoTrack.querySelectorAll("article")
        );

    let currentIndex = 0;

    const videosPerPage = 4;


    function getCardWidth() {

        const firstCard = videos[0];

        const cardWidth =
            firstCard.offsetWidth;

        const gap = 22;

        return cardWidth + gap;

    }


    function moveCarousel(direction) {

        if (videos.length <= videosPerPage) {
            return;
        }

        videoTrack.classList.add("is-moving");


        if (direction === "next") {

            currentIndex++;

            if (
                currentIndex >
                videos.length - videosPerPage
            ) {

                currentIndex = 0;

            }

        } else {

            currentIndex--;

            if (currentIndex < 0) {

                currentIndex =
                    videos.length -
                    videosPerPage;

            }

        }


        const movement =
            currentIndex *
            getCardWidth();


        videoTrack.style.transform =
            `translateX(-${movement}px)`;


        setTimeout(() => {

            videoTrack.classList.remove(
                "is-moving"
            );

        }, 550);

    }


    nextButton.addEventListener(
        "click",
        () => moveCarousel("next")
    );


    previousButton.addEventListener(
        "click",
        () => moveCarousel("previous")
    );

}


/* =========================================================
   VIDEO POPUP
========================================================= */

const videoModal = document.getElementById("videoModal");
const videoPlayer = document.getElementById("videoPlayer");
const videoSource = document.getElementById("videoSource");
const videoModalClose = document.getElementById("videoModalClose");
const videoCards = document.querySelectorAll(".video-card");


if (
    videoModal &&
    videoPlayer &&
    videoSource &&
    videoModalClose
) {

    function openVideo(videoURL) {

        videoSource.src = videoURL;

        videoPlayer.load();

        videoModal.classList.add("active");

        videoModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow = "hidden";

        videoPlayer.play().catch(function () {
            // Browser may require the user to press play.
        });
    }


    function closeVideo() {

        videoPlayer.pause();

        videoPlayer.currentTime = 0;

        videoSource.src = "";

        videoPlayer.load();

        videoModal.classList.remove("active");

        videoModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow = "";
    }


    videoCards.forEach(function (card) {

        const button =
            card.querySelector(".video-open");

        if (!button) return;


        button.addEventListener(
            "click",
            function () {

                const videoURL =
                    card.dataset.video;

                if (!videoURL) return;

                openVideo(videoURL);

            }
        );

    });


    videoModalClose.addEventListener(
        "click",
        closeVideo
    );


    videoModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === videoModal
            ) {
                closeVideo();
            }

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                videoModal.classList.contains("active")
            ) {
                closeVideo();
            }

        }
    );

}

/* =========================================================
   PHOTO POPUP
========================================================= */

const photoModal =
    document.getElementById("photoModal");

const photoViewer =
    document.getElementById("photoViewer");

const photoModalClose =
    document.getElementById("photoModalClose");

const photoButtons =
    document.querySelectorAll(".photo-open");


if (
    photoModal &&
    photoViewer &&
    photoModalClose
) {

    function openPhoto(photoURL, altText) {

        photoViewer.src = photoURL;

        photoViewer.alt = altText;

        photoModal.classList.add("active");

        photoModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow = "hidden";
    }


    function closePhoto() {

        photoModal.classList.remove("active");

        photoModal.setAttribute(
            "aria-hidden",
            "true"
        );

        photoViewer.src = "";

        document.body.style.overflow = "";
    }


    photoButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const photoURL =
                    button.dataset.photo;

                const image =
                    button.querySelector("img");

                if (!photoURL) return;

                openPhoto(
                    photoURL,
                    image ? image.alt : "Expanded photo"
                );

            }
        );

    });


    photoModalClose.addEventListener(
        "click",
        closePhoto
    );


    photoModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === photoModal
            ) {

                closePhoto();

            }

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                photoModal.classList.contains("active")
            ) {

                closePhoto();

            }

        }
    );

}

/* =========================================================
   ABOUT POPUP
========================================================= */

const aboutModal =
    document.getElementById("aboutModal");

const aboutModalClose =
    document.getElementById("aboutModalClose");

const aboutButtons =
    document.querySelectorAll("[data-about-modal]");

const missionPanel =
    document.getElementById("missionPanel");

const teamPanel =
    document.getElementById("teamPanel");


if (
    aboutModal &&
    aboutModalClose &&
    missionPanel &&
    teamPanel
) {

    function openAboutModal(type) {

        missionPanel.classList.remove("active");

        teamPanel.classList.remove("active");


        if (type === "mission") {

            missionPanel.classList.add("active");

        }


        if (type === "team") {

            teamPanel.classList.add("active");

        }


        aboutModal.classList.add("active");

        aboutModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow = "hidden";
    }


    function closeAboutModal() {

        aboutModal.classList.remove("active");

        aboutModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow = "";
    }


    aboutButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const type =
                    button.dataset.aboutModal;

                openAboutModal(type);

            }
        );

    });


    aboutModalClose.addEventListener(
        "click",
        closeAboutModal
    );


    aboutModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === aboutModal
            ) {

                closeAboutModal();

            }

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                aboutModal.classList.contains("active")
            ) {

                closeAboutModal();

            }

        }
    );

}

/* =========================================================
   CUSTOM CURSOR
========================================================= */

const customCursor = document.querySelector(".custom-cursor");

if (customCursor) {

    document.addEventListener("mousemove", function (event) {

        customCursor.style.left = event.clientX + "px";
        customCursor.style.top = event.clientY + "px";

    });


    const cursorTargets = document.querySelectorAll(
        "a, button, input, textarea, select"
    );


    cursorTargets.forEach(function (element) {

        element.addEventListener("mouseenter", function () {

            customCursor.classList.add("hover");

        });


        element.addEventListener("mouseleave", function () {

            customCursor.classList.remove("hover");

        });

    });

}

