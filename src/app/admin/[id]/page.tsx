import { notFound } from "next/navigation";
import AdminDocumentViewer from "@/components/admin-document-viewer";
import AdminDocumentActions from "@/components/admin-document-actions";
import { prisma } from "@/lib/prisma";
import AdminStatusForm from "@/components/admin-status-form";
import AdminApprovalValidityForm from "@/components/admin-approval-validity-form";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

type ApplicationDocument = {
  id: string;
  fileName: string;
  fileUrl: string;
  documentType: string;
  createdAt: Date;
};

type ApplicationStatusLog = {
  id: string;
  toStatus: string;
  note: string | null;
  createdAt: Date;
};

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function formatIdentityType(value: string | null) {
  if (!value) return "Not provided";
  if (value === "SA_ID") return "South African ID";
  if (value === "PASSPORT") return "Passport";
  return value;
}

function getApprovalDisplay(status: string, approvalValidUntil: Date | null) {
  if (status !== "APPROVED_IN_PRINCIPLE") {
    return "Approval validity not active for current status.";
  }

  if (!approvalValidUntil) {
    return "No expiry limit currently applied.";
  }

  return new Date(approvalValidUntil).toLocaleString();
}

function parseMoney(value: string | null | undefined) {
  if (!value) return 0;
  const cleaned = value.replace(/[^\d.-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const DEFAULT_LICENSING_FEE = 1850;

const DEFAULT_CONTRACT_TERMS = `VEHICLE RENT TO OWN CONTRACT

This contract of lease with option to own the vehicle after the 54th instalment (Vehicle Rent-to-Own Contract) is made and executed between Access Holdings (Pty) Ltd T/A Auto Access (Reg No: 1999/002599/10, 22 Eiland St, Eiland Park, Paarl, 7646) as the Rentor/Owner, and the Rentee/Client whose details are recorded in this contract snapshot.

TERMS AND CONDITIONS

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
1.1.3.8 where an expression has been defined and such definition contains a provision conferring rights or imposing obligations on any party, effect shall be given to that provision as if it were a substantive provision contained in the body of this Agreement;
1.1.3.9 if figures are referred to in numbers and words, the words shall prevail in the event of any conflict between the two;
1.1.3.10 words and/or expressions defined in this Agreement shall, unless the application of such word and/or expression is specifically limited to that clause, bear the meaning so assigned to it;
1.1.3.11 the contra proferentem rule shall not apply and accordingly, none of the provisions hereof shall be constructed against or interpreted to the disadvantage of the party responsible for the drafting or preparation of such provision;
1.1.3.12 the generis rule shall not apply, and whenever a provision is followed by the word "including" and specific examples, such examples shall not be constructed so as to limit the ambit of the provision concerned;
1.1.3.13 a reference to any statutory enactment shall be construed as a reference to that enactment as at the signature date and as amending or re-enacted from time to time thereafter;
1.1.3.14 the expiration or termination of this Agreement shall not affect such of its provisions as expressly provided that they will continue to apply after such expiration or termination or which of necessity must continue to apply after such expiration or termination;
1.1.3.15 any communication which is required to be "in writing" shall include a communication which is written or produced by any substitute for writing or which is partly written and partly so produced, and shall include printing, typewriting, lithography, facsimile or electronic mail or any form of electronic communication or other process or partly one and partly another.

1.2 In this Agreement, unless clearly inconsistent with or otherwise indicated by the context, with cognate expressions having corresponding meanings:
1.2.1 "Agreement" or "this Agreement" means this Vehicle Rental Agreement concluded between the Rentor and the Rentee;
1.2.2 "Base Rental" means the monthly rental payable for the use and enjoyment of the Vehicle, inclusive of limited Damage and Loss Liability Waivers, and the monthly tracker and immobilizer fee but excluding the monthly rental payments for any Additional Rental Benefits;
1.2.3 "Delivery Date" means the date upon which the Rentee takes delivery of the Vehicle;
1.2.4 "Early Termination" means the termination of the Agreement for those reasons in paragraph 18;
1.2.5 "Early Termination Settlement" means the figure payable as a result of an Early Termination. The Early Termination Settlement in circumstances where the vehicle is damaged beyond repair shall be an amount equal to the difference between the nett present value of the remaining rentals due in terms of this Agreement calculated at Prime plus 2% and the vehicle's post-accident value plus 10% of the value of the remaining rentals due in terms of this Agreement as at the date of Early Termination. In all other circumstances giving rise to Early Termination Settlement, the amount shall be equal to the nett present value of the remaining rentals due in terms of this Agreement less the trade value of the Vehicle (as determined in Meade and McGrouther) plus 10% of the value of the remaining rentals due in terms of this Agreement as at the date of Early Termination;
1.2.6 "Fair Value" means the value of the Vehicle from time to time determined by reference to the mean average between the trade value and the retail value contained in the most recent published edition of Meade and McGrouther;
1.2.7 "Damage and Loss Liability Waivers" means the amount by which the Rentee's liability in the case of accident damage to or loss of the vehicle through theft or hijacking will be limited subject to the terms and conditions of this Agreement;
1.2.8 "Prime Rate" means the publicly quoted basic annual rate of interest at which Standard Bank lends on overdraft;
1.2.9 "Road Traffic Laws" means the National Road Traffic Act No 93 of 1996 and any supplementary or replacement legislation together with all applicable provincial and municipal road traffic by-laws and regulations;
1.2.10 "Vehicle" means the motor Vehicle described in the contract snapshot.

2. DURATION
This Agreement shall be deemed to have commenced on the date of delivery of the Vehicle to the Rentee and shall remain in force until the Expiry Date.

3. PAYMENT OF RENTALS
3.1 All rentals shall be paid by debit order on any working day of each month at the Rentee's election. In the event that the delivery date does not fall on the specific day of the month, the rental for that month will be calculated pro-rata and paid in advance by the Rentee;
3.2 The Rentee shall not withhold, defer or make any deduction whatsoever from any rental payment due, whether or not the Rentor is indebted to the Rentee or in breach of any obligation to the Rentee;
3.3 The rental and all other amounts payable by the Rentee under this Agreement shall be inclusive of Value Added Tax in so far as it is applicable;
3.4 The total monthly rental shall escalate by 4% (four percent) annually, on the anniversary of the Delivery Date;
3.5 If so elected by the Rentee, the total monthly rental shall fluctuate with the Prime Rate;
3.6 The Rentee shall be liable for interest on all overdue amounts payable in terms of this Agreement calculated at 2% per month, reckoned from the date upon which the payment fell due.

4. SECURITY DEPOSIT
4.1 A security deposit shall be paid upon signature of this Agreement by the Rentee. No interest shall accrue on the security deposit during the period of the Agreement;
4.2 Once all obligations due by the Rentee to the Rentor have been discharged following upon the expiry of this Agreement, the Rentor shall refund to the Rentee, free of interest, so much of the security deposit as has not been applied in settlement of any amounts owing by the Rentee to the Rentor in terms of this Agreement.

5. KEY DEPOSIT
A key deposit for an amount specified by the Rentor shall be paid by the Rentee to the Rentor upon signature of this Agreement and retained by the Rentor until such time as all keys to the Vehicle are returned. No interest shall accrue on the key deposit during the period of the Agreement.

6. RISK OF LOSS OR DAMAGE
6.1 The Rentee, by accepting the Vehicle, acknowledges having inspected the Vehicle and receiving the Vehicle in a good and roadworthy condition, free of any obvious defects or damage;
6.2 Should any material defects manifest themselves in the Vehicle within 7 days of the Rentee taking delivery, the Rentor shall on written notice take steps to have any defect repaired in terms of the manufacturer's warranty. The Rentor shall not be liable for any such defects;
6.3 The risk in and to the Vehicle shall immediately pass to the Rentee on delivery of the Vehicle and shall remain with the Rentee throughout the entire period of this Agreement.

7. OWNERSHIP
7.1 The Rentor shall at all times remain the owner of the Vehicle. The Rentor may inspect the Vehicle at any reasonable time wherever it may be kept. The Rentee warrants that when the Vehicle is not in use, it shall be kept at the Rentee's address. The Rentee undertakes that in the event of a change of address it shall forthwith notify the Rentor in writing, and any failure to do so shall be deemed a material breach of this Agreement;
7.2 The Rentee shall take ownership of the Vehicle after successful completion of the fixed 54-month contract as agreed upon;
7.3 The Rentee shall use and operate the Vehicle in compliance with the Road Traffic Laws;
7.4 The Rentee shall not:
7.4.1 use or permit the Vehicle to be used for any commercial enterprise or activities unless permitted with the Rentor's prior written consent;
7.4.2 cause or allow the Vehicle to be neglected, abused, damaged or modified in terms of its body or components, tamper with, remove or replace any of the Vehicle's components, or use the Vehicle for any purpose for which it is not designed or intended;
7.4.3 drive or allow the Vehicle to be driven recklessly, negligently or in contravention of any road or traffic regulations;
7.4.4 convey any materials or articles in the Vehicle which may cause damage to its upholstery or any other part of the Vehicle;
7.4.5 drive or permit any other person to drive the Vehicle whilst under the influence of alcohol, strong medication or any unlawful drugs;
7.4.6 allow the Vehicle to be in any area where there may be an increased risk of damage through civil disturbance, social or economic protest or any related act;
7.4.7 permit any unauthorised person to drive the Vehicle during the period of this Agreement;
7.4.8 permit the Vehicle to leave the borders of the Republic of South Africa without the Rentor's prior written consent;
7.5 The Rentee shall at all times exercise due care and shall take all reasonable precautions to safeguard the Vehicle. Whenever the Vehicle is left parked or unattended, all doors and windows must be locked and the alarm/immobilizer device activated, with the keys remaining in the Rentee's possession.

8. VEHICLE MAINTENANCE
8.1 The Rentee shall maintain the Vehicle in a good and roadworthy condition, using the same degree of care as would ordinarily be exercised if the Vehicle belonged to the Rentee;
8.2 The Rentee shall abide by the manufacturer's specifications and shall not change or alter any aspect of the Vehicle without the Rentor's prior written consent;
8.3 The Rentee shall not remove or tamper with the tracking system or immobilizer fitted to the Vehicle or render them inoperable;
8.4 The Rentee shall ensure the Vehicle is pre-booked for service as prescribed by the manufacturer. All costs of service including tyres, fuel, oil and consumables are for the Rentee's account. Service must be carried out by a manufacturer-approved dealer or a dealer approved by the Rentor;
8.5 Where the Rentee fails to submit the Vehicle for its recommended service timeously and the service plan is terminated, the Rentee shall pay all costs of reinstating the plan together with an administration fee of R500;
8.6 All parts and accessories replaced or added to the Vehicle during the rental period shall become the Rentor's property and the Rentee shall not be entitled to compensation therefor.

9. LIMITATION ON TRAVEL
The maximum distance that the Rentee may travel in the Vehicle each month from the commencement date of this Agreement is unlimited.

10. COLLISION DAMAGE, THEFT OR TOTAL LOSS
10.1 The Rentee shall immediately, within 24 hours:
10.1.1 notify the Rentor by telephone and in writing of any accident or theft of the Vehicle;
10.1.2 report such accident or theft to the South African Police Services and immediately provide the police case reference number to the Rentor;
10.1.3 where possible, obtain the names and addresses of all parties and witnesses involved;
10.1.4 not acknowledge responsibility or liability for the accident or settle any claim without the Rentor's consent;
10.2 Where the Vehicle cannot be driven after an accident, the Rentee shall permit only a tow truck authorised by the Rentor or the Rentor's insurer to remove the Vehicle;
10.3 The Rentee shall be responsible for any amount in excess of the Damage and Loss Liability Waivers;
10.4 Any accidental damage shall be repaired by a panel beater or service provider approved by the Rentor;
10.5 Where the damage exceeds the value of the Vehicle, the Rentee shall be liable for the difference between the Fair Value and the compensation paid by the Rentor's insurer;
10.6 Where damage affects the Vehicle's Fair Value without rendering it a write-off, the Rentee shall be responsible for the difference between the post-accident value (determined by an expert) and the Fair Value;
10.7 Subject to 10.5 and 10.6, the Rentor may, at its sole discretion and once compensated, provide the Rentee with a replacement Vehicle of similar value where the Vehicle is damaged beyond repair. The Rentee may accept the replacement or exercise the right to Early Termination.

11. FINES AND PENALTIES
11.1 The Rentee shall be responsible for all fines and penalties imposed for road traffic offences, together with an administrative fee of R250 for each fine or penalty, payable upon demand by the Rentor;
11.2 Where the Rentee receives 12 or more traffic fines or penalties during any 12-month cycle, this shall be deemed a material breach of the Agreement, and the Rentor shall be entitled to terminate this Agreement forthwith;
11.3 The Rentee shall pay all road tolls levied. Any tolls paid by the Rentor on the Rentee's behalf shall be recovered from the Rentee together with an administration fee of R250 per toll claim.

12. ROAD LICENCE
The Rentee shall be responsible for the renewal of the annual road licence for the Vehicle.

13. TRACKER AND IMMOBILISER
13.1 A tracker and immobiliser device have been installed on the Vehicle prior to delivery;
13.2 Under no circumstances shall the Rentee be entitled to remove the tracker and immobiliser device. Any such removal shall be deemed a material breach of this Agreement permitting immediate termination by the Rentor;
13.3 The Rentee irrevocably consents to the Vehicle being tracked and remotely immobilised where the Vehicle has been stolen or used without authority, or where the Rentee is in breach of the payment terms of this Agreement and has failed, despite written notice, to rectify the breach.

14. REMOVAL OF THE VEHICLE
14.1 The Rentee irrevocably consents to the removal of the Vehicle from his possession in circumstances where he is in material breach of the Agreement and the Rentor has complied with the breach provisions;
14.2 Such removal does not preclude the Rentee from such rights as he may have in law to dispute the alleged breach and seek the return of the Vehicle.

15. DAMAGE AND LOSS LIABILITY WAIVER
15.1 The Rentee's liability for accident damage or loss through theft or hijacking is limited by the Damage and Loss Liability Waivers, and the Rentee will only be liable for the amount in excess thereof;
15.2 The Rentee shall provide the Rentor with all information relevant to the Damage and Loss Liability Waivers;
15.3 Where the Damage and Loss Liability Waivers do not cover windscreens or tyres, the Rentee shall be liable for the cost of repairing and replacing the windscreen, any other glass and the tyres fitted during the term of this Agreement;
15.4 The Rentee shall be responsible for any damage or loss where a claim is repudiated on one or more of the general conditions or exceptions under the Rentor's Insurance Policy and where the Rentee is the cause of the repudiation.

16. THE NATIONAL CREDIT ACT
The provisions of the National Credit Act No 24 of 2005 do not apply to the transaction recorded in this Agreement.

17. EARLY TERMINATION
17.1 An Early Termination arises in the following circumstances:
17.1.1 Where the Rentee's Vehicle has been damaged beyond commercial repair, subject to the Rentor being compensated;
17.1.2 the death of the Rentee;
17.1.3 by agreement between the Rentor and the Rentee;
17.1.4 for good cause, at the discretion of the Rentor;
17.2 To exercise the right to an Early Termination, the Rentee shall deliver written notice of Early Termination to the Rentor.

18. WARRANTIES
The Rentee warrants that:
18.1 Full disclosure of all material facts has been made to enable the Rentor to make an informed decision when concluding this Agreement;
18.2 The Rentee holds a valid and current driver's licence which has not, in the 12 months preceding the Delivery Date, been revoked, suspended or endorsed;
18.3 The Rentee has not been refused insurance by any motor vehicle insurer for a period of 5 years preceding the Delivery Date;
18.4 All credit card and bank account details provided to the Rentor are correct, current and accurate.

19. INDEMNITIES
The Rentee hereby indemnifies the Rentor and holds it harmless against:
19.1 Any road traffic fines, penalties or levies imposed by any Road Traffic or Municipal authority;
19.2 Any claims of whatsoever nature by any third party as a result of any incident involving the Vehicle or the Rentee's use thereof, where such claim is not covered by the Vehicle's insurance policy.

20. BREACH
20.1 In the event that the Rentee:
20.1.1 has made any misrepresentation to the Rentor relating to this Agreement;
20.1.2 breaches any material term of the Agreement;
20.1.3 voids the manufacturer's warranty or incurs damage to the Vehicle in circumstances where the Rentor's insurer repudiates the claim;
20.1.4 fails to maintain the Vehicle in accordance with the maintenance provisions;
20.1.5 repeatedly disobeys the Road Traffic Laws;
20.1.6 has his licence suspended, revoked or restricted in any way;
the Rentor shall be entitled, without prejudice to any other rights, to terminate this Agreement forthwith by giving the Rentee written notice of the breach and may thereafter collect and repossess the Vehicle without being required to obtain a court order, and recover all outstanding rentals which shall become immediately due and payable;
20.2 Where the Rentee fails to pay timeously any amount payable after having been given 5 days' written notice to remedy the default, the Rentor shall be entitled to cancel this Agreement and repossess the Vehicle.

21. ADDRESSES AND NOTICES
21.1 For the purposes of this Agreement, including the giving of notices and service of legal process, the parties choose domicilium citandi et executandi as indicated in the parties section;
21.2 Any notice may be delivered by hand to the chosen domicilium and shall be deemed delivered when handed to any responsible person at that address;
21.3 Any party may by written notice vary its/his domicilium to any other physical address within the Republic of South Africa;
21.4 Any notice transmitted by electronic mail shall be presumed to have been received by the recipient on the first business day after successful transmission.

22. GENERAL
22.1 This Agreement constitutes the whole agreement between the parties relating to the subject matter hereof;
22.2 No amendment or cancellation of this Agreement shall be binding unless recorded in writing and signed by the parties;
22.3 No extension, waiver, relaxation or suspension shall operate as an estoppel against any party in respect of its rights under this Agreement;
22.4 No party shall be bound by any express or implied term, representation, warranty or promise not recorded herein.

23. CONSENT TO JURISDICTION
The parties hereby consent to the non-exclusive jurisdiction of the Cape Town Magistrate's Court in respect of any proceedings arising under or by virtue of this Agreement, whether in respect of damages or otherwise, despite the subject matter and/or cause of action which would otherwise have been beyond such court's jurisdiction.

24. ACKNOWLEDGEMENT
The Rentee acknowledges that he has read and understands the terms and conditions of this Agreement and has no objection thereto.`;

export default async function AdminApplicationDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const application = await prisma.application.findUnique({
    where: { id },
    select: {
      id: true,
      referenceNumber: true,
      fullName: true,
      email: true,
      phone: true,
      status: true,
      identityType: true,
      identityNumber: true,
      employmentStatus: true,
      monthlyIncome: true,
      salaryDate: true,
      preferredVehicle: true,
      physicalAddress: true,
      notes: true,
      approvalValidUntil: true,
      reapplyAllowedAt: true,
      contractRequestedAt: true,
      contractIssuedAt: true,
      contractExpiresAt: true,
      contractAccepted: true,
      contractAcceptedAt: true,
      contractAcceptedName: true,
      contractSignatureImage: true,
      contractSignedAt: true,
      selectedVehicleId: true,
      createdAt: true,

      contractVehicleTitle: true,
      contractVehicleImage: true,
      contractVehicleYearModel: true,
      contractVehicleMileage: true,
      contractVehicleTransmission: true,
      contractVehicleFuelType: true,
      contractDepositAmount: true,
      contractLicensingFee: true,
      contractMonthlyPayment: true,
      contractTotalPayableNow: true,
      contractTerm: true,
      contractClientFullName: true,
      contractClientEmail: true,
      contractClientPhone: true,
      contractClientIdentityType: true,
      contractClientIdentityNumber: true,
      contractClientAddress: true,
      contractTerms: true,

      selectedVehicle: {
        select: {
          id: true,
          title: true,
          featuredImage: true,
          depositAmount: true,
          monthlyPayment: true,
          term: true,
          yearModel: true,
          mileage: true,
          transmission: true,
          fuelType: true,
          slug: true,
        },
      },

      statusLogs: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          toStatus: true,
          note: true,
          createdAt: true,
        },
      },
      documents: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          fileName: true,
          fileUrl: true,
          documentType: true,
          createdAt: true,
        },
      },
    },
  });

  if (!application) {
    notFound();
  }

  const selectedVehicle = application.selectedVehicle;

  const fallbackDepositAmount = selectedVehicle?.depositAmount || "";
  const fallbackMonthlyPayment = selectedVehicle?.monthlyPayment || "";
  const fallbackLicensingFee = String(DEFAULT_LICENSING_FEE);

  const depositForPreview = application.contractDepositAmount
    ? parseMoney(application.contractDepositAmount)
    : parseMoney(fallbackDepositAmount);

  const licensingForPreview = application.contractLicensingFee
    ? parseMoney(application.contractLicensingFee)
    : DEFAULT_LICENSING_FEE;

  const totalNowPreview = application.contractTotalPayableNow
    ? parseMoney(application.contractTotalPayableNow)
    : depositForPreview + licensingForPreview;

  const monthlyPreview = application.contractMonthlyPayment
    ? parseMoney(application.contractMonthlyPayment)
    : parseMoney(fallbackMonthlyPayment);

  const showContractPreparation = application.status === "CONTRACT_REQUESTED";
  const showPreparedSnapshot =
    !!application.contractVehicleTitle ||
    !!application.contractDepositAmount ||
    !!application.contractTerms;

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-black">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
          Auto Access Admin
        </p>

        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          Application Details
        </h1>

        <p className="mb-10 max-w-3xl text-lg text-gray-600">
          Review the applicant profile, uploaded documents, status history, and
          contract preparation controls before issuing the contract.
        </p>

        <div className="mb-5 flex items-center gap-3">
          <a href="/admin" className="inline-flex items-center gap-2 rounded-full border border-[#e1e4ee] bg-white px-4 py-2 text-[12px] font-semibold text-[#68708a] shadow-sm transition hover:border-[#dbe6ff] hover:text-[#2f67de]">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Dashboard
          </a>
        </div>

        {resolvedSearchParams.success ? (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-800">
            {resolvedSearchParams.success}
          </div>
        ) : null}

        {resolvedSearchParams.error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-800">
            {resolvedSearchParams.error}
          </div>
        ) : null}

        <div className="mb-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Reference Number</p>
            <p className="mt-2 text-2xl font-bold">
              {application.referenceNumber}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Current Status</p>
            <p className="mt-2 text-2xl font-bold">
              {formatStatus(application.status)}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Created</p>
            <p className="mt-2 font-semibold">
              {new Date(application.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Approval Validity Overview
          </p>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-white/80 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                Current approval validity
              </p>
              <p className="mt-2 text-base font-semibold text-gray-900">
                {getApprovalDisplay(
                  application.status,
                  application.approvalValidUntil
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-white/80 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                Reapply restriction
              </p>
              <p className="mt-2 text-base font-semibold text-gray-900">
                {application.reapplyAllowedAt
                  ? new Date(application.reapplyAllowedAt).toLocaleString()
                  : "No reapply restriction currently recorded"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
              <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">Applicant Profile</p>
                <h2 className="text-[1.05rem] font-semibold text-white">Applicant Information</h2>
              </div>
              <div className="grid gap-0 divide-y divide-[#eef0f7] sm:grid-cols-2 sm:divide-y-0">
                {[
                  { label: "Full Name", value: application.fullName },
                  { label: "Email", value: application.email },
                  { label: "Phone", value: application.phone },
                  { label: "Identity Type", value: formatIdentityType(application.identityType) },
                  { label: "ID / Passport Number", value: application.identityNumber || "Not provided" },
                  { label: "Employment Status", value: application.employmentStatus },
                  { label: "Monthly Income", value: application.monthlyIncome },
                  { label: "Salary Date", value: application.salaryDate || "Not provided" },
                ].map((item) => (
                  <div key={item.label} className="px-5 py-3.5 border-b border-[#eef0f7]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">{item.label}</p>
                    <p className="mt-1 text-[13px] font-semibold text-[#1b2345]">{item.value}</p>
                  </div>
                ))}
                <div className="col-span-2 border-b border-[#eef0f7] px-5 py-3.5 sm:col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">Preferred Vehicle</p>
                  <p className="mt-1 text-[13px] font-semibold text-[#1b2345]">{application.preferredVehicle}</p>
                </div>
                <div className="col-span-2 border-b border-[#eef0f7] px-5 py-3.5 sm:col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">Physical Address</p>
                  <p className="mt-1 text-[13px] font-semibold text-[#1b2345]">{application.physicalAddress || "Not provided"}</p>
                </div>
                <div className="col-span-2 px-5 py-3.5 sm:col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">Additional Notes</p>
                  <p className="mt-1 text-[13px] font-semibold text-[#1b2345]">{application.notes || "No additional notes provided."}</p>
                </div>
              </div>
            </div>

            {selectedVehicle ? (
              <div className="overflow-hidden rounded-[24px] border border-[#dbe6ff] bg-gradient-to-br from-[#eef4ff] to-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
                <div className="border-b border-[#dbe6ff] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">Selected Vehicle</p>
                  <h2 className="text-[1.05rem] font-semibold text-white">Vehicle Reference</h2>
                </div>
                <div className="overflow-hidden">
                  <img src={selectedVehicle.featuredImage} alt={selectedVehicle.title} className="h-56 w-full object-cover" />
                </div>
                <div className="divide-y divide-[#eef0f7]">
                  {[
                    { label: "Vehicle Title", value: selectedVehicle.title },
                    { label: "Year Model", value: selectedVehicle.yearModel },
                    { label: "Mileage", value: selectedVehicle.mileage },
                    { label: "Transmission", value: selectedVehicle.transmission },
                    { label: "Fuel Type", value: selectedVehicle.fuelType },
                    { label: "Term", value: selectedVehicle.term },
                    { label: "Deposit", value: selectedVehicle.depositAmount },
                    { label: "Monthly Payment", value: selectedVehicle.monthlyPayment },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between px-5 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">{item.label}</p>
                      <p className="text-[13px] font-semibold text-[#1b2345]">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {showContractPreparation ? (
              <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6 shadow-sm">
                <h2 className="mb-2 text-2xl font-bold text-purple-950">
                  Contract Preparation & Verification
                </h2>

                <p className="mb-6 max-w-3xl text-sm leading-6 text-purple-900">
                  Before issuing the contract, verify the customer identity,
                  contract-facing client details, selected vehicle details, and
                  final financial figures. These fields save a frozen contract
                  snapshot and do not overwrite the original application record.
                </p>

                <form
                  action={`/api/admin/prepare-contract/${application.id}`}
                  method="POST"
                  className="space-y-6"
                >
                  <div className="rounded-[18px] border border-[#e8ecf5] bg-[#fafbff] p-5">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1b2345]">
                      Contract Client Snapshot
                    </h3>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                          Client Full Name
                        </label>
                        <input
                          type="text"
                          name="contractClientFullName"
                          defaultValue={
                            application.contractClientFullName ||
                            application.fullName
                          }
                          className="w-full w-full rounded-[12px] border border-[#dde1ee] bg-white px-4 py-3 text-sm text-[#1b2345] outline-none transition focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-2 mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                          Client Email
                        </label>
                        <input
                          type="email"
                          name="contractClientEmail"
                          defaultValue={
                            application.contractClientEmail || application.email
                          }
                          className="w-full w-full rounded-[12px] border border-[#dde1ee] bg-white px-4 py-3 text-sm text-[#1b2345] outline-none transition focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10"
                        />
                      </div>

                      <div>
                        <label className="mb-2 mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                          Client Phone
                        </label>
                        <input
                          type="text"
                          name="contractClientPhone"
                          defaultValue={
                            application.contractClientPhone || application.phone
                          }
                          className="w-full w-full rounded-[12px] border border-[#dde1ee] bg-white px-4 py-3 text-sm text-[#1b2345] outline-none transition focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10"
                        />
                      </div>

                      <div>
                        <label className="mb-2 mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                          Identity Type
                        </label>
                        <input
                          type="text"
                          name="contractClientIdentityType"
                          defaultValue={
                            application.contractClientIdentityType ||
                            formatIdentityType(application.identityType)
                          }
                          className="w-full w-full rounded-[12px] border border-[#dde1ee] bg-white px-4 py-3 text-sm text-[#1b2345] outline-none transition focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10"
                        />
                      </div>

                      <div>
                        <label className="mb-2 mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                          Identity Number
                        </label>
                        <input
                          type="text"
                          name="contractClientIdentityNumber"
                          defaultValue={
                            application.contractClientIdentityNumber ||
                            application.identityNumber ||
                            ""
                          }
                          className="w-full w-full rounded-[12px] border border-[#dde1ee] bg-white px-4 py-3 text-sm text-[#1b2345] outline-none transition focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10"
                          required
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-2 mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                          Contract Address
                        </label>
                        <textarea
                          name="contractClientAddress"
                          rows={3}
                          defaultValue={
                            application.contractClientAddress ||
                            application.physicalAddress ||
                            ""
                          }
                          className="w-full w-full rounded-[12px] border border-[#dde1ee] bg-white px-4 py-3 text-sm text-[#1b2345] outline-none transition focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[18px] border border-[#e8ecf5] bg-[#fafbff] p-5">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1b2345]">
                      Contract Vehicle Snapshot
                    </h3>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="mb-2 mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                          Vehicle Title
                        </label>
                        <input
                          type="text"
                          name="contractVehicleTitle"
                          defaultValue={
                            application.contractVehicleTitle ||
                            selectedVehicle?.title ||
                            application.preferredVehicle
                          }
                          className="w-full w-full rounded-[12px] border border-[#dde1ee] bg-white px-4 py-3 text-sm text-[#1b2345] outline-none transition focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10"
                          required
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-2 mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                          Vehicle Image URL
                        </label>
                        <input
                          type="text"
                          name="contractVehicleImage"
                          defaultValue={
                            application.contractVehicleImage ||
                            selectedVehicle?.featuredImage ||
                            ""
                          }
                          className="w-full w-full rounded-[12px] border border-[#dde1ee] bg-white px-4 py-3 text-sm text-[#1b2345] outline-none transition focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10"
                        />
                      </div>

                      <div>
                        <label className="mb-2 mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                          Year Model
                        </label>
                        <input
                          type="text"
                          name="contractVehicleYearModel"
                          defaultValue={
                            application.contractVehicleYearModel ||
                            selectedVehicle?.yearModel ||
                            ""
                          }
                          className="w-full w-full rounded-[12px] border border-[#dde1ee] bg-white px-4 py-3 text-sm text-[#1b2345] outline-none transition focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10"
                        />
                      </div>

                      <div>
                        <label className="mb-2 mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                          Mileage
                        </label>
                        <input
                          type="text"
                          name="contractVehicleMileage"
                          defaultValue={
                            application.contractVehicleMileage ||
                            selectedVehicle?.mileage ||
                            ""
                          }
                          className="w-full w-full rounded-[12px] border border-[#dde1ee] bg-white px-4 py-3 text-sm text-[#1b2345] outline-none transition focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10"
                        />
                      </div>

                      <div>
                        <label className="mb-2 mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                          Transmission
                        </label>
                        <input
                          type="text"
                          name="contractVehicleTransmission"
                          defaultValue={
                            application.contractVehicleTransmission ||
                            selectedVehicle?.transmission ||
                            ""
                          }
                          className="w-full w-full rounded-[12px] border border-[#dde1ee] bg-white px-4 py-3 text-sm text-[#1b2345] outline-none transition focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10"
                        />
                      </div>

                      <div>
                        <label className="mb-2 mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                          Fuel Type
                        </label>
                        <input
                          type="text"
                          name="contractVehicleFuelType"
                          defaultValue={
                            application.contractVehicleFuelType ||
                            selectedVehicle?.fuelType ||
                            ""
                          }
                          className="w-full w-full rounded-[12px] border border-[#dde1ee] bg-white px-4 py-3 text-sm text-[#1b2345] outline-none transition focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[18px] border border-[#e8ecf5] bg-[#fafbff] p-5">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1b2345]">
                      Contract Financial Snapshot
                    </h3>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                          Deposit Amount
                        </label>
                        <input
                          type="text"
                          name="contractDepositAmount"
                          defaultValue={
                            application.contractDepositAmount ||
                            fallbackDepositAmount
                          }
                          placeholder="e.g. 8500"
                          className="w-full w-full rounded-[12px] border border-[#dde1ee] bg-white px-4 py-3 text-sm text-[#1b2345] outline-none transition focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-2 mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                          Licensing Fee
                        </label>
                        <input
                          type="text"
                          name="contractLicensingFee"
                          defaultValue={
                            application.contractLicensingFee ||
                            fallbackLicensingFee
                          }
                          placeholder="e.g. 1850"
                          className="w-full w-full rounded-[12px] border border-[#dde1ee] bg-white px-4 py-3 text-sm text-[#1b2345] outline-none transition focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-2 mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                          Monthly Payment
                        </label>
                        <input
                          type="text"
                          name="contractMonthlyPayment"
                          defaultValue={
                            application.contractMonthlyPayment ||
                            fallbackMonthlyPayment
                          }
                          placeholder="e.g. 2760"
                          className="w-full w-full rounded-[12px] border border-[#dde1ee] bg-white px-4 py-3 text-sm text-[#1b2345] outline-none transition focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-2 mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                          Contract Term
                        </label>
                        <input
                          type="text"
                          name="contractTerm"
                          defaultValue={
                            application.contractTerm ||
                            selectedVehicle?.term ||
                            "54 Months"
                          }
                          className="w-full w-full rounded-[12px] border border-[#dde1ee] bg-white px-4 py-3 text-sm text-[#1b2345] outline-none transition focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10"
                        />
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">Deposit Preview</p>
                        <p className="mt-2 text-xl font-bold text-gray-900">
                          {formatCurrency(depositForPreview)}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">
                          Licensing Preview
                        </p>
                        <p className="mt-2 text-xl font-bold text-gray-900">
                          {formatCurrency(licensingForPreview)}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                        <p className="text-sm text-blue-700">
                          Total Required Now
                        </p>
                        <p className="mt-2 text-xl font-bold text-blue-900">
                          {formatCurrency(totalNowPreview)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                      <p className="text-sm font-semibold text-amber-900">
                        First Monthly Instalment Preview
                      </p>
                      <p className="mt-1 text-lg font-bold text-amber-950">
                        {formatCurrency(monthlyPreview)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[18px] border border-[#e8ecf5] bg-[#fafbff] p-5">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1b2345]">
                      Contract Terms Snapshot
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      You can edit this contract text before the contract is
                      issued. Once issued, the client should be reviewing this
                      frozen contract snapshot, not live application values.
                    </p>

                    <textarea
                      name="contractTerms"
                      rows={20}
                      defaultValue={
                        application.contractTerms || DEFAULT_CONTRACT_TERMS
                      }
                      className="mt-4 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-purple-600"
                      required
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="submit"
                      className="inline-flex rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700"
                    >
                      Save Contract Snapshot
                    </button>

                    <p className="text-sm text-gray-600">
                      Save first, review the snapshot below, then use the status
                      form to issue the contract.
                    </p>
                  </div>
                </form>
              </div>
            ) : null}

            {showPreparedSnapshot ? (
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm">
                <h2 className="mb-5 text-2xl font-bold text-indigo-950">
                  Saved Contract Snapshot Preview
                </h2>

                <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
                  <div className="space-y-4">
                    {application.contractVehicleImage ||
                    selectedVehicle?.featuredImage ? (
                      <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-white">
                        <img
                          src={
                            application.contractVehicleImage ||
                            selectedVehicle?.featuredImage ||
                            ""
                          }
                          alt={
                            application.contractVehicleTitle ||
                            selectedVehicle?.title ||
                            "Contract vehicle"
                          }
                          className="h-64 w-full object-cover"
                        />
                      </div>
                    ) : null}

                    <div className="rounded-2xl border border-indigo-100 bg-white p-5">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1b2345]">
                        Vehicle Snapshot
                      </h3>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-sm text-gray-500">Title</p>
                          <p className="mt-1 font-semibold">
                            {application.contractVehicleTitle || "Not saved"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Year Model</p>
                          <p className="mt-1 font-semibold">
                            {application.contractVehicleYearModel || "Not saved"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Mileage</p>
                          <p className="mt-1 font-semibold">
                            {application.contractVehicleMileage || "Not saved"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Transmission</p>
                          <p className="mt-1 font-semibold">
                            {application.contractVehicleTransmission ||
                              "Not saved"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Fuel Type</p>
                          <p className="mt-1 font-semibold">
                            {application.contractVehicleFuelType || "Not saved"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Term</p>
                          <p className="mt-1 font-semibold">
                            {application.contractTerm || "Not saved"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-indigo-100 bg-white p-5">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1b2345]">
                        Client Snapshot
                      </h3>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="mt-1 font-semibold">
                            {application.contractClientFullName || "Not saved"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="mt-1 font-semibold">
                            {application.contractClientEmail || "Not saved"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="mt-1 font-semibold">
                            {application.contractClientPhone || "Not saved"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Identity Type</p>
                          <p className="mt-1 font-semibold">
                            {application.contractClientIdentityType ||
                              "Not saved"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">
                            Identity Number
                          </p>
                          <p className="mt-1 font-semibold">
                            {application.contractClientIdentityNumber ||
                              "Not saved"}
                          </p>
                        </div>

                        <div className="sm:col-span-2">
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="mt-1 font-semibold">
                            {application.contractClientAddress || "Not saved"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-indigo-100 bg-white p-5">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1b2345]">
                        Financial Snapshot
                      </h3>

                      <div className="mt-4 space-y-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm text-gray-600">Deposit</span>
                          <span className="font-semibold text-gray-900">
                            {application.contractDepositAmount || "Not saved"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm text-gray-600">
                            Licensing Fee
                          </span>
                          <span className="font-semibold text-gray-900">
                            {application.contractLicensingFee || "Not saved"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm text-gray-600">
                            Monthly Payment
                          </span>
                          <span className="font-semibold text-gray-900">
                            {application.contractMonthlyPayment || "Not saved"}
                          </span>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-semibold text-gray-900">
                              Total Required Now
                            </span>
                            <span className="text-lg font-bold text-blue-700">
                              {application.contractTotalPayableNow || "Not saved"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-indigo-100 bg-white p-5">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1b2345]">
                        Contract Terms Preview
                      </h3>

                      <div className="mt-4 max-h-[480px] overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <pre className="whitespace-pre-wrap text-sm leading-6 text-gray-800">
                          {application.contractTerms ||
                            "No contract terms saved yet."}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
              <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">Application Management</p>
                <h2 className="text-[1.05rem] font-semibold text-white">Update Status</h2>
              </div>
              <div className="p-5">
                <AdminStatusForm
                  applicationId={application.id}
                  currentStatus={application.status}
                />
              </div>
            </div>

            <AdminApprovalValidityForm
              applicationId={application.id}
              currentStatus={application.status}
              approvalValidUntil={
                application.approvalValidUntil
                  ? application.approvalValidUntil.toISOString()
                  : null
              }
            />

            <div className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
              <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">Client Documents</p>
                <h2 className="text-[1.05rem] font-semibold text-white">Uploaded Supporting Files</h2>
              </div>
              <div className="p-5">
                <AdminDocumentViewer documents={application.documents} />
              </div>
            </div>
            <AdminDocumentActions
              applicationId={application.id}
              status={application.status}
              fullName={application.fullName}
            />

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold">Status History</h2>

              {application.statusLogs.length === 0 ? (
                <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                  No status updates yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {application.statusLogs.map((log: ApplicationStatusLog) => (
                    <div
                      key={log.id}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                    >
                      <p className="font-semibold">
                        {formatStatus(log.toStatus)}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {log.note || "Status updated."}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {(application.status === "CONTRACT_ISSUED" ||
              application.status === "AWAITING_INVOICE" ||
              application.status === "INVOICE_ISSUED") && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
                <h2 className="mb-4 text-2xl font-bold text-amber-950">
                  Contract Stage Overview
                </h2>

                <div className="space-y-3 text-sm leading-6 text-amber-900">
                  <p>
                    <span className="font-semibold">Issued At:</span>{" "}
                    {application.contractIssuedAt
                      ? new Date(application.contractIssuedAt).toLocaleString()
                      : "Not recorded"}
                  </p>

                  <p>
                    <span className="font-semibold">Contract Expires:</span>{" "}
                    {application.contractExpiresAt
                      ? new Date(application.contractExpiresAt).toLocaleString()
                      : "Not recorded"}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Client Acceptance Recorded:
                    </span>{" "}
                    {application.contractAccepted ? "Yes" : "No"}
                  </p>

                  <p>
                    <span className="font-semibold">Accepted Name:</span>{" "}
                    {application.contractAcceptedName || "Not yet signed"}
                  </p>

                  <p>
                    <span className="font-semibold">Accepted At:</span>{" "}
                    {application.contractAcceptedAt
                      ? new Date(application.contractAcceptedAt).toLocaleString()
                      : "Not yet signed"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}