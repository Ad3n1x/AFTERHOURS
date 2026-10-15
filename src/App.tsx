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
  MapPin,
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
  },
  {
    id: 'NG-IBD-001',
    title: 'The Bodija Transfer',
    subtitle: 'A seller says the payment never arrived, but the buyer has a screenshot.',
    mode: 'REGIONAL FILES',
    difficulty: 'Easy',
    minutes: 4,
    points: 150,
    tags: ['Ibadan', 'Oyo State', 'Market', 'Payments'],
    intro: 'At a fictional Bodija shop in Ibadan, a buyer shows a payment screenshot while the seller says the account has not been credited. Work out what the records actually establish.',
    evidence: [
      { id: 'E01', type: 'PHONE SCREENSHOT', time: '12:06', title: 'Transfer confirmation image', body: 'The image shows ₦18,500 and the seller’s account number, but the status line is partly cropped.' },
      { id: 'E02', type: 'BANK APP', time: '12:07', title: 'Transaction detail', body: 'The original app record says “Pending”. It does not show a completed reference number.' },
      { id: 'E03', type: 'SELLER ACCOUNT', time: '12:12', title: 'Incoming transactions', body: 'The seller checks the correct account and finds no matching credit at 12:12.' },
      { id: 'E04', type: 'BANK APP', time: 'NEXT DAY · 08:40', title: 'Status update', body: 'The buyer’s transaction history later marks the transfer as reversed.' },
    ],
    options: ['The seller definitely received the money and is lying.', 'The screenshot alone is not proof of a completed payment; the transfer was later reversed.', 'The buyer must have used a different account.', 'The seller’s account record proves the buyer never initiated a transfer.'],
    answer: 1,
    hint: 'Separate “initiated”, “pending”, “credited” and “reversed”.',
    explanation: 'The original record was pending and later reversed. The screenshot does not establish a completed payment, and the evidence does not justify accusing either person of deliberate wrongdoing.',
  },
  {
    id: 'NG-ABJ-001',
    title: 'The Wuse Appointment',
    subtitle: 'Three records show three different times for the same meeting.',
    mode: 'REGIONAL FILES',
    difficulty: 'Medium',
    minutes: 5,
    points: 180,
    tags: ['Abuja', 'FCT', 'Office', 'Timeline'],
    intro: 'A fictional office in Wuse is reviewing whether a visitor missed an appointment. Check the invitation, the revision and the building register before deciding what the timestamps mean.',
    evidence: [
      { id: 'E01', type: 'CALENDAR INVITE', time: '09:40', title: 'Original appointment', body: 'The invite schedules the meeting for 09:40 and names the Wuse office.' },
      { id: 'E02', type: 'EMAIL', time: '09:12', title: 'Rescheduled meeting', body: 'The office coordinator writes that the meeting has moved to 10:15 and asks the visitor to confirm receipt.' },
      { id: 'E03', type: 'VISITOR REGISTER', time: '10:04', title: 'Building entry', body: 'The visitor signs in at 10:04. The register records building entry, not arrival at the meeting room.' },
      { id: 'E04', type: 'ROOM LOG', time: '10:19', title: 'Meeting room opened', body: 'The room log records the meeting room being opened at 10:19.' },
    ],
    options: ['The visitor was late because the original invite said 09:40.', 'The building register proves the visitor was already in the meeting room at 10:04.', 'The revised appointment is the relevant schedule, but the records do not show when the visitor reached the room.', 'The meeting definitely began at 10:19.'],
    answer: 2,
    hint: 'Which record shows the schedule, and which records show physical access?',
    explanation: 'The coordinator revised the appointment to 10:15. Building entry and room opening are separate events, so the available records do not establish the exact time the visitor reached the room or when discussion began.',
  },
  {
    id: 'NG-KAN-001',
    title: 'The Sabon Gari Handover',
    subtitle: 'A dispatch sheet lists three cartons; the receiving note lists two.',
    mode: 'REGIONAL FILES',
    difficulty: 'Medium',
    minutes: 5,
    points: 180,
    tags: ['Kano', 'Trade', 'Dispatch', 'Inventory'],
    intro: 'A fictional trader is tracing a short delivery between a shop and a receiving point in Kano. Follow the item count through each hand-off rather than guessing who is responsible.',
    evidence: [
      { id: 'E01', type: 'DISPATCH SHEET', time: '14:10', title: 'Outbound count', body: 'The shop records three sealed cartons leaving the counter.' },
      { id: 'E02', type: 'DRIVER CALL NOTE', time: '14:42', title: 'Route delay', body: 'The driver reports a delay and says the vehicle has stopped to check a damaged strap.' },
      { id: 'E03', type: 'RECEIVING NOTE', time: '15:06', title: 'Two cartons received', body: 'The receiving point signs for two cartons and writes “one item outstanding”.' },
      { id: 'E04', type: 'RETURN REGISTER', time: '15:21', title: 'Unmatched return entry', body: 'A return entry exists but has no carton number or receiving signature.' },
    ],
    options: ['The driver stole the missing carton.', 'The receiving point definitely received all three cartons.', 'The records show a one-carton discrepancy, but the return entry does not identify where the third carton went.', 'The route delay proves the carton was damaged.'],
    answer: 2,
    hint: 'Find the last confirmed count, then look for a signed record that closes the gap.',
    explanation: 'Three cartons were recorded out and two were signed in. The return entry lacks identifying details, so the next step is to reconcile the carton number and obtain a verified hand-off record—not assign blame.',
  },
  {
    id: 'NG-ENU-001',
    title: 'The Nsukka Notice',
    subtitle: 'A forwarded screenshot appears to cancel a morning lecture.',
    mode: 'REGIONAL FILES',
    difficulty: 'Easy',
    minutes: 4,
    points: 150,
    tags: ['Enugu', 'Nsukka', 'Campus', 'Messages'],
    intro: 'Students at a fictional Nsukka campus disagree about whether a lecture was cancelled before they travelled in. Compare the forwarded image with the original notice.',
    evidence: [
      { id: 'E01', type: 'FORWARDED SCREENSHOT', time: '08:00 CLAIMED', title: 'Lecture cancelled', body: 'A cropped image says the lecture is cancelled, but it shows no channel name or original timestamp.' },
      { id: 'E02', type: 'CAMPUS PORTAL', time: '10:05', title: 'Official update', body: 'The portal publishes a notice that the lecture is postponed. The entry is timestamped 10:05.' },
      { id: 'E03', type: 'CHAT EXPORT', time: '10:11', title: 'Image forwarded', body: 'The chat export shows the cropped image was forwarded to the group at 10:11.' },
      { id: 'E04', type: 'CLASS REP NOTE', time: '10:14', title: 'No earlier source attached', body: 'The class rep cannot locate the original post or any earlier official cancellation notice.' },
    ],
    options: ['The screenshot proves students were told at 08:00.', 'The lecture was definitely held as scheduled.', 'The available records do not prove an official cancellation was published before 10:05.', 'The class rep created the screenshot.'],
    answer: 2,
    hint: 'The time written in a claim is not the same as a verified publication time.',
    explanation: 'The only verified official update is timestamped 10:05. The forwarded image lacks an original timestamp, so it cannot establish that students were officially notified earlier.',
  },
  {
    id: 'NG-PHC-001',
    title: 'The Port Harcourt Shift',
    subtitle: 'A worker says they arrived before shift change, but the records measure different things.',
    mode: 'REGIONAL FILES',
    difficulty: 'Medium',
    minutes: 5,
    points: 180,
    tags: ['Port Harcourt', 'Rivers State', 'Shift', 'Access log'],
    intro: 'At a fictional Port Harcourt facility, a shift handover is disputed. Distinguish the planned shift time, gate entry and the point where work actually begins.',
    evidence: [
      { id: 'E01', type: 'ROSTER', time: '18:00', title: 'Shift start', body: 'The roster lists the worker’s shift as starting at 18:00.' },
      { id: 'E02', type: 'GATE LOG', time: '18:23', title: 'Facility entry', body: 'The gate reader records the worker entering the facility at 18:23.' },
      { id: 'E03', type: 'HANDOVER SHEET', time: '18:05', title: 'Handover started', body: 'The outgoing team records that the handover started at 18:05.' },
      { id: 'E04', type: 'SUPERVISOR NOTE', time: '18:30', title: 'Workstation check', body: 'The supervisor’s note says the worker’s workstation check was completed at 18:30.' },
    ],
    options: ['The worker was at the workstation at 18:00.', 'The gate log establishes facility entry at 18:23, but does not by itself explain the earlier handover entry.', 'The supervisor falsified the note.', 'The roster proves the worker entered the gate at 18:00.'],
    answer: 1,
    hint: 'A roster is a plan; a gate reader records an entry; a workstation check is another event.',
    explanation: 'The records describe different events. The gate entry is logged at 18:23, while the handover starts earlier. Investigators should check clock synchronization, whether the handover was remote or shared, and who recorded each event.',
  },
  {
    id: 'NG-JOS-001',
    title: 'The Jos Arrival Time',
    subtitle: 'A travel claim conflicts with a timestamped arrival record.',
    mode: 'REGIONAL FILES',
    difficulty: 'Medium',
    minutes: 5,
    points: 180,
    tags: ['Jos', 'Plateau', 'Transport', 'Timeline'],
    intro: 'A fictional witness says they reached a meeting in Jos at 14:45. The travel notes and check-in record tell a more complicated story.',
    evidence: [
      { id: 'E01', type: 'TRAVEL NOTE', time: '14:05', title: 'Departure recorded', body: 'A message sent at 14:05 says the witness is leaving the first location.' },
      { id: 'E02', type: 'ROUTE ALERT', time: '14:20', title: 'Road delay reported', body: 'A public traffic update reports a delay on part of the route. It does not identify the witness’s exact road position.' },
      { id: 'E03', type: 'MEETING REGISTER', time: '15:10', title: 'Arrival signed in', body: 'The meeting register records the witness signing in at 15:10.' },
      { id: 'E04', type: 'PHONE PHOTO', time: '15:12', title: 'Photo taken at venue', body: 'The photo metadata shows 15:12, subject to the phone’s clock settings.' },
    ],
    options: ['The traffic alert proves the witness could not arrive at 14:45.', 'The records prove the witness deliberately lied.', 'The verified register records sign-in at 15:10; check clock settings and any earlier independent arrival record before explaining the difference.', 'The photo proves the witness arrived at 14:45.'],
    answer: 2,
    hint: 'Use the strongest direct timestamp, but remember devices and records can have clock limitations.',
    explanation: 'The meeting register records sign-in at 15:10. The traffic alert is general and the photo clock may need verification; the discrepancy deserves follow-up, not an unsupported conclusion about intent.',
  },
  {
    id: 'NG-BEN-001',
    title: 'The Ring Road Collection',
    subtitle: 'A paid order is marked ready, but the collection record names someone else.',
    mode: 'REGIONAL FILES',
    difficulty: 'Easy',
    minutes: 4,
    points: 150,
    tags: ['Benin City', 'Edo State', 'Shop', 'Receipt'],
    intro: 'A fictional shop near Ring Road is tracing a collection dispute. Determine what payment and stock records do—and do not—prove about who picked up the order.',
    evidence: [
      { id: 'E01', type: 'PAYMENT RECORD', time: '12:01', title: 'Transfer received', body: 'The shop account confirms the correct amount was credited for order B-214.' },
      { id: 'E02', type: 'INVENTORY SYSTEM', time: '12:04', title: 'Order marked ready', body: 'The order status changes to “ready for collection”.' },
      { id: 'E03', type: 'PICKUP REGISTER', time: '12:22', title: 'Collection signature', body: 'The register has a signature and a name that differs from the purchaser’s name. No authorization note is attached.' },
      { id: 'E04', type: 'CUSTOMER MESSAGE', time: '12:40', title: 'Purchaser asks for update', body: 'The purchaser messages the shop asking whether the order is ready, but does not mention collecting it.' },
    ],
    options: ['The purchaser definitely collected the order.', 'The shop never received payment.', 'Payment and readiness are confirmed, but the collection record needs verification and authorization evidence.', 'The different name proves the collector stole the order.'],
    answer: 2,
    hint: 'Payment, preparation and collection are three separate steps.',
    explanation: 'The records confirm payment and that the order was marked ready. The pickup signature differs from the purchaser’s name and lacks authorization, so the next step is to verify the collector and the shop’s hand-off procedure.',
  },
  {
    id: 'NG-NAT-001',
    title: 'The Blackout Window',
    subtitle: 'A CCTV gap is being treated as proof that nobody entered.',
    mode: 'REGIONAL FILES',
    difficulty: 'Medium',
    minutes: 5,
    points: 190,
    tags: ['Nigeria', 'Power', 'Network', 'CCTV', 'Evidence'],
    intro: 'A fictional neighbourhood office is reviewing a gap in its camera footage. Check whether the gap establishes who was or was not present.',
    evidence: [
      { id: 'E01', type: 'CAMERA SYSTEM', time: '19:10', title: 'Last recorded frame', body: 'The camera system’s last saved frame is timestamped 19:10.' },
      { id: 'E02', type: 'FACILITY LOG', time: '19:12', title: 'Power changeover', body: 'The facility log notes a change from mains supply to backup power at 19:12.' },
      { id: 'E03', type: 'ROUTER STATUS', time: '19:30', title: 'Network remains online', body: 'The router reports an active connection, but this does not establish whether the camera recorder had power or storage.' },
      { id: 'E04', type: 'CAMERA SYSTEM', time: '19:46', title: 'Recording resumes', body: 'The next saved frame is timestamped 19:46. No footage is available for the gap.' },
    ],
    options: ['Nobody entered between 19:10 and 19:46.', 'Someone definitely entered during the gap.', 'The footage gap alone cannot establish who entered; check recorder power, storage and independent access records.', 'The router being online proves the cameras were recording.'],
    answer: 2,
    hint: 'Missing footage is a gap in the record, not a recording of what happened.',
    explanation: 'The power changeover and missing footage give investigators a useful lead, but neither proves presence or absence. Check recorder status, backup coverage and independent access records without assuming the gap implies guilt.',
  }
];

const navItems = [
  { label: 'Open World', key: 'world', icon: MapPin },
  { label: 'Dispatch', key: 'home', icon: Zap },
  { label: 'Daily Drop', key: 'daily', icon: Target },
  { label: 'Case Files', key: 'cases', icon: FolderOpen },
  { label: 'Last Move', key: 'strategy', icon: ArrowDownRight },
  { label: 'Streetcraft', key: 'streetcraft', icon: NotebookPen },
  { label: 'Dead Drop', key: 'dead', icon: LockKeyhole },
  { label: 'Campus', key: 'campus', icon: Users },
  { label: 'Archives', key: 'archive', icon: FileSearch },
];

type WorldPlace = { name: string; kind: string; icon: string; description: string; person: string; role: string; line: string };
type WorldRegion = { name: string; code: string; vibe: string; fare: number; places: WorldPlace[] };
const WORLD_REGIONS: WorldRegion[] = [
  { name: 'Lagos', code: 'SW · 01', vibe: 'Fast-moving city routes, campus corners, market stalls and late shifts.', fare: 0, places: [
    { name: 'Yaba Junction', kind: 'hub', icon: '🚏', description: 'A busy interchange where students, workers and riders cross paths.', person: 'Kemi', role: 'Dispatch rider', line: 'People remember the last place they stopped, not always the exact time. Check the hand-off.' },
    { name: 'Akoka Campus', kind: 'campus', icon: '🎓', description: 'Lecture blocks, student groups, noticeboards and hostel errands.', person: 'Seyi', role: 'Campus volunteer', line: 'If a notice matters, find the original post. A forwarded screenshot can lose its timestamp.' },
    { name: 'Balogun Market', kind: 'market', icon: '🧺', description: 'Small shops, handwritten notes, bargaining and payment alerts.', person: 'Ifeoma', role: 'Shop owner', line: 'A debit alert is not the same as a confirmed credit. I check the account before releasing goods.' },
    { name: 'Apapa Dispatch Yard', kind: 'work', icon: '📦', description: 'Loading bays, driver calls, route changes and delivery sheets.', person: 'Musa', role: 'Yard coordinator', line: 'Every transfer needs a time and a receiver. “Sent out” does not mean “received”.' },
    { name: 'Mainland Café', kind: 'cafe', icon: '☕', description: 'A quiet corner to eat, charge your phone and compare notes.', person: 'Tomi', role: 'Café attendant', line: 'The regulars know the neighbourhood, but even a familiar face can misremember a time.' },
    { name: 'The Archive Flat', kind: 'home', icon: '🏠', description: 'Your modest base: rest, organise your leads and plan the next trip.', person: 'Aunty Bisi', role: 'Neighbour', line: 'Rest first. A tired investigator starts connecting things that do not belong together.' },
  ]},
  { name: 'Ibadan & Oyo', code: 'SW · 02', vibe: 'Neighbourhood businesses, campus routines and market-to-market journeys.', fare: 950, places: [
    { name: 'Dugbe Transit Stop', kind: 'hub', icon: '🚏', description: 'A central stop where routes and errands intersect.', person: 'Bode', role: 'Route regular', line: 'Ask which stop, not just which road. People use the same place name for different corners.' },
    { name: 'Bodija Market', kind: 'market', icon: '🧺', description: 'Produce sellers, transfer receipts and a steady flow of customers.', person: 'Morenike', role: 'Trader', line: 'Keep the receipt and confirm the transfer. A cropped screenshot can hide the only important word.' },
    { name: 'UI Campus Walk', kind: 'campus', icon: '🎓', description: 'Lecture schedules, noticeboards and students moving between buildings.', person: 'Dara', role: 'Student researcher', line: 'A class group can repeat a rumour fast. The portal or original notice is the stronger starting point.' },
    { name: 'Mokola Workroom', kind: 'work', icon: '🧰', description: 'A shared workroom for errands, repairs and short paid shifts.', person: 'Kunle', role: 'Workshop lead', line: 'Write down who collected an item. Memory fades; a signed hand-off helps.' },
    { name: 'Neighbourhood Kitchen', kind: 'cafe', icon: '🍲', description: 'Affordable food, water and a pause from the afternoon heat.', person: 'Tola', role: 'Kitchen owner', line: 'A short break is part of a good route plan. Keep enough for the ride back.' },
    { name: 'Oyo Guest Room', kind: 'home', icon: '🛏️', description: 'A safe place to rest before the next leg of the trip.', person: 'Mama Ronke', role: 'Host', line: 'Make a fresh plan after you rest. Do not build a timeline from guesses.' },
  ]},
  { name: 'Abuja & the FCT', code: 'NC · 03', vibe: 'Appointments, office access, formal records and planned journeys between districts.', fare: 1800, places: [
    { name: 'Wuse Transit Circle', kind: 'hub', icon: '🚏', description: 'A district junction where appointment times and routes matter.', person: 'Chidi', role: 'Ride coordinator', line: 'The time someone booked a ride and the time they arrived are two different records.' },
    { name: 'Wuse Civic Office', kind: 'office', icon: '🏢', description: 'Reception desks, appointment slips, visitor logs and meeting rooms.', person: 'Zainab', role: 'Office administrator', line: 'A visitor register proves building entry. It does not prove someone entered a particular room.' },
    { name: 'Garki Print & Copy', kind: 'work', icon: '🖨️', description: 'Documents, version histories and small-business errands.', person: 'Emeka', role: 'Print shop manager', line: 'Check the document version and issue date before comparing signatures or instructions.' },
    { name: 'City Reading Room', kind: 'archive', icon: '🗃️', description: 'A quiet place to review files and arrange your timeline.', person: 'Amina', role: 'Archivist', line: 'Separate the date a letter was written from the date it was received.' },
    { name: 'District Café', kind: 'cafe', icon: '☕', description: 'Recharge, eat and organise the next appointment.', person: 'Lami', role: 'Café attendant', line: 'A little buffer between appointments saves a lot of confusion.' },
    { name: 'FCT Guest Suite', kind: 'home', icon: '🏠', description: 'Your temporary base for rest and planning.', person: 'Mr. Okoro', role: 'Caretaker', line: 'Check tomorrow’s route before sleeping. The plan and the actual journey can differ.' },
  ]},
  { name: 'Kano', code: 'NW · 04', vibe: 'Trading networks, inventory, route hand-offs and records that pass through many hands.', fare: 2200, places: [
    { name: 'Sabon Gari Stop', kind: 'hub', icon: '🚏', description: 'A busy junction for local errands and onward trips.', person: 'Auwal', role: 'Route guide', line: 'A place name is a start. Confirm the exact gate, shop or pickup point.' },
    { name: 'Kurmi Trading Row', kind: 'market', icon: '🧺', description: 'Merchants, item counts, receipts and supplier relationships.', person: 'Fatima', role: 'Merchant', line: 'Count the goods at every hand-off, not only at the final destination.' },
    { name: 'Workshop Lane', kind: 'work', icon: '🧰', description: 'Repairs, inventory tags and small paid jobs.', person: 'Sani', role: 'Workshop technician', line: 'A missing item is a discrepancy to trace, not a reason to accuse the last person in the chain.' },
    { name: 'Trade Records Desk', kind: 'archive', icon: '🗃️', description: 'Invoices, dispatch notes and stock records.', person: 'Hauwa', role: 'Records clerk', line: 'Match item numbers, quantities and signatures. Totals alone can conceal a mismatch.' },
    { name: 'Tea Corner', kind: 'cafe', icon: '🫖', description: 'A short rest and a chance to compare notes.', person: 'Yusuf', role: 'Tea seller', line: 'Take a breather before you decide what the records mean.' },
    { name: 'Guest Courtyard', kind: 'home', icon: '🏠', description: 'A quiet base between field visits.', person: 'Bilkisu', role: 'Host', line: 'Put the receipts in order. Tomorrow’s questions will be clearer.' },
  ]},
  { name: 'Enugu & Nsukka', code: 'SE · 05', vibe: 'Campus notices, town errands, student schedules and community networks.', fare: 1900, places: [
    { name: 'Ogbete Junction', kind: 'hub', icon: '🚏', description: 'A central meeting point for errands and local journeys.', person: 'Chukwudi', role: 'Route regular', line: 'Check the timestamp on the original message, not just when it was forwarded.' },
    { name: 'Nsukka Campus', kind: 'campus', icon: '🎓', description: 'Lecture rooms, student notices and group-chat traffic.', person: 'Adaeze', role: 'Class representative', line: 'If a lecture changes, look for the first official notice and its publication time.' },
    { name: 'Coal Camp Shops', kind: 'market', icon: '🛍️', description: 'Neighbourhood businesses, purchases and collection notes.', person: 'Nneka', role: 'Shopkeeper', line: 'Mark the order ready, mark it collected, and keep those as separate steps.' },
    { name: 'Community Media Desk', kind: 'archive', icon: '📻', description: 'Announcements, notices and source verification.', person: 'Ikenna', role: 'Media assistant', line: 'A repost is not the original source. Trace it back before trusting it.' },
    { name: 'Town Kitchen', kind: 'cafe', icon: '🍲', description: 'Food, water and a pause before the next trip.', person: 'Ngozi', role: 'Kitchen owner', line: 'Plan enough time for the journey back, too.' },
    { name: 'Nsukka Room', kind: 'home', icon: '🛏️', description: 'A modest room for rest and note-taking.', person: 'Mr. Eze', role: 'Caretaker', line: 'Write down what you know, what you suspect and what is still missing.' },
  ]},
  { name: 'Port Harcourt', code: 'SS · 06', vibe: 'Shift schedules, logistics, access points and waterfront work routes.', fare: 2300, places: [
    { name: 'Mile One Junction', kind: 'hub', icon: '🚏', description: 'A route hub connecting work, errands and the waterfront.', person: 'Tamuno', role: 'Route coordinator', line: 'A delay report is useful context, but it cannot tell you someone’s exact location.' },
    { name: 'Trans-Amadi Workshop', kind: 'work', icon: '🧰', description: 'Shift handovers, tool checklists and work orders.', person: 'Ebi', role: 'Workshop supervisor', line: 'Check the clock on each system before comparing timestamps.' },
    { name: 'Waterfront Dispatch', kind: 'work', icon: '📦', description: 'Loading notes, access logs and delivery coordination.', person: 'Precious', role: 'Dispatch clerk', line: 'A gate entry, a handover and a workstation check are three separate events.' },
    { name: 'Rivers Records Room', kind: 'archive', icon: '🗃️', description: 'A quiet room for matching access logs and work orders.', person: 'Ogechi', role: 'Records analyst', line: 'Missing footage creates a question. It does not answer it.' },
    { name: 'Creekside Café', kind: 'cafe', icon: '☕', description: 'A break between field visits.', person: 'Favour', role: 'Café attendant', line: 'Save your energy for the part of the case you can verify.' },
    { name: 'Harbour Guest House', kind: 'home', icon: '🏠', description: 'Rest, prepare and check tomorrow’s shift schedule.', person: 'Boma', role: 'Host', line: 'Keep the plan flexible. A shift change can alter the whole route.' },
  ]},
  { name: 'Jos & Plateau', code: 'NC · 07', vibe: 'Campus schedules, changing weather and multi-leg journeys across town.', fare: 2100, places: [
    { name: 'Terminus Roundabout', kind: 'hub', icon: '🚏', description: 'A town junction where arrival times need careful checking.', person: 'Ladi', role: 'Route regular', line: 'A general road alert does not establish where one traveller was at that minute.' },
    { name: 'Rayfield Work Café', kind: 'cafe', icon: '☕', description: 'A place to plan routes, recharge and review messages.', person: 'Naomi', role: 'Café owner', line: 'Keep your phone charged, but do not treat its clock as infallible.' },
    { name: 'Plateau Campus', kind: 'campus', icon: '🎓', description: 'Student timetables, lecture changes and campus access.', person: 'Peter', role: 'Student mentor', line: 'Use a dated official notice to check when a schedule changed.' },
    { name: 'Route Records Kiosk', kind: 'archive', icon: '🗃️', description: 'Travel notes, arrival registers and route updates.', person: 'Rita', role: 'Records assistant', line: 'Departure, arrival and sign-in are not interchangeable timestamps.' },
    { name: 'Market Lane', kind: 'market', icon: '🧺', description: 'Neighbourhood shops and everyday purchases.', person: 'Danjuma', role: 'Shop owner', line: 'A receipt helps, but confirm the transaction and the goods too.' },
    { name: 'Hillview Room', kind: 'home', icon: '🏠', description: 'A calm place to rest and prepare your next move.', person: 'Mrs. Pam', role: 'Host', line: 'Review the route when you are rested. Fatigue makes estimates worse.' },
  ]},
  { name: 'Benin City', code: 'SS · 08', vibe: 'Campus life, shops, neighbourhood connections and collection records.', fare: 1700, places: [
    { name: 'Ring Road', kind: 'hub', icon: '🚏', description: 'A familiar city junction where pickups and meetups need exact locations.', person: 'Osas', role: 'Route guide', line: 'Confirm the actual pickup point. Two people can mean different corners by the same name.' },
    { name: 'UNIBEN Campus', kind: 'campus', icon: '🎓', description: 'Lecture schedules, hostel errands and class notices.', person: 'Efe', role: 'Student volunteer', line: 'Go back to the original notice before relying on a forwarded message.' },
    { name: 'Shop Row', kind: 'market', icon: '🛍️', description: 'Order slips, transfer confirmations and collection registers.', person: 'Omoregie', role: 'Shop owner', line: 'Payment received, order ready and order collected are different statuses.' },
    { name: 'Edo Records Desk', kind: 'archive', icon: '🗃️', description: 'Receipts, stock notes and signed hand-offs.', person: 'Osayande', role: 'Records clerk', line: 'The signature is a lead. Verify who signed and whether they were authorised.' },
    { name: 'Neighbourhood Café', kind: 'cafe', icon: '🍲', description: 'Food, water and a break before heading back out.', person: 'Ese', role: 'Café attendant', line: 'Keep a little cash for the ride home.' },
    { name: 'Garden Room', kind: 'home', icon: '🏠', description: 'Your home base for sleep and organising clues.', person: 'Aunty Ivie', role: 'Host', line: 'A clean timeline starts with the records, not the conclusion.' },
  ]},
];
const WORLD_DEFAULT = { region: 'Lagos', location: 'Yaba Junction', hour: 8, day: 1, cash: 2500, energy: 82, reputation: 0, inventory: ['Phone', 'Field notebook'], visited: ['Lagos|Yaba Junction'], leads: [], jobs: 0 };

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

function nigeriaFieldLens(c: CaseFile) {
  const context = (c.title + ' ' + c.subtitle + ' ' + c.intro + ' ' + c.tags.join(' ') + ' ' + c.evidence.map((e) => e.title + ' ' + e.body).join(' ')).toLowerCase();
  if (/ibadan|oyo state|bodija|dugbe|challenge|mokola/.test(context)) {
    return { area: 'IBADAN / SOUTHWEST LENS', rhythm: 'Neighbourhood businesses, campus routines, family networks, market runs and trips planned around changing traffic.', checks: 'Confirm which branch, gate, stop or meeting point the witness means; local familiarity does not prove a timeline.' };
  }
  if (/abuja|fct|wuse|garki|utako|minister|agency|official letter/.test(context)) {
    return { area: 'ABUJA / INSTITUTIONS LENS', rhythm: 'Appointments, office access, visitor registers, formal correspondence and people moving between districts.', checks: 'Verify the issuing office, document version, access log and exact appointment window.' };
  }
  if (/kano|kofar|sabongari|kano state|northwest/.test(context)) {
    return { area: 'KANO / TRADE & ROUTE LENS', rhythm: 'Trading networks, hand-offs, market hours and records that may pass through several people.', checks: 'Trace each hand-off separately and confirm the date, unit, amount and person who actually received it.' };
  }
  if (/enugu|nsukka|coal camp|south east/.test(context)) {
    return { area: 'ENUGU / CAMPUS & COMMUNITY LENS', rhythm: 'Student schedules, neighbourhood ties, small businesses and travel between town and campus.', checks: 'Check the original post or notice, who had direct access, and whether the timestamp fits the route.' };
  }
  if (/port harcourt|rivers state|ph city|bonny|oil|terminal|jetty/.test(context)) {
    return { area: 'PORT HARCOURT / SOUTH-SOUTH LENS', rhythm: 'Work shifts, industrial and waterfront movement, dispatch records and location-specific access rules.', checks: 'Distinguish a planned departure from an actual gate entry, hand-off or arrival.' };
  }
  if (/jos|plateau|rayfield|bauchi road|north central/.test(context)) {
    return { area: 'JOS / NORTH-CENTRAL LENS', rhythm: 'Weather and road conditions, community routines, campus schedules and journeys with more than one leg.', checks: 'Use dated independent records to test travel estimates; never turn a regional assumption into evidence.' };
  }
  if (/benin city|edo state|ring road|uniben|south-south/.test(context)) {
    return { area: 'BENIN CITY / EDO LENS', rhythm: 'Campus life, shops, family connections, transport links and messages passed between social circles.', checks: 'Verify the original source, not a forwarded screenshot, and separate what a witness saw from what they heard.' };
  }
  if (/lagos|yaba|akoka|balogun|idumota|oshodi|apapa|lekki|victoria island|mainland/.test(context)) {
    if (/campus|lecture|course|hostel|group chat|class rep|yaba|akoka/.test(context)) return { area: 'LAGOS / YABA & AKOKA LENS', rhythm: 'Campus timetables, hostel reception, class-group messages and people moving between lectures.', checks: 'Verify the original message, room-change notice, timestamp and who had direct access.' };
    if (/market|stall|ledger|receipt|cash|transfer|shop|balogun|idumota/.test(context)) return { area: 'LAGOS / MARKET & MONEY LENS', rhythm: 'Busy trading hours, handwritten records, payment alerts and several people handling one transaction.', checks: 'Separate payment initiated, payment confirmed, goods dispatched and goods received.' };
    if (/parcel|delivery|dispatch|logistics|port|package|tracking|oshodi|apapa/.test(context)) return { area: 'LAGOS / ROUTE & LOGISTICS LENS', rhythm: 'Route changes, loading points, rider calls, traffic delays and tracking statuses that may not tell the whole story.', checks: 'Build a timeline from independent timestamps, call records, hand-off notes and the actual destination.' };
    return { area: 'LAGOS / NEIGHBOURHOOD LENS', rhythm: 'Commutes, neighbourhood businesses, work and family routines, phone records and witnesses who each saw one part.', checks: 'Cross-check accounts against independent records; a familiar location is context, not proof.' };
  }
  if (/market|stall|ledger|receipt|cash|transfer|shop|payment|invoice/.test(context)) {
    return { area: 'NIGERIA / MARKET & MONEY LENS', rhythm: 'Cash and transfers can coexist; a screenshot, debit alert, seller confirmation and delivery are different events.', checks: 'Confirm amount, date, recipient and transaction status from the original record before deciding what happened.' };
  }
  if (/parcel|delivery|dispatch|logistics|port|package|tracking|bus|route|travel|ride/.test(context)) {
    return { area: 'NIGERIA / MOVEMENT & HAND-OFF LENS', rhythm: 'Traffic, transfers between vehicles, dispatch calls and missed connections can complicate a simple timeline.', checks: 'Record each departure, hand-off and arrival separately; a tracking status is not the same as proof of receipt.' };
  }
  if (/campus|lecture|course|hostel|group chat|class rep|student|school/.test(context)) {
    return { area: 'NIGERIA / CAMPUS & COMPOUND LENS', rhythm: 'Timetables, room changes, hostel desks, class groups and word-of-mouth can create conflicting versions of the same event.', checks: 'Return to the original notice or message, check timestamps and separate first-hand observation from hearsay.' };
  }
  if (/night|security|ride|shift|power|electricity|generator|network|data|cctv/.test(context)) {
    return { area: 'NIGERIA / EVERYDAY INFRASTRUCTURE LENS', rhythm: 'Power cuts, weak signal, device battery, shift changes and transport availability can affect which records exist.', checks: 'Treat missing footage or delayed messages as an unanswered question—not automatic proof of guilt or innocence.' };
  }
  return { area: 'NIGERIA / EVERYDAY SYSTEMS LENS', rhythm: 'Work, family, transport, campus, payments, phone access and community routines all shape what a witness could realistically know.', checks: 'Build a dated timeline, check the original source, and keep facts, assumptions and open questions separate.' };
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
  const [page, setPage] = useState('world');
  const [activeCase, setActiveCase] = useState<CaseFile>(cases[0]);
  const [selectedInvestigator, setSelectedInvestigator] = useState<string | null>(null);
  const [progress, setProgress] = useState(readProgress);
  const worldState = { ...WORLD_DEFAULT, ...(progress.world || {}) } as typeof WORLD_DEFAULT;
  const [avatarPosition, setAvatarPosition] = useState({ x: 50, y: 70 });
  const [avatarFacing, setAvatarFacing] = useState('front');
  const [worldMoveCount, setWorldMoveCount] = useState(0);
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
  useEffect(() => {
    if (page !== 'world') return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((event.target as HTMLElement)?.tagName || '')) return;
      const key = event.key.toLowerCase();
      const directions: Record<string, { x: number; y: number; facing: string }> = {
        arrowup: { x: 0, y: -3, facing: 'back' }, w: { x: 0, y: -3, facing: 'back' },
        arrowdown: { x: 0, y: 3, facing: 'front' }, s: { x: 0, y: 3, facing: 'front' },
        arrowleft: { x: -3, y: 0, facing: 'left' }, a: { x: -3, y: 0, facing: 'left' },
        arrowright: { x: 3, y: 0, facing: 'right' }, d: { x: 3, y: 0, facing: 'right' },
      };
      const direction = directions[key];
      if (!direction) return;
      event.preventDefault();
      setAvatarFacing(direction.facing);
      setAvatarPosition(position => ({ x: Math.max(7, Math.min(93, position.x + direction.x)), y: Math.max(20, Math.min(86, position.y + direction.y)) }));
      setWorldMoveCount(count => count + 1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [page]);

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


  function updateWorld(patch: Record<string, any>, message?: string) {
    setProgress((p: any) => ({ ...p, world: { ...WORLD_DEFAULT, ...(p.world || {}), ...patch } }));
    if (message) setToast(message);
  }
  function walkAvatar(dx: number, dy: number) {
    setAvatarFacing(dy < 0 ? 'back' : dy > 0 ? 'front' : dx < 0 ? 'left' : 'right');
    setAvatarPosition(position => ({ x: Math.max(7, Math.min(93, position.x + dx)), y: Math.max(20, Math.min(86, position.y + dy)) }));
    setWorldMoveCount(count => count + 1);
  }
  function interactWithStreet() {
    const props = [
      { name: 'provision store', x: 24, y: 43, lead: 'A shopkeeper says the handwritten delivery ledger is kept behind the counter.' },
      { name: 'Danfo stop', x: 67, y: 65, lead: 'A Danfo conductor remembers a route change but asks you to verify the time against the dispatch record.' },
      { name: 'suya stand', x: 78, y: 41, lead: 'The suya seller recalls a busy handover near closing time; the exact minute still needs confirmation.' },
      { name: 'community noticeboard', x: 43, y: 30, lead: 'A noticeboard has an old schedule beside a newer handwritten update. Check the original issue date.' },
    ];
    const nearest = props.map(prop => ({ ...prop, distance: Math.hypot(avatarPosition.x - prop.x, avatarPosition.y - prop.y) })).sort((a, b) => a.distance - b.distance)[0];
    if (!nearest || nearest.distance > 17) {
      setToast('Move closer to the provision store, Danfo stop, suya stand or noticeboard to inspect it.');
      return;
    }
    const leads: string[] = Array.isArray(worldState.leads) ? worldState.leads : [];
    const key = worldState.region + ' · Street encounter · ' + nearest.name;
    if (leads.includes(key)) { setToast('You already recorded this street lead. Check your notebook.'); return; }
    updateWorld({ leads: [...leads, key], reputation: worldState.reputation + 1, hour: (worldState.hour + 1) % 24, day: worldState.day + (worldState.hour === 23 ? 1 : 0) }, 'Street lead added: ' + nearest.name + '. ' + nearest.lead);
  }

  function lagosLifeAction(action: 'akara' | 'water' | 'danfo' | 'noticeboard') {
    const hourAdvance = (hours: number) => ({
      hour: (worldState.hour + hours) % 24,
      day: worldState.day + (worldState.hour + hours >= 24 ? 1 : 0),
    });
    if (action === 'akara') {
      if (worldState.cash < 250) { setToast('Akara and pepper cost ₦250 here. Pick up a shift if your pocket is empty.'); return; }
      updateWorld({ cash: worldState.cash - 250, energy: Math.min(100, worldState.energy + 10), ...hourAdvance(0) }, 'You buy hot akara and pepper from the roadside seller. Pocket cash -₦250; energy +10.');
      return;
    }
    if (action === 'water') {
      if (worldState.cash < 100) { setToast('A sachet of water costs ₦100 in this neighbourhood.'); return; }
      updateWorld({ cash: worldState.cash - 100, energy: Math.min(100, worldState.energy + 5) }, 'You buy cold sachet water from the street hawker. Pocket cash -₦100; energy +5.');
      return;
    }
    if (action === 'danfo') {
      if (worldState.cash < 300) { setToast('You need ₦300 for this short danfo ride. Take a shift or walk instead.'); return; }
      updateWorld({ cash: worldState.cash - 300, energy: Math.max(0, worldState.energy - 3), ...hourAdvance(1) }, 'You squeeze into a yellow danfo. The conductor calls the next stop; the ride costs ₦300 and one hour passes in traffic.');
      setAvatarPosition({ x: 67, y: 75 });
      return;
    }
    const leads: string[] = Array.isArray(worldState.leads) ? worldState.leads : [];
    const lead = worldState.region + ' · Street noticeboard · Community update';
    if (leads.includes(lead)) { setToast('You already copied the community notice into your field notebook.'); return; }
    updateWorld({ leads: [...leads, lead], reputation: worldState.reputation + 1, ...hourAdvance(0) }, 'You check the faded noticeboard: a power-outage update, a lost-key notice and a handwritten dispatch advert. A useful lead goes into your notebook.');
  }

  function travelToPlace(place: WorldPlace) {
    if (place.name === worldState.location) return;
    const visited = Array.isArray(worldState.visited) ? worldState.visited : [];
    const key = worldState.region + '|' + place.name;
    updateWorld({
      location: place.name,
      hour: (worldState.hour + 1) % 24,
      day: worldState.day + (worldState.hour === 23 ? 1 : 0),
      energy: Math.max(0, worldState.energy - 7),
      visited: visited.includes(key) ? visited : [...visited, key],
    }, 'Arrived at ' + place.name + '. One hour passed; energy -7.');
  }
  function travelToRegion(regionName: string) {
    if (regionName === worldState.region) return;
    const destination = WORLD_REGIONS.find(r => r.name === regionName);
    if (!destination) return;
    if (worldState.cash < destination.fare) {
      setToast('Not enough cash for this trip. Take a paid shift or visit a work spot.');
      return;
    }
    const start = WORLD_REGIONS.find(r => r.name === worldState.region);
    const arrival = destination.places[0];
    const fare = destination.name === 'Lagos' ? (start?.fare || 0) : (start?.name === 'Lagos' ? destination.fare : destination.fare + (start?.fare || 0));
    if (worldState.cash < fare) {
      setToast('This trip costs ₦' + fare.toLocaleString() + '. Take a paid shift or choose a closer stop first.');
      return;
    }
    updateWorld({
      region: destination.name,
      location: arrival.name,
      cash: worldState.cash - fare,
      hour: (worldState.hour + 3) % 24,
      day: worldState.day + (worldState.hour + 3 >= 24 ? 1 : 0),
      energy: Math.max(0, worldState.energy - 18),
      visited: [...(worldState.visited || []), destination.name + '|' + arrival.name],
    }, 'Travelled from ' + (start?.name || 'your last stop') + ' to ' + destination.name + '. Fare: ₦' + fare.toLocaleString() + '.');
  }
  function worldAction(action: 'talk' | 'work' | 'eat' | 'rest' | 'investigate') {
    const place = WORLD_REGIONS.find(r => r.name === worldState.region)?.places.find(p => p.name === worldState.location);
    if (!place) return;
    const leads: string[] = Array.isArray(worldState.leads) ? worldState.leads : [];
    const leadKey = worldState.region + ' · ' + place.name + ' · ' + place.person;
    if (action === 'talk') {
      if (leads.includes(leadKey)) {
        setToast(place.person + ' has already shared their lead. Check your field notebook.');
        return;
      }
      updateWorld({ leads: [...leads, leadKey], reputation: worldState.reputation + 1, hour: (worldState.hour + 1) % 24, day: worldState.day + (worldState.hour === 23 ? 1 : 0) }, 'Conversation logged with ' + place.person + '. New lead added to your notebook.');
      return;
    }
    if (action === 'work') {
      if (worldState.energy < 18) { setToast('You are too tired for a shift. Rest or grab a meal first.'); return; }
      const earned = place.kind === 'work' ? 1300 : 850;
      updateWorld({ cash: worldState.cash + earned, energy: Math.max(0, worldState.energy - 18), hour: (worldState.hour + 2) % 24, day: worldState.day + (worldState.hour + 2 >= 24 ? 1 : 0), jobs: worldState.jobs + 1, reputation: worldState.reputation + 1 }, 'Shift complete. Earned ₦' + earned.toLocaleString() + '. Energy -18.');
      return;
    }
    if (action === 'eat') {
      if (worldState.cash < 350) { setToast('You need ₦350 for a meal. Find a paid shift first.'); return; }
      updateWorld({ cash: worldState.cash - 350, energy: Math.min(100, worldState.energy + 22), hour: (worldState.hour + 1) % 24, day: worldState.day + (worldState.hour === 23 ? 1 : 0) }, 'Meal bought for ₦350. Energy +22.');
      return;
    }
    if (action === 'rest') {
      updateWorld({ energy: Math.min(100, worldState.energy + 42), hour: (worldState.hour + 6) % 24, day: worldState.day + (worldState.hour + 6 >= 24 ? 1 : 0) }, 'You rested. Energy restored; six hours passed.');
      return;
    }
    if (action === 'investigate') {
      if (worldState.energy < 8) { setToast('You need at least 8 energy to investigate. Rest first.'); return; }
      const lead = 'Field observation · ' + worldState.region + ' · ' + place.name;
      if (leads.includes(lead)) { setToast('You have already recorded this observation. Visit another location for a fresh lead.'); return; }
      updateWorld({ leads: [...leads, lead], energy: Math.max(0, worldState.energy - 8), hour: (worldState.hour + 1) % 24, day: worldState.day + (worldState.hour === 23 ? 1 : 0), reputation: worldState.reputation + 1 }, 'Observation recorded in your field notebook. Energy -8.');
    }
  }

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
        onClick={() => go('world')}
        aria-label="AFTERHOURS enter open world"
      >
        <span className="brand-mark">
          <Fingerprint size={21} />
        </span>
        <span className="brand-word">
          AFTER<span>HOURS</span>
          <small>ENTER THE WORLD</small>
        </span>
      </button>
      <div className="side-label">
        WORLD ACCESS <span>01—09</span>
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
      <section className="lagos-world nigeria-world" aria-label="Nigeria regional world and everyday-life field intelligence">
        <div className="lagos-world-heading">
          <div>
            <div className="eyebrow"><span className="city-live-dot" /> NATIONAL FIELD NETWORK / NIGERIA</div>
            <h2>One country. Many ways a story travels.</h2>
            <p>AFTERHOURS follows everyday life across different Nigerian settings—from campus corridors and neighbourhood shops to offices, markets, transit routes and night shifts. Place shapes the questions; evidence still decides the answer.</p>
          </div>
          <span className="lagos-world-stamp">FIELD<br />GUIDE 02</span>
        </div>
        <div className="lagos-life-strip" aria-label="Everyday systems that can shape a case">
          <span><b>01</b> MOVEMENT & ROUTES</span>
          <span><b>02</b> CASH & TRANSFERS</span>
          <span><b>03</b> POWER & NETWORK</span>
          <span><b>04</b> WORK, CAMPUS & FAMILY</span>
        </div>
        <div className="lagos-district-grid nigeria-region-grid">
          <button className="lagos-district" onClick={() => { setSearch('Lagos'); go('cases'); }}>
            <span className="district-index">SOUTHWEST / 01</span><strong>Lagos</strong>
            <span>Yaba and Akoka campuses, Balogun and Idumota trading, Oshodi and Apapa routes, Mainland routines and Island night shifts.</span>
            <i>Explore Lagos leads <ArrowUpRight size={14} /></i>
          </button>
          <button className="lagos-district" onClick={() => { setSearch('Ibadan'); go('cases'); }}>
            <span className="district-index">SOUTHWEST / 02</span><strong>Ibadan & Oyo</strong>
            <span>Campus life, neighbourhood businesses, market runs, family networks and trips shaped by local routes and timing.</span>
            <i>Explore Southwest leads <ArrowUpRight size={14} /></i>
          </button>
          <button className="lagos-district" onClick={() => { setSearch('Abuja'); go('cases'); }}>
            <span className="district-index">NORTH-CENTRAL / 03</span><strong>Abuja & the FCT</strong>
            <span>Appointments, office access, visitor records, formal correspondence and people moving between districts.</span>
            <i>Explore FCT leads <ArrowUpRight size={14} /></i>
          </button>
          <button className="lagos-district" onClick={() => { setSearch('Kano'); go('cases'); }}>
            <span className="district-index">NORTHWEST / 04</span><strong>Kano</strong>
            <span>Trade, market hours, multiple hand-offs and the details that matter when a transaction passes through many hands.</span>
            <i>Explore trade leads <ArrowUpRight size={14} /></i>
          </button>
          <button className="lagos-district" onClick={() => { setSearch('Enugu'); go('cases'); }}>
            <span className="district-index">SOUTHEAST / 05</span><strong>Enugu & Nsukka</strong>
            <span>Student schedules, community ties, small businesses and journeys between campus and town.</span>
            <i>Explore campus leads <ArrowUpRight size={14} /></i>
          </button>
          <button className="lagos-district" onClick={() => { setSearch('Port Harcourt'); go('cases'); }}>
            <span className="district-index">SOUTH-SOUTH / 06</span><strong>Port Harcourt</strong>
            <span>Shift schedules, logistics, access rules, work records and waterfront or industrial movement.</span>
            <i>Explore logistics leads <ArrowUpRight size={14} /></i>
          </button>
          <button className="lagos-district" onClick={() => { setSearch('Jos'); go('cases'); }}>
            <span className="district-index">NORTH-CENTRAL / 07</span><strong>Jos & Plateau</strong>
            <span>Weather, road conditions, campus routines and multi-leg journeys where estimates need checking.</span>
            <i>Explore route leads <ArrowUpRight size={14} /></i>
          </button>
          <button className="lagos-district" onClick={() => { setSearch('Benin City'); go('cases'); }}>
            <span className="district-index">SOUTH-SOUTH / 08</span><strong>Benin City</strong>
            <span>Campus life, shops, family connections, transport links and messages moving between social circles.</span>
            <i>Explore community leads <ArrowUpRight size={14} /></i>
          </button>
        </div>
        <div className="nigeria-systems">
          <div className="nigeria-systems-heading">
            <div className="eyebrow">FIELD CONDITIONS / REAL-LIFE CONTEXT</div>
            <h3>Everyday details can change the timeline.</h3>
          </div>
          <div className="nigeria-systems-grid">
            <div><span className="system-mark">↗</span><strong>Transport & timing</strong><p>Traffic, transfers, waiting time and route changes can test an alibi. Check each leg separately.</p></div>
            <div><span className="system-mark">₦</span><strong>Payments & paper trails</strong><p>A screenshot, debit alert, recipient confirmation and goods received are not the same thing.</p></div>
            <div><span className="system-mark">ϟ</span><strong>Power, devices & data</strong><p>Outages, low battery and weak signal may explain missing records—but never prove a story by themselves.</p></div>
            <div><span className="system-mark">◎</span><strong>People & obligations</strong><p>Work shifts, campus schedules, family duties and community ties shape who could be where and when.</p></div>
          </div>
        </div>
        <div className="lagos-world-foot">
          <span><span className="city-live-dot" /> LOCAL CONTEXT IS A LEAD, NOT PROOF</span>
          <span>Regional identity • Everyday pressures • Independent verification • No stereotypes</span>
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
      <section className="lagos-field-lens" aria-label="Nigerian everyday-life field context">
        <div className="field-lens-icon"><Fingerprint size={18} /></div>
        <div className="field-lens-copy">
          <div className="eyebrow">NIGERIA FIELD LENS / CONTEXT, NOT CONCLUSION</div>
          <h3>{nigeriaFieldLens(activeCase).area}</h3>
          <p>{nigeriaFieldLens(activeCase).rhythm}</p>
          <div><strong>What to verify:</strong> {nigeriaFieldLens(activeCase).checks}</div>
        </div>
        <span className="field-lens-stamp">ON<br />GROUND</span>
      </section>
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


  const currentWorldRegion = WORLD_REGIONS.find(r => r.name === worldState.region) || WORLD_REGIONS[0];
  const currentWorldPlace = currentWorldRegion.places.find(p => p.name === worldState.location) || currentWorldRegion.places[0];
  const worldPage = (
    <>
      {header('The streets are yours to explore.', 'OPEN WORLD / NIGERIA', 'You enter the world first. Walk the neighbourhood, meet people, follow leads, earn a living and travel across Nigeria. Your progress saves in this browser.')}
      <section className="world-dashboard">
        <div className="world-status-row">
          <div className="world-stat world-stat-location"><span>YOU ARE IN</span><strong>{worldState.region}</strong><small>{worldState.location}</small></div>
          <div className="world-stat"><span>LOCAL TIME</span><strong>{String(worldState.hour).padStart(2,'0')}:00</strong><small>Day {worldState.day}</small></div>
          <div className="world-stat"><span>POCKET CASH</span><strong>₦{worldState.cash.toLocaleString()}</strong><small>Local spending</small></div>
          <div className="world-stat"><span>ENERGY</span><strong>{worldState.energy}%</strong><div className="world-energy-track"><i style={{width: worldState.energy + '%'}} /></div></div>
          <div className="world-stat"><span>REPUTATION</span><strong>{worldState.reputation}</strong><small>People you have helped</small></div>
        </div>
        <div className="world-layout">
          <section className="world-explore-panel">
            <div className="world-panel-heading">
              <div><div className="eyebrow"><span className="city-live-dot" /> LIVE FIELD MAP / FICTIONAL CITY</div><h2>{currentWorldRegion.name}</h2><p>{currentWorldRegion.vibe}</p></div>
              <span className="world-weather">☁ 27° <small>{worldState.hour < 12 ? 'Morning routes' : worldState.hour < 17 ? 'Afternoon heat' : worldState.hour < 21 ? 'Evening rush' : 'Night shift'}</small></span>
            </div>
            <section className="world-street-scene" aria-label="Playable Nigerian street scene">
              <div className="world-scene-topline"><span><i /> STREET VIEW / {currentWorldRegion.name.toUpperCase()}</span><span>GOLDEN HOUR · LOCAL LIFE</span></div>
              <div className="world-scene-stage" role="application" aria-label="Use W A S D or arrow keys to walk around the street">
                <div className="scene-sky"><span className="scene-sun" /><span className="scene-cloud scene-cloud-one" /><span className="scene-cloud scene-cloud-two" /></div>
                <div className="scene-horizon-buildings"><i /><i /><i /><i /><i /><i /></div>
                <div className="scene-power-wire scene-wire-one" /><div className="scene-power-wire scene-wire-two" />
                <div className="scene-power-pole scene-pole-one"><i /><b /><em /></div><div className="scene-power-pole scene-pole-two"><i /><b /><em /></div>
                <button className="scene-prop scene-shop" style={{left:'24%',top:'43%'}} onClick={() => setAvatarPosition({x:24,y:53})} aria-label="Walk to provision store"><span className="scene-shop-roof" /><span className="scene-shop-front"><b>PROVISIONS</b><small>cold malt · snacks</small></span><span className="scene-shop-crates">▦ ▦</span><em>SHOP</em></button>
                <button className="scene-prop scene-danfo" style={{left:'67%',top:'65%'}} onClick={() => setAvatarPosition({x:67,y:75})} aria-label="Walk to Danfo stop"><span className="scene-danfo-body"><b>DANFO</b><i /><i /><small>LAGOS ROUTE</small></span><span className="scene-wheel wheel-one" /><span className="scene-wheel wheel-two" /><em>BUS STOP</em></button>
                <button className="scene-prop scene-suya" style={{left:'78%',top:'41%'}} onClick={() => setAvatarPosition({x:78,y:51})} aria-label="Walk to suya stand"><span className="scene-suya-roof" /><span className="scene-grill"><i /><i /><i /><b>♨</b></span><span className="scene-suya-counter">SUYA · ₦</span><em>SUYA STAND</em></button>
                <button className="scene-prop scene-board" style={{left:'43%',top:'30%'}} onClick={() => setAvatarPosition({x:43,y:40})} aria-label="Walk to community noticeboard"><span>COMMUNITY<br />NOTICEBOARD</span><small>ROUTES · NOTICES</small><em>NOTICEBOARD</em></button>
                <div className="scene-road"><span className="scene-road-markings" /><span className="scene-road-edge" /></div>
                <div className="scene-market-bag bag-one">GH</div><div className="scene-market-bag bag-two">GH</div>
                <div className="scene-ankara-stack"><i /><i /><i /></div>
                <div className={'scene-player scene-player-' + avatarFacing} style={{left: avatarPosition.x + '%', top: avatarPosition.y + '%'}} aria-label="Your player character"><span className="scene-player-shadow" /><span className="scene-player-head" /><span className="scene-player-body"><i /><b /></span><span className="scene-player-legs"><i /><b /></span><small>YOU</small></div>
                <div className="scene-location-tag"><span className="city-live-dot" /> {worldState.location}</div>
                <div className="scene-weather-tag">☀ 27° · {worldState.hour < 12 ? 'MORNING' : worldState.hour < 17 ? 'AFTERNOON' : worldState.hour < 21 ? 'GOLDEN HOUR' : 'NIGHT MARKET'}</div>
                <div className="scene-instruction">WASD / ARROWS TO WALK · MOVE CLOSE TO A PROP, THEN INTERACT</div>
              </div>
              <div className="world-scene-controls">
                <div className="scene-dpad" aria-label="Movement controls">
                  <button onClick={() => walkAvatar(0,-4)} aria-label="Walk north">↑</button>
                  <button onClick={() => walkAvatar(-4,0)} aria-label="Walk west">←</button>
                  <button onClick={() => walkAvatar(0,4)} aria-label="Walk south">↓</button>
                  <button onClick={() => walkAvatar(4,0)} aria-label="Walk east">→</button>
                </div>
                <p><strong>Free movement enabled</strong><span>Tap the street props to walk near them, or use your keyboard.</span></p>
                <button className="scene-interact-button" onClick={interactWithStreet}><Fingerprint size={15} /> Interact nearby <ArrowRight size={15} /></button>
              </div>
            </section>
            <section className="lagos-life-panel" aria-label="Everyday Lagos life">
              <div className="lagos-life-heading">
                <div><div className="eyebrow">CITY RHYTHM / EVERYDAY LIFE</div><h3>Life doesn't pause for a case.</h3><p>{worldState.hour < 6 ? 'The streets are quiet; a few food sellers and night workers are still moving.' : worldState.hour < 10 ? 'Morning rush: conductors are calling destinations, shops are opening and students are hurrying out.' : worldState.hour < 16 ? 'Midday heat: market errands, dispatch runs and roadside lunch breaks keep the neighbourhood moving.' : worldState.hour < 20 ? 'Evening rush: traffic thickens, generators start up and food stands get busy.' : 'After dark: kiosks glow, buses thin out and conversations move closer to the street lights.'}</p></div>
                <span className="lagos-life-weather">{worldState.hour >= 18 || worldState.hour < 6 ? '◒ NIGHT LIGHTS' : '☀ HOT & HUMID'}<small>{worldState.hour >= 16 && worldState.hour < 20 ? 'RUSH-HOUR TRAFFIC' : worldState.hour >= 20 || worldState.hour < 6 ? 'LOWER STREET ACTIVITY' : 'BUSY ROADS'}</small></span>
              </div>
              <div className="lagos-life-grid">
                <article className="lagos-life-card"><span className="lagos-life-icon">🛺</span><div><strong>Danfo stop</strong><p>Short neighbourhood ride · ₦300 · traffic may eat your time.</p></div><button onClick={() => lagosLifeAction('danfo')}>Ride <ArrowRight size={13}/></button></article>
                <article className="lagos-life-card"><span className="lagos-life-icon">🍘</span><div><strong>Akara & pepper</strong><p>Roadside breakfast · ₦250 · restore 10 energy.</p></div><button onClick={() => lagosLifeAction('akara')}>Buy <ArrowRight size={13}/></button></article>
                <article className="lagos-life-card"><span className="lagos-life-icon">💧</span><div><strong>Sachet water</strong><p>Cold water from a street hawker · ₦100 · restore 5 energy.</p></div><button onClick={() => lagosLifeAction('water')}>Buy <ArrowRight size={13}/></button></article>
                <article className="lagos-life-card"><span className="lagos-life-icon">📌</span><div><strong>Community noticeboard</strong><p>Local adverts, outage notes and lost-item notices may hide a lead.</p></div><button onClick={() => lagosLifeAction('noticeboard')}>Inspect <ArrowRight size={13}/></button></article>
              </div>
              <div className="lagos-life-footnote"><span>●</span> STREET LIFE SIMULATION · Prices and events are fictional game mechanics, not live Lagos transport or market data.</div>
            </section>
            <div className="world-map" aria-label={'Interactive map of ' + currentWorldRegion.name}>
              <div className="world-map-grid" />
              <div className="world-road world-road-one" /><div className="world-road world-road-two" /><div className="world-road world-road-three" />
              <div className="world-map-river" />
              {currentWorldRegion.places.map((place, i) => {
                const coords = [{left:'18%',top:'24%'},{left:'73%',top:'22%'},{left:'25%',top:'69%'},{left:'76%',top:'70%'},{left:'50%',top:'43%'},{left:'49%',top:'82%'}][i];
                const here = place.name === worldState.location;
                const visited = (worldState.visited || []).includes(worldState.region + '|' + place.name);
                return <button key={place.name} className={'world-place-node world-place-' + place.kind + (here ? ' world-place-here' : '') + (visited ? ' world-place-visited' : '')} style={coords} onClick={() => travelToPlace(place)} aria-label={'Travel to ' + place.name}>
                  <span className="world-place-icon">{place.icon}</span><strong>{place.name}</strong>{here && <em>YOU ARE HERE</em>}{!here && <small>WALK · 1 HR</small>}
                </button>;
              })}
              <div className="world-map-compass">N<br /><span>↑</span></div>
              <div className="world-map-scale">FIELD MAP / NOT TO SCALE</div>
            </div>
            <div className="world-map-legend"><span><i className="legend-current" /> Current location</span><span><i className="legend-visited" /> Visited</span><span><i className="legend-unseen" /> Not visited</span></div>
            <div className="world-region-selector">
              <div className="eyebrow">TRAVEL BETWEEN REGIONS / PAY FARE</div>
              <div className="world-region-grid">
                {WORLD_REGIONS.map(region => <button key={region.name} className={'world-region-chip' + (region.name === worldState.region ? ' active' : '')} onClick={() => travelToRegion(region.name)} disabled={region.name === worldState.region}>
                  <span>{region.name}</span><small>{region.fare === 0 ? 'Starting city' : '₦' + region.fare.toLocaleString()}</small>
                </button>)}
              </div>
            </div>
          </section>
          <aside className="world-side-column">
            <section className="world-character-card">
              <div className="eyebrow">NEIGHBOURHOOD ENCOUNTER / {currentWorldPlace.kind.toUpperCase()}</div>
              <div className="world-character-art"><span className="world-character-halo" /><span className="world-character-avatar">{currentWorldPlace.person.split(/\s+/).map((x: string) => x[0]).slice(0,2).join('').toUpperCase()}</span><div><strong>{currentWorldPlace.person}</strong><small>{currentWorldPlace.role}</small></div></div>
              <h3>{currentWorldPlace.name}</h3><p>{currentWorldPlace.description}</p>
              <div className="world-dialogue"><span>“</span><p>{currentWorldPlace.line}</p></div>
              <button className="world-primary-action" onClick={() => worldAction('talk')}><Users size={15} /> Talk to {currentWorldPlace.person}<ArrowRight size={15} /></button>
              <button className="world-secondary-action" onClick={() => worldAction('investigate')}><Search size={15} /> Investigate this place <span>−8 energy</span></button>
              <button className="world-secondary-action" onClick={() => { const term = currentWorldRegion.name === 'Ibadan & Oyo' ? 'Ibadan' : currentWorldRegion.name === 'Abuja & the FCT' ? 'Abuja' : currentWorldRegion.name === 'Enugu & Nsukka' ? 'Enugu' : currentWorldRegion.name === 'Jos & Plateau' ? 'Jos' : currentWorldRegion.name === 'Lagos' ? '' : currentWorldRegion.name; setSearch(term); setFilter('All cases'); go('cases'); }}><FolderOpen size={15} /> Browse regional case files <ArrowUpRight size={14} /></button>
            </section>
            <section className="world-activity-card">
              <div className="eyebrow">EVERYDAY LIFE / ACTIONS</div><h3>What do you do next?</h3>
              <button className="world-activity-row" onClick={() => worldAction('work')}><span className="world-activity-icon">₦</span><span><strong>Pick up a shift</strong><small>Earn ₦850–₦1,300 · 2 hours</small></span><ArrowUpRight size={15} /></button>
              <button className="world-activity-row" onClick={() => worldAction('eat')}><span className="world-activity-icon">🍲</span><span><strong>Buy a meal</strong><small>₦350 · restore 22 energy</small></span><ArrowUpRight size={15} /></button>
              <button className="world-activity-row" onClick={() => worldAction('rest')}><span className="world-activity-icon">🛏️</span><span><strong>Take a proper rest</strong><small>6 hours · restore 42 energy</small></span><ArrowUpRight size={15} /></button>
            </section>
            <section className="world-inventory-card"><div className="eyebrow">POCKET INVENTORY</div><div className="world-inventory-items">{(worldState.inventory || []).map((item: string) => <span key={item}>▣ {item}</span>)}<span>✦ {worldState.leads.length} field leads</span></div><small>Visited places: {worldState.visited.length} · Shifts completed: {worldState.jobs}</small></section>
          </aside>
        </div>
        <section className="world-notebook">
          <div className="world-panel-heading"><div><div className="eyebrow">YOUR FIELD NOTEBOOK / SAVED LOCALLY</div><h2>Leads you have picked up</h2></div><span className="world-notebook-count">{worldState.leads.length.toString().padStart(2,'0')} ENTRIES</span></div>
          {worldState.leads.length ? <div className="world-lead-list">{worldState.leads.map((lead: string, i: number) => <div key={lead} className="world-lead-row"><span>{String(i+1).padStart(2,'0')}</span><p>{lead}</p><Check size={15} /></div>)}</div> : <div className="world-empty-notebook"><NotebookPen size={22} /><div><strong>Your notebook is blank.</strong><p>Talk to someone or investigate a place to collect your first lead. Repeated interactions will not duplicate the same lead.</p></div></div>}
        </section>
        <div className="world-footnote"><ShieldCheck size={14} /> WORLD STATE SAVES ON THIS DEVICE · FICTIONAL LOCATIONS & CHARACTERS · NO LIVE MULTIPLAYER YET</div>
      </section>
    </>
  );

  const pageMap: Record<string, any> = {
    home: homePage,
    world: worldPage,
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
            <span className="topline-dot" /> NIGERIA FIELD NETWORK <span className="topline-sep">·</span> FICTIONAL CASEWORK
          </span>
          <span>
            NIGERIA <span className="topline-sep">·</span> MANY REGIONS · ONE EVIDENCE STANDARD
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
