import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const audio = formData.get('audio') as File | null;
  const lang = (formData.get('lang') as string) ?? 'en-IN';

  if (!audio) {
    return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const whisperLang = lang.startsWith('ta') ? 'ta' : 'en';

  const transcription = await openai.audio.transcriptions.create({
    file: audio,
    model: 'whisper-1',
    language: whisperLang,
  });

  return NextResponse.json({ text: transcription.text });
}
