import { useEffect, useState } from 'react';
import { Activity, BriefcaseBusiness, Building2, CalendarDays, ChevronRight, CircleDollarSign, Compass, Heart, House, Map, Menu, MessageCircle, Moon, Smartphone, Sparkles, Utensils, Wallet, X, Zap } from 'lucide-react';
import World3D from './World3D';

type GameSave = { cash: number; energy: number; hunger: number; hygiene: number; day: number; hour: number; location: string; jobLevel: number; visits: number };
const DEFAULT_SAVE: GameSave = { cash: 8500, energy: 82, hunger: 76, hygiene: 71, day: 1, hour: 9, location: 'Ikeja District', jobLevel: 0, visits: 0 };
const SAVE_KEY = 'afterhours-life-save-v1';
type Tab = 'city' | 'phone' | 'career' | 'home';

function loadSave(): GameSave {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return { ...DEFAULT_SAVE, ...JSON.parse(raw) };
  } catch { /* Use a fresh save when local storage is unavailable. */ }
  return DEFAULT_SAVE;
}

export default function App() {
  const [save, setSave] = useState<GameSave>(DEFAULT_SAVE);
  const [tab, setTab] = useState<Tab>('city');
  const [toast, setToast] = useState('Welcome to Nigeria. Your story starts here.');
  const [mobileNav, setMobileNav] = useState(false);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => { setSave(loadSave()); }, []);
  useEffect(() => {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch { /* The game remains playable without saving. */ }
  }, [save]);

  const notify = (message: string) => setToast(message);
  const advanceTime = (hours = 1) => setSave(s => {
    const total = s.hour + hours;
    return { ...s, hour: total % 24, day: s.day + Math.floor(total / 24) };
  });
  const doAction = (kind: 'food' | 'rest' | 'wash' | 'work' | 'ride' | 'interact') => {
    if (kind === 'food') {
      if (save.cash < 700) return notify('Not enough cash for a proper meal. Find a paid shift first.');
      setSave(s => ({ ...s, cash: s.cash - 700, hunger: Math.min(100, s.hunger + 28), energy: Math.min(100, s.energy + 4) }));
      advanceTime(1); notify('You bought a plate of jollof rice and chicken. Hunger restored. −₦700');
    } else if (kind === 'rest') {
      setSave(s => ({ ...s, energy: Math.min(100, s.energy + 45), hunger: Math.max(0, s.hunger - 9) }));
      advanceTime(7); notify('You got some proper rest. Time moved forward 7 hours.');
    } else if (kind === 'wash') {
      setSave(s => ({ ...s, hygiene: 100, energy: Math.max(0, s.energy - 3) }));
      advanceTime(1); notify('Quick wash done. You feel ready to face the day.');
    } else if (kind === 'work') {
      if (save.energy < 20 || save.hunger < 15) return notify('You are running low. Eat or rest before taking a shift.');
      const pay = 2500 + save.jobLevel * 400;
      setSave(s => ({ ...s, cash: s.cash + pay, energy: Math.max(0, s.energy - 22), hunger: Math.max(0, s.hunger - 17), jobLevel: Math.min(10, s.jobLevel + 1) }));
      advanceTime(4); notify('Shift complete. You earned ₦' + pay.toLocaleString('en-NG') + '. Keep building your reputation.');
    } else if (kind === 'ride') {
      if (save.cash < 300) return notify('You need ₦300 for the danfo fare.');
      setSave(s => ({ ...s, cash: s.cash - 300, location: s.location === 'Ikeja District' ? 'Yaba Mainland' : 'Ikeja District' }));
      advanceTime(1); notify('You took a danfo. New area unlocked: ' + (save.location === 'Ikeja District' ? 'Yaba Mainland' : 'Ikeja District') + '. −₦300');
    } else {
      setSave(s => ({ ...s, visits: s.visits + 1 }));
      notify('You made a little progress in the neighbourhood. Explore, talk to people and see what turns up.');
    }
  };

  const resetSave = () => {
    setSave(DEFAULT_SAVE); setTab('city'); setShowReset(false);
    notify('Fresh start. Your new story begins today.');
  };
  const timeLabel = (hour: number) => hour < 12 ? 'MORNING' : hour < 17 ? 'AFTERNOON' : hour < 20 ? 'EVENING' : 'NIGHT';
  const formattedTime = (hour: number) => (hour % 12 || 12).toString().padStart(2, '0') + ':00 ' + (hour < 12 ? 'AM' : 'PM');

  return <div className="game-shell">
    <aside className={'sidebar ' + (mobileNav ? 'sidebar-open' : '')}>
      <button className="brand" onClick={() => { setTab('city'); setMobileNav(false); }} aria-label="AFTERHOURS home">
        <span className="brand-mark"><span>AH</span></span><span className="brand-copy">AFTER<span>HOURS</span><small>A NIGERIAN LIFE SIM</small></span>
      </button>
      <div className="side-kicker">YOUR WORLD</div>
      <nav className="side-nav">
        <button className={tab === 'city' ? 'active' : ''} onClick={() => { setTab('city'); setMobileNav(false); }}><Compass size={17}/> <span>Explore city</span><ChevronRight size={14}/></button>
        <button className={tab === 'phone' ? 'active' : ''} onClick={() => { setTab('phone'); setMobileNav(false); }}><Smartphone size={17}/> <span>Phone</span><span className="nav-new">3</span></button>
        <button className={tab === 'career' ? 'active' : ''} onClick={() => { setTab('career'); setMobileNav(false); }}><BriefcaseBusiness size={17}/> <span>Work & money</span></button>
        <button className={tab === 'home' ? 'active' : ''} onClick={() => { setTab('home'); setMobileNav(false); }}><House size={17}/> <span>My home</span></button>
      </nav>
      <div className="side-divider"/>
      <div className="side-kicker">LIFE IN PROGRESS</div>
      <div className="side-quest"><span className="quest-icon"><Map size={16}/></span><div><b>First day in the city</b><small>Get settled · Explore · Earn</small><div className="quest-track"><span style={{width: Math.min(100, save.visits * 12 + save.jobLevel * 15) + '%'}}/></div></div></div>
      <div className="side-bottom">
        <div className="weather-card"><span className="weather-icon">☀</span><div><b>Warm & humid</b><small>Typical Lagos afternoon</small></div><span className="weather-temp">31°</span></div>
        <div className="save-state"><i/> LOCAL SAVE ENABLED <span>V1.0</span></div>
      </div>
    </aside>

    {mobileNav && <button className="nav-scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation"/>}
    <main className="main-area">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMobileNav(v => !v)} aria-label="Toggle menu">{mobileNav ? <X size={20}/> : <Menu size={20}/>}</button>
        <div className="breadcrumb"><span>AFTERHOURS</span><b>/</b><strong>{tab === 'city' ? 'THE NEIGHBOURHOOD' : tab === 'phone' ? 'YOUR PHONE' : tab === 'career' ? 'WORK & MONEY' : 'YOUR HOME'}</strong></div>
        <div className="topbar-right"><span className="time-pill"><span className="status-dot"/>{formattedTime(save.hour)}</span><span className="day-pill">DAY {String(save.day).padStart(2, '0')}</span><button className="avatar-button" onClick={() => setTab('phone')}>N</button></div>
      </header>

      <div className="content-wrap">
        <section className="welcome-row">
          <div><div className="eyebrow"><span/> {timeLabel(save.hour)} IN NIGERIA <span className="eyebrow-sep">/</span> DAY {save.day}</div>
            <h1>{tab === 'city' ? <>Your life. <em>Your rules.</em></> : tab === 'phone' ? <>The world in <em>your pocket.</em></> : tab === 'career' ? <>Make your own <em>money.</em></> : <>A place to <em>reset.</em></>}</h1>
            <p>{tab === 'city' ? 'Every street has a story. Make a living, meet people, find your rhythm.' : tab === 'phone' ? 'Messages, plans and little opportunities. Keep an eye on what is happening.' : tab === 'career' ? 'Pick up a shift, earn cash and build a name for yourself.' : 'Rest, recharge and get ready for whatever tomorrow brings.'}</p>
          </div>
          <div className="location-chip"><span className="location-pin"><Map size={15}/></span><div><small>CURRENT AREA</small><b>{save.location}</b></div><span className="location-live"/></div>
        </section>

        <section className="stats-grid">
          <div className="stat-card cash-stat"><div className="stat-top"><span>AVAILABLE CASH</span><CircleDollarSign size={17}/></div><div className="stat-value">₦{save.cash.toLocaleString('en-NG')}</div><small><span className="positive">↗ Ready to spend</span> <span className="stat-muted">· Nigerian naira</span></small></div>
          <div className="stat-card"><div className="stat-top"><span>ENERGY</span><Zap size={17}/></div><div className="stat-value">{save.energy}<small>/100</small></div><div className="meter"><span className={save.energy < 25 ? 'low' : ''} style={{width: save.energy + '%'}}/></div></div>
          <div className="stat-card"><div className="stat-top"><span>HUNGER</span><Utensils size={16}/></div><div className="stat-value">{save.hunger}<small>/100</small></div><div className="meter"><span className={save.hunger < 25 ? 'low' : ''} style={{width: save.hunger + '%'}}/></div></div>
          <div className="stat-card"><div className="stat-top"><span>HYGIENE</span><Sparkles size={16}/></div><div className="stat-value">{save.hygiene}<small>/100</small></div><div className="meter"><span className={save.hygiene < 25 ? 'low' : ''} style={{width: save.hygiene + '%'}}/></div></div>
        </section>

        {tab === 'city' && <World3D region={save.location} location={save.location} hour={save.hour} onInteract={() => doAction('interact')}/>}
        {tab === 'phone' && <section className="dashboard-panel phone-panel"><div className="panel-heading"><div><div className="eyebrow">PERSONAL DEVICE / ONLINE</div><h2>Your phone, your connections.</h2><p>Useful little things from around your city.</p></div><Smartphone size={28}/></div><div className="phone-grid"><article className="phone-card message-card"><MessageCircle/><span className="phone-label">MESSAGES · 3 NEW</span><h3>People are talking.</h3><p>Your neighbour mentioned a casual shift at the workshop. The community board has new listings.</p><button onClick={() => {setTab('career'); notify('You checked the message about a workshop shift.');}}>Check opportunities <ChevronRight size={15}/></button></article><article className="phone-card"><CalendarDays/><span className="phone-label">TODAY'S PLAN</span><h3>Make the day count.</h3><p>Find a job, grab something to eat, and explore one new street.</p><button onClick={() => {setTab('city'); notify('Plan saved. Go explore the neighbourhood.');}}>Head outside <ChevronRight size={15}/></button></article><article className="phone-card"><Wallet/><span className="phone-label">MOBILE WALLET</span><h3>₦{save.cash.toLocaleString('en-NG')}</h3><p>Your available in-game cash. Spend wisely; paid shifts can refill your balance.</p><button onClick={() => setTab('career')}>Earn more <ChevronRight size={15}/></button></article></div></section>}
        {tab === 'career' && <section className="dashboard-panel career-panel"><div className="panel-heading"><div><div className="eyebrow">CAREER BOARD / LOCAL WORK</div><h2>Earn your place in the city.</h2><p>Take a shift, earn a little, and build your work reputation.</p></div><BriefcaseBusiness size={28}/></div><article className="job-card"><div className="job-emblem"><Building2 size={24}/></div><div className="job-info"><span className="job-tag">AVAILABLE SHIFT · ENTRY LEVEL</span><h3>Neighbourhood helper</h3><p>Help a local business with errands, setup and customer support. Takes 4 in-game hours.</p><div className="job-details"><span><CalendarDays size={14}/> Flexible shift</span><span><Zap size={14}/> Moderate energy</span><span><CircleDollarSign size={14}/> ₦{(2500 + save.jobLevel * 400).toLocaleString('en-NG')}</span></div></div><button className="action-primary" onClick={() => doAction('work')}><BriefcaseBusiness size={16}/> Take shift</button></article><div className="career-note"><Activity size={18}/><div><b>Your reputation: {save.jobLevel === 0 ? 'New around here' : save.jobLevel < 4 ? 'Getting noticed' : 'Reliable regular'}</b><p>Every completed shift increases your next payout. Keep your energy and hunger up to work safely.</p></div></div></section>}
        {tab === 'home' && <section className="dashboard-panel home-panel"><div className="panel-heading"><div><div className="eyebrow">YOUR PLACE / SAFE ZONE</div><h2>Small space. Big plans.</h2><p>Look after yourself before heading back out.</p></div><House size={28}/></div><div className="home-room"><div className="room-art"><div className="room-window"/><div className="room-bed"><span/></div><div className="room-plant">✦</div><div className="room-caption">YOUR STARTER HOME</div></div><div className="home-actions"><button onClick={() => doAction('rest')}><Moon/><span><b>Get some sleep</b><small>Restore energy · 7 hours</small></span><ChevronRight/></button><button onClick={() => doAction('wash')}><Sparkles/><span><b>Take a quick wash</b><small>Restore hygiene · 1 hour</small></span><ChevronRight/></button><button onClick={() => {setTab('city'); notify('You stepped outside. The neighbourhood is waiting.');}}><Compass/><span><b>Head into the city</b><small>Explore your neighbourhood</small></span><ChevronRight/></button></div></div></section>}

        <section className="quick-actions"><div className="quick-heading"><div><span className="eyebrow">LIFE DOESN'T WAIT</span><h2>What are we doing today?</h2></div><span className="quick-date">DAY {String(save.day).padStart(2, '0')} · {timeLabel(save.hour)}</span></div><div className="action-grid">
          <button className="action-tile" onClick={() => doAction('food')}><span className="tile-icon food-icon"><Utensils/></span><span><b>Grab a meal</b><small>Jollof rice & chicken · ₦700</small></span><ChevronRight/></button>
          <button className="action-tile" onClick={() => doAction('work')}><span className="tile-icon work-icon"><BriefcaseBusiness/></span><span><b>Pick up a shift</b><small>Earn ₦{(2500 + save.jobLevel * 400).toLocaleString('en-NG')}</small></span><ChevronRight/></button>
          <button className="action-tile" onClick={() => doAction('ride')}><span className="tile-icon ride-icon">🚌</span><span><b>Take a danfo</b><small>Travel between districts · ₦300</small></span><ChevronRight/></button>
          <button className="action-tile" onClick={() => doAction('wash')}><span className="tile-icon self-icon"><Heart/></span><span><b>Look after yourself</b><small>Quick wash · 1 hour</small></span><ChevronRight/></button>
        </div></section>

        <footer className="game-footer"><span>AFTERHOURS © 2026</span><span>BUILT FOR THE STREETS, THE STORIES & EVERYTHING IN BETWEEN.</span><button onClick={() => setShowReset(true)}>Reset save</button></footer>
      </div>
    </main>

    {toast && <div className="toast-message" role="status"><span className="toast-mark"><Sparkles size={15}/></span><span>{toast}</span><button onClick={() => setToast('')} aria-label="Dismiss notification"><X size={16}/></button></div>}
    {showReset && <div className="modal-backdrop" role="presentation"><div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="reset-title"><div className="modal-icon"><Activity/></div><h2 id="reset-title">Start over?</h2><p>This will reset your cash, needs, day and job progress on this browser.</p><div className="modal-actions"><button onClick={() => setShowReset(false)}>Keep playing</button><button className="action-primary" onClick={resetSave}>Reset game</button></div></div></div>}
  </div>;
}
