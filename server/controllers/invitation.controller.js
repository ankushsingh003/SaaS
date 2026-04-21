import Invitation from '../models/Invitation.model.js';
import Workspace from '../models/Workspace.model.js';
import User from '../models/User.model.js';

export const getInvitation = async (req, res) => {
    try {
        const { token } = req.params;
        const invitation = await Invitation.findOne({ token, status: 'pending' })
            .populate('workspace', 'name slug')
            .populate('inviter', 'name email');

        if (!invitation) {
            return res.status(404).json({ success: false, message: 'Invitation not found or already accepted' });
        }

        if (invitation.expiresAt < new Date()) {
            invitation.status = 'expired';
            await invitation.save();
            return res.status(400).json({ success: false, message: 'Invitation has expired' });
        }

        res.status(200).json({ success: true, invitation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const acceptInvitation = async (req, res) => {
    try {
        const { token } = req.params;
        const invitation = await Invitation.findOne({ token, status: 'pending' });

        if (!invitation) {
            return res.status(404).json({ success: false, message: 'Invitation not found or already accepted' });
        }

        const workspace = await Workspace.findById(invitation.workspace);
        if (!workspace) {
            return res.status(404).json({ success: false, message: 'Workspace no longer exists' });
        }

        // Check if user is already a member
        const isMember = workspace.members.some(m => m.user.toString() === req.user._id.toString());
        if (isMember) {
            invitation.status = 'accepted';
            await invitation.save();
            return res.status(200).json({ success: true, message: 'You are already a member of this workspace' });
        }

        // Add to workspace
        workspace.members.push({ user: req.user._id, role: invitation.role });
        await workspace.save();

        // Add to user workspaces
        await User.findByIdAndUpdate(req.user._id, {
            $push: { workspaces: { workspace: workspace._id, role: invitation.role } }
        });

        // Mark as accepted
        invitation.status = 'accepted';
        await invitation.save();

        res.status(200).json({ success: true, message: 'Successfully joined the workspace', workspaceId: workspace._id });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
