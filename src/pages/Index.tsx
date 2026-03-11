import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, Shield, Mic, Brain, MessageCircle, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Audio Analysis",
    description: "Record breathing sounds for AI-powered respiratory pattern detection.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Brain,
    title: "Deep Learning",
    description: "Advanced DBN model analyzes audio features like MFCC and spectrograms.",
    color: "bg-coral-light text-coral",
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description: "Get severity classification — Low, Moderate, or High COPD risk.",
    color: "bg-sky-light text-sky",
  },
  {
    icon: MessageCircle,
    title: "AI Health Assistant",
    description: "Personalized recommendations from our virtual pulmonary advisor.",
    color: "bg-success-light text-success",
  },
  {
    icon: BarChart3,
    title: "Health Dashboard",
    description: "Track your respiratory health metrics over time.",
    color: "bg-warning-light text-warning",
  },
  {
    icon: Activity,
    title: "Early Detection",
    description: "Identify COPD risk early for better health outcomes.",
    color: "bg-primary/10 text-primary",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-36">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-coral/5 blur-3xl" />
        
        <div className="container relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Activity className="w-4 h-4" />
              AI-Powered Respiratory Health
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Detect COPD Early with{" "}
              <span className="text-gradient-hero">PulmoSense AI</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Advanced deep learning analyzes your breathing patterns and health data to predict 
              COPD risk — enabling earlier intervention and better outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="text-base px-8" asChild>
                <Link to="/assessment">Start COPD Assessment</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-base px-8" asChild>
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How PulmoSense AI Works</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A comprehensive pipeline from data collection to AI-powered diagnosis
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="bg-card rounded-xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <motion.div
            className="bg-gradient-hero rounded-2xl p-10 md:p-16 text-center text-primary-foreground"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Take Control of Your Lung Health
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-lg mx-auto">
              Early detection saves lives. Start your COPD risk assessment today.
            </p>
            <Button variant="secondary" size="lg" className="text-base px-8 font-semibold" asChild>
              <Link to="/assessment">Begin Free Assessment</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
