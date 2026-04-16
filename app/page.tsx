export default function Page() {
  const checkoutUrl = process.env.NEXT_PUBLIC_LS_CHECKOUT_URL || "#";

  return (
    <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-24 pb-16 text-center">
        <span className="inline-block bg-[#58a6ff]/10 text-[#58a6ff] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
          Security Tool
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
          Recover Your Locked Gmail Account
        </h1>
        <p className="text-lg text-[#8b949e] max-w-xl mx-auto mb-8">
          Step-by-step device verification guidance, automated form assistance, and a live dashboard to track your Gmail recovery progress — all in one place.
        </p>
        <a
          href={checkoutUrl}
          className="inline-block bg-[#58a6ff] hover:bg-[#79b8ff] text-[#0d1117] font-bold px-8 py-3 rounded-lg transition-colors text-base"
        >
          Start Recovery — $19/mo
        </a>
        <p className="mt-4 text-sm text-[#8b949e]">Cancel anytime. Instant access.</p>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          {[
            { icon: "🔐", title: "Device Verification", desc: "Guided steps to verify ownership via trusted devices and phone numbers." },
            { icon: "📋", title: "Auto Form Assist", desc: "Pre-fills Google recovery forms with the right data at each step." },
            { icon: "📊", title: "Progress Dashboard", desc: "Track every recovery attempt and see exactly where you stand." }
          ].map((f) => (
            <div key={f.title} className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-sm text-[#8b949e]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-sm mx-auto px-6 pb-20">
        <div className="bg-[#161b22] border border-[#58a6ff]/40 rounded-2xl p-8 text-center shadow-lg">
          <p className="text-[#58a6ff] font-semibold text-sm uppercase tracking-widest mb-2">Pro Plan</p>
          <div className="text-5xl font-bold text-white mb-1">$19</div>
          <p className="text-[#8b949e] text-sm mb-6">per month</p>
          <ul className="text-sm text-[#c9d1d9] space-y-3 mb-8 text-left">
            {[
              "Unlimited recovery attempts",
              "Device & phone verification guides",
              "Automated form filling",
              "Recovery progress dashboard",
              "Priority email support"
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="text-[#58a6ff] font-bold">✓</span> {item}
              </li>
            ))}
          </ul>
          <a
            href={checkoutUrl}
            className="block w-full bg-[#58a6ff] hover:bg-[#79b8ff] text-[#0d1117] font-bold py-3 rounded-lg transition-colors"
          >
            Get Instant Access
          </a>
          <p className="mt-3 text-xs text-[#8b949e]">Secure checkout via Lemon Squeezy</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "How does device verification work?",
              a: "We walk you through Google's official device verification flow step by step, helping you use trusted devices or phone numbers linked to your account to prove ownership."
            },
            {
              q: "What if I no longer have access to my recovery phone?",
              a: "Our guide covers alternative recovery paths including backup email, security questions, and account activity verification — we help you find the best route for your situation."
            },
            {
              q: "Is my data safe?",
              a: "We never ask for your Gmail password. All guidance is instructional and form-assist only. Your credentials stay between you and Google."
            }
          ].map((item) => (
            <div key={item.q} className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
              <h3 className="font-semibold text-white mb-2">{item.q}</h3>
              <p className="text-sm text-[#8b949e]">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center text-xs text-[#8b949e] pb-8">
        &copy; {new Date().getFullYear()} Gmail Recovery Helper. Not affiliated with Google.
      </footer>
    </main>
  );
}
