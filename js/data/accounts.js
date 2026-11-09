const ADMIN_EMAIL='admin@gmail.com';
const ADMIN_CREDENTIALS={name:'admin',password:'admin2026',joinedAt:1777593600000,isAdmin:true};
const ACCOUNTS={
  _load(){try{return JSON.parse(localStorage.getItem('qm_accounts')||'{}');}catch(e){return{};}},
  _save(data){try{localStorage.setItem('qm_accounts',JSON.stringify(data));}catch(e){}},
  has(email){return email in this._load();},
  get(email){return this._load()[email]||null;},
  set(email,val){const d=this._load();d[email]=val;this._save(d);},
  delete(email){const d=this._load();delete d[email];this._save(d);},
};
// Seed admin account if not already registered
(()=>{
  const _existing=ACCOUNTS.get(ADMIN_EMAIL)||{};
  ACCOUNTS.set(ADMIN_EMAIL,{..._existing,...ADMIN_CREDENTIALS,joinedAt:1777593600000,isAdmin:true});
})();
// Seed demo user accounts (leaderboard users)
(()=>{
  const demoUsers=[
    {email:'alex.chen@example.com',name:'Alex Chen',password:'demo1234',xp:9840,quizzesDone:47,avgAcc:92,joinedAt:1690000000000},
    {email:'sarah.kim@example.com',name:'Sarah Kim',password:'demo1234',xp:9120,quizzesDone:39,avgAcc:88,joinedAt:1692000000000},
    {email:'marcus.johnson@example.com',name:'Marcus Johnson',password:'demo1234',xp:8750,quizzesDone:31,avgAcc:85,joinedAt:1694000000000},
    {email:'priya.patel@example.com',name:'Priya Patel',password:'demo1234',xp:8340,quizzesDone:28,avgAcc:83,joinedAt:1695000000000},
    {email:'lena.mueller@example.com',name:'Lena Mueller',password:'demo1234',xp:4680,quizzesDone:19,avgAcc:74,joinedAt:1696000000000},
    {email:'omar.hassan@example.com',name:'Omar Hassan',password:'demo1234',xp:3210,quizzesDone:14,avgAcc:68,joinedAt:1697000000000},
    {email:'fatima.alrashid@example.com',name:'Fatima Al-Rashid',password:'demo1234',xp:1890,quizzesDone:9,avgAcc:61,joinedAt:1698000000000},
    {email:'james.wright@example.com',name:'James Wright',password:'demo1234',xp:940,quizzesDone:5,avgAcc:55,joinedAt:1699000000000},
    {email:'mei.lin@example.com',name:'Mei Lin',password:'demo1234',xp:320,quizzesDone:2,avgAcc:48,joinedAt:1699500000000},
  ];
  demoUsers.forEach(u=>{if(!ACCOUNTS.has(u.email))ACCOUNTS.set(u.email,{name:u.name,password:u.password,joinedAt:u.joinedAt,xp:u.xp,quizzesDone:u.quizzesDone,avgAcc:u.avgAcc,history:[],achievements:[],status:'active'});});
})();

// Check if current user is admin
function isAdminUser(user){return user&&user.email&&user.email.toLowerCase()===ADMIN_EMAIL;}

// Session persistence - works on both file:// and http://
// We store progress inside the ACCOUNTS registry so it persists with the account
function saveSession(user){
  if(!user||!user.email)return;
  try{
    // Save full progress into ACCOUNTS so it persists across logins
    const acct=ACCOUNTS.get(user.email.toLowerCase());
    if(acct){
      ACCOUNTS.set(user.email.toLowerCase(),{...acct,
        xp:user.xp,quizzesDone:user.quizzesDone,avgAcc:user.avgAcc,
        history:user.history,achievements:user.achievements,unreadCount:user.unreadCount,
        avatar:user.avatar||null,
        settings:user.settings||{notifs:true,smart:true,public:true,sounds:true}
      });
    }
    // Also try localStorage (works on http://)
    localStorage.setItem('qm_session',JSON.stringify(user));
  }catch(e){}
}
function loadSession(){
  try{const s=localStorage.getItem('qm_session');return s?JSON.parse(s):null;}catch(e){return null;}
}
function clearSession(){
  try{localStorage.removeItem('qm_session');}catch(e){}
}


