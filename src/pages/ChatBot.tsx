import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const quickSuggestions = [
  "What lifestyle changes help with COPD?",
  "When should I see a pulmonologist?",
  "What are pulmonary rehabilitation exercises?",
  "How can I improve indoor air quality?",
];

// Rule-based responses until Lovable Cloud is enabled
function getResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("smoking") || lower.includes("smoke") || lower.includes("quit")) {
    return `## Smoking Cessation Tips 🚭\n\nQuitting smoking is the **single most effective** way to slow COPD progression:\n\n- **Nicotine Replacement Therapy** (patches, gum, lozenges)\n- **Prescription medications** like varenicline or bupropion\n- **Behavioral counseling** and support groups\n- **Avoid triggers** — identify and manage situations that make you want to smoke\n- Set a **quit date** and tell friends/family for accountability\n\n> Talk to your doctor about a personalized quit plan.`;
  }
  if (lower.includes("exercise") || lower.includes("rehabilitation") || lower.includes("physical")) {
    return `## Pulmonary Rehabilitation Exercises 🏃‍♂️\n\nRegular exercise can significantly improve COPD symptoms:\n\n1. **Pursed lip breathing** — Inhale through nose (2s), exhale through pursed lips (4s)\n2. **Diaphragmatic breathing** — Place hand on belly, breathe deeply into diaphragm\n3. **Walking** — Start with 10-15 min, gradually increase\n4. **Upper body stretches** — Improve chest expansion\n5. **Seated leg lifts** — Build strength without overexertion\n\n> Start slow and consult your doctor before beginning any exercise program.`;
  }
  if (lower.includes("air quality") || lower.includes("pollution") || lower.includes("indoor")) {
    return `## Improving Air Quality 🌿\n\n- Use **HEPA air purifiers** in main living areas\n- Avoid **aerosol sprays**, strong perfumes, and harsh cleaning chemicals\n- Keep humidity between **30-50%**\n- **Ventilate** your home regularly (when outdoor air quality is good)\n- Add **indoor plants** like spider plants or peace lilies\n- Use a **kitchen exhaust fan** when cooking\n- Check daily **air quality index (AQI)** before outdoor activities`;
  }
  if (lower.includes("doctor") || lower.includes("pulmonologist") || lower.includes("when") || lower.includes("consult")) {
    return `## When to See a Pulmonologist 🏥\n\nSeek medical attention if you experience:\n\n- ⚠️ **Worsening shortness of breath** that limits daily activities\n- ⚠️ **Increased cough frequency** or changes in sputum color\n- ⚠️ **Chest pain** or tightness that doesn't resolve with rest\n- ⚠️ **Swelling** in ankles, feet, or legs\n- ⚠️ **Fever** with respiratory symptoms\n- ⚠️ **Sudden weight loss** without trying\n\n> **Emergency**: If you have severe difficulty breathing, bluish lips/fingernails, or confusion — call emergency services immediately.`;
  }
  if (lower.includes("copd") || lower.includes("what is")) {
    return `## What is COPD? 🫁\n\n**Chronic Obstructive Pulmonary Disease (COPD)** is a group of progressive lung diseases that block airflow and make breathing difficult.\n\nThe two main conditions are:\n- **Chronic Bronchitis** — inflammation of the bronchial tubes\n- **Emphysema** — damage to the air sacs (alveoli)\n\n### Key Facts:\n- Affects ~380 million people worldwide\n- Usually caused by long-term exposure to irritants (smoking, pollution)\n- **Not curable**, but treatable and manageable\n- Early detection significantly improves quality of life`;
  }

  return `## Health Recommendations 💡\n\nHere are general tips for respiratory health:\n\n1. **Avoid smoking** and secondhand smoke\n2. **Stay active** with regular moderate exercise\n3. **Get vaccinated** — flu and pneumonia vaccines are important\n4. **Monitor air quality** and avoid polluted environments\n5. **Practice breathing exercises** daily\n6. **Maintain a healthy diet** rich in fruits and vegetables\n7. **Stay hydrated** — aim for 8 glasses of water daily\n\nFeel free to ask me about specific topics like smoking cessation, exercises, or when to see a doctor!`;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Hello! I'm your **PulmoSense AI Health Assistant**. I can provide guidance about COPD, breathing exercises, lifestyle changes, and when to seek medical help.\n\nHow can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(text);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <div className="py-6">
      <div className="container max-w-3xl flex flex-col" style={{ height: "calc(100vh - 180px)" }}>
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <MessageCircle className="w-4 h-4" />
            AI Health Assistant
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === "assistant" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"
              }`}>
                {msg.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] rounded-xl p-4 ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border/50"
              }`}>
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none text-foreground">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-card border border-border/50 rounded-xl p-4">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick suggestions */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {quickSuggestions.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="px-3 py-1.5 text-xs font-medium rounded-full bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about COPD, exercises, lifestyle changes..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button type="submit" variant="hero" disabled={!input.trim() || isTyping}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
