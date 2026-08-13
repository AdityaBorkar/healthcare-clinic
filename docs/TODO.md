# TODO

# PROPER ENV INJECTION, RUN COMMAND PROPER, ENV VALIDATION, DOCKER POSTGRES RUNNING, DONE
- Script based onboarding

app:STORAGE_ACCESS_KEY: dms
app:STORAGE_BUCKET: dms-platform
app:STORAGE_ENDPOINT: http://localhost:8333
app:STORAGE_FORCE_PATH_STYLE: true
app:STORAGE_REGION: us-east-1
app:STORAGE_SECRET_KEY: dms_password

Speed: 2 modules per day for 5 days a week. Rest 2 days must be on review fo those modules.

---

- Administration
- Practitioners
- Patients
- Facilities
- Services

- Appointments
- Nursing
- Medical Records

- Data Explorer
- Forms
- Reports

- Accounting Module

## Architecture

- using drizzle-zod to derive enums
- Services Architecture with proper unit testing
- Files Management
  - /files for all files
  - Rename /lib/storage -> /lib/files
- /auth for authentication (replace server-actions with orpc)
- Proper Management of Company Subdomain and Branch
  - Company & Branch Selector
  - /login route for hospitals with subdomains.
    - Example: fortis.shaun.com/login
  - Compulsary subdomain for all hospitals
  - Create a separate navigation NavLink for going forward to="/$/route"

## Phase 2

- Sidebar Views: ERP, Nursing, Doctor, Reception

## Phase 3

- Event Driven Architecture
- HA Deployent
  - (2 servers at different location = Mumbai & Delhi/Hyderabad/Bangalore)
  - (3 file-servers at different location = Mumbai & Delhi/Hyderabad/Bangalore & Germany)
  - Container crashed / unhealthy / stopped?
  - Rolling restart?
  - Zero-downtime deploy?
  - Service discovery?
- Docker:
  - healthcheck:
- Do not lose State on Server/DB restarts/recreation
  - Queues
  - Crons
  - Workflows
- Airgapped Deployment


--------------------------------------------

# TODO

**CREATE A PLAN OF ACTION AND PREPARE AND EXECUTE AT-LEAST 3 PLANS BEFORE GOING TO GYM.**

Failed to upload Photo

Image uploads must be converted to WebP and compressed to an optimal size and quality when stored. Reject if the compressed size exceeds 2MB.
PDF uploads must be compressed to an optimal size and quality when stored. Reject if the compressed size exceeds 20MB.


---

Standardization of Forms & Form Component

Form must be wrapped in a form component that handles validation and submission and helpers for fields.
Create a Smart Field Component to handle field rendering and validation and error handling.
Use field-map to map components to their types. Input Field Types must be defined in integration.
Nested Forms are currently out of scope.

Remember, the architecture of this integration must be design-agnostic and hence no design components or elements must be defined there.
integrations/forms shall be separated from the repository as a separate package later.


Services Form:
- 

Entities Form:
- Vendor Management

Facilities Form:
- Category: OT / Bed / Ward / Radiology
- Remove Quantity Field
- Remove Is Bed Field

Extract Appointment Engine as a separate module/library

Perform Data Explorer Integration
Perform Reports Integration
Perform WhatsApp Integration

---

(branchless)
- Administration
- Staff
- Practitioners
- Facilities
- Services
- Pricelists
- Entities
- Patients
- Reports UNTIL NOW

---

- OPD Dashboard
- Appointments
- Queue
- Medical Records
- Beds

That's the target for the day. OPD only without billing.

---

- UNIVERSAL EXPORT/PRINT FUNCTIONALITY
- Global Search Functionality (Ctrl + F)
- Global Actions Functionality (Ctrl + K)
- Standardize the Forms and Views and Components and Dashboards
- Structured logs and errors
- Pub-Sub Pipeline for Events (for SOPs and SLAs) [SOPs and SLAs are OUT-OF-SCOPE]

---

- Sales
- Reports
- Lab
- Radiology
- Pharmacy
- Inventory
- OT

---

- Add a Map toggle in the header to view the facilities as a floor plan and edit them. Use grid systems for it. Manage various floors and the shape of each floor.
- 
- Write down the pattern that is existing for Entity, Practitioner, etc.
- Human Resources is the list of staff that shall include the housekeeping, nurses, admin staff, etc.
- Sales Invoice / Credit Note / Debit Note
  - Manage Continous Billing
- Purchase Invoice / Credit Note / Debit Note

Work Order??

---

SOP SLA

Masters for Doctor Specialization Management??

      <div>
        <h1 className="font-bold text-2xl">Billing Codes</h1>
        <p className="text-muted-foreground">
          Manage ICD, CPT, and HCPCS code configurations
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <IconCode className="h-5 w-5 text-primary" />
            <CardTitle>Code Management</CardTitle>
          </div>
          <CardDescription>
            Configure diagnosis, procedure, and billing codes
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">
            Billing code settings coming soon
          </p>
          <p className="text-muted-foreground text-sm">
            Import and manage ICD-10, CPT, and HCPCS code sets
          </p>
        </CardContent>
      </Card>
        
      <div>
        <h1 className="font-bold text-2xl">Lab Tests</h1>
        <p className="text-muted-foreground">
          Configure laboratory test definitions and parameters
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <IconTestPipe className="h-5 w-5 text-primary" />
            <CardTitle>Lab Test Configuration</CardTitle>
          </div>
          <CardDescription>
            Define tests, reference ranges, and specimen requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">Lab test settings coming soon</p>
          <p className="text-muted-foreground text-sm">
            Configure test panels, reference ranges, and result templates
          </p>
        </CardContent>
      </Card>

      
---

Facilities include a list of facilities that are available in the hospital. Categories include - MRI, CT, X-Ray, Ultrasound, etc. These are rooms or facilities where one-person can use at a time. Create a Master List JSON to include the list of preset facility categories. Every Facility must include a schedule that defines the availability of the facility.

Services include a list of services that are available in the hospital. Examples include - MRI Brain, MRI Abdomen, CT Chest, X-Ray Head, Ultrasound Liver, etc. Every Service must include a list of facility that needs to be used and the associated cost for that service.

---

## OT Management Module

Phase 1: Pre-Operative

    Surgery Request: Doctor submits surgery request from IPD with diagnosis and procedure
    OT Scheduling: Surgery booked on OT calendar with estimated duration
    Pre-Op Assessment: Anesthesia fitness assessment, consent forms, investigation review
    Checklist - Sign In: Patient identity, site marking, allergy check, ASA score

Phase 2: Intra-Operative

    Checklist - Time Out: Team introduction, procedure confirmation, anticipated events
    Anesthesia Record: Vitals monitoring, drug administration, fluid balance
    Consumable Tracking: Real-time recording of sutures, implants, disposables
    Surgical Notes: Procedure details, findings, complications
    Checklist - Sign Out: Sponge/instrument count, specimen labeling, post-op plan

Phase 3: Post-Operative

    Recovery Monitoring: Post-anesthesia care unit (PACU) vitals
    Surgeon's Post-Op Notes: Orders for pain management, antibiotics
    Billing: Auto-capture of all OT charges, implants, consumables


Visual Calendar: See all OTs, all days at a glance
Conflict Detection: Alerts when surgeon or OT is double-booked
Duration Estimation: Historical data predicts surgery duration
Buffer Time: Automatic buffer between surgeries for prep
Emergency Slots: Reserved slots for emergency surgeries
Mobile Access: Surgeons check and manage schedule from their phone

OT Calendar	Visual scheduling with drag-drop	40% less scheduling conflicts
WHO Checklist	Mandatory 3-phase digital checklist	Zero wrong-site surgeries
Anesthesia Charting	Digital vitals and drug recording	Complete audit trail
Implant Tracking	Barcode-based implant + batch tracking	100% implant traceability
Auto-Billing	OT charges captured automatically	Zero revenue leakage
Surgeon Dashboard	Surgery calendar, patient history	Better surgical planning
OT Utilization	Utilization % and downtime analysis	Maximize OT revenue

Free customizations as per requirments for 2 Years
Maintaining pre and post condition of the patient while operating in OT
Scheduling Operations i.e OT Booking.
Medicine - Inventory and stock management at OT
Scheduling Sterilization of OT
Audits & Reviews of Sterilization Activities referring to the predefined Checklist.
Maintaining Data of Team Members engaged in Surgery / Operation in OT. 
    
With a fully integrated OT Module in Hospital Management System, hospitals can:
    Ensure accurate OT scheduling and digital surgery booking
    Automate pre-anesthesia checkups (PAC), consent forms, and lab verifications
    Maintain compliance with the WHO Surgical Safety Checklist
    Track sterilization, instrument usage, and implant logs with ease
    Digitally document intra-operative notes, anesthesia charts, and OT utilization reports
    Improve patient safety with real-time post-operative monitoring and recovery tracking
    Simplify billing with automated OT charges, surgeon/anesthetist fees, and consumables

OT Room Management:  Surgery Scheduling: This feature enables healthcare staff to schedule surgical procedures efficiently. It takes into account surgeon availability, operating room availability, and the type of surgery to be performed.

Patient Information:  The system stores and manages patient information, including medical history, allergies, and demographic data. It ensures that surgeons and medical staff have access to essential patient details before and during surgery.

Anesthesia Management:  Anesthesia management tools assist anesthetists in selecting and administering the appropriate anesthesia for each patient. It can include anesthesia records, drug administration tracking, and monitoring of vital signs during anesthesia.

Operating Room Preparation:  This component helps in preparing the operating room for surgery. It ensures that the necessary equipment, surgical instruments, and supplies are available and properly sterilized.

Patient Consent:  Digital consent forms and documentation can be managed within the system, allowing patients to provide informed consent for surgical procedures electronically.

Preoperative Checklist:  A preoperative checklist helps ensure that all necessary preparations are in place before surgery, including patient-specific requirements, equipment checks, and safety protocols.

Surgery Documentation:  The system enables the documentation of surgical procedures in real-time. Surgeons can record details of the surgery, including any unexpected findings, procedures performed, and complications encountered.

Postoperative Care:  It assists in managing postoperative care plans, including medication orders, wound care instructions, and other post-surgical requirements.

Postoperative Monitoring and Discharge:  The system can track and monitor patients in the postoperative recovery period. It helps in determining when a patient is ready for discharge and generates discharge instructions.

Integration with EHR (Electronic Health Records):  Seamless integration with the hospital’s EHR system allows for easy access to patient records, medical histories, and surgical plans. It ensures that all relevant patient data is readily available to the surgical team.

Billing and Claims Processing:  An OT Management System may include billing features to streamline the billing process for surgical procedures. It can generate accurate bills and claims for insurance purposes.

Reporting and Analytics:  Reporting tools provide insights into operating room utilization, surgery duration, resource allocation, and other key performance metrics. Analytics help in optimizing processes and resource management.

Integration with Other Software:  An OT Management System can integrate with various other healthcare software applications, such as EHRs, billing systems, anesthesia monitoring systems, and laboratory information systems. This integration enhances data exchange and interoperability across the healthcare IT ecosystem.

OT Doctor and Staff Scheduling:  The system allows for the scheduling and tracking of surgeons, anesthetists, nurses, and other staff involved in surgical procedures. It helps ensure that the right personnel are available for each surgery.

Patient Monitoring:  This component enables real-time monitoring of patients undergoing surgery. It can integrate with various medical devices to display vital signs, anesthesia information, and other relevant patient data to the surgical team.

OT Inventory Management: OT Management Systems often include features to manage and track surgical instruments, supplies, and equipment used in the operating room. This helps in maintaining an adequate inventory and ensuring that instruments are properly sterilized and available for procedures.

OT Types: The system allows for the classification and organization of different types of surgeries. It helps in categorizing procedures, which can be useful for scheduling and resource allocation.

OT Module Workflow in IPD
1. Surgery Scheduling / Booking
2. Pre-operative Preparation
3. OT Room Preparation
4. Intra-operative Phase
5. Post-operative Phase
6. OT Documentation
7. Post-operative Follow-up
8. Discharge Planning
EMR for OT notes and orders, Barcode tracking for instruments/implants, Consent digitization, OT dashboard for scheduling/availability.

Reports & Analytics
    OT utilization reports
    Surgeon performance analysis
    Surgery duration tracking
    Cost vs revenue reports
    Cancellation & delay analysis

---

## Out of Scope

- External API:
  - Bank Account Validation (Penny Drop)
  - National Medical Council Validation
  - Bank Account IFSC Validation
  - Health Insurance Validation
  - CKYC Validation
- Medico Legal Case
- Document OCR / Prescription OCR
- Modules
  - Task Tracking
  - Helpdesk / Task Tracking: Raising Issues with External Vendors
  - Security Module
    - Ward Visiting Timings and Scan for Verification
  - Payments API
    - POS
    - Auto-Match NEFT/RTGS (or Virtual Account Collection)
    - Payouts
- Multi-Tenant Architecture
  - Dashboards
  - Onboarding
  - Auth: OIDC/SSO/SAML
- Horizontal Scaling
- LMS / Docs to teach this software
