import crypto from 'crypto';

/**
 * Validates the hash of the data received from the Telegram Mini App.
 * @param initData The raw initData string from the Telegram WebApp.
 * @param botToken The bot token from BotFather.
 */
export function validateTelegramHash(initData: string, botToken: string): boolean {
    try {
        const urlParams = new URLSearchParams(initData);
        const hash = urlParams.get('hash');
        urlParams.delete('hash');

        const dataCheckString = Array.from(urlParams.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');

        const secretKey = crypto
            .createHmac('sha256', 'WebAppData')
            .update(botToken)
            .digest();

        const calculatedHash = crypto
            .createHmac('sha256', secretKey)
            .update(dataCheckString)
            .digest('hex');

        return calculatedHash === hash;
    } catch (err) {
        return false;
    }
}
