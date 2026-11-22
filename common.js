const firebaseConfig = {
  apiKey: "AIzaSyCsyS5B4qCQF9JLUPCqH4jewiWueWIDQ",
  authDomain: "galaxy-point-crm.firebaseapp.com",
  projectId: "galaxy-point-crm",
  storageBucket: "galaxy-point-crm.firebasestorage.app",
  messagingSenderId: "524715744830",
  appId: "1:524715744830:web:8307773b7c2eb5b2473b6f"
};

if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const db = firebase.firestore();

const key = 'gp_social_data';
const svcKey = 'gp_service_data';

function $(selector) { return document.querySelector(selector); }
function esc(str) { return str ? str.toString().replace(/[&<>'"]/g, tag => ({'&': '&amp;','<': '&lt;','>': '&gt;',"'": '&#39;','"': '&quot;'}[tag] || tag)) : ''; }
function format(num) { return '₹' + Number(num || 0).toLocaleString('en-IN'); }
function stamp() { return new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }); }

function nav(pageId) {
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('section').forEach(sec => sec.classList.add('hidden'));
    
    const activeBtn = document.querySelector(`nav button[data-nav="${pageId}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    const activeSec = document.querySelector(`section[data-page="${pageId}"]`);
    if (activeSec) activeSec.classList.remove('hidden');

    if (typeof render === 'function') render();
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('nav button').forEach(btn => {
        btn.addEventListener('click', () => nav(btn.dataset.nav));
    });
});

function get(k) { const data = localStorage.getItem(k); return data ? JSON.parse(data) : []; }
function put(k, data) {
    localStorage.setItem(k, JSON.stringify(data));
    if (k === key) db.collection('crm_data').doc('social').set({ list: data });
    else if (k === svcKey) db.collection('crm_data').doc('service').set({ list: data });
    if (typeof render === 'function') render();
}

// Real-time Sync from Firebase
db.collection('crm_data').doc('social').onSnapshot(doc => {
    if (doc.exists) { localStorage.setItem(key, JSON.stringify(doc.data().list || [])); if (typeof render === 'function') render(); }
});
db.collection('crm_data').doc('service').onSnapshot(doc => {
    if (doc.exists) { localStorage.setItem(svcKey, JSON.stringify(doc.data().list || [])); if (typeof render === 'function') render(); }
});
