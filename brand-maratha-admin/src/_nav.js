// import React from 'react'
// import CIcon from '@coreui/icons-react'
// import {
//   cilBell,
//   cilCalculator,
//   cilChartPie,
//   cilCursor,
//   cilDescription,
//   cilDrop,
//   cilExternalLink,
//   cilNotes,
//   cilPencil,
//   cilPuzzle,
//   cilSpeedometer,
//   cilStar,
// } from '@coreui/icons'
// import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

// const _nav = [
//   {
//     component: CNavItem,
//     name: 'Dashboard',
//     to: '/dashboard',
//     icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
//     badge: {
//       color: 'info',
//       text: 'NEW',
//     },
//   },
//   {
//     component: CNavTitle,
//     name: 'Theme',
//   },
//   {
//     component: CNavItem,
//     name: 'Colors',
//     to: '/theme/colors',
//     icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
//   },
//   {
//     component: CNavItem,
//     name: 'Typography',
//     to: '/theme/typography',
//     icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
//   },
//   {
//     component: CNavTitle,
//     name: 'Components',
//   },
//   {
//     component: CNavGroup,
//     name: 'Base',
//     to: '/base',
//     icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
//     items: [
//       {
//         component: CNavItem,
//         name: 'Accordion',
//         to: '/base/accordion',
//       },
//       {
//         component: CNavItem,
//         name: 'Breadcrumb',
//         to: '/base/breadcrumbs',
//       },
//       {
//         component: CNavItem,
//         name: (
//           <React.Fragment>
//             {'Calendar'}
//             <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
//           </React.Fragment>
//         ),
//         href: 'https://coreui.io/react/docs/components/calendar/',
//         badge: {
//           color: 'danger',
//           text: 'PRO',
//         },
//       },
//       {
//         component: CNavItem,
//         name: 'Cards',
//         to: '/base/cards',
//       },
//       {
//         component: CNavItem,
//         name: 'Carousel',
//         to: '/base/carousels',
//       },
//       {
//         component: CNavItem,
//         name: 'Collapse',
//         to: '/base/collapses',
//       },
//       {
//         component: CNavItem,
//         name: 'List group',
//         to: '/base/list-groups',
//       },
//       {
//         component: CNavItem,
//         name: 'Navs & Tabs',
//         to: '/base/navs',
//       },
//       {
//         component: CNavItem,
//         name: 'Pagination',
//         to: '/base/paginations',
//       },
//       {
//         component: CNavItem,
//         name: 'Placeholders',
//         to: '/base/placeholders',
//       },
//       {
//         component: CNavItem,
//         name: 'Popovers',
//         to: '/base/popovers',
//       },
//       {
//         component: CNavItem,
//         name: 'Progress',
//         to: '/base/progress',
//       },
//       {
//         component: CNavItem,
//         name: 'Smart Pagination',
//         href: 'https://coreui.io/react/docs/components/smart-pagination/',
//         badge: {
//           color: 'danger',
//           text: 'PRO',
//         },
//       },
//       {
//         component: CNavItem,
//         name: (
//           <React.Fragment>
//             {'Smart Table'}
//             <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
//           </React.Fragment>
//         ),
//         href: 'https://coreui.io/react/docs/components/smart-table/',
//         badge: {
//           color: 'danger',
//           text: 'PRO',
//         },
//       },
//       {
//         component: CNavItem,
//         name: 'Spinners',
//         to: '/base/spinners',
//       },
//       {
//         component: CNavItem,
//         name: 'Tables',
//         to: '/base/tables',
//       },
//       {
//         component: CNavItem,
//         name: 'Tabs',
//         to: '/base/tabs',
//       },
//       {
//         component: CNavItem,
//         name: 'Tooltips',
//         to: '/base/tooltips',
//       },
//       {
//         component: CNavItem,
//         name: (
//           <React.Fragment>
//             {'Virtual Scroller'}
//             <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
//           </React.Fragment>
//         ),
//         href: 'https://coreui.io/react/docs/components/virtual-scroller/',
//         badge: {
//           color: 'danger',
//           text: 'PRO',
//         },
//       },
//     ],
//   },
//   {
//     component: CNavGroup,
//     name: 'Buttons',
//     to: '/buttons',
//     icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
//     items: [
//       {
//         component: CNavItem,
//         name: 'Buttons',
//         to: '/buttons/buttons',
//       },
//       {
//         component: CNavItem,
//         name: 'Buttons groups',
//         to: '/buttons/button-groups',
//       },
//       {
//         component: CNavItem,
//         name: 'Dropdowns',
//         to: '/buttons/dropdowns',
//       },
//       {
//         component: CNavItem,
//         name: (
//           <React.Fragment>
//             {'Loading Button'}
//             <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
//           </React.Fragment>
//         ),
//         href: 'https://coreui.io/react/docs/components/loading-button/',
//         badge: {
//           color: 'danger',
//           text: 'PRO',
//         },
//       },
//     ],
//   },
//   {
//     component: CNavGroup,
//     name: 'Forms',
//     icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
//     items: [
//       {
//         component: CNavItem,
//         name: 'Form Control',
//         to: '/forms/form-control',
//       },
//       {
//         component: CNavItem,
//         name: 'Select',
//         to: '/forms/select',
//       },
//       {
//         component: CNavItem,
//         name: (
//           <React.Fragment>
//             {'Multi Select'}
//             <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
//           </React.Fragment>
//         ),
//         href: 'https://coreui.io/react/docs/forms/multi-select/',
//         badge: {
//           color: 'danger',
//           text: 'PRO',
//         },
//       },
//       {
//         component: CNavItem,
//         name: 'Checks & Radios',
//         to: '/forms/checks-radios',
//       },
//       {
//         component: CNavItem,
//         name: 'Range',
//         to: '/forms/range',
//       },
//       {
//         component: CNavItem,
//         name: (
//           <React.Fragment>
//             {'Range Slider'}
//             <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
//           </React.Fragment>
//         ),
//         href: 'https://coreui.io/react/docs/forms/range-slider/',
//         badge: {
//           color: 'danger',
//           text: 'PRO',
//         },
//       },
//       {
//         component: CNavItem,
//         name: (
//           <React.Fragment>
//             {'Rating'}
//             <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
//           </React.Fragment>
//         ),
//         href: 'https://coreui.io/react/docs/forms/rating/',
//         badge: {
//           color: 'danger',
//           text: 'PRO',
//         },
//       },
//       {
//         component: CNavItem,
//         name: 'Input Group',
//         to: '/forms/input-group',
//       },
//       {
//         component: CNavItem,
//         name: 'Floating Labels',
//         to: '/forms/floating-labels',
//       },
//       {
//         component: CNavItem,
//         name: (
//           <React.Fragment>
//             {'Date Picker'}
//             <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
//           </React.Fragment>
//         ),
//         href: 'https://coreui.io/react/docs/forms/date-picker/',
//         badge: {
//           color: 'danger',
//           text: 'PRO',
//         },
//       },
//       {
//         component: CNavItem,
//         name: 'Date Range Picker',
//         href: 'https://coreui.io/react/docs/forms/date-range-picker/',
//         badge: {
//           color: 'danger',
//           text: 'PRO',
//         },
//       },
//       {
//         component: CNavItem,
//         name: (
//           <React.Fragment>
//             {'Time Picker'}
//             <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
//           </React.Fragment>
//         ),
//         href: 'https://coreui.io/react/docs/forms/time-picker/',
//         badge: {
//           color: 'danger',
//           text: 'PRO',
//         },
//       },
//       {
//         component: CNavItem,
//         name: 'Layout',
//         to: '/forms/layout',
//       },
//       {
//         component: CNavItem,
//         name: 'Validation',
//         to: '/forms/validation',
//       },
//     ],
//   },
//   {
//     component: CNavItem,
//     name: 'Charts',
//     to: '/charts',
//     icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
//   },
//   {
//     component: CNavGroup,
//     name: 'Icons',
//     icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
//     items: [
//       {
//         component: CNavItem,
//         name: 'CoreUI Free',
//         to: '/icons/coreui-icons',
//       },
//       {
//         component: CNavItem,
//         name: 'CoreUI Flags',
//         to: '/icons/flags',
//       },
//       {
//         component: CNavItem,
//         name: 'CoreUI Brands',
//         to: '/icons/brands',
//       },
//     ],
//   },
//   {
//     component: CNavGroup,
//     name: 'Notifications',
//     icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
//     items: [
//       {
//         component: CNavItem,
//         name: 'Alerts',
//         to: '/notifications/alerts',
//       },
//       {
//         component: CNavItem,
//         name: 'Badges',
//         to: '/notifications/badges',
//       },
//       {
//         component: CNavItem,
//         name: 'Modal',
//         to: '/notifications/modals',
//       },
//       {
//         component: CNavItem,
//         name: 'Toasts',
//         to: '/notifications/toasts',
//       },
//     ],
//   },
//   {
//     component: CNavItem,
//     name: 'Widgets',
//     to: '/widgets',
//     icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
//     badge: {
//       color: 'info',
//       text: 'NEW',
//     },
//   },
//   {
//     component: CNavTitle,
//     name: 'Extras',
//   },
//   {
//     component: CNavGroup,
//     name: 'Pages',
//     icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
//     items: [
//       {
//         component: CNavItem,
//         name: 'Login',
//         to: '/login',
//       },
//       {
//         component: CNavItem,
//         name: 'Register',
//         to: '/register',
//       },
//       {
//         component: CNavItem,
//         name: 'Error 404',
//         to: '/404',
//       },
//       {
//         component: CNavItem,
//         name: 'Error 500',
//         to: '/500',
//       },
//     ],
//   },
//   {
//     component: CNavItem,
//     name: 'Docs',
//     href: 'https://coreui.io/react/docs/templates/installation/',
//     icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
//   },
// ]

// export default _nav


import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilCart,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilUser,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // },
  },
  {
    component: CNavTitle,
    name: 'Components',
  },
  {
    component: CNavGroup,
    name: 'Home',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Banner First',
        to: '/base/home-banner-first',
      },
      {
        component: CNavItem,
        name: 'Collection',
        to: '/base/collection',
      },
      {
        component: CNavItem,
        name: 'Shop By',
        to: '/base/shop-by',
      },
      {
        component: CNavItem,
        name: 'Banner Second',
        to: '/base/home-banner-second',
      },
      {
        component: CNavItem,
        name: 'Instagram',
        to: '/base/instagram',
      },
      {
        component: CNavItem,
        name: 'Brands',
        to: '/base/brands',
      },
      {
        component: CNavItem,
        name: 'News Letter',
        to: '/base/news-letter',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'About Us',
    to: '/base',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Banner',
        to: '/base/about-us-banner',
      },
      {
        component: CNavItem,
        name: 'Who are we',
        to: '/base/who-are-we',
      },
      {
        component: CNavItem,
        name: 'Our Journey',
        to: '/base/our-journey',
      },
      {
        component: CNavItem,
        name: 'Our Mission',
        to: '/base/our-mission',
      },
      {
        component: CNavItem,
        name: 'Testinomials',
        to: '/base/testimonials',
      },
    ],
  },
  // {
  //   component: CNavItem,
  //   name: 'Categories',
  //   to: '/base/categories',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Cart',
  //   to: '/charts',
  //   icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  // },
  {
    component: CNavItem,
    name: 'Products',
    to: '/products-list',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Contact Us',
    to: '/base/contact-us',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Blog',
    to: '/base/blogs',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Privacy Policy',
    to: '/base/privacy-policy',
    icon: <CIcon icon={cilExternalLink} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Terms and Conditions',
    to: '/base/terms-and-conditions',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Disclaimer',
    to: '/base/disclaimer',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Exchange policy',
    to: '/base/exchange-policy',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'International Policy',
    to: '/base/international-policy',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Magazine',
    to: '/magazine',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Image Banner',
        to: '/magazine/image-banner',
      },
      {
        component: CNavItem,
        name: 'Video Banner',
        to: '/magazine/video-banner',
      },
      {
        component: CNavItem,
        name: 'Instagram Banner',
        to: '/magazine/instagram-banner',
      },
      {
        component: CNavItem,
        name: 'Previous Editions',
        to: '/magazine/previous-editions',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Brand Details',
    to: '/brand-details',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Orders',
    to: '/orders',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Users',
    to: '/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  }
]

export default _nav
