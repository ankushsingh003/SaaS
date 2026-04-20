import * as billingService from '../services/billing.service.js';

export const createSession = async (req, res) => {
    try {
        const { workspaceId, plan } = req.body;
        const session = await billingService.createCheckoutSession(workspaceId, plan);
        res.status(200).json({ success: true, url: session.url });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const webhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // In actual production, use stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
        // For development, we just take the body
        event = req.body;
        await billingService.handleWebhook(event);
        res.json({ received: true });
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
};
