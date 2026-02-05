import { useEffect } from 'react';

export default function UserInitializer() {
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const user = await base44.auth.me();
        
        // If user doesn't have subscription_plan or trial_start_date, initialize them
        if (!user.subscription_plan || !user.trial_start_date) {
          await base44.auth.updateMe({
            subscription_plan: 'pro',
            trial_start_date: new Date().toISOString()
          });
        }
      } catch (error) {
        // User not logged in or error - ignore
      }
    };

    initializeUser();
  }, []);

  return null;
}