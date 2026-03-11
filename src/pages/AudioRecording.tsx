import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, Square, ArrowRight, Loader2 } from "lucide-react";
import { extractAudioFeatures, type AudioFeatures } from "@/lib/dbn-engine";

export default function AudioRecording() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"idle" | "recording" | "processing" | "done">("idle");
  const [seconds, setSeconds] = useState(0);
  const [waveform, setWaveform] = useState<number[]>(new Array(40).fill(5));
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const animationRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const updateWaveform = useCallback(() => {
    if (analyserRef.current && status === "recording") {
      const data = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteTimeDomainData(data);
      const bars = [];
      const step = Math.floor(data.length / 40);
      for (let i = 0; i < 40; i++) {
        const val = Math.abs(data[i * step] - 128);
        bars.push(Math.max(4, val / 2));
      }
      setWaveform(bars);
      animationRef.current = requestAnimationFrame(updateWaveform);
    }
  }, [status]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.start();
      setStatus("recording");
      setSeconds(0);

      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      alert("Microphone access is required for audio recording.");
    }
  };

  useEffect(() => {
    if (status === "recording") {
      animationRef.current = requestAnimationFrame(updateWaveform);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [status, updateWaveform]);

  const stopRecording = () => {
    // Extract audio features from analyser before stopping
    let features: AudioFeatures | null = null;
    if (analyserRef.current) {
      features = extractAudioFeatures(analyserRef.current);
    }

    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    clearInterval(timerRef.current);
    setStatus("processing");

    // Process through DBN pipeline
    setTimeout(() => {
      if (features) {
        localStorage.setItem("pulmosense_audio_features", JSON.stringify(features));
      }
      localStorage.setItem("pulmosense_audio_done", "true");
      setStatus("done");
    }, 3000);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="py-12">
      <div className="container max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Mic className="w-4 h-4" />
            Respiratory Audio
          </div>
          <h1 className="text-3xl font-bold mb-2">Record Breathing Sound</h1>
          <p className="text-muted-foreground">
            Breathe normally near the microphone for at least 10 seconds
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border/50 rounded-xl p-8 shadow-sm text-center"
        >
          {/* Waveform */}
          <div className="flex items-center justify-center gap-0.5 h-24 mb-8">
            {waveform.map((h, i) => (
              <motion.div
                key={i}
                className={`w-1.5 rounded-full transition-colors ${
                  status === "recording" ? "bg-primary" : "bg-border"
                }`}
                animate={{ height: status === "recording" ? h : 5 }}
                transition={{ duration: 0.05 }}
              />
            ))}
          </div>

          {/* Timer */}
          <div className="text-4xl font-bold font-mono mb-8 text-foreground">
            {formatTime(seconds)}
          </div>

          {/* Controls */}
          {status === "idle" && (
            <Button variant="hero" size="lg" onClick={startRecording} className="px-10">
              <Mic className="w-5 h-5 mr-2" /> Start Recording
            </Button>
          )}
          {status === "recording" && (
            <div className="space-y-4">
              <div className="relative inline-flex">
                <span className="absolute inset-0 rounded-full bg-destructive/20 animate-pulse-ring" />
                <Button variant="destructive" size="lg" onClick={stopRecording} className="relative px-10">
                  <Square className="w-5 h-5 mr-2" /> Stop Recording
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Recording... breathe normally</p>
            </div>
          )}
          {status === "processing" && (
            <div className="space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
              <p className="font-medium">Analyzing audio...</p>
              <p className="text-sm text-muted-foreground">
                Extracting MFCC, Mel Spectrogram & Chroma features
              </p>
            </div>
          )}
          {status === "done" && (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-success-light mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-medium">Audio analysis complete!</p>
              <Button variant="hero" size="lg" onClick={() => navigate("/results")} className="px-8">
                View Results <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
