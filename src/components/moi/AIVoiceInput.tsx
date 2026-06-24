'use client';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Square, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Props {
  lang: 'en-IN' | 'ta-IN';
  onResult: (text: string) => void;
  className?: string;
}

export function AIVoiceInput({ lang, onResult, className }: Props) {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const mr = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setRecording(false);
        setLoading(true);

        const ext = mimeType === 'audio/webm' ? 'webm' : 'mp4';
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const fd = new FormData();
        fd.append('audio', blob, `recording.${ext}`);
        fd.append('lang', lang);

        try {
          const res = await fetch('/api/voice', { method: 'POST', body: fd });
          if (!res.ok) throw new Error('Transcription failed');
          const data = await res.json() as { text?: string };
          if (data.text) onResult(data.text);
          else toast.error('No speech detected');
        } catch {
          toast.error('AI transcription failed — check OPENAI_API_KEY in .env.local');
        } finally {
          setLoading(false);
        }
      };

      mediaRef.current = mr;
      mr.start();
      setRecording(true);
    } catch {
      toast.error('Microphone access denied');
    }
  };

  const stopRecording = () => mediaRef.current?.stop();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={recording ? stopRecording : startRecording}
      disabled={loading}
      title={recording ? 'Stop & transcribe with AI' : 'AI voice (Whisper)'}
      className={cn(
        'h-8 w-8 rounded-full transition-colors',
        recording
          ? 'bg-purple-100 text-purple-600 animate-pulse'
          : loading
          ? 'text-gray-300'
          : 'text-gray-400 hover:text-purple-500',
        className
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : recording ? (
        <Square className="h-3 w-3 fill-current" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
    </Button>
  );
}
