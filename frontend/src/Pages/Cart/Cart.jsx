import { Button } from '@mui/material';
import Rating from '@mui/material/Rating';
import React, { useContext, useEffect, useState } from 'react';
import { FaBox } from 'react-icons/fa';
import { FaCartShopping } from 'react-icons/fa6';
import { MdDeleteForever } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { MyContext } from '../../App';
import QuantityBox from '../../Components/QuantityBox/QuantityBox';
import { editData, fetchDataFromApi } from '../../utils/api';
import './Cart.css';
const Cart = () => {
  const context = useContext(MyContext);
  const [cartData, setCartData] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [productQuantity, setProductQuantity] = useState();
  let [cartFields, setCartFields] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const quantity = (val) => {
    setProductQuantity(val);
  };

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 3000);
  };

  useEffect(() => {
    fetchDataFromApi(`/api/cart`).then((res) => {
      setCartData(res);
    });
  }, []);

  const selectItem = (item, quantityVal) => {
    console.log('Select item called', item, quantityVal);
    setIsLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));

    cartFields.productTitle = item?.productTitle;
    cartFields.image = item?.image;
    cartFields.rating = item?.rating;
    cartFields.price = item?.price;
    cartFields.quantity = quantityVal;
    cartFields.subTotal = parseInt(item?.price * quantityVal);
    cartFields.productId = item?._id;
    cartFields.userId = user?.userId;

    editData(`/api/cart/${item?._id}`).then((res) => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    });
  };
  return (
    <>
      {isLoading === true && <div className="loading"></div>}

      <section className="section cartPage">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-9 pr-5">
              <h2 className="hd mb-2 mt-2">Giỏ hàng của bạn</h2>
              <p className="mb-4">
                Có <b className="text-red">3</b> sản phẩm trong giỏ hàng của bạn
              </p>

              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th width="45%">Sản phẩm</th>
                      <th width="10%">Giá</th>
                      <th width="20%">Số lượng</th>
                      <th width="15%">Tổng tiền</th>
                      <th width="10%">Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartData?.map((item, index) => {
                      return (
                        <tr>
                          <td width="45%">
                            <Link to="/product/1">
                              <div className="d-flex align-items-center cartItemImgWrapper">
                                <div className="imgWrapper">
                                  <img
                                    src={item?.image}
                                    alt={item?.productTitle}
                                    className="w-100"
                                  />
                                </div>
                                <div className="info px-3 ml-4">
                                  <h6>
                                    {item?.productTitle?.substr(0, 50) + '...'}
                                  </h6>
                                  <Rating
                                    name="read-only"
                                    value={item?.rating}
                                    readOnly
                                    size="large"
                                  />
                                </div>
                              </div>
                            </Link>
                          </td>
                          <td width="15%">${item?.price}</td>
                          <td width="20%">
                            <QuantityBox
                              quantity={quantity}
                              item={item}
                              selectItem={selectItem}
                            />
                          </td>
                          <td width="15%">${item?.subTotal}</td>
                          <td width="10%">
                            <span className="remove cursor">
                              <MdDeleteForever />
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border p-3 cartDetails">
                <h4>CART TOTALS</h4>
                <div className="d-flex align-items-center mb-3">
                  <span>Subtotal</span>
                  <span className="ml-auto text-red font-weight-bold">
                    $99.99
                  </span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <span>Shipping</span>
                  <span className="ml-auto">
                    <b>Free</b>
                  </span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <span>Estimate for</span>
                  <span className="ml-auto">
                    <b>Viet Nam</b>
                  </span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <span>Total</span>
                  <span className="ml-auto text-red font-weight-bold">
                    $99.99
                  </span>
                </div>
                <br />
                <div className="d-flex align-items-center justify-content-center mt-3">
                  <Button
                    className={`cart-btn ${clicked ? 'clicked' : ''}`}
                    onClick={handleClick}
                  >
                    <span className="btn-blue btn-lg btn-big btn-round add-to-cart">
                      {clicked ? 'Thêm thành công' : 'Thêm vào giỏ hàng'}
                    </span>
                    {clicked && <span className="added">Thêm thành công</span>}
                    <FaCartShopping className="icon1" />
                    <FaBox className="icon2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
