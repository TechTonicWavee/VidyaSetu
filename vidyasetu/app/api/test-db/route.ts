import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Testing DB connection with URL:', process.env.DATABASE_URL);
    const count = await prisma.teamInvite.count();
    return NextResponse.json({ success: true, count, url: process.env.DATABASE_URL });
  } catch (error: any) {
    console.error('Test DB error:', error);
    return NextResponse.json({ success: false, error: error.message, url: process.env.DATABASE_URL }, { status: 500 });
  }
}
