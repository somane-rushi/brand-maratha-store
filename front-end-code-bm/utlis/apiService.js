import axios from 'axios';

// const API_BASE_URL = 'http://localhost:3002/api';
// export const _url = 'http://localhost:3002/uploads';
// export const _url_without_upload_path = 'http://localhost:3002';

const API_BASE_URL = 'https://api.brandmaratha.store/api';
export const _url = 'https://api.brandmaratha.store/uploads';
export const _url_without_upload_path = 'https://api.brandmaratha.store';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // if (error.response && (error.response.status === 401 || error.response.status === 400)) {
    //   showSessionExpiredModal();
    // }
    return Promise.reject(error);
  }
);

const showSessionExpiredModal = () => {
  if (window.confirm("Your session has expired. Click OK to log out.")) {
    logoutUser();
  };
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("id");
  window.location.href = "/login";
};

export const fetchHeroBanners = async () => {
  try {
    const response = await api.get('/homepagebanner/');
    return response.data;
  } catch (error) {
    console.error('Error fetching homepagebanners:', error);
    throw error;
  }
};

export const fetchHeroBannerMarathi = async () => {
  try {
    const response = await api.get('/homepagebanner/marathi');
    return response.data;
  } catch (error) {
    console.error('Error fetching homepagebanners:', error);
    throw error;
  }
};

// export const fetchhomepageaboutus = async () => {
//   try {
//     const response = await api.get('/aboutusbanner/');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching homepageaboutus:', error);
//     throw error;
//   }
// };

export const fetchhomepageaboutus = async (lang) => {
  const _aboutuspagebanner_get = "/aboutusbanner";
  const _aboutuspagebannermarathi_get = "/aboutusbanner/marathi";

  try {
    const response = await api.get(
      lang === "en" ?
        _aboutuspagebanner_get :
        _aboutuspagebannermarathi_get);

    return response;
  } catch (err) {
    throw err;
  }
};

export const fetchBrands = async () => {
  try {
    const response = await api.get('/brands');
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};

export const fetchShopByBrands = async () => {
  try {
    const response = await api.get('/shop-by/brands');
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};

export const fetchCategoriesHomepage = async () => {
  try {
    const response = await api.get('/categorieshomepage/');
    return response.data;
  } catch (error) {
    console.error("Error fetching homepage categories:", error);
    throw error;
  }
};

export const fetchBestSellers = async () => {
  try {
    const response = await api.get('/products/bestsellers/');
    return response.data;
  } catch (error) {
    console.error("Error fetching bestsellers:", error);
    throw error;
  }
};

export const fetchNewArrivals = async () => {
  try {
    const response = await api.get('/products/new-arrivals/');
    return response.data;
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    throw error;
  }
};

export const fetchInstagram = async () => {
  try {
    const response = await api.get('/products/instagram/');
    return response.data;
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    throw error;
  }
};

// export const fetchProductsByBrand = async () => {
//   try {
//     const response = await api.get('/products/brand/4');
//     return response.data.data; // ✅ Extracting the data array
//   } catch (error) {
//     console.error("Error fetching Brands:", error);
//     throw error;
//   }
// };

export const fetchHomepageBannerSecond = async () => {
  const { data } = await api.get("/homepagebannersecond");
  return data;
};

export const fetchHomepageBannerSecondMarathi = async () => {
  const { data } = await api.get("/homepagebannersecond/marathi");
  return data;
};

export const subscribeNewsletter = async (email) => {
  try {
    const response = await api.post("/newsletter/subscribe", { email });
    return response.data;
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    throw error;
  }
};
export const fetchSubcategories = async () => {
  try {
    const response = await api.get("/subcategory/");
    return response.data;
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return [];
  }
};

// About us page banner
export const handleAboutUsPageBannerService = async (lang) => {
  const _aboutuspagebanner_get = "/aboutuspagebanner";
  const _aboutuspagebannermarathi_get = "/aboutuspagebanner/marathi";

  try {
    const response = await api.get(
      lang === "en" ?
        _aboutuspagebanner_get :
        _aboutuspagebannermarathi_get);

    return response;
  } catch (err) {
    throw err;
  }
};

// About us page who are we
export const handleAbouUsPageWhoAreWeService = async (lang) => {
  const _aboutuswhoarewe_get = "/aboutuswhoarewe";
  const _aboutuswhoarewemarathi_get = "/aboutuswhoarewe/marathi";

  try {
    const response = await api.get(
      lang === "en" ?
        _aboutuswhoarewe_get :
        _aboutuswhoarewemarathi_get);

    return response;
  } catch (err) {
    throw err;
  }
};

// About us page our journey
export const handleAboutUsPageOurJourneyService = async (lang) => {
  const _aboutusourjourney_get = "/aboutusourjourney";
  const _aboutusourjourneymarathi_get = "/aboutusourjourney/marathi";

  try {
    const response = await api.get(
      lang === "en" ?
        _aboutusourjourney_get :
        _aboutusourjourneymarathi_get);

    return response;
  } catch (err) {
    throw err;
  }
};

// About us page testimonials
export const handleAboutUsPageTestimonialsService = async (lang) => {
  const _aboutustestimonials_get = "/aboutustestimonials";
  const _aboutustestimonialsmarathi_get = "/aboutustestimonials/marathi";

  try {
    const response = await api.get(
      lang === "en" ?
        _aboutustestimonials_get :
        _aboutustestimonialsmarathi_get);

    return response;
  } catch (err) {
    throw err;
  }
};

// Privacy policy
export const handlePrivacyPolicyService = async (lang) => {
  const _privacypolicy_get = "/privacypolicies";
  const _privacypolicymarathi_get = "/privacypolicies/marathi";

  try {
    const response = await api.get(
      lang === "en" ?
        _privacypolicy_get :
        _privacypolicymarathi_get);

    return response;
  } catch (err) {
    throw err;
  }
};

// Terms of conditions
export const handleTermsOfConditionService = async (lang) => {
  const _termsofcondition_get = "/termsandconditions";
  const _termsofconditionmarathi_get = "/termsandconditions/marathi";

  try {
    const response = await api.get(
      lang === "en" ?
        _termsofcondition_get :
        _termsofconditionmarathi_get);

    return response;
  } catch (err) {
    throw err;
  }
};

// International policy
export const handleInternationalPolicyService = async (lang) => {
  const _termsofcondition_get = "/internationalpolicy";
  const _termsofconditionmarathi_get = "/internationalpolicy/marathi";

  try {
    const response = await api.get(
      lang === "en" ?
        _termsofcondition_get :
        _termsofconditionmarathi_get);

    return response;
  } catch (err) {
    throw err;
  }
};

// Disclaimer
export const handleDisclaimerService = async (lang) => {
  const _disclaimer_get = "/disclaimers";
  const _disclaimermarathi_get = "/disclaimers/marathi";

  try {
    const response = await api.get(
      lang === "en" ?
        _disclaimer_get :
        _disclaimermarathi_get);

    return response;
  } catch (err) {
    throw err;
  }
};

// Fetch product
export const handleProductListService = async () => {
  try {
    const response = await api.get("/products/all");
    return response.data;
  } catch (err) {
    throw new Error(err);
  }
};

// Fetch single product
export const handleProductService = async (id) => {
  try {
    const response = await api.get(`/products/products/${id}`);
    return response;
  } catch (err) {
    throw new Error(err);
  }
};

// Fetch magazine
export const handleMagazineService = async () => {
  try {
    const response = await api.get(`/magzine/magazines`);
    return response;
  } catch (err) {
    throw new Error(err);
  }
};

// Fetch video magazine
export const handleVideoMagazineService = async () => {
  try {
    const response = await api.get(`/magzinevideos`);
    return response;
  } catch (err) {
    throw new Error(err);
  }
};

export const handleInstagramVideoService = async () => {
  try {
    const response = await api.get(`/magazine/instagram`);
    return response;
  } catch (err) {
    throw new Error(err);
  }
};

// User registration
export const handleRegistereService = async (credentials) => {
  return await api.post(`/auth/register`, credentials);
};

// User login
export const handleLoginService = async (credentials) => {
  return await api.post(`/auth/login`, credentials);
};

// Magazine banner
export const handleMagazineBannerService = async () => {
  return await api.get(`/magzinebanner`);
};

// Wishlist
export const handleWishlistService = async (user_id, product_id) => {
  return await api.post(`/wishlist`, { user_id, product_id });
};

// Get wishlist by user id
export const handleWishlistByUserService = async (id) => {
  return await api.get(`/wishlist/${id}`);
};

// Remove product from wishlist
export const handleDeleteFromWishlistService = async (userId, productId) => {
  return await api.delete(`/wishlist/delete`, {
    params: { userId, productId }
  });
};

// Remove all items from wishlist
export const handleEmptyWishlistService = async (userId) => {
  return await api.delete(`/wishlist/remove-all`, {
    params: { userId }
  });
};

// Contact us
export const handleContactUsService = async (credentials) => {
  return await api.post(`/contactus`, credentials);
};

// Blog api
export const handleBlogsService = async () => {
  return await api.get(`/blogs`)
};

// Blog api
export const handleBlogsViewsService = async (id) => {
  if (!id) throw new Error("Blog ID is required");
  return await api.post(`/blogs/${id}/views`);
};

export const handleFetchPopularBlogsService = async () => {
  return await api.get(`/blogs/fetch/popular`)
};

// Magazine blog api
export const handleMagazineBlogsService = async () => {
  return await api.get(`/blogs/magazine/fetch`)
};

// Blog api
export const handleBlogsByIdService = async (id) => {
  return await api.get(`/blogs/${id}`)
};

export const fetchColorsByProductId = async (productId) => {
  try {
    const response = await api.get(`/variants/products/${productId}/colors`);
    const result = await response.data;
    return result;
  } catch (error) {
    console.error("Error fetching colors:", error);
    return { success: false, data: [] };
  }
};

export const fetchSizesByProductId = async (productId) => {
  try {
    const response = await api.get(`/variants/products/${productId}/sizes`);
    const result = await response.data;
    return result;
  } catch (error) {
    console.error("Error fetching sizes:", error);
    return { success: false, data: [] };
  }
};

export const fetchFinalPrice = async (productId, sizeId, colorId) => {
  console.log("Function call!", productId, sizeId, colorId)
  if (!sizeId || !colorId) return null;

  try {
    const response = await api.get(
      `/products/products/${productId}/price/${sizeId}/${colorId}`
    );
    console.log("response", response);

    return response.data.finalPrice;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};

export const fetchSizesWithColors = async (productId) => {
  try {
    const response = await api.get(`/products/products/${productId}/sizes`);
    return response.data.data; // Return sizes with nested colors
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};

export const fetchColorById = async (colorId) => {
  try {
    const { data } = await api.get(`/variants/products/${colorId}`);
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};

export const getCustomerReviews = async (productId) => {
  try {
    const response = await api.get(`/customerreviews/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customer reviews:", error);
    return [];
  }
};

export const fetchratings = async (productId) => {
  try {
    const response = await api.get(`/customerreviews/average/${productId}`);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};

export const fetchdelivery = async () => {
  try {
    const response = await api.get(`/deliveryandshipping/content`);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};

export const submitQuestion = async (formData) => {
  try {
    const response = await api.post(`/askaquestion/ask`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error submitting question:", error);
    return { error: "Something went wrong. Please try again." };
  }
};

export const fetchbrandsdetails = async (brandId) => {
  try {
    const response = await api.get(`/brand/${brandId}`);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};

export const fetchallproducts = async () => {
  try {
    const response = await api.get("/products/all");
    if (response.data.success) {
      return response.data.data; // Returning the product list
    } else {
      throw new Error("Failed to fetch products");
    }
  } catch (err) {
    console.error("Error fetching products:", err.message);
    return [];
  }
};

export const fetchFilteredProducts = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(val => queryParams.append(key, val));
      } else if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    const response = await api.get(`/products/filter?${queryParams.toString()}`);

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch products");
    }
  } catch (err) {
    console.error("Error fetching products:", err.message);
    return [];
  }
};

export const fetchAvailableFilters = async (filterQueries = {}) => {
  console.log("filterQueries", filterQueries);

  try {
    const queryParams = new URLSearchParams();

    for (const [key, value] of Object.entries(filterQueries)) {
      if (Array.isArray(value)) {
        value.forEach(val => {
          if (val !== undefined && val !== null && val !== '') {
            queryParams.append(key, val);
          }
        });
      } else if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    }

    const url = `/products/available-filters/?${queryParams.toString()}`;
    const response = await api.get(url);

    if (response.data?.success) {
      return response.data.data;
    } else {
      console.warn("Failed to fetch available filters:", response.data?.message || "Unknown error");
      return {};
    }
  } catch (err) {
    console.error("Error fetching available filters:", err.message);
    return {};
  }
};

export const fetchproductsbybrands = async (id) => {
  try {
    const response = await api.get(`/products/brand/${id}`);
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch products");
    }
  } catch (err) {
    console.error("Error fetching products:", err.message);
    return [];
  }
};

export const fetchcartproducts = async (id) => {
  try {
    const response = await api.get(`/cart/${id}`);
    if (response.data) {
      return response.data;
    } else {
      throw new Error("Failed to fetch products");
    }
  } catch (err) {
    console.error("Error fetching products:", err.message);
    return [];
  }
};

export const fetchproducts = async (id) => {
  try {
    const response = await api.get(`/products/products/${id}`);
    if (response.data) {
      return response.data;
    } else {
      throw new Error("Failed to fetch products");
    }
  } catch (err) {
    console.error("Error fetching products:", err.message);
    return [];
  }
};

export const fetchtotal = async (id) => {
  try {
    const response = await api.get(`/products/products/${id}`);
    if (response.data) {
      return response.data;
    } else {
      throw new Error("Failed to fetch products");
    }
  } catch (err) {
    console.error("Error fetching products:", err.message);
    return [];
  }
};

export const removeItemFromCart = async (userId, cartId) => {
  try {
    const response = await api.delete(`${API_BASE_URL}/cart/${cartId}`);
    return response.data; // Axios returns the data inside .data
  } catch (error) {
    console.error("❌ Error removing cart item:", error);
    return { success: false, message: "Error removing cart item" };
  }
};


export const updateCartQuantity = async (cartId, quantity) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${cartId}`, {
      method: "PUT", // Use PUT for updating data
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
    });

    return response.json();
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    return { success: false, message: "Error updating cart quantity" };
  }
};

export const addToCart = async ({ userId, productId, quantity, size, color, price }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        product_id: productId,
        quantity,
        size,
        color,
        price,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to add product to cart");
    }
    return data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const initiateOrder = async (orderData) => {
  const response = await fetch(`${API_BASE_URL}/orders/initiate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  return await response.json();
};

export const verifyPayment = async (paymentData, orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentData, orderData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Payment verification failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Payment verification failed:", error.message);
    throw error;
  }
};

export const fetchAddresses = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/addresses/addresses/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return [];
  }
};

export const addAddress = async (addressData) => {
  try {
    const response = await api.post(`addresses/addresses`, addressData);
    return response.data;
  } catch (error) {
    console.error("Error adding address:", error);
    throw error;
  }
};

export const deleteAddress = async (id) => {
  try {
    const response = await api.delete(`addresses/addresses/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error adding address:", error);
    throw error;
  }
};

export const updateAddress = async (id, data) => {
  try {
    await axios.put(`${API_BASE_URL}/addresses/addresses/${id}`, data);
    return true;
  } catch (error) {
    console.error("Error updating address:", error);
    return false;
  }
};

export const editAccountDetails = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_BASE_URL}/auth/edit-account`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating account details:", error);
    throw error;
  }
};

export const changePassword = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_BASE_URL}/auth/change-password`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

export const getUserOrders = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/user-orders/${userId}`);
    return response.data.orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderDetails = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error;
  }
};

export const requestOtp = async (mobile) => {
  try {
    const response = await api.post(`/auth/request-otp`, { mobile }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error requesting OTP:", error);
    return { error: "Something went wrong while requesting OTP." };
  }
};

// Reset Password
export const resetPassword = async (mobile, otp, newPassword) => {
  try {
    const response = await api.post(`/auth/reset-password`, { mobile, otp, newPassword }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    return { error: "Something went wrong while resetting password." };
  }
};


export const fetchShipmentTracking = async (AWBNumber) => {
  try {
    const res = await api.post(`/shipment/track-shipment`, { AWBNumber }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res.data;
  } catch (error) {
    console.error("Tracking API error:", error);
    return null;
  }
};

export const fetchBrandDetailsByID = async (id) => {
  try {
    const response = await api.get(`/brand-details/brand/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};

export const newslaterIsSubscribed = async (mail) => {
  try {
    const response = await api.post(`/newsletter/issubscribed`, { mail });
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};

export const fetchCataogues = async () => {
  try {
    const response = await api.get(`/catalogue`);
    return response;
  } catch (err) {
    throw err;
  }
};

export default API_BASE_URL;