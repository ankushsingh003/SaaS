import Workspace from '../models/Workspace.model.js';
import User from '../models/User.model.js';
import slugify from 'slugify';

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
