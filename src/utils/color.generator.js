export const generateColor = () => {
    const hue = Math.floor(Math.random() * 360); // Random hue (0-359)
    const saturation = 65 + Math.floor(Math.random() * 15); // 65-80% saturation
    const lightness = 50 + Math.floor(Math.random() * 10); // 50-60% lightness

    return hslToHex(hue, saturation, lightness);
}

const hslToHex = (h, s, l) => {
    s /= 100;
    l /= 100;

    const f = (n) => {
        const k = (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
        return Math.round(255 * c).toString(16).padStart(2, '0');
    };

    return `#${f(0)}${f(8)}${f(4)}`;
}