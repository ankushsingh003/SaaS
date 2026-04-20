import Stripe from 'stripe';
import Workspace from '../models/Workspace.model.js';

const stripeKey = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.trim() !== '' ? process.env.STRIPE_SECRET_KEY : null;
const stripe = stripeKey ? new Stripe(stripeKey) : null;

/**
 * Billing Service:
 * Handles Stripe checkout sessions and subscription management.
 */

export const createCheckoutSession = async (workspaceId, plan) => {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
        throw new Error('Workspace not found');
    }

    // Map plan types to their Stripe Price IDs
    // In production, these should be in your .env
    const priceIds = {
        pro: process.env.STRIPE_PRO_PRICE_ID || 'price_placeholder_pro',
        enterprise: process.env.STRIPE_ENTERPRISE_ID || 'price_placeholder_ent'
    };

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: priceIds[plan],
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: `${process.env.CLIENT_URL || 'http://localhost:5174'}/billing?success=true`,
        cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5174'}/billing?canceled=true`,
        metadata: {
            workspaceId: workspaceId.toString(),
            plan: plan
        }
    });

    return session;
};

export const handleWebhook = async (event) => {
    const session = event.data.object;

    switch (event.type) {
        case 'checkout.session.completed':
            // Update workspace subscription status
            await Workspace.findByIdAndUpdate(session.metadata.workspaceId, {
                'subscription.plan': session.metadata.plan,
                'subscription.status': 'active',
                'subscription.stripeId': session.subscription
            });
            break;
        case 'customer.subscription.deleted':
            // Downgrade to free plan
            const workspace = await Workspace.findOne({ 'subscription.stripeId': session.id });
            if (workspace) {
              workspace.subscription.plan = 'free';
              workspace.subscription.status = 'canceled';
              await workspace.save();
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
};
