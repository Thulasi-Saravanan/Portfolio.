/*
   PORTFOLIO JAVASCRIPT
   Google Apps Script + Google Sheets
 */


/*
   GOOGLE APPS SCRIPT WEB APP URL
   = */

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzf8F4GztEqiX-sGgYYrV3Exj0FAg2a-mHpp9Z8XcMNxPAuRGIpo9t0Yfpi4oHGATMg0g/exec";


const themeToggle =
    document.getElementById("themeToggle");

const navLinks =
    document.querySelectorAll(".nav-link");

const sections =
    document.querySelectorAll("section");

const contactForm =
    document.getElementById("contactForm");

const formMessage =
    document.getElementById("formMessage");

const adminLogin =
    document.getElementById("adminLogin");

const adminDashboard =
    document.getElementById("adminDashboard");

const adminLoginForm =
    document.getElementById("adminLoginForm");

const loginMessage =
    document.getElementById("loginMessage");

const logoutBtn =
    document.getElementById("logoutBtn");

const responsesContainer =
    document.getElementById("responsesContainer");

const responseCount =
    document.getElementById("responseCount");


/* =========================================================
   ADMIN LOGIN
========================================================= */

const ADMIN_USERNAME = "admin";

const ADMIN_PASSWORD = "admin123";


/* 
   THEME
 */

function applyTheme(theme) {

    if (theme === "dark") {

        document.body.classList.add("dark-mode");

        if (themeToggle) {

            themeToggle.innerHTML =
                '<i class="fas fa-sun"></i>';

            themeToggle.setAttribute(
                "aria-label",
                "Switch to light mode"
            );

        }

    } else {

        document.body.classList.remove(
            "dark-mode"
        );

        if (themeToggle) {

            themeToggle.innerHTML =
                '<i class="fas fa-moon"></i>';

            themeToggle.setAttribute(
                "aria-label",
                "Switch to dark mode"
            );

        }

    }

}


/*
   LOAD SAVED THEM
*/

const savedTheme =
    localStorage.getItem(
        "portfolioTheme"
    );


if (savedTheme === "dark") {

    applyTheme("dark");

} else {

    applyTheme("light");

}


/*
   THEME TOGGLE
 */

if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        function () {

            const isDark =
                document.body.classList.contains(
                    "dark-mode"
                );


            if (isDark) {

                applyTheme("light");

                localStorage.setItem(
                    "portfolioTheme",
                    "light"
                );

            } else {

                applyTheme("dark");

                localStorage.setItem(
                    "portfolioTheme",
                    "dark"
                );

            }

        }
    );

}


/* 
   NAVIGATION
 */

navLinks.forEach(function (link) {

    link.addEventListener(
        "click",
        function (event) {

            const targetId =
                this.getAttribute("href");


            if (
                !targetId ||
                !targetId.startsWith("#")
            ) {

                return;

            }


            const target =
                document.querySelector(
                    targetId
                );


            if (!target) {

                return;

            }


            event.preventDefault();


            target.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        }
    );

});


/* 
   ACTIVE NAVIGATION
 */

function updateActiveNavigation() {

    let currentSection = "";


    sections.forEach(function (section) {

        const sectionTop =
            section.offsetTop - 150;


        const sectionBottom =
            sectionTop +
            section.offsetHeight;


        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionBottom
        ) {

            currentSection =
                section.id;

        }

    });


    navLinks.forEach(function (link) {

        link.classList.remove("active");


        const href =
            link.getAttribute("href");


        if (
            href === "#" +
            currentSection
        ) {

            link.classList.add("active");

        }

    });

}


window.addEventListener(
    "scroll",
    updateActiveNavigation
);


/* 
   FORM MESSAGE
 */

function showFormMessage(
    message,
    type
) {

    if (!formMessage) {

        return;

    }


    formMessage.textContent =
        message;


    formMessage.className =
        "form-message " + type;

}


/* 
   CONTACT FORM → GOOGLE SHEETS
*/

if (contactForm) {

    contactForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* GET VALUES */

            const name =
                document.getElementById(
                    "name"
                ).value.trim();


            const email =
                document.getElementById(
                    "email"
                ).value.trim();


            const subject =
                document.getElementById(
                    "subject"
                ).value.trim();


            const message =
                document.getElementById(
                    "message"
                ).value.trim();


            /* VALIDATE */

            if (
                !name ||
                !email ||
                !subject ||
                !message
            ) {

                showFormMessage(
                    "Please fill in all fields.",
                    "error"
                );

                return;

            }


            /* EMAIL VALIDATION */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                showFormMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                return;

            }


            /* BUTTON */

            const submitButton =
                contactForm.querySelector(
                    ".submit-btn"
                );


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.innerHTML = `
                    <span>Sending...</span>
                    <i class="fas fa-spinner fa-spin"></i>
                `;

            }


            /* DATA */

            const data = {

                name:
                    name,

                email:
                    email,

                subject:
                    subject,

                message:
                    message

            };


            try {

                /* SEND TO APPS SCRIPT */

                const response =
                    await fetch(
                        GOOGLE_SCRIPT_URL,
                        {

                            method:
                                "POST",

                            body:
                                JSON.stringify(
                                    data
                                )

                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Server error: " +
                        response.status
                    );

                }


                const result =
                    await response.json();


                /* SUCCESS */

                if (result.success) {

                    showFormMessage(
                        "Message sent successfully!",
                        "success"
                    );


                    contactForm.reset();

                } else {

                    showFormMessage(
                        result.error ||
                        "Unable to send message.",
                        "error"
                    );

                }

            }

            catch (error) {

                console.error(
                    "Contact form error:",
                    error
                );


                showFormMessage(
                    "Unable to send message. Please try again.",
                    "error"
                );

            }

            finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.innerHTML = `
                        <span>Send Message</span>
                        <i class="fas fa-paper-plane"></i>
                    `;

                }

            }

        }
    );

}


/* 
   ADMIN LOGIN
 */

if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const username =
                document.getElementById(
                    "adminUsername"
                ).value.trim();


            const password =
                document.getElementById(
                    "adminPassword"
                ).value;


            if (
                username ===
                    ADMIN_USERNAME &&
                password ===
                    ADMIN_PASSWORD
            ) {

                sessionStorage.setItem(
                    "adminLoggedIn",
                    "true"
                );


                adminLogin.style.display =
                    "none";


                adminDashboard.style.display =
                    "block";


                loginMessage.textContent =
                    "";


                displayResponses();

            } else {

                loginMessage.textContent =
                    "Invalid username or password.";


                loginMessage.className =
                    "login-message error";

            }

        }
    );

}


/* 
   CHECK ADMIN SESSION
 */

function checkAdminSession() {

    const loggedIn =
        sessionStorage.getItem(
            "adminLoggedIn"
        );


    if (loggedIn === "true") {

        adminLogin.style.display =
            "none";


        adminDashboard.style.display =
            "block";


        displayResponses();

    } else {

        adminLogin.style.display =
            "block";


        adminDashboard.style.display =
            "none";

    }

}


/*
   LOGOUT
 */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(
                "adminLoggedIn"
            );


            adminDashboard.style.display =
                "none";


            adminLogin.style.display =
                "block";


            adminLoginForm.reset();


            loginMessage.textContent =
                "";

        }
    );

}


/* 
   GET RESPONSES FROM GOOGLE SHEETS
 */

async function displayResponses() {

    if (!responsesContainer) {

        return;

    }


    /* LOADING */

    responsesContainer.innerHTML = `

        <div class="no-responses">

            <i class="fas fa-spinner fa-spin"></i>

            <p>
                Loading responses...
            </p>

        </div>

    `;


    if (responseCount) {

        responseCount.textContent =
            "Loading...";

    }


    try {

        /*
         Add timestamp to prevent browser
         from showing an old cached response.
        */

        const url =
            GOOGLE_SCRIPT_URL +
            "?t=" +
            Date.now();


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Server error: " +
                response.status
            );

        }


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.error ||
                "Unable to load responses."
            );

        }


        const responses =
            Array.isArray(
                result.responses
            )
                ? result.responses
                : [];


        /* COUNT */

        if (responseCount) {

            responseCount.textContent =
                `${responses.length} ${
                    responses.length === 1
                        ? "response"
                        : "responses"
                }`;

        }


        /* NO RESPONSES */

        if (responses.length === 0) {

            responsesContainer.innerHTML = `

                <div class="no-responses">

                    <i class="fas fa-inbox"></i>

                    <p>
                        No contact responses yet.
                    </p>

                </div>

            `;

            return;

        }


        /*
        Newest response first
        */

        const sortedResponses =
            [...responses].reverse();


        /* CREATE RESPONSE CARDS */

        responsesContainer.innerHTML =
            sortedResponses
                .map(function (item) {

                    return `

                        <div class="response-card">

                            <div class="response-top">

                                <div>

                                    <div class="response-name">

                                        ${escapeHTML(
                                            item.name
                                        )}

                                    </div>


                                    <div class="response-email">

                                        ${escapeHTML(
                                            item.email
                                        )}

                                    </div>

                                </div>


                                <div class="response-date">

                                    ${formatDate(
                                        item.timestamp
                                    )}

                                </div>

                            </div>


                            <div class="response-subject">

                                ${escapeHTML(
                                    item.subject
                                )}

                            </div>


                            <div class="response-message">

                                ${escapeHTML(
                                    item.message
                                )}

                            </div>

                        </div>

                    `;

                })
                .join("");

    }

    catch (error) {

        console.error(
            "Response loading error:",
            error
        );


        if (responseCount) {

            responseCount.textContent =
                "Error";

        }


        responsesContainer.innerHTML = `

            <div class="no-responses error-state">

                <i class="fas fa-circle-exclamation"></i>

                <p>
                    Unable to load responses.
                </p>


                <button
                    type="button"
                    class="retry-btn"
                    onclick="displayResponses()">

                    Try Again

                </button>

            </div>

        `;

    }

}


/* 
   ESCAPE HTML
*/

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* 
   FORMAT DATE
   */

function formatDate(timestamp) {

    if (!timestamp) {

        return "Unknown date";

    }


    const date =
        new Date(timestamp);


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return String(timestamp);

    }


    return date.toLocaleString(
        "en-IN",
        {

            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit",

            hour12:
                true

        }
    );

}


/*
   INITIALIZE
*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        checkAdminSession();

        updateActiveNavigation();

    }
);
