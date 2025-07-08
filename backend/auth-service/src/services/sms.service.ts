// backend/auth-service/src/services/sms.service.ts
/*import https from 'https';
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

export async function sendSmsOtp(toPhoneNumber: string, otpCode: string): Promise<boolean> {
    const messageBody = `Your OTP is: ${otpCode}. It expires in 5 minutes.`;
    const postData = JSON.stringify({
        To: toPhoneNumber,
        From: TWILIO_PHONE_NUMBER,
        Body: messageBody
    });
    const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');
    const options = {
        hostname: 'api.twilio.com',
        port: 443,
        path: `/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData),
            'Authorization': `Basic ${auth}`
        }
    };
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => {
                responseBody += chunk;
            });
            res.on('end', () => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    // console.log('SMS sent successfully:', responseBody);
                    resolve(true);
                } else {
                    console.error('Failed to send SMS:', res.statusCode, responseBody);
                    reject(new Error(`SMS API error: ${res.statusCode} - ${responseBody}`));
                }
            });
        });
        req.on('error', (e) => {
            console.error('SMS request error:', e);
            reject(e);
        });
        const formData = new URLSearchParams();
        formData.append('To', toPhoneNumber);
        formData.append('From', TWILIO_PHONE_NUMBER);
        formData.append('Body', messageBody);
        req.write(formData.toString());
        req.end();
    });
}*/