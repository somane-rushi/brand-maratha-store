import React, { useEffect, useState } from 'react'
import classNames from 'classnames'

import {
  // CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  // CCardHeader,
  CCol,
  CProgress,
  CRow,
  CSpinner,
  // CTable,
  // CTableBody,
  // CTableDataCell,
  // CTableHead,
  // CTableHeaderCell,
  // CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  // cibCcAmex,
  // cibCcApplePay,
  // cibCcMastercard,
  // cibCcPaypal,
  // cibCcStripe,
  // cibCcVisa,
  // cibGoogle,
  // cibFacebook,
  // cibLinkedin,
  // cifBr,
  // cifEs,
  // cifFr,
  // cifIn,
  // cifPl,
  // cifUs,
  // cibTwitter,
  cilCloudDownload,
  // cilPeople,
  // cilUser,
  // cilUserFemale,
} from '@coreui/icons'

// import avatar1 from 'src/assets/images/avatars/1.jpg'
// import avatar2 from 'src/assets/images/avatars/2.jpg'
// import avatar3 from 'src/assets/images/avatars/3.jpg'
// import avatar4 from 'src/assets/images/avatars/4.jpg'
// import avatar5 from 'src/assets/images/avatars/5.jpg'
// import avatar6 from 'src/assets/images/avatars/6.jpg'

// import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import axiosInstance from '../../config/axios.config';
import { _allorders_get, _allproducts_get, _blogs_get, _categories_get, _brands_get, _userslist_get } from '../../config/api.endpoints';

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filterType, setFilterType] = useState("Month");
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [
          usersRes,
          ordersRes,
          productsRes,
          brandsRes,
          categoriesRes,
          blogsRes
        ] = await Promise.all([
          axiosInstance.get(_userslist_get),
          axiosInstance.get(_allorders_get),
          axiosInstance.get(_allproducts_get),
          axiosInstance.get(_brands_get),
          axiosInstance.get(_categories_get),
          axiosInstance.get(_blogs_get),
        ]);
        setUsers(usersRes.data);
        setOrders(ordersRes.data);
        setProducts(productsRes.data.data);
        setBrands(brandsRes.data);
        setCategories(categoriesRes.data);
        setBlogs(blogsRes.data);
      } catch (err) {
        setError(
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          'Something went wrong!'
        );
      } finally {
        setIsLoading(false);
      }
    })()
  }, []);

  const handleFilterChange = (type) => {
    setFilterType(type);

    if (type === "Month") {
      setSelectedMonth(new Date().getMonth() + 1);
    } else if (type === "Day") {
      setSelectedDay(new Date().getDate());
    } else if (type === "Year") {
      setSelectedYear(new Date().getFullYear());
    }
  };

  const getOrderStats = () => {
    const orderStats = { delivered: 0, pending: 0, cancelled: 0 };
    let totalOrders = 0;

    orders.forEach((order) => {
      const date = new Date(order.created_at);
      const orderMonth = date.getMonth() + 1;
      const orderDay = date.getDate();
      const orderYear = date.getFullYear();

      let isMatch = false;
      if (filterType === "Month" && orderMonth === selectedMonth) {
        isMatch = true;
      } else if (filterType === "Day" && orderDay === selectedDay) {
        isMatch = true;
      } else if (filterType === "Year" && orderYear === selectedYear) {
        isMatch = true;
      }

      if (isMatch) {
        orderStats[order.status] = (orderStats[order.status] || 0) + 1;
        totalOrders++;
      }
    });

    return [
      { title: "Delivered", value: orderStats.delivered, percent: totalOrders ? (orderStats.delivered / totalOrders) * 100 : 0, color: "success" },
      { title: "Pending", value: orderStats.pending, percent: totalOrders ? (orderStats.pending / totalOrders) * 100 : 0, color: "warning" },
      { title: "Cancelled", value: orderStats.cancelled, percent: totalOrders ? (orderStats.cancelled / totalOrders) * 100 : 0, color: "danger" },
    ];
  };

  const filteredProgressData = getOrderStats();

  if (isLoading) return <CSpinner color="primary" className="d-block mx-auto my-5" />;
  if (error) return <div className="d-block mx-auto my-5">{error}</div>
  return (
    <>
      <WidgetsDropdown
        users={users}
        orders={orders}
        products={products}
        brands={brands}
        categories={categories}
        blogs={blogs}
      />
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">Orders Status</h4>
              <div className="small text-body-secondary">
                {filterType === "Day" && `Orders on ${selectedMonth}/${selectedDay}/${selectedYear}`}
                {filterType === "Month" && `Orders in ${selectedMonth}/${selectedYear}`}
                {filterType === "Year" && `Orders in ${selectedYear}`}
              </div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButtonGroup className="float-end me-3">
                {['Day', 'Month', 'Year'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={value === filterType}
                    onClick={() => handleFilterChange(value)}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          <MainChart orders={orders} filterType={filterType} />
        </CCardBody>
        <CCardFooter>
          <CRow
            xs={{ cols: 1, gutter: 4 }}
            sm={{ cols: 2 }}
            lg={{ cols: 4 }}
            xl={{ cols: 5 }}
            className="mb-2 justify-content-center text-center"
          >
            {Array.isArray(filteredProgressData) &&
              filteredProgressData.map((item, index, items) => (
                <CCol
                  className={classNames({
                    "d-none d-xl-block": index + 1 === items.length,
                  })}
                  key={index}
                >
                  <div className="text-body-secondary">{item.title}</div>
                  <div className="fw-semibold text-truncate">
                    {item.value} ({item.percent.toFixed(1)}%)
                  </div>
                  <CProgress thin className="mt-2" color={item.color} value={item.percent} />
                </CCol>
              ))}
          </CRow>
        </CCardFooter>
      </CCard>
      {/* <WidgetsBrand className="mb-4" withCharts />
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Traffic {' & '} Sales</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-info py-1 px-3">
                        <div className="text-body-secondary text-truncate small">New Clients</div>
                        <div className="fs-5 fw-semibold">9,123</div>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">
                          Recurring Clients
                        </div>
                        <div className="fs-5 fw-semibold">22,643</div>
                      </div>
                    </CCol>
                  </CRow>
                  <hr className="mt-0" />
                  {progressGroupExample1.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                      <div className="progress-group-prepend">
                        <span className="text-body-secondary small">{item.title}</span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="info" value={item.value1} />
                        <CProgress thin color="danger" value={item.value2} />
                      </div>
                    </div>
                  ))}
                </CCol>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">Pageviews</div>
                        <div className="fs-5 fw-semibold">78,623</div>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">Organic</div>
                        <div className="fs-5 fw-semibold">49,123</div>
                      </div>
                    </CCol>
                  </CRow>

                  <hr className="mt-0" />

                  {progressGroupExample2.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                      <div className="progress-group-header">
                        <CIcon className="me-2" icon={item.icon} size="lg" />
                        <span>{item.title}</span>
                        <span className="ms-auto fw-semibold">{item.value}%</span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="warning" value={item.value} />
                      </div>
                    </div>
                  ))}

                  <div className="mb-5"></div>

                  {progressGroupExample3.map((item, index) => (
                    <div className="progress-group" key={index}>
                      <div className="progress-group-header">
                        <CIcon className="me-2" icon={item.icon} size="lg" />
                        <span>{item.title}</span>
                        <span className="ms-auto fw-semibold">
                          {item.value}{' '}
                          <span className="text-body-secondary small">({item.percent}%)</span>
                        </span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="success" value={item.percent} />
                      </div>
                    </div>
                  ))}
                </CCol>
              </CRow>

              <br />

              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">User</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Country
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Usage</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Payment Method
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Activity</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tableExample.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.user.name}</div>
                        <div className="small text-body-secondary text-nowrap">
                          <span>{item.user.new ? 'New' : 'Recurring'}</span> | Registered:{' '}
                          {item.user.registered}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={item.country.flag} title={item.country.name} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex justify-content-between text-nowrap">
                          <div className="fw-semibold">{item.usage.value}%</div>
                          <div className="ms-3">
                            <small className="text-body-secondary">{item.usage.period}</small>
                          </div>
                        </div>
                        <CProgress thin color={item.usage.color} value={item.usage.value} />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={item.payment.icon} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-body-secondary text-nowrap">Last login</div>
                        <div className="fw-semibold text-nowrap">{item.activity}</div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow> */}
    </>
  )
}

export default Dashboard
