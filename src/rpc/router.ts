import {
	logs as adminLogs,
	createBranch,
	createRole,
	deleteRecallRule,
	deleteRole,
	deleteTemplate,
	disableUser,
	getCompany,
	listBranches,
	listCptCodes,
	listMasterVersions,
	listRecallRules,
	listRoles,
	listTemplates,
	saveCompany,
	saveCptVersion,
	saveMasterVersion,
	saveRecallRule,
	saveTemplate,
	updateBranch,
	upsertCptCode,
} from "./procedures/admin";
import {
	registerEntry as allopathyRegisterEntry,
	checkInteraction as checkAllopathyInteraction,
	problemList as listAllopathyProblems,
	listSoap,
	logChronic,
	recordImmunization,
	saveExam as saveAllopathyExam,
	saveSoap,
	triageEntry,
	problemUpsert as upsertAllopathyProblem,
} from "./procedures/allopathy";
import {
	book as bookAppointment,
	bookVideo as bookVideoAppointment,
	callNext as callNextToken,
	cancel as cancelAppointment,
	captureConsent as captureVideoConsent,
	checkin as checkinAppointment,
	computeSlots,
	get as getAppointment,
	issueCertificate,
	issueRecall,
	list as listAppointments,
	markNoShow as markAppointmentNoShow,
	queueBoard,
	reschedule as rescheduleAppointment,
	walkinToken,
} from "./procedures/appointments";
import { getSession } from "./procedures/auth";
import {
	bookNadi,
	createYogaBatch,
	dualCode as dualCodeAyush,
	enrollYoga,
	issueDiet,
	listFollowUpGrid as listAyushFollowUpGrid,
	markYogaAttendance as markAyushYogaAttendance,
	pauseExtendPackage as pauseExtendAyushPackage,
	prescribeAyush,
	recordPackageOutcome as recordAyushPackageOutcome,
	recordSitting as recordAyushSitting,
	repertorize,
	saveFollowUpGrid as saveAyushFollowUpGrid,
	saveCaseSheet,
	scheduleTherapy,
	sellPackage as sellAyushPackage,
} from "./procedures/ayush";
import {
	applyDiscount as applyBillingDiscount,
	cndnIssue as billingCndnIssue,
	collect as collectBilling,
	collectionReport,
	duesAging,
	getInvoice,
	gstExport,
	interimTab,
	invoiceFinalize,
	invoiceRaise,
	packageExpireRun,
	packageLiability,
	packageRedeem,
	packageSell,
	pricelistUpsert,
	repriceOnPayerSwitch,
	settleAdvance,
	settle as settleBilling,
} from "./procedures/billing";
import {
	bookChair,
	buildPlan as buildDentalPlan,
	chart as chartDental,
	closeStage as closeDentalStage,
	consent as dentalConsent,
	implantMilestone as dentalImplantMilestone,
	quote as dentalQuote,
	pendingJobs as pendingDentalJobs,
	raiseLabJob,
	rescheduleStage as rescheduleDentalStage,
	sellPackage as sellDentalPackage,
	trackLabJob,
} from "./procedures/dental";
import {
	addonTest,
	authorize as authorizeLab,
	cancelOrder as cancelDiagnosticOrder,
	collectSample,
	criticalAck,
	deliver as deliverLab,
	queue as diagnosticsQueue,
	getOrder as getDiagnosticOrder,
	orderLabs,
	panelCreate,
	processingStart,
	qcLog,
	radioAuthorize,
	radioBook,
	radioCheckin,
	radioReportAttach,
	radioReschedule,
	receiveSample,
	resultEnter,
	sampleReject,
	tatReport,
	testMasterUpsert,
} from "./procedures/diagnostics";
import {
	addendum as addEncounterAddendum,
	addDiagnosis as addEncounterDiagnosis,
	create as createEncounter,
	get as getEncounter,
	placeOrder as placeEncounterOrder,
	prescribe as prescribeEncounter,
	recordVitals as recordEncounterVitals,
	refill as refillEncounter,
	setFollowUp as setEncounterFollowUp,
	sign as signEncounter,
} from "./procedures/encounters";
import {
	addBlock as addFacilityBlock,
	create as createFacility,
	overlap as facilityOverlap,
	statusBoard as facilityStatusBoard,
	get as getFacility,
	list as listFacilities,
	logSterilization,
	occupy as occupyFacility,
	release as releaseFacility,
	setSchedule as setFacilitySchedule,
	update as updateFacility,
} from "./procedures/facilities";
import {
	drugAdminister as administerNursingDrug,
	ioChart as chartNursingIo,
	vitalsChart as chartNursingVitals,
	handoverCompile as compileNursingHandover,
	missedEscalate as escalateNursingMissed,
	board as nursingBoard,
	checklistRecord as recordNursingChecklist,
	painScore as scoreNursingPain,
	riskScreen as screenNursingRisk,
	handoverSign as signNursingHandover,
	sittingsSupport as supportNursingSitting,
	triageTag as tagNursingTriage,
	tasksFromOrders as tasksFromNursingOrders,
} from "./procedures/nursing";
import {
	attendanceMark,
	auditQuery,
	branchesCreate,
	complianceEvidence,
	complianceList,
	explorerExportCsv,
	explorerGrant,
	explorerQuery,
	hrStaffUpsert,
	leaveDecide,
	leaveRequest,
	mastersGet,
	mastersUpsert,
	messagingOptOut,
	messagingRetry,
	messagingSend,
	payrollExport,
	reportsDefine,
	reportsList,
	reportsRun,
	rosterPlan,
	seedPresets,
} from "./procedures/operations";
import {
	getCurrentOrganization,
	getOrganizationBySubdomain,
	listMyOrganizations,
	listOrganizations,
	updateCurrentOrganization,
} from "./procedures/organizations";
import {
	addAllergy,
	approveMerge,
	archiveConsent,
	dedupeCheck,
	enrolRecall,
	get as getPatient,
	linkFamily,
	list as listPatients,
	logCommunication,
	timeline as patientTimeline,
	register as registerPatient,
	requestMerge,
	setFlag,
	shareSlip,
} from "./procedures/patients";
import {
	transferAccept as acceptStockTransfer,
	batchReceive,
	expiryAlerts,
	getSale,
	grnVerify,
	itemUpsert,
	partialClose as partialCloseSale,
	cndnIssue as pharmacyCndnIssue,
	piBook,
	poCreate,
	reorderSuggest,
	returnAgainstBill,
	saleFromRx,
	stockCorrect,
	stockLedger,
	transfer as transferStock,
} from "./procedures/pharmacy";
import {
	addEducation,
	addPosting,
	addRegistration,
	blockLeave,
	create as createPractitioner,
	deactivate as deactivatePractitioner,
	get as getPractitioner,
	list as listPractitioners,
	nextFreeSlot,
	conflict as practitionerConflict,
	setFee,
	setSchedule as setPractitionerSchedule,
	update as updatePractitioner,
} from "./procedures/practitioners";
import {
	alertSenior as alertPsychSenior,
	assess as assessPsych,
	bookCounselling,
	bookTele as bookPsychTele,
	caregiverConsent,
	chartWithdrawal,
	closeReadiness as closePsychReadiness,
	involuntaryHook,
	prescribeControlled,
	breakGlass as psychBreakGlass,
	recallList as psychRecallList,
	relapsePlan,
	saveSafetyPlan,
	scoreScale as scorePsychScale,
	screenRisk as screenPsychRisk,
	sideEffectCheck,
} from "./procedures/psych";
import {
	addendumAppend as appendRecordAddendum,
	registersAppend as appendRecordRegister,
	docsAttach as attachRecordDocs,
	retentionCheck as checkRecordRetention,
	registersExport as exportRecordRegisters,
	consentsGet as getRecordConsents,
	encounterGet as getRecordEncounter,
	dischargeIssue as issueRecordDischarge,
	notesMask as maskRecordNotes,
	merge as mergeRecords,
	familySummaryMulti as multiResidentFamilySummary,
	dischargePending as pendingRecordDischarges,
	recordConsent as recordRecordConsent,
	breakglass as recordsBreakglass,
	familySummary as recordsFamilySummary,
	recentlyUsedRx as recordsRecentlyUsedRx,
	timeline as recordsTimeline,
	search as searchRecords,
	sharePrint as shareRecordPrint,
	shareWhatsapp as shareRecordWhatsapp,
	docsVerify as verifyRecordDocs,
	registersVoid as voidRecordRegister,
} from "./procedures/records";
import {
	assess as assessRehab,
	bookSitting as bookRehabSitting,
	buildPackage as buildRehabPackage,
	discharge as dischargeRehab,
	exerciseSheet,
	openEpisode as openRehabEpisode,
	recordSitting as recordRehabSitting,
	dayBoard as rehabDayBoard,
	progressChart as rehabProgressChart,
	rescore as rescoreRehab,
	setGoals as setRehabGoals,
	shareExerciseSheet as shareRehabExerciseSheet,
} from "./procedures/rehab";
import {
	admit as admitResident,
	allocateBed as allocateResidentBed,
	visitLog as appendResidentVisitLog,
	compileStayBill,
	feedback as feedbackResident,
	getResident,
	listResidents,
	logDaily as logResidentDaily,
	polypharmacyReview,
	raiseAlert as raiseResidentAlert,
	recordStayCharge as recordResidentStayCharge,
	familySummary as residentFamilySummary,
	round as residentRound,
	scoreGeriatric,
	sendFamilySummary as sendResidentFamilySummary,
} from "./procedures/residents";
import {
	createServiceProvider,
	listServiceProviders,
} from "./procedures/service-providers";
import {
	addDiscountRule,
	create as createService,
	definePackage,
	get as getService,
	list as listServices,
	mapFacilities as mapServiceFacilities,
	publish as publishService,
	redeem as redeemPackage,
	retire as retireService,
	setPrice as setServicePrice,
	update as updateService,
} from "./procedures/services";
import { listTenants, onboardTenant } from "./procedures/tenants";
import {
	createUser,
	getUser,
	listUsers,
	removeUser,
	updateUser,
} from "./procedures/users";

export const router = {
	admin: {
		auditLogs: {
			list: adminLogs,
		},
		branches: {
			create: createBranch,
			list: listBranches,
			update: updateBranch,
		},
		company: {
			get: getCompany,
			update: saveCompany,
		},
		cptCodes: {
			list: listCptCodes,
			upsert: upsertCptCode,
		},
		cptVersions: {
			save: saveCptVersion,
		},
		masters: {
			versions: {
				list: listMasterVersions,
				save: saveMasterVersion,
			},
		},
		recalls: {
			rules: {
				list: listRecallRules,
				remove: deleteRecallRule,
				save: saveRecallRule,
			},
		},
		roles: {
			create: createRole,
			list: listRoles,
			remove: deleteRole,
		},
		templates: {
			list: listTemplates,
			remove: deleteTemplate,
			save: saveTemplate,
		},
		users: {
			disable: disableUser,
		},
	},
	allopathy: {
		chronic: {
			log: logChronic,
		},
		exams: {
			save: saveAllopathyExam,
		},
		immunizations: {
			record: recordImmunization,
		},
		interactions: {
			check: checkAllopathyInteraction,
		},
		problems: {
			list: listAllopathyProblems,
			upsert: upsertAllopathyProblem,
		},
		registers: {
			create: allopathyRegisterEntry,
		},
		soap: {
			list: listSoap,
			save: saveSoap,
		},
		triage: {
			create: triageEntry,
		},
	},
	appointments: {
		cancel: cancelAppointment,
		certificates: {
			create: issueCertificate,
		},
		checkin: checkinAppointment,
		create: bookAppointment,
		get: getAppointment,
		list: listAppointments,
		markNoShow: markAppointmentNoShow,
		queue: {
			board: queueBoard,
			callNext: callNextToken,
		},
		recalls: {
			create: issueRecall,
		},
		reschedule: rescheduleAppointment,
		slots: {
			list: computeSlots,
		},
		video: {
			consents: {
				create: captureVideoConsent,
			},
			create: bookVideoAppointment,
		},
		walkins: {
			create: walkinToken,
		},
	},
	auth: {
		session: {
			get: getSession,
		},
	},
	ayush: {
		caseSheets: {
			save: saveCaseSheet,
		},
		diagnoses: {
			dualCode: dualCodeAyush,
		},
		diet: {
			issue: issueDiet,
		},
		followUps: {
			list: listAyushFollowUpGrid,
			save: saveAyushFollowUpGrid,
		},
		nadi: {
			book: bookNadi,
		},
		packages: {
			outcomes: {
				record: recordAyushPackageOutcome,
			},
			pauseExtend: pauseExtendAyushPackage,
			sell: sellAyushPackage,
		},
		prescriptions: {
			create: prescribeAyush,
		},
		repertory: {
			query: repertorize,
		},
		sittings: {
			record: recordAyushSitting,
		},
		therapy: {
			schedule: scheduleTherapy,
		},
		yoga: {
			attendance: {
				mark: markAyushYogaAttendance,
			},
			batches: {
				create: createYogaBatch,
			},
			enroll: enrollYoga,
		},
	},
	billing: {
		creditNotes: {
			issue: billingCndnIssue,
		},
		discounts: {
			apply: applyBillingDiscount,
		},
		invoices: {
			create: invoiceRaise,
			finalize: invoiceFinalize,
			get: getInvoice,
		},
		packages: {
			expire: packageExpireRun,
			liability: packageLiability,
			redeem: packageRedeem,
			sell: packageSell,
		},
		payments: {
			advances: {
				settle: settleAdvance,
			},
			collect: collectBilling,
			settle: settleBilling,
		},
		pricelists: {
			upsert: pricelistUpsert,
		},
		reports: {
			collection: collectionReport,
			duesAging,
			gstExport,
		},
		repricing: {
			onPayerSwitch: repriceOnPayerSwitch,
		},
		tabs: {
			interim: interimTab,
		},
	},
	dental: {
		chairs: {
			book: bookChair,
		},
		charts: chartDental,
		consents: dentalConsent,
		implants: {
			milestone: dentalImplantMilestone,
		},
		labJobs: {
			pending: pendingDentalJobs,
			raise: raiseLabJob,
			track: trackLabJob,
		},
		packages: {
			sell: sellDentalPackage,
		},
		plans: {
			build: buildDentalPlan,
		},
		quotes: dentalQuote,
		stages: {
			close: closeDentalStage,
			reschedule: rescheduleDentalStage,
		},
	},
	diagnostics: {
		masters: {
			panels: {
				create: panelCreate,
			},
			upsert: testMasterUpsert,
		},
		orders: {
			addTest: addonTest,
			cancel: cancelDiagnosticOrder,
			create: orderLabs,
			get: getDiagnosticOrder,
		},
		processing: {
			start: processingStart,
		},
		qc: {
			log: qcLog,
		},
		queue: diagnosticsQueue,
		radiology: {
			bookings: {
				authorize: radioAuthorize,
				checkin: radioCheckin,
				create: radioBook,
				reportAttach: radioReportAttach,
				reschedule: radioReschedule,
			},
		},
		reports: {
			tat: tatReport,
		},
		results: {
			acknowledgeCritical: criticalAck,
			authorize: authorizeLab,
			deliver: deliverLab,
			enter: resultEnter,
		},
		samples: {
			collect: collectSample,
			receive: receiveSample,
			reject: sampleReject,
		},
	},
	encounters: {
		addenda: {
			create: addEncounterAddendum,
		},
		create: createEncounter,
		diagnoses: {
			add: addEncounterDiagnosis,
		},
		followUps: {
			set: setEncounterFollowUp,
		},
		get: getEncounter,
		orders: {
			place: placeEncounterOrder,
		},
		prescriptions: {
			create: prescribeEncounter,
			refill: refillEncounter,
		},
		sign: signEncounter,
		vitals: {
			record: recordEncounterVitals,
		},
	},
	facilities: {
		availability: {
			checkOverlap: facilityOverlap,
		},
		blocks: {
			add: addFacilityBlock,
		},
		create: createFacility,
		get: getFacility,
		list: listFacilities,
		occupancy: {
			occupy: occupyFacility,
			release: releaseFacility,
		},
		schedules: {
			set: setFacilitySchedule,
		},
		status: {
			board: facilityStatusBoard,
		},
		sterilization: {
			log: logSterilization,
		},
		update: updateFacility,
	},
	nursing: {
		assessments: {
			risk: screenNursingRisk,
		},
		board: nursingBoard,
		charts: {
			io: chartNursingIo,
			pain: scoreNursingPain,
			vitals: chartNursingVitals,
		},
		checklists: {
			record: recordNursingChecklist,
		},
		escalations: {
			missed: escalateNursingMissed,
		},
		handovers: {
			compile: compileNursingHandover,
			sign: signNursingHandover,
		},
		medications: {
			administer: administerNursingDrug,
		},
		sittings: {
			support: supportNursingSitting,
		},
		tasks: {
			fromOrders: tasksFromNursingOrders,
		},
		triage: {
			tag: tagNursingTriage,
		},
	},
	operations: {
		audit: {
			query: auditQuery,
		},
		branches: {
			create: branchesCreate,
		},
		compliance: {
			evidence: complianceEvidence,
			list: complianceList,
		},
		explorer: {
			exportCsv: explorerExportCsv,
			grant: explorerGrant,
			query: explorerQuery,
		},
		hr: {
			attendance: {
				mark: attendanceMark,
			},
			leave: {
				decide: leaveDecide,
				request: leaveRequest,
			},
			payroll: {
				export: payrollExport,
			},
			roster: {
				plan: rosterPlan,
			},
			staff: {
				upsert: hrStaffUpsert,
			},
		},
		masters: {
			get: mastersGet,
			upsert: mastersUpsert,
		},
		messaging: {
			optOut: messagingOptOut,
			retry: messagingRetry,
			send: messagingSend,
		},
		presets: {
			seed: seedPresets,
		},
		reports: {
			define: reportsDefine,
			list: reportsList,
			run: reportsRun,
		},
	},
	organizations: {
		current: {
			get: getCurrentOrganization,
			update: updateCurrentOrganization,
		},
		getBySubdomain: getOrganizationBySubdomain,
		list: listOrganizations,
		listMine: listMyOrganizations,
	},
	patients: {
		allergies: {
			add: addAllergy,
		},
		communications: {
			log: logCommunication,
		},
		consents: {
			archive: archiveConsent,
		},
		create: registerPatient,
		dedupe: {
			check: dedupeCheck,
		},
		family: {
			link: linkFamily,
		},
		flags: {
			set: setFlag,
		},
		get: getPatient,
		list: listPatients,
		merges: {
			approve: approveMerge,
			request: requestMerge,
		},
		recalls: {
			enroll: enrolRecall,
		},
		slips: {
			share: shareSlip,
		},
		timeline: patientTimeline,
	},
	pharmacy: {
		alerts: {
			expiry: expiryAlerts,
			reorder: reorderSuggest,
		},
		batches: {
			receive: batchReceive,
		},
		creditNotes: {
			issue: pharmacyCndnIssue,
		},
		items: {
			upsert: itemUpsert,
		},
		purchases: {
			bookInvoice: piBook,
			create: poCreate,
			verifyGrn: grnVerify,
		},
		sales: {
			createFromRx: saleFromRx,
			get: getSale,
			partialClose: partialCloseSale,
			return: returnAgainstBill,
		},
		stock: {
			correct: stockCorrect,
			ledger: stockLedger,
		},
		transfers: {
			accept: acceptStockTransfer,
			create: transferStock,
		},
	},
	practitioners: {
		availability: {
			conflict: practitionerConflict,
			nextFreeSlot,
		},
		create: createPractitioner,
		credentials: {
			education: {
				add: addEducation,
			},
			postings: {
				add: addPosting,
			},
			registrations: {
				add: addRegistration,
			},
		},
		deactivate: deactivatePractitioner,
		fees: {
			set: setFee,
		},
		get: getPractitioner,
		leave: {
			block: blockLeave,
		},
		list: listPractitioners,
		schedules: {
			set: setPractitionerSchedule,
		},
		update: updatePractitioner,
	},
	psych: {
		assessments: assessPsych,
		breakGlass: psychBreakGlass,
		consents: {
			caregiver: caregiverConsent,
		},
		counselling: {
			book: bookCounselling,
		},
		involuntary: involuntaryHook,
		prescriptions: {
			controlled: prescribeControlled,
		},
		readiness: {
			close: closePsychReadiness,
		},
		recalls: {
			list: psychRecallList,
		},
		relapsePlans: relapsePlan,
		risks: {
			screen: screenPsychRisk,
		},
		safetyPlans: {
			save: saveSafetyPlan,
		},
		scales: {
			score: scorePsychScale,
		},
		seniors: {
			alert: alertPsychSenior,
		},
		sideEffects: {
			check: sideEffectCheck,
		},
		tele: {
			book: bookPsychTele,
		},
		withdrawal: {
			chart: chartWithdrawal,
		},
	},
	records: {
		addenda: {
			append: appendRecordAddendum,
		},
		breakglass: recordsBreakglass,
		consents: {
			get: getRecordConsents,
			record: recordRecordConsent,
		},
		discharges: {
			issue: issueRecordDischarge,
			pending: pendingRecordDischarges,
		},
		docs: {
			attach: attachRecordDocs,
			verify: verifyRecordDocs,
		},
		encounters: {
			get: getRecordEncounter,
		},
		family: {
			summary: recordsFamilySummary,
			summaryMulti: multiResidentFamilySummary,
		},
		merge: mergeRecords,
		notes: {
			mask: maskRecordNotes,
		},
		prescriptions: {
			recentlyUsed: recordsRecentlyUsedRx,
		},
		registers: {
			append: appendRecordRegister,
			export: exportRecordRegisters,
			void: voidRecordRegister,
		},
		retention: {
			check: checkRecordRetention,
		},
		search: searchRecords,
		sharing: {
			print: shareRecordPrint,
			whatsapp: shareRecordWhatsapp,
		},
		timeline: recordsTimeline,
	},
	rehab: {
		assessments: assessRehab,
		board: {
			day: rehabDayBoard,
		},
		discharge: dischargeRehab,
		episodes: {
			open: openRehabEpisode,
		},
		exercises: {
			share: shareRehabExerciseSheet,
			sheet: exerciseSheet,
		},
		goals: {
			set: setRehabGoals,
		},
		packages: {
			build: buildRehabPackage,
		},
		progress: {
			chart: rehabProgressChart,
		},
		scores: {
			rescore: rescoreRehab,
		},
		sittings: {
			book: bookRehabSitting,
			record: recordRehabSitting,
		},
	},
	residents: {
		alerts: {
			raise: raiseResidentAlert,
		},
		assessments: {
			geriatric: scoreGeriatric,
			polypharmacy: polypharmacyReview,
		},
		beds: {
			allocate: allocateResidentBed,
		},
		create: admitResident,
		daily: {
			log: logResidentDaily,
		},
		family: {
			sendSummary: sendResidentFamilySummary,
			summary: residentFamilySummary,
		},
		feedback: feedbackResident,
		get: getResident,
		list: listResidents,
		rounds: residentRound,
		stays: {
			compileBill: compileStayBill,
			recordCharge: recordResidentStayCharge,
		},
		visits: {
			log: appendResidentVisitLog,
		},
	},
	serviceProviders: {
		create: createServiceProvider,
		list: listServiceProviders,
	},
	services: {
		create: createService,
		discounts: {
			addRule: addDiscountRule,
		},
		facilities: {
			map: mapServiceFacilities,
		},
		get: getService,
		list: listServices,
		packages: {
			define: definePackage,
			redeem: redeemPackage,
		},
		prices: {
			set: setServicePrice,
		},
		publish: publishService,
		retire: retireService,
		update: updateService,
	},
	tenants: {
		list: listTenants,
		onboard: onboardTenant,
	},
	users: {
		create: createUser,
		get: getUser,
		list: listUsers,
		remove: removeUser,
		update: updateUser,
	},
};

export type Router = typeof router;
