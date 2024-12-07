import express from 'express';
import { Cart } from '../models/cart.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const cartList = await Cart.find(req.query);
    if (!cartList) {
      res.status(500).json({ success: false });
    }
    return res.status(200).json(cartList);
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

router.get('/cound', async (req, res) => {
  const cartItemsCount = await Cart.countDocuments();
  if (!cartItemsCount) {
    res.status(500).json({ success: false });
  }

  return res.status(200).json(cartItemsCount);
});


// Route tạo mới category với ảnh, giữ lại file trong thư mục 'uploads'
router.post('/add', async (req, res) => {
  const cartItem = await Cart.find({ productId: req.body.productId });
  if (cartItem.length === 0 ) {
    try {
      let cartList = new Cart({
        productTitle: req.body.productTitle,
        image: req.body.image,
        rating: req.body.rating,
        price: req.body.price,
        quantity: req.body.quantity,
        subTotal: req.body.subTotal,
        productId: req.body.productId,
        userId: req.body.userId,
      });

      cartList = await cartList.save();

      return res.status(201).json({
        message: 'Category created successfully',
        cartList,
        success: true,
      });
    } catch (err) {
      return res.status(500).json({
        error: err.message || 'Internal server error',
        success: false,
      });
    }
  } else {
    res.status(401).json({status: false, msg: 'Product already added in the cart ' });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);
    if (!cartItem) {
      return res.status(404).json({
        message: 'Không tìm thấy danh mục',
        success: false,
      });
    }
    const deleteItem = await Cart.findByIdAndDelete(req.params.id);
    if (!deleteItem) {
      return res.status(404).json({
        message: 'Không tìm thấy danh mục',
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Đã xóa danh mục và ảnh thành công',
    });
  } catch (err) {
    console.error('Lỗi trong quá trình xóa:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi xóa danh mục và ảnh',
      error: err.message,
    });
  }
});
router.put('/:id', async (req, res) => {
  try {
    // Kiểm tra xem ID có hợp lệ không
    const { id } = req.params;
    const updateData = {
      productTitle: req.body.productTitle,
      image: req.body.image,
      rating: req.body.rating,
      price: req.body.price,
      quantity: req.body.quantity,
      subTotal: req.body.subTotal,
      productId: req.body.productId,
      userId: req.body.userId,
    };

    // Cập nhật item trong Cart
    const updatedCart = await Cart.findByIdAndUpdate(id, updateData, { new: true });

    // Nếu không tìm thấy item
    if (!updatedCart) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found',
      });
    }

    // Trả về kết quả thành công
    return res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      data: updatedCart,
    });
  } catch (err) {
    console.error('Error updating cart item:', err.message);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating the cart item',
      error: err.message,
    });
  }
});

export default router;
