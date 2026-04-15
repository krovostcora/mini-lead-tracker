import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    light: '#f0fdfa', // Light mint/turquoise
                    DEFAULT: '#0d9488', // Teal 600
                    dark: '#0f766e', // Teal 700
                },
                surface: '#f8fafc', // Slate 50
            },
        },
    },
    plugins: [],
};
export default config;