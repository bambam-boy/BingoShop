let urlcopy = document.getElementById("ibshair")

urlcopy.addEventListener("click", () => {
    navigator.clipboard.writeText(window.location.href)
    startshow('true', 'Url copied', 'The web address of this product was copied successfully')
})

let iblik = document.getElementById("iblike")

iblik.addEventListener("click", () => {
    likeitem()
    iblik.classList.toggle("fa-solid")
    iblik.classList.toggle("fa-regular")
})

let quantityInput = document.querySelector('#quantity')
let decreaseBtn = document.querySelector('.decrease')
let increaseBtn = document.querySelector('.increase')

decreaseBtn.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value)
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1
    }
})

increaseBtn.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value)
    quantityInput.value = currentValue + 1
})

let divpoinp = document.getElementById("divpoinp")
let commenti = document.getElementById("commenti")

let i = 0
commenti.addEventListener("click", () => {
    commenti.classList.toggle("bi-chat-left-dots")
    commenti.classList.toggle("bi-chat-left-dots-fill")
        i++
    if (i < 2) {
        divpoinp.innerHTML = `<div class="input-group divhiddeninp" style="transform:translateX(-100%);opacity:0;transition:1s;" id="divinpcomment">
  <input type="text" class="form-control bg-dark-subtle" placeholder="Enter your comment" aria-label="Recipient's username" aria-describedby="btnsubmitecomment">
  <button class="btn btn-outline-primary" type="button" id="btnsubmitecomment">submit</button>
</div>`
        let divinpcomment = document.getElementById("divinpcomment")
        setTimeout(() => {
            divinpcomment.classList.add("divshowinp")
        }, 1)
    }
    else {
        i = 0
        divpoinp.innerHTML = ''
    }
})

function updateMainImage(thumbnail) {
    const mainImage = document.querySelector('#divImage img');
    mainImage.src = thumbnail.src;

}