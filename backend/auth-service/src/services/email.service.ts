// backend/auth-service/src/services/email.service.ts
/*import https from 'https';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;

if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL) {
	throw new Error('Missing SENDGRID_API_KEY or SENDGRID_FROM_EMAIL in environment variables');
}

export async function sendOtpEmail(toEmail: string, otpCode: string): Promise<boolean> {
	if (!toEmail || !otpCode) {
		throw new Error('Missing recipient email or OTP code');
	}
	const payload = JSON.stringify({
		personalizations: [{ to: [{ email: toEmail }] }],
		from: { email: SENDGRID_FROM_EMAIL },
		subject: 'Your One-Time Password (OTP)',
		content: [
			{
				type: 'text/plain',
				value: `Your OTP is: ${otpCode}. It expires in 5 minutes. Do not share this code.`,
			},
			{
				type: 'text/html',
				value: `<p>Your OTP is: <strong>${otpCode}</strong>. It expires in 5 minutes. Do not share this code.</p>`,
			},
		],
	});
	const options = {
		hostname: 'api.sendgrid.com',
		port: 443,
		path: '/v3/mail/send',
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${SENDGRID_API_KEY}`,
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(payload),
		},
	};
	return new Promise((resolve, reject) => {
		const req = https.request(options, (res) => {
			const { statusCode } = res;
			let responseData = '';
			res.on('data', (chunk) => {
				responseData += chunk;
			});
			res.on('end', () => {
			if (statusCode && statusCode >= 200 && statusCode < 300) {
				resolve(true);
			} else {
				console.error(`[SendGrid] Failed: ${statusCode} - ${responseData}`);
				resolve(false);
			}
		});
    });
	req.on('error', (err) => {
		console.error('[SendGrid] Request error:', err);
		resolve(false); // safe fallback
	});
	req.write(payload);
	req.end();
	});
}*/




/*import https from 'https';

// Load these from environment variables securely
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;

export async function sendOtpEmail(toEmail: string, otpCode: string): Promise<boolean> {
    const postData = JSON.stringify({
        personalizations: [{ to: [{ email: toEmail }] }],
        from: { email: SENDGRID_FROM_EMAIL },
        subject: 'Your One-Time Password (OTP)',
        content: [{
            type: 'text/plain',
            value: `Your OTP is: ${otpCode}. It expires in 5 minutes. Do not share this code.`
        }, {
            type: 'text/html',
            value: `<p>Your OTP is: <strong>${otpCode}</strong>. It expires in 5 minutes. Do not share this code.</p>`
        }]
    });

    const options = {
        hostname: 'api.sendgrid.com',
        port: 443,
        path: '/v3/mail/send',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'Authorization': `Bearer ${SENDGRID_API_KEY}`
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
                    // console.log('Email sent successfully:', responseBody);
                    resolve(true);
                } else {
                    console.error('Failed to send email:', res.statusCode, responseBody);
                    reject(new Error(`Email API error: ${res.statusCode} - ${responseBody}`));
                }
            });
        });

        req.on('error', (e) => {
            console.error('Email request error:', e);
            reject(e);
        });

        req.write(postData);
        req.end();
    });
}*/