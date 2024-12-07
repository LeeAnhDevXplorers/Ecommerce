import express from 'express';
import { ProductReviews } from '../models/productReviews.js';

const router = express.Router();

// Lấy danh sách tất cả các review
router.get('/', async (req, res) => {
  let reviews = [];

  try {
    if (
      req.productId !== undefined &&
      req.productId !== null &&
      req.productId !== ''
    ) {
      reviews = await ProductReviews.find({ productId: req.query.productId });
    } else {
      reviews = await ProductReviews.find();
    }

    if (!reviews) {
      return res.status(500).json({ success: false, message: "Không tìm thấy đánh giá nào." });
    }
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Lỗi hệ thống. Vui lòng thử lại sau." });
  }
});

// Lấy review theo ID
router.get('/:id', async (req, res) => {
  try {
    const review = await ProductReviews.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Không tìm thấy đánh giá với ID đã cho.' });
    }
    return res.status(200).send(review);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi hệ thống. Vui lòng thử lại sau.' });
  }
});

// Thêm mới review
router.post("/add", async(req, res) => {
  try {
    let review = new ProductReviews({
      customerId: req.body.customerId,
      customerName: req.body.customerName,
      review: req.body.review,
      customerRating: req.body.customerRating,
      productId: req.body.productId
    });

    review = await review.save();
    return res.status(201).json(review);
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false, message: 'Thêm đánh giá thất bại.' });
  }
});

// Cập nhật review
router.put('/:id', async (req, res) => {
  try {
    const updatedReview = await ProductReviews.findByIdAndUpdate(
      req.params.id,
      {
        customerId: req.body.customerId,
        customerName: req.body.customerName,
        review: req.body.review,
        customerRating: req.body.customerRating,
        productId: req.body.productId
      },
      { new: true } // Trả về bản ghi mới sau khi cập nhật
    );

    if (!updatedReview) {
      return res.status(404).json({ message: 'Không tìm thấy đánh giá để cập nhật.' });
    }

    return res.status(200).json({ message: 'Cập nhật đánh giá thành công.', data: updatedReview });
  } catch (error) {
    return res.status(500).json({ message: 'Cập nhật thất bại. Vui lòng thử lại sau.', error: error.message });
  }
});

// Xóa review
router.delete('/:id', async (req, res) => {
  try {
    const deletedReview = await ProductReviews.findByIdAndRemove(req.params.id);

    if (!deletedReview) {
      return res.status(404).json({ message: 'Không tìm thấy đánh giá để xóa.' });
    }

    return res.status(200).json({ message: 'Xóa đánh giá thành công.' });
  } catch (error) {
    return res.status(500).json({ message: 'Xóa đánh giá thất bại. Vui lòng thử lại sau.', error: error.message });
  }
});

export default router;
