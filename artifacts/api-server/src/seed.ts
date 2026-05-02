import { db } from "@workspace/db";
import {
  clientsTable,
  caregiversTable,
  appointmentsTable,
  callLogsTable,
  remindersTable,
  escalationsTable,
  voiceAgentConfigTable,
} from "@workspace/db";

const DEFAULT_SYSTEM_PROMPT = `You are Clara, a warm and professional AI assistant for a home care agency in San Jose, California. Your role is to help families, clients, and caregivers with compassionate and efficient service.

You can help callers with:
- Information about home care services (daily assistance, companionship, transportation, telehealth, medication management)
- Scheduling and confirming appointments
- Medication and visit reminders
- Connecting families with the right care coordinator
- General questions about our care programs

Always speak warmly and with patience. Many of our callers are seniors or their family members who may be in stressful situations. If a caller has an urgent medical emergency, always instruct them to call 911 first.

For non-urgent urgent issues or if a caller is very distressed, offer to connect them to our on-call coordinator.

We support conversations in English, Spanish, Vietnamese, Mandarin, and Tagalog. Detect the caller's preferred language and respond in kind.`;

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing
  await db.delete(escalationsTable);
  await db.delete(remindersTable);
  await db.delete(callLogsTable);
  await db.delete(appointmentsTable);
  await db.delete(clientsTable);
  await db.delete(caregiversTable);
  await db.delete(voiceAgentConfigTable);

  // Voice agent config
  await db.insert(voiceAgentConfigTable).values({
    assistantName: "Clara",
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    supportedLanguages: "English,Spanish,Vietnamese,Mandarin,Tagalog",
    escalationPhone: "+14085550100",
    isActive: true,
    maxCallDurationSeconds: 600,
  });

  // Caregivers
  const caregivers = await db.insert(caregiversTable).values([
    {
      name: "Maria Santos",
      phone: "+14081112001",
      email: "maria.santos@careconnect.com",
      role: "caregiver",
      availability: "full_time",
      languages: "English,Spanish,Tagalog",
      certifications: "CNA, CPR",
      status: "active",
      hireDate: "2021-03-15",
    },
    {
      name: "Linh Nguyen",
      phone: "+14081112002",
      email: "linh.nguyen@careconnect.com",
      role: "nurse",
      availability: "full_time",
      languages: "English,Vietnamese",
      certifications: "RN, Wound Care",
      status: "active",
      hireDate: "2020-07-01",
    },
    {
      name: "James Okonkwo",
      phone: "+14081112003",
      email: "james.okonkwo@careconnect.com",
      role: "caregiver",
      availability: "part_time",
      languages: "English",
      certifications: "HHA, CPR",
      status: "active",
      hireDate: "2022-01-10",
    },
    {
      name: "Rosa Flores",
      phone: "+14081112004",
      email: "rosa.flores@careconnect.com",
      role: "coordinator",
      availability: "full_time",
      languages: "English,Spanish",
      certifications: "BSW, Care Coordination",
      status: "active",
      hireDate: "2019-05-20",
    },
    {
      name: "Kevin Park",
      phone: "+14081112005",
      email: "kevin.park@careconnect.com",
      role: "caregiver",
      availability: "on_call",
      languages: "English,Mandarin",
      certifications: "CNA",
      status: "on_leave",
      hireDate: "2023-02-14",
    },
    {
      name: "Ana Reyes",
      phone: "+14081112006",
      email: "ana.reyes@careconnect.com",
      role: "supervisor",
      availability: "full_time",
      languages: "English,Spanish,Tagalog",
      certifications: "BSN, Care Management",
      status: "active",
      hireDate: "2018-09-01",
    },
  ]).returning();

  // Clients
  const clients = await db.insert(clientsTable).values([
    {
      name: "Eleanor Tanaka",
      dateOfBirth: "1938-04-12",
      address: "1245 Willow Glen Way, San Jose, CA 95125",
      phone: "+14082221001",
      preferredLanguage: "English",
      carePlan: "Daily assistance with morning routine, medication management 3x/day, companionship visits twice weekly. Requires assistance with mobility due to hip replacement (Nov 2023). Low sodium diet. PT exercises Mon/Wed/Fri.",
      emergencyContact: "David Tanaka (Son)",
      emergencyPhone: "+14082221002",
      status: "active",
      notes: "Highly independent spirit. Enjoys crossword puzzles and gardening. Hard of hearing in left ear.",
    },
    {
      name: "Roberto Vargas",
      dateOfBirth: "1945-09-03",
      address: "789 Almaden Blvd, San Jose, CA 95128",
      phone: "+14082221003",
      preferredLanguage: "Spanish",
      carePlan: "Companionship 5 days/week. Transportation to dialysis Mon/Wed/Fri. Medication reminders morning and evening. Diabetic diet monitoring.",
      emergencyContact: "Carmen Vargas (Wife)",
      emergencyPhone: "+14082221004",
      status: "active",
      notes: "Prefers Spanish-speaking caregivers. Very social — talks extensively about his years as a school principal. Dialysis clinic: Valley Medical, Santa Clara.",
    },
    {
      name: "Mei-Ling Chen",
      dateOfBirth: "1932-11-28",
      address: "2034 Tully Road, San Jose, CA 95122",
      phone: "+14082221005",
      preferredLanguage: "Mandarin",
      carePlan: "Full-time personal care assistance. Memory support program. Meals preparation. Family check-ins via video call every Sunday.",
      emergencyContact: "Jennifer Chen (Daughter)",
      emergencyPhone: "+14082221006",
      status: "active",
      notes: "Early-stage dementia diagnosed Jan 2024. Responds well to music therapy. Keep routine consistent.",
    },
    {
      name: "Frank Kowalski",
      dateOfBirth: "1950-06-17",
      address: "456 Berryessa Rd, San Jose, CA 95133",
      phone: "+14082221007",
      preferredLanguage: "English",
      carePlan: "Post-stroke rehabilitation support. Daily physical therapy exercises. Speech therapy follow-up twice weekly. Medication management.",
      emergencyContact: "Barbara Kowalski (Wife)",
      emergencyPhone: "+14082221008",
      status: "active",
      notes: "Recovering from stroke (March 2024). Left-side weakness. Speech improving. Motivated and cooperative.",
    },
    {
      name: "Nguyen Thi Hoa",
      dateOfBirth: "1940-02-14",
      address: "1567 Story Rd, San Jose, CA 95122",
      phone: "+14082221009",
      preferredLanguage: "Vietnamese",
      carePlan: "Light housekeeping, meal preparation, companionship. Weekly telehealth check-in with PCP. Blood pressure monitoring daily.",
      emergencyContact: "Minh Nguyen (Son)",
      emergencyPhone: "+14082221010",
      status: "active",
      notes: "Lives alone. Very private. Prefers female caregivers. Buddhist — observe dietary restrictions.",
    },
    {
      name: "Dorothy Marshall",
      dateOfBirth: "1936-08-22",
      address: "890 Lincoln Ave, San Jose, CA 95126",
      phone: "+14082221011",
      preferredLanguage: "English",
      carePlan: "24-hour home care. Advanced COPD management. Oxygen equipment monitoring. Palliative care coordination.",
      emergencyContact: "Thomas Marshall (Husband)",
      emergencyPhone: "+14082221012",
      status: "on_hold",
      notes: "Currently hospitalized at Good Samaritan. Care plan on hold pending discharge (expected May 8). Family very involved.",
    },
    {
      name: "Samuel Reyes",
      dateOfBirth: "1958-12-05",
      address: "324 Keyes St, San Jose, CA 95112",
      phone: "+14082221013",
      preferredLanguage: "Spanish",
      carePlan: "Post-surgical care following knee replacement. PT exercises daily. Wound care 3x/week. Medication management.",
      emergencyContact: "Lucia Reyes (Sister)",
      emergencyPhone: "+14082221014",
      status: "active",
      notes: "Surgery was April 15, 2024. Recovering ahead of schedule. Good humor, easy to work with.",
    },
    {
      name: "Agnes Kim",
      dateOfBirth: "1943-07-30",
      address: "2200 Aborn Rd, San Jose, CA 95121",
      phone: "+14082221015",
      preferredLanguage: "English",
      carePlan: "Wellness visits 3x/week. Medication oversight. Fall prevention program. Social engagement activities.",
      emergencyContact: "Paul Kim (Son)",
      emergencyPhone: "+14082221016",
      status: "inactive",
      notes: "Temporarily inactive — moved in with family for 6 weeks. Expected to resume care June 2024.",
    },
  ]).returning();

  // Appointments (next 2 weeks + past 2 weeks)
  const now = new Date();
  const day = (offset: number, hour: number, minute = 0) =>
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset, hour, minute);

  await db.insert(appointmentsTable).values([
    { clientId: clients[0].id, caregiverId: caregivers[0].id, scheduledAt: day(0, 9), durationMinutes: 120, type: "daily_assistance", status: "confirmed", notes: "Morning routine + PT exercises" },
    { clientId: clients[1].id, caregiverId: caregivers[0].id, scheduledAt: day(0, 11, 30), durationMinutes: 90, type: "transportation", status: "confirmed", notes: "Dialysis transport to Valley Medical" },
    { clientId: clients[3].id, caregiverId: caregivers[1].id, scheduledAt: day(0, 14), durationMinutes: 60, type: "telehealth", status: "scheduled", notes: "Speech therapy follow-up" },
    { clientId: clients[4].id, caregiverId: caregivers[1].id, scheduledAt: day(1, 10), durationMinutes: 45, type: "telehealth", status: "scheduled", notes: "BP monitoring + PCP check-in" },
    { clientId: clients[2].id, caregiverId: caregivers[3].id, scheduledAt: day(1, 13), durationMinutes: 180, type: "personal_care", status: "scheduled", notes: "Full personal care + family video call prep" },
    { clientId: clients[6].id, caregiverId: caregivers[0].id, scheduledAt: day(2, 9), durationMinutes: 60, type: "personal_care", status: "scheduled", notes: "Wound care + PT exercises" },
    { clientId: clients[0].id, caregiverId: caregivers[2].id, scheduledAt: day(2, 15), durationMinutes: 120, type: "companionship", status: "scheduled", notes: "Afternoon visit + gardening assistance" },
    { clientId: clients[1].id, caregiverId: caregivers[0].id, scheduledAt: day(3, 11), durationMinutes: 90, type: "transportation", status: "scheduled", notes: "Dialysis transport" },
    { clientId: clients[3].id, caregiverId: caregivers[1].id, scheduledAt: day(4, 10), durationMinutes: 60, type: "daily_assistance", status: "scheduled", notes: "Morning exercises + medication" },
    { clientId: clients[2].id, caregiverId: caregivers[3].id, scheduledAt: day(7, 13), durationMinutes: 120, type: "personal_care", status: "scheduled", notes: "Weekly full care visit" },
    // Past appointments
    { clientId: clients[0].id, caregiverId: caregivers[0].id, scheduledAt: day(-1, 9), durationMinutes: 120, type: "daily_assistance", status: "completed", notes: "Morning routine" },
    { clientId: clients[1].id, caregiverId: caregivers[0].id, scheduledAt: day(-1, 11), durationMinutes: 90, type: "transportation", status: "completed", notes: "Dialysis transport" },
    { clientId: clients[3].id, caregiverId: caregivers[1].id, scheduledAt: day(-2, 14), durationMinutes: 60, type: "telehealth", status: "completed", notes: "" },
    { clientId: clients[4].id, caregiverId: caregivers[1].id, scheduledAt: day(-3, 10), durationMinutes: 45, type: "telehealth", status: "completed", notes: "BP check" },
    { clientId: clients[7].id, caregiverId: caregivers[2].id, scheduledAt: day(-1, 14), durationMinutes: 90, type: "medication_management", status: "no_show", notes: "Client not home — family notified" },
  ]);

  // Call logs (past 2 weeks of AI-handled calls)
  await db.insert(callLogsTable).values([
    {
      clientId: clients[0].id,
      callerPhone: "+14082221001",
      callerName: "Eleanor Tanaka",
      transcript: "Clara: Hello, this is Clara from CareConnect. How can I help you today?\nCaller: Hi dear, this is Eleanor. I just wanted to confirm my appointment tomorrow morning with Maria.\nClara: Of course, Mrs. Tanaka! Your appointment with Maria Santos is confirmed for tomorrow at 9 AM. She'll be helping with your morning routine and physical therapy exercises. Is there anything else you need?\nCaller: No, that's all. You're very helpful!\nClara: Thank you, Mrs. Tanaka. Have a wonderful evening!",
      intent: "appointment_request",
      language: "English",
      durationSeconds: 87,
      outcome: "resolved",
    },
    {
      clientId: clients[1].id,
      callerPhone: "+14082221004",
      callerName: "Carmen Vargas",
      transcript: "Clara: Buenas tardes, habla Clara de CareConnect. ¿En qué le puedo ayudar?\nCaller: Hola, soy Carmen, la esposa de Roberto Vargas. Quería preguntar si pueden cambiar el horario del lunes para las 10 de la mañana.\nClara: Claro que sí, señora Vargas. Voy a notar su solicitud de cambiar el transporte del lunes al diálisis a las 10 AM. Un coordinador la confirmará pronto.\nCaller: Muchas gracias.\nClara: Con gusto. ¡Que tengan un buen día!",
      intent: "appointment_request",
      language: "Spanish",
      durationSeconds: 112,
      outcome: "resolved",
    },
    {
      callerPhone: "+14082221006",
      callerName: "Jennifer Chen",
      transcript: "Clara: Hello, this is Clara from CareConnect. How can I help you today?\nCaller: Hi, I'm Jennifer Chen. My mother Mei-Ling is your client. I'm calling because I noticed she seemed more confused than usual this morning during our video call. Should I be concerned?\nClara: Thank you for calling, Jennifer. I understand your concern — changes in your mother's cognition are important to note. I'm flagging this for our care coordinator right away. Someone from our team will reach out to you within the next two hours. In the meantime, if you notice any sudden severe changes, please call 911.\nCaller: Thank you so much. I've been so worried.\nClara: We completely understand. Your mother is in good hands. Is there anything else I can help with?\nCaller: No, that's all. Thank you.",
      intent: "urgent_issue",
      language: "English",
      durationSeconds: 178,
      outcome: "escalated",
    },
    {
      clientId: clients[3].id,
      callerPhone: "+14082221007",
      callerName: "Frank Kowalski",
      transcript: "Clara: Hello, this is Clara from CareConnect.\nCaller: Hi, this is Frank. I wanted to ask about the speech therapy — when is my next appointment?\nClara: Hi Frank! Let me check that for you. Your next speech therapy follow-up is scheduled for tomorrow at 2 PM with Linh Nguyen. She'll be coming to your home.\nCaller: Perfect. And can I get a reminder call about an hour before?\nClara: Absolutely, I'll make note of that for you. You'll receive a call at 1 PM tomorrow as a reminder.\nCaller: Thanks!",
      intent: "appointment_request",
      language: "English",
      durationSeconds: 94,
      outcome: "resolved",
    },
    {
      clientId: clients[4].id,
      callerPhone: "+14082221009",
      callerName: "Nguyen Thi Hoa",
      transcript: "Clara: Xin chào, tôi là Clara từ CareConnect. Tôi có thể giúp gì cho bạn?\nCaller: Xin chào. Tôi muốn hỏi về lịch hẹn tuần tới.\nClara: Dạ, lịch hẹn tiếp theo của bà Hoa là vào thứ Tư tới lúc 10 giờ sáng với y tá Linh Nguyen.\nCaller: Cảm ơn.",
      intent: "appointment_request",
      language: "Vietnamese",
      durationSeconds: 65,
      outcome: "resolved",
    },
    {
      callerPhone: "+14089998877",
      callerName: null,
      transcript: "Clara: Hello, this is Clara from CareConnect. How can I help you today?\nCaller: Yes hi, I'm calling about your home care services. My father is 82 and just came home from the hospital after a fall. What kind of services do you offer?\nClara: Thank you for calling. I'm so sorry to hear about your father's fall — that must be a stressful time for your family. We offer a range of in-home care services including daily living assistance, medication management, fall prevention, physical therapy support, companionship, and transportation. For a new client, I'd love to connect you with one of our care coordinators who can do a free assessment. Can I get your name and a good callback number?",
      intent: "service_inquiry",
      language: "English",
      durationSeconds: 203,
      outcome: "follow_up_needed",
    },
    {
      clientId: clients[6].id,
      callerPhone: "+14082221014",
      callerName: "Lucia Reyes",
      transcript: "Clara: Hello, this is Clara. How can I help?\nCaller: Hi, I'm Lucia, Samuel Reyes' sister. I wanted to make sure his wound care appointment on Wednesday is still on.\nClara: Hi Lucia! Yes, Samuel's wound care appointment is confirmed for Wednesday at 9 AM. Maria Santos will be his caregiver for that visit.\nCaller: Great, thank you!",
      intent: "appointment_request",
      language: "English",
      durationSeconds: 58,
      outcome: "resolved",
    },
    {
      callerPhone: "+14082229900",
      callerName: null,
      transcript: "Clara: Hello, this is Clara from CareConnect. How can I help?\nCaller: Ayuda... mi mamá no puede respirar bien...\nClara: Por favor llame al 911 inmediatamente. ¿Puede hacer eso ahora? Mientras tanto, voy a conectarle con nuestra coordinadora de guardia.\nCaller: Sí, sí, gracias...",
      intent: "urgent_issue",
      language: "Spanish",
      durationSeconds: 42,
      outcome: "escalated",
    },
    {
      clientId: clients[2].id,
      callerPhone: "+14082221006",
      callerName: "Jennifer Chen",
      transcript: "Clara: Hello, this is Clara from CareConnect.\nCaller: Hi Clara, Jennifer again. Mom seemed much better today after the caregiver's visit. I just wanted to call and say thank you to the whole team.\nClara: That's wonderful to hear, Jennifer! I'll make sure to pass along your kind words to Mei-Ling's care team. It means a lot to everyone.\nCaller: She was humming along to music — it was beautiful.\nClara: That's such a lovely update. Thank you for sharing that with us.",
      intent: "family_update",
      language: "English",
      durationSeconds: 74,
      outcome: "resolved",
    },
    {
      callerPhone: "+14083334455",
      callerName: null,
      transcript: "Clara: Hello, this is Clara from CareConnect.",
      intent: "general_inquiry",
      language: "English",
      durationSeconds: 8,
      outcome: "voicemail",
    },
  ]);

  const callLogsNow = await db.select().from(callLogsTable);

  // Reminders
  await db.insert(remindersTable).values([
    { clientId: clients[0].id, type: "medication", message: "Morning medications: Lisinopril 10mg, Atorvastatin 20mg, Metoprolol 25mg. Take with food.", scheduledAt: day(0, 8), status: "sent" },
    { clientId: clients[0].id, type: "medication", message: "Evening medications: Metoprolol 25mg, Aspirin 81mg.", scheduledAt: day(0, 20), status: "pending" },
    { clientId: clients[1].id, type: "appointment", message: "Reminder: Dialysis transport today at 11:30 AM. Caregiver Maria will arrive at 11:00 AM.", scheduledAt: day(0, 11), status: "sent" },
    { clientId: clients[1].id, type: "medication", message: "Evening insulin check and Metformin 1000mg with dinner.", scheduledAt: day(0, 18, 30), status: "pending" },
    { clientId: clients[2].id, type: "wellness_check", message: "Daily wellness check: Confirm Mei-Ling ate breakfast and is oriented to date/place.", scheduledAt: day(0, 9, 30), status: "acknowledged" },
    { clientId: clients[3].id, type: "appointment", message: "Speech therapy follow-up today at 2:00 PM with Linh Nguyen.", scheduledAt: day(0, 13), status: "sent" },
    { clientId: clients[4].id, type: "medication", message: "Blood pressure medication: Amlodipine 5mg. Take with water. Record BP reading after.", scheduledAt: day(1, 8), status: "pending" },
    { clientId: clients[6].id, type: "appointment", message: "Wound care appointment tomorrow at 9:00 AM. Ensure wound supplies are accessible.", scheduledAt: day(1, 8), status: "pending" },
    { clientId: clients[0].id, type: "follow_up", message: "Follow up with PT office regarding Eleanor's progress report for insurance.", scheduledAt: day(2, 10), status: "pending" },
    { clientId: clients[1].id, type: "medication", message: "Weekly medication tray refill — check with Carmen that prescriptions are filled.", scheduledAt: day(3, 9), status: "pending" },
    { clientId: clients[2].id, type: "wellness_check", message: "Family video call with Jennifer Chen — ensure tablet is charged.", scheduledAt: day(6, 13), status: "pending" },
  ]);

  // Escalations
  const urgentCalls = callLogsNow.filter(c => c.outcome === "escalated");
  await db.insert(escalationsTable).values([
    {
      callLogId: urgentCalls[0]?.id ?? null,
      clientId: clients[2].id,
      priority: "high",
      reason: "Family reports increased confusion in client with early dementia — caregiver reassessment needed",
      assignedTo: "Rosa Flores",
      resolved: false,
      notes: "Jennifer Chen called at 2:15 PM. Caregiver Linh visited at 3 PM and found client calm but slightly disoriented. Neurologist notified.",
    },
    {
      callLogId: urgentCalls[1]?.id ?? null,
      clientId: null,
      priority: "critical",
      reason: "Caller reported elderly mother with severe breathing difficulty — directed to 911, on-call coordinator notified",
      assignedTo: "Ana Reyes",
      resolved: false,
      notes: "Unknown caller. Spanish-speaking. No client ID matched. On-call team attempted callback — no answer.",
    },
    {
      clientId: clients[5].id,
      priority: "medium",
      reason: "Client hospitalized — care plan on hold, family needs reassurance and transition coordination",
      assignedTo: "Rosa Flores",
      resolved: false,
      notes: "Dorothy Marshall admitted to Good Samaritan May 1. Expected discharge May 8. Family wants coordinator to be present at discharge.",
    },
    {
      clientId: clients[7].id,
      priority: "low",
      reason: "Caregiver reported client not home for scheduled visit — wellness check needed",
      assignedTo: "Rosa Flores",
      resolved: true,
      resolvedAt: new Date(Date.now() - 3 * 3600000),
      notes: "Agnes confirmed safe — was at son's home. Care plan adjusted accordingly.",
    },
  ]);

  console.log("Database seeded successfully.");
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
