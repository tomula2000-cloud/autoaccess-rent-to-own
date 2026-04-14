"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

/* ── Static fallback terms (Auto Access branded) ─────────────────────── */
const AUTO_ACCESS_DEFAULT_TERMS = `TERMS AND CONDITIONS

DEFINITIONS AND INTERPRETATION:

2.1 In this Agreement:
2.1.1 Clause headings are for the purposes of convenience and reference only and shall not be used in the interpretation of any of the provisions of this Agreement;
2.1.2 The parties shall, wherever necessary and appropriate, be referred to by their defined designations as in 2.2 below;
2.1.3 A reference to:
2.1.3.1 one gender shall include the other gender;
2.1.3.2 the singular shall include the plural and vice versa;
2.1.3.3 a natural person shall include corporate or un-incorporate created entities and vice versa;
2.1.3.4 all of the schedules and/or annexures are incorporated herein and shall have the same force and effect as if they were set out in the body of this Agreement;
2.1.3.5 words and/or expressions defined in this Agreement shall bear the same meanings in any Schedules and/or annexures hereto which do not contain their own defined words and/or expressions;
2.1.3.6 where a period consisting of a number of days is prescribed, it shall be determined by excluding the first and including the last day;
2.1.3.7 where the day upon or by which any act is required to be performed is a Saturday, Sunday or public holiday in the Republic of South Africa, the parties shall be deemed to have intending such act to be performed upon or by the first day thereafter which is not a Saturday, Sunday or a public holiday;
2.1.3.8 where an expression has been defined (whether in 2.2 below or elsewhere in this Agreement) and such definition contains a provision conferring rights or imposing obligations on any party, effect shall be given to that provision as if it were a substantive provision contained in the body of this Agreement;
2.1.3.9 if figures are referred to in numbers and words, the words shall prevail in the event of any conflict between the two;
2.1.3.10 words and/or expressions defined in this Agreement shall, unless the application of such word and/or expression is specifically limited to that clause, bear the meaning so assigned to it;
2.1.3.11 the contra proferentem rule shall not apply and accordingly, none of the provisions hereof shall be constructed against or interpreted to the disadvantage of the party responsible for the drafting or preparation of such provision;
2.1.3.12 the generis rule shall not apply, and whenever a provision is followed by the word "including" and specific examples, such examples shall not be constructed so as to limit the ambit of the provision concerned;
2.1.3.13 a reference to any statutory enactment shall be construed as a reference to that enactment as the signature date and as amending or re-enacted from time to time thereafter;
2.1.3.14 the expiration or termination of this Agreement shall not affect such of its provisions as expressly provided that they will continue to apply after such expiration or termination or which of necessity must continue to apply after such expiration or termination;
2.1.3.15 any communication which is required to be "in writing" shall include a communication which is written or produced by any substitute for writing or which is partly written and partly so produced, and shall include printing, typewriting, lithography, facsimile or electronic mail or any form of electronic communication or other process or partly one and partly another.

2.2 In this Agreement, unless clearly inconsistent with or otherwise indicated by the context, with cognate expressions having corresponding meanings:
2.2.1 "Agreement" or "this Agreement" means this Vehicle Rental Agreement concluded between the Rentor and the Rentee;
2.2.2 "Base Rental" means the monthly rental payable for the use and enjoyment of the Vehicle, inclusive of limited Damage and Loss Liability Waivers, and the monthly tracker and immobilizer fee but excluding the monthly rental payments for any Additional Rental Benefits.
2.2.3 "Delivery Date" means the date upon which the Rentee takes delivery of the Vehicle;
2.2.4 "Early Termination" means the termination of the Agreement for those reasons in paragraph 19;
2.2.5 "Early Termination Settlement" means the figure payable as a result of an Early Termination. The Early Termination Settlement in circumstances where the vehicle is damaged beyond repair shall be an amount equal to the difference between the nett present value of the remaining rentals due in terms of this Agreement calculated at Prime plus 2% and the vehicles post-accident value plus 10% of the value of the remaining rentals due in terms of this Agreement as at the date of Early Termination. In all other circumstances giving rise to Early Termination Settlement should be the amount equal to the nett present value of the remaining rentals due in terms of this Agreement less the trade value of the Vehicle (as determined in Meade and McGrouther) plus 10% of the value of the remaining rentals due in terms of this Agreement as at the date of Early Termination.
2.2.6 "Fair Value" means the value of the Vehicle from time to time determined by reference to the mean average between the trade value and the retail value contained in the most recent published edition of Meade and McGrouther;
2.2.7 "Damage and Loss Liability Waivers" means the amount by which the Rentee's liability in the case of accident damage to or loss of the vehicle through theft or highjacking will be limited subject to the terms and conditions of this Agreement;
2.2.8 "Prime Rate" means the publicly quoted basic annual rate of interest at which Standard Bank lends on overdraft;
2.2.9 "Road Traffic Laws" means the National Road Traffic Act No 93 of 1996 and any supplementary or replacement legislation together with all applicable provincial and municipal road traffic by-laws and regulations;
2.2.10 "Vehicle" means the motor Vehicle described;

3. DURATION
This Agreement shall be deemed to have commenced on the date of delivery of the Vehicle to the Rentee and shall remain in force until the Expiry Date.

4. PAYMENT OF RENTALS
4.1 All rentals shall be paid by debit order, on either any working day of each month at the Rentee's election. In the event that the delivery date does not fall on the specific day of the month, the rental for that month will be calculated pro-rata and paid in advance by the Rentee. The last rental payment shall be payable on the date;
4.2 The Rentee shall not withhold, defer or make any deduction whatsoever from any rental payment due, whether or not the Rentor is indebted to the Rentee or in breach of any obligation to the Rentee.
4.3 The rental and all other amounts payable by the Rentee under this Agreement shall be inclusive of Value Added Tax in so far as it is applicable.
4.4 The total monthly rental shall escalate by 4% (four) annually, on the anniversary of the Delivery Date.
4.5 If so elected by the Rentee, the total monthly rental shall fluctuate with the Prime Rate.
4.6 The Rentee shall be liable for interest on all overdue amounts payable in terms of this agreement calculated at 2% per month, reckoned from the date upon which the payment fell due.

5. SECURITY DEPOSIT
5.1 A security deposit shall be paid upon signature of this Agreement by the Rentee. No interest shall accrue to the security deposit during the period of the Agreement.
5.2 Once all the obligations due by the Rentee to the Rentor have been discharged following upon the expiry of this Agreement, the Rentor shall refund to the Rentee, free of interest, so much of the security deposit has not been applied in settlement of any amounts owing by the Rentee to the Rentor in terms of this Agreement.

6. KEY DEPOSIT
A key deposit for an amount equal to that shall be paid by the Rentee to the Rentor upon signature of this Agreement and retained by the Rentor until such time as all keys to the Vehicle are returned to the Rentor. No interest shall accrue to the security deposit during the period of the Agreement.

7. RISK OF LOSS OR DAMAGE
7.1 The Rentee by accepting the Vehicle acknowledges having inspected the Vehicle and receiving the Vehicle in a good and roadworthy condition, free of any obvious defects or damage.
7.2 Should any material defects manifest themselves in the Vehicle within 7 days of the Rentee taking delivery thereof from the Rentor, then on written notice to such effect from the Rentee, the Rentor shall notify the supplier and take steps to have any defect repaired in terms of the manufacturer's warranty. On no account however shall the Rentor be liable for any such defects to the Vehicle.
7.3 The risk in and to the Vehicle shall immediately pass to the Rentee on delivery of the Vehicle and shall remain with the Rentee throughout the entire period of this Agreement.

8. OWNERSHIP
8.1 The Rentor shall at all times remain the owner of the Vehicle. The Rentor may inspect the Vehicle at any reasonable time wherever it may be kept. The Rentee warrants that when it is not been used, the Vehicle shall be kept at the Rentee's address. The Rentee undertakes that in the event of a change of address it shall forthwith notify the Rentor thereof in writing and any failure to do so shall be deemed to be a material breach of this Agreement.
8.1.1 The Rentee shall take ownership of the Vehicle after successfully completion of a fixed 54 months contract as agreed upon.
8.2 The Rentee shall use and operate the Vehicle in compliance with the Road Traffic Laws;
8.3 The Rentee shall not:
8.3.1 use or permit the Vehicle to be used for any commercial enterprise or activities unless permitted to do so with the Rentor's prior written consent;
8.3.2 cause or allow the Vehicle to be neglected, abused, damaged, modified either in terms of its body or its components, tamper with, remove or replace any of the Vehicle's components, or use the Vehicle or allow it to be used for any purpose for which it is not designed or intended to be used or used in circumstances such that there may be an increased risk of danger or a loss or damage or undue wear and tear;
8.3.3 drive or allow the Vehicle to be driven recklessly and/or negligently or in contravention of any road or traffic regulations;
8.3.4 convey any materials or articles in the Vehicle which may cause damage to its upholstery or any other part of the Vehicle;
8.3.5 drive or permit any other person to drive the Vehicle whilst under the influence of alcohol, strong medication or any unlawful drugs;
8.3.6 allow the Vehicle to be in any area such as an unrest area, whether there is or could be an increased risk that the Vehicle may be damaged through civil disturbance, social or economic protest or any act associated with the aforegoing;
8.3.7 permit any unauthorised person to drive the Vehicle during the period of this Agreement;
8.3.8 permit the Vehicle to leave the borders of the Republic of South Africa without the written consent of the Rentor first having been given.
8.4 The Rentee shall at all times exercise due care, to the extent that the Rentee will:
8.4.1 take all reasonable precautions to safeguard the Vehicle;
8.5.1 whenever the Vehicle is left parked or unattended, all doors and windows are locked and the alarm/immobilizer device is activated;
8.5.2 the doors of the Vehicle are locked and the keys to the Vehicle are in his possession.

9. VEHICLE MAINTENANCE
9.1 The Rentee shall exercise that degree of care necessary to maintain the Vehicle in a good and roadworthy condition, using the same degree of care as would ordinarily be exercised if the Vehicle belonged to the Rentee;
9.2 The Rentee shall abide by the manufacturers specifications in regard to the Vehicle and shall not change or alter any aspect of the Vehicle without the Rentor's prior written consent to do so;
9.3 The Rentee shall not remove or tamper with the tracking system or immobilizer fitted to the Vehicle or render same inoperable;
9.4 The Rentee shall ensure that they make contact to our car care department to ensure the Vehicle is pre-booked for service as prescribed by the manufacturer, acknowledging in this regard that all costs of service including the cost of tyres, fuel, oil and consumables are for the Rentee's account. Service and maintenance of the Vehicle must be carried out by a manufacturer approved dealer or a dealer approved by the Rentor;
9.5 Where the Rentee fails to submit the Vehicle for its recommended service timeously and the maintenance or service plan is terminated, the Rentee shall be responsible for and shall pay to the Rentor, on demand, any cost associated with re-instating the maintenance and/or service plan together with an administration fee of R500.
9.6 All parts and accessories that are replaced or added to the Vehicle during the rental period shall become the Rentor's property and the Rentee shall not be entitled to be compensated therefor.

10. LIMITATION ON TRAVEL
10.1 The maximum distance that the Rentee may travel in the Vehicle each month from the commencement date of this agreement is unlimited.

11. COLLISION DAMAGE, THEFT OR TOTAL LOSS
11.1 The Rentee shall immediately, but in any event, within a period of no later than 24 hours:
11.1.1 notify the Rentor by telephone and in writing of any accident in which the Vehicle has been involved or of any theft of the Vehicle;
11.1.2 report such accident or theft to the South African Police Services and immediately provide the Police case reference number to the Rentor;
11.1.3 where possible, obtain the name and address of all parties involved in the accident and any witnesses to the accident;
11.1.4 shall not acknowledge responsibility or liability for the accident or release any party from any potential liability, nor settle any claim or potential claim against or by any party, nor accept any disclaimed liability.
11.2 Where the Vehicle is unable to be driven after an accident, the Rentee shall permit only a tow truck authorised by the Rentor or the Rentor's insurer to remove the Vehicle;
11.3 The Rentee shall be responsible for any amount in excess of the Damage and Loss Liability Waivers as referred to in paragraph 1;
11.4 Any accidental damage to the Vehicle shall be repaired by a panel beater or other appropriate service provider or technician, approved by the Rentor;
11.5 Where the damage to the Vehicle is of such a nature that the cost of repair exceeds the value of the Vehicle the Rentee shall be liable for the difference between the Fair Value of the Vehicle and the compensation paid by the Rentor's insurer for the Vehicle.
11.6 Similarly, where the damage to the Vehicle may not render the Vehicle a write-off but the Vehicle suffers damage that affects its Fair Value, the Rentee shall be responsible for the difference between the actual value of the Vehicle after the accident, as determined by an expert and the Fair Value thereof.
11.7 Subject to the provisions of paragraphs 11.5 and 11.6 above, the Rentor, at its sole discretion and once the Rentor has been compensated for its loss aforementioned, may provide to the Rentee a replacement Vehicle of similar value and specifications where the Rentee's Vehicle is damaged beyond repair. The Rentee may accept the replacement Vehicle or elect to exercise his right to Early Termination of the Agreement.

12. FINES AND PENALTIES
12.1 The Rentee shall be responsible for fines and penalties imposed for road traffic offences provided that the Rentee shall pay the fine or penalty imposed together with an administrative fee of R250 for each fine or penalty, upon demand by the Rentor;
12.2 In circumstances where the Rentee receives 12 or more traffic fines or penalties during a 12 month cycle this shall be deemed to be a material breach of the Agreement, and the Rentor shall be entitled, at its discretion, to terminate this Agreement forthwith and proceed in accordance with paragraph 22 below;
12.3 The Rentee shall pay all road tolls levied, provided that where the Rentee does not pay such toll or does not subscribe for an e-toll tag, then any such tolls that become payable by the Rentor shall be paid by the Rentee together with an administration fee of R250 for each toll claim, upon demand by the Rentor.

13. ROAD LICENSE
The Rentee shall be responsible for the renewal of the annual road license.

14. TRACKER AND IMMOBILISER
14.1 A tracker and immobilizer devices have already been installed on the vehicle prior to delivery;
14.2 Under no circumstances whatsoever shall the Rentee be entitled to remove the tracker and the immobilizer device and any removal thereof shall be deemed to be a material breach of this Agreement permitting the immediate termination of this Agreement by the Rentor;
14.3 The Rentee irrevocably consents to the Vehicle being tracked by the Rentor and irrevocably consents to the Vehicle being remotely immobilized where:
14.3.1 the Vehicle has been stolen or has been used without authority; or
14.3.2 in circumstances where the Rentee is in breach of the payment terms of this Agreement and has failed, despite written notice having been given, to rectify the breach.

15. REMOVAL OF THE VEHICLE
15.1 The Rentee irrevocably consents to the removal of the Vehicle from his possession in circumstances where he is in breach of a material term of the Agreement and the Rentor has complied with the provisions of paragraph 22 below;
15.2 The aforesaid removal does not preclude the Rentee from such other rights as he may have in law to dispute the alleged breach and to seek the return of the Vehicle.

16. DAMAGE AND LOSS LIABILITY WAIVER
16.1 The Rentee's liability in the case of accident damage or loss through theft or highjacking is limited by the Damage and Loss Liability Waivers and the Rentee will only be liable for the amount in excess of the Damage and Loss Liability Waivers as referred to in paragraph 1;
16.2 The Rentee shall provide to the Rentor all the information which might be relevant to the Damage and Loss Liability Waivers;
16.3 Where the Damage and Loss Liability Waivers may not include cover for windscreens or tyres, the Rentee shall be liable for the cost of repairing and replacing the windscreen, any other glass and the tyres fitted to the Vehicle during the term of this Agreement;
16.4 The Rentee shall be responsible for any damage or loss to the vehicle where a claim is repudiated on one or more of the general conditions or exceptions under the Rentor's Insurance Policy and where the Rentee is the cause of the repudiation.

17. THE NATIONAL CREDIT ACT
The provisions of the National Credit Act No 24 of 2005 do not apply to the transaction recorded in this Agreement.

18. EARLY TERMINATION
18.1 An Early Termination arises in the following circumstances:
18.1.1 Where the Rentee's vehicle has been damaged beyond commercial repair but subject to the Rentor being compensated as envisaged in paragraph 11.6, the Rentee may elect to exercise his right to an Early Termination of the Agreement.
18.1.2 the death of the Rentee;
18.1.3 by agreement between the Rentor and the Rentee;
18.1.4 for good cause, at the discretion of the Rentor.
18.2 In order to exercise the right to an Early Termination the Rentee shall deliver written notice of Early Termination to the Rentor, where after Early Termination shall be considered.

19. WARRANTIES
The Rentee warrants:
19.1 That a full disclosure of all material facts has been made which would have enabled the Rentor to make an informed decision when concluding this Agreement and renting the Vehicle to the Rentee;
19.2 The Rentee has a valid and current drivers license which has not, in the 12 months preceding the Delivery Date, been revoked, suspended or endorsed;
19.3 He has not been refused insurance by any motor vehicle insurer for a period of 5 years preceding the Delivery Date;
19.4 All credit card and bank account details provided by the Rentee to the Rentor are correct, current and accurate.

20. INDEMNITIES
The Rentee hereby indemnifies the Rentor and holds it harmless against:
20.1 Any road traffic fines, penalties or levies imposed by any Road Traffic or Municipal authority;
20.2 Any claims of whatsoever nature, by any third party as a result of any incident involving or which relates to the Vehicle or the Rentee's use thereof, and where such claim is not covered by the Vehicle's insurance policy.

21. BREACH
21.1 In the event that the Rentee:
21.1.1 has made any misrepresentation to the Rentor relating to this Agreement;
21.1.2 breaches any material term of the Agreement;
21.1.3 voids the manufacturers warranty or incurs damage to the Vehicle in circumstances where the Rentor's insurer repudiates the claim;
21.1.4 fails to maintain the Vehicle in accordance with the maintenance provisions of this Agreement;
21.1.5 repeatedly disobeys the Road Traffic Laws;
21.1.6 has his license suspended, revoked or restricted in any way; then
21.2 the Rentor shall be entitled, without prejudice to any other rights it may have, to terminate this Agreement forthwith by giving the Rentee written notice of the breach and may thereafter:
21.2.1 collect and repossess the Vehicle without being required to obtain an order of court;
21.2.2 recover all outstanding rentals due in terms of this Agreement, all of which shall become immediately due and payable in full in the event of such breach;
21.3 Where the Rentee fails to pay timeously any amount payable in terms of this Agreement after having been given 5 days written notice to remedy such default, the Rentor shall be entitled to cancel this Agreement and without prejudice to any other rights it may have, collect and repossess the Vehicle as permitted in 15.1.

22. ADDRESSES AND NOTICES
22.1 For the purpose of this Agreement, including the giving of notices in terms hereof and the serving of legal process, the parties choose domicilium citandi et executandi ("domicilium") as indicated in paragraph 1.
22.2 Any notice or communication given in terms of this Agreement, may be delivered by hand to the domicilium chosen by the party concerned. Any notice or process delivered on any party in connection with any matter or subject arising out of this Agreement or any notice shall be deemed to have been delivered if handed to any responsible person at the domicilium chosen by any party and it shall not be necessary to hand such process or notice to any party personally.
22.3 Any of the parties shall be entitled from time to time, by written notice to the others, to vary its/his domicilium to any other physical address within the Republic of South Africa.
22.4 A notice given as set out above shall be presumed to have been duly delivered on the date of delivery if delivered by hand.
22.5 Any notice which is transmitted by electronic mail to the recipient at the recipient's e-mail address for the time being shall be presumed, until the contrary is proved by the recipient, to have been received by the recipient on the first business day after the date of successful transmission thereof.

23. GENERAL
23.1 This Agreement constitutes the whole Agreement between the parties relating to the subject matter hereof.
23.2 No amendment or consensual cancellation of this Agreement or any provision or term thereof or of any Agreement or other document issued or executed pursuant to or in terms of this Agreement and no settlement of any disputes arising under this Agreement and no extension of time, waiver or relaxation or suspension of any of the provisions or terms of this Agreement or of any Agreement or other document issued pursuant to or in terms of this Agreement shall be binding unless recorded in a written document signed by the parties. Any such extension, waiver or relaxation or suspension which is so given or made shall be strictly construed as relating strictly to the matter in respect whereof it was made or given.
23.3 No extension of time or waiver or relaxation of any of the provisions or terms of this Agreement or any Agreement or other document issued or executed pursuant to or in terms of this Agreement, shall operate as an estoppel against any party in respect of its rights under this Agreement, nor shall it operate so as to preclude such party thereafter from exercising its rights strictly in accordance with this Agreement.
23.4 No party shall be bound by any express or implied term, representation, warranty, promise or the like not recorded herein, whether it induced the contract and/or whether it was negligent or not.

24. CONSENT TO JURISDICTION
The parties hereby consent to the non-exclusive jurisdiction of the Cape Town Magistrate's Court in respect of any and all proceedings arising under or by virtue of this Agreement whether in respect of damages or otherwise, despite the subject matter and/or cause of action which would otherwise have been beyond such court's jurisdiction.

25. ACKNOWLEDGEMENT
The Rentee acknowledges that he has read and understands the terms and conditions of this Agreement and has no objection thereto.`;

interface ContractData {
  referenceNumber: string;
  contractVehicleTitle: string | null;
  contractVehicleImage: string | null;
  contractVehicleYearModel: string | null;
  contractVehicleMileage: string | null;
  contractVehicleTransmission: string | null;
  contractVehicleFuelType: string | null;
  contractDepositAmount: string | null;
  contractLicensingFee: string | null;
  contractMonthlyPayment: string | null;
  contractTotalPayableNow: string | null;
  contractTerm: string | null;
  contractClientFullName: string | null;
  contractClientEmail: string | null;
  contractClientPhone: string | null;
  contractClientIdentityType: string | null;
  contractClientIdentityNumber: string | null;
  contractClientAddress: string | null;
  contractTerms: string | null;
  contractIssuedAt: Date | string | null;
}

interface ContractReviewModalProps {
  contract: ContractData;
}

function fmtCurrency(value: string | null | undefined) {
  if (!value) return "—";
  const cleaned = value.replace(/[^\d.-]/g, "");
  const num = Number(cleaned);
  if (!Number.isFinite(num)) return value;
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(num);
}

function fmtDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function PortalLayer({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}

export default function ContractReviewModal({
  contract,
}: ContractReviewModalProps) {
  const [open, setOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const handlePrint = useCallback(() => {
    if (!printRef.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const content = printRef.current.innerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Auto Access — Vehicle Rental Agreement</title>
        <style>
          @page { margin: 20mm 18mm; size: A4; }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
            color: #1b2345;
            line-height: 1.65;
            font-size: 11pt;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            padding: 24px;
          }
          .print-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 3px solid #1b2345;
            padding-bottom: 16px;
            margin-bottom: 24px;
          }
          .print-header h1 {
            font-size: 22pt;
            font-weight: 700;
            letter-spacing: -0.02em;
            color: #1b2345;
          }
          .print-header p {
            font-size: 9pt;
            color: #68708a;
            margin-top: 2px;
          }
          .print-header img {
            height: 48px;
            width: auto;
          }
          .section-title {
            font-size: 11pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #1b2345;
            border-bottom: 1.5px solid #e1e4ee;
            padding-bottom: 6px;
            margin-top: 28px;
            margin-bottom: 14px;
          }
          .detail-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px 32px;
            margin-bottom: 18px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            border-bottom: 1px solid #f0f1f5;
          }
          .detail-label { color: #68708a; font-size: 10pt; }
          .detail-value { font-weight: 600; font-size: 10pt; text-align: right; }
          .financial-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eef0f7; }
          .financial-total { font-weight: 700; font-size: 12pt; color: #1b2345; border-top: 2px solid #1b2345; padding-top: 10px; margin-top: 4px; }
          .terms-text { font-size: 9.5pt; line-height: 1.7; white-space: pre-wrap; color: #39425d; }
          .signature-block {
            margin-top: 40px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 48px;
          }
          .sig-line {
            border-top: 1.5px solid #1b2345;
            padding-top: 8px;
            margin-top: 48px;
          }
          .sig-label { font-size: 9pt; color: #68708a; }
          .print-footer {
            margin-top: 32px;
            padding-top: 12px;
            border-top: 1px solid #e1e4ee;
            font-size: 8pt;
            color: #a3aac0;
            text-align: center;
          }
        </style>
      </head>
      <body>${content}</body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 400);
  }, []);

  const termsText = contract.contractTerms || AUTO_ACCESS_DEFAULT_TERMS;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-6 py-4 text-sm font-bold text-white shadow-[0_14px_30px_-10px_rgba(213,151,88,0.55)] transition hover:from-[#c4863f] hover:to-[#d59758]"
      >
        <svg
          className="h-5 w-5 transition group-hover:scale-105"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        Review Full Contract
      </button>

      {open ? (
        <PortalLayer>
          <div className="fixed inset-0 z-[999999] bg-[#0b1532]/85 backdrop-blur-sm">
            <div className="flex h-screen flex-col">
              <div className="shrink-0 border-b border-white/10 bg-[#0b1532]/95 px-4 py-3 backdrop-blur-xl sm:px-6">
                <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src="/auto-access-logo.png"
                      alt="Auto Access"
                      className="h-8 w-auto shrink-0 brightness-0 invert"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
                        Vehicle Rental Agreement
                      </p>
                      <p className="truncate text-xs font-medium text-white/70">
                        Ref: {contract.referenceNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 6 2 18 2 18 9" />
                        <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                        <rect x="6" y="14" width="12" height="8" />
                      </svg>
                      Print / Download
                    </button>

                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                      aria-label="Return and Confirm"
                      title="Return and Confirm"
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-hidden">
                <div className="mx-auto flex h-full max-w-[1400px] flex-col px-3 py-3 sm:px-4 sm:py-4">
                  <div className="min-h-0 flex-1 overflow-hidden rounded-[28px] border border-[#dbe0ed] bg-white shadow-[0_40px_100px_-30px_rgba(11,21,50,0.5)]">
                    <div className="h-full overflow-y-auto">
                      <div className="mx-auto w-full max-w-[980px] p-6 sm:p-8 md:p-10 lg:p-12">
                        <div ref={printRef}>
                          <div className="print-header flex flex-wrap items-center justify-between gap-4 border-b-[3px] border-[#1b2345] pb-5">
                            <div>
                              <h1 className="text-[1.6rem] font-bold tracking-tight text-[#1b2345] sm:text-[1.85rem]">
                                Vehicle Rental Agreement
                              </h1>
                              <p className="mt-1 text-xs font-medium text-[#68708a]">
                                Auto Access · Rent-to-Own
                              </p>
                            </div>
                            <img
                              src="/auto-access-logo.png"
                              alt="Auto Access"
                              className="h-10 w-auto sm:h-12"
                            />
                          </div>

                          <div className="mt-6 flex flex-wrap items-center gap-4">
                            <span className="rounded-full border border-[#dbe6ff] bg-[#eef4ff] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#2f67de]">
                              Ref: {contract.referenceNumber}
                            </span>
                            <span className="text-xs font-medium text-[#68708a]">
                              Issued: {fmtDate(contract.contractIssuedAt)}
                            </span>
                            {contract.contractTerm ? (
                              <span className="text-xs font-medium text-[#68708a]">
                                Term: {contract.contractTerm} months
                              </span>
                            ) : null}
                          </div>

                          <div className="mt-8">
                            <h2 className="section-title border-b-[1.5px] border-[#e1e4ee] pb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#1b2345]">
                              Client Details
                            </h2>
                            <div className="detail-grid mt-3 grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
                              <div className="detail-row flex items-center justify-between border-b border-[#f0f1f5] py-2.5">
                                <span className="detail-label text-sm text-[#68708a]">
                                  Full Name
                                </span>
                                <span className="detail-value text-sm font-semibold text-[#1b2345]">
                                  {contract.contractClientFullName || "—"}
                                </span>
                              </div>
                              <div className="detail-row flex items-center justify-between border-b border-[#f0f1f5] py-2.5">
                                <span className="detail-label text-sm text-[#68708a]">
                                  Email
                                </span>
                                <span className="detail-value text-sm font-semibold text-[#1b2345]">
                                  {contract.contractClientEmail || "—"}
                                </span>
                              </div>
                              <div className="detail-row flex items-center justify-between border-b border-[#f0f1f5] py-2.5">
                                <span className="detail-label text-sm text-[#68708a]">
                                  Phone
                                </span>
                                <span className="detail-value text-sm font-semibold text-[#1b2345]">
                                  {contract.contractClientPhone || "—"}
                                </span>
                              </div>
                              <div className="detail-row flex items-center justify-between border-b border-[#f0f1f5] py-2.5">
                                <span className="detail-label text-sm text-[#68708a]">
                                  {contract.contractClientIdentityType || "ID Number"}
                                </span>
                                <span className="detail-value text-sm font-semibold text-[#1b2345]">
                                  {contract.contractClientIdentityNumber || "—"}
                                </span>
                              </div>
                              {contract.contractClientAddress ? (
                                <div className="detail-row col-span-1 flex items-center justify-between border-b border-[#f0f1f5] py-2.5 sm:col-span-2">
                                  <span className="detail-label text-sm text-[#68708a]">
                                    Address
                                  </span>
                                  <span className="detail-value text-right text-sm font-semibold text-[#1b2345]">
                                    {contract.contractClientAddress}
                                  </span>
                                </div>
                              ) : null}
                            </div>
                          </div>

                          <div className="mt-8">
                            <h2 className="section-title border-b-[1.5px] border-[#e1e4ee] pb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#1b2345]">
                              Vehicle Details
                            </h2>
                            {contract.contractVehicleImage ? (
                              <div className="mt-4 overflow-hidden rounded-2xl border border-[#e7eaf2] bg-[#f4f6fb]">
                                <img
                                  src={contract.contractVehicleImage}
                                  alt={contract.contractVehicleTitle || "Vehicle"}
                                  className="h-[220px] w-full object-cover"
                                />
                              </div>
                            ) : null}
                            <div className="detail-grid mt-4 grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
                              <div className="detail-row flex items-center justify-between border-b border-[#f0f1f5] py-2.5">
                                <span className="detail-label text-sm text-[#68708a]">
                                  Vehicle
                                </span>
                                <span className="detail-value text-sm font-semibold text-[#1b2345]">
                                  {contract.contractVehicleTitle || "—"}
                                </span>
                              </div>
                              <div className="detail-row flex items-center justify-between border-b border-[#f0f1f5] py-2.5">
                                <span className="detail-label text-sm text-[#68708a]">
                                  Year Model
                                </span>
                                <span className="detail-value text-sm font-semibold text-[#1b2345]">
                                  {contract.contractVehicleYearModel || "—"}
                                </span>
                              </div>
                              <div className="detail-row flex items-center justify-between border-b border-[#f0f1f5] py-2.5">
                                <span className="detail-label text-sm text-[#68708a]">
                                  Mileage
                                </span>
                                <span className="detail-value text-sm font-semibold text-[#1b2345]">
                                  {contract.contractVehicleMileage || "—"}
                                </span>
                              </div>
                              <div className="detail-row flex items-center justify-between border-b border-[#f0f1f5] py-2.5">
                                <span className="detail-label text-sm text-[#68708a]">
                                  Transmission
                                </span>
                                <span className="detail-value text-sm font-semibold text-[#1b2345]">
                                  {contract.contractVehicleTransmission || "—"}
                                </span>
                              </div>
                              <div className="detail-row flex items-center justify-between border-b border-[#f0f1f5] py-2.5">
                                <span className="detail-label text-sm text-[#68708a]">
                                  Fuel Type
                                </span>
                                <span className="detail-value text-sm font-semibold text-[#1b2345]">
                                  {contract.contractVehicleFuelType || "—"}
                                </span>
                              </div>
                              {contract.contractTerm ? (
                                <div className="detail-row flex items-center justify-between border-b border-[#f0f1f5] py-2.5">
                                  <span className="detail-label text-sm text-[#68708a]">
                                    Contract Term
                                  </span>
                                  <span className="detail-value text-sm font-semibold text-[#1b2345]">
                                    {contract.contractTerm} months
                                  </span>
                                </div>
                              ) : null}
                            </div>
                          </div>

                          <div className="mt-8">
                            <h2 className="section-title border-b-[1.5px] border-[#e1e4ee] pb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#1b2345]">
                              Financial Summary
                            </h2>
                            <div className="mt-3 space-y-0">
                              <div className="financial-row flex items-center justify-between border-b border-[#eef0f7] py-3">
                                <span className="text-sm text-[#68708a]">
                                  Deposit
                                </span>
                                <span className="text-sm font-semibold text-[#1b2345]">
                                  {fmtCurrency(contract.contractDepositAmount)}
                                </span>
                              </div>
                              <div className="financial-row flex items-center justify-between border-b border-[#eef0f7] py-3">
                                <span className="text-sm text-[#68708a]">
                                  Licensing & Registration Fee
                                </span>
                                <span className="text-sm font-semibold text-[#1b2345]">
                                  {fmtCurrency(contract.contractLicensingFee)}
                                </span>
                              </div>
                              <div className="financial-total flex items-center justify-between border-t-2 border-[#1b2345] pt-3">
                                <span className="text-sm font-bold text-[#1b2345]">
                                  Total Required Now
                                </span>
                                <span className="text-lg font-bold text-[#2f67de]">
                                  {fmtCurrency(contract.contractTotalPayableNow)}
                                </span>
                              </div>
                              <div className="financial-row mt-1 flex items-center justify-between border-t border-[#eef0f7] py-3">
                                <span className="text-sm text-[#68708a]">
                                  Monthly Instalment
                                </span>
                                <span className="text-sm font-semibold text-[#1b2345]">
                                  {fmtCurrency(contract.contractMonthlyPayment)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-10">
                            <h2 className="section-title border-b-[1.5px] border-[#e1e4ee] pb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#1b2345]">
                              Terms and Conditions
                            </h2>
                            <div className="terms-text mt-4 whitespace-pre-wrap rounded-xl border border-[#e7eaf2] bg-[#fafbff] p-5 text-[13px] leading-[1.75] text-[#39425d] sm:p-6">
                              {termsText}
                            </div>
                          </div>

                          <div className="signature-block mt-10 grid grid-cols-1 gap-12 sm:grid-cols-2">
                            <div>
                              <div className="sig-line mt-16 border-t-[1.5px] border-[#1b2345] pt-2">
                                <p className="sig-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">
                                  Rentee (Client) Signature
                                </p>
                                <p className="mt-1 text-xs text-[#a3aac0]">
                                  {contract.contractClientFullName || "Client Name"}
                                </p>
                              </div>
                            </div>
                            <div>
                              <div className="sig-line mt-16 border-t-[1.5px] border-[#1b2345] pt-2">
                                <p className="sig-label text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">
                                  Rentor (Auto Access) Signature
                                </p>
                                <p className="mt-1 text-xs text-[#a3aac0]">
                                  Auto Access
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="print-footer mt-8 border-t border-[#e1e4ee] pt-4 text-center">
                            <p className="text-[10px] text-[#a3aac0]">
                              Auto Access · Vehicle Rental Agreement · Ref:{" "}
                              {contract.referenceNumber}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex shrink-0 justify-center gap-3">
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="inline-flex items-center gap-2 rounded-full border border-[#1b2345] bg-white px-6 py-3 text-sm font-semibold text-[#1b2345] transition hover:bg-[#f4f6fb]"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 6 2 18 2 18 9" />
                        <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                        <rect x="6" y="14" width="12" height="8" />
                      </svg>
                      Download Contract
                    </button>

                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#c37d43] px-8 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(213,151,88,0.55)] transition hover:from-[#c37d43] hover:to-[#b86e35]"
                    >
                      Return and Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PortalLayer>
      ) : null}
    </>
  );
}