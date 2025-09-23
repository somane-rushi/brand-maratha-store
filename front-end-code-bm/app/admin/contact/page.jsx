"use client"
import React, { useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";

const Page = () => {
    // Sample contact data
    const [contacts, setContacts] = useState([
        { id: 1, name: "John Doe", email: "john@example.com", message: "Hello!" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", message: "Need help!" },
        { id: 3, name: "Alex Brown", email: "alex@example.com", message: "Great service!" },
    ]);

    // Delete contact function
    const handleDelete = (id) => {
        setContacts(contacts.filter((contact) => contact.id !== id));
    };

    return (
        <>
            <Header />
            <div className="typ-flex-admin">
                <Sidebar />
                <div className="typ-admin-dashbord">
                    <div className="container">
                        <h3 className="mb-3">Contact Details</h3>
                        <table className="table table-bordered table-striped">
                            <thead className="table-dark">
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Message</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.length > 0 ? (
                                    contacts.map((contact) => (
                                        <tr key={contact.id}>
                                            <td>{contact.name}</td>
                                            <td>{contact.email}</td>
                                            <td>{contact.message}</td>
                                            <td>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(contact.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">
                                            No Contacts Available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Page;
