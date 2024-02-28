const steps = Array.from(document.querySelectorAll("form .step"));
const nextBtn = document.querySelectorAll("form .next-btn");
const prevBtn = document.querySelectorAll("form .previous-btn");
const form = document.querySelector("form");
const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");

nextBtn.forEach((button) => {
    button.addEventListener("click", () => {
        changeStep("next");
    });
});
prevBtn.forEach((button) => {
    button.addEventListener("click", () => {
        changeStep("prev");
    });
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputs = [];
    form.querySelectorAll("input").forEach((input) => {
        const { name, value } = input;
        inputs.push({ name, value });
    });
    console.log(inputs);
    form.reset();
});

function changeStep(btn) {
    let index = 0;
    const active = document.querySelector(".active");
    index = steps.indexOf(active);
    steps[index].classList.remove("active");
    if (btn === "next") {
        index++;
    } else if (btn === "prev") {
        index--;
    }
    steps[index].classList.add("active");
}


function checkform() {
    var form = document.getElementById('myForm')
    if (form.password.value != form.confirmPassword.value) {
        alert("Passwords must be the same");
        form.password.focus();
        return false;
    } else { return true; }
}

togglePassword.addEventListener('click', function (e) {
    e
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    this.classList.toggle('bi-eye');
});
toggleConfirmPassword.addEventListener('click', function (e) {
    e
    const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPassword.setAttribute('type', type);
    this.classList.toggle('bi-eye');
});