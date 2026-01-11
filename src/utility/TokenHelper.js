import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

let key = process.env.JWT_SECRET_KEY;

export function EncodeToken (email, user_id) {
    let expires = {expiresIn: '24h'}
    let payload = {
        email: email,
        user_id: user_id
    }
    return jwt.sign(payload, key, expires);
}

export function DecodeToken(token) {
    try {
        return jwt.verify(token, key)
    }
    catch(e) {
        return null;
    }
}