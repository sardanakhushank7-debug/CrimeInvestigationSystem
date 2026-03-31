const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

let users = [];
let casesData = [];
let suspects = [];
let evidence = [];
let officers = [];
let reports = [];

const isAuthenticated = (req, res, next) => {
  // Phase 1: no real authentication required
  next();
};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.post('/api/register', (req, res) => {
  const { agentId, codeName, fullName, email, password } = req.body;
  const role = req.body.role || 'Investigator';
  if (!agentId || !codeName || !fullName || !email || !password) {
    return res.status(400).json({ error: 'Please fill in all registration fields' });
  }

  if (users.some(u => u.agentId === agentId || u.email === email)) {
    return res.status(400).json({ error: 'Agent already exists' });
  }

  const newUser = { id: users.length + 1, agentId, codeName, fullName, email, password, role, createdAt: new Date().toISOString() };
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully', user: { agentId, codeName, fullName, email, role } });
});

app.post('/api/login', (req, res) => {
  const { agentId, codeName, email, password } = req.body;
  if (!agentId || !codeName || !email || !password) {
    return res.status(400).json({ error: 'Please fill in all login fields' });
  }

  const user = users.find(u => u.agentId === agentId && u.codeName === codeName && u.email === email && u.password === password);
  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  res.json({ message: 'Login successful', user: { agentId: user.agentId, codeName: user.codeName, fullName: user.fullName, role: user.role } });
});

app.get('/api/dashboard', isAuthenticated, (req, res) => {
  const openCases = casesData.filter(c => c.status === 'open' || c.status === 'Open').length;
  res.json({
    openCases,
    suspects: suspects.length,
    evidence: evidence.length,
    agents: users.length
  });
});

app.get('/api/cases/recent', isAuthenticated, (req, res) => {
  const recent = [...casesData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
  res.json(recent);
});

app.post('/api/cases', isAuthenticated, (req, res) => {
  const { caseId, caseTitle, crimeType, caseStatus, priorityLevel, assignedAgent, caseLocation, reportedDate, caseDescription } = req.body;
  if (!caseId || !caseTitle || !crimeType || !caseStatus || !priorityLevel || !assignedAgent || !caseLocation || !reportedDate || !caseDescription) {
    return res.status(400).json({ error: 'Please fill in all case fields' });
  }

  if (casesData.some(c => c.caseId === caseId)) {
    return res.status(400).json({ error: 'Case ID already exists' });
  }

  const newCase = {
    id: casesData.length + 1,
    caseId,
    title: caseTitle,
    crimeType,
    status: caseStatus,
    priority: priorityLevel,
    assignedAgent,
    location: caseLocation,
    reportedDate,
    description: caseDescription,
    createdAt: new Date().toISOString()
  };
  casesData.push(newCase);
  res.status(201).json({ message: 'Case added successfully', case: newCase });
});

app.get('/api/cases', isAuthenticated, (req, res) => {
  const sorted = [...casesData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sorted);
});

app.post('/api/suspects', isAuthenticated, (req, res) => {
  const { suspectId, name, alias, age, gender, crimeType, address, riskLevel, status, caseId, notes } = req.body;
  if (!suspectId || !name || !crimeType) {
    return res.status(400).json({ error: 'Please fill in required suspect fields' });
  }

  if (suspects.some(s => s.suspectId === suspectId)) {
    return res.status(400).json({ error: 'Suspect ID already exists' });
  }

  const newSuspect = {
    id: suspects.length + 1,
    suspectId,
    name,
    alias: alias || '',
    age: age || '',
    gender: gender || 'Unknown',
    crimeType,
    address: address || '',
    riskLevel: riskLevel || 'Low',
    status: status || 'Active',
    caseId: caseId || '',
    notes: notes || '',
    createdAt: new Date().toISOString()
  };
  suspects.push(newSuspect);
  res.status(201).json({ message: 'Suspect added successfully', suspect: newSuspect });
});

app.get('/api/suspects', isAuthenticated, (req, res) => {
  res.json([...suspects]);
});

app.post('/api/evidence', isAuthenticated, (req, res) => {
  const { evidenceId, caseId, type, name, location, foundDate, collectedBy, status, notes } = req.body;
  if (!evidenceId || !caseId || !type || !name || !location) {
    return res.status(400).json({ error: 'Please fill in required evidence fields' });
  }

  if (evidence.some(e => e.evidenceId === evidenceId)) {
    return res.status(400).json({ error: 'Evidence ID already exists' });
  }

  const newEvidence = {
    id: evidence.length + 1,
    evidenceId,
    caseId,
    type,
    name,
    location,
    foundDate: foundDate || '',
    collectedBy: collectedBy || '',
    status: status || 'Stored',
    notes: notes || '',
    createdAt: new Date().toISOString()
  };
  evidence.push(newEvidence);
  res.status(201).json({ message: 'Evidence added successfully', evidence: newEvidence });
});

app.get('/api/evidence', isAuthenticated, (req, res) => {
  res.json([...evidence]);
});

app.post('/api/officers', isAuthenticated, (req, res) => {
  const { officerId, name, rank, department, contact, status } = req.body;
  if (!officerId || !name) {
    return res.status(400).json({ error: 'Please fill in required officer fields' });
  }

  if (officers.some(o => o.officerId === officerId)) {
    return res.status(400).json({ error: 'Officer ID already exists' });
  }

  const newOfficer = {
    id: officers.length + 1,
    officerId,
    name,
    rank: rank || '',
    department: department || '',
    contact: contact || '',
    status: status || 'Active',
    createdAt: new Date().toISOString()
  };
  officers.push(newOfficer);
  res.status(201).json({ message: 'Officer added successfully', officer: newOfficer });
});

app.get('/api/officers', isAuthenticated, (req, res) => {
  res.json([...officers]);
});

app.post('/api/reports', isAuthenticated, (req, res) => {
  const { reportId, caseId, officer, type, reportDate, status, summary } = req.body;
  if (!reportId || !caseId || !officer || !type || !reportDate || !status) {
    return res.status(400).json({ error: 'Please fill in all report fields' });
  }

  if (reports.some(r => r.reportId === reportId)) {
    return res.status(400).json({ error: 'Report ID already exists' });
  }

  const newReport = {
    id: reports.length + 1,
    reportId,
    caseId,
    officer,
    type,
    reportDate,
    status,
    summary: summary || '',
    createdAt: new Date().toISOString()
  };

  reports.push(newReport);
  res.status(201).json({ message: 'Report added successfully', report: newReport });
});

app.get('/api/reports', isAuthenticated, (req, res) => {
  const sorted = [...reports].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sorted);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (Phase 1, in-memory mode)`);
});
