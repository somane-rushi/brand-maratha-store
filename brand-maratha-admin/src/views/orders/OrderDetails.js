import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  CCard,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
  CSpinner,
  CButton,
  CAlert,
} from '@coreui/react'
import axios from 'axios'
import axiosInstance from '../../config/axios.config'
import { _addressbyid_get, _order_get, _userbyid_get } from '../../config/api.endpoints'
import { useParams } from 'react-router-dom'
import { handleApiError } from '../../utils/errorHelper'

const OrderDetails = () => {
  const { id } = useParams()
  const [order, setOrder] = useState({})
  const [user, setUser] = useState({})
  const [isLoading, setIsLoading] = useState()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showShipmentModal, setShowShipmentModal] = useState(false)
  const { address } = order || {};

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('')
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [error])

  // useEffect(() => {
  //   (async () => {
  //     setIsLoading(true)
  //     setError('')

  //     try {
  //       const { data: orderData } = await axiosInstance.get(`${_order_get}/${id}`)

  //       setOrder(orderData)

  //       if (orderData?.address_id || orderData?.user_id) {
  //         const [addressRes, userRes] = await Promise.all([
  //           orderData?.address_id
  //             ? axiosInstance.get(`${_addressbyid_get}/${orderData.address_id}`)
  //             : Promise.resolve({ data: null }),

  //           orderData?.user_id
  //             ? axiosInstance.get(`${_userbyid_get}?id=${orderData.user_id}`)
  //             : Promise.resolve({ data: null }),
  //         ])

  //         setAddress(addressRes.data)
  //         setUser(userRes.data)
  //       }
  //     } catch (err) {
  //       setError(handleApiError(err))
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   })()
  // }, [id])

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsLoading(true);
      setError('');

      try {
        const { data: orderData } = await axiosInstance.get(`${_order_get}/${id}`);
        setOrder(orderData);

        if (orderData?.user_id) {
          const { data: userData } = await axiosInstance.get(`${_userbyid_get}?id=${orderData.user_id}`);
          setUser(userData);
        }
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const subtotal = order?.order_products?.reduce(
    (acc, product) => acc + (Number(product.quantity) * Number(product.price) || 0),
    0,
  )

  const taxRate = 0.1
  const taxAmount = subtotal * taxRate
  const grandTotal = subtotal + taxAmount
  const awb = order?.courier_tracking_id

  useEffect(() => {
    if (order?.order_products?.length > 0) {
      const product = order.order_products[0]
      const brand = product.brand || {}

      setShipmentForm((prev) => ({
        ...prev,
        // ── PickupDetails ─────────────────────────────
        PickupAddress: brand.pickup_address || '',
        PickupCity: brand.pickup_city || '',
        PickupEmail: brand.contact_email || '',
        PickupName: brand.brand_name || '',
        PickupPincode: brand.pickup_pincode || '',
        PickupState: brand.pickup_state || '',
        PickupPhone: brand.contact_phone || '',
        PickupVendorCode: brand.pickup_vendor_code || '',

        // ── GST / HSN ────────────────────────────────
        HSNCode: product.hsn_code || '',
        ProductDesc: product.name || '',
        SellerPincode: brand.pickup_pincode || '',
        SellerName: brand.brand_name || '',
      }))
    }
  }, [order])

  const [shipmentForm, setShipmentForm] = useState({
    // ── PickupDetails ───────────────────────────────
    PickupAddress: '',
    PickupCity: '',
    PickupEmail: '',
    PickupName: '',
    PickupPincode: '',
    PickupState: '',
    PickupPhone: '',
    PickupVendorCode: '',
    // ── GST / HSN ───────────────────────────────────
    BuyerGSTRegNumber: '',
    SellerPincode: '',
    SellerName: '',
    ProductCategory: '',
    ProductDesc: '',
    HSNCode: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setShipmentForm((prev) => ({ ...prev, [name]: value }))
  }
  const dropAddress = {
    Address: order?.address?.street_address,
    City: order?.address?.city,
    EmailID: user.email,
    Name: order?.address?.full_name,
    PinCode: order?.address?.zip_code,
    State: order?.address?.state,
    Type: 'Primary',
    Phone: order?.address?.phone,
  }
  console.log(dropAddress)

  const handleCreateShipment = async () => {
    const dropAddress = {
      Address: order?.address?.street_address,
      City: order?.address?.city,
      EmailID: user.email,
      Name: order?.address?.full_name,
      PinCode: order?.address?.zip_code,
      State: order?.address?.state,
      Type: 'Primary',
    }
    console.log(dropAddress)

    const dropContact = {
      PhoneNo: order?.address?.phone,
      Type: 'Primary',
      VirtualNumber: null,
    }
    const payload = {
      AirWayBillNO: order?.courier_tracking_id,
      BusinessAccountName: 'BRANDMARATHA',
      OrderNo: order?.id,
      SubOrderNo: order?.id,
      OrderType: 'PrePaid',
      CollectibleAmount: '0',
      DeclaredValue: order.total_price,
      PickupType: 'Vendor',
      Quantity: '1',
      ServiceType: 'SD',
      DropDetails: {
        Addresses: [dropAddress],
        ContactDetails: [dropContact],
      },
      PickupDetails: {
        Addresses: [
          {
            Address: shipmentForm.PickupAddress,
            City: shipmentForm.PickupCity,
            EmailID: shipmentForm.PickupEmail,
            Name: shipmentForm.PickupName,
            PinCode: shipmentForm.PickupPincode,
            State: shipmentForm.PickupState,
            Type: 'Primary',
          },
        ],
        ContactDetails: [
          {
            PhoneNo: shipmentForm.PickupPhone,
            Type: 'Primary',
          },
        ],
        PickupVendorCode: shipmentForm.PickupVendorCode,
      },
      RTODetails: {
        Addresses: [
          {
            Address: shipmentForm.PickupAddress,
            City: shipmentForm.PickupCity,
            EmailID: shipmentForm.PickupEmail,
            Name: shipmentForm.PickupName,
            PinCode: shipmentForm.PickupPincode,
            State: shipmentForm.PickupState,
            Type: 'Primary',
          },
        ],
        ContactDetails: [
          {
            PhoneNo: shipmentForm.PickupPhone,
            Type: 'Primary',
          },
        ],
      },
      GSTMultiSellerInfo: [
        {
          //BuyerGSTRegNumber: shipmentForm.BuyerGSTRegNumber,
          SellerAddress: shipmentForm.PickupAddress,
          SellerGSTRegNumber: shipmentForm.BuyerGSTRegNumber,
          SellerName: shipmentForm.SellerName,
          SellerPincode: shipmentForm.SellerPincode,
          HSNDetails: [
            {
              ProductCategory: shipmentForm.ProductCategory,
              ProductDesc: shipmentForm.ProductDesc,
              HSNCode: shipmentForm.HSNCode,
            },
          ],
        },
      ],
    }
    console.log('Shipment Payload', payload)

    try {
      const res = await axiosInstance.post(`/shipment/create-shipment`, payload, {
        headers: { 'Content-Type': 'application/json' },
      })

      const data = res.data // axios response body is in data

      if (data.ReturnCode === 100) {
        toast.success('Shipment Created')
        setShowShipmentModal(false)
      } else {
        toast.error(data.message || 'Failed to create shipment')
      }
    } catch (err) {
      console.error(err)
      toast.error('Server error')
    }
  }

  const generateInvoice = () => {
    if (!order || !order.id) {
      alert('Invoice cannot be generated. Order data is missing.')
      return
    }

    const subtotal = order?.order_products?.reduce(
      (acc, product) => acc + (Number(product.quantity) * Number(product.total_price) || 0),
      0,
    )

    const taxRate = 0.1
    const taxAmount = subtotal * taxRate
    const grandTotal = subtotal + taxAmount

    const invoiceHTML = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; }
          .invoice-container { max-width: 800px; margin: auto; padding: 20px; border: 1px solid #ddd; background: white; }
          .header { display: flex; justify-content: space-between; align-items: center; background: #003366; color: white; padding: 10px; }
          .invoice-title { font-size: 24px; font-weight: bold; }
          .details-table, .products-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .details-table td, .products-table th, .products-table td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; }
          .products-table th { background: #003366; color: white; }
          .total-section { margin-top: 20px; padding: 10px; background: #f1f1f1; border: 1px solid #ddd; }
          .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 16px; }
          .grand-total { font-size: 20px; font-weight: bold; color: #003366; }
          .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #555; }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div>
              <h2 class="invoice-title">INVOICE</h2>
              <p><strong>Invoice Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
              <p><strong>Invoice No:</strong> ${order.id}</p>
            </div>
            <div>
              <p><strong>BRAND MARATHA</strong></p>
              <p>Email: contact@yourcompany.com</p>
            </div>
          </div>
          
          <h3>Customer & Order Details</h3>
          <table class="details-table">
            <tr><td><strong>Name</strong></td><td>${user.name}</td></tr>
            <tr><td><strong>E-Mail</strong></td><td>${user.email}</td></tr>
            <tr><td><strong>Courier:</strong></td><td>${order.courier} - ${order.courier_description}</td></tr>
            <tr><td><strong>Status:</strong></td><td>${order.status.toUpperCase()}</td></tr>
          </table>
  
          <h3>Shipping Address</h3>
          <table class="details-table">
            <tr><td><strong>Name:</strong></td><td>${address?.full_name || 'N/A'}</td></tr>
            <tr><td><strong>Phone:</strong></td><td>${address.phone || 'N/A'}</td></tr>
            <tr>
              <td><strong>Shipping Address:</strong></td>
              <td>
                ${address.street_address || 'N/A'},<br>
                ${address.city || 'N/A'}, ${address.state || 'N/A'},<br>
                ${address.country || 'N/A'} - ${address.zip_code || 'N/A'}
              </td>
            </tr>
          </table>
  
          <h3>Ordered Products</h3>
          <table class="products-table">
            <tr>
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Size</th>
              <th>Color</th>
              <th>Total Price</th>
            </tr>
            ${order?.order_products?.length > 0
        ? order.order_products
          .map(
            (product) => `
                    <tr>
                      <td>${product.product_id}</td>
                      <td>${product.quantity}</td>
                      <td>${product.size || 'N/A'}</td>
                      <td>${product.color || 'N/A'}</td>
                      <td>Rs. ${Number(product.total_price || 0).toFixed(2)}</td>
                    </tr>
                  `,
          )
          .join('')
        : `<tr><td colspan="6">No products found</td></tr>`
      }
          </table>
          
          <div class="total-section">
            <div class="total-row">
              <span><strong>Subtotal:</strong></span>
              <span>Rs. ${Number(subtotal || 0).toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span><strong>Tax (10%):</strong></span>
              <span>Rs. ${Number(taxAmount || 0).toFixed(2)}</span>
            </div>
            <div class="total-row grand-total">
              <span><strong>Grand Total:</strong></span>
              <span>Rs. ${Number(grandTotal || 0).toFixed(2)}</span>
            </div>
          </div>
  
          <div class="footer">Thank you for your business!</div>
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `

    const invoiceWindow = window.open('', '_blank')
    if (invoiceWindow) {
      invoiceWindow.document.write(invoiceHTML)
      invoiceWindow.document.close()
    } else {
      alert('Popup blocked! Please allow popups and try again.')
    }
  }

  if (isLoading) return <CSpinner color="primary" />
  if (error) return <CAlert color="danger">{error}</CAlert>

  const cancelShipment = async (ShippingID, CancellationReason) => {
    try {
      const response = await axiosInstance.post(
        `/shipment/cancel-shipment`,
        {
          ShippingID,
          CancellationReason,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      return response
    } catch (error) {
      console.error('Cancel shipment error:', error)
      return null
    }
  }

  const handleCancel = async () => {
    const shippingID = awb
    const reason = prompt('Enter cancellation reason:')

    if (!reason) {
      alert('Cancellation reason is required.')
      return
    }

    setLoading(true)

    try {
      const result = await cancelShipment(shippingID, reason)

      if (result?.data?.ReturnCode === 100) {
        toast.success('Shipment canceled successfully.')
      } else {
        toast.error('Cancellation failed: ' + result?.data?.ReturnMessage)
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <ToastContainer position="top-right" autoClose={3000} />
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Order Details</strong>
              <CButton color="primary" onClick={generateInvoice}>
                Invoice
              </CButton>
              <CButton color="primary" onClick={() => setShowShipmentModal(true)}>
                Create Shipment
              </CButton>
              <CModal
                visible={showShipmentModal}
                onClose={() => setShowShipmentModal(false)}
                size="lg"
              >
                <CModalHeader>
                  <CModalTitle>Create Shipment</CModalTitle>
                </CModalHeader>

                <CModalBody>
                  <CForm className="row g-3">
                    {/* ------ Pickup Details ------ */}
                    <CCol md={12}>
                      <CFormLabel>Pickup Address</CFormLabel>
                      <CFormInput
                        name="PickupAddress"
                        value={shipmentForm.PickupAddress}
                        onChange={handleChange}
                      />
                    </CCol>

                    <CCol md={4}>
                      <CFormLabel>City</CFormLabel>
                      <CFormInput
                        name="PickupCity"
                        value={shipmentForm.PickupCity}
                        onChange={handleChange}
                      />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>State</CFormLabel>
                      <CFormInput
                        name="PickupState"
                        value={shipmentForm.PickupState}
                        onChange={handleChange}
                      />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Pincode</CFormLabel>
                      <CFormInput
                        name="PickupPincode"
                        value={shipmentForm.PickupPincode}
                        onChange={handleChange}
                      />
                    </CCol>

                    <CCol md={6}>
                      <CFormLabel>Contact Name</CFormLabel>
                      <CFormInput
                        name="PickupName"
                        value={shipmentForm.PickupName}
                        onChange={handleChange}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel>Contact Phone</CFormLabel>
                      <CFormInput
                        name="PickupPhone"
                        value={shipmentForm.PickupPhone}
                        onChange={handleChange}
                      />
                    </CCol>

                    <CCol md={6}>
                      <CFormLabel>Contact Email</CFormLabel>
                      <CFormInput
                        name="PickupEmail"
                        value={shipmentForm.PickupEmail}
                        onChange={handleChange}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel>Pickup Vendor Code</CFormLabel>
                      <CFormInput
                        name="PickupVendorCode"
                        value={shipmentForm.PickupVendorCode}
                        onChange={handleChange}
                      />
                    </CCol>

                    {/* ------ GST / HSN ------ */}
                    <CCol md={6}>
                      <CFormLabel>Seller GST.</CFormLabel>
                      <CFormInput
                        name="BuyerGSTRegNumber"
                        value={shipmentForm.BuyerGSTRegNumber}
                        onChange={handleChange}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel>Seller Pincode</CFormLabel>
                      <CFormInput
                        name="SellerPincode"
                        value={shipmentForm.SellerPincode}
                        onChange={handleChange}
                      />
                    </CCol>

                    <CCol md={4}>
                      <CFormLabel>Product Category</CFormLabel>
                      <CFormInput
                        name="ProductCategory"
                        value={shipmentForm.ProductCategory}
                        onChange={handleChange}
                      />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Product Description</CFormLabel>
                      <CFormInput
                        name="ProductDesc"
                        value={shipmentForm.ProductDesc}
                        onChange={handleChange}
                      />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>HSN Code</CFormLabel>
                      <CFormInput
                        name="HSNCode"
                        value={shipmentForm.HSNCode}
                        onChange={handleChange}
                      />
                    </CCol>
                  </CForm>
                </CModalBody>

                <CModalFooter>
                  <CButton color="secondary" onClick={() => setShowShipmentModal(false)}>
                    Cancel
                  </CButton>
                  <CButton color="primary" onClick={handleCreateShipment}>
                    Submit
                  </CButton>
                </CModalFooter>
              </CModal>
              <CButton color="primary" onClick={handleCancel} disabled={loading}>
                {loading ? 'Cancelling...' : 'Cancel Order'}
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md={6}>
                  <strong>Order ID:</strong> {order.id}
                </CCol>
                <CCol md={6}>
                  <strong>Name:</strong> {user.name}
                </CCol>
                <CCol md={6}>
                  <strong>E-Mail:</strong> {user.email}
                </CCol>
                <CCol md={6}>
                  <strong>Status:</strong>
                  <CBadge
                    className="ms-2"
                    color={
                      order?.status?.toLowerCase() === 'pending'
                        ? 'warning'
                        : order?.status?.toLowerCase() === 'delivered'
                          ? 'success'
                          : order?.status?.toLowerCase() === 'cancelled'
                            ? 'danger'
                            : 'secondary'
                    }
                  >
                    {order?.status}
                  </CBadge>
                </CCol>
                <CCol md={6}>
                  <strong>Courier:</strong> {order.courier}
                </CCol>
                <CCol md={6}>
                  <strong>Delivery:</strong> {order.courier_description}
                </CCol>
                <CCol md={6}>
                  <strong>Ordered On:</strong> {new Date(order.created_at).toLocaleString()}
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>

          {/* Address Section */}
          <CCard className="mt-4">
            <CCardHeader>
              <strong>Shipping Address</strong>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md={6}>
                  <strong>Full Name:</strong> {address?.full_name}
                </CCol>
                <CCol md={6}>
                  <strong>Phone:</strong> {address?.phone}
                </CCol>
                <CCol md={12}>
                  <strong>Street Address:</strong> {address?.street_address}
                </CCol>
                <CCol md={6}>
                  <strong>City:</strong> {address?.city}
                </CCol>
                <CCol md={6}>
                  <strong>State:</strong> {address?.state}
                </CCol>
                <CCol md={6}>
                  <strong>Zip Code:</strong> {address?.zip_code}
                </CCol>
                <CCol md={6}>
                  <strong>Country:</strong> {address?.country}
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>

          <CCard className="mt-4">
            <CCardHeader>
              <strong>Ordered Products</strong>
            </CCardHeader>
            <CCardBody>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Product ID</CTableHeaderCell>
                    <CTableHeaderCell>Quantity</CTableHeaderCell>
                    <CTableHeaderCell>Size</CTableHeaderCell>
                    <CTableHeaderCell>Color</CTableHeaderCell>
                    <CTableHeaderCell>Total Price</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {order?.order_products?.map((product, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{product.product_id}</CTableDataCell>
                      <CTableDataCell>{product.quantity}</CTableDataCell>
                      <CTableDataCell>{product.size || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{product.color || 'N/A'}</CTableDataCell>
                      <CTableDataCell>
                        Rs. {Number(product.price || 0).toFixed(2)}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              <div className="mt-4 p-3 bg-light">
                <div className="d-flex justify-content-between py-2">
                  <span>
                    <strong>Subtotal:</strong>
                  </span>
                  <span>Rs. {Number(subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between py-2">
                  <span>
                    <strong>Tax (10%):</strong>
                  </span>
                  <span>Rs. {Number(taxAmount || 0).toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between py-2 grand-total">
                  <span className="text-primary fw-bold fs-5">Grand Total:</span>
                  <span className="text-primary fw-bold fs-5">
                    Rs. {Number(grandTotal || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default OrderDetails
