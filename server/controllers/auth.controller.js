import * as authService from '../services/auth.service.js';

export const register = async (req, res, next) => {
    try {
        const result = await authService.registerUser(req.body);
        
        // Set refresh token in cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            success: true,
            token: result.accessToken,
            user: {
                _id: result._id,
                name: result.name,
                email: result.email
            }
        });
    } catch (error) {
        console.error('Registration Error:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUser(email, password);

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            success: true,
            token: result.accessToken,
            user: {
                _id: result._id,
                name: result.name,
                email: result.email
            }
        });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
    res.cookie('refreshToken', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ success: true, message: 'Logged out' });
};

export const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const result = await authService.refreshAccessToken(refreshToken);

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            token: result.accessToken
        });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await authService.getUserProfile(req.user._id);
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};
