'use strict';

const contactForm = document.getElementById("contact-form");
    
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
            })
        }
    })
    .catch(error => {
        status.textContent = "There was a problem submitting your form.";
    });
}
contactForm.addEventListener("submit", handleSubmit)