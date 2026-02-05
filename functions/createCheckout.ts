import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { priceId, successUrl, cancelUrl } = await req.json();

    if (!priceId) {
      return Response.json({ error: 'Price ID is required' }, { status: 400 });
    }

    // Get user email if authenticated
    let customerEmail;
    try {
      const user = await base44.auth.me();
      customerEmail = user?.email;
    } catch (error) {
      // User not authenticated, continue without email
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.get('origin')}/subscription`,
      customer_email: customerEmail,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
      },
    });

    return Response.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});