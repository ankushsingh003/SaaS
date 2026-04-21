import Workspace from '../models/Workspace.model.js';
import User from '../models/User.model.js';
import Invitation from '../models/Invitation.model.js';
import * as mailService from './mail.service.js';
import slugify from 'slugify';
import crypto from 'crypto';

export const createWorkspace = async (workspaceData, userId) => {
    const { name } = workspaceData;

    const slug = slugify(name, { lower: true });
    
    // Check if slug exists
    const existingWorkspace = await Workspace.findOne({ slug });
    if (existingWorkspace) {
        throw new Error('Workspace name already taken (slug must be unique)');
    }

    const workspace = await Workspace.create({
        name,
        slug,
        owner: userId,
        members: [{ user: userId, role: 'owner' }]
    });

    // Add workspace to user
    await User.findByIdAndUpdate(userId, {
        $push: { workspaces: { workspace: workspace._id, role: 'owner' } }
    });

    return workspace;
};

export const getUserWorkspaces = async (userId) => {
    const user = await User.findById(userId).populate('workspaces.workspace');
    return user.workspaces;
};

export const getWorkspaceById = async (workspaceId, userId) => {
    const workspace = await Workspace.findById(workspaceId).populate('members.user', 'name email');
    if (!workspace) {
        throw new Error('Workspace not found');
    }

    // Check if user is a member
    const isMember = workspace.members.some(m => m.user._id.toString() === userId.toString());
    if (!isMember) {
        throw new Error('Not authorized to access this workspace');
    }

    return workspace;
};

export const addMember = async (workspaceId, email, role = 'member', inviterId) => {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) throw new Error('Workspace not found');

    const user = await User.findOne({ email: email.toLowerCase() });
    
    // 1. If user exists, add them directly
    if (user) {
        const isMember = workspace.members.some(m => m.user.toString() === user._id.toString());
        if (isMember) throw new Error('User is already a member');

        workspace.members.push({ user: user._id, role });
        await workspace.save();

        await User.findByIdAndUpdate(user._id, {
            $push: { workspaces: { workspace: workspace._id, role } }
        });

        // Optionally send a notification email anyway
        const inviter = await User.findById(inviterId);
        await mailService.sendInvitationEmail(
            email, 
            workspace.name, 
            inviter?.name || 'A teammate',
            `${process.env.FRONTEND_URL || 'http://localhost:5174'}`
        );

        return { user, status: 'added' };
    }

    // 2. If user doesn't exist, create a pending invitation
    const token = crypto.randomBytes(32).toString('hex');
    
    // Check if there's already a pending invite for this email in this workspace
    const existingInvite = await Invitation.findOne({ email: email.toLowerCase(), workspace: workspaceId, status: 'pending' });
    if (existingInvite) throw new Error('Invitation already sent to this email');

    const invitation = await Invitation.create({
        email: email.toLowerCase(),
        workspace: workspaceId,
        inviter: inviterId,
        role,
        token
    });

    // Send the email
    const inviter = await User.findById(inviterId);
    const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/register?token=${token}&email=${email}`;
    
    await mailService.sendInvitationEmail(
        email, 
        workspace.name, 
        inviter?.name || 'A teammate', 
        inviteLink
    );

    return { invitation, status: 'invited' };
};

export const getMembers = async (workspaceId) => {
    const workspace = await Workspace.findById(workspaceId).populate('members.user', 'name email');
    return workspace.members;
};

export const updateWorkspace = async (workspaceId, updateData) => {
    const { name } = updateData;
    const update = { name };
    
    // Auto-generate new slug if name is updated
    if (name) {
        update.slug = slugify(name, { lower: true });
    }

    const workspace = await Workspace.findByIdAndUpdate(workspaceId, update, { new: true });
    if (!workspace) throw new Error('Workspace not found');

    return workspace;
};
