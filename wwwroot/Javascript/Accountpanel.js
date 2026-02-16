let btnconavle = document.getElementById("btnconavle")

window.addEventListener("scroll", () => {
    if (scrollY > 100 && window.innerWidth >= 992) {
        btnconavle.classList.add("btnfixed")
        btnconavle.classList.remove("w-25")
    }
    else if (scrollY > 100 && window.innerWidth >= 768) {
        btnconavle.classList.add("btnfixed")
        btnconavle.classList.add("w-25")

    }
    else {
        btnconavle.classList.remove("btnfixed")
        btnconavle.classList.remove("w-25")
    }
})

