'use strict';
// elements
let contactForm;
// events
window.addEventListener("hashchange", hashChange);
window.addEventListener('DOMContentLoaded', hashChange);

/**
 * If #page is found in pages calls renderPage()
 */
function hashChange() {

    const path = window.location.hash.substr(1);
    const pages = [
        "about",
        "projects",
        "contact"
    ];

    if (pages.includes(path))
        renderPage(path);
}
/**
 * Renders the page
 * @param {string} page 
 */
function renderPage(page) {

    const mainContent = document.getElementById("main-content");
    while (mainContent.firstChild) {
        mainContent.removeChild(mainContent.firstChild);
    }

    if (page === "about") {

        const template = createElement("div", {className: "about"}, [
            ["h3", {className: "title-bar", textContent: "About me"}],
            ["h4", {className: "title-context"}],
            ["p", {textContent: "Lorem ipsum."}],
            ["h5", {textContent: "Ipsum"}],
            ["p", {textContent: "Lorem ipsum dolor sit amet consectetur adipisicing elit."}]
        ]);
        mainContent.appendChild(template);
    }
    else if (page === "contact") {

        const template = createElement("div", {className: "contact"}, [
            ["h3", {className: "title-bar", textContent: "Contact me"}],
            ["h4", {className: "title-context"}],
            ["form", {id: "contact-form", action: "https://formspree.io/f/xnqwpjgb", method: "POST"}, [
                ["label", {for: "name", textContent: "Name"}],
                ["input", {type: "text", name: "name", id: "name", placeholder: "Enter your name", required: true}],
                ["label", {for: "email", textContent: "Email"}],
                ["input", {type: "email", name: "email", id: "email", placeholder: "Enter your email-address", required: true}],
                ["label", {for: "message", textContent: "Message"}],
                ["textarea", {name: "message", id: "message", required: true}],
                ["button", {type: "submit", className: "btn-style", textContent: "Submit"}],
                ["p", {id: "contact-form-status", className: "form-status"}]
            ]]
        ]);
        mainContent.appendChild(template);

        contactForm = document.getElementById("contact-form");
        contactForm.addEventListener("submit", handleSubmit);
    }
    else if (page === "projects") {
        fetchData("./data/projects.json")
        .then(data => {

            const projectsFragment = document.createDocumentFragment();
            data.forEach(element => {

                const template = createElement("div", {className: "project"}, [
                    ["h3", {className: "title-bar", textContent: element.name}],
                    ["h4", {className: "title-context", textContent: element.info}],
                    ["div", {className: "project-preview"}, [
                        ["img", {src: element.images.passive[0].url, alt: element.images.passive[0].alt}],
                        ["a", {href: element.links.demo, textContent: "Demo", target: "_blank"}],
                        ["a", {href: element.links.source, textContent: "Source", target: "_blank"}]
                    ]],
                    ["div", {className: "project-description"}, [
                        ["p", {textContent: element.description}],
                        ["h4", {textContent: element.tech}]
                    ]]
                ]);
                projectsFragment.appendChild(template);
            });

            mainContent.appendChild(projectsFragment);
        })
    }

}

/**
     * Parses parameters through document.createElement, and returns a DOM (if children param is specified, then with the children appended).
     * @param {string} type type of html-element
     * @param {*} props element properties and attributes, ie: className: "wrapper", textContent: "sometext"
     * @param  {...array} children same format: ["type", {props}, [...children]] 
     * @returns DOM object
     */
function createElement(type, props, ...children) {
    const createEl = document.createElement(type); 
    for (const [key, value] of Object.entries(props)) {
        createEl[key] = value;
    }
    for (const child of children.flat()) {
        createEl.appendChild(createElement(...child));
    }
    
    return createEl;
}

/**
 * Async wrapper for .fetch method
 * @param {string} url 
 * @param {object} params 
 * @returns 
 */
async function fetchData(url, params) {
    const response = await fetch(url, params);
    return await response.json();
}

/**
 * Parses and submits the contact form-data
 * @param {*} event 
 */
async function handleSubmit(event) {
    event.preventDefault();

    const status = document.getElementById("contact-form-status");
    const data = new FormData(event.target);

    fetch(event.target.action, {
        method: contactForm.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {

        if (response.ok) {

            status.textContent = "Thanks for contacting me.";
            contactForm.reset();
        } else {

            response.json().then(data => {

                if (Object.hasOwn(data, 'errors')) {
                    status.textContent = data["errors"].map(error => error["message"]).join(", ");
                } else {
                    status.textContent = "Oops! There was a problem submitting your form";
                }
            });
        }
    })
    .catch(error => {
        status.textContent = "There was a problem submitting your form.";
    });
}