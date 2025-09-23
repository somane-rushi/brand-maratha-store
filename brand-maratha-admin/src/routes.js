import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
// const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
// const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// // Base
// const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
// const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
// const Cards = React.lazy(() => import('./views/base/cards/Cards'))
// const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
// const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
// const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
// const Navs = React.lazy(() => import('./views/base/navs/Navs'))
// const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
// const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
// const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
// const Progress = React.lazy(() => import('./views/base/progress/Progress'))
// const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
// const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
// // const Tables = React.lazy(() => import('./views/base/tables/Tables'))
// const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// // Buttons
// const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
// const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
// const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

// //Forms
// const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
// const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
// const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
// const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
// const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
// const Range = React.lazy(() => import('./views/forms/range/Range'))
// const Select = React.lazy(() => import('./views/forms/select/Select'))
// const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

// const Charts = React.lazy(() => import('./views/charts/Charts'))

// // Icons
// const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
// const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
// // const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// // Notifications
// const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
// const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
// const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
// const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

// const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

// New
const PrivacyPolicy = React.lazy(() => import('./views/privacy-policy/PrivacyPolicy'))
const TermsAndConditions = React.lazy(() => import('./views/terms-and-conditions/TermsAndConditions'))
const HomeBannerFirst = React.lazy(() => import('./views/home/HomeBannerFirst'))
const HomeBannerSecond = React.lazy(() => import('./views/home/HomeBannerSecond'))
const NewsLetter = React.lazy(() => import('./views/home/NewsLetter'))
const AboutUsBanner = React.lazy(() => import('./views/about-us/AboutUsBanner'))
const WhoAreWe = React.lazy(() => import('./views/about-us/WhoAreWe'))
const OurJourney = React.lazy(() => import('./views/about-us/OurJourney'))
const OurMission = React.lazy(() => import('./views/about-us/OurMission'))
const Testimonials = React.lazy(() => import('./views/about-us/Testimonials'))
const Brands = React.lazy(() => import('./views/home/Brands'))
const ContactUs = React.lazy(() => import('./views/contact-us/ContactUs'))
const Blogs = React.lazy(() => import('./views/blogs/Blog'))
const Disclaimer = React.lazy(() => import('./views/disclaimer/Disclaimer'))
const InternationalPolicy = React.lazy(() => import('./views/international-policy/InternationalPolicy'))
const Collection = React.lazy(() => import('./views/home/Collection'))
const ShopBy = React.lazy(() => import('./views/home/ShopBy'))
const Instagram = React.lazy(() => import('./views/home/Instagram'))
const ViewBlogs = React.lazy(() => import('./views/blogs/ViewBlogs'))
const Add_UpdateBlog = React.lazy(() => import('./views/blogs/Add_UpdateBlog'))
const ExchangePolicy = React.lazy(() => import('./views/exchange-policy/ExchangePolicy'))
const MagazineImageBanner = React.lazy(() => import('./views/magazine/ImageBanner'))
const MagazineVideoBanner = React.lazy(() => import('./views/magazine/VideoBanner'))
const MagazineInstagramBanner = React.lazy(() => import('./views/magazine/InstagramBanner'))
const PreviousEditions = React.lazy(() => import('./views/magazine/PreviousEditions'))
const BrandDetails = React.lazy(() => import('./views/brand-details/BrandDetails'))
const ViewBrandDetails = React.lazy(() => import('./views/brand-details/ViewBrandDetails'))
const Add_UpdateBrandDetails = React.lazy(() => import('./views/brand-details/Add_UpdateBrandDetails'))
const ProductList = React.lazy(() => import('./views/products/ProductTable'))
const ProductDetails = React.lazy(() => import('./views/products/ProductDetails'))
const ProductUpdate = React.lazy(() => import('./views/products/ProductUpdate'))
const NewProduct = React.lazy(() => import('./views/products/ProductAdd'))
const Orders = React.lazy(() => import('./views/orders/Orders'))
const OrderDetails = React.lazy(() => import('./views/orders/OrderDetails'))
const Users = React.lazy(() => import('./views/users/Users'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  // { path: '/theme', name: 'Theme', element: Colors, exact: true },
  // { path: '/theme/colors', name: 'Colors', element: Colors },
  // { path: '/theme/typography', name: 'Typography', element: Typography },
  // { path: '/base', name: 'Base', element: Cards, exact: true },
  // // { path: '/base/accordion', name: 'Accordion', element: Accordion },
  // { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  // { path: '/base/cards', name: 'Cards', element: Cards },
  // { path: '/base/carousels', name: 'Carousel', element: Carousels },
  // { path: '/base/collapses', name: 'Collapse', element: Collapses },
  // { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  // { path: '/base/navs', name: 'Navs', element: Navs },
  // { path: '/base/paginations', name: 'Paginations', element: Paginations },
  // { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  // { path: '/base/popovers', name: 'Popovers', element: Popovers },
  // { path: '/base/progress', name: 'Progress', element: Progress },
  // { path: '/base/spinners', name: 'Spinners', element: Spinners },
  // { path: '/base/tabs', name: 'Tabs', element: Tabs },
  // // { path: '/base/tables', name: 'Tables', element: Tables },
  // { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  // { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  // { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  // { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  // { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  // { path: '/charts', name: 'Charts', element: Charts },
  // { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  // { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  // { path: '/forms/select', name: 'Select', element: Select },
  // { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  // { path: '/forms/range', name: 'Range', element: Range },
  // { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  // { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  // { path: '/forms/layout', name: 'Layout', element: Layout },
  // { path: '/forms/validation', name: 'Validation', element: Validation },
  // { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  // { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  // { path: '/icons/flags', name: 'Flags', element: Flags },
  // { path: '/icons/brands', name: 'Brands', element: Brands },
  // { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  // { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  // { path: '/notifications/badges', name: 'Badges', element: Badges },
  // { path: '/notifications/modals', name: 'Modals', element: Modals },
  // { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  // { path: '/widgets', name: 'Widgets', element: Widgets },

  // New
  { path: '/base/privacy-policy', name: 'Privacy Policy', element: PrivacyPolicy },
  { path: '/base/terms-and-conditions', name: 'Terms and Conditions', element: TermsAndConditions },
  { path: '/base/home-banner-first', name: 'Banner First', element: HomeBannerFirst },
  { path: '/base/home-banner-second', name: 'Banner Second', element: HomeBannerSecond },
  { path: '/base/news-letter', name: 'News Letter', element: NewsLetter },
  { path: '/base/about-us-banner', name: 'Banner', element: AboutUsBanner },
  { path: '/base/who-are-we', name: 'Who Are We', element: WhoAreWe },
  { path: '/base/our-journey', name: 'Our Journey', element: OurJourney },
  { path: '/base/our-mission', name: 'Our Mission', element: OurMission },
  { path: '/base/testimonials', name: 'Testimonials', element: Testimonials },
  { path: '/base/brands', name: 'Brands', element: Brands },
  { path: '/base/contact-us', name: 'Contact Us', element: ContactUs },
  { path: '/base/disclaimer', name: 'Disclaimer', element: Disclaimer },
  { path: '/base/international-policy', name: 'International Policy', element: InternationalPolicy },
  { path: '/base/collection', name: 'Collection', element: Collection },
  { path: '/base/shop-by', name: 'Shop By', element: ShopBy },
  { path: '/base/instagram', name: 'Instagram', element: Instagram },
  { path: '/base/blogs', name: 'Blogs', element: Blogs },
  { path: '/base/blog/:id', name: 'View', element: ViewBlogs },
  { path: '/base/blog/add', name: 'Add', element: Add_UpdateBlog },
  { path: '/base/blog/update/:id', name: 'Update', element: Add_UpdateBlog },
  { path: '/base/exchange-policy', name: 'Exchange Policy', element: ExchangePolicy },
  { path: '/magazine/image-banner', name: 'Image Banner', element: MagazineImageBanner },
  { path: '/magazine/video-banner', name: 'Video Banner', element: MagazineVideoBanner },
  { path: '/magazine/instagram-banner', name: 'Instagram Banner', element: MagazineInstagramBanner },
  { path: '/magazine/previous-editions', name: 'Previous Editions', element: PreviousEditions },
  { path: '/brand-details', name: 'Brand Details', element: BrandDetails },
  { path: '/brand-details/:id', name: 'View', element: ViewBrandDetails },
  { path: '/brand-details/add', name: 'Add', element: Add_UpdateBrandDetails },
  { path: '/brand-details/update/:id', name: 'Update', element: Add_UpdateBrandDetails },
  { path: '/products-list', name: 'Products', element: ProductList },
  { path: '/product-details/:id', name: 'Product Details', element: ProductDetails },
  { path: '/product/update/:id', name: 'Update Product', element: ProductUpdate },
  { path: '/product/add', name: 'Add Product', element: NewProduct },
  { path: '/orders', name: 'Orders', element: Orders },
  { path: '/order-details/:id', name: 'Order Details', element: OrderDetails },
  { path: '/users', name: 'Users', element: Users },

]

export default routes
