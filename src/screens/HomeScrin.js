import {
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
  ScrollView,
  Pressable,
  TextInput as NativeTextInput,
  Text,
  Image,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useCallback, useContext } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Feather,Entypo } from "@expo/vector-icons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SwiperFlatList } from "react-native-swiper-flatlist"; // Yangi import
import axios from "axios";
import ProductItem from "../components/ProductItem";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { startSession } from "../../api/models/user";
import { BottomModal, SlideAnimation, ModalContent } from "react-native-modals";
const { width } = Dimensions.get("window");
import { UserType } from "../../UserContext";
import jwt_decode from "jwt-decode";
import { AntDesign } from '@expo/vector-icons';


const HomeScrin = () => {

  const list = [
    {
      id: "0",
      image: "https://m.media-amazon.com/images/I/41EcYoIZhIL._AC_SY400_.jpg",
      name: "Uy",
    },
    {
      id: "1",
      image:
        "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/blockbuster.jpg",
      name: "Chegirma",
    },
    {
      id: "3",
      image:
        "https://images-eu.ssl-images-amazon.com/images/I/31dXEvtxidL._AC_SX368_.jpg",
      name: "Elektronika",
    },
    {
      id: "4",
      image:
        "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/All_Icons_Template_1_icons_01.jpg",
      name: "Mobil telefonlar",
    },
    {
      id: "5",
      image:
        "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/music.jpg",
      name: "Musiqa",
    },
    {
      id: "6",
      image: "https://m.media-amazon.com/images/I/51dZ19miAbL._AC_SY350_.jpg",
      name: "Moda",
    },
  ];

  const images = [
    "https://img.etimg.com/thumb/msid-93051525,width-1070,height-580,imgsize-2243475,overlay-economictimes/photo.jpg",
    "https://images-eu.ssl-images-amazon.com/images/G/31/img23/Books/BB/JULY/1242x550_Header-BB-Jul23.jpg",
    "https://images-eu.ssl-images-amazon.com/images/G/31/img22/Wireless/devjyoti/PD23/Launches/Updated_ingress1242x550_3.gif",
  ];
  const deals = [
    {
      id: "20",
      title: "OnePlus Nord CE 3 Lite 5G (Pastel Lime, 8GB RAM, 128GB)",
      titleUz: "OnePlus Nord CE 3 Lite 5G (Yashil, 8GB RAM, 128GB)",
      oldPrice: 25000,
      price: 19000,

      image:
        "https://images-eu.ssl-images-amazon.com/images/G/31/wireless_products/ssserene/weblab_wf/xcm_banners_2022_in_bau_wireless_dec_580x800_once3l_v2_580x800_in-en.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/61QRgOgBx0L._SX679_.jpg",
        "https://m.media-amazon.com/images/I/61uaJPLIdML._SX679_.jpg",
        "https://m.media-amazon.com/images/I/510YZx4v3wL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/61J6s1tkwpL._SX679_.jpg",
      ],
      color: "Yashil",
      size: "6 GB operativ xotira, 128 GB saqlash joyi",
    },
    {
      id: "30",
      title: "Samsung Galaxy S20 FE 5G (Moviy, 8GB RAM, 128GB)",
      oldPrice: 74000,
      price: 26000,
      image:
        "https://images-eu.ssl-images-amazon.com/images/G/31/img23/Wireless/Samsung/SamsungBAU/S20FE/GW/June23/BAU-27thJune/xcm_banners_2022_in_bau_wireless_dec_s20fe-rv51_580x800_in-en.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/81vDZyJQ-4L._SY879_.jpg",
        "https://m.media-amazon.com/images/I/61vN1isnThL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71yzyH-ohgL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/61vN1isnThL._SX679_.jpg",
      ],
      color: "Moviy",
      size: "8 GB operativ xotira, 128 GB saqlash joyi",
    },
    {
      id: "40",
      title: "Samsung Galaxy M14 5G (Kumushrang, 4GB RAM, 128GB)",
      oldPrice: 16000,
      price: 14000,
      image:
        "https://images-eu.ssl-images-amazon.com/images/G/31/img23/Wireless/Samsung/CatPage/Tiles/June/xcm_banners_m14_5g_rv1_580x800_in-en.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/817WWpaFo1L._SX679_.jpg",
        "https://m.media-amazon.com/images/I/81KkF-GngHL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/61IrdBaOhbL._SX679_.jpg",
      ],
      color: "Kumushrang",
      size: "6 GB operativ xotira, 64 GB saqlash joyi",
    },
    {
      id: "50",
      title: "realme narzo N55 (Koʻk, 4GB RAM, 64GB)",
      oldPrice: 12999,
      price: 10999,
      image:
        "https://images-eu.ssl-images-amazon.com/images/G/31/tiyesum/N55/June/xcm_banners_2022_in_bau_wireless_dec_580x800_v1-n55-marchv2-mayv3-v4_580x800_in-en.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/41Iyj5moShL._SX300_SY300_QL70_FMwebp_.jpg",
        "https://m.media-amazon.com/images/I/61og60CnGlL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/61twx1OjYdL._SX679_.jpg",
      ],
      color: "Koʻk",
      size: "4 GB operativ xotira, 64 GB saqlash joyi",
    },
  ];

  const offers = [
    {
      id: "0",
      title:
        "Oppo Enco Air3 Pro True Wireless in Ear Earbuds with Industry First Composite Bamboo Fiber, 49dB ANC, 30H Playtime, 47ms Ultra Low Latency,Fast Charge,BT 5.3 (Green)",
      titleUz: "Oppo Enco Air3 Pro simsiz quloqchinlar ",
      offer: "72%",
      oldPrice: 7500,
      price: 4500,
      image:
        "https://m.media-amazon.com/images/I/61a2y1FCAJL._AC_UL640_FMwebp_QL65_.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/61a2y1FCAJL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71DOcYgHWFL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71LhLZGHrlL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/61Rgefy4ndL._SX679_.jpg",
      ],
      color: "Oq",
    },
    {
      id: "1",
      title: "Fastrack Limitless FS1 Pro aqlli soat",
      offer: "40%",
      oldPrice: 7955,
      price: 3495,
      image: "https://m.media-amazon.com/images/I/41mQKmbkVWL._AC_SY400_.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/71h2K2OQSIL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71BlkyWYupL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71c1tSIZxhL._SX679_.jpg",
      ],
      color: "Qora",
    },
    {
      id: "2",
      title: "Aishwariya simsiz quloqchinlar",
      offer: "40%",
      oldPrice: 7955,
      price: 3495,
      image: "https://m.media-amazon.com/images/I/41t7Wa+kxPL._AC_SY400_.jpg",
      carouselImages: ["https://m.media-amazon.com/images/I/41t7Wa+kxPL.jpg"],
      color: "Qora",
    },
    {
      id: "3",
      title: "Fastrack Limitless FS1 Pro  (Koʻk)",
      offer: "40%",
      oldPrice: 24999,
      price: 19999,
      image: "https://m.media-amazon.com/images/I/71k3gOik46L._AC_SY400_.jpg",
      carouselImages: [
        "https://m.media-amazon.com/images/I/41bLD50sZSL._SX300_SY300_QL70_FMwebp_.jpg",
        "https://m.media-amazon.com/images/I/616pTr2KJEL._SX679_.jpg",
        "https://m.media-amazon.com/images/I/71wSGO0CwQL._SX679_.jpg",
      ],
      color: "Koʻk",
      size: "8 GB operativ xotira, 128 GB saqlash joyi",
    },
  ];

  const product = [
    {
      id: 1,
      title:
        "Fjallraven - Foldsack No. 1 Ryukzak, 15 dyuymli noutbuklarga mos keladi",
      price: 109.95,
      description:
        "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
      category: "ERKAKLAR KIYIMI",
      image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
      rating: {
        rate: 3.9,
        count: 120,
      },
    },
    {
      id: 2,
      title: "Erkaklar uchun oddiy premium slim fit futbolkalar",
      price: 22.3,
      description:
        "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
      category: "ERKAKLAR KIYIMI",
      image:
        "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
      rating: {
        rate: 4.1,
        count: 259,
      },
    },
    {
      id: 3,
      title: "Erkaklar uchun paxta kurtka",
      price: 55.99,
      description:
        "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
      category: "ERKAKLAR KIYIMI",
      image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
      rating: {
        rate: 4.7,
        count: 500,
      },
    },
    {
      id: 4,
      title: "Erkaklar uchun oddiy slim fit kiyim",
      price: 15.99,
      description:
        "The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.",
      category: "ERKAKLAR KIYIMI",
      image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
      rating: {
        rate: 2.1,
        count: 430,
      },
    },
    {
      id: 5,
      title:
        "John Hardy ayollar uchun Legends Naga oltin va kumush ajdaho bilaguzuk",
      price: 695,
      description:
        "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.",
      category: "TAQINCHOQLAR",
      image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
      rating: {
        rate: 4.6,
        count: 400,
      },
    },
    {
      id: 6,
      title: "Qattiq oltin petite micropave",
      price: 168,
      description:
        "Satisfaction Guaranteed. Return or exchange any order within 30 days.Designed and sold by Hafeez Center in the United States. Satisfaction Guaranteed. Return or exchange any order within 30 days.",
      category: "TAQINCHOQLAR",
      image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
      rating: {
        rate: 3.9,
        count: 70,
      },
    },
    {
      id: 7,
      title: "Oltin bilan qoplangan oq malika uzuk",
      price: 9.99,
      description:
        "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her. Gifts to spoil your love more for Engagement, Wedding, Anniversary, Valentine's Day...",
      category: "TAQINCHOQLAR",
      image: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
      rating: {
        rate: 3,
        count: 400,
      },
    },
    {
      id: 8,
      title:
        "Pierced Owl pushti oltin bilan qoplangan zanglamaydigan po‘latdan ikki qavatli",
      price: 10.99,
      description:
        "Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel",
      category: "TAQINCHOQLAR",
      image: "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg",
      rating: {
        rate: 1.9,
        count: 100,
      },
    },
    {
      id: 9,
      title: "WD 2TB Elements tashqi qattiq disk - USB 3.0",
      price: 64,
      description:
        "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user’s hardware configuration and operating system",
      category: "ELEKTRONIKA",
      image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
      rating: {
        rate: 3.3,
        count: 203,
      },
    },
    {
      id: 10,
      title: "SanDisk SSD PLUS 1TB ichki SSD - SATA III 6 Gb/s",
      price: 109,
      description:
        "Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM SATA 2.5” hard drive; Based on published specifications and internal benchmarking tests using PCMark vantage scores) Boosts burst write performance, making it ideal for typical PC workloads The perfect balance of performance and reliability Read/write speeds of up to 535MB/s/450MB/s (Based on internal testing; Performance may vary depending upon drive capacity, host device, OS and application.)",
      category: "ELEKTRONIKA",
      image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
      rating: {
        rate: 2.9,
        count: 470,
      },
    },
    {
      id: 11,
      title:
        "Silicon Power 256GB SSD 3D NAND A55 SLC keshli ishlashni oshiruvchi SATA III 2.5",
      price: 109,
      description:
        "3D NAND flash are applied to deliver high transfer speeds Remarkable transfer speeds that enable faster bootup and improved overall system performance. The advanced SLC Cache Technology allows performance boost and longer lifespan 7mm slim design suitable for Ultrabooks and Ultra-slim notebooks. Supports TRIM command, Garbage Collection technology, RAID, and ECC (Error Checking & Correction) to provide the optimized performance and enhanced reliability.",
      category: "ELEKTRONIKA",
      image: "https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg",
      rating: {
        rate: 4.8,
        count: 319,
      },
    },
    {
      id: 12,
      title: "WD 4TB o‘yin diski PlayStation 4 uchun mos tashqi qattiq disk",
      price: 114,
      description:
        "Expand your PS4 gaming experience, Play anywhere Fast and easy, setup Sleek design with high capacity, 3-year manufacturer's limited warranty",
      category: "ELEKTRONIKA",
      image: "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg",
      rating: {
        rate: 4.8,
        count: 400,
      },
    },
    {
      id: 13,
      title:
        "Acer SB220Q bi 21.5 dyuym Full HD (1920 x 1080) IPS ultra yupqa monitor",
      price: 599,
      description:
        "21. 5 inches Full HD (1920 x 1080) widescreen IPS display And Radeon free Sync technology. No compatibility for VESA Mount Refresh Rate: 75Hz - Using HDMI port Zero-frame design | ultra-thin | 4ms response time | IPS panel Aspect ratio - 16: 9. Color Supported - 16. 7 million colors. Brightness - 250 nit Tilt angle -5 degree to 15 degree. Horizontal viewing angle-178 degree. Vertical viewing angle-178 degree 75 hertz",
      category: "ELEKTRONIKA",
      image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
      rating: {
        rate: 2.9,
        count: 250,
      },
    },
    {
      id: 14,
      title:
        "Samsung 49 dyuym CHG90 144Hz egri o‘yin monitori (LC49HG90DMNXZA) – Super ultrawide ekran QLED",
      price: 999.99,
      description:
        "49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side QUANTUM DOT (QLED) TECHNOLOGY, HDR support and factory calibration provides stunningly realistic and accurate color and contrast 144HZ HIGH REFRESH RATE and 1ms ultra fast response time work to eliminate motion blur, ghosting, and reduce input lag",
      category: "ELEKTRONIKA",
      image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg",
      rating: {
        rate: 2.2,
        count: 140,
      },
    },
    {
      id: 15,
      title: "BIYLACLESEN ayollar uchun 3-in-1 qor kurtkasi qishki palto",
      price: 56.99,
      description:
        "Note:The Jackets is US standard size, Please choose size as your usual wear Material: 100% Polyester; Detachable Liner Fabric: Warm Fleece. Detachable Functional Liner: Skin Friendly, Lightweigt and Warm.Stand Collar Liner jacket, keep you warm in cold weather. Zippered Pockets: 2 Zippered Hand Pockets, 2 Zippered Pockets on Chest (enough to keep cards or keys)and 1 Hidden Pocket Inside.Zippered Hand Pockets and Hidden Pocket keep your things secure. Humanized Design: Adjustable and Detachable Hood and Adjustable cuff to prevent the wind and water,for a comfortable fit. 3 in 1 Detachable Design provide more convenience, you can separate the coat and inner as needed, or wear it together. It is suitable for different season and help you adapt to different climates",
      category: "AYOLLAR KIYIMI",
      image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
      rating: {
        rate: 2.6,
        count: 235,
      },
    },
    {
      id: 16,
      title:
        "Lock and Love ayollar uchun olinadigan kapushonli sun’iy charm moto biker kurtka",
      price: 29.95,
      description:
        "100% POLYURETHANE(shell) 100% POLYESTER(lining) 75% POLYESTER 25% COTTON (SWEATER), Faux leather material for style and comfort / 2 pockets of front, 2-For-One Hooded denim style faux leather jacket, Button detail on waist / Detail stitching at sides, HAND WASH ONLY / DO NOT BLEACH / LINE DRY / DO NOT IRON",
      category: "AYOLLAR KIYIMI",
      image: "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg",
      rating: {
        rate: 2.9,
        count: 340,
      },
    },
    {
      id: 17,
      title:
        "Ayollar uchun yomg‘ir kurtkasi shamol o‘tkazmaydigan chiziqli alpinizm yomg‘ir kiyimi",
      price: 39.99,
      description:
        "Lightweight perfet for trip or casual wear---Long sleeve with hooded, adjustable drawstring waist design. Button and zipper front closure raincoat, fully stripes Lined and The Raincoat has 2 side pockets are a good size to hold all kinds of things, it covers the hips, and the hood is generous but doesn't overdo it.Attached Cotton Lined Hood with Adjustable Drawstrings give it a real styled look.",
      category: "AYOLLAR KIYIMI",
      image: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg",
      rating: {
        rate: 3.8,
        count: 679,
      },
    },
    {
      id: 18,
      title: "MBJ ayollar uchun qisqa yengli qayiqli bo‘yinli V ko‘ylak",
      price: 9.85,
      description:
        "95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch for comfort, Ribbed on sleeves and neckline / Double stitching on bottom hem",
      category: "AYOLLAR KIYIMI",
      image: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg",
      rating: {
        rate: 4.7,
        count: 130,
      },
    },
    {
      id: 19,
      title: "Opna ayollar uchun qisqa yengli namlik o‘tkazuvchi futbolka",
      price: 7.95,
      description:
        "100% Polyester, Machine wash, 100% cationic polyester interlock, Machine Wash & Pre Shrunk for a Great Fit, Lightweight, roomy and highly breathable with moisture wicking fabric which helps to keep moisture away, Soft Lightweight Fabric with comfortable V-neck collar and a slimmer fit, delivers a sleek, more feminine silhouette and Added Comfort",
      category: "AYOLLAR KIYIMI",
      image: "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg",
      rating: {
        rate: 4.5,
        count: 146,
      },
    },
    {
      id: 20,
      title: "DANVOUY ayollar uchun oddiy paxta qisqa futbolka",
      price: 12.99,
      description:
        "95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch., Occasion: Casual/Office/Beach/School/Home/Street. Season: Spring,Summer,Autumn,Winter.",
      category: "AYOLLAR KIYIMI",
      image: "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg",
      rating: {
        rate: 3.6,
        count: 145,
      },
    },
  ];
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const [selectedAddres,setSelectedAddres] = useState("")
  const [category, setCategory] = useState("TAQINCHOQLAR");
  const [items, setItems] = useState([
    { label: "Erkaklar kiyimi", value: "ERKAKLAR KIYIMI" },
    { label: "Taqinchoqlar", value: "TAQINCHOQLAR" },
    { label: "Elektronika", value: "ELEKTRONIKA" },
    { label: "Ayollar kiyimi", value: "AYOLLAR KIYIMI" },
  ]);

  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [companyOpen, setCompanyOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        const translatedProducts = response.data.map((product) => ({
          id: product.id,
          title: translateTitle(product.title),
          price: product.price,
          description: product.description,
          category: translateCategory(product.category),
          image: product.image,
          rating: {
            rate: product.rating.rate,
            count: product.rating.count,
          },
        }));
        setProducts(translatedProducts);
      } catch (error) {
        console.log("Error product API:", error.message);
        setError(
          "Ma'lumotlarni yuklashda xato yuz berdi. Iltimos, keyinroq qayta urinib ko'ring."
        );
        // Agar API ishlamasa, mahalliy product massividan foydalanamiz
        setProducts(product);
      }
    };
    fetchData();
  }, []);

  function translateTitle(title) {
    const translations = {
      "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops":
        "Fjallraven - Foldsack No. 1 Ryukzak, 15 dyuymli noutbuklarga mos keladi",
      "Mens Casual Premium Slim Fit T-Shirts ":
        "Erkaklar uchun oddiy premium slim fit futbolkalar",
      "Mens Cotton Jacket": "Erkaklar uchun paxta kurtka",
      "Mens Casual Slim Fit": "Erkaklar uchun oddiy slim fit kiyim",
      "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet":
        "John Hardy ayollar uchun Legends Naga oltin va kumush ajdaho bilaguzuk",
      "Solid Gold Petite Micropave ": "Qattiq oltin petite micropave",
      "White Gold Plated Princess": "Oltin bilan qoplangan oq malika uzuk",
      "Pierced Owl Rose Gold Plated Stainless Steel Double":
        "Pierced Owl pushti oltin bilan qoplangan zanglamaydigan po‘latdan ikki qavatli",
      "WD 2TB Elements Portable External Hard Drive - USB 3.0 ":
        "WD 2TB Elements tashqi qattiq disk - USB 3.0",
      "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s":
        "SanDisk SSD PLUS 1TB ichki SSD - SATA III 6 Gb/s",
      "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5":
        "Silicon Power 256GB SSD 3D NAND A55 SLC keshli ishlashni oshiruvchi SATA III 2.5",
      "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive":
        "WD 4TB o‘yin diski PlayStation 4 uchun mos tashqi qattiq disk",
      "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin":
        "Acer SB220Q bi 21.5 dyuym Full HD (1920 x 1080) IPS ultra yupqa monitor",
      "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) – Super Ultrawide Screen QLED ":
        "Samsung 49 dyuym CHG90 144Hz egri o‘yin monitori (LC49HG90DMNXZA) – Super ultrawide ekran QLED",
      "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats":
        "BIYLACLESEN ayollar uchun 3-in-1 qor kurtkasi qishki palto",
      "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket":
        "Lock and Love ayollar uchun olinadigan kapushonli sun’iy charm moto biker kurtka",
      "Rain Jacket Women Windbreaker Striped Climbing Raincoats":
        "Ayollar uchun yomg‘ir kurtkasi shamol o‘tkazmaydigan chiziqli alpinizm yomg‘ir kiyimi",
      "MBJ Women's Solid Short Sleeve Boat Neck V ":
        "MBJ ayollar uchun qisqa yengli qayiqli bo‘yinli V ko‘ylak",
      "Opna Women's Short Sleeve Moisture":
        "Opna ayollar uchun qisqa yengli namlik o‘tkazuvchi futbolka",
      "DANVOUY Womens T Shirt Casual Cotton Short":
        "DANVOUY ayollar uchun oddiy paxta qisqa futbolka",
    };
    return translations[title] || title;
  }

  function translateCategory(category) {
    const categoryTranslations = {
      "men's clothing": "ERKAKLAR KIYIMI",
      jewelery: "TAQINCHOQLAR",
      electronics: "ELEKTRONIKA",
      "women's clothing": "AYOLLAR KIYIMI",
    };
    return categoryTranslations[category] || category.toUpperCase();
  }

  // console.log('products', products);

  const [isFocused, setIsFocused] = useState(false);
  const onGenderOpen = useCallback(() => {
    setCompanyOpen(false);
  }, []);

  const cart = useSelector((state) => state.cart.cart || []);
  // console.log(cart);

  const [modalVisible, setModalVisible] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const { userId, setUserId } = useContext(UserType);

  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId, modalVisible]);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `http://192.168.70.10:8000/addresses/${userId}`
      );
      const addresses = Array.isArray(response.data?.addresses) 
      ? response.data.addresses
      : Array.isArray(response.data)
      ? response.data
      : [];  

      setAddresses(addresses);
    } catch (error) {
      console.log("error", error);
      
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };
    fetchUser();
  }, []);

  
  return (
    <>
      <SafeAreaView
        style={{
          paddingTop: Platform.OS === "android" ? 40 : 0,
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <View>
          <View
            style={{
              backgroundColor: "#9a42eb",
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 7,
                gap: 10,
                backgroundColor: "white",
                borderRadius: 5,
                height: 39,
                flex: 1,
                borderWidth: 1,
                borderColor: isFocused ? "#808080" : "transparent",
              }}
            >
              <Ionicons
                name="search"
                size={24}
                color="black"
                style={{ marginLeft: 5 }}
              />
              <NativeTextInput
                placeholder="Mahsulot qidirish"
                style={{
                  flex: 1,
                  height: "100%",
                  paddingHorizontal: 0,
                  fontSize: 16,
                  color: "black",
                }}
                placeholderTextColor="gray"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </Pressable>
            <Feather name="mic" size={24} color="white" />
          </View>
          </View>
          
          <ScrollView>
          <Text
            style={{
              height: 0.0000001,
              borderColor: "#000000",
              borderWidth: 0.5,
            }}
          ></Text>

          <Pressable
            onPress={() => setModalVisible(!modalVisible)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 7,
              backgroundColor: "#7d3db9",
              padding: 8,
            }}
          >
            

            <Ionicons name="location-outline" size={24} color="red" />
            <Pressable onPress={() => setModalVisible(!modalVisible)}>
              <Text style={{ fontSize: 16, fontWeight: "500",color:'#ffff' }}>
                Yetkazib berish manzili qayer?
              </Text>
            </Pressable>
            <View style={{ gap: 5 }} />
            <MaterialIcons name="keyboard-arrow-down" size={24} color="white" />
          </Pressable>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {list.map((item, index) => (
              <Pressable
                key={item.id || index}
                style={{
                  margin: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{ width: 52, height: 51, resizeMode: "contain" }}
                  source={{ uri: item.image }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    fontWeight: "500",
                    marginTop: 7,
                  }}
                >
                  {item?.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={{ width: width, height: 200 }}>
            <SwiperFlatList
              autoplay
              autoplayDelay={5}
              autoplayLoop
              data={images}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={{ width: width, height: 200, resizeMode: "cover" }}
                  onError={(e) =>
                    console.log("Rasm yuklanmadi:", e.nativeEvent.error)
                  }
                />
              )}
              paginationStyleItemActive={{ backgroundColor: "#13274f" }}
              paginationStyleItemInactive={{ backgroundColor: "#90A4AE" }}
            />
          </View>

          <Text style={{ padding: 12, fontSize: 18, fontWeight: "bold" }}>
            Haftaning eng mashhur chegirmalari
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {deals.map((item, index) => (
              <Pressable
                key={item.id || index}
                onPress={() =>
                  navigation.navigate("Info", {
                    id: item.id,
                    title: item.title,
                    price: item?.price,
                    carouselImages: item.carouselImages,
                    color: item?.color,
                    size: item?.size,
                    oldPrice: item?.oldPrice,
                    item: item,
                  })
                }
                style={{
                  marginVertical: 10,
                  flexDirection: "row",
                  alignItems: "center",
                      }}
                     >
                <Image
                  key={item.id || index}
                  style={{ width: 195, height: 224, resizeMode: "contain" }}
                  source={{ uri: item?.image }}
                />
              </Pressable>
            ))}
          </View>

          <Text
            style={{
              height: 2,
              borderColor: "#D0D0D0",
              borderWidth: 2,
              marginTop: 16,
            }}
          ></Text>

          <Text style={{ padding: 7, fontWeight: "bold", fontSize: 18 }}>
            Bugungi chegirmalar
          </Text>

          <ScrollView horizontal showsVerticalScrollIndicator={false}>
            {offers.map((item, index) => (
              <Pressable
                key={item.id || index}
                onPress={() =>
                  navigation.navigate("Info", {
                    id: item.id,
                    title: item.title,
                    price: item?.price,
                    carouselImages: item.carouselImages,
                    color: item?.color,
                    size: item?.size,
                    oldPrice: item?.oldPrice,
                    item: item,
                  })
                }
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                <Image
                  style={{ height: 150, width: 150, resizeMode: "contain" }}
                  source={{ uri: item?.image }}
                />

                <View
                  style={{
                    paddingVertical: 6,
                    backgroundColor: "#E31837",
                    width: 126,
                    borderRadius: 5,
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 12,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontSize: 13,
                      fontWeight: "bold",
                    }}
                  >
                    {item?.offer} Chegirma
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          <Text
            style={{
              height: 2,
              borderColor: "#D0D0D0",
              borderWidth: 2,
              marginTop: 16,
            }}
          ></Text>

          <View
            style={{
              marginHorizontal: 10,
              marginTop: 20,
              width: "46%",
              marginBottom: open ? 50 : 15,
            }}
          >
            <DropDownPicker
              style={{
                borderColor: "#B7B7B7",
                height: 30,
                marginBottom: open ? 120 : 15,
              }}
              open={open}
              value={category}
              items={items}
              setOpen={setOpen}
              setValue={setCategory}
              setItems={setItems}
              placeholder={"Mahsulot turini tanlang"}
              onOpen={onGenderOpen}
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {products
              ?.filter((item) => item.category === category)
              .map((item, index) => (
                <ProductItem item={item} key={item.id} />
              ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      <BottomModal
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={["up", "down"]}
        swipeThreShold={200}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        onHardwareBackPress={() => setModalVisible(!modalVisible)}
        visible={modalVisible}
        OnTouchOutside={() => !modalVisible}
      >
        <ModalContent style={{ height: "360", width: "100%",paddingHorizontal: 12 }}>
        
        <View style={{ flexDirection: 'row', alignItems: 'center' ,gap:2}}>  
<Pressable  

onPress={() =>  setModalVisible(false)}

><AntDesign name="left" size={21} color="black" /></Pressable>

            <Text style={{ fontWeight: "500", fontSize: 16 }}>
              Joylashuvingizni tanlang
            </Text>
            </View>
            <View style={{ marginBottom: 8 }}>


            <Text style={{ fontSize: 16, marginTop: 6, color: "gray" }}>
              Mahsulot mavjudligi va yetkazib berish imkoniyatlarini ko'rish
              uchun yetkazib berish joyini tanlang
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Pressable
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Address");
              }}
              style={{
                width: 140,
                height: 140,
                borderColor: "#D0D0D0",
                borderWidth: 1,
                marginTop: 10,
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 15
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#8500fa",
                  fontWeight: "500",
                }}
              >
                Manzil yoki yetib borish nuqtasini qo‘shing
              </Text>
            </Pressable>
            {addresses
                   ?.filter(item => item != null)   
                   .map((item, index) =>  (
              <Pressable key={item._id || `address-${index}`}
                style={{
                  height:140,
                  width:140,
                  borderColor:"#D0D0D0",    
                  borderWidth:1,
                  padding:10,
                  justifyContent:'center',
                  alignItems:'flex-start',
                  gap:4,
                  marginRight:15,
                  marginTop:10,
                  backgroundColor:selectedAddres === item ? "#befbb1" : "white"

                }}
              >
                 
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 3,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      marginTop:2
                    }}
                  >
                    {item?.region}
                    {/* <Entypo name="location-pin" size={24} color="red" /> */}

             
                    </Text>
                    
                    
                    <Entypo name="location-pin" size={24} color="red" />

                    
                    </View>
                    <Text
                    style={{
                      color:'#181818',
                      fontSize: 15,
                     alignItems:'flex-end'
                    }}
                  >
                    {item?.city}
                  </Text>

                <Text
                  style={{
                    fontSize: 15,
                    color:'#181818',
                  }}
                >
                  {item?.houseNo}
                </Text>
              
                <Text
                  style={{
                    fontSize: 15,
                    color:'#181818',
                  }}
                >
                Telefon Number : {item?.mobileNo}
                </Text>

              </Pressable>
            ))}
          </ScrollView>
          <View style={{ marginTop: 2 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginBottom: 5,
              }}
            >
              <Entypo name="location-pin" size={24} color="red" />
              <Text>Joylashuvingiz pochta indeks raqamini kiriting</Text>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <MaterialIcons
                name="location-searching"
                size={24}
                color="green"
              />
              <Text>Joriy joylashuvimdan foydalanish</Text>
            </View>
          </View>
        
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default HomeScrin;

const styles = StyleSheet.create({});
