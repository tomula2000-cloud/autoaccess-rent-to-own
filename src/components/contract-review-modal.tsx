"use client";
import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import SignatureCanvas from "react-signature-canvas";
import { useRouter } from "next/navigation";

const AUTO_ACCESS_DEFAULT_TERMS = `TERMS AND CONDITIONS

1. DEFINITIONS AND INTERPRETATION

1.1 In this Agreement:
1.1.1 Clause headings are for the purposes of convenience and reference only and shall not be used in the interpretation of any of the provisions of this Agreement;
1.1.2 The parties shall, wherever necessary and appropriate, be referred to by their defined designations as in 1.2 below;
1.1.3 A reference to:
1.1.3.1 one gender shall include the other gender;
1.1.3.2 the singular shall include the plural and vice versa;
1.1.3.3 a natural person shall include corporate or un-incorporate created entities and vice versa;
1.1.3.4 all of the schedules and/or annexures are incorporated herein and shall have the same force and effect as if they were set out in the body of this Agreement;
1.1.3.5 words and/or expressions defined in this Agreement shall bear the same meanings in any Schedules and/or annexures hereto which do not contain their own defined words and/or expressions;
1.1.3.6 where a period consisting of a number of days is prescribed, it shall be determined by excluding the first and including the last day;
1.1.3.7 where the day upon or by which any act is required to be performed is a Saturday, Sunday or public holiday in the Republic of South Africa, the parties shall be deemed to have intending such act to be performed upon or by the first day thereafter which is not a Saturday, Sunday or a public holiday;
1.1.3.8 where an expression has been defined (whether in 1.2 below or elsewhere in this Agreement) and such definition contains a provision conferring rights or imposing obligations on any party, effect shall be given to that provision as if it were a substantive provision contained in the body of this Agreement;
1.1.3.9 if figures are referred to in numbers and words, the words shall prevail in the event of any conflict between the two;
1.1.3.10 words and/or expressions defined in this Agreement shall, unless the application of such word and/or expression is specifically limited to that clause, bear the meaning so assigned to it;
1.1.3.11 the contra proferentem rule shall not apply and accordingly, none of the provisions hereof shall be constructed against or interpreted to the disadvantage of the party responsible for the drafting or preparation of such provision;
1.1.3.12 the generis rule shall not apply, and whenever a provision is followed by the word "including" and specific examples, such examples shall not be constructed so as to limit the ambit of the provision concerned;
1.1.3.13 a reference to any statutory enactment shall be construed as a reference to that enactment as the signature date and as amending or re-enacted from time to time thereafter;
1.1.3.14 the expiration or termination of this Agreement shall not affect such of its provisions as expressly provided that they will continue to apply after such expiration or termination or which of necessity must continue to apply after such expiration or termination;
1.1.3.15 any communication which is required to be "in writing" shall include a communication which is written or produced by any substitute for writing or which is partly written and partly so produced, and shall include printing, typewriting, lithography, facsimile or electronic mail or any form of electronic communication or other process or partly one and partly another.

1.2 In this Agreement, unless clearly inconsistent with or otherwise indicated by the context, with cognate expressions having corresponding meanings:
1.2.1 "Agreement" or "this Agreement" means this Vehicle Rental Agreement concluded between the Rentor and the Rentee;
1.2.2 "Base Rental" means the monthly rental payable for the use and enjoyment of the Vehicle, inclusive of limited Damage and Loss Liability Waivers, and the monthly tracker and immobilizer fee but excluding the monthly rental payments for any Additional Rental Benefits;
1.2.3 "Delivery Date" means the date upon which the Rentee takes delivery of the Vehicle;
1.2.4 "Early Termination" means the termination of the Agreement for those reasons in paragraph 18;
1.2.5 "Early Termination Settlement" means the figure payable as a result of an Early Termination. The Early Termination Settlement in circumstances where the vehicle is damaged beyond repair shall be an amount equal to the difference between the nett present value of the remaining rentals due in terms of this Agreement calculated at Prime plus 2% and the vehicles post-accident value plus 10% of the value of the remaining rentals due in terms of this Agreement as at the date of Early Termination. In all other circumstances giving rise to Early Termination Settlement should be the amount equal to the nett present value of the remaining rentals due in terms of this Agreement less the trade value of the Vehicle (as determined in Meade and McGrouther) plus 10% of the value of the remaining rentals due in terms of this Agreement as at the date of Early Termination;
1.2.6 "Fair Value" means the value of the Vehicle from time to time determined by reference to the mean average between the trade value and the retail value contained in the most recent published edition of Meade and McGrouther;
1.2.7 "Damage and Loss Liability Waivers" means the amount by which the Rentee's liability in the case of accident damage to or loss of the vehicle through theft or highjacking will be limited subject to the terms and conditions of this Agreement;
1.2.8 "Prime Rate" means the publicly quoted basic annual rate of interest at which Standard Bank lends on overdraft;
1.2.9 "Road Traffic Laws" means the National Road Traffic Act No 93 of 1996 and any supplementary or replacement legislation together with all applicable provincial and municipal road traffic by-laws and regulations;
1.2.10 "Vehicle" means the motor Vehicle described.

2. DURATION
This Agreement shall be deemed to have commenced on the date of delivery of the Vehicle to the Rentee and shall remain in force until the Expiry Date.

3. PAYMENT OF RENTALS
3.1 All rentals shall be paid by debit order, on either any working day of each month at the Rentee's election. In the event that the delivery date does not fall on the specific day of the month, the rental for that month will be calculated pro-rata and paid in advance by the Rentee. The last rental payment shall be payable on the date;
3.2 The Rentee shall not withhold, defer or make any deduction whatsoever from any rental payment due, whether or not the Rentor is indebted to the Rentee or in breach of any obligation to the Rentee;
3.3 The rental and all other amounts payable by the Rentee under this Agreement shall be inclusive of Value Added Tax in so far as it is applicable;
3.4 The total monthly rental shall escalate by 4% (four) annually, on the anniversary of the Delivery Date;
3.5 If so elected by the Rentee, the total monthly rental shall fluctuate with the Prime Rate;
3.6 The Rentee shall be liable for interest on all overdue amounts payable in terms of this agreement calculated at 2% per month, reckoned from the date upon which the payment fell due.

4. SECURITY DEPOSIT
4.1 A security deposit shall be paid upon signature of this Agreement by the Rentee. No interest shall accrue to the security deposit during the period of the Agreement;
4.2 Once all the obligations due by the Rentee to the Rentor have been discharged following upon the expiry of this Agreement, the Rentor shall refund to the Rentee, free of interest, so much of the security deposit has not been applied in settlement of any amounts owing by the Rentee to the Rentor in terms of this Agreement.

5. KEY DEPOSIT
A key deposit for an amount equal to that shall be paid by the Rentee to the Rentor upon signature of this Agreement and retained by the Rentor until such time as all keys to the Vehicle are returned to the Rentor. No interest shall accrue to the security deposit during the period of the Agreement.

6. RISK OF LOSS OR DAMAGE
6.1 The Rentee by accepting the Vehicle acknowledges having inspected the Vehicle and receiving the Vehicle in a good and roadworthy condition, free of any obvious defects or damage;
6.2 Should any material defects manifest themselves in the Vehicle within 7 days of the Rentee taking delivery thereof from the Rentor, then on written notice to such effect from the Rentee, the Rentor shall notify the supplier and take steps to have any defect repaired in terms of the manufacturer's warranty. On no account however shall the Rentor be liable for any such defects to the Vehicle;
6.3 The risk in and to the Vehicle shall immediately pass to the Rentee on delivery of the Vehicle and shall remain with the Rentee throughout the entire period of this Agreement.

7. OWNERSHIP
7.1 The Rentor shall at all times remain the owner of the Vehicle. The Rentor may inspect the Vehicle at any reasonable time wherever it may be kept. The Rentee warrants that when it is not been used, the Vehicle shall be kept at the Rentee's address. The Rentee undertakes that in the event of a change of address it shall forthwith notify the Rentor thereof in writing and any failure to do so shall be deemed to be a material breach of this Agreement;
7.1.1 The Rentee shall take ownership of the Vehicle after successful completion of a fixed 54 months contract as agreed upon;
7.2 The Rentee shall use and operate the Vehicle in compliance with the Road Traffic Laws;
7.3 The Rentee shall not:
7.3.1 use or permit the Vehicle to be used for any commercial enterprise or activities unless permitted to do so with the Rentor's prior written consent;
7.3.2 cause or allow the Vehicle to be neglected, abused, damaged, modified either in terms of its body or its components, tamper with, remove or replace any of the Vehicle's components, or use the Vehicle or allow it to be used for any purpose for which it is not designed or intended to be used or used in circumstances such that there may be an increased risk of danger or a loss or damage or undue wear and tear;
7.3.3 drive or allow the Vehicle to be driven recklessly and/or negligently or in contravention of any road or traffic regulations;
7.3.4 convey any materials or articles in the Vehicle which may cause damage to its upholstery or any other part of the Vehicle;
7.3.5 drive or permit any other person to drive the Vehicle whilst under the influence of alcohol, strong medication or any unlawful drugs;
7.3.6 allow the Vehicle to be in any area such as an unrest area, whether there is or could be an increased risk that the Vehicle may be damaged through civil disturbance, social or economic protest or any act associated with the aforegoing;
7.3.7 permit any unauthorised person to drive the Vehicle during the period of this Agreement;
7.3.8 permit the Vehicle to leave the borders of the Republic of South Africa without the written consent of the Rentor first having been given.
7.4 The Rentee shall at all times exercise due care, to the extent that the Rentee will:
7.4.1 take all reasonable precautions to safeguard the Vehicle;
7.4.2 whenever the Vehicle is left parked or unattended, all doors and windows are locked and the alarm/immobilizer device is activated;
7.4.3 the doors of the Vehicle are locked and the keys to the Vehicle are in his possession.

8. VEHICLE MAINTENANCE
8.1 The Rentee shall exercise that degree of care necessary to maintain the Vehicle in a good and roadworthy condition, using the same degree of care as would ordinarily be exercised if the Vehicle belonged to the Rentee;
8.2 The Rentee shall abide by the manufacturers specifications in regard to the Vehicle and shall not change or alter any aspect of the Vehicle without the Rentor's prior written consent to do so;
8.3 The Rentee shall not remove or tamper with the tracking system or immobilizer fitted to the Vehicle or render same inoperable;
8.4 The Rentee shall ensure that they make contact to our car care department to ensure the Vehicle is pre-booked for service as prescribed by the manufacturer, acknowledging in this regard that all costs of service including the cost of tyres, fuel, oil and consumables are for the Rentee's account. Service and maintenance of the Vehicle must be carried out by a manufacturer approved dealer or a dealer approved by the Rentor;
8.5 Where the Rentee fails to submit the Vehicle for its recommended service timeously and the maintenance or service plan is terminated, the Rentee shall be responsible for and shall pay to the Rentor, on demand, any cost associated with re-instating the maintenance and/or service plan together with an administration fee of R500;
8.6 All parts and accessories that are replaced or added to the Vehicle during the rental period shall become the Rentor's property and the Rentee shall not be entitled to be compensated therefor.

9. LIMITATION ON TRAVEL
9.1 The maximum distance that the Rentee may travel in the Vehicle each month from the commencement date of this agreement is unlimited.

10. COLLISION DAMAGE, THEFT OR TOTAL LOSS
10.1 The Rentee shall immediately, but in any event, within a period of no later than 24 hours:
10.1.1 notify the Rentor by telephone and in writing of any accident in which the Vehicle has been involved or of any theft of the Vehicle;
10.1.2 report such accident or theft to the South African Police Services and immediately provide the Police case reference number to the Rentor;
10.1.3 where possible, obtain the name and address of all parties involved in the accident and any witnesses to the accident;
10.1.4 shall not acknowledge responsibility or liability for the accident or release any party from any potential liability, nor settle any claim or potential claim against or by any party, nor accept any disclaimed liability.
10.2 Where the Vehicle is unable to be driven after an accident, the Rentee shall permit only a tow truck authorised by the Rentor or the Rentor's insurer to remove the Vehicle;
10.3 The Rentee shall be responsible for any amount in excess of the Damage and Loss Liability Waivers as referred to in paragraph 15;
10.4 Any accidental damage to the Vehicle shall be repaired by a panel beater or other appropriate service provider or technician, approved by the Rentor;
10.5 Where the damage to the Vehicle is of such a nature that the cost of repair exceeds the value of the Vehicle the Rentee shall be liable for the difference between the Fair Value of the Vehicle and the compensation paid by the Rentor's insurer for the Vehicle;
10.6 Similarly, where the damage to the Vehicle may not render the Vehicle a write-off but the Vehicle suffers damage that affects its Fair Value, the Rentee shall be responsible for the difference between the actual value of the Vehicle after the accident, as determined by an expert and the Fair Value thereof;
10.7 Subject to the provisions of paragraphs 10.5 and 10.6 above, the Rentor, at its sole discretion and once the Rentor has been compensated for its loss aforementioned, may provide to the Rentee a replacement Vehicle of similar value and specifications where the Rentee's Vehicle is damaged beyond repair. The Rentee may accept the replacement Vehicle or elect to exercise his right to Early Termination of the Agreement.

11. FINES AND PENALTIES
11.1 The Rentee shall be responsible for fines and penalties imposed for road traffic offences provided that the Rentee shall pay the fine or penalty imposed together with an administrative fee of R250 for each fine or penalty, upon demand by the Rentor;
11.2 In circumstances where the Rentee receives 12 or more traffic fines or penalties during a 12 month cycle this shall be deemed to be a material breach of the Agreement, and the Rentor shall be entitled, at its discretion, to terminate this Agreement forthwith and proceed in accordance with paragraph 20 below;
11.3 The Rentee shall pay all road tolls levied, provided that where the Rentee does not pay such toll or does not subscribe for an e-toll tag, then any such tolls that become payable by the Rentor shall be paid by the Rentee together with an administration fee of R250 for each toll claim, upon demand by the Rentor.

12. ROAD LICENSE
The Rentee shall be responsible for the renewal of the annual road license.

13. TRACKER AND IMMOBILISER
13.1 A tracker and immobilizer devices have already been installed on the vehicle prior to delivery;
13.2 Under no circumstances whatsoever shall the Rentee be entitled to remove the tracker and the immobilizer device and any removal thereof shall be deemed to be a material breach of this Agreement permitting the immediate termination of this Agreement by the Rentor;
13.3 The Rentee irrevocably consents to the Vehicle being tracked by the Rentor and irrevocably consents to the Vehicle being remotely immobilized where:
13.3.1 the Vehicle has been stolen or has been used without authority; or
13.3.2 in circumstances where the Rentee is in breach of the payment terms of this Agreement and has failed, despite written notice having been given, to rectify the breach.

14. REMOVAL OF THE VEHICLE
14.1 The Rentee irrevocably consents to the removal of the Vehicle from his possession in circumstances where he is in breach of a material term of the Agreement and the Rentor has complied with the provisions of paragraph 20 below;
14.2 The aforesaid removal does not preclude the Rentee from such other rights as he may have in law to dispute the alleged breach and to seek the return of the Vehicle.

15. DAMAGE AND LOSS LIABILITY WAIVER
15.1 The Rentee's liability in the case of accident damage or loss through theft or highjacking is limited by the Damage and Loss Liability Waivers and the Rentee will only be liable for the amount in excess of the Damage and Loss Liability Waivers;
15.2 The Rentee shall provide to the Rentor all the information which might be relevant to the Damage and Loss Liability Waivers;
15.3 Where the Damage and Loss Liability Waivers may not include cover for windscreens or tyres, the Rentee shall be liable for the cost of repairing and replacing the windscreen, any other glass and the tyres fitted to the Vehicle during the term of this Agreement;
15.4 The Rentee shall be responsible for any damage or loss to the vehicle where a claim is repudiated on one or more of the general conditions or exceptions under the Rentor's Insurance Policy and where the Rentee is the cause of the repudiation.

16. THE NATIONAL CREDIT ACT
The provisions of the National Credit Act No 24 of 2005 do not apply to the transaction recorded in this Agreement.

17. EARLY TERMINATION
17.1 An Early Termination arises in the following circumstances:
17.1.1 Where the Rentee's vehicle has been damaged beyond commercial repair but subject to the Rentor being compensated as envisaged in paragraph 10.6, the Rentee may elect to exercise his right to an Early Termination of the Agreement;
17.1.2 the death of the Rentee;
17.1.3 by agreement between the Rentor and the Rentee;
17.1.4 for good cause, at the discretion of the Rentor.
17.2 In order to exercise the right to an Early Termination the Rentee shall deliver written notice of Early Termination to the Rentor, where after Early Termination shall be considered.

18. WARRANTIES
The Rentee warrants:
18.1 That a full disclosure of all material facts has been made which would have enabled the Rentor to make an informed decision when concluding this Agreement and renting the Vehicle to the Rentee;
18.2 The Rentee has a valid and current drivers license which has not, in the 12 months preceding the Delivery Date, been revoked, suspended or endorsed;
18.3 He has not been refused insurance by any motor vehicle insurer for a period of 5 years preceding the Delivery Date;
18.4 All credit card and bank account details provided by the Rentee to the Rentor are correct, current and accurate.

19. INDEMNITIES
The Rentee hereby indemnifies the Rentor and holds it harmless against:
19.1 Any road traffic fines, penalties or levies imposed by any Road Traffic or Municipal authority;
19.2 Any claims of whatsoever nature, by any third party as a result of any incident involving or which relates to the Vehicle or the Rentee's use thereof, and where such claim is not covered by the Vehicle's insurance policy.

20. BREACH
20.1 In the event that the Rentee:
20.1.1 has made any misrepresentation to the Rentor relating to this Agreement;
20.1.2 breaches any material term of the Agreement;
20.1.3 voids the manufacturers warranty or incurs damage to the Vehicle in circumstances where the Rentor's insurer repudiates the claim;
20.1.4 fails to maintain the Vehicle in accordance with the maintenance provisions of this Agreement;
20.1.5 repeatedly disobeys the Road Traffic Laws;
20.1.6 has his license suspended, revoked or restricted in any way; then
20.2 the Rentor shall be entitled, without prejudice to any other rights it may have, to terminate this Agreement forthwith by giving the Rentee written notice of the breach and may thereafter:
20.2.1 collect and repossess the Vehicle without being required to obtain an order of court;
20.2.2 recover all outstanding rentals due in terms of this Agreement, all of which shall become immediately due and payable in full in the event of such breach;
20.3 Where the Rentee fails to pay timeously any amount payable in terms of this Agreement after having been given 5 days written notice to remedy such default, the Rentor shall be entitled to cancel this Agreement and without prejudice to any other rights it may have, collect and repossess the Vehicle as permitted in 14.1.

21. ADDRESSES AND NOTICES
21.1 For the purpose of this Agreement, including the giving of notices in terms hereof and the serving of legal process, the parties choose domicilium citandi et executandi ("domicilium") as indicated in the parties section;
21.2 Any notice or communication given in terms of this Agreement, may be delivered by hand to the domicilium chosen by the party concerned. Any notice or process delivered on any party in connection with any matter or subject arising out of this Agreement or any notice shall be deemed to have been delivered if handed to any responsible person at the domicilium chosen by any party and it shall not be necessary to hand such process or notice to any party personally;
21.3 Any of the parties shall be entitled from time to time, by written notice to the others, to vary its/his domicilium to any other physical address within the Republic of South Africa;
21.4 A notice given as set out above shall be presumed to have been duly delivered on the date of delivery if delivered by hand;
21.5 Any notice which is transmitted by electronic mail to the recipient at the recipient's e-mail address for the time being shall be presumed, until the contrary is proved by the recipient, to have been received by the recipient on the first business day after the date of successful transmission thereof.

22. GENERAL
22.1 This Agreement constitutes the whole Agreement between the parties relating to the subject matter hereof;
22.2 No amendment or consensual cancellation of this Agreement or any provision or term thereof or of any Agreement or other document issued or executed pursuant to or in terms of this Agreement and no settlement of any disputes arising under this Agreement and no extension of time, waiver or relaxation or suspension of any of the provisions or terms of this Agreement or of any Agreement or other document issued pursuant to or in terms of this Agreement shall be binding unless recorded in a written document signed by the parties. Any such extension, waiver or relaxation or suspension which is so given or made shall be strictly construed as relating strictly to the matter in respect whereof it was made or given;
22.3 No extension of time or waiver or relaxation of any of the provisions or terms of this Agreement or any Agreement or other document issued or executed pursuant to or in terms of this Agreement, shall operate as an estoppel against any party in respect of its rights under this Agreement, nor shall it operate so as to preclude such party thereafter from exercising its rights strictly in accordance with this Agreement;
22.4 No party shall be bound by any express or implied term, representation, warranty, promise or the like not recorded herein, whether it induced the contract and/or whether it was negligent or not.

23. CONSENT TO JURISDICTION
The parties hereby consent to the non-exclusive jurisdiction of the Cape Town Magistrate's Court in respect of any and all proceedings arising under or by virtue of this Agreement whether in respect of damages or otherwise, despite the subject matter and/or cause of action which would otherwise have been beyond such court's jurisdiction.

24. ACKNOWLEDGEMENT
The Rentee acknowledges that he has read and understands the terms and conditions of this Agreement and has no objection thereto.`;

interface ContractData {
  id: string;
  referenceNumber: string;
  contractAccepted?: boolean;
  contractSignatureImage?: string | null;
  contractSignedAt?: Date | string | null;
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

function formatTerm(term: string | null | undefined) {
  if (!term) return "54 Months";
  const cleaned = term.trim().replace(/\s*months?\s*$/i, "");
  return `${cleaned} Months`;
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

const PRINT_STYLES = `
  @page { margin: 14mm 14mm; size: A4; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; color: #1b2345; line-height: 1.55; font-size: 10pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .print-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #1b2345; padding-bottom: 10px; margin-bottom: 4px; }
  .print-header-left { display: flex; align-items: center; gap: 14px; }
  .print-header-logo { height: 64px; width: 64px; object-fit: contain; border-radius: 50%; }
  .print-company-name { font-size: 12pt; font-weight: 700; color: #1b2345; }
  .print-company-reg  { font-size: 8pt; color: #68708a; }
  .print-company-addr { font-size: 8pt; color: #68708a; line-height: 1.5; }
  .print-header-right { text-align: right; }
  .print-doc-title    { font-size: 15pt; font-weight: 700; color: #1b2345; }
  .print-doc-sub      { font-size: 8.5pt; color: #68708a; margin-top: 2px; }
  .print-ref-row { display: flex; justify-content: space-between; font-size: 8.5pt; color: #68708a; margin: 12px 0; padding: 7px 10px; background: #f5f7fb; border-left: 3px solid #c9973a; }
  .print-ref-row span { font-weight: 700; color: #1b2345; }
  .print-section { background: #1b2345; color: #fff; font-size: 8.5pt; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; padding: 5px 10px; margin-top: 14px; }
  .print-parties { display: flex; border: 1px solid #c8d4e8; margin-bottom: 10px; }
  .print-party { flex: 1; padding: 9px 11px; font-size: 8.5pt; line-height: 1.65; }
  .print-party:first-child { border-right: 1px solid #c8d4e8; background: #e8eef7; }
  .print-party-label { font-size: 7.5pt; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #1b2345; margin-bottom: 5px; }
  .print-party-name  { font-size: 10pt; font-weight: 700; color: #1b2345; display: block; margin-bottom: 3px; }
  .print-vehicle-section { display: flex; gap: 0; border: 1px solid #c8d4e8; margin-bottom: 10px; background: #fff; }
  .print-vehicle-img-wrap { flex: 0 0 180px; background: #f5f7fb; display: flex; align-items: center; justify-content: center; border-right: 1px solid #c8d4e8; padding: 6px; }
  .print-vehicle-img { max-width: 100%; max-height: 110px; object-fit: contain; }
  .print-vehicle-grid { flex: 1; display: grid; grid-template-columns: 1fr 1fr 1fr; }
  .print-info-cell { padding: 6px 10px; border-right: 1px solid #e8eef7; border-bottom: 1px solid #e8eef7; }
  .print-info-cell:nth-child(3n) { border-right: none; }
  .print-info-label { font-size: 7pt; color: #68708a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 1px; }
  .print-info-value { font-size: 9pt; font-weight: 700; color: #1b2345; }
  .print-fin-grid { display: flex; border: 1px solid #c8d4e8; margin-bottom: 4px; }
  .print-fin-cell { flex: 1; text-align: center; padding: 9px 6px; border-right: 1px solid #2c4270; background: #1b2345; }
  .print-fin-cell:last-child { border-right: none; }
  .print-fin-label { font-size: 7pt; color: #c8d4e8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
  .print-fin-value { font-size: 12pt; font-weight: 700; color: #c9973a; }
  .print-fin-note  { font-size: 7.5pt; color: #68708a; font-style: italic; margin-top: 4px; padding: 0 4px; }
  .print-terms { font-size: 8pt; line-height: 1.55; white-space: pre-wrap; color: #39425d; padding: 10px 12px; border: 1px solid #c8d4e8; border-top: none; background: #fafbff; }
  .print-sig-grid { display: flex; gap: 48pt; margin-top: 24pt; page-break-inside: avoid; }
  .print-sig-block { flex: 1; }
  .print-sig-line  { border-top: 1.5px solid #1b2345; padding-top: 5px; margin-top: 40pt; }
  .print-sig-role  { font-size: 7.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #68708a; }
  .print-sig-name  { font-size: 8.5pt; color: #a3aac0; margin-top: 2px; }
  .print-footer { margin-top: 18pt; padding-top: 6px; border-top: 1px solid #e1e4ee; font-size: 7pt; color: #a3aac0; text-align: center; }
  .print-gold-bar { height: 2px; background: #c9973a; margin-bottom: 4px; }
  .print-stamp-wrap { position: relative; }
  .print-stamp { position: absolute; right: -18pt; top: -48pt; width: 125pt; height: auto;  opacity: 0.92; transform: rotate(-6deg); pointer-events: none; }

`;

function SlideButton({ label, color, onConfirm, idPrefix }: { label: string; color: string; onConfirm: () => void; idPrefix: string }) {
  const wrapId = idPrefix + "-slide-wrap";
  const thumbId = idPrefix + "-slide-thumb";
  const fillId = idPrefix + "-slide-fill";
  const labelId = idPrefix + "-slide-label";

  function handleStart(clientX: number) {
    const wrap = document.getElementById(wrapId);
    const thumb = document.getElementById(thumbId);
    const fill = document.getElementById(fillId);
    const lbl = document.getElementById(labelId);
    if (!wrap || !thumb || !fill || !lbl) return;
    const maxSlide = wrap.offsetWidth - 56;
    const startX = clientX - (parseFloat(thumb.style.left) - 4);
    const onMove = (ev: MouseEvent | TouchEvent) => {
      const cx = "touches" in ev ? (ev as TouchEvent).touches[0].clientX : (ev as MouseEvent).clientX;
      const pos = Math.max(0, Math.min(cx - startX, maxSlide));
      thumb.style.left = (4 + pos) + "px";
      fill.style.width = (56 + pos) + "px";
      lbl.style.opacity = String(Math.max(0, 1 - (pos / maxSlide) * 2));
      if (pos >= maxSlide - 2) {
        fill.style.background = color;
        thumb.style.background = color;
        cleanup();
        setTimeout(() => { onConfirm(); reset(); }, 300);
      }
    };
    const onUp = () => { reset(); cleanup(); };
    const cleanup = () => {
      document.removeEventListener("mousemove", onMove as EventListener);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onMove as EventListener);
      document.removeEventListener("touchend", onUp);
    };
    const reset = () => {
      if (!thumb || !fill || !lbl) return;
      thumb.style.transition = "left 0.25s";
      fill.style.transition = "width 0.25s, background 0.3s";
      thumb.style.left = "4px"; fill.style.width = "56px";
      fill.style.background = color + "66"; thumb.style.background = "#fff";
      lbl.style.opacity = "1";
      setTimeout(() => { thumb.style.transition = ""; fill.style.transition = "background 0.3s"; }, 250);
    };
    document.addEventListener("mousemove", onMove as EventListener);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchmove", onMove as EventListener, {passive:false});
    document.addEventListener("touchend", onUp);
  }

  return (
    <div id={wrapId} style={{background:"#f4f6fb", height:"52px", borderRadius:"100px", position:"relative", overflow:"hidden", cursor:"pointer", userSelect:"none", border:`1.5px solid ${color}33`}}>
      <div id={fillId} style={{position:"absolute", top:0, left:0, height:"100%", width:"52px", background:color+"66", borderRadius:"100px", transition:"background 0.3s"}}></div>
      <div id={thumbId} style={{position:"absolute", top:"4px", left:"4px", width:"44px", height:"44px", background:"#fff", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.1)", cursor:"grab", zIndex:2, border:`1.5px solid ${color}44`}}
        onMouseDown={(e) => handleStart(e.clientX)}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </div>
      <div id={labelId} style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", paddingLeft:"58px", paddingRight:"12px", pointerEvents:"none"}}>
        <span style={{color:color, fontSize:"12px", fontWeight:600}}>{label}</span>
      </div>
    </div>
  );
}

export default function ContractReviewModal({ contract }: ContractReviewModalProps) {
  const [open, setOpen] = useState(false);
  const [showSignPad, setShowSignPad] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmStep, setConfirmStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signError, setSignError] = useState<string | null>(null);
  const [hasSigned, setHasSigned] = useState(contract.contractAccepted ?? false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [flowStage, setFlowStage] = useState<"idle"|"signing"|"banking"|"processing"|"success">("idle");
  const [bankError, setBankError] = useState<string | null>(null);
  const [bankData, setBankData] = useState({
    clientBankName: "",
    clientAccountHolder: "",
    clientAccountNumber: "",
    clientAccountType: "",
    clientBranchCode: "",
  });
  const printRef = useRef<HTMLDivElement>(null);
  const sigPadRef = useRef<SignatureCanvas | null>(null);
  const router = useRouter();

  const clearSignature = useCallback(() => {
    sigPadRef.current?.clear();
    setSignError(null);
  }, []);

  const submitSignature = useCallback(async () => {
    if (!sigPadRef.current) return;
    if (sigPadRef.current.isEmpty()) {
      setSignError("Please sign in the box above before submitting.");
      return;
    }
    setIsSubmitting(true);
    setSignError(null);
    setFlowStage("signing");
    setShowSignPad(false);
    try {
      const dataUrl = sigPadRef.current.toDataURL("image/png");
      const res = await fetch(`/api/applications/${contract.id}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signatureImage: dataUrl,
          signedName: contract.contractClientFullName,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to submit" }));
        throw new Error(err.error || "Failed to submit signature");
      }
      // Show signing animation for 3 seconds then show banking form
      setTimeout(() => {
        setFlowStage("banking");
        setIsSubmitting(false);
      }, 3000);
    } catch (err: unknown) {
      setSignError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setFlowStage("idle");
      setShowSignPad(true);
      setIsSubmitting(false);
    }
  }, [contract.id, contract.contractClientFullName, router]);

  const submitBanking = useCallback(async () => {
    const { clientBankName, clientAccountHolder, clientAccountNumber, clientAccountType, clientBranchCode } = bankData;
    if (!clientBankName || !clientAccountHolder || !clientAccountNumber || !clientAccountType || !clientBranchCode) {
      setBankError("Please complete all banking fields before continuing.");
      return;
    }
    setIsSubmitting(true);
    setBankError(null);
    try {
      const res = await fetch("/api/portal/sign-and-bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bankData),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to submit" }));
        throw new Error(err.error || "Failed to submit banking details");
      }
      setFlowStage("processing");
      setTimeout(() => {
        setFlowStage("success");
        setTimeout(() => router.refresh(), 3000);
      }, 3000);
    } catch (err: unknown) {
      setBankError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [bankData, router]);


  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const handlePrint = useCallback(() => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const issuedDate = fmtDate(contract.contractIssuedAt);
    const clientName = contract.contractClientFullName || "—";
    const clientId = contract.contractClientIdentityNumber || "—";
    const clientIdType = contract.contractClientIdentityType || "ID Number";
    const clientEmail = contract.contractClientEmail || "—";
    const clientPhone = contract.contractClientPhone || "—";
    const clientAddress = contract.contractClientAddress || "—";
    const vehicleTitle = contract.contractVehicleTitle || "—";
    const vehicleYear = contract.contractVehicleYearModel || "—";
    const vehicleMileage = contract.contractVehicleMileage || "—";
    const vehicleTransmission = contract.contractVehicleTransmission || "—";
    const vehicleFuelType = contract.contractVehicleFuelType || "—";
    const contractTerm = formatTerm(contract.contractTerm);
    const deposit = fmtCurrency(contract.contractDepositAmount);
    const licensing = fmtCurrency(contract.contractLicensingFee);
    const monthly = fmtCurrency(contract.contractMonthlyPayment);
    const totalNow = fmtCurrency(contract.contractTotalPayableNow);
    const termsText = contract.contractTerms || AUTO_ACCESS_DEFAULT_TERMS;
    const refNum = contract.referenceNumber;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const logoSrc = `${origin}/autoaccess-logo.png`;
    const vehicleImgSrc = contract.contractVehicleImage || "";
    const vehicleImgBlock = vehicleImgSrc
      ? `<div class="print-vehicle-img-wrap"><img src="${vehicleImgSrc}" alt="Vehicle" class="print-vehicle-img" /></div>`
      : `<div class="print-vehicle-img-wrap" style="color:#a3aac0;font-size:8pt">No image</div>`;

    printWindow.document.write(`<!DOCTYPE html>
<html><head><title>Auto Access — Vehicle Rental Agreement — ${refNum}</title><style>${PRINT_STYLES}</style></head>
<body>
  <div class="print-header">
    <div class="print-header-left">
      <img src="${logoSrc}" alt="Auto Access" class="print-header-logo" />
      <div>
        <div class="print-company-name">Tokyo Investments (Pty) Ltd T/A Auto Access</div>
        <div class="print-company-reg">Reg No: 1999/002599/10</div>
        <div class="print-company-addr">22 Eiland St, Eiland Park, Paarl, 7646, South Africa<br/>Tel: 021 211 0080 &nbsp;|&nbsp; 021 211 0015 &nbsp;|&nbsp; admin@autoaccess.co.za</div>
      </div>
    </div>
    <div class="print-header-right">
      <div class="print-doc-title">Vehicle Rental Agreement</div>
      <div class="print-doc-sub">Rent-to-Own Contract</div>
    </div>
  </div>
  <div class="print-ref-row">
    <div>Contract No: <span>${refNum}</span></div>
    <div>Date Issued: <span>${issuedDate}</span></div>
    <div>Contract Term: <span>${contractTerm}</span></div>
  </div>
  <div class="print-section">1. Parties to this Agreement</div>
  <div class="print-parties">
    <div class="print-party">
      <div class="print-party-label">The Rentor (Owner)</div>
      <span class="print-party-name">Tokyo Investments (Pty) Ltd T/A Auto Access</span>
      Reg No: 1999/002599/10<br/>
      22 Eiland St, Eiland Park, Paarl, 7646<br/>
      Tel: 021 211 0080 | 021 211 0015<br/>
      admin@autoaccess.co.za<br/>
      <em style="font-size:7.5pt;color:#68708a">(Hereinafter referred to as "the Rentor / Owner")</em>
    </div>
    <div class="print-party">
      <div class="print-party-label">The Rentee (Client)</div>
      <span class="print-party-name">${clientName}</span>
      ${clientIdType}: ${clientId}<br/>
      Email: ${clientEmail}<br/>
      Phone: ${clientPhone}<br/>
      Address: ${clientAddress}<br/>
      <em style="font-size:7.5pt;color:#68708a">(Hereinafter referred to as "the Rentee / Client")</em>
    </div>
  </div>
  <div class="print-section">2. Vehicle Information</div>
  <div class="print-vehicle-section">
    ${vehicleImgBlock}
    <div class="print-vehicle-grid">
      <div class="print-info-cell"><div class="print-info-label">Vehicle</div><div class="print-info-value">${vehicleTitle}</div></div>
      <div class="print-info-cell"><div class="print-info-label">Year Model</div><div class="print-info-value">${vehicleYear}</div></div>
      <div class="print-info-cell"><div class="print-info-label">Mileage</div><div class="print-info-value">${vehicleMileage}</div></div>
      <div class="print-info-cell"><div class="print-info-label">Transmission</div><div class="print-info-value">${vehicleTransmission}</div></div>
      <div class="print-info-cell"><div class="print-info-label">Fuel Type</div><div class="print-info-value">${vehicleFuelType}</div></div>
      <div class="print-info-cell"><div class="print-info-label">Contract Term</div><div class="print-info-value">${contractTerm}</div></div>
    </div>
  </div>
  <div class="print-section">3. Rental Fees &amp; Financial Summary</div>
  <div class="print-fin-grid">
    <div class="print-fin-cell"><div class="print-fin-label">Monthly Instalment</div><div class="print-fin-value">${monthly}</div></div>
    <div class="print-fin-cell"><div class="print-fin-label">Deposit</div><div class="print-fin-value">${deposit}</div></div>
    <div class="print-fin-cell"><div class="print-fin-label">Licensing &amp; Reg Fee</div><div class="print-fin-value">${licensing}</div></div>
    <div class="print-fin-cell"><div class="print-fin-label">Total Required Now</div><div class="print-fin-value">${totalNow}</div></div>
  </div>
  <div class="print-fin-note">Note: Monthly instalment includes service plan. All amounts inclusive of VAT where applicable. The total monthly rental escalates by 4% annually on the anniversary of the delivery date.</div>
  <div class="print-section">4. Terms and Conditions</div>
  <div class="print-terms">${termsText}</div>
  <div class="print-sig-grid">
    <div class="print-sig-block print-stamp-wrap">
      <img src="${origin}/company-stamp.png" alt="" class="print-stamp" />
      <div class="print-sig-line"><div class="print-sig-role">Rentor — Authorised Signatory</div><div class="print-sig-name">Tokyo Investments (Pty) Ltd T/A Auto Access</div></div>
      <div style="margin-top:20pt;border-top:1px solid #c8d4e8;padding-top:4px;"><div class="print-sig-role" style="font-size:7pt">Witness</div></div>
    </div>
    <div class="print-sig-block">
      <div class="print-sig-line"><div class="print-sig-role">Rentee — Client Signature</div><div class="print-sig-name">${clientName}</div></div>
      <div style="margin-top:20pt;border-top:1px solid #c8d4e8;padding-top:4px;"><div class="print-sig-role" style="font-size:7pt">Witness</div></div>
    </div>
  </div>
  <div class="print-footer">
    <div class="print-gold-bar"></div>
    Tokyo Investments (Pty) Ltd T/A Auto Access &nbsp;|&nbsp; Reg No: 1999/002599/10 &nbsp;|&nbsp; admin@autoaccess.co.za &nbsp;|&nbsp; Contract Ref: ${refNum}
  </div>
</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 500);
  }, [contract]);

  const termsText = contract.contractTerms || AUTO_ACCESS_DEFAULT_TERMS;
  const termDisplay = formatTerm(contract.contractTerm);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-6 py-4 text-sm font-bold text-white shadow-[0_14px_30px_-10px_rgba(213,151,88,0.55)] transition hover:from-[#c4863f] hover:to-[#d59758]">
        <svg className="h-5 w-5 transition group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                    <img src="/autoaccess-logo.png" alt="Auto Access" className="h-9 w-9 shrink-0 rounded-full object-cover" />
                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">Vehicle Rental Agreement</p>
                      <p className="truncate text-xs font-medium text-white/70">Ref: {contract.referenceNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={handlePrint} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 6 2 18 2 18 9" />
                        <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                        <rect x="6" y="14" width="12" height="8" />
                      </svg>
                      Print / Download
                    </button>
                    <button type="button" onClick={() => setOpen(false)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20" aria-label="Close">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-hidden">
                <div className="mx-auto flex h-full max-w-[1400px] flex-col px-3 py-3 sm:px-4 sm:py-4">
                  <div className="min-h-0 flex-1 overflow-hidden rounded-[28px] border border-[#dbe0ed] bg-white shadow-[0_40px_100px_-30px_rgba(11,21,50,0.5)]">
                    <div className="h-full overflow-y-auto">
                      <div ref={printRef} className="mx-auto w-full max-w-[900px] p-6 sm:p-8 md:p-10">

                        <div className="flex flex-wrap items-center justify-between gap-4 border-b-[3px] border-[#1b2345] pb-4">
                          <div className="flex items-center gap-4">
                            <img src="/autoaccess-logo.png" alt="Auto Access" className="h-16 w-16 shrink-0 rounded-full object-cover" />
                            <div>
                              <p className="text-[12px] font-bold text-[#1b2345]">Tokyo Investments (Pty) Ltd T/A Auto Access</p>
                              <p className="text-[10px] text-[#68708a]">Reg No: 1999/002599/10</p>
                              <p className="text-[10px] text-[#68708a]">22 Eiland St, Eiland Park, Paarl, 7646</p>
                              <p className="text-[10px] text-[#68708a]">021 211 0080 | 021 211 0015 | admin@autoaccess.co.za</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <h1 className="text-[1.5rem] font-bold tracking-tight text-[#1b2345] sm:text-[1.65rem]">Vehicle Rental Agreement</h1>
                            <p className="mt-1 text-xs text-[#68708a]">Rent-to-Own Contract</p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-l-[3px] border-[#c9973a] bg-[#f5f7fb] px-3 py-2 text-[11px] text-[#68708a]">
                          <span>Contract No: <strong className="text-[#1b2345]">{contract.referenceNumber}</strong></span>
                          <span>Date Issued: <strong className="text-[#1b2345]">{fmtDate(contract.contractIssuedAt)}</strong></span>
                          <span>Term: <strong className="text-[#1b2345]">{termDisplay}</strong></span>
                        </div>

                        <div className="mt-5">
                          <div className="bg-[#1b2345] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white">1. Parties to this Agreement</div>
                          <div className="grid grid-cols-1 gap-0 border border-[#c8d4e8] sm:grid-cols-2">
                            <div className="border-b border-[#c8d4e8] bg-[#e8eef7] p-4 text-[11px] leading-[1.8] sm:border-b-0 sm:border-r">
                              <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#1b2345]">The Rentor (Owner)</p>
                              <p className="text-[12px] font-bold text-[#1b2345]">Tokyo Investments (Pty) Ltd T/A Auto Access</p>
                              <p className="text-[#555]">Reg No: 1999/002599/10</p>
                              <p className="text-[#555]">22 Eiland St, Eiland Park, Paarl, 7646</p>
                              <p className="text-[#555]">Tel: 021 211 0080 | 021 211 0015</p>
                              <p className="text-[#555]">admin@autoaccess.co.za</p>
                              <p className="mt-2 text-[9px] italic text-[#68708a]">(Hereinafter referred to as &ldquo;the Rentor / Owner&rdquo;)</p>
                            </div>
                            <div className="bg-white p-4 text-[11px] leading-[1.8]">
                              <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#1b2345]">The Rentee (Client)</p>
                              <p className="text-[12px] font-bold text-[#1b2345]">{contract.contractClientFullName || "—"}</p>
                              <p className="text-[#555]">{contract.contractClientIdentityType || "ID Number"}: {contract.contractClientIdentityNumber || "—"}</p>
                              <p className="text-[#555]">Email: {contract.contractClientEmail || "—"}</p>
                              <p className="text-[#555]">Phone: {contract.contractClientPhone || "—"}</p>
                              <p className="text-[#555]">Address: {contract.contractClientAddress || "—"}</p>
                              <p className="mt-2 text-[9px] italic text-[#68708a]">(Hereinafter referred to as &ldquo;the Rentee / Client&rdquo;)</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5">
                          <div className="bg-[#1b2345] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white">2. Vehicle Information</div>
                          <div className="flex flex-col border border-[#c8d4e8] sm:flex-row">
                            {contract.contractVehicleImage ? (
                              <div className="flex shrink-0 items-center justify-center bg-[#f5f7fb] p-2 sm:w-[220px] sm:border-r sm:border-[#c8d4e8]">
                                <img src={contract.contractVehicleImage} alt={contract.contractVehicleTitle || "Vehicle"} className="max-h-[130px] w-auto object-contain" />
                              </div>
                            ) : (
                              <div className="flex shrink-0 items-center justify-center bg-[#f5f7fb] p-4 text-xs text-[#a3aac0] sm:w-[220px] sm:border-r sm:border-[#c8d4e8]">No image</div>
                            )}
                            <div className="grid flex-1 grid-cols-2 sm:grid-cols-3">
                              {[
                                ["Vehicle", contract.contractVehicleTitle],
                                ["Year Model", contract.contractVehicleYearModel],
                                ["Mileage", contract.contractVehicleMileage],
                                ["Transmission", contract.contractVehicleTransmission],
                                ["Fuel Type", contract.contractVehicleFuelType],
                                ["Contract Term", termDisplay],
                              ].map(([label, value], i) => (
                                <div key={i} className="border-b border-r border-[#e8eef7] p-2.5">
                                  <p className="text-[9px] uppercase tracking-[0.5px] text-[#68708a]">{label}</p>
                                  <p className="mt-0.5 text-[11px] font-bold text-[#1b2345]">{value || "—"}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-5">
                          <div className="bg-[#1b2345] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white">3. Rental Fees &amp; Financial Summary</div>
                          <div className="grid grid-cols-2 border border-[#c8d4e8] sm:grid-cols-4">
                            {[
                              ["Monthly Instalment", fmtCurrency(contract.contractMonthlyPayment)],
                              ["Deposit", fmtCurrency(contract.contractDepositAmount)],
                              ["Licensing & Reg Fee", fmtCurrency(contract.contractLicensingFee)],
                              ["Total Required Now", fmtCurrency(contract.contractTotalPayableNow)],
                            ].map(([label, value], i) => (
                              <div key={i} className="border-r border-[#2c4270] bg-[#1b2345] p-3 text-center last:border-r-0">
                                <p className="text-[9px] uppercase tracking-[0.5px] text-[#c8d4e8]">{label}</p>
                                <p className="mt-1 text-[14px] font-bold text-[#c9973a]">{value}</p>
                              </div>
                            ))}
                          </div>
                          <p className="mt-2 text-[10px] italic text-[#68708a]">Note: Monthly instalment includes service plan. All amounts inclusive of VAT where applicable. The total monthly rental escalates by 4% annually on the anniversary of the delivery date.</p>
                        </div>

                        <div className="mt-5">
                          <div className="bg-[#1b2345] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white">4. Terms and Conditions</div>
                          <div className="border border-t-0 border-[#c8d4e8] bg-[#fafbff] p-5 text-[11.5px] leading-[1.7] text-[#39425d]">
                            <pre className="whitespace-pre-wrap font-sans">{termsText}</pre>
                          </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-2">
                          <div className="relative">
                            <img src="/company-stamp.png" alt="" className="pointer-events-none absolute -top-8 right-0 w-[150px] rotate-[-6deg] opacity-90" />
                            <div className="mt-16 border-t-[1.5px] border-[#1b2345] pt-2">
                              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#68708a]">Rentor — Authorised Signatory</p>
                              <p className="mt-1 text-[11px] text-[#a3aac0]">Tokyo Investments (Pty) Ltd T/A Auto Access</p>
                            </div>
                            <div className="mt-8 border-t border-[#c8d4e8] pt-2">
                              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#68708a]">Witness</p>
                            </div>
                          </div>
                          <div className="relative">
                            {contract.contractSignatureImage ? (
                              <img
                                src={contract.contractSignatureImage}
                                alt="Client signature"
                                className="pointer-events-none absolute -top-6 left-0 h-[80px] w-auto max-w-[260px] object-contain"
                              />
                            ) : null}
                            <div className="mt-16 border-t-[1.5px] border-[#1b2345] pt-2">
                              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#68708a]">Rentee — Client Signature</p>
                              <p className="mt-1 text-[11px] text-[#a3aac0]">{contract.contractClientFullName || "Client"}</p>
                              {contract.contractSignedAt ? (
                                <p className="mt-0.5 text-[9px] italic text-[#68708a]">
                                  Signed electronically on {new Date(contract.contractSignedAt).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}
                                </p>
                              ) : null}
                            </div>
                            <div className="mt-8 border-t border-[#c8d4e8] pt-2">
                              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#68708a]">Witness</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 border-t border-[#e1e4ee] pt-4 text-center text-[10px] text-[#a3aac0]">
                          <div className="mx-auto mb-2 h-[3px] w-24 rounded bg-[#c9973a]" />
                          Tokyo Investments (Pty) Ltd T/A Auto Access &nbsp;|&nbsp; Reg No: 1999/002599/10 &nbsp;|&nbsp; admin@autoaccess.co.za &nbsp;|&nbsp; Ref: {contract.referenceNumber}
                        </div>

                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex shrink-0 justify-center gap-3">
                    <button type="button" onClick={handlePrint} className="inline-flex items-center gap-2 rounded-full border border-[#1b2345] bg-white px-6 py-3 text-sm font-semibold text-[#1b2345] transition hover:bg-[#f4f6fb]">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 6 2 18 2 18 9" />
                        <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                        <rect x="6" y="14" width="12" height="8" />
                      </svg>
                      Download Contract
                    </button>
                    {hasSigned ? (
                      <button type="button" onClick={() => setOpen(false)} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(16,185,129,0.55)] transition">
                        ✓ Signed — Close
                      </button>
                    ) : (
                      <button type="button" onClick={() => { setShowConfirm(true); setConfirmStep(0); }} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#c37d43] px-8 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(213,151,88,0.55)] transition hover:from-[#c37d43] hover:to-[#b86e35]">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 19l7-7 3 3-7 7-3-3z" />
                          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                          <path d="M2 2l7.586 7.586" />
                          <circle cx="11" cy="11" r="2" />
                        </svg>
                        Sign &amp; Accept Contract
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </PortalLayer>
      ) : null}
      {showConfirm ? (
        <PortalLayer>
          <div className="fixed inset-0 z-[9999999] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center p-4">
            <div className="w-full max-w-[480px] rounded-3xl bg-white p-6 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">Before you sign — {confirmStep + 1} of 4</p>
                  <h3 className="text-base font-semibold text-[#1b2345]">Please confirm you understand</h3>
                </div>
                <button type="button" onClick={() => setShowConfirm(false)} className="rounded-full p-1 text-[#68708a] hover:bg-[#f4f6fb]" aria-label="Close">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div className="flex gap-1.5 mb-5">
                {[0,1,2,3].map(i => (
                  <div key={i} className={"h-1 flex-1 rounded-full transition-all " + (i < confirmStep ? "bg-[#1b2345]" : i === confirmStep ? "bg-[#d59758]" : "bg-[#e1e4ee]")} />
                ))}
              </div>
              {confirmStep === 0 && (
                <div className="rounded-[16px] border border-[#e1e4ee] bg-[#fafbff] p-4 mb-4">
                  <p className="text-[13px] leading-6 text-[#39425d]">I have read and understood the full Vehicle Rental Agreement issued to me.</p>
                </div>
              )}
              {confirmStep === 1 && (
                <div className="rounded-[16px] border border-[#e1e4ee] bg-[#fafbff] p-4 mb-4">
                  <p className="text-[13px] leading-6 text-[#39425d]">I understand that once I sign, my selected vehicle will be <strong className="text-[#1b2345] font-semibold">reserved exclusively for me</strong> and removed from available inventory for all other clients.</p>
                </div>
              )}
              {confirmStep === 2 && (
                <div className="rounded-[16px] border border-amber-200 bg-amber-50 p-4 mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700 mb-2">Important commitment</p>
                  <p className="text-[13px] leading-6 text-[#39425d]">I understand that I have <strong className="text-[#1b2345] font-semibold">24 hours to complete payment</strong> after my invoice is released. Failure to pay will result in <strong className="text-[#1b2345] font-semibold">automatic cancellation</strong> of my contract.</p>
                  <p className="mt-2 text-[12px] leading-5 text-[#68708a]">Your application remains valid for 12 days — there is no rush if you need more time.</p>
                </div>
              )}
              {confirmStep === 3 && (
                <div className="rounded-[16px] border border-[#e1e4ee] bg-[#fafbff] p-4 mb-4">
                  <p className="text-[13px] leading-6 text-[#39425d]">I confirm that my personal details and vehicle selection on record are correct and accurately reflect my application.</p>
                </div>
              )}
              <div className="space-y-2">
                <div
                  style={{background:"#1b2345", height:"56px", borderRadius:"100px", position:"relative", overflow:"hidden", cursor:"pointer", userSelect:"none"}}
                  id="confirm-slider-wrap"
                >
                  <div id="confirm-slider-fill" style={{position:"absolute", top:0, left:0, height:"100%", width:"56px", background:"#d59758", borderRadius:"100px", transition:"background 0.3s"}}></div>
                  <div id="confirm-slider-thumb" style={{position:"absolute", top:"4px", left:"4px", width:"48px", height:"48px", background:"#fff", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.2)", cursor:"grab", zIndex:2}}
                    onMouseDown={(e) => {
                      const wrap = document.getElementById("confirm-slider-wrap");
                      const thumb = document.getElementById("confirm-slider-thumb");
                      const fill = document.getElementById("confirm-slider-fill");
                      const label = document.getElementById("confirm-slider-label");
                      if (!wrap || !thumb || !fill || !label) return;
                      const maxSlide = wrap.offsetWidth - 56;
                      const startX = e.clientX - (parseFloat(thumb.style.left) - 4);
                      const onMove = (ev: MouseEvent) => {
                        const pos = Math.max(0, Math.min(ev.clientX - startX, maxSlide));
                        thumb.style.left = (4 + pos) + "px";
                        fill.style.width = (56 + pos) + "px";
                        label.style.opacity = String(Math.max(0, 1 - (pos / maxSlide) * 2));
                        if (pos >= maxSlide - 2) {
                          fill.style.background = "#22c55e";
                          thumb.style.background = "#22c55e";
                          document.removeEventListener("mousemove", onMove);
                          document.removeEventListener("mouseup", onUp);
                          setTimeout(() => {
                            if (confirmStep < 3) { setConfirmStep(s => s + 1); }
                            else { setShowConfirm(false); setShowSignPad(true); }
                            thumb.style.left = "4px"; fill.style.width = "56px";
                            fill.style.background = "#d59758"; thumb.style.background = "#fff";
                            label.style.opacity = "1";
                          }, 300);
                        }
                      };
                      const onUp = () => {
                        thumb.style.transition = "left 0.25s"; fill.style.transition = "width 0.25s";
                        thumb.style.left = "4px"; fill.style.width = "56px"; label.style.opacity = "1";
                        document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp);
                        setTimeout(() => { thumb.style.transition = ""; fill.style.transition = "background 0.3s"; }, 250);
                      };
                      document.addEventListener("mousemove", onMove);
                      document.addEventListener("mouseup", onUp);
                    }}
                    onTouchStart={(e) => {
                      const wrap = document.getElementById("confirm-slider-wrap");
                      const thumb = document.getElementById("confirm-slider-thumb");
                      const fill = document.getElementById("confirm-slider-fill");
                      const label = document.getElementById("confirm-slider-label");
                      if (!wrap || !thumb || !fill || !label) return;
                      const maxSlide = wrap.offsetWidth - 56;
                      const startX = e.touches[0].clientX - (parseFloat(thumb.style.left) - 4);
                      const onMove = (ev: TouchEvent) => {
                        ev.preventDefault();
                        const pos = Math.max(0, Math.min(ev.touches[0].clientX - startX, maxSlide));
                        thumb.style.left = (4 + pos) + "px";
                        fill.style.width = (56 + pos) + "px";
                        label.style.opacity = String(Math.max(0, 1 - (pos / maxSlide) * 2));
                        if (pos >= maxSlide - 2) {
                          fill.style.background = "#22c55e";
                          thumb.style.background = "#22c55e";
                          document.removeEventListener("touchmove", onMove);
                          document.removeEventListener("touchend", onUp);
                          setTimeout(() => {
                            if (confirmStep < 3) { setConfirmStep(s => s + 1); }
                            else { setShowConfirm(false); setShowSignPad(true); }
                            thumb.style.left = "4px"; fill.style.width = "56px";
                            fill.style.background = "#d59758"; thumb.style.background = "#fff";
                            label.style.opacity = "1";
                          }, 300);
                        }
                      };
                      const onUp = () => {
                        thumb.style.transition = "left 0.25s"; fill.style.transition = "width 0.25s";
                        thumb.style.left = "4px"; fill.style.width = "56px"; label.style.opacity = "1";
                        document.removeEventListener("touchmove", onMove); document.removeEventListener("touchend", onUp);
                        setTimeout(() => { thumb.style.transition = ""; fill.style.transition = "background 0.3s"; }, 250);
                      };
                      document.addEventListener("touchmove", onMove, {passive:false});
                      document.addEventListener("touchend", onUp);
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d59758" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </div>
                  <div id="confirm-slider-label" style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", paddingLeft:"64px", paddingRight:"16px", pointerEvents:"none"}}>
                    <span style={{color:"rgba(255,255,255,0.55)", fontSize:"13px", fontWeight:500}}>
                      {confirmStep < 3 ? "Slide to confirm & continue" : "Slide to confirm & sign"}
                    </span>
                  </div>
                </div>
                <a
                  href="https://wa.me/27745462367?text=Hi%20Caleb%2C%20I%20have%20received%20my%20Auto%20Access%20contract%20and%20would%20like%20to%20speak%20to%20you%20before%20I%20sign."
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-[#25d366] bg-white px-6 py-3 text-sm font-semibold text-[#1a7a43] transition hover:bg-[#f0fdf4]"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.878-1.42A9.945 9.945 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
                  I prefer to speak to Caleb first
                </a>
                <button type="button" onClick={() => setShowConfirm(false)} className="group flex w-full items-center justify-center gap-2 rounded-full border-2 border-red-200 bg-red-50 px-6 py-3 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100 animate-[pulse_3s_ease-in-out_infinite]"><svg className="h-4 w-4 transition group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>I prefer to wait — I'm not ready yet</button>
              </div>
            </div>
          </div>
        </PortalLayer>
      ) : null}
      {showSignPad ? (
        <PortalLayer>
          <div className="fixed inset-0 z-[9999999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-[560px] rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#1b2345]">Sign the contract</h3>
                  <p className="mt-1 text-xs text-[#68708a]">Use your finger or mouse to sign inside the box below.</p>
                </div>
                <button type="button" onClick={() => { setShowSignPad(false); setSignError(null); }} className="rounded-full p-1 text-[#68708a] hover:bg-[#f4f6fb]" aria-label="Close">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="rounded-2xl border-2 border-dashed border-[#c8d4e8] bg-[#fafbff] p-2">
                <SignatureCanvas
                  ref={sigPadRef}
                  penColor="#1b2345"
                  canvasProps={{
                    className: "w-full h-[200px] rounded-xl bg-white touch-none",
                    style: { touchAction: "none" },
                  }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-[#68708a]">
                <span>Signing as: <strong className="text-[#1b2345]">{contract.contractClientFullName || "Client"}</strong></span>
                <button type="button" onClick={clearSignature} className="font-semibold text-[#c37d43] hover:underline">Clear</button>
              </div>

              {signError ? (
                <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{signError}</div>
              ) : null}

              <div className="mt-5 flex gap-3">
                <button type="button" onClick={() => { setShowSignPad(false); setSignError(null); }} className="flex-1 rounded-full border border-[#c8d4e8] bg-white px-5 py-3 text-sm font-semibold text-[#1b2345] transition hover:bg-[#f4f6fb]" disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="button" onClick={submitSignature} disabled={isSubmitting} className="flex-1 rounded-full bg-gradient-to-r from-[#d59758] to-[#c37d43] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(213,151,88,0.55)] transition hover:from-[#c37d43] hover:to-[#b86e35] disabled:opacity-60">
                  {isSubmitting ? "Submitting..." : "Confirm Signature"}
                </button>
              </div>

              <p className="mt-4 text-center text-[10px] leading-relaxed text-[#a3aac0]">
                By confirming, you agree that this electronic signature has the same legal effect as a handwritten signature.
              </p>
            </div>
          </div>
        </PortalLayer>
      ) : null}
      {showSuccessToast ? (
        <PortalLayer>
          <div className="fixed top-6 left-1/2 z-[9999999] -translate-x-1/2 animate-[slideDown_0.4s_ease-out]">
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-5 py-4 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.35)]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <svg className="h-5 w-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-[#1b2345]">Contract signed successfully</p>
                <p className="mt-0.5 text-xs text-[#68708a]">A confirmation has been sent to your email.</p>
              </div>
              <button type="button" onClick={() => setShowSuccessToast(false)} className="ml-3 rounded-full p-1 text-[#a3aac0] hover:bg-[#f4f6fb] hover:text-[#1b2345]" aria-label="Dismiss">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
          <style>{`
            @keyframes slideDown {
              from { opacity: 0; transform: translate(-50%, -20px); }
              to { opacity: 1; transform: translate(-50%, 0); }
            }
          `}</style>
        </PortalLayer>
      ) : null}

      {flowStage === "signing" ? (
        <PortalLayer>
          <div className="fixed inset-0 z-[9999999] flex items-center justify-center bg-[#0b1532]/95 backdrop-blur-sm">
            <style>{`
              @keyframes spinRing { to { transform: rotate(360deg); } }
              @keyframes fadeUpIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
            `}</style>
            <div className="flex flex-col items-center gap-6 text-center px-8">
              <div className="relative h-20 w-20">
                <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#d59758]" style={{animation:"spinRing 1s linear infinite"}} />
                <div className="absolute inset-3 rounded-full bg-[#d59758]/10 flex items-center justify-center">
                  <svg className="h-7 w-7 text-[#d59758]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                  </svg>
                </div>
              </div>
              <div style={{animation:"fadeUpIn 0.5s ease 0.2s both"}}>
                <p className="text-xl font-semibold text-white">Signing your contract</p>
                <p className="mt-2 text-[13px] text-blue-100/60">Please wait while we securely record your signature...</p>
              </div>
            </div>
          </div>
        </PortalLayer>
      ) : null}

      {flowStage === "banking" ? (
        <PortalLayer>
          <div className="fixed inset-0 z-[9999999] flex items-end justify-center bg-[#0b1532]/90 backdrop-blur-sm sm:items-center p-4">
            <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }`}</style>
            <div className="w-full max-w-[520px] rounded-3xl bg-white shadow-2xl overflow-hidden" style={{animation:"slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)", maxHeight:"90vh", overflowY:"auto"}}>
              <div className="bg-gradient-to-r from-[#0b1532] to-[#1b2345] px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d59758]/20">
                    <svg className="h-5 w-5 text-[#d59758]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f4c89a]">One more step</p>
                    <h3 className="text-[1rem] font-semibold text-white">Enter your payment banking details</h3>
                  </div>
                </div>
                <p className="mt-3 text-[12px] leading-5 text-blue-100/60">Please provide the bank account you will use to make your deposit payment.</p>
              </div>
              <div className="p-6 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#68708a] mb-1.5">Bank Name</label>
                    <select value={bankData.clientBankName} onChange={e => setBankData(p => ({...p, clientBankName: e.target.value}))} className="w-full rounded-[10px] border border-[#dbe0ed] bg-[#fafbff] px-3 py-2.5 text-sm text-[#1b2345] outline-none focus:border-[#d59758] focus:ring-2 focus:ring-[#d59758]/20">
                      <option value="">Select your bank</option>
                      <option>ABSA</option>
                      <option>Capitec Bank</option>
                      <option>First National Bank (FNB)</option>
                      <option>Nedbank</option>
                      <option>Standard Bank</option>
                      <option>African Bank</option>
                      <option>Investec</option>
                      <option>TymeBank</option>
                      <option>Discovery Bank</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#68708a] mb-1.5">Account Holder Name</label>
                    <input type="text" placeholder="Full name as on bank account" value={bankData.clientAccountHolder} onChange={e => setBankData(p => ({...p, clientAccountHolder: e.target.value}))} className="w-full rounded-[10px] border border-[#dbe0ed] bg-[#fafbff] px-3 py-2.5 text-sm text-[#1b2345] outline-none focus:border-[#d59758] focus:ring-2 focus:ring-[#d59758]/20" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#68708a] mb-1.5">Account Number</label>
                    <input type="text" placeholder="Account number" value={bankData.clientAccountNumber} onChange={e => setBankData(p => ({...p, clientAccountNumber: e.target.value}))} className="w-full rounded-[10px] border border-[#dbe0ed] bg-[#fafbff] px-3 py-2.5 text-sm text-[#1b2345] outline-none focus:border-[#d59758] focus:ring-2 focus:ring-[#d59758]/20" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#68708a] mb-1.5">Branch Code</label>
                    <input type="text" placeholder="e.g. 632005" value={bankData.clientBranchCode} onChange={e => setBankData(p => ({...p, clientBranchCode: e.target.value}))} className="w-full rounded-[10px] border border-[#dbe0ed] bg-[#fafbff] px-3 py-2.5 text-sm text-[#1b2345] outline-none focus:border-[#d59758] focus:ring-2 focus:ring-[#d59758]/20" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#68708a] mb-1.5">Account Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Cheque","Savings","Current"].map(t => (
                        <button key={t} type="button" onClick={() => setBankData(p => ({...p, clientAccountType: t}))} className={"rounded-[10px] border py-2.5 text-[12px] font-semibold transition " + (bankData.clientAccountType === t ? "border-[#1b2345] bg-[#1b2345] text-white" : "border-[#dbe0ed] bg-white text-[#39425d] hover:border-[#d59758]")}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {bankError && <div className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{bankError}</div>}
                {bankError && <div className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 mt-1">{bankError}</div>}
                <div className="mt-3 rounded-[100px] overflow-hidden" style={{background:"rgba(255,255,255,0.08)", height:"56px", position:"relative", cursor:"pointer", userSelect:"none"}}
                  id="bank-slider-wrap"
                >
                  <div id="bank-slider-fill" style={{position:"absolute", top:0, left:0, height:"100%", width:"56px", background:"#d59758", borderRadius:"100px", transition:"background 0.3s"}}></div>
                  <div id="bank-slider-thumb" style={{position:"absolute", top:"4px", left:"4px", width:"48px", height:"48px", background:"#fff", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.2)", cursor:"grab", zIndex:2}}
                    onMouseDown={(e) => {
                      if (isSubmitting) return;
                      const wrap = document.getElementById("bank-slider-wrap");
                      const thumb = document.getElementById("bank-slider-thumb");
                      const fill = document.getElementById("bank-slider-fill");
                      const label = document.getElementById("bank-slider-label");
                      if (!wrap || !thumb || !fill || !label) return;
                      const maxSlide = wrap.offsetWidth - 56;
                      let startX = e.clientX - (parseFloat(thumb.style.left) - 4);
                      const onMove = (ev: MouseEvent) => {
                        const pos = Math.max(0, Math.min(ev.clientX - startX, maxSlide));
                        thumb.style.left = (4 + pos) + "px";
                        fill.style.width = (56 + pos) + "px";
                        label.style.opacity = String(Math.max(0, 1 - (pos / maxSlide) * 2));
                        if (pos >= maxSlide - 2) {
                          fill.style.background = "#22c55e";
                          thumb.style.background = "#22c55e";
                          label.style.opacity = "0";
                          document.removeEventListener("mousemove", onMove);
                          document.removeEventListener("mouseup", onUp);
                          setTimeout(() => submitBanking(), 200);
                        }
                      };
                      const onUp = () => {
                        thumb.style.transition = "left 0.25s";
                        fill.style.transition = "width 0.25s";
                        thumb.style.left = "4px";
                        fill.style.width = "56px";
                        label.style.opacity = "1";
                        document.removeEventListener("mousemove", onMove);
                        document.removeEventListener("mouseup", onUp);
                        setTimeout(() => { thumb.style.transition = ""; fill.style.transition = "background 0.3s"; }, 250);
                      };
                      document.addEventListener("mousemove", onMove);
                      document.addEventListener("mouseup", onUp);
                    }}
                    onTouchStart={(e) => {
                      if (isSubmitting) return;
                      const wrap = document.getElementById("bank-slider-wrap");
                      const thumb = document.getElementById("bank-slider-thumb");
                      const fill = document.getElementById("bank-slider-fill");
                      const label = document.getElementById("bank-slider-label");
                      if (!wrap || !thumb || !fill || !label) return;
                      const maxSlide = wrap.offsetWidth - 56;
                      let startX = e.touches[0].clientX - (parseFloat(thumb.style.left) - 4);
                      const onMove = (ev: TouchEvent) => {
                        ev.preventDefault();
                        const pos = Math.max(0, Math.min(ev.touches[0].clientX - startX, maxSlide));
                        thumb.style.left = (4 + pos) + "px";
                        fill.style.width = (56 + pos) + "px";
                        label.style.opacity = String(Math.max(0, 1 - (pos / maxSlide) * 2));
                        if (pos >= maxSlide - 2) {
                          fill.style.background = "#22c55e";
                          thumb.style.background = "#22c55e";
                          label.style.opacity = "0";
                          document.removeEventListener("touchmove", onMove);
                          document.removeEventListener("touchend", onUp);
                          setTimeout(() => submitBanking(), 200);
                        }
                      };
                      const onUp = () => {
                        thumb.style.transition = "left 0.25s";
                        fill.style.transition = "width 0.25s";
                        thumb.style.left = "4px";
                        fill.style.width = "56px";
                        label.style.opacity = "1";
                        document.removeEventListener("touchmove", onMove);
                        document.removeEventListener("touchend", onUp);
                        setTimeout(() => { thumb.style.transition = ""; fill.style.transition = "background 0.3s"; }, 250);
                      };
                      document.addEventListener("touchmove", onMove, {passive:false});
                      document.addEventListener("touchend", onUp);
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d59758" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </div>
                  <div id="bank-slider-label" style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", paddingLeft:"64px", paddingRight:"16px", pointerEvents:"none"}}>
                    <span style={{color:"rgba(255,255,255,0.6)", fontSize:"13px", fontWeight:500}}>
                      {isSubmitting ? "Processing..." : "Slide to confirm & complete"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PortalLayer>
      ) : null}

      {flowStage === "processing" ? (
        <PortalLayer>
          <div className="fixed inset-0 z-[9999999] flex items-center justify-center bg-[#0b1532]/95 backdrop-blur-sm">
            <style>{`
              @keyframes spinRing2 { to { transform: rotate(360deg); } }
              @keyframes fadeUp2 { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
              @keyframes dotPulse { 0%,80%,100% { transform:scale(0.6); opacity:0.4; } 40% { transform:scale(1); opacity:1; } }
            `}</style>
            <div className="flex flex-col items-center gap-6 text-center px-8">
              <div className="relative h-20 w-20">
                <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-400" style={{animation:"spinRing2 1s linear infinite"}} />
                <div className="absolute inset-3 rounded-full bg-emerald-400/10 flex items-center justify-center">
                  <svg className="h-7 w-7 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
                  </svg>
                </div>
              </div>
              <div style={{animation:"fadeUp2 0.5s ease 0.2s both"}}>
                <p className="text-xl font-semibold text-white">Securing your details</p>
                <p className="mt-2 text-[13px] text-blue-100/60">Please wait while we process your banking information...</p>
              </div>
              <div className="flex gap-2">
                {[0,1,2].map(i => (
                  <div key={i} className="h-2 w-2 rounded-full bg-emerald-400" style={{animation:`dotPulse 1.4s ease-in-out ${i*0.16}s infinite`}} />
                ))}
              </div>
            </div>
          </div>
        </PortalLayer>
      ) : null}

      {flowStage === "success" ? (
        <PortalLayer>
          <div className="fixed inset-0 z-[9999999] flex items-center justify-center bg-[#0b1532]/95 backdrop-blur-sm">
            <style>{`
              @keyframes scaleIn { from { opacity:0; transform:scale(0.5); } to { opacity:1; transform:scale(1); } }
              @keyframes checkDraw { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
              @keyframes ringPulse { 0%,100% { transform:scale(1); opacity:0.6; } 50% { transform:scale(1.3); opacity:0; } }
            `}</style>
            <div className="flex flex-col items-center gap-5 text-center px-8">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-emerald-400/20" style={{animation:"ringPulse 2s ease infinite"}} />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500" style={{animation:"scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both"}}>
                  <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{strokeDasharray:100,strokeDashoffset:0,animation:"checkDraw 0.6s ease 0.7s both"}}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">Contract Signed Digitally</p>
                <p className="mt-2 text-[13px] text-blue-100/70">Your banking details have been recorded.</p>
                <p className="mt-1 text-[13px] text-blue-100/70">Your invoice will be issued by our team shortly.</p>
              </div>
              <div className="rounded-full border border-[#d59758]/30 bg-[#d59758]/10 px-5 py-2">
                <p className="text-[12px] font-semibold text-[#f4c89a]">Application status: Awaiting Invoice</p>
              </div>
            </div>
          </div>
        </PortalLayer>
      ) : null}

    </>
  );
}
