getProducts();

// Hàm gửi yêu cầu lấy danh sách sản phẩm từ API
function getProducts(searchValue) {
  apiGetProducts(searchValue)
    .then((response) => {
      // Call API thành công
      const products = response.data.map((product) => {
        return new Product(
          product.id,
          product.name,
          product.price,
          product.screen,
          product.backCamera,
          product.frontCamera,
          product.img,
          product.desc,
          product.type
        );
      });

      renderProducts(products);
    })
    .catch((error) => {
      // Call API thất bại
      alert("API get products error");
    });
}

// Hàm thêm sản phẩm: DOM và gửi yêu cầu thêm sản phẩm tới API
function createProduct() {
  const product = {
    name: getElement("#TenSP").value,
    price: getElement("#GiaSP").value,
    screen: getElement("#ManhinhSP").value,
    backCamera: getElement("#CameraSau").value,
    frontCamera: getElement("#CameraTruoc").value,
    img: getElement("#HinhSP").value,
    desc: getElement("#GioithieuSP").value,
    type: getElement("#loaiSP").value,

  };

  apiCreateProduct(product)
    .then((response) => {
      // Sau khi gọi API thêm sản phẩm thành công, dữ liệu chỉ mới thay đổi ở phía server
      // Cần gọi lại API lấy danh sách sản phẩm (lúc này sẽ bao gồm sản phẩm vừa được thêm thành công) và hiển thị ra giao diện
      getProducts();
    })
    .catch((error) => {
      alert("Thêm sản phẩm thất bại");
    });
}

// Hàm xoá sản phẩm
function deleteProduct(productId) {
  apiDeleteProduct(productId)
    .then(() => {
      getProducts();
    })
    .catch((error) => {
      alert("Xoá sản phẩm thất bại");
    });
}

// Hàm lấy chi tiết 1 sản phẩm và hiển thị lên modal
function selectProduct(productId) {
  apiGetProductById(productId)
    .then((response) => {
      const product = response.data;
      getElement("#TenSP").value = product.name;
      getElement("#GiaSP").value = product.price;
      getElement("#ManhinhSP").value = product.screen;
        getElement("#CameraSau").value = product.backCamera;
        getElement("#CameraTruoc").value = product.frontCamera;
        getElement("#HinhSP").value = product.img;
        getElement("#GioithieuSP").value = product.desc;
        getElement("#loaiSP").value = product.type;

        // Mở và cập nhật giao diện cho modal
        getElement(".modal-title").innerHTML = "Cập nhật sản phẩm";
      getElement(".modal-footer").innerHTML = `
       
        <button class="btn btn-primary" onclick="updateProduct('${product.id}')">Cập nhật</button>
        <button class="btn btn-secondary" data-dismiss="modal">Huỷ</button>
      `;
      $("#myModal").modal("show");
    })
    .catch((error) => {
      alert("Lấy chi tiết sản phẩm thất bại");
    });
}

// Hàm cập nhật sản phẩm
function updateProduct(productId) {
  const product = {
    name: getElement("#TenSP").value,
    price: getElement("#GiaSP").value,
    screen: getElement("#ManhinhSP").value,
    backCamera: getElement("#CameraSau").value,
    frontCamera: getElement("#CameraTruoc").value,
    img: getElement("#HinhSP").value,
    desc: getElement("#GioithieuSP").value,
    type: getElement("#loaiSP").value,
  };

  apiUpdateProduct(productId, product)
    .then((response) => {
      getProducts();
    })
    .catch((error) => {
      alert("Cập nhật sản phẩm thất bai");
    });
}

// Hàm hiển thị danh sách sản phẩm ra table
function renderProducts(products) {
  let html = products.reduce((result, product, index) => {
    return (
      result +
      `
      <tr>
        <td>${index + 1}</td>
        <td>${product.name}</td>
        <td>${product.price}</td>
        <td>${product.screen}</td>
        <td>${product.backCamera}</td>
        <td>${product.frontCamera}</td>

        <td>
          <img src="${product.img}" with="80" height="80" />
        </td>
        <td>${product.desc}</td>
        <td>${product.type}</td>
        <td>
          <button
            class="btn btn-primary"
            onclick="selectProduct('${product.id}')"
          >
            Chỉnh sửa
          </button>
          <button
            class="btn btn-danger"
            onclick="deleteProduct('${product.id}')"
          >
            Xoá
          </button>
        </td>
      </tr>
    `
    );
  }, "");

  document.getElementById("tblDanhSachSP").innerHTML = html;
}

// ============ DOM ===============
getElement("#btnThemSP").addEventListener("click", () => {
  getElement(".modal-title").innerHTML = "Thêm sản phẩm";
  getElement(".modal-footer").innerHTML = `
  <button class="btn btn-primary" onclick="createProduct()">Thêm</button>
    <button class="btn btn-danger" data-dismiss="modal">Huỷ</button>
    
  `;
});


// Tiềm kiếm sản phẩm
getElement("#txtSearch").addEventListener("keydown", (event) => {
  // event là một object chứa thông tin về sự kiện được phát sinh
  // event.target: trả ra cái element phát sinh ra sự kiện
  if (event.key !== "Enter") return;

  const searchValue = event.target.value;
  getProducts(searchValue);
});

// ============ Helpers ==============
function getElement(selector) {
  return document.querySelector(selector);
}
