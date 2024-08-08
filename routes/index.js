var express = require("express");
var router = express.Router();
const userController = require("../controller/userController");
const postController = require("../controller/postController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/register", userController.registerUser); //Done
router.post("/login", userController.loginuser); // Done

router.post(
  "/post",
  userController.secure,
  upload.single("image"),
  postController.createPost
); // Done

router.get("/posts", userController.secure, postController.getAllPost); // Done

router.get("/posts/user", userController.secure, postController.getUserPost); //Done

router.delete("/posts/:id", userController.secure, postController.deletePost); //Done

router.put("/posts/:id", userController.secure, postController.updatePost); //Done

router.post("/post/like/:id", userController.secure, postController.likePost);

router.post(
  "/post/unlike/:id",
  userController.secure,
  postController.unlikePost
);

router.post(
  "/post/comment/:id",
  userController.secure,
  postController.addComment
);

router.get(
  "/post/postinteraction/:id",
  userController.secure,
  postController.getPostInteractions
);

module.exports = router;
