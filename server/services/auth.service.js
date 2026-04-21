import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import Invitation from '../models/Invitation.model.js';
import Workspace from '../models/Workspace.model.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.utils.js';

export const registerUser = async (userData) => {
    const { name, email, password } = userData;

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password
    });

    if (user) {
        // --- Invitation Fulfillment Logic ---
        // Check for any pending invitations for this email
        const pendingInvites = await Invitation.find({ 
            email: user.email, 
            status: 'pending' 
        });

        for (const invite of pendingInvites) {
            const workspace = await Workspace.findById(invite.workspace);
            if (workspace) {
                // Add to workspace members
                workspace.members.push({ user: user._id, role: invite.role });
                await workspace.save();

                // Add to user workspaces
                await User.findByIdAndUpdate(user._id, {
                    $push: { workspaces: { workspace: workspace._id, role: invite.role } }
                });
            }
            // Mark invite as accepted
            invite.status = 'accepted';
            await invite.save();
        }
        // ------------------------------------

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            accessToken,
            refreshToken
        };
    } else {
        throw new Error('Invalid user data');
    }
};

export const loginUser = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            accessToken,
            refreshToken
        };
    } else {
        throw new Error('Invalid email or password');
    }
};

export const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new Error('Refresh token is required');
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new Error('User not found');
        }

        const accessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
};

export const getUserProfile = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};
