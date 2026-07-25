const UserModel = require("../model/UserModel");

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id, name, email, createdAt, wishlist, isPremium } =
      await UserModel.findById(userId);
    res.status(200).json({
      user: {
        _id: _id,
        name: name,
        email: email,
        createdAt: createdAt,
        wishlist: wishlist,
        isPremium: isPremium,
      },
      status: "success",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      status: "failure",
    });
  }
};
const getUserWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    {
      /*console.log(userId);
        console.log(user);
        console.log(user.wishlist);*/
    }
    res.status(200).json({
      data: user.wishlist,
      status: "success",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      status: "failure",
    });
  }
};

// const addToWishlist = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { id, poster_path, name, media_type } = req.body;

//     const user = await UserModel.findById(userId);
//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     // Duplicate check
//     if (user.wishlist.find((item) => item.id === id)) {
//       return res.status(400).json({
//         message: "Item already in wishlist",
//         status: "failure",
//       });
//     } else {
//       const wishlistItem = { poster_path, name, id, media_type };

//       // user.wishlist.push(wishlistItem);
//       // await user.save({ validateBeforeSave: false });

//       await UserModel.findOneAndUpdate(
//         { _id: userId },
//         { $push: { wishlist: wishlistItem } },
//         {
//           new: true, // Return updated document
//           upsert: true, // Create document if it doesn't exist
//         },
//       );

//       res.status(200).json({
//         message: "Item added to wishlist",
//         status: "success",
//         data: user.wishlist,
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//       status: "failure",
//     });
//   }
// };

const addToWishlist = async (req, res) => {
  try {
    // Get authenticated user's id from middleware
    const userId = req.userId;

    const { id, poster_path, name, media_type } = req.body;

    // Find user in database
    const user = await UserModel.findById(userId);

    // Return 404 if user does not exist
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check if the item already exists in the watchlist
    if (user.wishlist.find((item) => item.id === id)) {
      return res.status(400).json({
        message: "Item already in watchlist",
        status: "failure",
      });
    }

    // Create watchlist item object
    const watchlistItem = {
      poster_path,
      name,
      id,
      media_type,
    };

    // Add item to watchlist in database
    await UserModel.findOneAndUpdate(
      { _id: userId },
      { $push: { wishlist: watchlistItem } },
      {
        new: true, // Return updated document
        upsert: true, // Create document if it doesn't exist
      },
    );

    // Send success response
    return res.status(200).json({
      status: "success",
      message: "Added to Watchlist",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      status: "failure",
    });
  }
};

module.exports = { getCurrentUser, getUserWishlist, addToWishlist };
