import jwt, { JwtPayload } from 'jsonwebtoken';

//const JWT_SECRET = process.env.JWT_SECRET
export function getUserFromToken(token: string): {userId: string, userName: string}
{
    // if (!JWT_SECRET) 
    // {
    //     throw new Error("JWT_SECRET is not defined in env");
    // }
    try {
    const decoded = jwt.verify(token, 'secret') as JwtPayload;
    return {userId: decoded.userId,userName: decoded.userName}
    } catch (err) {
    throw Error('Invalid Token')
    }
}
