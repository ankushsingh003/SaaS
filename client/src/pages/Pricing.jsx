import { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { Check, Loader2, Sparkles, Zap, Shield } from 'lucide-react';

/**
 * Pricing Page:
 * Displays the subscription plans and handles the redirection to Stripe Checkout.
 */
const Pricing = () => {
    const [loading, setLoading] = useState(null); // Tracks which plan is being purchased
    const { activeWorkspace } = useSelector((state) => state.workspaces);

    const handleSubscribe = async (plan) => {
        try {
            setLoading(plan);
            // Call our backend to get a Stripe Checkout URL
            const response = await api.post('/billing/create-checkout', {
                workspaceId: activeWorkspace?._id,
                plan: plan
            });
            
            // Redirect the user to Stripe's hosted checkout page
            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error('Checkout failed', error);
            setLoading(null);
        }
    };

    const plans = [
        {
            id: 'free',
            name: 'Free',
            price: '$0',
            description: 'For small projects and hobbyists.',
            features: ['3 Workspaces', 'Basic Analytics', '1 Team Member', 'Standard Support'],
            icon: Zap,
            color: 'text-slate-400',
            button: 'Current Plan'
        },
        {
            id: 'pro',
            name: 'Pro',
            price: '$29',
            description: 'For growing teams and startups.',
            features: [ 'Unlimited Workspaces', 'Advanced Real-time Analytics', 'Up to 10 Team Members', 'Priority Email Support', 'Custom Branding' ],
            icon: Sparkles,
            color: 'text-blue-400',
            button: 'Upgrade to Pro',
            popular: true
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: '$99',
            description: 'Full power for large organizations.',
            features: [ 'All Pro Features', 'Dedicated Account Manager', 'SLA Guarantee', 'Unlimited Team Members', 'Security Audits' ],
            icon: Shield,
            color: 'text-purple-400',
            button: 'Contact Sales'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-20 px-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -z-10"></div>

            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">Simple, Transparent Pricing</h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto"> Choose the plan that works for you. All plans include 14-day free trial of premium features. </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div 
                            key={plan.id}
                            className={`p-8 rounded-3xl border ${plan.popular ? 'border-blue-500 bg-slate-900/80 shadow-[0_0_40px_rgba(59,130,246,0.1)]' : 'border-slate-800 bg-slate-900/40'} flex flex-col relative`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-blue-600/20">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <div className={`h-12 w-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-4 ${plan.color}`}>
                                    <plan.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                                    <span className="text-slate-500 text-sm">/month</span>
                                </div>
                                <p className="text-sm text-slate-400">{plan.description}</p>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                        <div className="mt-1 h-4 w-4 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                            <Check size={10} className="text-emerald-500" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => plan.id !== 'free' && handleSubscribe(plan.id)}
                                disabled={plan.id === 'free' || loading === plan.id}
                                className={`w-full py-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center ${
                                    plan.id === 'free' 
                                    ? 'bg-slate-800 text-slate-500 cursor-default' 
                                    : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20 active:scale-[0.98]'
                                }`}
                            >
                                {loading === plan.id ? (
                                    <Loader2 className="animate-spin" size={18} />
                                ) : plan.button}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                   <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Secure payments powered by Stripe &bull; 256-bit encryption</p>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
