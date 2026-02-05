import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  let event;
  
  try {
    const body = await req.text();
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return Response.json({ error: 'Webhook verification failed' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerEmail = session.customer_email;

        if (customerEmail && session.mode === 'subscription') {
          // Find user by email and update subscription
          const users = await base44.asServiceRole.entities.User.filter({ email: customerEmail });
          
          if (users.length > 0) {
            const user = users[0];
            await base44.asServiceRole.entities.User.update(user.id, {
              subscription_plan: 'pro',
              stripe_customer_id: session.customer,
              stripe_subscription_id: session.subscription,
            });
            console.log(`Updated user ${customerEmail} to pro subscription`);
          }
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const users = await base44.asServiceRole.entities.User.filter({ 
          stripe_subscription_id: subscription.id 
        });

        if (users.length > 0) {
          const user = users[0];
          const isActive = subscription.status === 'active';
          
          await base44.asServiceRole.entities.User.update(user.id, {
            subscription_plan: isActive ? 'pro' : 'free',
          });
          console.log(`Updated subscription status for user ${user.email}`);
        }
        break;
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});