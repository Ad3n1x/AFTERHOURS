import { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Brain, Check, ChevronRight, CircleHelp, Clock3, Compass, Focus, Lightbulb, Menu, Moon, Plus, Search, ShieldCheck, Sparkles, Target, Trash2, X, Zap } from 'lucide-react';

type Note = { id: string; title: string; body: string; tag: string; created: string };
type Task = { id: string; title: string; done: boolean };
type Decision = { facts: string; assumptions: string; options: string; next: string };
const KEY = 'afterhours-command-center-v2';
const initialTasks: Task[] = [
  { id: 'one', title: 'Choose one thing worth your attention', done: false },
  { id: 'two', title: 'Make a little progress on it', done: false },
  { id: 'three', title: 'Leave room to explore something new', done: false },
];
const discoveries = [
  { category: 'PSYCHOLOGY', title: 'The quiet power of deliberate practice', body: 'Skill grows faster when you work just beyond your comfort zone, get feedback, and repeat with intention.' },
  { category: 'SCIENCE', title: 'Your brain is a prediction machine', body: 'Your mind constantly predicts what comes next, then updates its model when reality disagrees.' },
  { category: 'HISTORY', title: 'Old ideas rarely disappear', body: 'Many technologies are rediscoveries: an idea can arrive too early, then become useful when the world catches up.' },
  { category: 'SYSTEMS', title: 'Small rules create big outcomes', body: 'A simple constraint can make a complex system easier to understand, maintain, and improve.' },
  { category: 'SPACE', title: 'Looking up is looking back', body: 'Light takes time to travel. The farther away an object is, the further into the past you see it.' },
];
const blankDecision: Decision = { facts: '', assumptions: '', options: '', next: '' };

function readSaved() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { notes: [] as Note[], tasks: initialTasks, completed: 0, focusMinutes: 0, decision: blankDecision };
}
const todayLabel = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

export default function App() {
  const [saved, setSaved] = useState(readSaved);
  const [page, setPage] = useState('Overview');
  const [query, setQuery] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [noteTag, setNoteTag] = useState('Idea');
  const [showComposer, setShowComposer] = useState(false);
  const [discoveryIndex, setDiscoveryIndex] = useState(() => Math.floor(Math.random() * discoveries.length));
  const [focusSeconds, setFocusSeconds] = useState(25 * 60);
  const [focusRunning, setFocusRunning] = useState(false);
  const [focusMode, setFocusMode] = useState('FOCUS');
  const [toast, setToast] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [decision, setDecision] = useState<Decision>(blankDecision);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch {} }, [saved]);
  useEffect(() => { setDecision(saved.decision || blankDecision); }, []);
  useEffect(() => {
    if (!focusRunning) return;
    const id = window.setInterval(() => setFocusSeconds(s => {
      if (s <= 1) { setFocusRunning(false); setToast('Focus session complete. Take a breath.'); setSaved((v: any) => ({ ...v, focusMinutes: (v.focusMinutes || 0) + 25 })); return 25 * 60; }
      return s - 1;
    }), 1000);
    return () => window.clearInterval(id);
  }, [focusRunning]);

  const notes: Note[] = saved.notes || [];
  const tasks: Task[] = saved.tasks || initialTasks;
  const doneCount = tasks.filter(t => t.done).length;
  const currentDiscovery = discoveries[discoveryIndex];
  const filteredNotes = useMemo(() => notes.filter(n => (n.title + ' ' + n.body + ' ' + n.tag).toLowerCase().includes(query.toLowerCase())), [notes, query]);
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 3200); };
  const toggleTask = (id: string) => setSaved((v: any) => ({ ...v, tasks: (v.tasks || initialTasks).map((t: Task) => t.id === id ? { ...t, done: !t.done } : t), completed: (v.completed || 0) + 1 }));
  const saveNote = () => {
    if (!noteTitle.trim() && !noteBody.trim()) return notify('Add a thought before saving it.');
    const note: Note = { id: crypto.randomUUID?.() || String(Date.now()), title: noteTitle.trim() || 'Untitled thought', body: noteBody.trim(), tag: noteTag, created: new Date().toISOString() };
    setSaved((v: any) => ({ ...v, notes: [note, ...(v.notes || [])] }));
    setNoteTitle(''); setNoteBody(''); setShowComposer(false); setPage('Thought Vault'); notify('Saved to your Thought Vault.');
  };
  const deleteNote = (id: string) => setSaved((v: any) => ({ ...v, notes: (v.notes || []).filter((n: Note) => n.id !== id) }));
  const updateDecision = (key: keyof Decision, value: string) => {
    const next = { ...decision, [key]: value };
    setDecision(next); setSaved((v: any) => ({ ...v, decision: next }));
  };
  const resetAll = () => {
    setSaved({ notes: [], tasks: initialTasks, completed: 0, focusMinutes: 0, decision: blankDecision });
    setDecision(blankDecision); setFocusSeconds(25 * 60); setFocusRunning(false); setShowReset(false); notify('Fresh slate. The next move is yours.');
  };
  const nav = [
    { label: 'Overview', icon: Activity },
    { label: 'Operations', icon: Target },
    { label: 'Thought Vault', icon: Brain },
    { label: 'Signal / Noise', icon: Focus },
    { label: 'Explore', icon: Compass },
    { label: 'Progress', icon: ArrowUpRight },
  ];
  const go = (label: string) => { setPage(label); setMobileNav(false); };
  const time = (focusSeconds / 60 | 0).toString().padStart(2, '0') + ':' + (focusSeconds % 60).toString().padStart(2, '0');

  return <div className="app-shell">
    <aside className={'sidebar ' + (mobileNav ? 'open' : '')}>
      <button className="brand" onClick={() => go('Overview')}><span className="brand-symbol">A<span>.</span></span><span className="brand-name">AFTERHOURS<small>PERSONAL OPERATING SYSTEM</small></span></button>
      <div className="nav-label">WORKSPACE</div>
      <nav>{nav.map(item => { const Icon = item.icon; return <button key={item.label} className={'nav-item ' + (page === item.label ? 'selected' : '')} onClick={() => go(item.label)}><Icon size={17}/><span>{item.label}</span>{page === item.label && <span className="nav-indicator"/>}</button>; })}</nav>
      <div className="sidebar-bottom"><div className="quiet-card"><Moon size={17}/><span><b>Quiet mode</b><small>Less noise. More signal.</small></span><span className="online-dot"/></div><div className="local-label"><ShieldCheck size={13}/> STORED ON THIS DEVICE</div><button className="reset-link" onClick={() => setShowReset(true)}>Reset workspace</button></div>
    </aside>
    {mobileNav && <button className="scrim" onClick={() => setMobileNav(false)} aria-label="Close menu"/>}
    <main className="main">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(v => !v)} aria-label="Open navigation">{mobileNav ? <X size={20}/> : <Menu size={20}/>}</button><div className="crumb"><span>AFTERHOURS</span><b>/</b>{page.toUpperCase()}</div><div className="top-actions"><span className="live-pill"><i/> SYSTEM READY</span><span className="date-pill">{todayLabel}</span><div className="avatar">N</div></div></header>
      <div className="content">
        {page === 'Overview' && <>
          <section className="hero"><div><div className="eyebrow"><span className="eyebrow-line"/> YOUR SPACE, YOUR PACE</div><h1>Think clearly.<br/><em>Move deliberately.</em></h1><p>A quiet command center for your ideas, attention, and next move.</p><div className="hero-actions"><button className="primary" onClick={() => go('Operations')}><Zap size={15}/> Enter operations <ArrowRight size={15}/></button><button className="secondary" onClick={() => {setShowComposer(true); go('Thought Vault');}}><Plus size={15}/> Capture a thought</button></div></div><div className="hero-orbit"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit-core"><span>AH</span><i/></div><span className="orbit-label label-top">CLARITY / 01</span><span className="orbit-label label-bottom">SIGNAL DETECTED</span></div></section>
          <section className="metric-grid"><div className="metric"><div className="metric-label">THOUGHTS CAPTURED <Brain size={16}/></div><strong>{notes.length.toString().padStart(2,'0')}</strong><small>Ideas kept, not lost</small></div><div className="metric"><div className="metric-label">MISSIONS COMPLETE <Check size={16}/></div><strong>{tasks.filter(t=>t.done).length}<small> / {tasks.length}</small></strong><small>Today's small wins</small></div><div className="metric"><div className="metric-label">FOCUS MINUTES <Clock3 size={16}/></div><strong>{saved.focusMinutes || 0}</strong><small>Time spent intentionally</small></div><div className="metric accent-metric"><div className="metric-label">CURRENT MODE <Zap size={16}/></div><strong>Quiet<span>.</span></strong><small>Build without the noise</small></div></section>
          <div className="section-grid"><section className="panel operations-panel"><div className="panel-head"><div><div className="eyebrow">01 / OPERATIONS</div><h2>Today's mission</h2></div><button className="text-link" onClick={() => go('Operations')}>Open board <ArrowRight size={14}/></button></div><p className="panel-intro">No giant checklist. Just a few things worth your attention.</p><div className="task-list">{tasks.map((task, i) => <button key={task.id} className={'task-row ' + (task.done ? 'task-done' : '')} onClick={() => toggleTask(task.id)}><span className="task-check">{task.done && <Check size={14}/>}</span><span className="task-number">0{i+1}</span><span className="task-title">{task.title}</span><ChevronRight size={15}/></button>)}</div><div className="task-progress"><div><span>DAILY MOMENTUM</span><b>{Math.round(doneCount / Math.max(tasks.length,1) * 100)}%</b></div><div className="progress-track"><span style={{width: (doneCount / Math.max(tasks.length,1) * 100) + '%'}}/></div></div></section>
          <section className="panel discovery-panel"><div className="panel-head"><div><div className="eyebrow">02 / FIELD NOTES</div><h2>A signal worth exploring</h2></div><button className="icon-button" onClick={() => setDiscoveryIndex((discoveryIndex+1)%discoveries.length)} aria-label="Next discovery"><ArrowUpRight size={16}/></button></div><div className="discovery-content"><div className="discovery-art"><div className="discovery-ring ring-a"/><div className="discovery-ring ring-b"/><Sparkles size={25}/><span>OPEN LOOP / {String(discoveryIndex+1).padStart(2,'0')}</span></div><span className="tag">{currentDiscovery.category}</span><h3>{currentDiscovery.title}</h3><p>{currentDiscovery.body}</p><button className="text-link" onClick={() => {setNoteTitle(currentDiscovery.title);setNoteBody(currentDiscovery.body);setNoteTag('Discovery');setShowComposer(true);go('Thought Vault');}}>Save to vault <ArrowRight size={14}/></button></div></section></div>
          <section className="focus-strip"><div className="focus-icon"><Focus size={20}/></div><div className="focus-copy"><span className="eyebrow">03 / DEEP WORK</span><h2>Protect a little attention.</h2><p>One 25-minute session. One thing at a time.</p></div><div className="focus-clock">{time}</div><button className={focusRunning ? 'secondary' : 'primary'} onClick={() => setFocusRunning(v=>!v)}>{focusRunning ? 'Pause session' : 'Start focus'} <ArrowRight size={14}/></button><button className="reset-timer" onClick={() => {setFocusRunning(false);setFocusSeconds(25*60);}}>Reset</button></section>
        </>}
        {page === 'Operations' && <><PageIntro eyebrow="01 / OPERATIONS" title={<>Make the next move <em>count.</em></>} text="A small, realistic plan beats a perfect plan you never start."/><section className="panel full-panel"><div className="panel-head"><div><div className="eyebrow">DAILY PROTOCOL</div><h2>Your mission board</h2></div><span className="tag">{doneCount} OF {tasks.length} COMPLETE</span></div><div className="task-list roomy">{tasks.map((task,i)=><button key={task.id} className={'task-row ' +(task.done?'task-done':'')} onClick={()=>toggleTask(task.id)}><span className="task-check">{task.done&&<Check size={14}/>}</span><span className="task-number">0{i+1}</span><span className="task-title">{task.title}</span><ChevronRight size={15}/></button>)}</div><div className="task-progress"><div><span>PROGRESS</span><b>{Math.round(doneCount/Math.max(tasks.length,1)*100)}%</b></div><div className="progress-track"><span style={{width:(doneCount/Math.max(tasks.length,1)*100)+'%'}}/></div></div><button className="secondary add-task" onClick={()=>{const title=window.prompt('What is one small thing worth doing?');if(title?.trim())setSaved((v:any)=>({...v,tasks:[...(v.tasks||initialTasks),{id:String(Date.now()),title:title.trim(),done:false}]}));}}> <Plus size={15}/> Add a mission</button></section></>}
        {page === 'Thought Vault' && <><PageIntro eyebrow="02 / THOUGHT VAULT" title={<>Keep the thoughts that <em>matter.</em></>} text="A private place for ideas, observations, plans, and unfinished thoughts."/><div className="vault-toolbar"><div className="searchbox"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search your vault..."/></div><button className="primary" onClick={()=>setShowComposer(v=>!v)}><Plus size={16}/> New thought</button></div>{showComposer&&<section className="panel composer"><div className="panel-head"><h2>Capture a thought</h2><button className="icon-button" onClick={()=>setShowComposer(false)} aria-label="Close"><X size={16}/></button></div><input className="field" value={noteTitle} onChange={e=>setNoteTitle(e.target.value)} placeholder="Give it a title..."/><textarea className="field textarea" value={noteBody} onChange={e=>setNoteBody(e.target.value)} placeholder="Write freely. It doesn't need to be polished."/><div className="composer-foot"><select value={noteTag} onChange={e=>setNoteTag(e.target.value)}><option>Idea</option><option>Observation</option><option>Plan</option><option>Discovery</option><option>Reminder</option></select><button className="primary" onClick={saveNote}><Check size={15}/> Save thought</button></div></section>}<div className="notes-grid">{filteredNotes.map(note=><article className="note-card" key={note.id}><div className="note-top"><span className="tag">{note.tag}</span><button className="icon-button delete-note" onClick={()=>deleteNote(note.id)} aria-label="Delete thought"><Trash2 size={15}/></button></div><h3>{note.title}</h3><p>{note.body}</p><small>{new Date(note.created).toLocaleDateString()}</small></article>)}{!filteredNotes.length&&<div className="empty-state"><Brain size={25}/><h3>Your vault is quiet.</h3><p>{query?'No thoughts match that search.':'Capture a thought before it disappears into the void.'}</p><button className="secondary" onClick={()=>setShowComposer(true)}><Plus size={15}/> Capture your first thought</button></div>}</div></>}
        {page === 'Signal / Noise' && <><PageIntro eyebrow="03 / SIGNAL / NOISE" title={<>Separate what you know from <em>what you assume.</em></>} text="Use this thinking space when a decision feels tangled. No AI required; the structure does the work."/><section className="panel full-panel decision-panel"><div className="decision-banner"><div className="decision-icon"><Brain size={21}/></div><div><b>Decision debrief</b><p>Write what is true, what you are guessing, and what you can actually do next.</p></div></div><div className="decision-fields"><label>01 / FACTS<textarea value={decision.facts} onChange={e=>updateDecision('facts',e.target.value)} placeholder="What do you know for sure?"/></label><label>02 / ASSUMPTIONS<textarea value={decision.assumptions} onChange={e=>updateDecision('assumptions',e.target.value)} placeholder="What might you be treating as a fact?"/></label><label>03 / OPTIONS<textarea value={decision.options} onChange={e=>updateDecision('options',e.target.value)} placeholder="What are the realistic choices?"/></label><label>04 / NEXT MOVE<textarea value={decision.next} onChange={e=>updateDecision('next',e.target.value)} placeholder="What is one small, reversible step?"/></label></div><div className="decision-footer"><ShieldCheck size={15}/> Saved locally as you type. Your thinking stays yours.</div></section></>}
        {page === 'Explore' && <><PageIntro eyebrow="04 / EXPLORE" title={<>Follow your <em>curiosity.</em></>} text="A small field guide for a mind that likes to wander with purpose."/><section className="explore-feature panel"><div className="explore-symbol"><Lightbulb size={34}/><div/></div><div><span className="tag">{currentDiscovery.category}</span><h2>{currentDiscovery.title}</h2><p>{currentDiscovery.body}</p><div className="hero-actions"><button className="primary" onClick={()=>setDiscoveryIndex((discoveryIndex+1)%discoveries.length)}>Another discovery <ArrowRight size={15}/></button><button className="secondary" onClick={()=>{setNoteTitle(currentDiscovery.title);setNoteBody(currentDiscovery.body);setNoteTag('Discovery');setShowComposer(true);go('Thought Vault');}}>Save to vault</button></div></div></section><div className="explore-tip"><CircleHelp size={18}/><p>Curiosity works best when you follow one interesting thread instead of collecting a thousand open tabs.</p></div></>}
        {page === 'Progress' && <><PageIntro eyebrow="05 / PROGRESS" title={<>Evidence of <em>forward motion.</em></>} text="Not a leaderboard. Just a clear look at what you've been doing."/><section className="metric-grid progress-metrics"><div className="metric"><div className="metric-label">THOUGHTS SAVED <Brain size={16}/></div><strong>{notes.length}</strong><small>Things you chose to keep</small></div><div className="metric"><div className="metric-label">MISSIONS TICKED OFF <Check size={16}/></div><strong>{doneCount}</strong><small>On the current board</small></div><div className="metric"><div className="metric-label">FOCUS MINUTES <Clock3 size={16}/></div><strong>{saved.focusMinutes||0}</strong><small>Completed sessions</small></div><div className="metric"><div className="metric-label">DECISION NOTES <Focus size={16}/></div><strong>{[decision.facts,decision.assumptions,decision.options,decision.next].filter(v=>v.trim()).length}</strong><small>Parts of your debrief</small></div></section><section className="panel full-panel progress-panel"><div className="panel-head"><div><div className="eyebrow">THE LONG GAME</div><h2>Consistency without the guilt.</h2></div><Activity size={20}/></div><p>You don't need a perfect streak. Come back when it helps. The point is to make room for better thinking, not turn your life into another dashboard to maintain.</p><div className="progress-summary"><div><span>VAULT</span><b>{notes.length} saved</b></div><div><span>MISSIONS</span><b>{doneCount} completed</b></div><div><span>FOCUS</span><b>{saved.focusMinutes||0} minutes</b></div></div><button className="secondary" onClick={()=>go('Overview')}>Back to overview <ArrowRight size={15}/></button></section></>}
        <footer className="footer"><span>AFTERHOURS / PERSONAL OS</span><span>BUILT FOR CLARITY, NOT CONSTANT NOISE.</span><span><i/> LOCAL-FIRST</span></footer>
      </div>
    </main>
    {toast&&<div className="toast" role="status"><Sparkles size={15}/><span>{toast}</span><button onClick={()=>setToast('')} aria-label="Dismiss"><X size={15}/></button></div>}
    {showReset&&<div className="modal-backdrop"><section className="confirm-modal"><div className="decision-icon"><Trash2 size={20}/></div><h2>Clear this workspace?</h2><p>This deletes your saved thoughts, mission progress, and decision notes from this browser. This cannot be undone.</p><div className="modal-actions"><button className="secondary" onClick={()=>setShowReset(false)}>Keep everything</button><button className="danger" onClick={resetAll}>Clear workspace</button></div></section></div>}
  </div>;
}

function PageIntro({eyebrow,title,text}:{eyebrow:string;title:React.ReactNode;text:string}) {
  return <section className="page-intro"><div className="eyebrow"><span className="eyebrow-line"/>{eyebrow}</div><h1>{title}</h1><p>{text}</p></section>;
}
