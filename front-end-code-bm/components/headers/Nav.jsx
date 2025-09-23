"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { allHomepages } from "@/data/menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { t } from "@/components/translate";
import { fetchCataogues } from "@/utlis/apiService";

export default function Nav({ isArrow = true, textColor = "", Linkfs = "" }) {
    const pathname = usePathname();
    const { language } = useContext(LanguageContext);

    const [menCatalogues, setMenCatalogues] = useState(null);
    const [womenCatalogues, setWomenCatalogues] = useState(null);
    const [accessories, setAccessories] = useState([]);

    useEffect(() => {
        async function fetchCataloguesHandler() {
            try {
                const response = await fetchCataogues();
                const catalogues = response.data || [];

                const men = catalogues.find(
                    (c) => c.name.trim().toLowerCase() === "men"
                );
                const women = catalogues.find(
                    (c) => c.name.trim().toLowerCase() === "women"
                );

                let allAccessorySubcats = [];

                if (men) {
                    const clonedMen = structuredClone(men);
                    clonedMen.categories = mergeCasualAndWesternForView(
                        clonedMen.categories
                    );
                    setMenCatalogues(clonedMen);

                    const menAccessories = clonedMen.categories.find(
                        (cat) => cat.name.trim().toLowerCase() === "accessories"
                    );
                    if (menAccessories?.subcategories?.length) {
                        allAccessorySubcats.push(
                            ...menAccessories.subcategories
                        );
                    }
                }

                if (women) {
                    const clonedWomen = structuredClone(women);
                    clonedWomen.categories = mergeCasualAndWesternForView(
                        clonedWomen.categories
                    );
                    setWomenCatalogues(clonedWomen);

                    const womenAccessories = clonedWomen.categories.find(
                        (cat) => cat.name.trim().toLowerCase() === "accessories"
                    );
                    if (womenAccessories?.subcategories?.length) {
                        allAccessorySubcats.push(
                            ...womenAccessories.subcategories
                        );
                    }
                }

                if (men) {
                    const clonedMen = structuredClone(men);
                    clonedMen.categories = mergeCasualAndWesternForView(
                        clonedMen.categories
                    );
                    setMenCatalogues(clonedMen);

                    const menAccessories = clonedMen.categories.find(
                        (cat) => cat.name.trim().toLowerCase() === "accessories"
                    );
                    if (menAccessories?.subcategories?.length) {
                        allAccessorySubcats.push(
                            ...menAccessories.subcategories
                        );
                    }
                }

                if (women) {
                    const clonedWomen = structuredClone(women);
                    clonedWomen.categories = mergeCasualAndWesternForView(
                        clonedWomen.categories
                    );
                    setWomenCatalogues(clonedWomen);

                    const womenAccessories = clonedWomen.categories.find(
                        (cat) => cat.name.trim().toLowerCase() === "accessories"
                    );
                    if (womenAccessories?.subcategories?.length) {
                        allAccessorySubcats.push(
                            ...womenAccessories.subcategories
                        );
                    }
                }

                const mergedAccessoriesMap = new Map();
                for (const sub of allAccessorySubcats) {
                    if (!mergedAccessoriesMap.has(sub.name)) {
                        mergedAccessoriesMap.set(sub.name, { ...sub });
                    } else {
                        const existing = mergedAccessoriesMap.get(sub.name);
                        const combinedItems = [
                            ...(existing.items || []),
                            ...(sub.items || []),
                        ];
                        const uniqueItems = Array.from(
                            new Map(
                                combinedItems.map((i) => [i.id, i])
                            ).values()
                        );
                        mergedAccessoriesMap.set(sub.name, {
                            ...existing,
                            items: uniqueItems,
                        });
                    }
                }

                setAccessories(Array.from(mergedAccessoriesMap.values()));
            } catch (err) {
                console.error("Failed to fetch catalogues:", err.message);
            }
        }

        fetchCataloguesHandler();
    }, []);

    const mergeCasualAndWesternForView = (categories) => {
        const mergedMap = new Map();
        let casualCategory = null;
        let westernCategory = null;

        const otherCategories = categories.filter((cat) => {
            if (cat.name === "Casual") {
                casualCategory = cat;
                for (const sub of cat.subcategories || []) {
                    mergedMap.set(sub.name, { ...sub });
                }
                return false;
            }

            if (cat.name === "Western") {
                westernCategory = cat;
                for (const sub of cat.subcategories || []) {
                    if (mergedMap.has(sub.name)) {
                        const existing = mergedMap.get(sub.name);
                        const combinedItems = [
                            ...(existing.items || []),
                            ...(sub.items || []),
                        ];
                        const uniqueItems = Array.from(
                            new Map(
                                combinedItems.map((i) => [i.id, i])
                            ).values()
                        );
                        mergedMap.set(sub.name, {
                            ...existing,
                            items: uniqueItems,
                        });
                    } else {
                        mergedMap.set(sub.name, { ...sub });
                    }
                }
                return false;
            }

            return true;
        });

        if (mergedMap.size > 0) {
            return [
                ...otherCategories,
                {
                    name: "Casual/Western Wear",
                    subcategories: Array.from(mergedMap.values()),
                },
            ];
        }

        return otherCategories;
    };

    const isMenuActive = (menuItem) => {
        let active = false;

        const getFirstPathSegment = (url) => {
            if (typeof url !== "string") return "";
            const segments = url.split("/");
            for (let i = 1; i < segments.length; i++) {
                if (segments[i]) return segments[i];
            }
            return "";
        };

        const currentSegment = getFirstPathSegment(pathname);

        if (
            menuItem?.href &&
            getFirstPathSegment(menuItem.href) === currentSegment
        ) {
            active = true;
        }

        if (Array.isArray(menuItem) && menuItem.length) {
            menuItem.forEach((item) => {
                if (getFirstPathSegment(item?.href) === currentSegment) {
                    active = true;
                }

                if (Array.isArray(item?.links)) {
                    item.links.forEach((elm2) => {
                        if (
                            getFirstPathSegment(elm2?.href) === currentSegment
                        ) {
                            active = true;
                        }

                        if (Array.isArray(elm2?.links)) {
                            elm2.links.forEach((elm3) => {
                                if (
                                    getFirstPathSegment(elm3?.href) ===
                                    currentSegment
                                ) {
                                    active = true;
                                }
                            });
                        }
                    });
                }
            });
        }

        return active;
    };

    return (
        <>
            <li className="menu-item">
                <a
                    href="/"
                    className={`item-link ${Linkfs} ${textColor} ${
                        isMenuActive(allHomepages) ? "activeMenu" : ""
                    } `}
                >
                    {t("home", language)}
                </a>
            </li>
            <li className="menu-item">
                <Link
                    href={{
                        pathname: "/product-listing",
                        query: {
                            catalogue: "women",
                        },
                    }}
                    className={`item-link ${Linkfs} ${textColor} ${
                        isMenuActive("") ? "activeMenu" : ""
                    } `}
                >
                    {t("women", language)}
                    {isArrow ? <i className="icon icon-arrow-down" /> : ""}
                </Link>
                <div className="sub-menu mega-menu">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="row">
                                    {[womenCatalogues]?.map(
                                        (catalogue, catIndex) => (
                                            <React.Fragment key={catIndex}>
                                                {[
                                                    ...(catalogue?.categories ||
                                                        []),
                                                ]
                                                    .sort((a, b) => {
                                                        const categoryOrder = [
                                                            "Ethnic",
                                                            "Formal",
                                                            "Casual/Western Wear",
                                                            "Foot Ware",
                                                            "Saree",
                                                            "Accessories",
                                                        ];
                                                        const aIndex =
                                                            categoryOrder.indexOf(
                                                                a.name
                                                            );
                                                        const bIndex =
                                                            categoryOrder.indexOf(
                                                                b.name
                                                            );
                                                        return (
                                                            (aIndex === -1
                                                                ? 999
                                                                : aIndex) -
                                                            (bIndex === -1
                                                                ? 999
                                                                : bIndex)
                                                        );
                                                    })
                                                    .map((menu, index) => {
                                                        const isSaree =
                                                            menu.name.toLowerCase() ===
                                                            "saree";
                                                        const isMergedCasualWestern =
                                                            menu.name ===
                                                            "Casual/Western Wear";

                                                        return (
                                                            <div
                                                                className="col-md-4 mb-24"
                                                                key={index}
                                                            >
                                                                <div className="mega-menu-item">
                                                                    <div className="menu-heading">
                                                                        {
                                                                            menu.name
                                                                        }
                                                                    </div>
                                                                    {/* <ul className="menu-list">
                                                                        {isSaree
                                                                            ? (
                                                                                  menu.subcategories ||
                                                                                  []
                                                                              )
                                                                                  .flatMap(
                                                                                      (
                                                                                          subcat
                                                                                      ) =>
                                                                                          subcat.items ||
                                                                                          []
                                                                                  )
                                                                                  .filter(
                                                                                      (
                                                                                          item,
                                                                                          idx,
                                                                                          self
                                                                                      ) =>
                                                                                          self.findIndex(
                                                                                              (
                                                                                                  i
                                                                                              ) =>
                                                                                                  i.id ===
                                                                                                  item.id
                                                                                          ) ===
                                                                                          idx
                                                                                  )
                                                                                  .map(
                                                                                      (
                                                                                          item,
                                                                                          itemIndex
                                                                                      ) => (
                                                                                          <li
                                                                                              key={
                                                                                                  itemIndex
                                                                                              }
                                                                                          >
                                                                                              <Link
                                                                                                  href={{
                                                                                                      pathname:
                                                                                                          "/product-listing",
                                                                                                      query: {
                                                                                                          catalogue:
                                                                                                              catalogue.name.toLowerCase(),
                                                                                                          category:
                                                                                                              menu.name,
                                                                                                          subcategory:
                                                                                                              item.name,
                                                                                                      },
                                                                                                  }}
                                                                                                  className={`menu-link-text link ${
                                                                                                      isMenuActive(
                                                                                                          item
                                                                                                      )
                                                                                                          ? "activeMenu"
                                                                                                          : ""
                                                                                                  }`}
                                                                                              >
                                                                                                  {
                                                                                                      item.name
                                                                                                  }
                                                                                              </Link>
                                                                                          </li>
                                                                                      )
                                                                                  )
                                                                            : isMergedCasualWestern
                                                                            ? (
                                                                                  menu.subcategories ||
                                                                                  []
                                                                              ).map(
                                                                                  (
                                                                                      subcat,
                                                                                      subIndex
                                                                                  ) => (
                                                                                      <li
                                                                                          key={
                                                                                              subIndex
                                                                                          }
                                                                                      >
                                                                                          <Link
                                                                                              href={{
                                                                                                  pathname:
                                                                                                      "/product-listing",
                                                                                                  query: {
                                                                                                      catalogue:
                                                                                                          catalogue.name.toLowerCase(),
                                                                                                      category:
                                                                                                          "Casual, Western", // ✅ updated
                                                                                                      subcategory:
                                                                                                          subcat.name,
                                                                                                  },
                                                                                              }}
                                                                                              className={`menu-link-text link ${
                                                                                                  isMenuActive(
                                                                                                      subcat
                                                                                                  )
                                                                                                      ? "activeMenu"
                                                                                                      : ""
                                                                                              }`}
                                                                                          >
                                                                                              {
                                                                                                  subcat.name
                                                                                              }
                                                                                          </Link>
                                                                                      </li>
                                                                                  )
                                                                              )
                                                                            : (
                                                                                  menu.subcategories ||
                                                                                  []
                                                                              ).map(
                                                                                  (
                                                                                      subcat,
                                                                                      subIndex
                                                                                  ) => (
                                                                                      <li
                                                                                          key={
                                                                                              subIndex
                                                                                          }
                                                                                      >
                                                                                          <Link
                                                                                              href={{
                                                                                                  pathname:
                                                                                                      "/product-listing",
                                                                                                  query: {
                                                                                                      catalogue:
                                                                                                          catalogue.name.toLowerCase(),
                                                                                                      category:
                                                                                                          menu.name,
                                                                                                      subcategory:
                                                                                                          subcat.name,
                                                                                                  },
                                                                                              }}
                                                                                              className={`menu-link-text link ${
                                                                                                  isMenuActive(
                                                                                                      subcat
                                                                                                  )
                                                                                                      ? "activeMenu"
                                                                                                      : ""
                                                                                              }`}
                                                                                          >
                                                                                              {
                                                                                                  subcat.name
                                                                                              }
                                                                                          </Link>
                                                                                      </li>
                                                                                  )
                                                                              )}
                                                                    </ul> */}
                                                                    <ul className="menu-list">
                                                                        {isSaree
                                                                            ? (
                                                                                  menu.subcategories ||
                                                                                  []
                                                                              )
                                                                                  .flatMap(
                                                                                      (
                                                                                          subcat
                                                                                      ) =>
                                                                                          subcat.items ||
                                                                                          []
                                                                                  )
                                                                                  .filter(
                                                                                      (
                                                                                          item,
                                                                                          idx,
                                                                                          self
                                                                                      ) =>
                                                                                          self.findIndex(
                                                                                              (
                                                                                                  i
                                                                                              ) =>
                                                                                                  i.id ===
                                                                                                  item.id
                                                                                          ) ===
                                                                                          idx
                                                                                  )
                                                                                  .map(
                                                                                      (
                                                                                          item,
                                                                                          itemIndex
                                                                                      ) => (
                                                                                          <li
                                                                                              key={
                                                                                                  itemIndex
                                                                                              }
                                                                                          >
                                                                                              <Link
                                                                                                  href={{
                                                                                                      pathname:
                                                                                                          "/product-listing",
                                                                                                      query: {
                                                                                                          catalogue:
                                                                                                              catalogue.name.toLowerCase(),
                                                                                                          category:
                                                                                                              menu.name,
                                                                                                          subcategory:
                                                                                                              item.name,
                                                                                                      },
                                                                                                  }}
                                                                                                  className={`menu-link-text link ${
                                                                                                      isMenuActive(
                                                                                                          item
                                                                                                      )
                                                                                                          ? "activeMenu"
                                                                                                          : ""
                                                                                                  }`}
                                                                                              >
                                                                                                  {
                                                                                                      item.name
                                                                                                  }
                                                                                              </Link>
                                                                                          </li>
                                                                                      )
                                                                                  )
                                                                            : isMergedCasualWestern
                                                                            ? (
                                                                                  menu.subcategories ||
                                                                                  []
                                                                              ).map(
                                                                                  (
                                                                                      subcat,
                                                                                      subIndex
                                                                                  ) => (
                                                                                      <li
                                                                                          key={
                                                                                              subIndex
                                                                                          }
                                                                                      >
                                                                                          <Link
                                                                                              href={{
                                                                                                  pathname:
                                                                                                      "/product-listing",
                                                                                                  query: {
                                                                                                      catalogue:
                                                                                                          catalogue.name.toLowerCase(),
                                                                                                      category:
                                                                                                          "Casual, Western", // label override
                                                                                                      subcategory:
                                                                                                          subcat.name,
                                                                                                  },
                                                                                              }}
                                                                                              className={`menu-link-text link ${
                                                                                                  isMenuActive(
                                                                                                      subcat
                                                                                                  )
                                                                                                      ? "activeMenu"
                                                                                                      : ""
                                                                                              }`}
                                                                                          >
                                                                                              {
                                                                                                  subcat.name
                                                                                              }
                                                                                          </Link>
                                                                                      </li>
                                                                                  )
                                                                              )
                                                                            : menu.name.toLowerCase() ===
                                                                              "accessories"
                                                                            ? (
                                                                                  menu.subcategories ||
                                                                                  []
                                                                              )
                                                                                  .filter(
                                                                                      (
                                                                                          subcat
                                                                                      ) =>
                                                                                          [
                                                                                              "wallets",
                                                                                              "belts",
                                                                                              "jewellery",
                                                                                              "glares",
                                                                                          ].includes(
                                                                                              subcat.name.toLowerCase()
                                                                                          )
                                                                                  )
                                                                                  .map(
                                                                                      (
                                                                                          subcat,
                                                                                          subIndex
                                                                                      ) => (
                                                                                          <li
                                                                                              key={
                                                                                                  subIndex
                                                                                              }
                                                                                          >
                                                                                              <Link
                                                                                                  href={{
                                                                                                      pathname:
                                                                                                          "/product-listing",
                                                                                                      query: {
                                                                                                          catalogue:
                                                                                                              catalogue.name.toLowerCase(),
                                                                                                          category:
                                                                                                              menu.name,
                                                                                                          subcategory:
                                                                                                              subcat.name,
                                                                                                      },
                                                                                                  }}
                                                                                                  className={`menu-link-text link ${
                                                                                                      isMenuActive(
                                                                                                          subcat
                                                                                                      )
                                                                                                          ? "activeMenu"
                                                                                                          : ""
                                                                                                  }`}
                                                                                              >
                                                                                                  {
                                                                                                      subcat.name
                                                                                                  }
                                                                                              </Link>
                                                                                          </li>
                                                                                      )
                                                                                  )
                                                                            : (
                                                                                  menu.subcategories ||
                                                                                  []
                                                                              ).map(
                                                                                  (
                                                                                      subcat,
                                                                                      subIndex
                                                                                  ) => (
                                                                                      <li
                                                                                          key={
                                                                                              subIndex
                                                                                          }
                                                                                      >
                                                                                          <Link
                                                                                              href={{
                                                                                                  pathname:
                                                                                                      "/product-listing",
                                                                                                  query: {
                                                                                                      catalogue:
                                                                                                          catalogue.name.toLowerCase(),
                                                                                                      category:
                                                                                                          menu.name,
                                                                                                      subcategory:
                                                                                                          subcat.name,
                                                                                                  },
                                                                                              }}
                                                                                              className={`menu-link-text link ${
                                                                                                  isMenuActive(
                                                                                                      subcat
                                                                                                  )
                                                                                                      ? "activeMenu"
                                                                                                      : ""
                                                                                              }`}
                                                                                          >
                                                                                              {
                                                                                                  subcat.name
                                                                                              }
                                                                                          </Link>
                                                                                      </li>
                                                                                  )
                                                                              )}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </React.Fragment>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="collection-item hover-img">
                                    <div className="collection-inner">
                                        <Link
                                            href={`/`}
                                            className="collection-image img-style border-radius-0"
                                        >
                                            <Image
                                                className="lazyload"
                                                data-src="/images/brand-maratha/home/footware.jpg"
                                                alt="collection-demo-1"
                                                src="/images/brand-maratha/home/footware.jpg"
                                                width="577"
                                                height="436"
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>

            <li className="menu-item">
                <Link
                    href={{
                        pathname: "/product-listing",
                        query: {
                            catalogue: "men",
                        },
                    }}
                    className={`item-link ${Linkfs} ${textColor} ${
                        isMenuActive("") ? "activeMenu" : ""
                    } `}
                >
                    {t("men", language)}
                    {isArrow ? <i className="icon icon-arrow-down" /> : ""}
                </Link>
                <div className="sub-menu mega-menu">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="row">
                                    {[menCatalogues]?.map(
                                        (catalogue, catIndex) => (
                                            <React.Fragment key={catIndex}>
                                                {[
                                                    ...(catalogue?.categories ||
                                                        []),
                                                ]
                                                    .sort((a, b) => {
                                                        const categoryOrder = [
                                                            "Ethnic",
                                                            "Formal",
                                                            "Casual/Western Wear",
                                                            "Foot Ware",
                                                            "Saree",
                                                            "Accessories",
                                                        ];
                                                        const aIndex =
                                                            categoryOrder.indexOf(
                                                                a.name
                                                            );
                                                        const bIndex =
                                                            categoryOrder.indexOf(
                                                                b.name
                                                            );
                                                        return (
                                                            (aIndex === -1
                                                                ? 999
                                                                : aIndex) -
                                                            (bIndex === -1
                                                                ? 999
                                                                : bIndex)
                                                        );
                                                    })
                                                    .map((menu, index) => {
                                                        const isSaree =
                                                            menu.name.toLowerCase() ===
                                                            "saree";
                                                        const isMergedCasualWestern =
                                                            menu.name ===
                                                            "Casual/Western Wear";

                                                        return (
                                                            <div
                                                                className="col-md-4 mb-24"
                                                                key={index}
                                                            >
                                                                <div className="mega-menu-item">
                                                                    <div className="menu-heading">
                                                                        {
                                                                            menu.name
                                                                        }
                                                                    </div>
                                                                    {/* <ul className="menu-list">
                                                                        {isSaree
                                                                            ? (
                                                                                  menu.subcategories ||
                                                                                  []
                                                                              )
                                                                                  .flatMap(
                                                                                      (
                                                                                          subcat
                                                                                      ) =>
                                                                                          subcat.items ||
                                                                                          []
                                                                                  )
                                                                                  .filter(
                                                                                      (
                                                                                          item,
                                                                                          idx,
                                                                                          self
                                                                                      ) =>
                                                                                          self.findIndex(
                                                                                              (
                                                                                                  i
                                                                                              ) =>
                                                                                                  i.id ===
                                                                                                  item.id
                                                                                          ) ===
                                                                                          idx
                                                                                  )
                                                                                  .map(
                                                                                      (
                                                                                          item,
                                                                                          itemIndex
                                                                                      ) => (
                                                                                          <li
                                                                                              key={
                                                                                                  itemIndex
                                                                                              }
                                                                                          >
                                                                                              <Link
                                                                                                  href={{
                                                                                                      pathname:
                                                                                                          "/product-listing",
                                                                                                      query: {
                                                                                                          catalogue:
                                                                                                              catalogue.name.toLowerCase(),
                                                                                                          category:
                                                                                                              menu.name,
                                                                                                          subcategory:
                                                                                                              item.name,
                                                                                                      },
                                                                                                  }}
                                                                                                  className={`menu-link-text link ${
                                                                                                      isMenuActive(
                                                                                                          item
                                                                                                      )
                                                                                                          ? "activeMenu"
                                                                                                          : ""
                                                                                                  }`}
                                                                                              >
                                                                                                  {
                                                                                                      item.name
                                                                                                  }
                                                                                              </Link>
                                                                                          </li>
                                                                                      )
                                                                                  )
                                                                            : isMergedCasualWestern
                                                                            ? (
                                                                                  menu.subcategories ||
                                                                                  []
                                                                              ).map(
                                                                                  (
                                                                                      subcat,
                                                                                      subIndex
                                                                                  ) => (
                                                                                      <li
                                                                                          key={
                                                                                              subIndex
                                                                                          }
                                                                                      >
                                                                                          <Link
                                                                                              href={{
                                                                                                  pathname:
                                                                                                      "/product-listing",
                                                                                                  query: {
                                                                                                      catalogue:
                                                                                                          catalogue.name.toLowerCase(),
                                                                                                      category:
                                                                                                          "Casual, Western",
                                                                                                      subcategory:
                                                                                                          subcat.name,
                                                                                                  },
                                                                                              }}
                                                                                              className={`menu-link-text link ${
                                                                                                  isMenuActive(
                                                                                                      subcat
                                                                                                  )
                                                                                                      ? "activeMenu"
                                                                                                      : ""
                                                                                              }`}
                                                                                          >
                                                                                              {
                                                                                                  subcat.name
                                                                                              }
                                                                                          </Link>
                                                                                      </li>
                                                                                  )
                                                                              )
                                                                            : (
                                                                                  menu.subcategories ||
                                                                                  []
                                                                              ).map(
                                                                                  (
                                                                                      subcat,
                                                                                      subIndex
                                                                                  ) => (
                                                                                      <li
                                                                                          key={
                                                                                              subIndex
                                                                                          }
                                                                                      >
                                                                                          <Link
                                                                                              href={{
                                                                                                  pathname:
                                                                                                      "/product-listing",
                                                                                                  query: {
                                                                                                      catalogue:
                                                                                                          catalogue.name.toLowerCase(),
                                                                                                      category:
                                                                                                          menu.name,
                                                                                                      subcategory:
                                                                                                          subcat.name,
                                                                                                  },
                                                                                              }}
                                                                                              className={`menu-link-text link ${
                                                                                                  isMenuActive(
                                                                                                      subcat
                                                                                                  )
                                                                                                      ? "activeMenu"
                                                                                                      : ""
                                                                                              }`}
                                                                                          >
                                                                                              {
                                                                                                  subcat.name
                                                                                              }
                                                                                          </Link>
                                                                                      </li>
                                                                                  )
                                                                              )}
                                                                    </ul> */}
                                                                    <ul className="menu-list">
                                                                        {isSaree
                                                                            ? (
                                                                                  menu.subcategories ||
                                                                                  []
                                                                              )
                                                                                  .flatMap(
                                                                                      (
                                                                                          subcat
                                                                                      ) =>
                                                                                          subcat.items ||
                                                                                          []
                                                                                  )
                                                                                  .filter(
                                                                                      (
                                                                                          item,
                                                                                          idx,
                                                                                          self
                                                                                      ) =>
                                                                                          self.findIndex(
                                                                                              (
                                                                                                  i
                                                                                              ) =>
                                                                                                  i.id ===
                                                                                                  item.id
                                                                                          ) ===
                                                                                          idx
                                                                                  )
                                                                                  .map(
                                                                                      (
                                                                                          item,
                                                                                          itemIndex
                                                                                      ) => (
                                                                                          <li
                                                                                              key={
                                                                                                  itemIndex
                                                                                              }
                                                                                          >
                                                                                              <Link
                                                                                                  href={{
                                                                                                      pathname:
                                                                                                          "/product-listing",
                                                                                                      query: {
                                                                                                          catalogue:
                                                                                                              catalogue.name.toLowerCase(),
                                                                                                          category:
                                                                                                              menu.name,
                                                                                                          subcategory:
                                                                                                              item.name,
                                                                                                      },
                                                                                                  }}
                                                                                                  className={`menu-link-text link ${
                                                                                                      isMenuActive(
                                                                                                          item
                                                                                                      )
                                                                                                          ? "activeMenu"
                                                                                                          : ""
                                                                                                  }`}
                                                                                              >
                                                                                                  {
                                                                                                      item.name
                                                                                                  }
                                                                                              </Link>
                                                                                          </li>
                                                                                      )
                                                                                  )
                                                                            : isMergedCasualWestern
                                                                            ? (
                                                                                  menu.subcategories ||
                                                                                  []
                                                                              ).map(
                                                                                  (
                                                                                      subcat,
                                                                                      subIndex
                                                                                  ) => (
                                                                                      <li
                                                                                          key={
                                                                                              subIndex
                                                                                          }
                                                                                      >
                                                                                          <Link
                                                                                              href={{
                                                                                                  pathname:
                                                                                                      "/product-listing",
                                                                                                  query: {
                                                                                                      catalogue:
                                                                                                          catalogue.name.toLowerCase(),
                                                                                                      category:
                                                                                                          "Casual, Western", // label override
                                                                                                      subcategory:
                                                                                                          subcat.name,
                                                                                                  },
                                                                                              }}
                                                                                              className={`menu-link-text link ${
                                                                                                  isMenuActive(
                                                                                                      subcat
                                                                                                  )
                                                                                                      ? "activeMenu"
                                                                                                      : ""
                                                                                              }`}
                                                                                          >
                                                                                              {
                                                                                                  subcat.name
                                                                                              }
                                                                                          </Link>
                                                                                      </li>
                                                                                  )
                                                                              )
                                                                            : menu.name.toLowerCase() ===
                                                                              "accessories"
                                                                            ? (
                                                                                  menu.subcategories ||
                                                                                  []
                                                                              )
                                                                                  .filter(
                                                                                      (
                                                                                          subcat
                                                                                      ) =>
                                                                                          [
                                                                                              "wallets",
                                                                                              "belts",
                                                                                              "jewellery",
                                                                                              "glares",
                                                                                          ].includes(
                                                                                              subcat.name.toLowerCase()
                                                                                          )
                                                                                  )
                                                                                  .map(
                                                                                      (
                                                                                          subcat,
                                                                                          subIndex
                                                                                      ) => (
                                                                                          <li
                                                                                              key={
                                                                                                  subIndex
                                                                                              }
                                                                                          >
                                                                                              <Link
                                                                                                  href={{
                                                                                                      pathname:
                                                                                                          "/product-listing",
                                                                                                      query: {
                                                                                                          catalogue:
                                                                                                              catalogue.name.toLowerCase(),
                                                                                                          category:
                                                                                                              menu.name,
                                                                                                          subcategory:
                                                                                                              subcat.name,
                                                                                                      },
                                                                                                  }}
                                                                                                  className={`menu-link-text link ${
                                                                                                      isMenuActive(
                                                                                                          subcat
                                                                                                      )
                                                                                                          ? "activeMenu"
                                                                                                          : ""
                                                                                                  }`}
                                                                                              >
                                                                                                  {
                                                                                                      subcat.name
                                                                                                  }
                                                                                              </Link>
                                                                                          </li>
                                                                                      )
                                                                                  )
                                                                            : (
                                                                                  menu.subcategories ||
                                                                                  []
                                                                              ).map(
                                                                                  (
                                                                                      subcat,
                                                                                      subIndex
                                                                                  ) => (
                                                                                      <li
                                                                                          key={
                                                                                              subIndex
                                                                                          }
                                                                                      >
                                                                                          <Link
                                                                                              href={{
                                                                                                  pathname:
                                                                                                      "/product-listing",
                                                                                                  query: {
                                                                                                      catalogue:
                                                                                                          catalogue.name.toLowerCase(),
                                                                                                      category:
                                                                                                          menu.name,
                                                                                                      subcategory:
                                                                                                          subcat.name,
                                                                                                  },
                                                                                              }}
                                                                                              className={`menu-link-text link ${
                                                                                                  isMenuActive(
                                                                                                      subcat
                                                                                                  )
                                                                                                      ? "activeMenu"
                                                                                                      : ""
                                                                                              }`}
                                                                                          >
                                                                                              {
                                                                                                  subcat.name
                                                                                              }
                                                                                          </Link>
                                                                                      </li>
                                                                                  )
                                                                              )}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </React.Fragment>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="collection-item hover-img">
                                    <div className="collection-inner">
                                        <Link
                                            href={`/`}
                                            className="collection-image img-style border-radius-0"
                                        >
                                            <Image
                                                className="lazyload"
                                                data-src="/images/brand-maratha/home/footware.jpg"
                                                alt="collection-demo-men"
                                                src="/images/brand-maratha/home/footware.jpg"
                                                width="577"
                                                height="436"
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>

            <li className="menu-item">
                <Link
                    href={{
                        pathname: "/product-listing",
                        query: {
                            category: "accessories",
                        },
                    }}
                    className={`item-link ${Linkfs} ${textColor} ${
                        isMenuActive("") ? "activeMenu" : ""
                    } `}
                >
                    {t("accessories", language)}
                    {isArrow ? <i className="icon icon-arrow-down" /> : ""}
                </Link>
                <div className="sub-menu mega-menu">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                {/* <div className="row">
                                    {Array.isArray(accessories) &&
                                        accessories.map((menu, index) => {
                                            const seenFirstWords = new Set();

                                            return (
                                                <div
                                                    className="col-md-4 mb-24"
                                                    key={index}
                                                >
                                                    <div className="mega-menu-item">
                                                        <div className="menu-heading">
                                                            {menu.name}
                                                        </div>
                                                        <ul className="menu-list">
                                                            {Array.isArray(
                                                                menu.items
                                                            ) &&
                                                                menu.items
                                                                    .filter(
                                                                        (
                                                                            link
                                                                        ) => {
                                                                            const firstWord =
                                                                                link.name?.split(
                                                                                    " "
                                                                                )[0];
                                                                            if (
                                                                                seenFirstWords.has(
                                                                                    firstWord
                                                                                )
                                                                            )
                                                                                return false;
                                                                            seenFirstWords.add(
                                                                                firstWord
                                                                            );
                                                                            return true;
                                                                        }
                                                                    )
                                                                    .map(
                                                                        (
                                                                            link,
                                                                            linkIndex
                                                                        ) => {
                                                                            const firstWord =
                                                                                link.name?.split(
                                                                                    " "
                                                                                )[0];
                                                                            return (
                                                                                <li
                                                                                    key={
                                                                                        linkIndex
                                                                                    }
                                                                                >
                                                                                    <Link
                                                                                        href={{
                                                                                            pathname:
                                                                                                "/product-listing",
                                                                                            query: {
                                                                                                category:
                                                                                                    "accessories",
                                                                                                item: firstWord, // send first word in URL
                                                                                            },
                                                                                        }}
                                                                                        className={`menu-link-text link ${
                                                                                            isMenuActive(
                                                                                                link
                                                                                            )
                                                                                                ? "activeMenu"
                                                                                                : ""
                                                                                        }`}
                                                                                    >
                                                                                        {
                                                                                            firstWord
                                                                                        }
                                                                                    </Link>
                                                                                </li>
                                                                            );
                                                                        }
                                                                    )}
                                                        </ul>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div> */}
                                <div className="row">
                                    {(() => {
                                        const groupedItems = {
                                            Jewellery: [],
                                            Bags: [],
                                            Glares: [],
                                        };

                                        const essentialsList = [];
                                        const seenFirstWords = new Set();

                                        const validGroups = [
                                            "Jewellery",
                                            "Bags",
                                            "Glares",
                                        ];

                                        Array.isArray(accessories) &&
                                            accessories.forEach((menu) => {
                                                const groupName = menu.name;

                                                if (
                                                    validGroups.includes(
                                                        groupName
                                                    )
                                                ) {
                                                    if (
                                                        !Array.isArray(
                                                            menu.items
                                                        )
                                                    )
                                                        return;

                                                    menu.items.forEach(
                                                        (item) => {
                                                            if (
                                                                groupName ===
                                                                "Jewellery"
                                                            ) {
                                                                const firstWord =
                                                                    item.name?.split(
                                                                        " "
                                                                    )[0];
                                                                if (
                                                                    !firstWord ||
                                                                    seenFirstWords.has(
                                                                        firstWord
                                                                    )
                                                                )
                                                                    return;
                                                                seenFirstWords.add(
                                                                    firstWord
                                                                );
                                                                groupedItems[
                                                                    groupName
                                                                ].push({
                                                                    ...item,
                                                                    displayName:
                                                                        firstWord,
                                                                });
                                                            } else {
                                                                groupedItems[
                                                                    groupName
                                                                ].push({
                                                                    ...item,
                                                                    displayName:
                                                                        item.name,
                                                                });
                                                            }
                                                        }
                                                    );
                                                } else {
                                                    essentialsList.push(
                                                        groupName
                                                    );
                                                }
                                            });

                                        return (
                                            <>
                                                {Object.entries(
                                                    groupedItems
                                                ).map(([group, items]) => (
                                                    <div
                                                        className="col-md-4 mb-24"
                                                        key={group}
                                                    >
                                                        <div className="mega-menu-item">
                                                            <div className="menu-heading">
                                                                {group}
                                                            </div>
                                                            <ul className="menu-list">
                                                                {items.map(
                                                                    (
                                                                        item,
                                                                        index
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            <Link
                                                                                href={{
                                                                                    pathname:
                                                                                        "/product-listing",
                                                                                    query: {
                                                                                        category:
                                                                                            "accessories",
                                                                                        item: item.displayName,
                                                                                    },
                                                                                }}
                                                                                className={`menu-link-text link ${
                                                                                    isMenuActive(
                                                                                        item
                                                                                    )
                                                                                        ? "activeMenu"
                                                                                        : ""
                                                                                }`}
                                                                            >
                                                                                {
                                                                                    item.displayName
                                                                                }
                                                                            </Link>
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                ))}
                                                {essentialsList.length > 0 && (
                                                    <div className="col-md-4 mb-24">
                                                        <div className="mega-menu-item">
                                                            <div className="menu-heading">
                                                                Essentials
                                                            </div>
                                                            <ul className="menu-list">
                                                                {essentialsList.map(
                                                                    (
                                                                        name,
                                                                        index
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            <Link
                                                                                href={{
                                                                                    pathname:
                                                                                        "/product-listing",
                                                                                    query: {
                                                                                        category:
                                                                                            "accessories",
                                                                                        subcategory:
                                                                                            name,
                                                                                    },
                                                                                }}
                                                                                className={`menu-link-text link ${
                                                                                    isMenuActive(
                                                                                        name
                                                                                    )
                                                                                        ? "activeMenu"
                                                                                        : ""
                                                                                }`}
                                                                            >
                                                                                {
                                                                                    name
                                                                                }
                                                                            </Link>
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="collection-item hover-img">
                                    <div className="collection-inner">
                                        <Link
                                            href={`/`}
                                            className="collection-image img-style border-radius-0"
                                        >
                                            <Image
                                                className="lazyload"
                                                data-src="/images/brand-maratha/home/footware.jpg"
                                                alt="collection-demo-1"
                                                src="/images/brand-maratha/home/footware.jpg"
                                                width="577"
                                                height="436"
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
            <li className="menu-item">
                <a
                    href="/blog"
                    className={`item-link ${Linkfs} ${textColor} ${
                        isMenuActive("") ? "activeMenu" : ""
                    } `}
                >
                    {t("Blogs", language)}
                </a>
            </li>
            <li className="menu-item">
                <a
                    href="/magazine"
                    className={`item-link ${Linkfs} ${textColor} ${
                        isMenuActive("") ? "activeMenu" : ""
                    } `}
                >
                    {t("magazine", language)}
                </a>
            </li>
        </>
    );
}
