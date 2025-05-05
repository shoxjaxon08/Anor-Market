const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const Order = require("./models/order");
const app = express();
const port = 8000;
const bcrypt = require("bcrypt");
const cors = require("cors");
app.use(cors());
require("dotenv").config();
const secretKey = process.env.JWT_SECRET

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://shohjahon:shohjahon@cluster0.nxxyond.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to MongoDB");
    console.log("MongoDB connection state:", mongoose.connection.readyState);
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB ", err);
  });

app.listen(port, () => {
  console.log("Server is running on port 8000");
});

const sendVerificationTokenEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Oldingi suhbatlarda yaratilgan yangi App Password (masalan, iflvhulpczxrijwf)
    },
  });
  const verificationUrl = `http://192.168.248.10:8000/verify/${verificationToken}`;
  const mailOptions = {
    from: "Your App Name <shohjahonegamberganov1@gmail.com>",
    to: email,
    subject: "Email Verification",
    text: `Iltimos, elektron pochtangizni tasdiqlash uchun quyidagi havolani bosing: ${verificationUrl}`,
    html: `<p>Iltimos, elektron pochtangizni tasdiqlash uchun <a href="${verificationUrl}">ushbu havolani</a> bosing.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully to:", email);
  } catch (error) {
    console.error("Email yuborish xatosi:", error.message, error.stack);
    throw new Error("Email yuborishda xato yuz berdi");
  }
};

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const trimmedEmail = email.trim().toLowerCase();
    console.log("Ro‘yxatdan o‘tish so‘rovi:", { name, email, password });

    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      console.log("Email allaqachon mavjud:", trimmedEmail);
      return res.status(400).json({ message: "Email allaqachon yaratilgan" });
    }

    // Parolni hash qilish
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Unikal token yaratish
    const verificationToken = crypto.randomBytes(20).toString("hex");
    console.log("Yaratilgan verification token:", verificationToken);

    // Yangi foydalanuvchi yaratish
    const newUser = new User({
      name,
      email: trimmedEmail,
      password: hashedPassword,
      verificationToken,
      verified: false, // Dastlabki holat false
    });

    await newUser.save();
    console.log("Yangi foydalanuvchi saqlandi:", trimmedEmail);

    // Saqlangan foydalanuvchini tekshirish
    const savedUser = await User.findOne({ email: trimmedEmail });
    console.log("MongoDBdan topilgan foydalanuvchi:", savedUser);

    // Tasdiqlash emailini yuborish
    await sendVerificationTokenEmail(trimmedEmail, verificationToken);

    res.status(200).json({ message: "Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi" });
  } catch (error) {
    console.error("Ro‘yxatdan o‘tish xatosi:", error.message, error.stack);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
});

app.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;
    console.log("Tasdiqlash so'rovi boshlandi, token:", token);

    if (!token) {
      console.log("Xato: Token taqdim etilmagan");
      return res.status(400).json({ message: "Token taqdim etilmagan" });
    }

    // Foydalanuvchini token orqali qidirish
    const user = await User.findOne({ verificationToken: token });
    console.log("Token bilan foydalanuvchi topildi:", user);

    if (!user) {
      console.log("Xato: Token yaroqsiz yoki topilmadi, kiritilgan token:", token);
      return res.status(404).json({ message: "Token yaroqsiz yoki topilmadi" });
    }

    // Foydalanuvchi tasdiqlanganligini tekshirish
    if (user.verified) {
      console.log("Foydalanuvchi allaqachon tasdiqlangan:", user.email);
      return res.status(400).json({ message: "Bu foydalanuvchi allaqachon tasdiqlangan" });
    }

    // Tasdiqlash jarayoni
    user.verified = true;
    user.verificationToken = null; // Tokenni o‘chirish
    await user.save();
    console.log("Foydalanuvchi tasdiqlandi:", user.email, "Verified:", user.verified)

    return res.status(200).json({ message: "Elektron pochta muvaffaqiyatli tasdiqlandi" });
  } catch (error) {
    console.error("Tasdiqlash xatosi:", error.message, error.stack);
    return res.status(500).json({ message: "Elektron pochtani tasdiqlash amalga oshmadi" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const trimmedEmail = email.trim().toLowerCase();

    const user = await User.findOne({email: trimmedEmail  });   

    if (!user) {
      console.log("Foydalanuvchi topilmadi:", email);
      return res.status(401).json({ message: "Email yoki parol noto‘g‘ri" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email yoki parol noto‘g‘ri" });
    }
    user.verified=true
    await user.save()
    if (!user.verified) {
      console.log("Xato: Email tasdiqlanmagan, email:", user.email);
      return res.status(400).json({ message: "Elektron pochta tasdiqlanmagan" });
    }
     console.log("Email tasdiqlanganmi:", user?.verified);
    console.log("JWT Secret:", secretKey);
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "14d",
    });
 
    return res.status(200).json({ token });
  } catch (error) {
    console.error("Login xatosi:", error.message, error.stack);
    return res.status(500).json({ message: "Kirish muvaffaqiyatsiz bo'ldi" });
  }
});

app.post("/resend-verification", async (req, res) => {
  try {
      const { email } = req.body;
      const trimmedEmail = email.trim().toLowerCase();
      const user = await User.findOne({ email: trimmedEmail });

      if (!user) {
          return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
      }

      if (user.verified) {
          return res.status(400).json({ message: "Email allaqachon tasdiqlangan" });
      }

      const verificationToken = crypto.randomBytes(20).toString("hex");
      user.verificationToken = verificationToken;
      await user.save();

      await sendVerificationTokenEmail(trimmedEmail, verificationToken);

      return res.status(200).json({ message: "Tasdiqlash emaili qayta yuborildi" });
  } catch (error) {
      console.error("Email qayta yuborish xatosi:", error.message, error.stack);
      return res.status(500).json({ message: "Email qayta yuborishda xato yuz berdi" });
  }
});



//adress api
app.post('/addresses', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Token taqdim etilmadi');
      return res.status(401).json({ message: 'Token taqdim etilmagan' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET );
    const userId = decoded.userId;
    const { address } = req.body;
    console.log('Manzil qo‘shish so‘rovi:', { userId, address });

    const user = await User.findById(userId);
    if (!user) {
      console.log('Foydalanuvchi topilmadi:', userId);
      return res.status(404).json({ message: 'Foydalanuvchi yo‘q' });
    }
    if (!req.body.address || typeof req.body.address !== 'object') {
      return res.status(400).json({ error: "Yaroqsiz manzil ma'lumotlari" });
    }
    user.addresses.push(address);
    await user.save();
    console.log('Manzil qo‘shildi:', userId, 'Yangi addresses:', user.addresses);
    return res.status(200).json({ message: 'Address muvaffaqiyatli qo‘shildi' });
  } catch (error) {
    console.error('Manzil qo‘shish xatosi:', error.message, error.stack);
    return res.status(500).json({ message: 'Address saqlashda xatolik yuz berdi' });
  }
});
//adress get api
app.get('/addresses/:userId', async (req,res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId)
    if(!user){
       return res.status(404).json({message:"Foydalanuvchi yo'q"})
    }
    const addresses = user.addresses;
       return res.json({addresses})
  } catch (error) {
    res.status(500).json({message:'Address olishda xatolik'})

  }

} )

app.put("/addresses/:userId/:id", async (req, res) => {
  try {
    // 1. Token tekshirish
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token yo'q" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Parametrlardan userId va addressId olish
    const { userId, id } = req.params;

    // 3. Tanlangan foydalanuvchini topish
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }

    // 4. Address massivida tegishli manzilni topish
    const addressIndex = user.addresses.findIndex((item) => item._id.equals(id));
    if (addressIndex === -1) {
      return res.status(404).json({ message: "Manzil topilmadi" });
    }

    // 5. Yangilanish
    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex]._doc,
      ...req.body,
      _id: id, 
    };

    await user.save();

    return res.status(200).json({
      message: "Manzil muvaffaqiyatli yangilandi",
      address: user.addresses[addressIndex],
    });
  } catch (error) {
    console.error("Xatolik:", error.message);
    return res.status(500).json({ message: "Server xatosi", error: error.message });
  }
});

// DELETE /addresses/:userId/:addressId
app.delete("/addresses/:userId/:addressId", async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }

    // Manzilni topib, filter qilib olib tashlaymiz
    const oldLength = user.addresses.length;
    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== addressId
    );

    if (user.addresses.length === oldLength) {
      return res.status(404).json({ message: "Manzil topilmadi" });
    }

    await user.save();

    res.status(200).json({ message: "Manzil muvaffaqiyatli o‘chirildi" });
  } catch (error) {
    console.error("Xatolik:", error.message);
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
});

