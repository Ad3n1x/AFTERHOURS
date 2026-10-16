// Original AFTERHOURS mystery data retained from the pre-life-sim investigation build.

// All cases in this file are fictional scenarios, not reports of real people or incidents.

type Evidence = {
  id: string;
  type: string;
  time?: string;
  title: string;
  body: string;
};

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
  setting?: string;
  sourceNote?: string;
  leadOptions?: string[];
  bestLead?: number;
};

const originalCases: CaseFile[] = [
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

const additionalCases: CaseFile[] = [
  {
    id: 'CF-US-071',
    title: 'The Library Return Slip',
    subtitle: 'A shelf is empty, but the record keeps moving.',
    mode: 'CASEFILE',
    difficulty: 'Easy',
    minutes: 4,
    points: 135,
    tags: ['Library', 'Chain of custody', 'Records'],
    intro: 'At a fictional county library in the United States, a returned book is missing from its assigned shelf. The task is to reconcile the hand-off records without turning a location mismatch into an accusation.',
    evidence: [
      { id: 'E01', type: 'RETURN KIOSK', time: '16:04', title: 'Return receipt', body: 'The kiosk accepted the book and assigned it to shelf bin B-3.' },
      { id: 'E02', type: 'SHELF AUDIT', time: '16:10', title: 'Bin B-3 check', body: 'The shelf bin was empty when the evening audit was completed.' },
      { id: 'E03', type: 'STAFF CART SCAN', time: '16:12', title: 'Holds cart intake', body: 'The same barcode was scanned into the staff holds cart.' },
      { id: 'E04', type: 'DESK NOTE', time: '16:14', title: 'Service desk note', body: 'No borrower reported a problem with the return kiosk.' }
    ],
    options: [
      'The borrower kept the book because the shelf bin was empty.',
      'A later staff-cart scan explains why the shelf bin was empty; the records do not establish misconduct.',
      'The return kiosk must have been broken.',
      'The book was never returned.'
    ],
    answer: 1,
    hint: 'Compare the latest scan with the shelf check. A missing item from one location is not proof that it was never returned.',
    explanation: 'The barcode appears in the holds-cart record after the kiosk receipt and shelf audit. That supports a normal internal hand-off as the best explanation. The records do not establish who moved the book or why the shelf was empty.',
    setting: 'United States · county library',
    sourceNote: 'Original fictional scenario. No real library, borrower, or incident is depicted; public-records research is documented in CASE_RESEARCH_NOTES.md.'
  },
  {
    id: 'LM-US-072',
    title: 'The County Annex Switch',
    subtitle: 'Choose the first lead that can actually test the claim.',
    mode: 'LAST MOVE',
    difficulty: 'Medium',
    minutes: 5,
    points: 180,
    tags: ['Equipment hand-off', 'Access log', 'Lead selection'],
    intro: 'A projector was moved after a workshop at a fictional United States county annex. Time is limited before the room is reset. Choose the most useful lead first, then decide what the records support.',
    evidence: [
      { id: 'E01', type: 'ROOM SCHEDULE', time: '13:00–14:00', title: 'Room 204 booking', body: 'The workshop booking ends at 14:00. A booking is not proof that every person or item stayed in the room until then.' },
      { id: 'E02', type: 'AV HAND-OFF', time: '13:46', title: 'Projector P-204', body: 'The AV cage intake sheet records projector P-204 as received at 13:46.' },
      { id: 'E03', type: 'BADGE LOG', time: '13:52', title: 'Annex exit event', body: 'A staff badge was used at the exit at 13:52. The log records a credential event, not what the person carried.' },
      { id: 'E04', type: 'WITNESS NOTE', time: '14:05', title: 'Workshop attendee', body: 'An attendee says they left after the workshop ended at 13:40.' }
    ],
    options: [
      'The projector is recorded in the AV cage at 13:46; the badge log alone does not establish who carried it.',
      'The badge holder definitely removed the projector.',
      'The room schedule proves the projector stayed in Room 204 until 14:00.',
      'The attendee lied because the exit event happened later.'
    ],
    answer: 0,
    hint: 'Start with the record that directly tracks the item, not a record that only tracks a room booking or credential.',
    explanation: 'The AV cage intake sheet directly identifies the projector and a receipt time. The room schedule and badge event provide context but cannot identify who physically carried the item. The strongest conclusion is about the documented hand-off, not blame.',
    setting: 'United States · county annex',
    sourceNote: 'Original fictional scenario. No real county office, staff member, or incident is depicted.',
    leadOptions: [
      'Check the AV cage intake and projector serial first.',
      'Assume the badge holder carried the projector.',
      'Ask every attendee to repeat their timeline before checking records.',
      'Treat the room booking as proof of continuous presence.'
    ],
    bestLead: 0
  },
  {
    id: 'SC-US-073',
    title: 'The Block Party Sound Check',
    subtitle: 'A memory, a mixer log and a short clip disagree.',
    mode: 'STREETCRAFT',
    difficulty: 'Medium',
    minutes: 5,
    points: 160,
    tags: ['Community event', 'Audio log', 'Witness reliability'],
    intro: 'A fictional neighbourhood block party in the United States is reviewing a sound-check complaint. The goal is to reconcile the timing fairly, not to decide that a volunteer acted deliberately.',
    evidence: [
      { id: 'E01', type: 'RUN SHEET', time: '17:30', title: 'Sound-check slot', body: 'The run sheet schedules the microphone test for 17:30.' },
      { id: 'E02', type: 'MIXER EVENT LOG', time: '17:41–17:43', title: 'Output and mute events', body: 'The mixer log records microphone output at 17:41 and a mute event at 17:43.' },
      { id: 'E03', type: 'VOLUNTEER NOTE', time: '18:10', title: 'Setup recollection', body: 'A volunteer remembers the speakers being silent by 17:35.' },
      { id: 'E04', type: 'PHONE CLIP METADATA', time: '17:42', title: 'Short sound-check clip', body: 'The clip metadata reads 17:42, and the recording contains a clear microphone test announcement.' }
    ],
    options: [
      'The volunteer intentionally misled the team.',
      'The event schedule proves the speakers were silent at 17:35.',
      'The mixer log and clip show microphone output after 17:35; the difference does not establish why the volunteer remembers it differently.',
      'The phone clip must be false because the run sheet lists an earlier time.'
    ],
    answer: 2,
    hint: 'Separate the scheduled time from records of what actually happened, then avoid guessing at motive.',
    explanation: 'The run sheet describes a plan. The mixer log and the clip independently indicate microphone output after 17:35. That makes the recollection inaccurate or incomplete, but it does not prove deliberate deception.',
    setting: 'United States · neighbourhood block party',
    sourceNote: 'Original fictional scenario. No real event, volunteer, or complaint is depicted.'
  },
  {
    id: 'DD-US-074',
    title: 'The Green Binder',
    subtitle: 'A short code points to the next useful record.',
    mode: 'DEAD DROP',
    difficulty: 'Easy',
    minutes: 3,
    points: 140,
    tags: ['Cipher', 'Archive', 'Pattern'],
    intro: 'A note is left in a fictional United States public archive reading room. The archive guide gives the decoding rule; the message itself is an ordinary instruction.',
    evidence: [
      { id: 'E01', type: 'RECOVERED NOTE', title: 'Number groups', body: '18-5-1-4 / 20-8-5 / 12-15-7' },
      { id: 'E02', type: 'ARCHIVE CARD', title: 'Alphabet index', body: 'For this puzzle, A=1, B=2, C=3, continuing through Z=26.' },
      { id: 'E03', type: 'MARGIN NOTE', title: 'Reading rule', body: 'Keep each number group in order and preserve the spaces between groups.' },
      { id: 'E04', type: 'ROOM GUIDE', title: 'Reading-room practice', body: 'Staff ask researchers to consult the log before requesting a box from storage.' }
    ],
    options: [
      'READ THE MAP',
      'READ THE LOG',
      'READ THE LAB',
      'READ THE LAW'
    ],
    answer: 1,
    hint: 'Convert each number to its alphabet position. The slashes separate words.',
    explanation: 'The A=1 rule converts the groups to READ / THE / LOG. The instruction points to a record that can be checked, rather than to a person or an accusation.',
    setting: 'United States · public archive',
    sourceNote: 'Original fictional cipher. The archive context is general; no actual archive message or case file is reproduced.'
  },
  {
    id: 'CC-NG-075',
    title: 'The Noticeboard Copy',
    subtitle: 'A forwarded image is not the same as the latest notice.',
    mode: 'CAMPUS CHRONICLES',
    difficulty: 'Easy',
    minutes: 4,
    points: 145,
    tags: ['Campus', 'Noticeboard', 'Message provenance'],
    intro: 'Students at a fictional Nigerian university disagree about whether a seminar was cancelled. Compare the original notice with the forwarded copy before deciding what students could reasonably know.',
    evidence: [
      { id: 'E01', type: 'STUDENT PORTAL', time: '07:45', title: 'Updated seminar notice', body: 'The department portal says the seminar has moved from 10:00 to 12:00.' },
      { id: 'E02', type: 'PHOTO METADATA', time: 'Previous day · 18:10', title: 'Printed notice photo', body: 'The photo shows the earlier 10:00 start time and was created the previous evening.' },
      { id: 'E03', type: 'FORWARDED MESSAGE', time: '07:30', title: 'Class group message', body: 'A forwarded message says the seminar is cancelled, but it contains no link to an original department notice.' },
      { id: 'E04', type: 'DEPARTMENT DESK NOTE', time: '08:10', title: 'Desk confirmation', body: 'The department desk confirms that the seminar is rescheduled to noon, not cancelled.' }
    ],
    options: [
      'The old photo proves the seminar was cancelled.',
      'The seminar was moved to noon; the forwarded cancellation claim is not supported by the original notice.',
      'The department portal must be wrong because the photo was shared first.',
      'The student who forwarded the message caused the schedule change.'
    ],
    answer: 1,
    hint: 'Find the latest original notice and distinguish a reschedule from a cancellation.',
    explanation: 'The updated portal notice and department confirmation agree on a noon start. The old photo is genuine evidence of the earlier schedule, but not of a cancellation. The source of the forwarded claim remains unknown.',
    setting: 'Nigeria · university campus',
    sourceNote: 'Original fictional scenario. No real university, student, or incident is depicted; contextual sources are listed in CASE_RESEARCH_NOTES.md.'
  },
  {
    id: 'DD-NG-076',
    title: 'The Market Stall Cipher',
    subtitle: 'Decode the instruction before opening another theory.',
    mode: 'DEAD DROP',
    difficulty: 'Easy',
    minutes: 3,
    points: 140,
    tags: ['Cipher', 'Market cooperative', 'Counting'],
    intro: 'A fictional market cooperative leaves a coded reminder beside its stock ledger. The message asks the team to verify a routine record, not to accuse a trader.',
    evidence: [
      { id: 'E01', type: 'PAPER NOTE', title: 'Number groups', body: '3-8-5-3-11 / 20-8-5 / 3-15-21-14-20' },
      { id: 'E02', type: 'TALLY CARD', title: 'Alphabet index', body: 'A=1, B=2, C=3, continuing through Z=26.' },
      { id: 'E03', type: 'STOCKROOM REMINDER', title: 'Daily process', body: 'When counts differ, reconcile the physical count against the written stock sheet before assigning responsibility.' },
      { id: 'E04', type: 'MARGIN NOTE', title: 'Format clue', body: 'Each slash separates a word. Read every number from left to right.' }
    ],
    options: [
      'CHECK THE COUNT',
      'CHECK THE CASH',
      'CHECK THE ROUTE',
      'CHECK THE CLOCK'
    ],
    answer: 0,
    hint: 'Use the alphabet index. The decoded instruction tells you which record to verify first.',
    explanation: 'The number groups decode to CHECK / THE / COUNT. It is a reminder to reconcile the physical count and written record before drawing conclusions about why they differ.',
    setting: 'Nigeria · market cooperative',
    sourceNote: 'Original fictional cipher. No real market, trader, or incident is depicted; market and MSME context references are recorded in CASE_RESEARCH_NOTES.md.'
  }
];

const contextById: Record<string, { setting: string; sourceNote: string }> = {
  'GL-001': { setting: 'Nigeria · student group chat', sourceNote: 'Original fiction; the campus communication setting is contextual, not a report of a real incident.' },
  'CF-014': { setting: 'United States · campus residence delivery', sourceNote: 'Original fiction; no real borrower, residence hall, or delivery dispute is depicted.' },
  'CF-021': { setting: 'Nigeria · campus lecture hall', sourceNote: 'Original fiction; no real university or student is represented.' },
  'CF-033': { setting: 'United States · community film screening', sourceNote: 'Original fiction; the guest-list puzzle is not based on a real event.' },
  'CF-042': { setting: 'United States · shared study table', sourceNote: 'Original fiction; no real student or missing property incident is depicted.' },
  'DD-001': { setting: 'United States · public archive', sourceNote: 'Original fictional cipher; no actual archive message or case file is reproduced.' },
  'CF-058': { setting: 'United States · community communications desk', sourceNote: 'Original fiction; the lesson concerns evidence independence, not a real rumour or person.' },
  'LM-204': { setting: 'Nigeria · campus classroom', sourceNote: 'Original fiction; access records are used to teach careful lead selection, not to accuse a real person.' },
  'SC-061': { setting: 'Nigeria · Yaba, Lagos', sourceNote: 'Original fiction; the dispatch hand-off is not a real business or delivery incident.' },
  'CF-062': { setting: 'Nigeria · market cooperative', sourceNote: 'Original fiction; the stock discrepancy does not describe a real market or trader.' },
  'GL-061': { setting: 'United States · community arts office', sourceNote: 'Original fiction; the accounting mismatch is not a real payment dispute.' },
  'CC-061': { setting: 'United States · campus archive', sourceNote: 'Original fiction; the time-zone exercise is not a real access allegation.' },
  'NG-IBD-001': { setting: 'Nigeria · Bodija, Ibadan', sourceNote: 'Original fiction; payment evidence is used to distinguish a screenshot from settlement confirmation.' },
  'NG-ABJ-001': { setting: 'Nigeria · Wuse, Abuja FCT', sourceNote: 'Original fiction; the appointment records do not describe a real office or visitor.' },
  'NG-KAN-001': { setting: 'Nigeria · Sabon Gari, Kano', sourceNote: 'Original fiction; the stock hand-off is not a real trader or shipment.' },
  'NG-ENU-001': { setting: 'Nigeria · Nsukka campus', sourceNote: 'Original fiction; no real university notice or student is represented.' },
  'NG-PHC-001': { setting: 'Nigeria · Port Harcourt workplace', sourceNote: 'Original fiction; the shift records are not a real employment dispute.' },
  'NG-JOS-001': { setting: 'Nigeria · Jos, Plateau State', sourceNote: 'Original fiction; the timeline puzzle is not a real witness account.' },
  'NG-BEN-001': { setting: 'Nigeria · Ring Road, Benin City', sourceNote: 'Original fiction; the collection mismatch is not a real shop or customer.' },
  'NG-NAT-001': { setting: 'Nigeria · neighbourhood office', sourceNote: 'Original fiction; a camera gap is not presented as proof of anyone’s presence or absence.' }
};
const contextualizedCases: CaseFile[] = originalCases.map(item => ({
  ...item,
  setting: contextById[item.id]?.setting ?? 'Fictional · setting unspecified',
  sourceNote: contextById[item.id]?.sourceNote ?? 'Original fictional scenario; no real person or incident is represented.'
}));
export const cases: CaseFile[] = [...contextualizedCases, ...additionalCases];

