import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // You can send data to backend here
        alert("Thank you for contacting us!");
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div style={{ backgroundColor: '#eaeef4', minHeight: '100vh' }}>
            <div className="container my-5" >
                <h2 className="text-center mb-4" style={{ color: '#36506B' }}>Contact Us</h2>
                <div className="row justify-content-center">
                    <div className="col-md-8 shadow p-4 bg-white rounded">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Message</label>
                                <textarea
                                    name="message"
                                    className="form-control"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn w-100"
                                style={{ backgroundColor: '#36506B', color: 'white' }}
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
