import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
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

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const audioBuffer = await audio.arrayBuffer();
  const base64Audio = Buffer.from(audioBuffer).toString('base64');
  const mimeType = (audio.type || 'audio/webm') as 'audio/webm' | 'audio/mp4' | 'audio/ogg' | 'audio/wav';

  const prompt = lang.startsWith('ta')
    ? 'இந்த ஆடியோவை தமிழில் மட்டும் எழுத்து வடிவில் மாற்றவும். வேறு எதுவும் சேர்க்காதீர்கள்.'
    : 'Transcribe this audio in English. Return only the transcribed text, nothing else.';

  const result = await model.generateContent([
    { inlineData: { mimeType, data: base64Audio } },
    prompt,
  ]);

  const text = result.response.text().trim();
  return NextResponse.json({ text });
}
