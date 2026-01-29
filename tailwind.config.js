/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#FAF7F5',  // Crema muy claro (Fondo principal)
                    100: '#F3EBE3', // Crema suave
                    200: '#E6D6C8', // Beige
                    300: '#D4BBA5',
                    400: '#BFA088',
                    500: '#8D6E63', // Chocolate con leche
                    600: '#6D4C41',
                    700: '#5D4037',
                    800: '#4E342E',
                    900: '#3E2723', // Chocolate oscuro profundo (Texto y Navbar)
                    950: '#281815', // Casi negro
                },
                accent: {
                    50: '#FCF9F0',
                    100: '#F7F1DC',
                    200: '#EDDFB4',
                    300: '#E1CA89',
                    400: '#D4A373', // Dorado elegante
                    500: '#B08968', // Bronce
                    600: '#906F52',
                },
                cream: '#FEFCF8',
            },
            fontFamily: {
                sans: ['"Outfit"', 'sans-serif'], // Moderna y limpia para UI
                serif: ['"Playfair Display"', 'serif'], // Elegante para títulos
                display: ['"Dancing Script"', 'cursive'], // Para detalles "handwritten"
            },
            backgroundImage: {
                'hero-pattern': "url('https://images.unsplash.com/photo-1623945239962-d4b97d19c122?q=80&w=2070&auto=format&fit=crop')",
                'chocolate-pattern': "url('https://www.transparenttextures.com/patterns/dark-matter.png')",
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.8s ease-out',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
