import React, { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

import './AuthForm.css';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError('');
        setMessage('');
    };

    const validationSchema = Yup.object({
        email: Yup.string().email('Neplatný email').required('Email je povinný'),
        password: Yup.string().min(6, 'Heslo musí mít alespoň 6 znaků').required('Heslo je povinné'),
        ...(isLogin
            ? {}
            : {
                  firstName: Yup.string().required('Jméno je povinné'),
                  lastName: Yup.string().required('Příjmení je povinné'),
              }),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                if (isLogin) {
                    const response = await axios.post(
                        'http://localhost:8080/api/uzivatele/prihlaseni',
                        { email: values.email, heslo: values.password }
                    );
                    setMessage('Přihlášení úspěšné');
                    if (rememberMe) localStorage.setItem('email', values.email);
                    else localStorage.removeItem('email');
                } else {
                    const response = await axios.post(
                        'http://localhost:8080/api/uzivatele/registrace',
                        {
                            email: values.email,
                            heslo: values.password,
                            jmeno: values.firstName,
                            prijmeni: values.lastName,
                        }
                    );
                    setMessage('Registrace úspěšná');
                    setIsLogin(true);
                }
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                        'Nastala neočekávaná chyba při ' + (isLogin ? 'přihlašování' : 'registraci')
                );
            } finally {
                setLoading(false);
            }
        },
    });

    const handleGoogleLoginSuccess = (response) => {
        const token = response.credential;
        axios.post("http://localhost:8080/api/uzivatele/google-prihlaseni", token)
            .then((res) => {
                console.log("Logged in successfully", res.data);
            })
            .catch((err) => {
                console.error("Error logging in", err.response?.data || err.message);
            });
    };
    
    return (
        <GoogleOAuthProvider clientId="77777548051-rtoa9vkag6k8sh1oash25haebjpj7to9.apps.googleusercontent.com">
            <div className="auth-form-container">
                <h2>{isLogin ? 'Přihlášení' : 'Registrace'}</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="error-message">{formik.errors.email}</p>
                        )}
                    </div>
                    {!isLogin && (
                        <>
                            <div>
                                <label>Jméno:</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.firstName && formik.errors.firstName && (
                                    <p className="error-message">{formik.errors.firstName}</p>
                                )}
                            </div>
                            <div>
                                <label>Příjmení:</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.lastName && formik.errors.lastName && (
                                    <p className="error-message">{formik.errors.lastName}</p>
                                )}
                            </div>
                        </>
                    )}
                    <div>
                        <label>Heslo:</label>
                        <input
                            type="password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <p className="error-message">{formik.errors.password}</p>
                        )}
                    </div>
                    {isLogin && (
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                Zapamatovat si mě
                            </label>
                        </div>
                    )}
                    {error && <p className="error-message">{error}</p>}
                    {message && <p className="success-message">{message}</p>}
                    <button type="submit" disabled={loading}>
                        {loading ? 'Načítání...' : isLogin ? 'Přihlásit se' : 'Registrovat se'}
                    </button>
                </form>

                <div className="social-login-container">
                    <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onError={() => setError('Chyba při přihlášení přes Google.')}
                    />
                </div>

                <button className="toggle-button" onClick={toggleForm}>
                    {isLogin ? 'Nemáte účet? Registrujte se' : 'Máte účet? Přihlaste se'}
                </button>
            </div>
        </GoogleOAuthProvider>
    );
};

export default AuthForm;
