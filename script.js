const toggle = document.querySelector(".toggle");
const menuContainer = document.querySelector(".menu-container");
const themeBtn = document.getElementById("themeBtn");
const topBtn = document.getElementById("topBtn")

toggle.onclick = function () {

    menuContainer.classList.toggle("active");
};

// themeBtn.onclick = () => {
//     document.body.classList.toggle("light");
// };

AOS.init({
    duration: 1200,
    once: false,
});

topBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        topBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
    }
});

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    setTimeout(() => {
        loader.classList.add("hide");
    }, 2500);
});


const viewCv = document.getElementById("viewCv");

viewCv.addEventListener("click", () => {
    window.open(
        "./image/CV_Chettha.pdf",
        "_blank"
    );
});
const viewCv1 = document.getElementById("viewCv1");

viewCv1.addEventListener("click", () => {
    window.open(
        "./image/CV_Chettha.pdf",
        "_blank"
    );
});

emailjs.init("uLJ1iD1_xIxe2dM7T");

const form =
    document.getElementById("contactForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    emailjs.sendForm(
        "service_od3x04l",
        "template_jh6dxpf",
        this
    )
        .then(() => {
            alert("Message Sent Successfully!");

            form.reset();
        })
        .catch((error) => {
            console.log(error);

            alert("Failed to Send Message");
        });
});