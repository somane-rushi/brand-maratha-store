
export const extractCatalogueHelper = (catalogue) => {
    return catalogue.categories.map((category) => {
        const hasSubcategories = category.subcategories?.length > 0;

        if (hasSubcategories) {
            return {
                id: category.id,
                name: category.name,
                subcategories: category.subcategories.map((subcat) => ({
                    id: subcat.id,
                    name: subcat.name,
                    items: subcat.items || [],
                })),
            };
        } else {
            return {
                id: category.id,
                name: category.name,
                subcategories: [],
                items: category.items || [],
            };
        }
    });
};
