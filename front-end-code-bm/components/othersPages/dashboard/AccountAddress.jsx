"use client";

import { useState, useEffect } from "react";
import {
    addAddress,
    fetchAddresses,
    deleteAddress,
    updateAddress,
} from "../../../utlis/apiService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function AccountAddress() {
    const [activeEdit, setactiveEdit] = useState(false);
    const [activeAdd, setactiveAdd] = useState(false);
    const [errors, setErrors] = useState({});
    const [addresses, setAddresses] = useState([]);

    const [activeEditt, setActiveEditt] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);

    const [formData, setFormData] = useState({
        user_id:
            typeof window !== "undefined" ? localStorage.getItem("id") : "",
        full_name: "",
        phone: "",
        state: "",
        street_address: "",
        city: "",
        zip_code: "",
        country: "",
    });

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        const data = await fetchAddresses(
            typeof window !== "undefined" ? localStorage.getItem("id") : ""
        );
        setAddresses(data);
    };

    // const handleEdit = (address) => {
    //   setCurrentAddress(address);
    //   setActiveEditt(true);
    // };
    const validateForm = () => {
        let newErrors = {};

        if (!formData.full_name.trim())
            newErrors.full_name = "Full Name is required.";
        if (!formData.state.trim()) newErrors.state = "State is required.";
        if (!formData.street_address.trim())
            newErrors.street_address = "Address is required.";
        if (!formData.city.trim()) newErrors.city = "City is required.";
        if (!formData.phone.trim())
            newErrors.phone = "Phone number is required.";
        else if (!/^\d{10}$/.test(formData.phone))
            newErrors.phone = "Phone must be 10 digits.";

        if (!formData.zip_code)
            newErrors.zip_code = "Zipcode is required.";
        else if (!/^\d{5,6}$/.test(formData.zip_code))
            newErrors.zip_code = "Zipcode must be 5-6 digits.";

        if (!formData.country) newErrors.country = "Please select a country.";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // const handleSubmit = async (e) => {
    //   e.preventDefault();
    //   if (!validateForm()) {
    //     return;
    //   }

    //   try {
    //     const response = await addAddress(formData);
    //     alert("Address added successfully!");
    //     setFormData({ full_name: "",phone:"", state: "", zip_code:"", street_address: "", city: "", country: "" });
    //      // Refresh the address list
    //   } catch (error) {
    //     alert("Failed to add address. Please try again.");
    //   }
    //   if (validateForm()) {
    //     console.log("Form submitted successfully", formData);
    //     setErrors({}); // Clear errors on successful submit
    //   }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        let success;
        if (currentAddress) {
            success = await updateAddress(currentAddress.id, formData);
        } else {
            success = await addAddress(formData);
        }

        if (success) {
            toast.success(
                currentAddress
                    ? "Address updated successfully!"
                    : "Address added successfully!"
            );
            setactiveEdit(false);
            setactiveAdd(false);
            setCurrentAddress(null);
            loadAddresses();
        }
    };


    const handleEdit = (address) => {
        setCurrentAddress(address);
        setFormData(address);
        setactiveEdit(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            await deleteAddress(id);
            loadAddresses();
            toast.success("Address deleted successfully");
                
        }
    };

    useEffect(() => {
        const getAddresses = async () => {
            const id =
                typeof window !== "undefined" ? localStorage.getItem("id") : "";
            const data = await fetchAddresses(id);
            setAddresses(data);
        };

        getAddresses();
    }, []);

    // const handleDelete = async (id) => {
    //   if (window.confirm("Are you sure you want to delete this address?")) {
    //     const success = await deleteAddress(id);
    //     if (success) {
    //       setAddresses(addresses.filter((address) => address.id !== id));
    //     }
    //   }
    // };

    return (
        <div className="my-account-content account-address">
            
            <div className="text-center widget-inner-address">
                {/* <ToastContainer position="top-right" autoClose={3000} /> */}
                <button
                    className="tf-btn btn-fill animate-hover-btn mt-20"
                    onClick={() => {
                        setactiveAdd(true);
                        setCurrentAddress(null);
                        setFormData({
                            user_id:
                                typeof window !== "undefined"
                                    ? localStorage.getItem("id")
                                    : "",
                            full_name: "",
                            state: "",
                            street_address: "",
                            city: "",
                            phone: "",
                            zip_code: "",
                            country: "",
                        });
                    }}
                >
                    Add New Address
                </button>
                {(activeEdit || activeAdd) && (
                    <form
                        className="show-form-address wd-form-address"
                        id="formnewAddress"
                        onSubmit={handleSubmit}
                        style={{ display: "block" }}
                    >
                        <div className="title">
                            {currentAddress
                                ? "Edit Address"
                                : "Add a new address"}
                        </div>

                        {[
                            {
                                label: "Full Name",
                                name: "full_name",
                                type: "text",
                            },
                            { label: "State", name: "state", type: "text" },
                            {
                                label: "Address",
                                name: "street_address",
                                type: "text",
                            },
                            { label: "City", name: "city", type: "text" },
                            { label: "Phone", name: "phone", type: "number" },
                            {
                                label: "Zipcode",
                                name: "zip_code",
                                type: "number",
                            },
                        ].map(({ label, name, type }) => (
                            <div className="box-field" key={name}>
                                <div className="tf-field style-1">
                                    <input
                                        className="tf-field-input tf-input"
                                        placeholder=" "
                                        type={type}
                                        id={name}
                                        name={name}
                                        value={formData[name]}
                                        onChange={handleChange}
                                    />
                                    <label
                                        className="tf-field-label fw-4 text_black-2"
                                        htmlFor={name}
                                    >
                                        {label} <span style={{ color: "red" }}>*</span>
                                    </label>
                                </div>
                                {errors[name] && (
                                    <small className="text-danger">
                                        {errors[name]}
                                    </small>
                                )}
                            </div>
                        ))}

                        <div className="box-field">
                            <label
                                htmlFor="country"
                                className="mb_10 fw-4 text-start d-block text_black-2"
                            >
                                Country/Region <span style={{ color: "red" }}>*</span>
                            </label>
                            <div className="select-custom">
                                <select
                                    className="tf-select w-100"
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                >
                                    <option value="">Select a country</option>
                                    <option value="Australia">Australia</option>
                                    <option value="Canada">Canada</option>
                                    <option value="France">France</option>
                                    <option value="Germany">Germany</option>
                                    <option value="India">India</option>
                                    <option value="United States">
                                        United States
                                    </option>
                                </select>
                            </div>
                            {errors.country && (
                                <small className="text-danger">
                                    {errors.country}
                                </small>
                            )}
                        </div>

                        <div className="d-flex align-items-center justify-content-center gap-20">
                            <button
                                type="submit"
                                className="tf-btn btn-fill animate-hover-btn"
                            >
                                {currentAddress
                                    ? "Update Address"
                                    : "Add Address"}
                            </button>
                            <span
                                className="tf-btn btn-fill animate-hover-btn btn-hide-edit-address"
                                onClick={() => {
                                    setactiveEdit(false);
                                    setactiveAdd(false);
                                }}
                            >
                                Cancel
                            </span>
                        </div>
                    </form>
                )}
                <div>
                    {addresses.map((address) => (
                        <div key={address.id} className="address-box">
                            <h6 className="mb_20">
                                {address.default ? "Default" : ""}
                            </h6>
                            <p>{address.full_name}</p>
                            <p>{address.street_address}</p>
                            <p>
                                {address.city}, {address.state},{" "}
                                {address.zip_code}
                            </p>
                            <p>{address.country}</p>
                            <p className="mb_10">{address.phone}</p>

                            <div className="d-flex gap-10 justify-content-center">
                                <button
                                    className="tf-btn btn-fill animate-hover-btn"
                                    onClick={() => handleEdit(address)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="tf-btn btn-outline animate-hover-btn"
                                    onClick={() => handleDelete(address.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* <form
                    className="edit-form-address wd-form-address"
                    id="formeditAddress"
                    onSubmit={(e) => e.preventDefault()}
                    style={
                        activeAdd ? { display: "block" } : { display: "none" }
                    }
                >
                    <div className="title">Edit address</div>
                    <div className="box-field grid-2-lg">
                        <div className="tf-field style-1">
                            <input
                                className="tf-field-input tf-input"
                                placeholder=" "
                                type="text"
                                id="firstnameEdit"
                                name="first name"
                            />
                            <label
                                className="tf-field-label fw-4 text_black-2"
                                htmlFor="firstnameEdit"
                            >
                                First name
                            </label>
                        </div>
                        <div className="tf-field style-1">
                            <input
                                className="tf-field-input tf-input"
                                placeholder=" "
                                type="text"
                                id="lastnameEdit"
                                name="last name"
                            />
                            <label
                                className="tf-field-label fw-4 text_black-2"
                                htmlFor="lastnameEdit"
                            >
                                Last name
                            </label>
                        </div>
                    </div>
                    <div className="box-field">
                        <div className="tf-field style-1">
                            <input
                                className="tf-field-input tf-input"
                                placeholder=" "
                                type="text"
                                id="companyEdit"
                                name="company"
                            />
                            <label
                                className="tf-field-label fw-4 text_black-2"
                                htmlFor="companyEdit"
                            >
                                Company
                            </label>
                        </div>
                    </div>
                    <div className="box-field">
                        <div className="tf-field style-1">
                            <input
                                className="tf-field-input tf-input"
                                placeholder=" "
                                type="text"
                                id="addressEdit"
                                name="address"
                            />
                            <label
                                className="tf-field-label fw-4 text_black-2"
                                htmlFor="addressEdit"
                            >
                                Address
                            </label>
                        </div>
                    </div>
                    <div className="box-field">
                        <div className="tf-field style-1">
                            <input
                                className="tf-field-input tf-input"
                                placeholder=" "
                                type="text"
                                id="cityEdit"
                                name="city"
                            />
                            <label
                                className="tf-field-label fw-4 text_black-2"
                                htmlFor="cityEdit"
                            >
                                City
                            </label>
                        </div>
                    </div>
                    <div className="box-field">
                        <label
                            htmlFor="countryEdit"
                            className="mb_10 fw-4 text-start d-block text_black-2"
                        >
                            Country/Region
                        </label>
                        <div className="select-custom">
                            <select
                                className="tf-select w-100"
                                id="countryEdit"
                                name="address[country]"
                                data-default=""
                            >
                                <option value="---" data-provinces="[]">
                                    ---
                                </option>
                                <option
                                    value="Australia"
                                    data-provinces="[['Australian Capital Territory','Australian Capital Territory'],['New South Wales','New South Wales'],['Northern Territory','Northern Territory'],['Queensland','Queensland'],['South Australia','South Australia'],['Tasmania','Tasmania'],['Victoria','Victoria'],['Western Australia','Western Australia']]"
                                >
                                    Australia
                                </option>
                                <option value="Austria" data-provinces="[]">
                                    Austria
                                </option>
                                <option value="Belgium" data-provinces="[]">
                                    Belgium
                                </option>
                                <option
                                    value="Canada"
                                    data-provinces="[['Alberta','Alberta'],['British Columbia','British Columbia'],['Manitoba','Manitoba'],['New Brunswick','New Brunswick'],['Newfoundland and Labrador','Newfoundland and Labrador'],['Northwest Territories','Northwest Territories'],['Nova Scotia','Nova Scotia'],['Nunavut','Nunavut'],['Ontario','Ontario'],['Prince Edward Island','Prince Edward Island'],['Quebec','Quebec'],['Saskatchewan','Saskatchewan'],['Yukon','Yukon']]"
                                >
                                    Canada
                                </option>
                                <option
                                    value="Czech Republic"
                                    data-provinces="[]"
                                >
                                    Czechia
                                </option>
                                <option value="Denmark" data-provinces="[]">
                                    Denmark
                                </option>
                                <option value="Finland" data-provinces="[]">
                                    Finland
                                </option>
                                <option value="France" data-provinces="[]">
                                    France
                                </option>
                                <option value="Germany" data-provinces="[]">
                                    Germany
                                </option>
                                <option
                                    value="Hong Kong"
                                    data-provinces="[['Hong Kong Island','Hong Kong Island'],['Kowloon','Kowloon'],['New Territories','New Territories']]"
                                >
                                    Hong Kong SAR
                                </option>
                                <option
                                    value="Ireland"
                                    data-provinces="[['Carlow','Carlow'],['Cavan','Cavan'],['Clare','Clare'],['Cork','Cork'],['Donegal','Donegal'],['Dublin','Dublin'],['Galway','Galway'],['Kerry','Kerry'],['Kildare','Kildare'],['Kilkenny','Kilkenny'],['Laois','Laois'],['Leitrim','Leitrim'],['Limerick','Limerick'],['Longford','Longford'],['Louth','Louth'],['Mayo','Mayo'],['Meath','Meath'],['Monaghan','Monaghan'],['Offaly','Offaly'],['Roscommon','Roscommon'],['Sligo','Sligo'],['Tipperary','Tipperary'],['Waterford','Waterford'],['Westmeath','Westmeath'],['Wexford','Wexford'],['Wicklow','Wicklow']]"
                                >
                                    Ireland
                                </option>
                                <option value="Israel" data-provinces="[]">
                                    Israel
                                </option>
                                <option
                                    value="Italy"
                                    data-provinces="[['Agrigento','Agrigento'],['Alessandria','Alessandria'],['Ancona','Ancona'],['Aosta','Aosta Valley'],['Arezzo','Arezzo'],['Ascoli Piceno','Ascoli Piceno'],['Asti','Asti'],['Avellino','Avellino'],['Bari','Bari'],['Barletta-Andria-Trani','Barletta-Andria-Trani'],['Belluno','Belluno'],['Benevento','Benevento'],['Bergamo','Bergamo'],['Biella','Biella'],['Bologna','Bologna'],['Bolzano','South Tyrol'],['Brescia','Brescia'],['Brindisi','Brindisi'],['Cagliari','Cagliari'],['Caltanissetta','Caltanissetta'],['Campobasso','Campobasso'],['Carbonia-Iglesias','Carbonia-Iglesias'],['Caserta','Caserta'],['Catania','Catania'],['Catanzaro','Catanzaro'],['Chieti','Chieti'],['Como','Como'],['Cosenza','Cosenza'],['Cremona','Cremona'],['Crotone','Crotone'],['Cuneo','Cuneo'],['Enna','Enna'],['Fermo','Fermo'],['Ferrara','Ferrara'],['Firenze','Florence'],['Foggia','Foggia'],['Forlì-Cesena','Forlì-Cesena'],['Frosinone','Frosinone'],['Genova','Genoa'],['Gorizia','Gorizia'],['Grosseto','Grosseto'],['Imperia','Imperia'],['Isernia','Isernia'],['L'Aquila','L’Aquila'],['La Spezia','La Spezia'],['Latina','Latina'],['Lecce','Lecce'],['Lecco','Lecco'],['Livorno','Livorno'],['Lodi','Lodi'],['Lucca','Lucca'],['Macerata','Macerata'],['Mantova','Mantua'],['Massa-Carrara','Massa and Carrara'],['Matera','Matera'],['Medio Campidano','Medio Campidano'],['Messina','Messina'],['Milano','Milan'],['Modena','Modena'],['Monza e Brianza','Monza and Brianza'],['Napoli','Naples'],['Novara','Novara'],['Nuoro','Nuoro'],['Ogliastra','Ogliastra'],['Olbia-Tempio','Olbia-Tempio'],['Oristano','Oristano'],['Padova','Padua'],['Palermo','Palermo'],['Parma','Parma'],['Pavia','Pavia'],['Perugia','Perugia'],['Pesaro e Urbino','Pesaro and Urbino'],['Pescara','Pescara'],['Piacenza','Piacenza'],['Pisa','Pisa'],['Pistoia','Pistoia'],['Pordenone','Pordenone'],['Potenza','Potenza'],['Prato','Prato'],['Ragusa','Ragusa'],['Ravenna','Ravenna'],['Reggio Calabria','Reggio Calabria'],['Reggio Emilia','Reggio Emilia'],['Rieti','Rieti'],['Rimini','Rimini'],['Roma','Rome'],['Rovigo','Rovigo'],['Salerno','Salerno'],['Sassari','Sassari'],['Savona','Savona'],['Siena','Siena'],['Siracusa','Syracuse'],['Sondrio','Sondrio'],['Taranto','Taranto'],['Teramo','Teramo'],['Terni','Terni'],['Torino','Turin'],['Trapani','Trapani'],['Trento','Trentino'],['Treviso','Treviso'],['Trieste','Trieste'],['Udine','Udine'],['Varese','Varese'],['Venezia','Venice'],['Verbano-Cusio-Ossola','Verbano-Cusio-Ossola'],['Vercelli','Vercelli'],['Verona','Verona'],['Vibo Valentia','Vibo Valentia'],['Vicenza','Vicenza'],['Viterbo','Viterbo']]"
                                >
                                    Italy
                                </option>
                                <option
                                    value="Japan"
                                    data-provinces="[['Aichi','Aichi'],['Akita','Akita'],['Aomori','Aomori'],['Chiba','Chiba'],['Ehime','Ehime'],['Fukui','Fukui'],['Fukuoka','Fukuoka'],['Fukushima','Fukushima'],['Gifu','Gifu'],['Gunma','Gunma'],['Hiroshima','Hiroshima'],['Hokkaidō','Hokkaido'],['Hyōgo','Hyogo'],['Ibaraki','Ibaraki'],['Ishikawa','Ishikawa'],['Iwate','Iwate'],['Kagawa','Kagawa'],['Kagoshima','Kagoshima'],['Kanagawa','Kanagawa'],['Kumamoto','Kumamoto'],['Kyōto','Kyoto'],['Kōchi','Kochi'],['Mie','Mie'],['Miyagi','Miyagi'],['Miyazaki','Miyazaki'],['Nagano','Nagano'],['Nagasaki','Nagasaki'],['Nara','Nara'],['Niigata','Niigata'],['Okayama','Okayama'],['Okinawa','Okinawa'],['Saga','Saga'],['Saitama','Saitama'],['Shiga','Shiga'],['Shimane','Shimane'],['Shizuoka','Shizuoka'],['Tochigi','Tochigi'],['Tokushima','Tokushima'],['Tottori','Tottori'],['Toyama','Toyama'],['Tōkyō','Tokyo'],['Wakayama','Wakayama'],['Yamagata','Yamagata'],['Yamaguchi','Yamaguchi'],['Yamanashi','Yamanashi'],['Ōita','Oita'],['Ōsaka','Osaka']]"
                                >
                                    Japan
                                </option>
                                <option
                                    value="Malaysia"
                                    data-provinces="[['Johor','Johor'],['Kedah','Kedah'],['Kelantan','Kelantan'],['Kuala Lumpur','Kuala Lumpur'],['Labuan','Labuan'],['Melaka','Malacca'],['Negeri Sembilan','Negeri Sembilan'],['Pahang','Pahang'],['Penang','Penang'],['Perak','Perak'],['Perlis','Perlis'],['Putrajaya','Putrajaya'],['Sabah','Sabah'],['Sarawak','Sarawak'],['Selangor','Selangor'],['Terengganu','Terengganu']]"
                                >
                                    Malaysia
                                </option>
                                <option value="Netherlands" data-provinces="[]">
                                    Netherlands
                                </option>
                                <option
                                    value="New Zealand"
                                    data-provinces="[['Auckland','Auckland'],['Bay of Plenty','Bay of Plenty'],['Canterbury','Canterbury'],['Chatham Islands','Chatham Islands'],['Gisborne','Gisborne'],['Hawke's Bay','Hawke’s Bay'],['Manawatu-Wanganui','Manawatū-Whanganui'],['Marlborough','Marlborough'],['Nelson','Nelson'],['Northland','Northland'],['Otago','Otago'],['Southland','Southland'],['Taranaki','Taranaki'],['Tasman','Tasman'],['Waikato','Waikato'],['Wellington','Wellington'],['West Coast','West Coast']]"
                                >
                                    New Zealand
                                </option>
                                <option value="Norway" data-provinces="[]">
                                    Norway
                                </option>
                                <option value="Poland" data-provinces="[]">
                                    Poland
                                </option>
                                <option
                                    value="Portugal"
                                    data-provinces="[['Aveiro','Aveiro'],['Açores','Azores'],['Beja','Beja'],['Braga','Braga'],['Bragança','Bragança'],['Castelo Branco','Castelo Branco'],['Coimbra','Coimbra'],['Faro','Faro'],['Guarda','Guarda'],['Leiria','Leiria'],['Lisboa','Lisbon'],['Madeira','Madeira'],['Portalegre','Portalegre'],['Porto','Porto'],['Santarém','Santarém'],['Setúbal','Setúbal'],['Viana do Castelo','Viana do Castelo'],['Vila Real','Vila Real'],['Viseu','Viseu'],['Évora','Évora']]"
                                >
                                    Portugal
                                </option>
                                <option value="Singapore" data-provinces="[]">
                                    Singapore
                                </option>
                                <option
                                    value="South Korea"
                                    data-provinces="[['Busan','Busan'],['Chungbuk','North Chungcheong'],['Chungnam','South Chungcheong'],['Daegu','Daegu'],['Daejeon','Daejeon'],['Gangwon','Gangwon'],['Gwangju','Gwangju City'],['Gyeongbuk','North Gyeongsang'],['Gyeonggi','Gyeonggi'],['Gyeongnam','South Gyeongsang'],['Incheon','Incheon'],['Jeju','Jeju'],['Jeonbuk','North Jeolla'],['Jeonnam','South Jeolla'],['Sejong','Sejong'],['Seoul','Seoul'],['Ulsan','Ulsan']]"
                                >
                                    South Korea
                                </option>
                                <option
                                    value="Spain"
                                    data-provinces="[['A Coruña','A Coruña'],['Albacete','Albacete'],['Alicante','Alicante'],['Almería','Almería'],['Asturias','Asturias Province'],['Badajoz','Badajoz'],['Balears','Balears Province'],['Barcelona','Barcelona'],['Burgos','Burgos'],['Cantabria','Cantabria Province'],['Castellón','Castellón'],['Ceuta','Ceuta'],['Ciudad Real','Ciudad Real'],['Cuenca','Cuenca'],['Cáceres','Cáceres'],['Cádiz','Cádiz'],['Córdoba','Córdoba'],['Girona','Girona'],['Granada','Granada'],['Guadalajara','Guadalajara'],['Guipúzcoa','Gipuzkoa'],['Huelva','Huelva'],['Huesca','Huesca'],['Jaén','Jaén'],['La Rioja','La Rioja Province'],['Las Palmas','Las Palmas'],['León','León'],['Lleida','Lleida'],['Lugo','Lugo'],['Madrid','Madrid Province'],['Melilla','Melilla'],['Murcia','Murcia'],['Málaga','Málaga'],['Navarra','Navarra'],['Ourense','Ourense'],['Palencia','Palencia'],['Pontevedra','Pontevedra'],['Salamanca','Salamanca'],['Santa Cruz de Tenerife','Santa Cruz de Tenerife'],['Segovia','Segovia'],['Sevilla','Seville'],['Soria','Soria'],['Tarragona','Tarragona'],['Teruel','Teruel'],['Toledo','Toledo'],['Valencia','Valencia'],['Valladolid','Valladolid'],['Vizcaya','Biscay'],['Zamora','Zamora'],['Zaragoza','Zaragoza'],['Álava','Álava'],['Ávila','Ávila']]"
                                >
                                    Spain
                                </option>
                                <option value="Sweden" data-provinces="[]">
                                    Sweden
                                </option>
                                <option value="Switzerland" data-provinces="[]">
                                    Switzerland
                                </option>
                                <option
                                    value="United Arab Emirates"
                                    data-provinces="[['Abu Dhabi','Abu Dhabi'],['Ajman','Ajman'],['Dubai','Dubai'],['Fujairah','Fujairah'],['Ras al-Khaimah','Ras al-Khaimah'],['Sharjah','Sharjah'],['Umm al-Quwain','Umm al-Quwain']]"
                                >
                                    United Arab Emirates
                                </option>
                                <option
                                    value="United Kingdom"
                                    data-provinces="[['British Forces','British Forces'],['England','England'],['Northern Ireland','Northern Ireland'],['Scotland','Scotland'],['Wales','Wales']]"
                                >
                                    United Kingdom
                                </option>
                                <option
                                    value="United States"
                                    data-provinces="[['Alabama','Alabama'],['Alaska','Alaska'],['American Samoa','American Samoa'],['Arizona','Arizona'],['Arkansas','Arkansas'],['Armed Forces Americas','Armed Forces Americas'],['Armed Forces Europe','Armed Forces Europe'],['Armed Forces Pacific','Armed Forces Pacific'],['California','California'],['Colorado','Colorado'],['Connecticut','Connecticut'],['Delaware','Delaware'],['District of Columbia','Washington DC'],['Federated States of Micronesia','Micronesia'],['Florida','Florida'],['Georgia','Georgia'],['Guam','Guam'],['Hawaii','Hawaii'],['Idaho','Idaho'],['Illinois','Illinois'],['Indiana','Indiana'],['Iowa','Iowa'],['Kansas','Kansas'],['Kentucky','Kentucky'],['Louisiana','Louisiana'],['Maine','Maine'],['Marshall Islands','Marshall Islands'],['Maryland','Maryland'],['Massachusetts','Massachusetts'],['Michigan','Michigan'],['Minnesota','Minnesota'],['Mississippi','Mississippi'],['Missouri','Missouri'],['Montana','Montana'],['Nebraska','Nebraska'],['Nevada','Nevada'],['New Hampshire','New Hampshire'],['New Jersey','New Jersey'],['New Mexico','New Mexico'],['New York','New York'],['North Carolina','North Carolina'],['North Dakota','North Dakota'],['Northern Mariana Islands','Northern Mariana Islands'],['Ohio','Ohio'],['Oklahoma','Oklahoma'],['Oregon','Oregon'],['Palau','Palau'],['Pennsylvania','Pennsylvania'],['Puerto Rico','Puerto Rico'],['Rhode Island','Rhode Island'],['South Carolina','South Carolina'],['South Dakota','South Dakota'],['Tennessee','Tennessee'],['Texas','Texas'],['Utah','Utah'],['Vermont','Vermont'],['Virgin Islands','U.S. Virgin Islands'],['Virginia','Virginia'],['Washington','Washington'],['West Virginia','West Virginia'],['Wisconsin','Wisconsin'],['Wyoming','Wyoming']]"
                                >
                                    United States
                                </option>
                                <option value="Vietnam" data-provinces="[]">
                                    Vietnam
                                </option>
                            </select>
                        </div>
                    </div>
                    <div className="box-field">
                        <div className="tf-field style-1">
                            <input
                                className="tf-field-input tf-input"
                                placeholder=" "
                                type="text"
                                id="province"
                                name="province"
                            />
                            <label
                                className="tf-field-label fw-4 text_black-2"
                                htmlFor="province"
                            >
                                Province
                            </label>
                        </div>
                    </div>
                    <div className="box-field">
                        <div className="tf-field style-1">
                            <input
                                className="tf-field-input tf-input"
                                placeholder=" "
                                type="text"
                                id="AddressZipNew"
                                name="AddressZipNew"
                            />
                            <label
                                className="tf-field-label fw-4 text_black-2"
                                htmlFor="AddressZipNew"
                            >
                                Postal/ZIP code
                            </label>
                        </div>
                    </div>
                    <div className="box-field">
                        <div className="tf-field style-1">
                            <input
                                className="tf-field-input tf-input"
                                placeholder=" "
                                type="text"
                                id="phone"
                                name="phone"
                            />
                            <label
                                className="tf-field-label fw-4 text_black-2"
                                htmlFor="phone"
                            >
                                Phone
                            </label>
                        </div>
                    </div>
                    <div className="box-field text-start">
                        <div className="box-checkbox fieldset-radio d-flex align-items-center gap-8">
                            <input
                                type="checkbox"
                                id="check-edit-address"
                                className="tf-check"
                            />
                            <label
                                htmlFor="check-edit-address"
                                className="text_black-2 fw-4"
                            >
                                Set as default address.
                            </label>
                        </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-20">
                        <button
                            type="button"
                            className="tf-btn btn-fill animate-hover-btn"
                        >
                            Update address
                        </button>
                        <span
                            className="tf-btn btn-fill animate-hover-btn btn-hide-edit-address"
                            onClick={() => setactiveAdd(false)}
                        >
                            Cancel
                        </span>
                    </div>
                </form> */}
            </div>
        </div>
    );
}

