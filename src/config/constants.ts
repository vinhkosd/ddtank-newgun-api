import * as dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const EXPIRES_TIME = process.env.EXPIRES_TIME;
export const REQUEST_URL = process.env.REQUEST_URL;
export const KEY_REQUEST = process.env.KEY_REQUEST;
export const LINK_FLASH = process.env.LINK_FLASH;
export const LINK_CONFIG = process.env.LINK_CONFIG;