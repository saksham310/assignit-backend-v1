import Mailgen from 'mailgen';
import 'dotenv/config';
export const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: 'AssignIt',
        link: 'https://pm.gyanbazzar.com/',
        logo: 'https://res.cloudinary.com/dcoky4dix/image/upload/v1737071534/Logo_vjeuqf.svg' // Optional, replace with your logo URL
    }
});