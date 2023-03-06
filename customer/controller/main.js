const getElement = (productId) => document.getElementById(productId);
import { Service } from "../services/productAPI.js";
import { CartItem } from "../model/cartItem.js";
import { Product } from "../model/product.js";

const service = new Service();
let cart = [];

const renderProducts = (productList) => {
    let content = "";
    productList.forEach((product) => {
        content += `
        <div class="col-12 col-md-6 col-lg-4">
                    <div class="card cardPhone">
                        <img src="${product.img}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <div>
                                        <h3 class="cardPhone__title">${product.name}</h3>
                                        <h3 class="cardPhone__title">${product.price}</h3>
                                    </div>
                                    <h2 class="cardPhone__type">${product.type}</h2>
                                    <p class="cardPhone__text">${product.desc}</p>
                                </div>
                            </div>
                            <div class="d-flex justify-content-around">
                                <div class="cardPhone__rating">
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                </div>
                            </div>
                            <span class="cardPhone__overlay">
                                <span class="cardPhone__info">
                                    <h3>- Specifications -</h3>
                                    <span class="cardPhone__info--text">
                                        <h4>Screen: </h4>
                                        <p>${product.screen}</p>
                                    </span>
                                    <span class="cardPhone__info--text">
                                        <h4>BackCamera: </h4>
                                        <p>${product.backCamera}</p>
                                    </span>
                                    <span class="cardPhone__info--text">
                                        <h4>FrontCamera: </h4>
                                        <p>${product.frontCamera}</p>
                                    </span>
                                </span>
                                <span>
                                    <button class="btnPhone-shadow" onclick = "btnAddToCart('${product.id}')"><i class="fa fa-shopping-cart"></i> Buy Now</button>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
        `;
    });
    getElement("content").innerHTML = content;
};

const renderCart = (cart) => {
    let content = '';
    cart.forEach((ele) => {
        content += `
        <div class="product">
             <div class="product__1">
                 <div class="product__thumbnail">
                    <img src=${ele.product.img} alt="Italian Trulli">
                                </div>
                                <div class="product__details">
                                    <div style="margin-bottom: 8px;"><b>${ele.product.name}</b></div>
                                    <div style="font-size: 90%;">Screen: <span class="tertiary">${ele.product.screen}</span></div>
                                    <div style="font-size: 90%;">Back Camera: <span class="tertiary">${ele.product.backCamera}</span></div>
                                    <div style="font-size: 90%;">Front Camera: <span class="tertiary">${ele.product.frontCamera}</span></div>
                                    <div style="margin-top: 8px;"><a href="#!" onclick="btnRemove('${ele.product.id}')">Remove</a>
                                    </div>
                                </div>
                            </div>
                            <div class="product__2">
                                <div class="qty">
                                    <span><b>Quantity:</b> </span> &nbsp; &nbsp;
                                    <span class="minus bg-dark" onclick="btnMinus('${ele.product.id}')">-</span>
                                    <span class="quantityResult mx-2">${ele.quantity}</span>
                                    <span class="plus bg-dark" onclick="btnAdd('${ele.product.id}')">+</span>
                                </div>
                                <div class="product__price"><b>$${ele.quantity * ele.product.price}</b></div>
                            </div>
                        </div>`;
    });
    getElement("cartList").innerHTML = content;

    // Số lượng product trong cart
    let cartCount = 0;
    cart.forEach((ele) => {
        cartCount += ele.quantity;
    });
    getElement("cartCount").innerHTML = cartCount;

    // In Tổng tiền giao diện
    const subTotal = calcSubTotal(cart);
    const shipping = subTotal > 0 ? 10 : 0;
    getElement("subTotal").innerHTML = "$" + subTotal;
    getElement("shipping").innerHTML = "$" + shipping;
    getElement("tax").innerHTML = "$" + Math.floor(subTotal * 0.1);
    getElement("priceTotal").innerHTML = "$" + Math.floor(subTotal * 1.1 + shipping);

};

// hàm tính tổng tiền trong Cart
const calcSubTotal = (cart) => {
    let total = 0;
    cart.forEach((ele) => {
        total += ele.product.price * ele.quantity;
    });
    return total;
};

// Load data render
window.onload = async () => {
    const productList = await service.getProducts();
    renderProducts(productList);
    cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
    renderCart(cart);
}

// Filter phone theo hãng
getElement("selectList").onchange = async () => {
    const data = await service.getProducts();
    const selectValue = getElement("selectList").value;
    let filterData;
    if (selectValue == "") {
        filterData = data;
    } else {
        filterData = data.filter((product) => product.type == selectValue);
    }
    renderProducts(filterData);
};

// Event click vào btn Buy Now
window.btnAddToCart = async (productId) => {
    const phoneData = await service.getProductByID(productId);
    const { id, name, price, screen, backCamera, frontCamera, img, desc, type } = phoneData;
    const product = new Product(
        id,
        name,
        price,
        screen,
        backCamera,
        frontCamera,
        img,
        desc,
        type
    );
    const newCartItem = new CartItem(product, 1);
    let cartItem = findItemById(cart, newCartItem.product.id);
    !cartItem ? cart.push(newCartItem) : cartItem.quantity++;
    renderCart(cart);
    localStorage.setItem("cart", JSON.stringify(cart));
};

// Hàm tìm cartItem trong giỏ hàng theo id prduct, trả về cartItem
const findItemById = (cart, productId) => {
    let item;
    cart.forEach((ele) => {
        if (ele.product.id == productId) {
            item = ele;
            return;
        }
    });
    return item;
};

// Dấu + trong Cart
window.btnAdd = (productId) => {
    let cartItem = findItemById(cart, productId);
    if (cartItem) {
        cartItem.quantity++;
    }
    renderCart(cart);
    localStorage.setItem("cart", JSON.stringify(cart))
};

// Dấu - trong Cart
window.btnMinus = (productId) => {
    let cartItem = findItemById(cart, productId);
    if (cartItem) {
        cartItem.quantity--;
    }
    cart = cart.filter((ele) => {
        if (ele.quantity != 0) {
            return ele.quantity;
        }
    })
    renderCart(cart);
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Click payNow, emptyCart set mảng Cart vể array rổng
window.emptyCart = () => {
    cart = [];
    renderCart(cart);
    localStorage.setItem("cart", JSON.stringify(cart));
}
window.payNow = () => {
    emptyCart();
    localStorage.setItem("cart", JSON.stringify(cart));
}

// btnRemove product khỏi Cart
window.btnRemove = (id) => {
    cart = cart.filter((ele) => ele.product.id != id);
    renderCart(cart);
    localStorage.setItem("cart", JSON.stringify(cart));
}