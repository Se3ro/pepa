import React, { useState } from 'react';
import axios from 'axios';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);  // Stav pro přihlášení/registraci
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Funkce pro přepnutí mezi přihlášením a registrací    
    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError('');  // Vymazání chybové zprávy při přepnutí
    };

    // Funkce pro odeslání přihlašovacího nebo registračního formuláře
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                // Přihlášení
                const response = await axios.post('/api/uzivatele/prihlaseni', { email, heslo: password });
                console.log('Přihlášení úspěšné:', response.data);
                // Zde můžeš přidat přesměrování na dashboard nebo domovskou stránku
            } else {
                // Registrace
                const response = await axios.post('/api/uzivatele/registrace', { email, heslo: password });
                console.log('Registrace úspěšná:', response.data);
                // Můžeš přepnout na přihlášení po úspěšné registraci
                setIsLogin(true);
            }
        } catch (error) {
            setError('Chyba při ' + (isLogin ? 'přihlašování' : 'registraci'));
        }
    };

    return (
        <div>
            <h2>{isLogin ? 'Přihlášení' : 'Registrace'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Heslo:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">{isLogin ? 'Přihlásit se' : 'Registrovat se'}</button>
            </form>
            <button onClick={toggleForm}>
                {isLogin ? 'Nemáte účet? Registrujte se' : 'Máte účet? Přihlaste se'}
            </button>
        </div>
    );
};

export default AuthForm;
