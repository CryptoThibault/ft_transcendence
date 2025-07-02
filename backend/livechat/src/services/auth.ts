import jwt, { JwtPayload } from 'jsonwebtoken';

//const JWT_SECRET = process.env.JWT_SECRET
export function getUsernameFromToken(token: string): string
{
    // if (!JWT_SECRET) 
    // {
    //     throw new Error("JWT_SECRET is not defined in env");
    // }
    try {
    const decoded = jwt.verify(token, 'secret') as JwtPayload;
    return decoded.userName
    } catch (err) {
    throw Error('Invalid Token')
    }
}
