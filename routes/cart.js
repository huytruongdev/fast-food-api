const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product"); 

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId }).lean();
    
    if (!cart) {
      return res.status(200).json([]);
    }

    const productIds = cart.items.map(item => item.productId);

    const products = await Product.find({ productId: { $in: productIds } })
      .select("productId name imageCard price")
      .lean();
    const completeCart = cart.items.map(item => {
      const productInfo = products.find(p => p.productId === item.productId);
      return {
        ...item,
        productData: productInfo || null 
      };
    });

    res.json(completeCart);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/add", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    console.log(cart);

    if (cart) {
      // -- Trường hợp 1: Giỏ hàng đã tồn tại --
      
      // Tìm xem sản phẩm này đã có trong mảng items chưa
      const itemIndex = cart.items.findIndex((p) => p.productId == productId);

      if (itemIndex > -1) {
        // A. Sản phẩm đã có -> Cộng dồn số lượng
        let productItem = cart.items[itemIndex];
        productItem.quantity += quantity;
        
        // Nếu cộng xong mà <= 0 thì xóa
        if(productItem.quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex] = productItem;
        }
      } else {
        // B. Sản phẩm chưa có -> Push vào mảng items
        // Chỉ lưu productId và quantity, không lưu thừa productData
        cart.items.push({ productId, quantity });
      }
      
      cart = await cart.save();
      return res.json({ message: "Cart updated", cartId: cart._id });

    } else {
      // -- Trường hợp 2: User chưa có giỏ hàng -> Tạo mới --
      console.log('here')
      const newCart = await Cart.create({
        userId,
        items: [{ productId, quantity }],
      });

      return res.json({ message: "Cart created", cartId: newCart._id });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 3. CẬP NHẬT SỐ LƯỢNG (UPDATE QUANTITY)
// Logic: Tìm item trong mảng và set lại quantity
router.put("/update", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Tìm vị trí món hàng
    const itemIndex = cart.items.findIndex((p) => p.productId == productId);

    if (itemIndex > -1) {
      if (quantity > 0) {
          cart.items[itemIndex].quantity = quantity;
      } else {
          // Nếu gửi quantity = 0 thì xóa luôn món đó
          cart.items.splice(itemIndex, 1);
      }
      await cart.save();
      res.json({ message: "Quantity updated" });
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. XÓA MỘT MÓN (REMOVE ITEM)
// Logic: Dùng toán tử $pull của MongoDB để kéo item ra khỏi mảng
router.delete("/remove", async (req, res) => {
  const { userId, productId } = req.body; // Client gửi userId và productId cần xóa

  try {
    await Cart.findOneAndUpdate(
      { userId: userId },
      { $pull: { items: { productId: productId } } } // Query xóa item có productId khớp
    );
    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. XÓA SẠCH GIỎ HÀNG (CLEAR CART)
// Logic: Set mảng items về rỗng []
router.delete("/clear/:userId", async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
        { userId: req.params.userId },
        { $set: { items: [] } }
    );
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;