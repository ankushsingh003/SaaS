import * as workspaceService from '../services/workspace.service.js';

export const create = async (req, res) => {
    try {
        const workspace = await workspaceService.createWorkspace(req.body, req.user._id);
        res.status(201).json({ success: true, workspace });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getAll = async (req, res) => {
    try {
        const workspaces = await workspaceService.getUserWorkspaces(req.user._id);
        res.status(200).json({ success: true, workspaces });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getOne = async (req, res) => {
    try {
        const workspace = await workspaceService.getWorkspaceById(req.params.id, req.user._id);
        res.status(200).json({ success: true, workspace });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

export const inviteMember = async (req, res) => {
    try {
        const { email, role } = req.body;
        const result = await workspaceService.addMember(req.params.id, email, role, req.user._id);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getMembers = async (req, res) => {
    try {
        const members = await workspaceService.getMembers(req.params.id);
        res.status(200).json({ success: true, members });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const workspace = await workspaceService.updateWorkspace(req.params.id, req.body);
        res.status(200).json({ success: true, workspace });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateMemberRole = async (req, res) => {
    try {
        const { role } = req.body;
        const result = await workspaceService.updateMemberRole(req.params.id, req.params.userId, role);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const removeMember = async (req, res) => {
    try {
        const result = await workspaceService.removeMember(req.params.id, req.params.userId);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
