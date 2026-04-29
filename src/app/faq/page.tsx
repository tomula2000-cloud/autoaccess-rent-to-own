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
    category: "Delivery & Collection",
    questions: [
      {
        q: "I live outside the Western Cape — can I still get a vehicle?",
        a: "Absolutely, and many of our most satisfied clients are based outside the Western Cape. Auto Access delivers vehicles to clients across all 9 provinces in South Africa — from Limpopo to the Eastern Cape, KwaZulu-Natal to the Northern Cape. You do not need to travel anywhere. Once your application is approved and your payment is confirmed, we take care of everything on your behalf. Your vehicle is fully prepared, insured, inspected, and professionally transported directly to your door. You simply wait for the call that your vehicle has arrived. The entire process is managed by our team so that your experience is smooth, compliant, and stress-free — regardless of where you are in the country.",
      },
      {
        q: "How long will it take to receive my vehicle if I am outside the Western Cape?",
        a: "Once your payment is confirmed, we immediately begin preparing your vehicle. This includes a full inspection, tracker and immobiliser installation, and insurance processing. Your vehicle is then delivered to our approved agents in your province who complete the full licensing, registration, and number plate process locally. Delivery and handover typically takes 3 to 5 working days from payment confirmation, depending on your location. You will receive updates throughout the process and will be notified the moment your vehicle is ready for handover.",
      },
      {
        q: "Do I need to come to the Western Cape to sign or pay?",
        a: "No. Out-of-province clients complete the entire process remotely and digitally. Your contract is signed through your secure online portal, and payment can be made via EFT from anywhere in South Africa. You are welcome to visit our branch in Paarl if you prefer to pay in person — but it is entirely optional. There is nothing that requires you to travel. We have designed our process to be fully accessible to clients nationwide, without any need to leave your province.",
      },
      {
        q: "I am outside the Western Cape — can I collect my vehicle from your branch if I travel to Paarl?",
        a: "You are welcome to visit our branch in Paarl to make payment in person if you prefer — however, vehicle collection at our premises is not possible for out-of-province clients, and we kindly ask that clients are aware of this before making the trip. Both our insurance requirements and South African traffic department regulations require that your vehicle carries number plates that match your home province. Our insurance policy specifically stipulates that all vehicles issued to clients outside the Western Cape must be registered and licensed in the client's province of residence. To comply with this, your vehicle is delivered to our approved agents in your province, who complete the full licensing, registration, and number plate process locally before the vehicle is handed over to you. This entire process is handled on your behalf — you do not need to travel anywhere or do anything. Once everything is in order, your vehicle is delivered directly to you, fully registered, roadworthy, and correctly plated. This typically takes 3 to 5 working days from payment confirmation, and you will be kept informed at every step.",
      },
      {
        q: "I am in the Western Cape — can I collect my vehicle from your premises?",
        a: "Yes. Western Cape clients are welcome to visit our branch in Paarl to sign their contract and make payment in person. However, please note that vehicle collection is not available on the same day as payment — and we ask that clients do not arrive at our premises expecting to drive away immediately. After payment is confirmed, your vehicle undergoes a mandatory preparation process including licensing and registration, insurance processing, vehicle inspection, number plate fitment, and tracker and immobiliser installation. This process takes up to 48 hours. You will be personally notified once your vehicle is fully ready for collection.",
      },
      {
        q: "Where will my vehicle be serviced after delivery?",
        a: "All routine servicing and maintenance is arranged at an approved dealership in your home province — identified and nominated by Auto Access. You will never need to travel to the Western Cape for any vehicle-related matter after delivery. We ensure that your after-delivery experience is just as seamless as the process of getting your vehicle.",
      },
      {
        q: "Can I read reviews from clients who have already received their vehicles?",
        a: "Yes, and we encourage you to do so. We have a verified review profile featuring feedback from real Auto Access clients across South Africa. Reading their experiences is the best way to understand what to expect from our process. Visit sareviews.co.za/autoaccess to read our client reviews.",
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