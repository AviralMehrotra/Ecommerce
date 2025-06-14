import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.jpg";
import bannerTwo from "../../assets/banner-2.jpg";
import bannerThree from "../../assets/banner-3.jpg";
import apple from "../../assets/icons/apple.png";
import bose from "../../assets/icons/bose.png";
import dell from "../../assets/icons/dell.png";
import hp from "../../assets/icons/hp.png";
import jbl from "../../assets/icons/jbl.png";
import lenovo from "../../assets/icons/lenovo.png";
import oneplus from "../../assets/icons/oneplus.png";
import samsung from "../../assets/icons/samsung.png";
import sony from "../../assets/icons/sony.png";
import xiaomi from "../../assets/icons/xiaomi.png";
import {
  Smartphone,
  Laptop,
  Headphones,
  Tablet,
  Gamepad2,
  Speaker,
  Watch,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import ProductDetailsDialog from "@/components/shopping/product-details";

const categoriesWithIcon = [
  { id: "smartphones", label: "Smartphones", icon: Smartphone },
  { id: "laptops", label: "Laptops", icon: Laptop },
  { id: "headphones", label: "Headphones", icon: Headphones },
  { id: "earphones", label: "Earphones", icon: Headphones },
  { id: "smartwatches", label: "Smartwatches", icon: Watch },
  { id: "tablets", label: "Tablets", icon: Tablet },
  { id: "gaming", label: "Gaming", icon: Gamepad2 },
  { id: "audio", label: "Audio", icon: Speaker },
];

const brandsWithIcon = [
  { id: "apple", label: "Apple", icon: apple, isImage: true },
  { id: "samsung", label: "Samsung", icon: samsung, isImage: true },
  { id: "sony", label: "Sony", icon: sony, isImage: true },
  { id: "bose", label: "Bose", icon: bose, isImage: true },
  { id: "dell", label: "Dell", icon: dell, isImage: true },
  { id: "hp", label: "HP", icon: hp, isImage: true },
  { id: "lenovo", label: "Lenovo", icon: lenovo, isImage: true },
  { id: "xiaomi", label: "Xiaomi", icon: xiaomi, isImage: true },
  { id: "oneplus", label: "OnePlus", icon: oneplus, isImage: true },
  { id: "jbl", label: "JBL", icon: jbl, isImage: true },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );

  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const slides = [bannerOne, bannerTwo, bannerThree];

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate("/shop/listing");
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [slides]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "title-atoz",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <img
            src={slide}
            key={index}
            className={`${
              index === currentSlide ? "opacity-100" : "opacity-0"
            } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
          />
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide - 1 + slides.length) % slides.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by Category
          </h2>
          {/*here below grid-cols-5 defines how many icons can be there if you want to add more icons to home you can increase it*/}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
                key={categoryItem.id}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  {categoryItem.isImage ? (
                    <img src={categoryItem.icon} alt={categoryItem.label} className="w-12 h-12 mb-4" />
                  ) : (
                    <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  )}
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          {/*here below grid-cols-5 defines how many icons can be there if you want to add more icons to home you can increase it*/}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                key={brandItem.id}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  {brandItem.isImage ? (
                    <div className="w-16 h-16 mb-4 flex items-center justify-center">
                      <img 
                        src={brandItem.icon} 
                        alt={brandItem.label} 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : (
                    <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  )}
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddToCart={handleAddToCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}
export default ShoppingHome;
