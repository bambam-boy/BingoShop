const pageCache = {}
let sortOrder = ''
selectup()
$("#propanle").addClass("bg-dark")
let tbody = $("#tbodyProducts")
let thead = $("#theadAdP")
let parentdiv = $("#divtableparent")
let clbutton = $("#clbtn")
let validationspanforparentinput = $("#validspanparents")
const registerform = $("#sign-up-form")
const loginform = $("#sign-in-form")
const tabledata = $("#InsertTable")
let itemsid
let token
const accountpanelform = $("#validationform")
const changepasswordform = $("#changepasswordform")

$(document).ready(function () {
    checkcountorder()
    loginform.submit((event) => {
        event.preventDefault();
        if (!loginform[0].checkValidity()) {
            event.stopPropagation();
            startshow('false', 'Failed to login', 'Please fill out the form carefully')
        }
        else {
            let formData = new FormData();
            formData.append("UserName", $("#loginusername").val())
            formData.append("keeplo", $("#keeplo").val())
            formData.append("Password", $("#loginpassword").val())
            $.ajax({
                url: '/Account/Loginconfrem',
                type: 'post',
                data: formData,
                processData: false,
                contentType: false,
                success: function (value) {
                    if (value == 'error') {
                        startshow('false', 'Failed to login', 'There was a problem. Please try again')
                        $("#loginusername").val(null)
                        $("#loginpassword").val(null)
                        $("#keeplo").prop("disabled", "disabled")
                    }
                    if (value == "mustreg") {
                        $("#sign-up-btn").click();
                        startshow('false', 'Failed to login', 'You already have an account')
                        $("#loginusername").val(null)
                        $("#loginpassword").val(null)
                    }
                    if (value == "Fixed") {

                        startshow('true', 'successfully logged in.', 'Enjoy your shopping.')
                        setTimeout(() => window.location.href = "/Home/Index", 2500);
                    }
                    if (value == "catch") {
                        startshow('false', 'Failed to login', 'There was a problem. Please try again')
                        $("#loginusername").val(null)
                        $("#loginpassword").val(null)
                    }
                }
            })

        }
        loginform.addClass('was-validated')
    })

    //---------------------------------------------------------------------------------------------------------------------------------------------------------------


    registerform.submit((event) => {
        event.preventDefault();
        if (!registerform[0].checkValidity()) {
            event.stopPropagation();
            startshow('false', 'Failed to register', 'Please fill out the form carefully')
        }
        else {
            let checker
            let filter = /^[0-9]{4}[0-9]{3}[0-9]{4}$/;
            let phonenumber = $("#PhoneNumber").val()
            let phonspan = $("#validsapn")
            let passspan = $("#passvlidspan")
/*            if (filter.test(phonenumber) !== true) { checker = "fonovalid" }*/
            if ($("#Password").val() !== $("#repass").val()) { checker = "passnotmatch" }
            if ($("#Password").val() !== $("#repass").val() && filter.test(phonenumber) !== true) { checker = "tobad" }
            if (checker == "fonovalid") { phonspan.html("phone number is invalid"); $("#PhoneNumber").val(null) }
            else if (checker == "passnotmatch") { passspan.html("passwords are not match"); $("#Password").val(null); $("#repass").val(null) }
            else if (checker == "tobad") { phonspan.html("phone number is invalid"); passspan.html("passwords are not match"); $("#PhoneNumber").val(null); $("#Password").val(null); $("#repass").val(null); }
            else { phonspan.html(null); passspan.html(null); senditems() }
            function senditems() {
                let formData = new FormData()
                formData.append("FullName", $("#FullName").val())
                formData.append("UserName", $("#UserName").val())
                formData.append("PhoneNumber", $("#PhoneNumber").val())
                formData.append("Password", $("#Password").val())
                $.ajax({
                    url: "/Account/RegisterConferm",
                    data: formData,
                    type: "post",
                    contentType: false,
                    processData: false,
                    success: function (value) {
                        if (value == "success") {
                            $("#sign-in-btn").click()
                            startshow('true', 'successfully registered', 'Now its time to login')
                            $("#FullName").val(null)
                            $("#UserName").val(null)
                            $("#Password").val(null)
                            $("#PhoneNumber").val(null)
                            $("#repass").val(null)
                            registerform.removeClass('was-validated')
                        }
                        else if (value == "errorreg") {
                            startshow('false', 'Failed to register', 'There was a problem. Please try again')
                            $("#FullName").val(null)
                            $("#UserName").val(null)
                            $("#Password").val(null)
                            $("#repass").val(null)
                            $("#PhoneNumber").val(null)
                        }
                        else if (value == "catch") {
                            startshow('false', 'Failed to register', 'There was a problem. Please try again')
                            $("#FullName").val(null)
                            $("#UserName").val(null)
                            $("#Password").val(null)
                            $("#repass").val(null)
                            $("#PhoneNumber").val(null)
                        }
                        else {
                            $("#sign-in-btn").click()
                            startshow('false', 'You already have an account.', 'Login in to your account or click forgotpassword to recover your account')
                            $("#FullName").val(null)
                            $("#UserName").val(null)
                            $("#Password").val(null)
                            $("#repass").val(null)
                            $("#PhoneNumber").val(null)
                        }
                    }
                })
            }
        }
        registerform.addClass('was-validated')
    })

    if (window.location.pathname == "/Account/AccountPanel") {
        $.post("/Account/ShowDetails", function (value) {
            $("#FullName").val(value.fullName)
            $("#UserName").val(value.userName)
            $("#PhoneNumber").val(value.phoneNumber)
        })
    }

    if (window.location.pathname == "/Products/ProductsHomePage") {
        cardgen(1);
    }

    if (window.location.pathname == "/Account/OrdersPanel") {
        ordersgen();
    }

    if (window.location.pathname == "/Products/ProductsMoreDetailsPage") {
        $.post("/Products/Checklike", { id: window.location.search.split("=").pop() }, function (value) {
            if (value != true) {
                $("#iblike").removeClass("fa-regular")
                $("#iblike").addClass("fa-solid")
            }
        })
    }

    if (window.location.pathname == "/Account/BestProductsPage") {
        $.post("/Products/LoadBestProducts", function (value) {
            if (value.length !== 0) {
                $("#nocontentdivbestorder").html("")
                let cards = ''
                value.forEach((item) => {
                    cards += `
                            <div class="col-12 col-lg-4 col-xxl-3 col-xl-3 col-md-6 py-md-2 divpadding">
            <div class="card pl-5">
                <img src="data:image/*;base64,${item.imageslistproductsviewmodels[0].imagebyteviewmodel}" 
                     class="card-img-top img-thumbnail" alt="${escapeHTML(item.name)}">
                <div class="card-body p-0 px-2 carddiv align-content-center text-center">
                    <h5 class="card-title text-center">${escapeHTML(item.name)}</h5>
                    <p class="card-text align-self-center">${escapeHTML(item.description)}</p>
                    <div class="text-center align-content-start">
                        <span class="count">$${item.price}</span>
                    </div>
                    <div class="divstars">
                        ${generateStars(4, 5)}
                    </div>
                </div>
                <div class="card-button align-content-end mt-2">
                    <button class="btn w-100 rounded-0 rounded-bottom btn-primary btncards" onclick="setid(${item.id})">See more</button>
                </div>
            </div>
        </div>`
                })
                $("#divbestcards").append(cards)
            }
            else {
                $("#nocontentdivbestorder").html("You did not like any products")
            }
        })
    }
})

tabledata.submit((event) => {
    event.preventDefault()
    $("#desspan").html(null)
    if (!tabledata[0].checkValidity()) {
        event.stopPropagation();
        startshow('false', 'Failed to Insert', 'Please fill out the form carefully')
    }
    else if ($("#description").val().length < 50) {
        $("#desspan").html(" The description must be more than 50 characters long. Please provide more details.")
    }
    else {
        let formData = new FormData()
        formData.append("name", $("#name").val())
        formData.append("price", $("#price").val())
        formData.append("count", $("#count").val())
        formData.append("order", $("#order").prop('checked'))
        formData.append("Cityid", $("#Cityid").val())
        formData.append("Tagsid", $("#Tagsid").val())
        formData.append("Brandid", $("#Brandid").val())
        formData.append("description", $("#description").val())
        let image = $("#Image").get(0).files
        alert(image[0])
        for (var i = 0; i < image.length; i++) {
            formData.append("Image", image[i])
        }
        $.ajax(
            {
                url: "/Products/InserItem",
                type: "post",
                enctype: "multipart/form-data",
                data: formData,
                contentType: false,
                processData: false,
                success: (value) => {
                    if (value == "success") {
                        startshow('true', `product was added successfully.`, 'The desired item was added successfully.')
                        $("#name").val(null)
                        $("#price").val(null)
                        $("#count").val(null)
                        $("#Cityid").prop("selectedIndex", [0])
                        $("#Brandid").prop("selectedIndex", [0])
                        $("#Tagsid").prop("selectedIndex", [0])
                        $("#order").prop("checked", false)
                        $("#Image").val(null)
                        $("#description").val(null)
                        tabledata.removeClass('was-validated')
                        if (token !== null && token == "Product") {
                            $("#Prdlistbtn").click()
                        }
                    }
                    else {
                        startshow('false', "error faild to insert", 'There was a problem. Please try again')
                        $("#name").val(null)
                        $("#price").val(null)
                        $("#count").val(null)
                        $("#Cityid").prop("selectedIndex", [0])
                        $("#Brandsid").prop("selectedIndex", [0])
                        $("#Tagsid").prop("selectedIndex", [0])
                        $("#order").prop("checked", false)
                        $("#Image").val(null)
                        $("#description").val(null)
                    }
                }
            }
        )
    }
    tabledata.addClass('was-validated')
})

clbutton.click(() => { $("#modeldiv input").prop("id", ""); $("#modeldiv input").val(null); validationspanforparentinput.html("") })

$("#cityin").click(() => {
    $("#addbtnpopup").text("Add City");
    $("#exampleModalLabel").text("City PopUP")
    $("#addbtnpopup").off("click").on("click", () => {
        $("#modeldiv input").prop("id", "CityinputInsert")
        $.post("/Products/CheckNamecity", { name: $("#CityinputInsert").val() }, function (value) {
            validationspanforparentinput.html("")
            if (value !== false) {
                let formData = new FormData()
                formData.append("Cityname", $("#CityinputInsert").val())
                $.ajax(
                    {
                        url: "/Products/Insertcity",
                        type: 'post',
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function (value) {
                            if (value == "null") {
                                validationspanforparentinput.html("the input can not be null")
                            }
                            else {
                                clbutton.click();
                                startshow('true', `city is inserted`, 'the city inserted successfuly you can see it in the table list')
                                selectup()
                                if (token !== null && token == "city") {
                                    $("#Citlistbtn").click()
                                }
                            }
                        },
                        error: function (value) {
                            clbutton.click();
                            startshow('false', `error`, value)
                        }
                    }
                )
            } else {
                validationspanforparentinput.html("This city already exists.")
            }
        })
    })
})

$("#brandin").click(() => {
    $("#addbtnpopup").text("Add Brand");
    $("#exampleModalLabel").text("Brand PopUP")
    $("#addbtnpopup").off("click").on("click", () => {
        $("#modeldiv input").prop("id", "BrandinputInsert")
        $.post("/Products/CheckNamebrand", { name: $("#BrandinputInsert").val() }, function (value) {
            validationspanforparentinput.html("")
            if (value !== false) {
                let formData = new FormData()
                formData.append("brandName", $("#BrandinputInsert").val())
                $.ajax(
                    {
                        url: "/Products/Insertbrand",
                        type: 'post',
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function (value) {
                            if (value == "null") {
                                validationspanforparentinput.html("you left that field blank")
                            }
                            else {
                                clbutton.click();
                                startshow('true', `brand is inserted`, value)
                                selectup()
                            }
                        },
                        error: function (value) {
                            clbutton.click();
                            startshow('false', `error`, value)
                        }
                    }
                )
            }
            else {
                validationspanforparentinput.html("This brand already exists.")
            }
        })
    })
})

$("#Tagin").click(() => {
    $("#addbtnpopup").text("Add tag");
    $("#exampleModalLabel").text("tag PopUP")
    $("#addbtnpopup").off("click").on("click", () => {
        $("#modeldiv input").prop("id", "taginputInsert")
        $.post("/Products/Checknametag", { name: $("#taginputInsert").val() }, function (value) {
            validationspanforparentinput.html("")
            if (value !== false) {
                let formData = new FormData()
                formData.append("tagname", $("#taginputInsert").val())
                $.ajax(
                    {
                        url: "/Products/InsertTag",
                        type: 'post',
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function (value) {
                            if (value == "null") {
                                validationspanforparentinput.html("you left that field blank")
                            }
                            else {
                                clbutton.click();
                                startshow('true', `tag is inserted`, value)
                                selectup()
                            }
                        },
                        error: function (value) {
                            clbutton.click();
                            startshow('false', `error`, value)
                        }
                    }
                )
            }
            else {
                validationspanforparentinput.html("This tag already exists.")
            }
        })
    })
})

function selectup() {
    let selectelementcity = $("#Cityid")
    selectelementcity.empty().append(`<option selected disabled value="">--select a city--</option>`)
    $.post("/Products/loadselectscity", function (data) {
        let options_slelect_city
        data.forEach((value) => {
            options_slelect_city = `<option value="${value.id}">${value.name}</option>`
            selectelementcity.append(options_slelect_city)
        })
    })
    let selectelementbrand = $("#Brandid")
    selectelementbrand.empty().append(`<option selected disabled value="">--select a brand--</option>`)
    $.post("/Products/loadselectsbrand", function (data) {
        let options_slelect_brand
        data.forEach((value) => {
            options_slelect_brand = `<option value="${value.id}">${value.name}</option>`
            selectelementbrand.append(options_slelect_brand)
        })
    })
    let selectelementtag = $("#Tagsid")
    selectelementtag.empty().append(`<option selected disabled value="">--select a tag--</option>`)
    $.post("/Products/loadselectstag", function (data) {
        let options_slelect_tag
        data.forEach((value) => {
            options_slelect_tag = `<option value="${value.id}">${value.name}</option>`
            selectelementtag.append(options_slelect_tag)
        })
    })
}

$("#closetable").click(() => {
    parentdiv.prop("hidden", "hidden")
    tbody.empty()
    thead.empty()
    token = ''
})

function Deleteproducts(id) {
    $.post("/Products/DeleteProducts", { id: id }, function (value) {
        if (value == "delete") {
            startshow('true', 'Item Deleted Successfully', 'The selected item has been deleted successfully. This action cannot be undone.')
            $("#Prdlistbtn").click()
        }
        else {
            startshow('false', 'Error Deleting Item', value)
        }
    })
}

function DeleteCity(id) {
    $.post("/Products/DeleteCity", { id: id }, function (value) {
        if (value == "delete") {
            startshow('true', 'Item Deleted Successfully', 'The selected item has been deleted successfully. This action cannot be undone.')
            $("#Citlistbtn").click()
            selectup()
        }
        else {
            startshow('false', 'Error Deleting Item', value)
        }
    })
}

function Deletebrand(id) {
    $.post("/Products/Deletebrand", { id: id }, function (value) {
        if (value == "delete") {
            startshow('true', 'Item Deleted Successfully', 'The selected item has been deleted successfully. This action cannot be undone.')
            $("#Brandslistbtn").click()
            selectup()
        }
        else {
            startshow('false', 'Error Deleting Item', value)
        }
    })
}

function Deletetag(id) {
    $.post("/Products/Deletetag", { id: id }, function (value) {
        if (value == "delete") {
            startshow('true', 'Item Deleted Successfully', 'The selected item has been deleted successfully. This action cannot be undone.')
            $("#Tagslistbtn").click()
            selectup()
        }
        else {
            startshow('false', 'Error Deleting Item', value)
        }
    })
}

function EditProducts(id) {
    $("#name").val(null)
    $("#price").val(null)
    $("#diviamges").html(null)
    $("#count").val(null)
    $("#Cityid").prop("selectedIndex", [0])
    $("#Brandid").prop("selectedIndex", [0])
    $("#order").prop("checked", false)
    $("#Image").val(null)
    $("#description").val(null)
    itemsid = id
    $.post("/Products/EditProducts", { id: id }, function (value) {
        $("#name").val(value.name)
        $("#price").val(value.price)
        $("#count").val(value.count)
        $("#Tagsid").val(value.tagsid)
        $("#Cityid").val(value.cityid)
        $("#Brandid").val(value.brandid)
        $("#description").val(value.description)
        if (value.order == true) {
            $("#order").prop("checked", "checked")
        }
        else {
            $("#order").prop("checked", false)
        }
        let images
        value.imageslistproductsviewmodels.forEach(element => {
            images += `
                    <img class="removed" style="border-radius:10px" src="data:image/*;base64,${element.imagebyteviewmodel}" width="70" height="80">
                    <input value="${element.id}" type="checkbox" name="deleteids"/>
            `
        })
        $("#diviamges").append(images)
        $("#additembtn").prop("hidden", "hidden")
        $("#updateitem").prop("hidden", false)
        $("#Cancelbtn").prop("hidden", false)
    })
}

function cardgen(page = 1) {
    if (pageCache[page]) {
        renderCards(pageCache[page], page);
    } else {
        $.post("/Products/GenCarads", { page: page }, function (response) {
            pageCache[page] = response;

            renderCards(response, page);
        });
    }
}

function renderCards(response, currentPage) {
    if (sortOrder === 'asc') {
        response.data.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
        response.data.sort((a, b) => b.price - a.price);
    }

    const productsContainer = $("#productscontainer");
    const paginationContainer = $("#paginationcontanerul");
    productsContainer.empty();
    paginationContainer.empty();

    const cards = response.data.map((item) => generateCard(item)).join('');
    productsContainer.html(cards);


    pagemaker(response.totalCount, response.pageSize, currentPage);
}

function generateCard(item) {
    return `
        <div class="col-12 col-lg-4 col-xxl-3 col-xl-3 col-md-6 py-md-2 divpadding">
            <div class="card pl-5">
                <img src="data:image/*;base64,${item.imageslistproductsviewmodels[0].imagebyteviewmodel}" 
                     class="card-img-top img-thumbnail" alt="${escapeHTML(item.name)}">
                <div class="card-body p-0 px-2 carddiv align-content-center text-center">
                    <h5 class="card-title text-center">${escapeHTML(item.name)}</h5>
                    <p class="card-text align-self-center">${escapeHTML(item.description)}</p>
                    <div class="text-center align-content-start">
                        <span class="count">$${item.price}</span>
                    </div>
                    <div class="divstars">
                        ${generateStars(4, 5)} <!-- Example: 4 active stars out of 5 -->
                    </div>
                </div>
                <div class="card-button align-content-end mt-2">
                    <button class="btn w-100 rounded-0 rounded-bottom btn-primary btncards" onclick="setid(${item.id})">See more</button>
                </div>
            </div>
        </div>`;
}

function generateStars(activeStars, totalStars) {
    let stars = '';
    for (let i = 0; i < totalStars; i++) {
        stars += `<a class="btnstars">
                    <i class="bi bi-star-fill ${i < activeStars ? 'activestar' : ''}"></i>
                  </a>`;
    }
    return stars;
}

function pagemaker(totalCount, pageSize, currentPage) {
    const totalPages = Math.ceil(totalCount / pageSize);
    let pagination = '';

    pagination += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}" onclick="navigatePage(${currentPage - 1})">
                <i class="bi bi-arrow-bar-left"></i>
            </a>
        </li>`;

    for (let i = 1; i <= totalPages; i++) {
        pagination += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link text-light" href="#" data-page="${i}" onclick="navigatePage(${i})">${i}</a>
            </li>`;
    }

    pagination += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}" onclick="navigatePage(${currentPage + 1})">
                <i class="bi bi-arrow-bar-right"></i>
            </a>
        </li>`;

    $("#paginationcontanerul").html(pagination);
}

function navigatePage(page) {
    if (page < 1 || (pageCache[page] && page > Math.ceil(pageCache[page].totalCount / pageCache[page].pageSize))) {
        return;
    }
    cardgen(page);
}

function escapeHTML(str) {
    return str.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

$('#btnlowtohieght').on('click', function () {
    sortOrder = 'asc';

    cardgen(1);
})

$('#btnhieghttolow').on('click', function () {
    sortOrder = 'desc';

    cardgen(1);
})

$('#btnallproducts').on('click', function () {
    sortOrder = '';

    cardgen(1);
})

$(document).on("click", ".page-link", function (e) {
    e.preventDefault()
    const page = parseInt($(this).data("page"))
    if (!isNaN(page)) {
        cardgen(page)
    }
})

$("#Cancelbtn").click(() => {
    $("#name").val(null)
    $("#price").val(null)
    $("#count").val(null)
    $("#Cityid").prop("selectedIndex", [0])
    $("#Brandid").prop("selectedIndex", [0])
    $("#Tagsid").prop("selectedIndex", [0])
    $("#order").prop("checked", false)
    $("#Image").val(null)
    $("#diviamges").html(null)
    $("#additembtn").prop("hidden", false)
    $("#updateitem").prop("hidden", "hidden")
    $("#Cancelbtn").prop("hidden", "hidden")
    $("#description").val(null)
})

$("#updateitem").click(() => {
    let formData = new FormData()
    formData.append("id", itemsid)
    formData.append("name", $("#name").val())
    formData.append("price", $("#price").val())
    formData.append("count", $("#count").val())
    formData.append("Cityid", $("#Cityid").val())
    formData.append("Tagsid", $("#Tagsid").val())
    formData.append("Brandid", $("#Brandid").val())
    formData.append("order", $("#order").prop('checked'))
    formData.append("description", $("#description").val())
    $("#diviamges input").each(function () {
        if ($(this).prop('checked') != false) {
            formData.append('Deleteimagesid', ($(this).val()))
        }
    })
    let image = $("#Image").get(0).files
    for (var i = 0; i < image.length; i++) {
        formData.append("Image", image[i])
    }
    $.ajax(
        {
            url: "/Products/UpdateProducts",
            enctype: "multipart/form-data",
            type: "post",
            contentType: false,
            processData: false,
            data: formData,
            success: function () {
                startshow("true", "Product Updated Successfully", "The product has been successfully updated. All changes have been saved.")
                $("#name").val(null)
                $("#price").val(null)
                $("#count").val(null)
                $("#Cityid").prop("selectedIndex", [0])
                $("#Brandid").prop("selectedIndex", [0])
                $("#Tagsid").prop("selectedIndex", [0])
                $("#order").prop("checked", false)
                $("#Image").val(null)
                $("#diviamges").html(null)
                $("#additembtn").prop("hidden", false)
                $("#updateitem").prop("hidden", "hidden")
                $("#Cancelbtn").prop("hidden", "hidden")
                $("#Prdlistbtn").click()
            },
            error: function (value) {
                startshow("false", "Product Update Failed", value)
            }
        }
    )
})

$("#Prdlistbtn").click(() => { token = "Product"; select() })

$("#Citlistbtn").click(() => { token = "city"; select() })

$("#Tagslistbtn").click(() => { token = "tag"; select() })

$("#Brandslistbtn").click(() => { token = "brand"; select() })

function select() {
    tbody.empty()
    thead.empty()
    let tr
    let trhead
    if (token == "Product") {
        $.post("/Products/ShowProducts", function (items) {
            trhead = `
            <tr>
                <th>#</th>
                <th>name</th>
                <th>pricr</th>
                <th>count</th>
                <th>order</th>
                <th>city</th>
                <th>brand</th>
                <th>tag</th>
                <th>action</th>
            </tr>
        `
            let checkbox
            items.forEach((vals, Index) => {
                if (vals.order == true) {
                    checkbox = `<input type="checkbox" checked>`
                }
                else {
                    checkbox = `<input type="checkbox">`
                }
                tr += `
            <tr>
                <td>${Index + 1}</td>
                <td>${vals.name}</td>
                <td>${vals.price}</td>
                <td>${vals.count}</td>
                <td >${checkbox}</td>
                <td>${vals.cityname}</td>
                <td>${vals.brandName}</td>
                <td>${vals.tagname}</td>
                <td>
                <button class="btn btn-danger" onclick="Deleteproducts(${vals.id})">Delete</button>
                <button class="btn btn-success" onclick="EditProducts(${vals.id})">Update</button>
                </td>
            </tr>
            `
            })
            thead.append(trhead)
            tbody.append(tr)
        })
    }
    else if (token == "city") {
        $.post("/Products/ShowCity", function (value) {
            trhead = `
            <tr>
                <th>id</th>
                <th>name</th>
                <th>action</th>
            </tr>
        `
            value.forEach((vals, Index) => {
                tr += `
            <tr>
                <td>${Index + 1}</td>
                <td>${vals.name}</td>
                <td><button class="btn btn-danger" onclick="DeleteCity(${vals.id})">Delete</button></td>
            </tr>
            `
            })
            thead.append(trhead)
            tbody.append(tr)
        })
    }
    else if (token == "tag") {
        $.post("/Products/Showtags", function (value) {
            trhead = `
            <tr>
                <th>id</th>
                <th>name</th>
                <th>action</th>
            </tr>
        `
            value.forEach((vals, Index) => {
                tr += `
            <tr>
                <td>${Index + 1}</td>
                <td>${vals.name}</td>
                <td><button class="btn btn-danger" onclick="Deletetag(${vals.id})">Delete</button></td>
            </tr>
            `
            })
            thead.append(trhead)
            tbody.append(tr)
        })
    }
    else {
        $.post("/Products/ShowBrand", function (value) {
            trhead = `
            <tr>
                <th>id</th>
                <th>name</th>
                <th>action</th>
            </tr>
        `
            value.forEach((vals, Index) => {
                tr += `
            <tr>
                <td>${Index + 1}</td>
                <td>${vals.name}</td>
                <td><button class="btn btn-danger" onclick="Deletebrand(${vals.id})">Delete</button></td>
            </tr>
            `
            })
            thead.append(trhead)
            tbody.append(tr)
        })
    }
    parentdiv.prop("hidden", false)
}

accountpanelform.submit((event) => {
    event.preventDefault()
    if (!accountpanelform[0].checkValidity()) {
        event.stopPropagation();
        startshow("false", "faild to update the information", "pleas fill out the form carefully...")
    }
    else {
        let formData = new FormData();
        formData.append("FullName", $("#FullName").val())
        formData.append("UserName", $("#UserName").val())
        formData.append("PhoneNumber", $("#PhoneNumber").val())
        $.ajax({
            url: "/Account/UpdateInformaiton",
            contentType: false,
            processData: false,
            type: "post",
            data: formData,
            success: function (value) {
                if (value == true) {
                    startshow("true", "the information updated successfully", "your information updated successfully!")
                    accountpanelform.removeClass("was-validated")
                }
                else {
                    startshow("false", "faild to update the information", "The email is took pleas enter a new email")
                    accountpanelform.removeClass("was-validated")
                }
            },
            error: function (value) {
                startshow("false", "faild to update the information", value)
            }
        })
    }
    accountpanelform.addClass("was-validated")
})

changepasswordform.submit((event) => {
    event.preventDefault()
    if (!changepasswordform[0].checkValidity()) {
        event.stopPropagation();
        startshow("false", "faild to change your password", "pleas fill out the form care fully")
    }
    else {
        if ($("#NewPassword").val() !== $("#Passagain").val()) {
            event.stopPropagation()
            $("#errorspan").text("The password and confirmation password do not match. Please try again.")
        }
        else {
            let formData = new FormData()
            formData.append("Oldpass", $("#CurrentPassword").val())
            formData.append("Newpass", $("#NewPassword").val())
            formData.append("Repassnew", $("#Passagain").val())
            $.ajax(
                {
                    url: "/Account/Changepass",
                    type: "post",
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (value) {
                        if (value == "success") {
                            $("#clb").click()
                            startshow("true", "Password Changed Successfully", "Your password has been changed successfully. Please use your new password the next time you log in.")
                            $("#CurrentPassword").val(null)
                            $("#NewPassword").val(null)
                            $("#Passagain").val(null)
                            changepasswordform.remove("was-validated")
                        }
                        else {
                            startshow("false", "faild to change your password", "There was a problem. Please try again")
                            $("#CurrentPassword").val(null)
                            $("#NewPassword").val(null)
                            $("#Passagain").val(null)
                        }
                    },
                }
            )
        }
    }
    changepasswordform.addClass("was-validated")
})

function setid(id) {
    window.location.href = `/Products/ProductsMoreDetailsPage?id=${id}`;
}

$("#btnaddtocard").click(() => {
    let id = window.location.search.split("=").pop()
    $.post("/Products/AddtoOrders", { id: id, count: $("#quantity").val() }, function (value) {
        if (value == "addedorder") {
            startshow("true", "the product is added", "the product is added to your order list and you have 1 day to pay it or it well be cancel")
            checkcountorder()
        }
        else {
            startshow("false", "error", "There was a problem with the order.")
        }
    })
})

function checkcountorder() {
    $.post("/Products/TotalCountOrder", function (count) {
        $("#cardtotal").text(count)
    })
}

function likeitem() {
    let id = window.location.search.split("=").pop()
    $.post("/Products/Checklike", { id: id }, function (value) {
        if (value == true) {
            $.post("/Products/AddtoBest", { id: id }, function (valueadd) {
                if (valueadd == "addtobest") {
                    startshow("true", "add shod be best products", "add shod borochek kon")
                }
                else {
                    startshow("false", "add nashod be best products", "add nashod dobare emtehan kon")
                }
            })
        }
        else {
            $.post("/Products/RemoveFromBest", { id: id }, function (valueremove) {
                if (valueremove == "removeitem") {
                    startshow("true", "as best products pak shod", "as list best proucts pak shod check kon")
                }
                else if (valueremove == "") {
                    startshow("true", "as best products pak nashod", "shoma in item ro like nakardid")
                }
                else {
                    startshow("false", "as best products pak nashod", valueremove)
                }
            })
        }
    })
}

function ordersgen() {
    let tr
    let tbodyorders = $("#tbodyOrders")
    tbodyorders.empty()
    $("#nocontenttable").html("")
    $.post("/Products/ProdcutsOrdersList", function (value) {
        let color = ""
        let text = ""
        let disabled
        if (value !== "no-order") {
            value.forEach((item, Index) => {
                if (item.status == false) {
                    text = "Pending Payment"
                    color = "text-danger"
                    disabled = ""
                }
                else {
                    text = "Paid"
                    color = "text-primary"
                    disabled = "disabled"
                }
                tr = `
                    <tr>
                        <td>${Index + 1}</td>
                        <td>${item.productname}</td>
                        <td><input class="form-control text-center"  value="${item.count}"></td>
                        <td>${item.date}</td>
                        <td class="${color}">${text}</td>
                        <td><button class="btn btn-outline-danger" ${disabled} onclick="deletorder(${item.id})">Delete the order</button></td>
                        <td><button class="btn btn-outline-info paybtns" ${disabled}  onclick="pay(${item.id})">pay the order</button></td>
                    </tr>
                `
                tbodyorders.append(tr)
            })
        }
        else {
            $("#nocontenttable").html(`<h1 class="display-6 text-center text-danger lilita-one-regular">There is no order for you</h1>`)
        }
    })
}

function deletorder(id) {
    $.post("/Products/DeleteOrder", { id: id }, function (value) {
        if (value == "delete") {
            startshow("true", "Order Cancelled", "Your order has been successfully cancelled. If this was a mistake, please contact our support team.")
            ordersgen()
        }
        else {
            startshow("false", "error", value)
        }
    })
}

function pay(id) {
    $.post("/Products/Pay", { id: id }, function (value) {
        if (value == "payed") {
            ordersgen()
            startshow("true", "Payment Successful", "Your selected item has been successfully paid for.")
        }
        else {
            startshow("false", "Payment Failed", value)
        }
    })
}