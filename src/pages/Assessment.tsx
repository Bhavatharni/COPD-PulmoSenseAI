import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardList, ArrowRight, ArrowLeft } from "lucide-react";

const symptoms = [
  { id: "shortness_of_breath", label: "Shortness of breath" },
  { id: "chronic_cough", label: "Chronic cough (3+ months)" },
  { id: "wheezing", label: "Wheezing" },
  { id: "chest_tightness", label: "Chest tightness" },
  { id: "fatigue", label: "Fatigue and low energy" },
  { id: "frequent_infections", label: "Frequent respiratory infections" },
];

export default function Assessment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    smokingHistory: "",
    occupation: "",
    pollutionExposure: "",
    symptoms: [] as string[],
  });

  const toggleSymptom = (id: string) => {
    setForm((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(id)
        ? prev.symptoms.filter((s) => s !== id)
        : [...prev.symptoms, id],
    }));
  };

  const handleSubmit = () => {
    localStorage.setItem("pulmosense_assessment", JSON.stringify(form));
    navigate("/recording");
  };

  const canProceed = step === 0
    ? form.name && form.age && form.gender
    : form.smokingHistory;

  return (
    <div className="py-12">
      <div className="container max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <ClipboardList className="w-4 h-4" />
            COPD Risk Assessment
          </div>
          <h1 className="text-3xl font-bold mb-2">Health Assessment</h1>
          <p className="text-muted-foreground">
            Step {step + 1} of 3 — {["Personal Info", "Health History", "Symptoms"][step]}
          </p>
        </motion.div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[0, 1, 2].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card border border-border/50 rounded-xl p-6 md:p-8 shadow-sm"
        >
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter your name" className="mt-1.5" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="30" className="mt-1.5" />
                </div>
                <div>
                  <Label>Gender</Label>
                  <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <Label>Smoking History</Label>
                <Select value={form.smokingHistory} onValueChange={(v) => setForm({ ...form, smokingHistory: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select smoking history" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never smoked</SelectItem>
                    <SelectItem value="former">Former smoker</SelectItem>
                    <SelectItem value="current_light">Current smoker (light)</SelectItem>
                    <SelectItem value="current_heavy">Current smoker (heavy)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="occupation">Occupation</Label>
                <Input id="occupation" value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} placeholder="e.g., Construction worker" className="mt-1.5" />
              </div>
              <div>
                <Label>Air Pollution Exposure</Label>
                <Select value={form.pollutionExposure} onValueChange={(v) => setForm({ ...form, pollutionExposure: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select exposure level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-2">Select all symptoms that apply:</p>
              {symptoms.map((symptom) => (
                <label
                  key={symptom.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-secondary/50 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={form.symptoms.includes(symptom.id)}
                    onCheckedChange={() => toggleSymptom(symptom.id)}
                  />
                  <span className="text-sm font-medium">{symptom.label}</span>
                </label>
              ))}
            </div>
          )}
        </motion.div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          {step < 2 ? (
            <Button variant="hero" onClick={() => setStep(step + 1)} disabled={!canProceed}>
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button variant="hero" onClick={handleSubmit}>
              Continue to Audio <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
