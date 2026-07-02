import { useEffect, useState } from 'react';
import cnhLogo from '../images/CnhLogo.47af2005036c95d1b852638df4cc2a67.svg';
import homepageImage from '../images/homepage.4b4f04366e83e8a94782.avif';
import DisplayBar from './Displaybar2.0';

const runbookItems = [
  { icon: 'book-small', label: 'User Guide', inset: true },
  { icon: 'train', label: 'Trainings', inset: true },
];

const apps = [
  { icon: 'book-small', title: 'User Guide' },
  { icon: 'train', title: 'Trainings' },
];

function getDisplayBarTextUrl() {
  const path = process.env.REACT_APP_DISPLAY_BAR_TEXT_PATH || '/dummy.txt';
  return /^https?:\/\//i.test(path) ? path : `${process.env.PUBLIC_URL || ''}${path.startsWith('/') ? path : `/${path}`}`;
}

function Sidebar({ onAction }) {
  const [isRunbookOpen, setIsRunbookOpen] = useState(true);

  const handleRunbookClick = () => {
    setIsRunbookOpen((isOpen) => !isOpen);
    onAction('Runbook');
  };

  return (
    <aside className="sidebar">
      <div className="logo-panel">
        <button
          className="collapse-button"
          type="button"
          aria-label="Collapse navigation"
          onClick={() => onAction('Collapse')}
        >
          &lsaquo;
        </button>
        <img src={cnhLogo} alt="CNH Industrial" className="cnh-logo" />
      </div>
  
      <nav className="nav-panel" aria-label="Primary">
        <button className="nav-row nav-row-active" type="button" onClick={() => onAction('Home')}>
          <span className="nav-icon icon-home" aria-hidden="true" />
          <span>Home</span>
        </button>

        <button
          className="nav-row"
          type="button"
          aria-expanded={isRunbookOpen}
          onClick={handleRunbookClick}
        >
          <span className="nav-icon icon-book" aria-hidden="true" />
          <span>Runbook</span>
          <span
            className={`nav-chevron${isRunbookOpen ? ' nav-chevron-open' : ''}`}
            aria-hidden="true"
          />
        </button>

        {isRunbookOpen &&
          runbookItems.map((item) => (
            <button
              className="nav-row nav-row-inset"
              type="button"
              key={item.label}
              onClick={() => onAction(item.label)}
            >
              <span className={`nav-icon icon-${item.icon}`} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          ))}
      </nav>

      <button className="logout-button" type="button" onClick={() => onAction('Logout')}>
        <span className="logout-icon" aria-hidden="true" />
        Logout
      </button>
    </aside>
  );
}

function Topbar({ onAction }) {
  return (
    <header className="topbar">
      <div className="title-wrap">
        <span className="home-icon" aria-hidden="true" />
        <h1>System Console</h1>
      </div>
      <button
        className="profile-button"
        type="button"
        aria-label="Open user profile"
        onClick={() => onAction('Profile')}
      />
    </header>
  );
}

function ApplicationCard({ icon, title, onOpen }) {
  return (
    <article className="application-card">
      <span className={`application-icon icon-${icon}`} aria-hidden="true" />
      <h3>{title}</h3>
      <button type="button" onClick={() => onOpen(title)}>
        OPEN
      </button>
    </article>
  );
}

function Dashboard() {
  const [displayBarText, setDisplayBarText] = useState('');

  useEffect(() => {
    let isMounted = true;

    fetch(getDisplayBarTextUrl(), { cache: 'no-store' })
      .then((response) => response.text())
      .then((text) => isMounted && setDisplayBarText(text.trim()))
      .catch(() => isMounted && setDisplayBarText(''));

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAction = (label) => {
    console.log(label);
  };

  return (
    <div className="console-shell">
      <DisplayBar
        msg={displayBarText}
        display="on"
        displayPosition="top"
        displayTime="5s"
        diplayShape="round"
        scrollable="false"
      />
            <DisplayBar
        msg={displayBarText}
        display="on"
        displayPosition="bottom"
        displayTime=""
        diplayShape="pill"
        scrollable="false"
      />
            <DisplayBar
        msg={displayBarText}
        display="on"
        displayPosition="center"
        displayTime=""
        diplayShape="square"
        scrollable="false"
      />
            <DisplayBar
        msg={displayBarText}
        display="on"
        displayPosition="left"
        displayTime=""
        diplayShape="rounded"
        scrollable="false"
      />
            <DisplayBar
        msg={displayBarText}
        display="on"
        displayPosition="right"
        displayTime=""
        diplayShape="rectangle"
        scrollable="false"
      />
      <Sidebar onAction={handleAction} />
      <main className="main-area">
       
        <Topbar onAction={handleAction} />
        
       
        <section
          className="hero"
          aria-label="Rolling countryside"
          style={{ backgroundImage: `url(${homepageImage})` }}
        />
        <section className="welcome-card">
      
          <h2>Hello BHUMIK!</h2>
          <p>Welcome back to your workspace, select an application to get going.</p>
        </section>
        <section className="applications-section" aria-labelledby="applications-title">
          <h2 id="applications-title">Applications</h2>
          <div className="applications-grid">
            {apps.map((app) => (
              <ApplicationCard key={app.title} {...app} onOpen={handleAction} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
