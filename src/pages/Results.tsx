import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BarChart3, MessageCircle, AlertTriangle, CheckCircle, AlertCircle, BrainCircuit, AudioWaveform } from "lucide-react";
import { runDBNPrediction, generateSimulatedAudioFeatures, type PredictionResult, type PatientData, type AudioFeatures } from "@/lib/dbn-engine";

const riskConfig = {
  low: { color: "text-success", bg: "bg-success-light", label: "Low Risk", icon: CheckCircle },
  moderate: { color: "text-warning", bg: "bg-warning-light", label: "Moderate Risk", icon: AlertCircle },
  high: { color: "text-destructive", bg: "bg-coral-light", label: "High Risk", icon: AlertTriangle },
};

export default function Results() {
  const [result, setResult] = useState<PredictionResult | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("pulmosense_assessment");
    const patientData: PatientData = raw ? JSON.parse(raw) : {
      name: "", age: "30", gender: "male", smokingHistory: "never",
      occupation: "", pollutionExposure: "low", symptoms: [],
    };

    const audioRaw = localStorage.getItem("pulmosense_audio_features");
    const audioFeatures: AudioFeatures = audioRaw ? JSON.parse(audioRaw) : generateSimulatedAudioFeatures();

    setResult(runDBNPrediction(patientData, audioFeatures));
  }, []);

  if (!result) return null;

  const config = riskConfig[result.risk];
  const Icon = config.icon;

  return (
    <div className="py-12">
      <div className="container max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <BarChart3 className="w-4 h-4" />
            DBN Analysis Complete
          </div>
          <h1 className="text-3xl font-bold mb-2">COPD Risk Prediction</h1>
          <p className="text-muted-foreground">Deep Belief Network analysis of patient data & respiratory audio</p>
        </motion.div>

        {/* Risk Gauge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border/50 rounded-xl p-8 shadow-sm text-center mb-6"
        >
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="42" fill="none"
                stroke={result.risk === "low" ? "hsl(var(--success))" : result.risk === "moderate" ? "hsl(var(--warning))" : "hsl(var(--coral))"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - result.probability / 100) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className="text-4xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {result.probability}%
              </motion.span>
              <span className="text-xs text-muted-foreground">COPD Probability</span>
            </div>
          </div>

          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${config.bg} ${config.color} font-semibold mb-2`}>
            <Icon className="w-5 h-5" />
            {config.label}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Severity: <span className="font-medium text-foreground">{result.severity}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Model Confidence: {result.confidence}%
          </p>
        </motion.div>

        {/* DBN Architecture Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border/50 rounded-xl p-6 shadow-sm mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <BrainCircuit className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">DBN Model Architecture</h3>
          </div>
          <div className="space-y-3">
            {result.dbnLayers.map((layer, i) => (
              <motion.div
                key={layer.layer}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.15 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-muted-foreground">{layer.layer}</span>
                  <span className="text-xs text-muted-foreground">
                    {i === result.dbnLayers.length - 1 ? `Output: ${(layer.activations[0] * 100).toFixed(1)}%` : `avg: ${(layer.activations.reduce((a, b) => a + b, 0) / layer.activations.length).toFixed(3)}`}
                  </span>
                </div>
                <div className="flex gap-0.5 h-4">
                  {layer.activations.map((val, j) => (
                    <motion.div
                      key={j}
                      className="flex-1 rounded-sm"
                      style={{
                        backgroundColor: `hsl(var(--primary) / ${Math.max(0.1, Math.min(1, Math.abs(val)))})`,
                      }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.5 + i * 0.15 + j * 0.02 }}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-primary/20" /> Low activation
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-primary" /> High activation
            </div>
          </div>
        </motion.div>

        {/* Audio Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-card border border-border/50 rounded-xl p-6 shadow-sm mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <AudioWaveform className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Audio Feature Analysis</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "MFCC Score", value: result.audioAnalysis.mfccScore, desc: "Mel-frequency cepstral coefficients" },
              { label: "Mel Spectrogram", value: result.audioAnalysis.melScore, desc: "Frequency band energy" },
              { label: "Chroma Features", value: result.audioAnalysis.chromaScore, desc: "Pitch class distribution" },
              { label: "Audio Risk", value: result.audioAnalysis.overallAudioRisk, desc: "Overall audio anomaly score" },
            ].map((item) => (
              <div key={item.label} className="text-center p-3 rounded-lg bg-secondary/50">
                <div className="text-2xl font-bold text-foreground">{item.value}%</div>
                <div className="text-xs font-medium">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Risk Factors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border/50 rounded-xl p-6 shadow-sm mb-6"
        >
          <h3 className="font-semibold mb-4">Risk Factors Analyzed</h3>
          <div className="space-y-3">
            {result.factors.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  f.impact === "positive" ? "bg-success" : f.impact === "negative" ? "bg-destructive" : "bg-warning"
                }`} />
                <span className="text-sm flex-1">{f.label}</span>
                <span className="text-xs text-muted-foreground font-mono">w:{f.weight}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <div className="bg-warning-light border border-warning/20 rounded-xl p-4 mb-6 text-sm text-warning">
          <strong>Disclaimer:</strong> This DBN prediction is a simulated demonstration. 
          Always consult a medical professional for actual COPD diagnosis.
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" asChild>
            <Link to="/chatbot"><MessageCircle className="w-4 h-4 mr-2" /> Get Health Advice</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard">View Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
