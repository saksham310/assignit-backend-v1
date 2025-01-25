import Mailgen from 'mailgen';
export const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: 'AssignIt',
        link: 'http://localhost:5173/',
        logo: 'https://res.cloudinary.com/dcoky4dix/image/upload/v1737071534/Logo_vjeuqf.svg' // Optional, replace with your logo URL
    }
});