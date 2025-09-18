import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { NotificationService } from '@/lib/services/notification-service';

// Optional: Protect this route with a secret token using a header `x-cron-secret`
export async function GET() {
  try {
    const supabase = await createClient();
    const notificationService = new NotificationService(supabase);
    await notificationService.processScheduledNotifications();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Cron notifications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
