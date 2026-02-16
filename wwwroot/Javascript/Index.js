let navbarbtn = document.getElementById("navbarbtn")
let navbardiv = document.getElementById("navbarSupportedContent")
let bingologo = document.getElementById("bingob")
let shoplogo = document.getElementById("shopb")
let logoar = document.getElementById("branddiv")
let cards = document.querySelectorAll(".card")
let navlinktablefilter = document.querySelectorAll(".navlinktablefilter")
let pscroll = document.getElementById("pscro")


logoar.addEventListener("mouseover", () => {
    bingologo.style.color = "var(--logopurp)"
    shoplogo.style.color = "var(--logopink)"
    bingologo.style.transition = "0.5s"
    shoplogo.style.transition = "0.5s"
    logoar.style.transition = "0.5s"
})

logoar.addEventListener("mouseout", () => {
    bingologo.style.color = "var(--logopink)"
    shoplogo.style.color = "var(--logopurp)"
    bingologo.style.transition = "0.5s"
    shoplogo.style.transition = "0.5s"
    logoar.style.transition = "0.5s"
})


cards.forEach((elemnets) => {
    elemnets.addEventListener("mouseout", (item) => {
        item.target.style.transition = "transform 0.5s"
    })
})

navlinktablefilter.forEach((elemnets) => {
    elemnets.addEventListener("click", (elemnt) => {
        navlinktablefilter.forEach((all) => {
            all.classList.remove('active')
        })
        elemnt.target.classList.add("active")
    })
})

let textsheader = document.querySelectorAll(".carousel-inner div:nth-child(1) .headertag")
let textsp1 = document.querySelectorAll(".carousel-inner div:nth-child(1) .midletage")
let textsp2 = document.querySelectorAll(".carousel-inner div:nth-child(1) .endtag")

window.addEventListener("DOMContentLoaded", () => {
    setTimeout(classesedite, 600)
})

function classesedite() {
    textsheader.forEach((onetextheader) => {
        onetextheader.classList.remove('textsheader')
        onetextheader.classList.add("textsheader-show")
    })
    textsp2.forEach((onetextp2) => {
        onetextp2.classList.remove('textsp2')
        onetextp2.classList.add('textsp2-show')
    })
    textsp1.forEach((onetextp1) => {
        onetextp1.classList.remove('textsp1')
        onetextp1.classList.add('textsp1-show')
    })
}

function startshow(typegiver, title, content) {
    let notifications = document.querySelector('.notifications');
    window.addEventListener("resize",()=>{
        if(window.screenY<=90){
            let toastcored = document.querySelectorAll(".toastcored")
            toastcored.forEach((oneoftoas) => {
                window.addEventListener
            })
        }
    })
    let type
    let icon
    if (typegiver == "true") {
        type = 'toastcogreen'
        icon ="bi-check-circle-fill"
    }
    else {
        type = 'toastcored'
        icon = 'bi-exclamation-triangle-fill'
    }
    let newal = document.createElement('div');
    newal.innerHTML = `
      <div class="${type} col-12 col-md-5 ms-0 ms-md-2 ms-lg-2 ms-xl-2 ms-xxl-2 col-lg-4 col-xxl-3 col-xl-3 col-sm-12">
        <i class="bi bi-x" onclick="this.parentElement.remove()"></i>
        <div class="contenttextsal">
          <div class="titleal">${title}</div>
          <div class="miancontental" id="miancontental">${content}</div>
        </div>
        <i class="bi ${icon}"></i>
      </div>`;
    notifications.appendChild(newal);
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
    newal.timeOut = setTimeout(() => newal.remove(), 5000);
}
