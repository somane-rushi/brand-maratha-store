export const addToRecentlyViewed = (product) => {
    if (!product || !product.id) return;
  
    let recentProducts = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
  
    
    recentProducts = recentProducts.filter((p) => p.id !== product.id);
  
    
    recentProducts.unshift({
      id: product.id,
      name: product.name,
      thumbnail: product.thumbnail_image,
      base_price : product.base_price, 
    });
  
    
    if (recentProducts.length > 5) {
      recentProducts.pop();
    }
  
    
    localStorage.setItem("recentlyViewed", JSON.stringify(recentProducts));
  };
  