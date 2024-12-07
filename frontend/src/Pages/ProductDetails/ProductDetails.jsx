import { Button } from '@mui/material';
import Rating from '@mui/material/Rating';
import Tooltip from '@mui/material/Tooltip';
import React, { useContext, useEffect, useState } from 'react';
import { FaBox } from 'react-icons/fa';
import { FaCartShopping } from 'react-icons/fa6';
import { IoIosHeartEmpty } from 'react-icons/io';
import { MdCompareArrows } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { MyContext } from '../../App';
import ProductZoom from '../../Components/ProductZoom/ProductZoom';
import QuantityBox from '../../Components/QuantityBox/QuantityBox';
import { fetchDataFromApi } from '../../utils/api';
import './ProductDetails.css';
import Relatedproducts from './Relatedproducts/Relatedproducts';
const ProductDetails = (props) => {
  const context = useContext(MyContext);
  const [activeSize, setActiveSize] = useState(null);
  const [activeRam, setActiveRam] = useState(null);
  const [activeWeight, setActiveWeight] = useState(null);
  const [activeTabs, setActiveTabs] = useState(0);
  const [productData, setProductData] = useState([]);
  const [relatedProductData, setRelatedProductData] = useState([]);
  const [productQuantity, setProductQuantity] = useState();
  let [cartFields, setCartFields] = useState({});

  const setRamActive = (index) => {
    setActiveRam(index);
  };

  const setWeightActive = (index) => {
    setActiveWeight(index);
  };

  const setSizeActive = (index) => {
    setActiveSize(index);
  };

  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDataFromApi(`/api/products/${id}`).then((res) => {
      setProductData(res);
      fetchDataFromApi(`/api/products?subName=${res?.subName}`).then((res) => {
        const filteredData = res?.data?.filter((item) => item.id !== id);
        setRelatedProductData(filteredData);
      });
    });
  }, []);

  const quantity = (val) => {
    setProductQuantity(val);
  };

  const addtoCart = () => {
    let missingFields = [];

    // Kiểm tra nếu sản phẩm yêu cầu `ram`
    if (productData?.ramName?.length > 0 && activeRam === null) {
      missingFields.push('ram');
    }

    // Kiểm tra nếu sản phẩm yêu cầu `size`
    if (productData?.sizeName?.length > 0 && activeSize === null) {
      missingFields.push('size');
    }

    // Kiểm tra nếu sản phẩm yêu cầu `weight`
    if (productData?.weightName?.length > 0 && activeWeight === null) {
      missingFields.push('cân nặng');
    }

    // Nếu có trường chưa chọn, thông báo lỗi
    if (missingFields.length > 0) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: `Vui lòng chọn ${missingFields.join(', ')}`,
      });
      return;
    }

    // Tất cả các trường cần thiết đã được chọn
    const user = JSON.parse(localStorage.getItem('user'));

    cartFields.productTitle = productData?.name;
    cartFields.image = productData?.images[0];
    cartFields.rating = productData?.rating;
    cartFields.price = productData?.price;
    cartFields.quantity = productQuantity;
    cartFields.subTotal = parseInt(productData?.price * productQuantity);
    cartFields.productId = productData?._id;
    cartFields.userId = user?.userId;

    // Lưu các trường đã chọn nếu có
    if (productData?.sizeName?.length > 0) {
      cartFields.selectedSize = productData?.sizeName?.[activeSize]?.sizeName;
    }
    if (productData?.ramName?.length > 0) {
      cartFields.selectedRam = productData?.ramName?.[activeRam]?.ramName;
    }
    if (productData?.weightName?.length > 0) {
      cartFields.selectedWeight =
        productData?.weightName?.[activeWeight]?.weightName;
    }

    context.addtoCart(cartFields);
  };

  return (
    <>
      <section className="productDetails section">
        <div className="container">
          <div className="row">
            <div className="col col-12 col-lg-5 pl-5">
              <ProductZoom
                images={productData?.images}
                discount={productData?.discount}
              />
            </div>
            <div className="col col-12 col-lg-7 pl-5 pr-5">
              <h2 className="hd text-capitalize">{productData?.name}</h2>
              <ul className="list list-inline d-flex align-items-center">
                <li className="list-inline-item">
                  <div className="d-flex align-items-center">
                    <span className="text-light mr-2">
                      Brands: <b>{productData?.brand}</b>
                    </span>
                  </div>
                </li>
                <li className="list-inline-item">
                  <div className="d-flex align-items-center">
                    <Rating
                      name="read-only"
                      value={productData?.rating}
                      readOnly
                      precision={0.5}
                      size="small"
                    />
                    <span className="text-light cursor ml-2">1 Review</span>
                  </div>
                </li>
              </ul>
              <div className="d-flex align-items-center price mb-3">
                <span className="block oldPrice">${productData?.oldPrice}</span>
                <span className="block netPrice text-danger ml-3">
                  ${productData?.price}
                </span>
              </div>
              <div className="badge badge-success">IN STOCK</div>
              <p className="mt-3">{productData?.description}</p>
              {(productData?.ramName?.length > 0 ||
                productData?.weightName?.length > 0 ||
                productData?.sizeName?.length > 0) && (
                <div className="productSize d-flex">
                  {productData?.ramName?.length > 0 && (
                    <div className="item">
                      <span>Ram / Rom</span>
                      <ul className="list list-inline mb-0 pl-4">
                        {productData?.ramName?.map((ram, inram) => (
                          <li className="list-inline-item" key={inram}>
                            <a
                              className={`tag ${
                                activeRam === inram ? 'active' : ''
                              }`}
                              onClick={() => setRamActive(inram)}
                            >
                              {ram.ramName}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {productData?.weightName?.length > 0 && (
                    <>
                      <span>Cân nặng / Chiều cao</span>
                      <ul className="list list-inline mb-0 pl-4">
                        {productData?.weightName?.map((weight, indweight) => (
                          <li className="list-inline-item" key={indweight}>
                            <a
                              className={`tag ${
                                activeWeight === indweight ? 'active' : ''
                              }`}
                              onClick={() => setWeightActive(indweight)}
                            >
                              {weight.weightName}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {productData?.sizeName?.length > 0 && (
                    <>
                      <span>Size</span>
                      <ul className="list list-inline mb-0 pl-4">
                        {productData?.sizeName?.map((item, index) => (
                          <li className="list-inline-item" key={index}>
                            <a
                              className={`tag ${
                                activeSize === index ? 'active' : ''
                              }`}
                              onClick={() => setSizeActive(index)}
                            >
                              {item.sizeName}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
              <div className="d-flex align-items-center mt-3">
                <QuantityBox quantity={quantity} />
                <Button
                  className="btn-blue btn-lg btn-big btn-round "
                  onClick={addtoCart}
                  sx={{ color: '#fff' }}
                >
                  <FaCartShopping className="icon1 mr-2" />
                  {context.addingInCart === true
                    ? 'Đang thêm ... '
                    : ' Thêm vào giỏ hàng'}
                </Button>
                <Tooltip title="Add to Wishlist" placement="top">
                  <Button className="btn-blue btn-lg btn-big btn-circle ml-4">
                    <IoIosHeartEmpty />
                  </Button>
                </Tooltip>
                <Tooltip title="Add to Compare" placement="top">
                  <Button className="btn-blue btn-lg btn-big btn-circle ml-4">
                    <MdCompareArrows />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="card mt-5 p-5 detailsPageTabs">
            <div className="customTabs">
              <ul className="list list-inline">
                <li className="list-inline-item">
                  <Button
                    className={`${activeTabs === 0 && 'active'}`}
                    onClick={() => {
                      setActiveTabs(0);
                    }}
                  >
                    Mô tả sản phẩm
                  </Button>
                </li>
                <li className="list-inline-item">
                  <Button
                    className={`${activeTabs === 1 && 'active'}`}
                    onClick={() => {
                      setActiveTabs(1);
                    }}
                  >
                    Thông tin chi tiết
                  </Button>
                </li>
                <li className="list-inline-item">
                  <Button
                    className={`${activeTabs === 2 && 'active'}`}
                    onClick={() => {
                      setActiveTabs(2);
                    }}
                  >
                    Đánh giá
                  </Button>
                </li>
                <li className="list-inline-item">
                  <Button
                    className={`${activeTabs === 3 && 'active'}`}
                    onClick={() => {
                      setActiveTabs(3);
                    }}
                  >
                    Description
                  </Button>
                </li>
              </ul>
              {activeTabs === 0 && (
                <div className="tabContent">
                  <p> {productData?.description}</p>
                </div>
              )}
              {activeTabs === 1 && (
                <div className="tabContent">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <tbody>
                        <tr className="stand-up">
                          <th>Stand Up</th>
                          <td>
                            <p>35"L x 24"w x 37-45"H(front to back wheel)</p>
                          </td>
                        </tr>
                        <tr className="folded-wo-wheels">
                          <th>Folded (w/o wheels)</th>
                          <td>
                            <p>35"L x 24"w x 37-45"H</p>
                          </td>
                        </tr>
                        <tr className="folded-w-wheels">
                          <th>Folded (w/ wheels)</th>
                          <td>
                            <p>35"L x 24"w x 37-45"H</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {activeTabs === 2 && (
                <div className="tabContent">
                  <div className="row">
                    <div className="col-md-8">
                      <h2>Đánh giá của khách hàng</h2>
                      <div className="card p-4 reviewsCard flex-row">
                        <div className="image">
                          <div className="rounded-circle">
                            <img
                              src={`https://laurenashpole.github.io/react-inner-image-zoom/images/unsplash-1-large.jpg`}
                              alt=""
                            />
                          </div>
                          <span className="text-g d-block text-center font-weight-bold mt-2">
                            Đình anh
                          </span>
                        </div>
                        <div className="info pl-5">
                          <div className="d-flex align-items-center w-100">
                            <h5 className="text-light">13/1/2003</h5>
                            <div className="ml-auto">
                              <Rating
                                name="read-only"
                                value={5}
                                readOnly
                                size="small"
                                precision={0.5}
                                className="rating"
                              />
                            </div>
                          </div>
                          <p>Sản phẩm chất lươngj</p>
                        </div>
                      </div>
                      <br className="res-hide" />
                      <br className="res-hide" />
                      <form className="reviewForm">
                        <h3>Thêm 1 đánh giá</h3>
                        <div className="form-group">
                          <textarea
                            className="form-control"
                            placeholder="Viết đánh giá"
                            name="review"
                          ></textarea>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập tên của bạn"
                                name="userName"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <Rating
                                name="read-only"
                                value={5}
                                readOnly
                                size="small"
                                precision={0.5}
                                className="rating"
                              />
                            </div>
                          </div>
                        </div>
                        <br />
                        <div className="form-group">
                          <Button className="btn-blue btn-lg btn-big btn-round">
                            Gửi đánh giá
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <br />
          {relatedProductData?.length !== 0 && (
            <Relatedproducts
              title="RELATED PRODUCTS"
              data={relatedProductData}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default ProductDetails;
