import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Copy,
  FileSearch,
  Filter,
  Fingerprint,
  Flag,
  FolderOpen,
  Lightbulb,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  NotebookPen,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Target,
  Trophy,
  Users,
  X,
  Zap,
} from 'lucide-react';

type Evidence = {
  id: string;
  type: string;
  time?: string;
  title: string;
  body: string;
};

type Investigator = { id: string; name: string; role: string; initials: string; tone: string; specialty: string; line: string };
const investigators: Investigator[] = [
  { id: 'nia', name: 'Nia Okafor', role: 'Lead investigator', initials: 'NO', tone: 'nia', specialty: 'Reads the room. Separates what people say from what the record proves.', line: 'Start with what we can verify. The story comes after the evidence.' },
  { id: 'marcus', name: 'Marcus Reed', role: 'Field officer', initials: 'MR', tone: 'marcus', specialty: 'Checks locations, timelines, and whether a lead can be tested in person.', line: 'Give me a location and a time. I’ll tell you what we can actually check.' },
  { id: 'amara', name: 'Dr. Amara Bello', role: 'Forensic analyst', initials: 'AB', tone: 'amara', specialty: 'Finds inconsistencies in records, images, logs, and physical details.', line: 'One clue is a clue. Two independent sources can become a pattern.' },
  { id: 'tobi', name: 'Tobi Akinwale', role: 'Comms & dispatch', initials: 'TA', tone: 'tobi', specialty: 'Keeps the case timeline organised and flags gaps between reports.', line: 'I’ve got the timeline open. Tell me which two events don’t fit.' },
];

type CaseFile = {
  id: string;
  title: string;
  subtitle: string;
  mode: string;
  difficulty: string;
  minutes: number;
  points: number;
  tags: string[];
  intro: string;
  evidence: Evidence[];
  options: string[];
  answer: number;
  hint: string;
  explanation: string;
};
const cases: CaseFile[] = [
  {
    id: 'GL-001',
    title: 'The 8:17 Screenshot',
    subtitle: 'A message arrives before it was supposedly sent.',
    mode: 'GLITCH HUNT',
    difficulty: 'Easy',
    minutes: 3,
    points: 120,
    tags: ['Group chat', 'Timeline'],
    intro:
      'The course group is arguing about who leaked the venue change. One screenshot seems to settle it—until you check the times.',
    evidence: [
      {
        id: 'E01',
        type: 'GROUP CHAT',
        time: '08:12',
        title: 'Mira · course rep',
        body: 'New venue is Room 14. Please confirm you saw this.',
      },
      {
        id: 'E02',
        type: 'SCREENSHOT DETAILS',
        time: '08:17',
        title: 'Image forwarded by Femi',
        body: 'The screenshot shows Mira’s message with the device status bar reading 08:09.',
      },
      {
        id: 'E03',
        type: 'CHAT EXPORT',
        time: '08:12',
        title: 'Original message record',
        body: 'The chat export records Mira’s venue message as sent at 08:12.',
      },
      {
        id: 'E04',
        type: 'WITNESS NOTE',
        time: '08:20',
        title: 'Femi’s explanation',
        body: 'Femi says he captured the screenshot after Mira posted the message.',
      },
    ],
    options: [
      'The screenshot proves Mira posted at 08:09',
      'The screenshot status-bar time conflicts with the original message time',
      'Femi must have edited the message text',
      'The venue was never changed',
    ],
    answer: 1,
    hint: 'Compare the time visible inside the image with the time in the chat export. Do not assume either one is automatically correct.',
    explanation:
      'E02 shows a status-bar time of 08:09, while E03 records the message as sent at 08:12. The screenshot’s visible clock and the export timestamp conflict. That establishes an inconsistency, but it does not prove who altered anything or why.',
  },
  {
    id: 'CF-014',
    title: 'The Missing Parcel',
    subtitle: 'Delivered is not the same as received.',
    mode: 'CASEFILE',
    difficulty: 'Easy',
    minutes: 6,
    points: 180,
    tags: ['Receipts', 'Timeline'],
    intro:
      'A parcel marked DELIVERED cannot be found in the hostel lobby. Three records tell a more precise story.',
    evidence: [
      {
        id: 'E01',
        type: 'DELIVERY RECEIPT',
        time: '14:02',
        title: 'Courier status',
        body: 'Status changed to DELIVERED at 14:02. Recipient field: Front desk.',
      },
      {
        id: 'E02',
        type: 'DESK LOG',
        time: '14:10',
        title: 'Lobby register',
        body: 'Front desk logged one parcel under the name “A. Bello” at 14:10.',
      },
      {
        id: 'E03',
        type: 'ACCESS LOG',
        time: '14:06',
        title: 'Side entrance',
        body: 'A parcel trolley entered through the side entrance at 14:06.',
      },
      {
        id: 'E04',
        type: 'MESSAGE',
        time: '14:04',
        title: 'Courier to recipient',
        body: '“I left it with the front desk. They were away from the counter, so I placed it on the parcel shelf.”',
      },
      {
        id: 'E05',
        type: 'DESK NOTE',
        time: '15:20',
        title: 'Shelf inventory',
        body: 'The parcel shelf inventory has no item under the recipient’s name, but one unlabelled box remains.',
      },
    ],
    options: [
      'The desk definitely stole it',
      'The parcel was recorded under a different name and may be the unlabelled box',
      'The courier never came to the building',
      'The access log proves the recipient collected it',
    ],
    answer: 1,
    hint: 'Look for a mismatch in the naming, not just the delivery status.',
    explanation:
      'E02 records the parcel under “A. Bello,” while E05 says the shelf has an unlabelled box and no matching recipient name. That is the strongest supported lead. The evidence does not prove theft or identify who moved the parcel; the next fair step is to verify the unlabelled box.',
  },
  {
    id: 'CF-021',
    title: 'The Empty Lecture Hall',
    subtitle: 'Two alibis. One impossible arrival.',
    mode: 'CASEFILE',
    difficulty: 'Medium',
    minutes: 7,
    points: 220,
    tags: ['Campus', 'Alibi'],
    intro:
      'A presentation file was changed during a class break. Everyone says they were in the lecture hall. One timeline does not hold.',
    evidence: [
      {
        id: 'E01',
        type: 'CLASS GROUP',
        time: '10:00',
        title: 'Attendance reminder',
        body: 'The lecturer says the doors will be locked at 10:05 for the quiz.',
      },
      {
        id: 'E02',
        type: 'ACCESS LOG',
        time: '10:08',
        title: 'Lab entrance',
        body: 'A student card registered at the computer lab entrance.',
      },
      {
        id: 'E03',
        type: 'WITNESS NOTE',
        time: '10:15',
        title: 'Tara’s statement',
        body: '“I was in the lecture hall the entire time after 10:00. I never left the floor.”',
      },
      {
        id: 'E04',
        type: 'FILE HISTORY',
        time: '10:11',
        title: 'Presentation change',
        body: 'The shared presentation was edited from a lab workstation at 10:11.',
      },
      {
        id: 'E05',
        type: 'ROOM MAP',
        title: 'Floor plan',
        body: 'The computer lab is on a separate floor; reaching it from the hall takes at least six minutes.',
      },
    ],
    options: [
      'Tara’s statement conflicts with the available timeline if she made the lab edit',
      'The lecturer changed the file',
      'The doors were never locked',
      'The card log proves every action by its owner',
    ],
    answer: 0,
    hint: 'The evidence does not identify an editor by name. Find the claim that would become impossible if the speaker performed the edit.',
    explanation:
      'E03 says Tara never left the floor after 10:00. E04 places an edit at the lab workstation at 10:11, and E05 says the lab is a separate floor requiring at least six minutes to reach. The contradiction matters only if Tara is alleged to have made that edit; access logs alone do not prove who used a card or workstation.',
  },
  {
    id: 'CF-033',
    title: 'The Last Seat',
    subtitle: 'A guest list with one seat too many.',
    mode: 'CASEFILE',
    difficulty: 'Medium',
    minutes: 6,
    points: 210,
    tags: ['Event', 'Logic'],
    intro:
      'A small film screening had twelve reserved seats. The organiser insists that every guest checked in, but the numbers do not agree.',
    evidence: [
      {
        id: 'E01',
        type: 'SEATING PLAN',
        title: 'Reserved seats',
        body: 'Rows A and B contain six seats each: 12 seats total.',
      },
      {
        id: 'E02',
        type: 'CHECK-IN SHEET',
        title: 'Guest count',
        body: 'Eleven guests have a tick beside their names.',
      },
      {
        id: 'E03',
        type: 'ORGANISER MESSAGE',
        time: '18:30',
        title: 'Before the screening',
        body: '“All twelve guests are here. We can start.”',
      },
      {
        id: 'E04',
        type: 'STAFF NOTE',
        time: '18:35',
        title: 'Door count',
        body: 'Staff counted eleven guests entering, plus the organiser.',
      },
      {
        id: 'E05',
        type: 'ROOM RULE',
        title: 'Counting policy',
        body: 'The organiser is not included in the twelve reserved guest seats.',
      },
    ],
    options: [
      'The organiser counted themself as a guest despite the room rule',
      'A seat was physically missing',
      'The check-in sheet proves a guest left',
      'The staff count includes the organiser among the guests',
    ],
    answer: 0,
    hint: 'Separate the organiser from the guest count before comparing the totals.',
    explanation:
      'E04 counts eleven guests plus the organiser, and E05 explicitly says the organiser is not one of the twelve reserved guests. The evidence supports that only eleven guests arrived, contradicting E03’s claim that all twelve guests were present. It does not identify a missing guest’s reason for absence.',
  },
  {
    id: 'CF-042',
    title: 'The Borrowed Charger',
    subtitle: 'Everyone borrowed it. Nobody remembers returning it.',
    mode: 'CASEFILE',
    difficulty: 'Easy',
    minutes: 5,
    points: 160,
    tags: ['Objects', 'Witnesses'],
    intro:
      'A charger disappears from the shared study table. The messages are messy, but the return log is unusually specific.',
    evidence: [
      {
        id: 'E01',
        type: 'CHAT',
        time: '16:04',
        title: 'Zara',
        body: '“I borrowed the charger at lunch and put it back before 2.”',
      },
      {
        id: 'E02',
        type: 'CHAT',
        time: '16:06',
        title: 'Kunle',
        body: '“I used it at 2:15, then returned it to the blue tray.”',
      },
      {
        id: 'E03',
        type: 'INVENTORY NOTE',
        time: '14:00',
        title: 'Blue tray check',
        body: 'The tray was empty at 14:00.',
      },
      {
        id: 'E04',
        type: 'PHOTO CAPTION',
        time: '14:30',
        title: 'Study table photo',
        body: 'A charger is visible on the table beside the blue tray. The cable is plugged into a laptop.',
      },
      {
        id: 'E05',
        type: 'ROOM RULE',
        title: 'Shared equipment',
        body: 'Borrowers should return chargers to the blue tray, not leave them connected to devices.',
      },
    ],
    options: [
      'Zara’s return claim cannot be verified from this evidence',
      'Kunle definitely stole it',
      'The photo proves the charger was broken',
      'The tray was full at 2:00',
    ],
    answer: 0,
    hint: 'A contradiction is not the same as proof of guilt. Ask what the evidence can actually establish.',
    explanation:
      'E03 says the tray was empty at 14:00, but E01 claims Zara returned the charger before 14:00. That is a mismatch between the stated return and the tray check, though it does not prove theft: the charger could have been moved, missed during the check, or left elsewhere. The fair conclusion is that Zara’s return claim is unverified.',
  },
  {
    id: 'DD-001',
    title: 'Dead Drop 001',
    subtitle: 'A short note hides a very ordinary instruction.',
    mode: 'DEAD DROP',
    difficulty: 'Easy',
    minutes: 4,
    points: 150,
    tags: ['Cipher', 'Pattern'],
    intro:
      'A note is pinned to the archive door. The sender says the first step is to read what is already there.',
    evidence: [
      {
        id: 'E01',
        type: 'NOTE',
        title: 'Recovered message',
        body: 'DPOF / UIFO / SFBE',
      },
      {
        id: 'E02',
        type: 'ARCHIVE RULE',
        title: 'Cipher guide',
        body: 'For this puzzle, each letter has been shifted forward by exactly one place in the alphabet.',
      },
      {
        id: 'E03',
        type: 'MARGIN NOTE',
        title: 'Handwritten hint',
        body: 'To undo a shift, move each letter one place backward. Keep spaces and punctuation.',
      },
      {
        id: 'E04',
        type: 'ENVELOPE',
        title: 'Envelope stamp',
        body: '“No keys needed.”',
      },
    ],
    options: [
      'COME / WHEN / READ',
      'OPEN / WHEN / READ',
      'DONE / THEN / HIDE',
      'CODE / THEN / STOP',
    ],
    answer: 1,
    hint: 'Undo the forward shift by moving every letter back one place.',
    explanation:
      'E02 and E03 define a Caesar shift of +1 and tell you how to reverse it. Shifting DPOF / UIFO / SFBE backward produces OPEN / THEN / READ. The answer list is intentionally designed around the decoded instruction; if your choice is not present, inspect the text carefully.',
  },
  {
    id: 'CF-058',
    title: 'The Screenshot That Came Twice',
    subtitle: 'Two copies are not two independent witnesses.',
    mode: 'CASEFILE',
    difficulty: 'Medium',
    minutes: 7,
    points: 230,
    tags: ['Digital evidence', 'Media literacy'],
    intro:
      'A rumour spreads with two screenshots that appear to confirm the same message. Inspect how independent the evidence really is.',
    evidence: [
      {
        id: 'E01',
        type: 'IMAGE A',
        title: 'First screenshot',
        body: 'Shows a message attributed to “T.” The crop excludes the date and message context.',
      },
      {
        id: 'E02',
        type: 'IMAGE B',
        title: 'Second screenshot',
        body: 'Pixel pattern, line breaks, and a small scratch on the crop match Image A exactly.',
      },
      {
        id: 'E03',
        type: 'FORWARD NOTE',
        title: 'Source history',
        body: 'Both images were forwarded by the same person in the same message.',
      },
      {
        id: 'E04',
        type: 'VERIFICATION GUIDE',
        title: 'What a match can show',
        body: 'Identical crops can indicate duplication. They do not, by themselves, establish whether the original message is authentic.',
      },
      {
        id: 'E05',
        type: 'CHAT CONTEXT',
        title: 'Missing context',
        body: 'No original chat export or sender confirmation is available.',
      },
    ],
    options: [
      'The two images are likely duplicate copies, not independent confirmation',
      'The message is definitely authentic because two images exist',
      'The scratch proves the message is fake',
      'The sender has been identified conclusively',
    ],
    answer: 0,
    hint: 'Count independent sources, not the number of files.',
    explanation:
      'E02 shows the two images share the same crop details, while E03 says they were forwarded together by one person. They are likely copies of one artifact, not two independent confirmations. E04 and E05 make the limit clear: this cannot authenticate or disprove the original message.',
  },
  {
    id: 'LM-204',
    title: 'Room 204',
    subtitle: 'Pick your lead. Every minute changes what you can prove.',
    mode: 'LAST MOVE',
    difficulty: 'Hard',
    minutes: 9,
    points: 300,
    tags: ['Branching', 'Strategy'],
    intro:
      'A classroom projector was switched off during a demo. You have limited time before the room is reset. Choose the lead that gives you the strongest evidence first.',
    evidence: [
      {
        id: 'E01',
        type: 'ROOM LOG',
        time: '12:05',
        title: 'Power panel',
        body: 'The projector lost power at 12:05. The room lights stayed on.',
      },
      {
        id: 'E02',
        type: 'TECH NOTE',
        time: '12:02',
        title: 'Control panel',
        body: 'The projector can be turned off at the wall panel or by its remote.',
      },
      {
        id: 'E03',
        type: 'WITNESS NOTE',
        time: '12:07',
        title: 'Front row',
        body: 'A witness saw a person near the wall panel but could not identify them.',
      },
      {
        id: 'E04',
        type: 'EQUIPMENT CHECK',
        time: '12:10',
        title: 'Remote status',
        body: 'The remote was found on the lectern with its battery cover open.',
      },
      {
        id: 'E05',
        type: 'ROOM RULE',
        title: 'Access',
        body: 'The room was unlocked and shared by several groups all afternoon.',
      },
    ],
    options: [
      'The wall panel is the best next lead because the room log can narrow the mechanism',
      'The person near the panel is proven guilty',
      'The remote proves the power outage was accidental',
      'Only one person could have entered the room',
    ],
    answer: 0,
    hint: 'Choose the lead that can be tested, not the person who merely seems suspicious.',
    explanation:
      'E01 establishes a power loss, E02 gives two possible mechanisms, and E03 places an unidentified person near one of them. Checking the wall panel’s state or maintenance record is the most testable next step. E05 rules out the claim that only one person had access. The evidence is not enough to accuse anyone.',
  },
  {
    id: 'SC-061',
    title: 'The Yaba Dispatch',
    subtitle: 'Three packs were ordered. The handover trail tells a smaller story.',
    mode: 'STREETCRAFT',
    difficulty: 'Easy',
    minutes: 4,
    points: 150,
    tags: ['Lagos', 'Logistics', 'Evidence trail'],
    intro:
      'A fictional student-run dispatch desk in Yaba is reconciling an order marked DELIVERED. Your task is to identify what the records prove—not to guess who is at fault.',
    evidence: [
      {
        id: 'E01',
        type: 'ORDER SLIP',
        time: '14:05',
        title: 'Order 31B',
        body: 'The customer requested three labelled supply packs. The slip is marked PACKED, not handed over.',
      },
      {
        id: 'E02',
        type: 'HANDOVER LOG',
        time: '14:18',
        title: 'Counter release',
        body: 'Two packs were signed out to the rider. The third is marked “awaiting label” in the count column.',
      },
      {
        id: 'E03',
        type: 'DELIVERY EXPORT',
        time: '14:34',
        title: 'Status change',
        body: 'The order status changed to DELIVERED. The recipient-signature field is blank.',
      },
      {
        id: 'E04',
        type: 'COUNTER TALLY',
        time: '14:41',
        title: 'End-of-shift count',
        body: 'One labelled pack remains at the dispatch counter. The tally does not identify which order it belongs to.',
      },
    ],
    options: [
      'The rider definitely kept the third pack',
      'The records do not establish a complete handover for all three packs',
      'The customer falsely claimed non-delivery',
      'The delivery platform is definitely fraudulent',
    ],
    answer: 1,
    hint:
      'Separate an order being packed, a status changing, and a person signing for an item. Those are different events.',
    explanation:
      'E01 shows an order was packed, not delivered. E02 records only two physical releases, and E03 has no recipient signature. E04 suggests a pack remains but does not link it to this order. The strongest conclusion is that the handover trail is incomplete—not that any specific person caused it.',
  },
  {
    id: 'CF-062',
    title: 'The Market Stall Ledger',
    subtitle: 'The closing count is one item short of the recorded arithmetic.',
    mode: 'CASEFILE',
    difficulty: 'Medium',
    minutes: 5,
    points: 190,
    tags: ['Nigeria', 'Inventory', 'Arithmetic'],
    intro:
      'A fictional market cooperative is checking its daily stock sheet. Reconcile the records before deciding whether the difference means anything more.',
    evidence: [
      {
        id: 'E01',
        type: 'OPENING COUNT',
        time: '09:00',
        title: 'Morning inventory',
        body: 'The stall begins the day with 24 sealed packs.',
      },
      {
        id: 'E02',
        type: 'DELIVERY NOTE',
        time: '09:40',
        title: 'Restock received',
        body: 'A signed delivery note records 16 additional packs received.',
      },
      {
        id: 'E03',
        type: 'SALES LEDGER',
        time: '18:00',
        title: 'Daily sales',
        body: 'The ledger records 29 packs sold. No other stock movement is listed before the closing count.',
      },
      {
        id: 'E04',
        type: 'CLOSING SHEET',
        time: '18:15',
        title: 'Count at close',
        body: 'The recorded physical count is 10 packs.',
      },
      {
        id: 'E05',
        type: 'RETURN SLIP',
        time: '18:22',
        title: 'Returned item',
        body: 'One unopened pack is returned to the shelf seven minutes after the closing count.',
      },
    ],
    options: [
      'The figures reconcile because the returned pack was added later',
      'The delivery note must be incorrect',
      'The closing count is one below the amount implied by the earlier records',
      'The difference proves someone stole a pack',
    ],
    answer: 2,
    hint:
      'Calculate opening stock plus received stock minus recorded sales. Keep the 18:22 return separate from the 18:15 count.',
    explanation:
      '24 + 16 − 29 = 11 packs should remain at 18:15 if the listed movements are complete. The sheet records 10. The return happened after that count, so it cannot explain the one-pack difference. This establishes a mismatch, not its cause.',
  },
  {
    id: 'GL-061',
    title: 'The Duplicate Wire',
    subtitle: 'Two accounting rows do not automatically mean two payments.',
    mode: 'GLITCH HUNT',
    difficulty: 'Medium',
    minutes: 5,
    points: 190,
    tags: ['United States', 'Digital records', 'Cross-check'],
    intro:
      'A fictional community arts office sees what looks like a duplicate vendor payment. Compare the export with the independent settlement record before drawing a conclusion.',
    evidence: [
      {
        id: 'E01',
        type: 'APPROVED INVOICE',
        time: '10:04',
        title: 'Invoice 804',
        body: 'The office approved one vendor invoice for $860.',
      },
      {
        id: 'E02',
        type: 'SETTLEMENT LOG',
        time: '10:21',
        title: 'Payment reference 4FA',
        body: 'The payment service lists reference 4FA as completed once for $860.',
      },
      {
        id: 'E03',
        type: 'ACCOUNTING EXPORT',
        time: '10:24',
        title: 'Two matching rows',
        body: 'The export contains two rows with the same payment reference, amount, and completion timestamp.',
      },
      {
        id: 'E04',
        type: 'BANK STATEMENT',
        time: 'Next business day',
        title: 'Posted debit',
        body: 'The statement shows one posted debit of $860 matching reference 4FA.',
      },
    ],
    options: [
      'The vendor was definitely paid twice',
      'The duplicate export row proves deliberate wrongdoing',
      'The export appears to duplicate a record; the evidence shows one posted payment',
      'The invoice was never approved',
    ],
    answer: 2,
    hint:
      'A repeated row is a record-level observation. Check whether an independent source shows a second completed transaction.',
    explanation:
      'E03 shows a duplicated row in one export, while E02 and E04 independently show one completed settlement and one posted debit. The evidence supports investigating the export duplication; it does not establish a second payment or deliberate wrongdoing.',
  },
  {
    id: 'CC-061',
    title: 'The Archive Room',
    subtitle: 'The door log and archive log differ because their clocks use different time zones.',
    mode: 'CAMPUS CHRONICLES',
    difficulty: 'Medium',
    minutes: 5,
    points: 190,
    tags: ['United States', 'Campus', 'Timeline'],
    intro:
      'A fictional campus archive is reviewing an access question. The first glance suggests a four-hour discrepancy. Normalize the timestamps before deciding whether the accounts conflict.',
    evidence: [
      {
        id: 'E01',
        type: 'ARCHIVE SYSTEM',
        time: '17:30 UTC',
        title: 'Document opened',
        body: 'The archive server records a document opening at 17:30 UTC.',
      },
      {
        id: 'E02',
        type: 'DOOR READER',
        time: '13:31 EDT',
        title: 'Room access',
        body: 'The door reader records an entry at 13:31 Eastern Daylight Time (UTC−4).',
      },
      {
        id: 'E03',
        type: 'ATTENDANCE SHEET',
        time: '13:35 EDT',
        title: 'Research session',
        body: 'A signed attendance sheet places the scheduled session at 13:35 EDT.',
      },
      {
        id: 'E04',
        type: 'SYSTEM NOTE',
        time: '—',
        title: 'Timestamp convention',
        body: 'The archive server stores timestamps in UTC. The physical door reader displays local Eastern Daylight Time.',
      },
    ],
    options: [
      'The archive was opened four hours before the door entry',
      'The archive timestamp converts to 13:30 EDT, consistent with the 13:31 door entry',
      'The attendance sheet proves who opened the document',
      'The clocks are too different to compare',
    ],
    answer: 1,
    hint:
      'EDT is four hours behind UTC. Convert the server time to local time before comparing the sequence.',
    explanation:
      '17:30 UTC is 13:30 EDT. That is one minute before the 13:31 door entry, not four hours before it. The sequence is close enough to be compatible, but these records alone do not identify who opened the document.',
  }
];

const navItems = [
  { label: 'Dispatch', key: 'home', icon: Zap },
  { label: 'Daily Drop', key: 'daily', icon: Target },
  { label: 'Case Files', key: 'cases', icon: FolderOpen },
  { label: 'Last Move', key: 'strategy', icon: ArrowDownRight },
  { label: 'Streetcraft', key: 'streetcraft', icon: NotebookPen },
  { label: 'Dead Drop', key: 'dead', icon: LockKeyhole },
  { label: 'Campus', key: 'campus', icon: Users },
  { label: 'Archives', key: 'archive', icon: FileSearch },
];
type InterviewExchange = { question: string; response: string; lead: string };
function interviewForCase(c: CaseFile): InterviewExchange[] {
  const first = c.evidence[0];
  const second = c.evidence[1] || first;
  const last = c.evidence[c.evidence.length - 1] || first;
  return [
    { question: 'What did you personally observe?', response: 'I can only speak to what was recorded: “' + first.title + '” says ' + first.body + ' Treat that as one account, not the whole story.', lead: 'Re-check ' + first.id + ' and compare it with another source.' },
    { question: 'Which record could independently confirm that?', response: 'Start with “' + second.title + '”: ' + second.body + ' If the sources were created independently, agreement matters more than repetition.', lead: 'Compare ' + first.id + ' with ' + second.id + ' on the evidence board.' },
    { question: 'What remains uncertain?', response: '“' + last.title + '” records: ' + last.body + ' That still does not automatically establish motive or identify who was responsible. We need a testable next step.', lead: 'Write down what additional record or observation would close this gap.' },
  ];
}

const episodes = [
  {
    no: 'EP. 01',
    title: 'The Group Chat Apology',
    text: 'An apology lands in the wrong chat—and nobody agrees on what was actually said.',
    tag: 'SOCIAL SIGNALS',
    caseId: 'GL-001',
  },
  {
    no: 'EP. 02',
    title: 'The Lecture That Moved',
    text: 'A room change, three screenshots, and one class rep with a very busy morning.',
    tag: 'CAMPUS LIFE',
    caseId: 'CF-021',
  },
  {
    no: 'EP. 03',
    title: 'The Package at Reception',
    text: 'The tracking page says delivered. The desk says maybe. The label says something else.',
    tag: 'EVERYDAY MYSTERY',
    caseId: 'CF-014',
  },
];
const prompts = [
  {
    title: 'Make the alibi stronger',
    tag: 'LOGIC',
    text: 'Rewrite a weak alibi so it becomes testable—but do not make it impossible to challenge.',
  },
  {
    title: 'One clue, two theories',
    tag: 'INTERPRETATION',
    text: 'Use one evidence item to support two different explanations. Then say what extra evidence would separate them.',
  },
  {
    title: 'The group-chat timeline',
    tag: 'STORYTELLING',
    text: 'Write a 120-word mystery told entirely through messages and timestamps.',
  },
];

function readProgress() {
  const defaults = {
    solved: {},
    notes: {},
    bookmarks: [],
    reviewedEvidence: [],
    streak: 1,
    nickname: 'Investigator',
    drafts: {},
  };
  try {
    const saved = localStorage.getItem('afterhours-progress-v1');
    if (!saved) return defaults;
    const parsed = JSON.parse(saved);
    return {
      ...defaults,
      ...parsed,
      reviewedEvidence: Array.isArray(parsed.reviewedEvidence)
        ? parsed.reviewedEvidence
        : [],
    };
  } catch {
    return defaults;
  }
}
function App() {
  const [page, setPage] = useState('home');
  const [activeCase, setActiveCase] = useState<CaseFile>(cases[0]);
  const [selectedInvestigator, setSelectedInvestigator] = useState<string | null>(null);
  const [progress, setProgress] = useState(readProgress);
  const [answer, setAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All cases');
  const [toast, setToast] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [draftText, setDraftText] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fontLarge, setFontLarge] = useState(() => {
    try {
      return localStorage.getItem('afterhours-font-large') === 'true';
    } catch {
      return false;
    }
  });
  const [reduceMotion, setReduceMotion] = useState(() => {
    try {
      const saved = localStorage.getItem('afterhours-reduce-motion');
      return saved === null
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : saved === 'true';
    } catch {
      return false;
    }
  });
  const [showNote, setShowNote] = useState(false);
  const [selectedEvidenceForLink, setSelectedEvidenceForLink] = useState<string | null>(null);
  const [linkType, setLinkType] = useState('supports');
  const [interviewAnswers, setInterviewAnswers] = useState<Record<string, number[]>>({});
  const [activeInterviewQuestion, setActiveInterviewQuestion] = useState<number | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('afterhours-progress-v1', JSON.stringify(progress));
    } catch {
      /* Session still works without storage. */
    }
  }, [progress]);
  useEffect(() => {
    try {
      localStorage.setItem('afterhours-font-large', String(fontLarge));
      localStorage.setItem('afterhours-reduce-motion', String(reduceMotion));
    } catch {
      /* Preferences still work for this session without storage. */
    }
  }, [fontLarge, reduceMotion]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const challenge = params.get('case');
    if (challenge) {
      const found = cases.find(
        c => c.id.toLowerCase() === challenge.toLowerCase()
      );
      if (found) {
        setActiveCase(found);
        setPage('play');
      }
    }
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const solvedCount = Object.values(progress.solved).filter(
    (x: any) => x?.correct
  ).length;
  const totalAttempts = Object.keys(progress.solved).length;
  const accuracy = totalAttempts
    ? Math.round((solvedCount / totalAttempts) * 100)
    : 0;
  const visibleCases = useMemo(
    () =>
      cases.filter(c => {
        const q = search.toLowerCase();
        const matchesSearch =
          !q ||
          [
            c.title,
            c.subtitle,
            c.id,
            c.mode,
            c.difficulty,
            c.intro,
            c.hint,
            c.explanation,
            ...c.tags,
            ...c.evidence.flatMap(e => [e.id, e.type, e.time || '', e.title, e.body]),
          ]
            .join(' ')
            .toLowerCase()
            .includes(q);
        const matchesFilter =
          filter === 'All cases' ||
          (filter === 'Unsolved' && !progress.solved[c.id]) ||
          (filter === 'Solved' && !!progress.solved[c.id]) ||
          c.difficulty === filter;
        return matchesSearch && matchesFilter;
      }),
    [search, filter, progress.solved]
  );

  function go(next: string) {
    setPage(next);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  function openCase(c: CaseFile) {
    setActiveCase(c);
    setAnswer(null);
    setSubmitted(false);
    setHintOpen(false);
    setShowNote(false);
    setSelectedEvidenceForLink(null);
    setLinkType('supports');
    setActiveInterviewQuestion(null);
    setDraftText(progress.notes[c.id] || '');
    go('play');
    const url = new URL(window.location.href);
    url.searchParams.set('case', c.id);
    window.history.replaceState({}, '', url);
  }
  function submitAnswer() {
    if (answer === null) {
      setToast('Choose an answer before locking your theory.');
      return;
    }
    const correct = answer === activeCase.answer;
    const score = correct
      ? Math.max(40, activeCase.points - (hintOpen ? 35 : 0))
      : 0;
    setSubmitted(true);
    setProgress((p: any) => ({
      ...p,
      solved: {
        ...p.solved,
        [activeCase.id]: {
          correct,
          answer,
          score,
          date: new Date().toISOString(),
        },
      },
    }));
  }
  async function shareCase(c = activeCase) {
    const url = new URL(window.location.href);
    url.searchParams.set('case', c.id);
    const message =
      'I found a case in AFTERHOURS. Think you can solve it? ' + url.toString();
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'AFTERHOURS · ' + c.title,
          text: 'Read the evidence. Catch the detail.',
          url: url.toString(),
        });
      } else {
        await navigator.clipboard.writeText(message);
        setToast('Challenge link copied. Send it to your group chat.');
      }
    } catch (e) {
      try {
        await navigator.clipboard.writeText(message);
        setToast('Challenge link copied.');
      } catch {
        setToast(url.toString());
      }
    }
  }
  async function copyText(text: string, success: string) {
    try {
      await navigator.clipboard.writeText(text);
      setToast(success);
    } catch {
      setToast(
        'Clipboard unavailable. You can select and copy the text manually.'
      );
    }
  }
  function toggleBookmark(id: string) {
    setProgress((p: any) => ({
      ...p,
      bookmarks: p.bookmarks.includes(id)
        ? p.bookmarks.filter((x: string) => x !== id)
        : [...p.bookmarks, id],
    }));
    setToast(
      progress.bookmarks.includes(id)
        ? 'Removed from saved clues.'
        : 'Saved to your evidence locker.'
    );
  }
  function toggleEvidenceReview(key: string) {
    setProgress((p: any) => {
      const reviewed = Array.isArray(p.reviewedEvidence) ? p.reviewedEvidence : [];
      return {
        ...p,
        reviewedEvidence: reviewed.includes(key)
          ? reviewed.filter((item: string) => item !== key)
          : [...reviewed, key],
      };
    });
  }
  function selectEvidenceForLink(evidenceId: string) {
    if (!selectedEvidenceForLink) {
      setSelectedEvidenceForLink(evidenceId);
      setToast('First exhibit selected. Choose another exhibit to connect it.');
      return;
    }
    if (selectedEvidenceForLink === evidenceId) {
      setSelectedEvidenceForLink(null);
      setToast('Exhibit selection cleared.');
      return;
    }
    const first = selectedEvidenceForLink;
    const key = [first, evidenceId].sort().join('|');
    setProgress((p: any) => {
      const links = Array.isArray(p.evidenceLinks) ? p.evidenceLinks : [];
      const exists = links.some((link: any) => link.caseId === activeCase.id && [link.from, link.to].sort().join('|') === key && link.relation === linkType);
      return exists ? p : { ...p, evidenceLinks: [...links, { caseId: activeCase.id, from: first, to: evidenceId, relation: linkType }] };
    });
    setSelectedEvidenceForLink(null);
    setToast('Connection added to your investigation board.');
  }
  function removeEvidenceLink(indexToRemove: number) {
    setProgress((p: any) => ({ ...p, evidenceLinks: (Array.isArray(p.evidenceLinks) ? p.evidenceLinks : []).filter((_link: any, index: number) => index !== indexToRemove) }));
  }
  function saveNote() {
    setProgress((p: any) => ({
      ...p,
      notes: { ...p.notes, [activeCase.id]: draftText },
    }));
    setToast('Investigation note saved on this device.');
  }
  function resetProgress() {
    if (
      window.confirm(
        'Clear all saved cases, notes, drafts, bookmarks and streak data on this device? This cannot be undone.'
      )
    ) {
      setProgress({
        solved: {},
        notes: {},
        bookmarks: [],
        reviewedEvidence: [],
        streak: 1,
        nickname: 'Investigator',
        drafts: {},
      });
      setToast('Local progress cleared.');
    }
  }
  const isCorrect = submitted && answer === activeCase.answer;

  const sidebar = (
    <aside className={'sidebar ' + (menuOpen ? 'sidebar-open' : '')}>
      <button
        className="brand"
        onClick={() => go('home')}
        aria-label="AFTERHOURS home"
      >
        <span className="brand-mark">
          <Fingerprint size={21} />
        </span>
        <span className="brand-word">
          AFTER<span>HOURS</span>
          <small>THE INVESTIGATION CLUB</small>
        </span>
      </button>
      <div className="side-label">
        YOUR DESK <span>01—08</span>
      </div>
      <nav className="main-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              className={
                'nav-link ' +
                (page === item.key ||
                  (page === 'play' &&
                    ['cases', 'daily', 'strategy', 'dead'].includes(item.key) &&
                    ((item.key === 'daily' && activeCase.id === 'GL-001') ||
                      (item.key === 'strategy' && activeCase.id === 'LM-204') ||
                      (item.key === 'dead' && activeCase.id === 'DD-001') ||
                      (item.key === 'cases' &&
                        !['GL-001', 'LM-204', 'DD-001'].includes(
                          activeCase.id
                        )))))
                  ? 'active'
                  : ''
              }
              onClick={() => go(item.key)}
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{item.label}</span>
              {item.key === 'daily' && <span className="nav-live" />}
            </button>
          );
        })}
      </nav>
      <div className="side-divider" />
      <button className="nav-link" onClick={() => go('progress')}>
        <Trophy size={17} />
        <span>My record</span>
        <span className="nav-count">{solvedCount}</span>
      </button>
      <button className="nav-link" onClick={() => setSettingsOpen(true)}>
        <Settings2 size={17} />
        <span>Preferences</span>
      </button>
      <div className="sidebar-bottom">
        <div className="desk-card">
          <div className="desk-card-top">
            <span className="status-dot" /> FIELD NOTE
          </div>
          <p>“The first story is rarely the whole story.”</p>
          <span className="desk-signature">— ARCHIVE RULE 01</span>
        </div>
        <div className="side-foot">
          <ShieldCheck size={14} /> PRIVATE BY DEFAULT <span>v0.1</span>
        </div>
      </div>
    </aside>
  );

  function header(title: string, eyebrow: string, subtitle?: string) {
    return (
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" />
            {eyebrow}
          </div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <div className="heading-tools">
          <button
            className="icon-button mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
          <button
            className="icon-button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Preferences"
          >
            <Settings2 size={18} />
          </button>
          <button className="profile-chip" onClick={() => go('progress')}>
            <span className="avatar">I</span>
            <span>{progress.nickname || 'Investigator'}</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
    );
  }

  function caseCard(c: CaseFile, compact = false) {
    const solved = progress.solved[c.id];
    return (
      <article
        className={'case-card ' + (compact ? 'case-card-compact' : '')}
        key={c.id}
      >
        <div className="case-card-meta">
          <span className="case-id">{c.id}</span>
          <span
            className={'difficulty difficulty-' + c.difficulty.toLowerCase()}
          >
            {c.difficulty}
          </span>
        </div>
        <h3>{c.title}</h3>
        <p>{c.subtitle}</p>
        <div className="case-card-bottom">
          <span>
            <Clock3 size={13} /> {c.minutes} min
          </span>
          <span>
            <Target size={13} /> {c.points} pts
          </span>
          {solved && (
            <span className={solved.correct ? 'solved-tag' : 'attempt-tag'}>
              {solved.correct ? 'SOLVED' : 'ATTEMPTED'}
            </span>
          )}
        </div>
        <button
          className="card-open"
          onClick={() => openCase(c)}
          aria-label={'Open ' + c.title}
        >
          <ArrowUpRight size={16} />
        </button>
      </article>
    );
  }

  const homePage = (
    <>
      {header(
        'Someone’s story doesn’t add up.',
        'DISPATCH / 001',
        'Read the evidence. Catch the detail. Make your case.'
      )}
      <section className="lagos-world" aria-label="Lagos city life and field intelligence">
        <div className="lagos-world-heading">
          <div>
            <div className="eyebrow"><span className="city-live-dot" /> CITY SYSTEM / LAGOS STATE</div>
            <h2>The city is part of the case.</h2>
            <p>From the first danfo horn to the last buka closing, every neighbourhood has its own rhythm, witnesses, pressure points and paper trail.</p>
          </div>
          <span className="lagos-world-stamp">FIELD<br />GUIDE 01</span>
        </div>
        <div className="lagos-life-strip" aria-label="Lagos everyday life">
          <span><b>01</b> ROAD & ROUTE</span>
          <span><b>02</b> MARKET & MONEY</span>
          <span><b>03</b> CAMPUS & COMPOUND</span>
          <span><b>04</b> NIGHT SHIFT</span>
        </div>
        <div className="lagos-district-grid">
          <button className="lagos-district" onClick={() => { setSearch('campus'); go('campus'); }}>
            <span className="district-index">MAINLAND / 01</span><strong>Yaba & Akoka</strong>
            <span>Campus gossip, tech offices, bus stops, class reps and messages moving faster than the people who sent them.</span>
            <i>Follow campus leads <ArrowUpRight size={14} /></i>
          </button>
          <button className="lagos-district" onClick={() => { setSearch('market'); go('cases'); }}>
            <span className="district-index">MARKET GRID / 02</span><strong>Balogun & Idumota</strong>
            <span>Receipts, cash transfers, shop ledgers, delivery riders, bargaining and the difference between “sent” and “received”.</span>
            <i>Check the paper trail <ArrowUpRight size={14} /></i>
          </button>
          <button className="lagos-district" onClick={() => { setSearch('logistics'); go('cases'); }}>
            <span className="district-index">PORT & TRANSIT / 03</span><strong>Oshodi to Apapa</strong>
            <span>Bus parks, loading bays, traffic delays, dispatch calls and timelines that do not survive a bad route estimate.</span>
            <i>Trace the movement <ArrowUpRight size={14} /></i>
          </button>
          <button className="lagos-district" onClick={() => { setSearch('night'); go('streetcraft'); }}>
            <span className="district-index">AFTER DARK / 04</span><strong>Lekki & Victoria Island</strong>
            <span>Late shifts, lounges, security desks, ride receipts and people whose public story changes after closing time.</span>
            <i>Work the night shift <ArrowUpRight size={14} /></i>
          </button>
        </div>
        <div className="lagos-world-foot">
          <span><span className="city-live-dot" /> LOCAL LIFE IS EVIDENCE</span>
          <span>Traffic • Power • Weather • Work • Family • Community</span>
        </div>
      </section>
      <section className="hero-grid">
        <div className="featured-case">
          <div className="feature-top">
            <span className="live-kicker">
              <span className="status-dot" /> CASE OF THE DAY
            </span>
            <span className="feature-ref">FIELD REPORT / 01</span>
          </div>
          <div className="feature-art" aria-hidden="true">
            <div className="art-grid" />
            <div className="art-ring ring-one" />
            <div className="art-ring ring-two" />
            <div className="art-stamp">
              OPEN
              <br />
              CASE
            </div>
            <div className="art-note note-a">08:17</div>
            <div className="art-note note-b">
              EVIDENCE
              <br />
              DOESN’T LIE.
              <br />
              <small>PEOPLE MISREAD IT.</small>
            </div>
            <div className="art-line line-a" />
            <div className="art-line line-b" />
            <div className="art-pin pin-a" />
            <div className="art-pin pin-b" />
          </div>
          <div className="feature-copy">
            <div className="eyebrow">
              GLITCH HUNT <span className="feature-dot">·</span> 3 MINUTES
            </div>
            <h2>
              The 8:17
              <br />
              <em>Screenshot</em>
            </h2>
            <p>
              A message arrives before it was supposedly sent. Four pieces of
              evidence. One detail that refuses to fit.
            </p>
            <div className="feature-actions">
              <button
                className="button-primary"
                onClick={() => openCase(cases[0])}
              >
                Open today’s case <ArrowRight size={16} />
              </button>
              <span className="points-note">
                <Target size={14} /> 120 POINTS
              </span>
            </div>
          </div>
        </div>
        <aside className="dispatch-rail">
          <div className="rail-title">
            <span>YOUR INVESTIGATION</span>
            <MoreHorizontal size={17} />
          </div>
          <div className="progress-block">
            <div className="progress-top">
              <span>ARCHIVE CLEARED</span>
              <strong>
                {solvedCount.toString().padStart(2, '0')}
                <small> / {cases.length.toString().padStart(2, '0')}</small>
              </strong>
            </div>
            <div className="progress-track">
              <span
                style={{ width: (solvedCount / cases.length) * 100 + '%' }}
              />
            </div>
            <p>
              {solvedCount === 0
                ? 'Your first case is waiting.'
                : solvedCount === cases.length
                  ? 'Every available case solved. Excellent work.'
                  : 'Every solved case sharpens your eye.'}
            </p>
          </div>
          <div className="rail-rule" />
          <div className="rail-stat-row">
            <div>
              <span className="rail-stat-label">ACCURACY</span>
              <strong>
                {accuracy}
                <small>%</small>
              </strong>
            </div>
            <div>
              <span className="rail-stat-label">STREAK</span>
              <strong>
                {progress.streak}
                <small> day</small>
              </strong>
            </div>
          </div>
          <div className="rail-rule" />
          <div className="continue-box">
            <div className="continue-icon">
              <NotebookPen size={17} />
            </div>
            <div>
              <span className="rail-stat-label">
                PICK UP WHERE YOU LEFT OFF
              </span>
              <strong>
                {solvedCount ? 'Review your evidence' : 'Start your first file'}
              </strong>
              <p>
                {solvedCount
                  ? 'Revisit a case and challenge your reasoning.'
                  : 'Learn to separate a clue from a conclusion.'}
              </p>
            </div>
            <button
              onClick={() =>
                openCase(cases.find(c => !progress.solved[c.id]) || cases[0])
              }
              aria-label="Continue investigation"
            >
              <ArrowUpRight size={16} />
            </button>
          </div>
          <button
            className="text-link rail-link"
            onClick={() => go('progress')}
          >
            View your record <ArrowRight size={14} />
          </button>
        </aside>
      </section>
      <section className="section-block">
        <div className="section-heading">
          <div>
            <div className="eyebrow">THE ARCHIVE / RECENT FILES</div>
            <h2>Cases worth a closer look</h2>
          </div>
          <button className="text-link" onClick={() => go('cases')}>
            All case files <ArrowRight size={15} />
          </button>
        </div>
        <div className="case-grid">
          {[cases[1], cases[2], cases[6]].map(c => caseCard(c, true))}
        </div>
      </section>
      <section className="mode-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">SIX WAYS INTO THE STORY</div>
            <h2>Choose your method.</h2>
          </div>
          <span className="small-mono">NO DOWNLOAD. NO NOISE.</span>
        </div>
        <div className="mode-grid">
          {[
            {
              key: 'daily',
              no: '01',
              name: 'Glitch Hunt',
              desc: 'One inconsistency. One clean deduction.',
              label: 'DAILY PUZZLE',
              icon: Zap,
            },
            {
              key: 'cases',
              no: '02',
              name: 'Case Files',
              desc: 'Longer investigations, evidence by evidence.',
              label: 'DEDUCTION',
              icon: FolderOpen,
            },
            {
              key: 'strategy',
              no: '03',
              name: 'Last Move',
              desc: 'Choose a lead. Spend your attention wisely.',
              label: 'STRATEGY',
              icon: Target,
            },
            {
              key: 'streetcraft',
              no: '04',
              name: 'Streetcraft',
              desc: 'Build a theory, test it, make your case.',
              label: 'CREATIVE LAB',
              icon: NotebookPen,
            },
            {
              key: 'dead',
              no: '05',
              name: 'Dead Drop',
              desc: 'Decode a message hidden in plain sight.',
              label: 'CIPHER ROOM',
              icon: LockKeyhole,
            },
            {
              key: 'campus',
              no: '06',
              name: 'Campus Chronicles',
              desc: 'Familiar drama. Unfamiliar details.',
              label: 'STORY WORLD',
              icon: Users,
            },
          ].map(m => {
            const Icon = m.icon;
            return (
              <button
                className="mode-card"
                key={m.key}
                onClick={() => go(m.key)}
              >
                <span className="mode-index">{m.no}</span>
                <span className="mode-icon">
                  <Icon size={18} />
                </span>
                <span className="mode-label">{m.label}</span>
                <strong>{m.name}</strong>
                <p>{m.desc}</p>
                <span className="mode-arrow">
                  <ArrowUpRight size={16} />
                </span>
              </button>
            );
          })}
        </div>
      </section>
      <div className="bottom-note">
        <span className="note-symbol">✳</span>
        <p>
          <strong>A note from the archive.</strong> Every case here is
          fictional. Progress stays in this browser; there are no public
          rankings or accounts behind the curtain.
        </p>
        <button onClick={() => go('about')}>
          How it works <ArrowRight size={14} />
        </button>
      </div>
    </>
  );

  const playPage = (
    <>
      {header(
        activeCase.title,
        activeCase.mode + ' / ' + activeCase.id,
        activeCase.subtitle
      )}
      <div className="play-toolbar">
        <button
          className="back-link"
          onClick={() =>
            go(
              activeCase.id === 'GL-001'
                ? 'daily'
                : activeCase.id === 'LM-204'
                  ? 'strategy'
                  : activeCase.id === 'DD-001'
                    ? 'dead'
                    : 'cases'
            )
          }
        >
          <ArrowLeft size={15} /> Back to files
        </button>
        <div className="play-toolbar-right">
          <span
            className={
              'difficulty difficulty-' + activeCase.difficulty.toLowerCase()
            }
          >
            {activeCase.difficulty}
          </span>
          <span className="toolbar-time">
            <Clock3 size={14} /> {activeCase.minutes} MIN
          </span>
          <button
            className={
              'icon-button ' +
              (progress.bookmarks.includes(activeCase.id)
                ? 'bookmark-active'
                : '')
            }
            onClick={() => toggleBookmark(activeCase.id)}
            aria-label="Save case"
          >
            <Bookmark size={16} />
          </button>
          <button
            className="icon-button"
            onClick={() => shareCase()}
            aria-label="Share case"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
      <div className="case-intro">
        <div className="case-number-large">{activeCase.id}</div>
        <div>
          <div className="eyebrow">CASE BRIEF / READ BEFORE PROCEEDING</div>
          <p>{activeCase.intro}</p>
          <div className="tag-row">
            {activeCase.tags.map(t => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="play-layout">
        <section className="evidence-column">
          <section className="case-team" aria-label="Investigation team">
            <div className="section-heading compact-heading">
              <div><div className="eyebrow">FIELD UNIT / AVAILABLE ON THIS CASE</div><h2>Your investigation team</h2></div>
              <span className="small-mono">4 PERSONNEL</span>
            </div>
            <div className="team-roster">
              {investigators.map(person => (
                <button key={person.id} className={'team-member ' + (selectedInvestigator === person.id ? 'team-member-active' : '')} onClick={() => setSelectedInvestigator(selectedInvestigator === person.id ? null : person.id)} aria-expanded={selectedInvestigator === person.id}>
                  <span className={'character-avatar avatar-' + person.tone}><span>{person.initials}</span><i /></span>
                  <span className="team-member-copy"><strong>{person.name}</strong><small>{person.role}</small></span>
                  <ChevronRight size={14} className="team-member-arrow" />
                </button>
              ))}
            </div>
            {selectedInvestigator && (() => {
              const person = investigators.find(member => member.id === selectedInvestigator);
              if (!person) return null;
              return <div className="character-briefing">
                <div className={'character-avatar character-avatar-large avatar-' + person.tone}><span>{person.initials}</span><i /></div>
                <div className="character-briefing-copy"><div className="eyebrow">PERSONNEL FILE / {person.role.toUpperCase()}</div><h3>{person.name}</h3><p>{person.specialty}</p><blockquote>“{person.line}”</blockquote></div>
                <button className="connection-remove character-close" onClick={() => setSelectedInvestigator(null)} aria-label="Close personnel file"><X size={14} /></button>
              </div>;
            })()}
          </section>
          <div className="section-heading compact-heading">
            <div>
              <div className="eyebrow">
                EXHIBITS /{' '}
                {activeCase.evidence.length.toString().padStart(2, '0')} ITEMS ·{' '}
                {(progress.reviewedEvidence || []).filter((key: string) =>
                  key.startsWith(activeCase.id + ':')
                ).length}
                /{activeCase.evidence.length} REVIEWED
              </div>
              <h2>Evidence locker</h2>
            </div>
            <span className="small-mono">HANDLE WITH CARE</span>
          </div>
          {activeCase.evidence.map((e, i) => (
            <article
              className={
                'evidence-card ' +
                (submitted &&
                  (activeCase.id === 'GL-001' && e.id === 'E02'
                    ? 'evidence-flagged'
                    : ''))
              }
              key={e.id}
            >
              <div className="evidence-index">
                {e.id}
                <span>{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className="evidence-content">
                <div className="evidence-meta">
                  <span>{e.type}</span>
                  {e.time && <time>{e.time}</time>}
                </div>
                <h3>{e.title}</h3>
                <p>{e.body}</p>
                <button
                  className={
                    'evidence-review ' +
                    ((progress.reviewedEvidence || []).includes(activeCase.id + ':' + e.id)
                      ? 'is-reviewed'
                      : '')
                  }
                  onClick={() => toggleEvidenceReview(activeCase.id + ':' + e.id)}
                  aria-pressed={(progress.reviewedEvidence || []).includes(activeCase.id + ':' + e.id)}
                >
                  <Check size={13} />
                  {(progress.reviewedEvidence || []).includes(activeCase.id + ':' + e.id)
                    ? 'Reviewed'
                    : 'Mark reviewed'}
                </button>
              </div>
              <button
                className={
                  'evidence-save ' +
                  (progress.bookmarks.includes(activeCase.id + ':' + e.id)
                    ? 'bookmark-active'
                    : '')
                }
                onClick={() => toggleBookmark(activeCase.id + ':' + e.id)}
                aria-label={'Save ' + e.id}
              >
                <Bookmark size={15} />
              </button>
              <button className={'evidence-link-trigger ' + (selectedEvidenceForLink === e.id ? 'is-link-selected' : '')} onClick={() => selectEvidenceForLink(e.id)} aria-pressed={selectedEvidenceForLink === e.id}>
                <Fingerprint size={14} />
                {selectedEvidenceForLink === e.id ? 'SELECTED — choose another' : 'Connect clue'}
              </button>
            </article>
          ))}
          <section className="interview-room" aria-label="Witness interview room">
            <div className="section-heading compact-heading">
              <div><div className="eyebrow">INTERVIEW ROOM / FOLLOW THE LEAD</div><h2>Ask before you accuse</h2></div>
              <span className="small-mono">{(interviewAnswers[activeCase.id] || []).length}/3 QUESTIONS</span>
            </div>
            <p className="interview-intro">Choose a question to open a new line of inquiry. Replies point back to the case record; they are leads to test, not automatic proof.</p>
            <div className="interview-questions">
              {interviewForCase(activeCase).map((exchange, index) => {
                const asked = (interviewAnswers[activeCase.id] || []).includes(index);
                return <button key={exchange.question} className={'interview-question ' + (activeInterviewQuestion === index ? 'interview-question-active' : '')} onClick={() => { setActiveInterviewQuestion(activeInterviewQuestion === index ? null : index); if (!asked) setInterviewAnswers(current => ({ ...current, [activeCase.id]: [...(current[activeCase.id] || []), index] })); }} aria-expanded={activeInterviewQuestion === index}>
                  <span className="interview-question-number">0{index + 1}</span><span>{exchange.question}</span><ChevronRight size={15} />
                </button>;
              })}
            </div>
            {activeInterviewQuestion !== null && <div className="interview-response" aria-live="polite">
              <div className="eyebrow">FIELD RESPONSE / LEAD GENERATED</div>
              <p>{interviewForCase(activeCase)[activeInterviewQuestion]?.response}</p>
              <div className="interview-lead"><Target size={15} /><span><strong>Next lead:</strong> {interviewForCase(activeCase)[activeInterviewQuestion]?.lead}</span></div>
            </div>}
          </section>
          <section className="investigation-board" aria-label="Investigation board">
            <div className="section-heading compact-heading">
              <div><div className="eyebrow">WORKING BOARD / YOUR DEDUCTIONS</div><h2>Connect the evidence</h2></div>
              <span className="small-mono">{(progress.evidenceLinks || []).filter((link: any) => link.caseId === activeCase.id).length} LINKS</span>
            </div>
            <p className="board-instructions">Pick one exhibit, then another. Record whether the relationship supports a lead, contradicts it, or helps establish a timeline. Your connections are saved on this device.</p>
            <label className="board-relation-label" htmlFor="evidence-link-type">Relationship</label>
            <select id="evidence-link-type" className="board-relation-select" value={linkType} onChange={e => setLinkType(e.target.value)}>
              <option value="supports">Supports / reinforces</option><option value="contradicts">Contradicts / conflicts with</option><option value="timeline">Timeline / sequence</option><option value="context">Context / possible connection</option>
            </select>
            <div className="board-status" aria-live="polite">{selectedEvidenceForLink ? 'Selected ' + selectedEvidenceForLink + '. Choose a second exhibit to make a connection.' : 'No exhibit selected. Start by connecting two pieces of evidence.'}</div>
            {(progress.evidenceLinks || []).filter((link: any) => link.caseId === activeCase.id).length ? (
              <div className="evidence-connections">
                {(progress.evidenceLinks || []).map((link: any, index: number) => {
                  if (link.caseId !== activeCase.id) return null;
                  const from = activeCase.evidence.find(e => e.id === link.from); const to = activeCase.evidence.find(e => e.id === link.to);
                  if (!from || !to) return null;
                  return <article className="evidence-connection" key={link.caseId + link.from + link.to + link.relation + index}><div className="connection-exhibits"><span>{from.id}</span><ArrowRight size={13} /><span>{to.id}</span></div><div className="connection-copy"><strong>{from.title}</strong><span>{link.relation}</span><strong>{to.title}</strong></div><button className="connection-remove" onClick={() => removeEvidenceLink(index)} aria-label="Remove connection"><X size={14} /></button></article>;
                })}
              </div>
            ) : <div className="board-empty"><Fingerprint size={19} /><span>Your board is empty. Connect two exhibits to begin building your own theory.</span></div>}
          </section>
          <div className="note-panel">
            <button
              className="note-panel-head"
              onClick={() => setShowNote(!showNote)}
            >
              <span>
                <NotebookPen size={16} /> YOUR FIELD NOTES
              </span>
              <span>{showNote ? 'CLOSE −' : 'ADD A NOTE +'}</span>
            </button>
            {showNote && (
              <div className="note-editor">
                <textarea
                  value={draftText}
                  onChange={e => setDraftText(e.target.value)}
                  placeholder="What do you know? What are you assuming? What evidence would change your mind?"
                  rows={4}
                />
                <div className="note-editor-foot">
                  <span>SAVED ON THIS DEVICE ONLY</span>
                  <button className="button-secondary" onClick={saveNote}>
                    Save note <Check size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
        <aside className="theory-column">
          <div className="theory-card">
            <div className="theory-card-top">
              <span className="theory-mark">
                <Target size={18} />
              </span>
              <span className="small-mono">YOUR THEORY / 01</span>
            </div>
            <h2>What does the evidence support?</h2>
            <p className="theory-prompt">
              Choose the strongest conclusion—not the most dramatic one.
            </p>
            <div className="answer-list">
              {activeCase.options.map((o, i) => (
                <button
                  key={o}
                  disabled={submitted}
                  className={
                    'answer-option ' +
                    (answer === i ? 'answer-selected' : '') +
                    (submitted && i === activeCase.answer
                      ? ' answer-correct'
                      : '') +
                    (submitted && answer === i && i !== activeCase.answer
                      ? ' answer-wrong'
                      : '')
                  }
                  onClick={() => setAnswer(i)}
                >
                  <span className="answer-letter">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{o}</span>
                  {submitted && i === activeCase.answer && <Check size={15} />}
                </button>
              ))}
            </div>
            {!submitted ? (
              <>
                <button
                  className="button-primary full-button"
                  onClick={submitAnswer}
                >
                  Lock in my theory <ArrowRight size={16} />
                </button>
                <button
                  className="hint-button"
                  onClick={() => {
                    setHintOpen(!hintOpen);
                    if (!hintOpen)
                      setToast(
                        'Hint opened. Your maximum score is reduced by 35 points.'
                      );
                  }}
                >
                  <Lightbulb size={15} />{' '}
                  {hintOpen ? 'Hide hint' : 'Request a hint'}{' '}
                  <span>{hintOpen ? '−35 PTS' : '−35 PTS'}</span>
                </button>
                {hintOpen && <div className="hint-box">{activeCase.hint}</div>}
              </>
            ) : (
              <div
                className={
                  'result-box ' +
                  (isCorrect ? 'result-correct' : 'result-incorrect')
                }
              >
                <div className="result-label">
                  {isCorrect ? 'DEDUCTION CONFIRMED' : 'THEORY NOT SUPPORTED'}
                </div>
                <h3>{isCorrect ? 'Good catch.' : 'Re-examine the record.'}</h3>
                <p>{activeCase.explanation}</p>
                <div className="score-line">
                  <span>CASE SCORE</span>
                  <strong>
                    {isCorrect
                      ? Math.max(40, activeCase.points - (hintOpen ? 35 : 0))
                      : 0}
                    <small> / {activeCase.points}</small>
                  </strong>
                </div>
                <button
                  className="button-secondary full-button"
                  onClick={() => shareCase()}
                >
                  Challenge a friend <Send size={14} />
                </button>
                <button
                  className="text-link next-case"
                  onClick={() => {
                    const next =
                      cases[
                        (cases.findIndex(c => c.id === activeCase.id) + 1) %
                          cases.length
                      ];
                    openCase(next);
                  }}
                >
                  Next file <ArrowRight size={14} />
                </button>
              </div>
            )}
            <div className="fair-play">
              <ShieldCheck size={15} />
              <p>
                <strong>Evidence over instinct.</strong>
                <br />A good investigator separates what a clue proves from what
                it merely suggests.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );

  const casesPage = (
    <>
      {header(
        'The case files',
        'ARCHIVE / INDEX',
        'Every claim leaves a trace. Start with the evidence, not the rumour.'
      )}
      <div className="library-toolbar">
        <label className="search-field">
          <Search size={17} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search cases, clues, tags…"
          />
          <kbd>⌘ K</kbd>
        </label>
        <label className="filter-select">
          <Filter size={15} />
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option>All cases</option>
            <option>Unsolved</option>
            <option>Solved</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <ChevronDown size={14} />
        </label>
      </div>
      <div className="library-count">
        <span>
          {visibleCases.length.toString().padStart(2, '0')} FILES FOUND
        </span>
        <span>LOCAL ARCHIVE / NO ACCOUNT REQUIRED</span>
      </div>
      {visibleCases.length ? (
        <div className="case-grid library-grid">
          {visibleCases.map(c => caseCard(c))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={24} />
          <h3>No matching files.</h3>
          <p>Try a different phrase or reset the filters.</p>
          <button
            className="button-secondary"
            onClick={() => {
              setSearch('');
              setFilter('All cases');
            }}
          >
            Reset search
          </button>
        </div>
      )}
    </>
  );

  const dailyPage = (
    <>
      {header(
        'The daily drop',
        'GLITCH HUNT / DAILY',
        'One small detail can change the entire story. Can you spot it?'
      )}
      <div className="daily-banner">
        <div className="daily-number">
          TODAY
          <br />
          <strong>001</strong>
        </div>
        <div className="daily-banner-copy">
          <div className="eyebrow">
            <span className="status-dot" /> DAILY CASE / AVAILABLE NOW
          </div>
          <h2>
            Not everything that looks like proof <em>is proof.</em>
          </h2>
          <p>
            Three minutes. Four exhibits. A fresh reason to doubt the first
            explanation.
          </p>
          <button className="button-primary" onClick={() => openCase(cases[0])}>
            {progress.solved['GL-001']?.correct
              ? 'Review today’s case'
              : 'Investigate now'}{' '}
            <ArrowRight size={16} />
          </button>
        </div>
        <div className="daily-decoration">
          <div className="daily-ring" />
          <span>GL—001</span>
          <span>08:17</span>
        </div>
      </div>
      <div className="daily-info-grid">
        <div className="paper-panel">
          <div className="eyebrow">THE RULE</div>
          <h3>Count sources, not screenshots.</h3>
          <p>
            Look for what can be verified. An inconsistency can be meaningful
            without proving a person’s motive.
          </p>
        </div>
        <div className="paper-panel">
          <div className="eyebrow">YOUR RECORD</div>
          <h3>
            {progress.solved['GL-001']?.correct
              ? 'Case solved.'
              : 'Still unsolved.'}
          </h3>
          <p>
            {progress.solved['GL-001']?.correct
              ? 'Your result is saved on this device. Revisit the exhibits any time.'
              : 'Your score is saved locally after you submit a theory.'}
          </p>
        </div>
      </div>
      <section className="section-block">
        <div className="section-heading">
          <div>
            <div className="eyebrow">MORE QUICK READS</div>
            <h2>Short cases, sharp eyes.</h2>
          </div>
          <button className="text-link" onClick={() => go('cases')}>
            Browse archive <ArrowRight size={15} />
          </button>
        </div>
        <div className="case-grid">
          {[cases[3], cases[4], cases[6]].map(c => caseCard(c, true))}
        </div>
      </section>
    </>
  );

  const strategyPage = (
    <>
      {header(
        'Your next move',
        'LAST MOVE / STRATEGY ROOM',
        'The order of your investigation matters. Spend attention where it can prove something.'
      )}
      <div className="strategy-feature">
        <div className="strategy-visual">
          <div className="strategy-coordinate">ROOM 204 / FLOOR PLAN</div>
          <div className="strategy-map">
            <span className="map-room room-a">
              LECTURE
              <br />
              HALL
            </span>
            <span className="map-room room-b">
              ROOM
              <br />
              204
            </span>
            <span className="map-room room-c">
              CONTROL
              <br />
              PANEL
            </span>
            <span className="map-path" />
            <span className="map-marker">
              <Target size={19} />
            </span>
          </div>
          <div className="strategy-visual-foot">
            <span>FIELD MAP / NOT TO SCALE</span>
            <span>12:05 PM</span>
          </div>
        </div>
        <div className="strategy-copy">
          <div className="eyebrow">STRATEGIC CASE / LM-204</div>
          <h2>Room 204</h2>
          <p>
            A projector cuts out during a demo. You have five exhibits, two
            plausible mechanisms, and no time to chase every rumour.
          </p>
          <div className="strategy-facts">
            <span>
              <Clock3 size={14} /> 9 MINUTES
            </span>
            <span>
              <Target size={14} /> 300 POINTS
            </span>
            <span>
              <Flag size={14} /> HARD
            </span>
          </div>
          <button className="button-primary" onClick={() => openCase(cases[7])}>
            Enter the room <ArrowRight size={16} />
          </button>
        </div>
      </div>
      <div className="principle-row">
        <div>
          <span className="principle-no">01</span>
          <h3>Test the mechanism</h3>
          <p>Choose a lead that can be checked against a record.</p>
        </div>
        <div>
          <span className="principle-no">02</span>
          <h3>Separate fact from inference</h3>
          <p>Being near a panel is not proof of causing an outage.</p>
        </div>
        <div>
          <span className="principle-no">03</span>
          <h3>Protect the uncertainty</h3>
          <p>A good conclusion admits what the evidence cannot tell you.</p>
        </div>
      </div>
    </>
  );

  const deadPage = (
    <>
      {header(
        'Dead drop',
        'CIPHER ROOM / 001',
        'Some messages are not hidden. They are simply waiting to be read correctly.'
      )}
      <div className="dead-drop-feature">
        <div className="dead-drop-art">
          <div className="cipher-paper">
            <span className="paper-stamp">
              ARCHIVE
              <br />
              COPY
            </span>
            <div className="cipher-label">RECOVERED NOTE / 001</div>
            <div className="cipher-code">
              DPOF
              <br />
              UIFO
              <br />
              SFBE
            </div>
            <div className="cipher-bottom">DO NOT DESTROY</div>
          </div>
          <div className="cipher-pin" />
        </div>
        <div className="dead-drop-copy">
          <div className="eyebrow">DEAD DROP / CIPHER 001</div>
          <h2>
            Read between
            <br />
            <em>the letters.</em>
          </h2>
          <p>
            A short note was left at the archive door. The sender insists the
            first clue is printed right on the page.
          </p>
          <div className="cipher-hint-line">
            <LockKeyhole size={15} />
            <span>RULE: EACH LETTER MOVED FORWARD BY ONE</span>
          </div>
          <button className="button-primary" onClick={() => openCase(cases[5])}>
            Decode the message <ArrowRight size={16} />
          </button>
        </div>
      </div>
      <div className="cipher-guidance">
        <div>
          <span className="principle-no">01</span>
          <strong>Identify the rule</strong>
          <p>Use the archive guide to learn the shift.</p>
        </div>
        <div>
          <span className="principle-no">02</span>
          <strong>Reverse it</strong>
          <p>Move each letter back one place.</p>
        </div>
        <div>
          <span className="principle-no">03</span>
          <strong>Check the phrase</strong>
          <p>The result should read like an instruction.</p>
        </div>
      </div>
    </>
  );

  const campusPage = (
    <>
      {header(
        'Campus chronicles',
        'STORY WORLD / EPISODIC',
        'Ordinary places. Overheard conversations. Details that refuse to behave.'
      )}
      <div className="campus-intro">
        <div className="campus-sticker">
          FICTIONAL
          <br />
          STUDENT
          <br />
          UNIVERSE
        </div>
        <div>
          <div className="eyebrow">THE STUDENT FILES / SEASON 01</div>
          <h2>
            Every group chat
            <br />
            has a <em>second story.</em>
          </h2>
          <p>
            Meet the recurring cast through short, fictional episodes. Follow a
            story into a playable investigation when the details stop adding up.
          </p>
        </div>
      </div>
      <div className="episode-list">
        {episodes.map((ep, i) => (
          <article className="episode-row" key={ep.no}>
            <div className="episode-index">
              {ep.no}
              <span>0{i + 1}</span>
            </div>
            <div className={'episode-art episode-art-' + i}>
              <span>
                {['CHAT / 08:17', 'ROOM / 10:11', 'PARCEL / 14:02'][i]}
              </span>
              <div className="episode-art-mark">
                {['“seen”', '14:02', 'ROOM 14'][i]}
              </div>
            </div>
            <div className="episode-copy">
              <div className="eyebrow">{ep.tag}</div>
              <h3>{ep.title}</h3>
              <p>{ep.text}</p>
              <button
                className="text-link"
                onClick={() => {
                  const c = cases.find(x => x.id === ep.caseId);
                  if (c) openCase(c);
                }}
              >
                Investigate this episode <ArrowRight size={14} />
              </button>
            </div>
            <ArrowUpRight className="episode-arrow" size={18} />
          </article>
        ))}
      </div>
      <div className="fiction-note">
        <ShieldCheck size={16} />
        <span>
          All characters and incidents are fictional. These stories are written
          for deduction and media literacy—not to identify or accuse real
          people.
        </span>
      </div>
    </>
  );

  const streetcraftPage = (
    <>
      {header(
        'Streetcraft',
        'CREATIVE LAB / WEEKLY',
        'Good investigators do more than find answers. They learn how to make a case.'
      )}
      <div className="streetcraft-hero">
        <div>
          <div className="eyebrow">THE FIELDWORK EXERCISE</div>
          <h2>
            Build a theory.
            <br />
            <em>Show your working.</em>
          </h2>
          <p>
            Short writing challenges to practise clear reasoning, fair
            storytelling, and the difference between evidence and assumption.
          </p>
        </div>
        <div className="streetcraft-mark">
          <NotebookPen size={34} />
          <span>
            FIELD
            <br />
            WORK
            <br />/ 001
          </span>
        </div>
      </div>
      <div className="prompt-grid">
        {prompts.map((p, i) => (
          <article className="prompt-card" key={p.title}>
            <div className="prompt-meta">
              <span>EXERCISE / 0{i + 1}</span>
              <span>{p.tag}</span>
            </div>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
            <button
              className="text-link"
              onClick={() => {
                setDraftText(progress.drafts[p.title] || '');
                setActiveCase({
                  ...cases[0],
                  id: 'PROMPT-' + i,
                  title: p.title,
                  subtitle: p.tag,
                  intro: p.text,
                });
                go('write');
              }}
            >
              Start writing <ArrowRight size={14} />
            </button>
          </article>
        ))}
      </div>
      <div className="local-label">
        <ShieldCheck size={15} /> Drafts are saved on this device. There are no
        public submissions or community votes in this first release.
      </div>
    </>
  );

  const writePage = (
    <>
      {header(
        activeCase.title,
        'STREETCRAFT / DRAFT ROOM',
        'Make the reasoning visible. You can revise this any time.'
      )}
      <div className="writing-room">
        <div className="writing-prompt">
          <div className="eyebrow">THE BRIEF</div>
          <p>{activeCase.intro}</p>
          <div className="writing-rule">
            <Lightbulb size={16} />
            <span>
              Be specific. Separate what you know from what you suspect.
            </span>
          </div>
        </div>
        <label className="writing-label">
          YOUR THEORY{' '}
          <span>
            {draftText.trim() ? draftText.trim().split(/\s+/).length : 0} WORDS
          </span>
          <textarea
            value={draftText}
            onChange={e => setDraftText(e.target.value)}
            rows={10}
            placeholder="Start with the strongest evidence. What does it show? What does it not show? What would you check next?"
          />
        </label>
        <div className="writing-actions">
          <button
            className="button-secondary"
            onClick={() => {
              setProgress((p: any) => ({
                ...p,
                drafts: { ...p.drafts, [activeCase.title]: draftText },
              }));
              setToast('Draft saved on this device.');
            }}
          >
            Save draft <Check size={14} />
          </button>
          <button
            className="button-primary"
            onClick={() =>
              copyText(draftText, 'Theory copied. Ready to share.')
            }
            disabled={!draftText.trim()}
          >
            Copy theory <Copy size={14} />
          </button>
        </div>
      </div>
    </>
  );

  const archivePage = (
    <>
      {header(
        'The archives',
        'RECORDS / ALL MATERIAL',
        'Cases, clues and stories. Sorted for the next curious mind.'
      )}
      <div className="archive-summary">
        <div>
          <span>AVAILABLE FILES</span>
          <strong>{cases.length.toString().padStart(2, '0')}</strong>
        </div>
        <div>
          <span>SOLVED BY YOU</span>
          <strong>{solvedCount.toString().padStart(2, '0')}</strong>
        </div>
        <div>
          <span>SAVED CLUES</span>
          <strong>
            {progress.bookmarks.length.toString().padStart(2, '0')}
          </strong>
        </div>
        <div>
          <span>PERSONAL NOTES</span>
          <strong>
            {Object.values(progress.notes)
              .filter((x: any) => x?.trim())
              .length.toString()
              .padStart(2, '0')}
          </strong>
        </div>
      </div>
      <div className="section-heading archive-subhead">
        <div>
          <div className="eyebrow">THE COMPLETE INDEX</div>
          <h2>Open the record.</h2>
        </div>
        <button className="text-link" onClick={() => go('cases')}>
          Search and filter <ArrowRight size={14} />
        </button>
      </div>
      <div className="case-grid library-grid">
        {cases.map(c => caseCard(c))}
      </div>
    </>
  );

  const progressPage = (
    <>
      {header(
        'Your record',
        'INVESTIGATOR PROFILE / LOCAL',
        'A record of what you have solved, what you saved, and how your reasoning is improving.'
      )}
      <div className={'record-hero scene-' + (progress.avatarScene || 'rainy-street')}>
        <div className={'record-avatar player-portrait portrait-' + (progress.avatarStyle || 'detective')} aria-label={(progress.avatarStyle || 'detective') + ' player portrait'}>
          <span className="portrait-backdrop" />
          <span className="portrait-head" />
          <span className="portrait-shoulders" />
          <span className="portrait-initials">{(progress.nickname || 'I').trim().split(/\\s+/).slice(0, 2).map((part: string) => part[0]).join('').toUpperCase()}</span>
        </div>
        <div className="record-name">
          <span className="eyebrow">FIELD ID / GUEST</span>
          <h2>{progress.nickname || 'Investigator'}</h2>
          <p>Independent investigator · Progress stored on this device</p>
          <button
            className="text-link"
            onClick={() => {
              const next = window.prompt(
                'Choose your investigator nickname',
                progress.nickname || 'Investigator'
              );
              if (next?.trim())
                setProgress((p: any) => ({
                  ...p,
                  nickname: next.trim().slice(0, 24),
                }));
            }}
          >
            Edit nickname <ArrowRight size={14} />
          </button>
        </div>
        <div className="record-stamp">
          NO
          <br />
          ACCOUNT
          <br />
          REQUIRED
        </div>
      </div>
      <section className="avatar-customizer">
        <div className="eyebrow">PERSONALISE / YOUR FIELD ID</div>
        <h2>Build your investigator</h2>
        <p>Choose a portrait style and the scene behind your profile. Your choices stay saved on this device.</p>
        <div className="avatar-choice-group">
          <div className="avatar-choice-heading"><span>1. CHOOSE YOUR LOOK</span><small>Pick a character style</small></div>
          <div className="avatar-choice-grid" role="group" aria-label="Choose your avatar style">
            {[
              { id: 'detective', title: 'Lead detective', note: 'Classic investigator' },
              { id: 'field', title: 'Field officer', note: 'On-scene specialist' },
              { id: 'analyst', title: 'Forensic analyst', note: 'Evidence expert' },
              { id: 'dispatch', title: 'Dispatch specialist', note: 'Comms & coordination' },
            ].map(option => (
              <button type="button" key={option.id} className={'avatar-choice avatar-style-choice ' + ((progress.avatarStyle || 'detective') === option.id ? 'avatar-choice-active' : '')} onClick={() => setProgress((p: any) => ({ ...p, avatarStyle: option.id }))} aria-pressed={(progress.avatarStyle || 'detective') === option.id}>
                <span className={'choice-mini-portrait portrait-' + option.id}><i /></span>
                <span className="avatar-choice-copy"><strong>{option.title}</strong><small>{option.note}</small></span>
                <span className="avatar-choice-check" aria-hidden="true">{(progress.avatarStyle || 'detective') === option.id ? '✓' : ''}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="avatar-choice-group">
          <div className="avatar-choice-heading"><span>2. CHOOSE YOUR SCENE</span><small>Change the atmosphere</small></div>
          <div className="avatar-choice-grid scene-choice-grid" role="group" aria-label="Choose your crime scene backdrop">
            {[
              { id: 'rainy-street', title: 'Rainy city', note: 'Street investigation', icon: '🌧️' },
              { id: 'warehouse', title: 'Warehouse', note: 'After-hours search', icon: '🏚️' },
              { id: 'night-lab', title: 'Forensic lab', note: 'Evidence review', icon: '🧪' },
              { id: 'archive', title: 'Evidence archive', note: 'Cold case records', icon: '🗂️' },
            ].map(option => (
              <button type="button" key={option.id} className={'avatar-choice scene-choice scene-choice-' + option.id + ' ' + ((progress.avatarScene || 'rainy-street') === option.id ? 'avatar-choice-active' : '')} onClick={() => setProgress((p: any) => ({ ...p, avatarScene: option.id }))} aria-pressed={(progress.avatarScene || 'rainy-street') === option.id}>
                <span className="scene-choice-icon" aria-hidden="true">{option.icon}</span>
                <span className="avatar-choice-copy"><strong>{option.title}</strong><small>{option.note}</small></span>
                <span className="avatar-choice-check" aria-hidden="true">{(progress.avatarScene || 'rainy-street') === option.id ? '✓' : ''}</span>
              </button>
            ))}
          </div>
        </div>
        <div className={'avatar-scene-preview scene-preview-' + (progress.avatarScene || 'rainy-street')} role="img" aria-label={'Profile portrait scene: ' + (progress.avatarScene || 'rainy street').replace('-', ' ')}>
          <div className="scene-light scene-light-one" />
          <div className="scene-light scene-light-two" />
          <div className="scene-silhouette scene-silhouette-one" />
          <div className="scene-silhouette scene-silhouette-two" />
          <span className="scene-caption">FIELD CAMERA / { (progress.avatarScene || 'RAINY STREET').replace('-', ' ').toUpperCase() }</span>
          <strong>{progress.nickname || 'Investigator'}</strong>
          <small>PERSONNEL PORTRAIT · LOCAL PROFILE</small>
        </div>
      </section>
      <div className="record-stats">
        <div>
          <span>CASES SOLVED</span>
          <strong>
            {solvedCount}
            <small> / {cases.length}</small>
          </strong>
        </div>
        <div>
          <span>ACCURACY</span>
          <strong>
            {accuracy}            <small>%</small>
          </strong>
        </div>
        <div>
          <span>POINTS EARNED</span>
          <strong>
            {Object.values(progress.solved).reduce(
              (sum: number, x: any) => sum + (x?.score || 0),
              0
            )}
          </strong>
        </div>
        <div>
          <span>CLUES SAVED</span>
          <strong>{progress.bookmarks.length}</strong>
        </div>
      </div>
      <section className="section-block">
        <div className="section-heading">
          <div>
            <div className="eyebrow">YOUR CASE HISTORY</div>
            <h2>Evidence of progress.</h2>
          </div>
        </div>
        {totalAttempts ? (
          <div className="history-list">
            {cases
              .filter(c => progress.solved[c.id])
              .map(c => (
                <button
                  className="history-row"
                  key={c.id}
                  onClick={() => openCase(c)}
                >
                  <span className="history-mark">
                    {progress.solved[c.id].correct ? (
                      <Check size={15} />
                    ) : (
                      <X size={15} />
                    )}
                  </span>
                  <span>
                    <strong>{c.title}</strong>
                    <small>
                      {c.id} ·{' '}
                      {progress.solved[c.id].correct ? 'Solved' : 'Attempted'}
                    </small>
                  </span>
                  <strong>
                    {progress.solved[c.id].score} <small>PTS</small>
                  </strong>
                  <ChevronRight size={16} />
                </button>
              ))}
          </div>
        ) : (
          <div className="empty-state">
            <FolderOpen size={24} />
            <h3>Your first file is waiting.</h3>
            <p>When you submit a theory, the result appears here.</p>
            <button
              className="button-primary"
              onClick={() => openCase(cases[0])}
            >
              Open first case <ArrowRight size={15} />
            </button>
          </div>
        )}
      </section>
      <section className="section-block">
        <div className="section-heading">
          <div>
            <div className="eyebrow">EVIDENCE LOCKER</div>
            <h2>Saved clues</h2>
          </div>
        </div>
        {progress.bookmarks.length ? (
          <div className="saved-list">
            {progress.bookmarks.map((id: string) => {
              const [caseId, evidenceId] = id.split(':');
              const c = cases.find(x => x.id === caseId);
              const ev = c?.evidence.find(x => x.id === evidenceId);
              return (
                <button
                  className="saved-row"
                  key={id}
                  onClick={() => c && openCase(c)}
                >
                  <Bookmark size={15} />
                  <span>
                    <strong>{ev?.title || c?.title || id}</strong>
                    <small>
                      {ev ? c?.id + ' / ' + evidenceId : 'CASE FILE'}
                    </small>
                  </span>
                  <ArrowUpRight size={15} />
                </button>
              );
            })}
          </div>
        ) : (
          <p className="muted-copy">
            Save a case or evidence item with the bookmark icon to keep it here.
          </p>
        )}
      </section>
    </>
  );

  const aboutPage = (
    <>
      {header(
        'How this place works',
        'THE HOUSE RULES / READ ME',
        'A little context before you open the next file.'
      )}
      <div className="about-sheet">
        <div className="eyebrow">RULE 01 / FICTION</div>
        <h2>
          Every case is made up.
          <br />
          <em>The reasoning is yours.</em>
        </h2>
        <p>
          AFTERHOURS is a browser-first mystery and deduction game. Its cases
          use fictional people, messages, receipts, logs and timelines to help
          you practise careful reasoning.
        </p>
        <div className="about-rule">
          <span>01</span>
          <div>
            <strong>Evidence before accusation.</strong>
            <p>
              A clue may support a theory without proving it. Explanations are
              written to show both what is supported and what remains uncertain.
            </p>
          </div>
        </div>
        <div className="about-rule">
          <span>02</span>
          <div>
            <strong>Your progress stays here.</strong>
            <p>
              Case results, notes, drafts, nickname and bookmarks are saved in
              local browser storage on this device. There is no account or
              backend in this first version.
            </p>
          </div>
        </div>
        <div className="about-rule">
          <span>03</span>
          <div>
            <strong>Sharing reveals no answer.</strong>
            <p>
              Challenge links point to the case, not the solution. Your result
              card and explanation stay on your screen unless you choose to
              share text yourself.
            </p>
          </div>
        </div>
        <div className="about-rule">
          <span>04</span>
          <div>
            <strong>This is an early release.</strong>
            <p>
              There are no real global leaderboards, public submissions, live
              multiplayer or AI-generated cases. The visible features work
              locally and do not pretend otherwise.
            </p>
          </div>
        </div>
        <button className="button-primary" onClick={() => go('home')}>
          Back to dispatch <ArrowRight size={16} />
        </button>
      </div>
    </>
  );

  const pageMap: Record<string, any> = {
    home: homePage,
    play: playPage,
    cases: casesPage,
    daily: dailyPage,
    strategy: strategyPage,
    dead: deadPage,
    campus: campusPage,
    streetcraft: streetcraftPage,
    write: writePage,
    archive: archivePage,
    progress: progressPage,
    about: aboutPage,
  };
  return (
    <div
      className={
        'app-shell ' +
        (fontLarge ? 'font-large ' : '') +
        (reduceMotion ? 'reduce-motion' : '')
      }
    >
      {sidebar}
      {menuOpen && (
        <button
          className="sidebar-scrim"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <main className="main-content">
        <div className="topline">
          <span>
            <span className="topline-dot" /> LAGOS FIELD NETWORK <span className="topline-sep">·</span> FICTIONAL CASEWORK
          </span>
          <span>
            LAGOS, NIGERIA <span className="topline-sep">·</span> MAINLAND ↔ ISLAND
          </span>
        </div>
        <div className="page-body">
          {pageMap[page] || homePage}
          <footer className="app-footer">
            <button onClick={() => go('about')}>About the archive</button>
            <span>
              AFTERHOURS © 2026 <i>·</i> FICTION, WITH INTENTION.
            </span>
            <button onClick={() => setSettingsOpen(true)}>
              Preferences <Settings2 size={13} />
            </button>
          </footer>
        </div>
      </main>
      {toast && (
        <div className="toast">
          <Check size={15} />
          {toast}
          <button onClick={() => setToast('')} aria-label="Dismiss">
            <X size={14} />
          </button>
        </div>
      )}
      {settingsOpen && (
        <div className="modal-backdrop" onClick={() => setSettingsOpen(false)}>
          <section
            className="settings-modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <div className="eyebrow">PREFERENCES / LOCAL</div>
                <h2>Your desk, your rules.</h2>
              </div>
              <button
                className="icon-button"
                onClick={() => setSettingsOpen(false)}
                aria-label="Close preferences"
              >
                <X size={18} />
              </button>
            </div>
            <p>These preferences apply to this browser only.</p>
            <label className="setting-row">
              <span>
                <strong>Larger reading text</strong>
                <small>Make evidence easier to read.</small>
              </span>
              <input
                type="checkbox"
                checked={fontLarge}
                onChange={e => setFontLarge(e.target.checked)}
              />
            </label>
            <label className="setting-row">
              <span>
                <strong>Reduce motion</strong>
                <small>Limit animated scrolling and transitions.</small>
              </span>
              <input
                type="checkbox"
                checked={reduceMotion}
                onChange={e => setReduceMotion(e.target.checked)}
              />
            </label>
            <div className="privacy-callout">
              <ShieldCheck size={17} />
              <span>
                <strong>Local by design.</strong>
                <br />
                This version does not require an account or send your notes to a
                server.
              </span>
            </div>
            <button className="button-danger" onClick={resetProgress}>
              Clear all local progress
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
export default App;
