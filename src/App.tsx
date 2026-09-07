import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check, Shield, Lock, Eye, EyeOff, Mail, ArrowRight, ExternalLink, Tv } from "lucide-react";

export default function App() {
  const secretCode = "MOVIZ-ADMIN-MASTER";

  // Navigation steps: "email" -> "copiar"
  const [step, setStep] = useState<"email" | "copiar">("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [copiedTime, setCopiedTime] = useState<string | null>(null);

  // Logo URL from Google Drive direct usercontent format
  const logoUrl = "https://lh3.googleusercontent.com/d/1aXjKru_W_vo4PP6TD2YWKztb3QHcyKM2";

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setEmailError("Por favor, introduza o seu e-mail.");
      return;
    }
    // Simple email format verification
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Por favor, introduza um e-mail válido.");
      return;
    }

    setEmailError("");
    setStep("copiar");
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(secretCode);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = secretCode;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }

      setCopied(true);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setCopiedTime(timeStr);

      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (err) {
      console.error("Falha ao copiar código: ", err);
    }
  };

  // Helper to mask code visually: displays only the first letter and the last two letters
  const getMaskedCode = () => {
    if (secretCode.length <= 3) {
      return secretCode;
    }
    const firstChar = secretCode.charAt(0);
    const lastTwoChars = secretCode.slice(-2);
    return `${firstChar} •••••••••••••• ${lastTwoChars}`;
  };

  return (
    <div 
      id="app-container" 
      className="min-h-screen bg-[#000000] text-[#ffffff] flex flex-col items-center justify-center p-4 relative font-sans selection:bg-[#ffffff] selection:text-[#000000]"
    >
      {/* Main Container */}
      <div className="w-full max-w-lg z-10">
        
        {/* Centered Brand Logo */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 mb-4 flex items-center justify-center overflow-hidden rounded-2xl bg-black border border-white/10"
          >
            <img 
              id="brand-logo-img"
              src={logoUrl} 
              alt="MovIZ TV Logo" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                // Fail-safe placeholder if image fails to load
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = document.createElement("div");
                  fallback.className = "text-xl font-bold tracking-wider text-white";
                  fallback.innerText = "MovIZ TV";
                  parent.appendChild(fallback);
                }
              }}
            />
          </motion.div>
          <span className="text-[10px] tracking-[0.25em] text-white/40 uppercase font-semibold">
            MovIZ TV Activation System
          </span>
        </div>

        <AnimatePresence mode="wait">
          {step === "email" ? (
            /* ================= STEP 1: EMAIL INPUT ================= */
            <motion.div
              key="step-email"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-[#000000] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(255,255,255,0.03)]"
            >
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 text-center">
                Aceder à Chave do App
              </h2>
              <p className="text-sm text-white/60 mb-6 text-center">
                Insira o endereço de e-mail associado à sua compra para desbloquear o código de ativação.
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <div className="relative">
                  <label htmlFor="email-input" className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
                    Coloque seu e-mail da compra
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-white/40">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      id="email-input"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      placeholder="seu-email@exemplo.com"
                      className="w-full pl-12 pr-4 py-4 bg-black border border-white/20 rounded-xl text-white placeholder-white/30 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all"
                      required
                    />
                  </div>
                  {emailError && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-white mt-1.5 font-medium"
                    >
                      {emailError}
                    </motion.p>
                  )}
                </div>

                <button
                  id="submit-email-btn"
                  type="submit"
                  className="w-full py-4 px-6 bg-white text-black hover:bg-white/90 active:scale-[0.99] transition-all rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_12px_rgba(255,255,255,0.1)]"
                >
                  <span>Continuar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          ) : (
            /* ================= STEP 2: COPY SECRET CODE ================= */
            <motion.div
              key="step-copiar"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-[#000000] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(255,255,255,0.03)]"
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white mb-3">
                  <Shield className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
                  Palavra Secreta
                </h2>
                <p className="text-sm text-white/60">
                  Cópia de segurança para a sua ativação da MovIZ TV.
                </p>
              </div>

              {/* Code Container */}
              <div className="bg-black rounded-2xl border border-white/20 p-5 font-mono text-sm relative mb-6">
                {/* Code Header Bar */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10 text-[10px] tracking-wider text-white/40 uppercase">
                  <span>Chave de Ativação</span>
                  <span>{secretCode.length} CHARS</span>
                </div>

                {/* Display Area */}
                <div className="relative pr-10 min-h-[80px] flex items-center">
                  <div className="w-full text-white break-all leading-relaxed select-all text-xs sm:text-sm tracking-wide">
                    {showCode ? (
                      <span className="text-white font-medium">{secretCode}</span>
                    ) : (
                      <span className="text-white/40 select-none tracking-widest font-bold">
                        {getMaskedCode()}
                      </span>
                    )}
                  </div>

                  {/* Toggle code visibility */}
                  <button
                    id="code-visibility-btn"
                    onClick={() => setShowCode(!showCode)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-all cursor-pointer focus:outline-none"
                    title={showCode ? "Ocultar código" : "Visualizar código completo"}
                  >
                    {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Copy Action Button */}
              <button
                id="copy-code-action-btn"
                onClick={handleCopy}
                className={`w-full py-4 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${
                  copied
                    ? "bg-white text-black ring-2 ring-white"
                    : "bg-white text-black hover:bg-white/90 active:scale-[0.99]"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5px]" />
                    <span>Código Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Código Secreto</span>
                  </>
                )}
              </button>

              {/* Redirect to MovIZ TV Button */}
              <a
                id="redirect-moviztv-btn"
                href="https://mvztv.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full py-4 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 bg-transparent text-white border border-white hover:bg-white hover:text-black active:scale-[0.99]"
              >
                <Tv className="w-4 h-4" />
                <span>Entrar no MovIZ TV (Assistir)</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
              </a>

              {/* Copy Status Feedback */}
              <AnimatePresence>
                {copiedTime && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="mt-4 flex items-center justify-center gap-1.5 text-xs text-white/50"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Código copiado às </span>
                    <span className="text-white font-semibold">{copiedTime}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Back to Email */}
              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <button
                  id="go-back-btn"
                  onClick={() => {
                    setStep("email");
                    setEmail("");
                    setCopiedTime(null);
                  }}
                  className="text-xs text-white/40 hover:text-white transition-all bg-transparent border-0 cursor-pointer"
                >
                  Alterar e-mail de compra
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* System Micro-Footer */}
        <p className="text-center text-[10px] text-white/30 mt-8 tracking-wide select-none uppercase">
          MovIZ TV — Sistema de Distribuição Oficial
        </p>
      </div>
    </div>
  );
}
