import React from "react";
import "../assets/style/home.css";
import { FiShoppingCart } from "react-icons/fi";

class Home extends React.Component {
  render() {
    return (
      <div className="container-fluid page-style">
        <div className="row d-flex justify-content-center">
          {/* side bar section */}
          <div className="col-2 my-3 ">
            <div class="card mb-3">
              <div class="card-header">Filter Product</div>
              <div class="card-body d-grid gap-3">
                <div>
                  <label for="product-name">Nama Produk</label>
                  <input
                    class="form-control"
                    type="text"
                    id="product-name"
                    placeholder="masukkan nama produk"
                  />
                </div>
                <div>
                  <label for="product-cath">Kategori Produk</label>
                  <select class="form-control form-control" id="product-cath">
                    <option>Pilih Kategori</option>
                    <option>Syar'i</option>
                    <option>Polos</option>
                    <option>Motif</option>
                    <option>Aksesoris</option>
                  </select>
                </div>
                <button className="btn btn-primary">Cari Produk</button>
              </div>
            </div>
            <div class="card">
              <div class="card-header">Sort Product</div>
              <div class="card-body d-grid gap-3">
                <div>
                  <label for="product-sort">Urutkan Berdasarkan</label>
                  <select class="form-control form-control" id="product-sort">
                    <option>Default</option>
                    <option>Lowest Price</option>
                    <option>Highest Price</option>
                    <option>A-Z</option>
                    <option>Z-A</option>
                  </select>
                </div>
                <button className="btn btn-primary">Urutkan Produk</button>
              </div>
            </div>
            <div className="mt-3 col-12 d-flex justify-content-around align-items-center">
              <button className="btn btn-secondary"> Prev </button>
              <span>1 of 3</span>
              <button className="btn btn-secondary"> Next </button>
            </div>
          </div>
          {/* product section */}
          <div className="col-8">
            <div className="d-flex flex-wrap">
              <div className="card m-3" style={{ width: "18rem" }}>
                <div className="pic-box">
                  <img
                    className="card-img-top"
                    src="https://cdn.shopify.com/s/files/1/0258/4425/2757/products/Lemonade-Katalog21_400x.jpg?v=1641531665"
                    alt="Card image cap"
                  />
                  <button className="add-cart">
                    add to cart <FiShoppingCart />
                  </button>
                </div>
                <div className="card-body">
                  <h6 className="prod-name">Hijab Hijau Tua Polos</h6>
                  <p className="desc">produk baru bahan bagus</p>
                  <p className="card-text price">Rp. 20.000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
