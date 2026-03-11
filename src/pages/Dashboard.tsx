import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Activity, Wind, HeartPulse, TrendingDown, ClipboardList, Mic, MessageCircle } from "lucide-react";

const stats = [
  { label: "Assessments", value: "1", icon: ClipboardList, color: "bg-primary/10 text-primary" },
  { label: "Audio Scans", value: "1", icon: Mic, color: "bg-coral-light text-coral" },
  { label: "Risk Level", value: "—", icon: Activity, color: "bg-warning-light text-warning" },
  { label: "Health Score", value: "—", icon: HeartPulse, color: "bg-success-light text-success" },
];

const tips = [
  { icon: Wind, title: "Practice Breathing", desc: "Try pursed lip breathing for 5 minutes daily." },
  { icon: TrendingDown, title: "Reduce Exposure", desc: "Check AQI before outdoor activities." },
  { icon: HeartPulse, title: "Stay Active", desc: "30 min moderate exercise most days." },
];

export default function Dashboard() {
  // Load saved results
  const raw = localStorage.getItem("pulmosense_assessment");
  const data = raw ? JSON.parse(raw) : null;

  return (
    <div className="py-12">
      <div className="container max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <LayoutDashboard className="w-4 h-4" />
            Health Dashboard
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {data?.name ? `Welcome, ${data.name}` : "Your Health Dashboard"}
          </h1>
          <p className="text-muted-foreground">Track your respiratory health and assessment history</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border/50 rounded-xl p-5 shadow-sm"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-card border border-border/50 rounded-xl p-6 shadow-sm"
          >
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start h-auto py-4 px-4" asChild>
                <Link to="/assessment">
                  <ClipboardList className="w-5 h-5 mr-3 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">New Assessment</div>
                    <div className="text-xs text-muted-foreground">Start a COPD risk check</div>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-4 px-4" asChild>
                <Link to="/recording">
                  <Mic className="w-5 h-5 mr-3 text-coral" />
                  <div className="text-left">
                    <div className="font-medium">Record Audio</div>
                    <div className="text-xs text-muted-foreground">Analyze breathing sounds</div>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-4 px-4" asChild>
                <Link to="/results">
                  <Activity className="w-5 h-5 mr-3 text-warning" />
                  <div className="text-left">
                    <div className="font-medium">View Results</div>
                    <div className="text-xs text-muted-foreground">See latest prediction</div>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-4 px-4" asChild>
                <Link to="/chatbot">
                  <MessageCircle className="w-5 h-5 mr-3 text-success" />
                  <div className="text-left">
                    <div className="font-medium">Health Assistant</div>
                    <div className="text-xs text-muted-foreground">Get personalized advice</div>
                  </div>
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Health Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border/50 rounded-xl p-6 shadow-sm"
          >
            <h3 className="font-semibold mb-4">Daily Health Tips</h3>
            <div className="space-y-4">
              {tips.map((tip) => (
                <div key={tip.title} className="flex gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <tip.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{tip.title}</div>
                    <div className="text-xs text-muted-foreground">{tip.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
