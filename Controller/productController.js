const Product = require("../models/Product");
const Favorite = require("../models/Favorite");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllProductsPaginate = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(limit);
    const total = await Product.countDocuments();

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({ categoryId: categoryId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


exports.getFavoritesByUserId = async (req, res) => {
    try {
        const { userId } = req.params; 

        const favorites = await Favorite.find({ userId: userId })
            .select('productId'); 

        const productIDs = favorites.map(fav => fav.productId);

        res.json(productIDs); 
        
    } catch (error) {
        console.error("Error fetching favorites:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.getProductsByIds = async (req, res) => {
  try {
    const { productIDs } = req.body;

    if (!productIDs || productIDs.length === 0) {
      return res.status(200).json([]);
    }

    const products = await Product.find({
      productId: { $in: productIDs },
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }

  
};
