import Link from "next/link";
const faqs = [
  {
    category: "Qualifying",
    questions: [
      {
        q: "Do you check my credit?",
        a: "No. Auto Access does not run credit bureau checks. We assess your application based on your current employment status and monthly income only. This means people with bad credit, under debt review or previously blacklisted can qualify — provided they are employed and earning a sufficient income.",
      },
      {
        q: "What income do I need to qualify?",
        a: "You need a minimum net take-home salary of R7,000 per month. Joint applications with a spouse are considered, where a combined net income of R7,000 or more is required. Proof of income is verified through your 3 months bank statements.",
      },
      {
        q: "What documents do I need?",
        a: "You will need a valid South African ID or passport, a valid driver's licence, your most recent 3 months bank statements and proof of residence not older than 3 months (such as a utility bill or bank statement showing your address).",
      },
    ],
  },
  {
    category: "The Process",
    questions: [
      {
        q: "How long does approval take?",
        a: "Once all required documents have been received and verified, our team reviews your application within 24 to 48 hours. You will receive a real-time status update through your client portal as soon as a decision is made.",
      },
      {
        q: "How do I submit my documents?",
        a: "Documents can be submitted through your secure client portal, emailed to docs@autoaccess.co.za with your reference number in the subject line, or sent via WhatsApp to +27 61 049 0061. All three options are available to you.",
      },
      {
        q: "Can I visit your offices in person?",
        a: "Yes. Approved clients are welcome to visit our Western Cape offices to sign their rental agreement and make relevant payments in person. Please note that only approved clients are permitted on our premises. Unapproved third parties may not access our warehouse or offices unless accompanying and presenting alongside an approved client.",
      },
    ],
  },
  {
    category: "Pricing and Ownership",
    questions: [
      {
        q: "Why are your prices more competitive than other rent-to-own companies?",
        a: "Auto Access works exclusively with bank repossessed vehicles. Because these vehicles already have an established balance with the financial institution from the previous owner's agreement, we structure your rent-to-own from that existing position. This means lower deposit requirements and more competitive monthly payments compared to programmes priced from retail vehicle value. You benefit directly — and the previous owner's outstanding bank obligation is resolved in the process.",
      },
      {
        q: "What is included in my monthly payment?",
        a: "Your monthly payment covers vehicle licensing, third-party insurance cover waiver, vehicle tracking, access to our maintenance budgeting plan and the flexibility to upgrade or downgrade at any time. All costs are disclosed upfront before you commit.",
      },
      {
        q: "Will I own the vehicle at the end?",
        a: "Yes. After completing your full 54-month contract term with consistent on-time payments, full ownership of the vehicle transfers to you. This is not an open-ended rental — it is a structured journey to ownership with a clear destination.",
      },
      {
        q: "Can I exit the agreement early?",
        a: "Yes. There is no fixed lock-in. If your circumstances change and you need to exit, our team will guide you through the process transparently. You are never trapped in an agreement.",
      },
    ],
  },
  {
    category: "Nationwide Delivery",
    questions: [
      {
        q: "Do you assist clients outside the Western Cape?",
        a: "Absolutely. Auto Access serves clients across all 9 provinces in South Africa. Our services are fully nationwide and your location does not affect your ability to qualify or receive a vehicle.",
      },
      {
        q: "How does delivery work if I am not in the Western Cape?",
        a: "Once your payment is confirmed, your vehicle is professionally loaded onto an approved third-party transporter and shipped to your province at no cost to you. Before handover, we complete all licensing, registration and insurance requirements in your home province. Delivery typically takes 3 to 5 working days from payment confirmation.",
      },
      {
        q: "Can I collect my vehicle from the Western Cape?",
        a: "We do not offer client collection for clients based outside the Western Cape. South African insurance regulations require that vehicles are registered and licensed in the province where the client is based — ensuring your number plates correctly match your province of residence. Our delivery process ensures full provincial compliance before your vehicle is handed over.",
      },
      {
        q: "Where will my vehicle be serviced?",
        a: "All routine servicing and maintenance is handled at a nominated approved dealership in your home province — selected by Auto Access. You will never need to travel to the Western Cape for any vehicle-related matter.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
    {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] px-5 py-24 text-white">
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#2f67de]/20 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-[#d59758]/15 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#f4c89a] backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d59758]" />
            Auto Access · FAQ
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
            Frequently asked<br />
            <span className="text-[#d59758]">questions.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-8 text-white/70">
            Everything you need to know about our rent-to-own programme, delivery, pricing and the application process.
          </p>
        </div>
      </section>

      {/* ── FAQ ACCORDION ── */}
      <section className="bg-[#f4f6fb] px-5 py-20">
        <div className="mx-auto max-w-3xl space-y-10">
          {faqs.map((category) => (
            <div key={category.category}>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#e1e4ee]" />
                <span className="rounded-full border border-[#dbe6ff] bg-[#eef4ff] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#2f67de]">{category.category}</span>
                <div className="h-px flex-1 bg-[#e1e4ee]" />
              </div>
              <div className="space-y-3">
                {category.questions.map((item) => (
                  <details key={item.q} className="group overflow-hidden rounded-[20px] border border-[#e1e4ee] bg-white shadow-[0_4px_12px_-6px_rgba(15,23,42,0.08)]">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 marker:content-none">
                      <p className="text-[14px] font-semibold text-[#1b2345]">{item.q}</p>
                      <svg className="h-5 w-5 shrink-0 text-[#2f67de] transition group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </summary>
                    <div className="border-t border-[#eef0f7] bg-[#fafbff] px-5 py-4">
                      <p className="text-[13px] leading-7 text-[#4d546a]">{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STILL HAVE QUESTIONS ── */}
      <section className="bg-white px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0b1532] to-[#1b3375] p-8 text-center text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#f4c89a]">Still Have Questions</p>
            <h2 className="mt-3 text-2xl font-bold">We are here to help.</h2>
            <p className="mx-auto mt-3 max-w-md text-[14px] leading-7 text-white/70">
              Contact our team directly via WhatsApp or phone and we will get back to you promptly.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a href="https://wa.me/27610490061" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-5 py-2.5 text-[13px] font-semibold text-emerald-300">
                WhatsApp Us
              </a>
              <a href="tel:0870126734" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-5 py-2.5 text-[13px] font-bold text-white">
                Call 087 012 6734
              </a>
              <Link href="/apply" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-[13px] font-semibold text-white">
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}