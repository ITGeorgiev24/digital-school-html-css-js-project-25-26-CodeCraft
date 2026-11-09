function App(){
  const [page,_setPageRaw]=useState(()=>{
    try{const e=localStorage.getItem('qm_logged_in');if(e){const a=ACCOUNTS.get(e);if(a&&a.name)return 'dashboard';}return 'landing';}catch(x){return 'landing';}
  });
  const setPage=p=>_setPageRaw(p);
  const [user,setUser]=useState(()=>{
    try{
      const e=localStorage.getItem('qm_logged_in');
      if(e){const a=ACCOUNTS.get(e);if(a&&a.name){window._currentUserEmail=e;return{name:a.name,email:e,xp:a.xp||0,quizzesDone:a.quizzesDone||0,avgAcc:a.avgAcc||0,history:a.history||[],achievements:a.achievements||[],joinedAt:a.joinedAt||Date.now(),unreadCount:a.unreadCount||0,avatar:a.avatar||null,settings:a.settings||{notifs:true,ai:true,public:true,sounds:true}};}}
    }catch(x){}
    return{name:'',email:'',xp:0,quizzesDone:0,avgAcc:0,history:[],achievements:[],joinedAt:null,unreadCount:2,settings:{notifs:true,ai:true,public:true,sounds:true}};
  });
  const [lang,setLang]=useState('English');
  const langRef=React.useRef('English');
  React.useEffect(()=>{langRef.current=lang;},[lang]);
  const [darkMode,setDarkMode]=useState(true);
  const [notifications,setNotifications]=useState(DEFAULT_NOTIFS);
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const [soundsOn,setSoundsOn]=useState(true);
  const t=LANGS[lang]||LANGS.English;
 
  useEffect(()=>{document.body.classList.toggle('light',!darkMode);},[darkMode]);
  useEffect(()=>{
    if(user&&user.name){
      saveSession(user);
    }else if(user&&!user.name){
      clearSession();
    }
  },[user]);
  useEffect(()=>{window._soundsOn=soundsOn;},[soundsOn]);
 
  const withSidebar=['dashboard','quiz','leaderboard','stats','profile','settings','admin','notifications'];
  const isSidebar=withSidebar.includes(page);
  const navTo=p=>{
    if(!withSidebar.includes(p))setSidebarOpen(false);
    if(p==='admin'&&!isAdminUser(user)){setPage('dashboard');return;}
    if(page==='quiz'&&quizPhaseRef.current==='playing'&&p!=='quiz'&&quizPhaseRef.current!=='results'){setPendingNav(p);setShowNavQuitModal(true);return;}
    setPage(p);
    window.scrollTo({top:0,behavior:'smooth'});
    setSidebarOpen(false);
    // Push state so browser back stays within app
    if(window.history&&window.history.pushState){
      window.history.pushState({page:p},'',window.location.pathname);
    }
  };
  const login=(name,email,joinedAt)=>{
    window._currentUserEmail=email;
    try{localStorage.setItem('qm_logged_in',email.toLowerCase());}catch(x){}
    setUser(u=>{
      // Restore saved progress from ACCOUNTS registry
      const acct=ACCOUNTS.get(email.toLowerCase())||{};
      const updated={
        ...u,name,email,
        joinedAt:joinedAt||acct.joinedAt||u.joinedAt||Date.now(),
        xp:acct.xp||u.xp||0,
        quizzesDone:acct.quizzesDone||u.quizzesDone||0,
        avgAcc:acct.avgAcc||u.avgAcc||0,
        history:acct.history||u.history||[],
        achievements:acct.achievements||u.achievements||[],
        unreadCount:acct.unreadCount||u.unreadCount||0,
        avatar:acct.avatar||u.avatar||null,
        settings:acct.settings||u.settings||{notifs:true,ai:true,public:true,sounds:true},
      };
      saveSession(updated);
      return updated;
    });
    // Push two history entries so back never exits the app
    if(window.history&&window.history.pushState){
      window.history.pushState({page:'dashboard'},'',window.location.pathname);
      window.history.pushState({page:'dashboard'},'',window.location.pathname);
    }
  };
  const logout=()=>{clearSession();try{localStorage.removeItem('qm_logged_in');}catch(x){}window._currentUserEmail=undefined;setUser({name:'',email:'',xp:0,quizzesDone:0,avgAcc:0,history:[],achievements:[],joinedAt:null,unreadCount:2,settings:{notifs:true,ai:true,public:true,sounds:true}});showToast(t.loggedOut,t.loggedOutDesc,'info');navTo('landing');};
  const onMenuClick=()=>setSidebarOpen(s=>!s);
 
  const onQuizComplete=useCallback(result=>{
    setUser(prev=>{
      const newXP=(prev.xp||0)+result.xp;
      const newDone=(prev.quizzesDone||0)+1;
      const newHistory=[...(prev.history||[]),result];
      const allAcc=newHistory.map(h=>h.pct);
      const newAvg=Math.round(allAcc.reduce((s,a)=>s+a,0)/allAcc.length);
      const oldLvl=getLevelInfo(prev.xp||0).level;
      const newLvl=getLevelInfo(newXP).level;
      if(newLvl>oldLvl)setTimeout(()=>{playLevelUp();showToast('🎉 '+t.levelUp,t.youReachedLevel+' '+newLvl+': '+getLevelInfo(newXP).title,'gold');
            setTimeout(()=>{if(window.launchConfetti)window.launchConfetti(2000);},400);},400);
      const earned=[...(prev.achievements||[])];
      if(newDone>=1&&!earned.includes(1)){earned.push(1);setTimeout(()=>showToast('🏆 Achievement!','First Win unlocked!','gold'),600);}
      if(result.speed&&!earned.includes(2)){earned.push(2);setTimeout(()=>showToast('⚡ Achievement!','Speed Demon unlocked!','gold'),600);}
      if(newDone>=5&&!earned.includes(3)){earned.push(3);setTimeout(()=>showToast('🔥 Achievement!','On a Roll unlocked!','gold'),600);}
      if(result.perfect&&!earned.includes(4)){earned.push(4);setTimeout(()=>showToast('🎯 Achievement!','Perfect Score unlocked!','gold'),600);}
      if(newXP>=900&&!earned.includes(5)){earned.push(5);setTimeout(()=>showToast('🌟 Achievement!','Scholar unlocked!','gold'),600);}
      if(newDone>=10&&!earned.includes(6)){earned.push(6);setTimeout(()=>showToast('📚 Achievement!','Dedicated unlocked!','gold'),600);}
      if(newXP>=500&&!earned.includes(7)){earned.push(7);setTimeout(()=>showToast('🧠 Achievement!','Brainiac unlocked!','gold'),600);}
      if(newXP>=5000&&!earned.includes(8)){earned.push(8);setTimeout(()=>showToast('👑 Achievement!','Grandmaster unlocked!','gold'),600);}
      const newNotif={id:Date.now(),title:'✅ Quiz completed!',body:(result.catEmoji||'🎓')+' '+result.catName+' — '+result.correct+'/'+result.total+' correct · +'+result.xp+' XP',time:'Just now',unread:true};
      // Smart suggestions: generate a personalised tip if enabled
      const smartOn=!prev.settings||prev.settings.smart!==false;
      const suggNotifs=[];
      if(smartOn){
        const tCur=LANGS[langRef.current]||LANGS.English;
        // Suggest untried categories
        const triedIds=new Set(newHistory.map(h=>h.catId));
        const untried=CATEGORIES.filter(c=>!triedIds.has(c.id));
        if(untried.length>0&&Math.random()<0.6){
          const pick=untried[Math.floor(Math.random()*untried.length)];
          suggNotifs.push({id:Date.now()+1,title:'💡 '+tCur.suggNewTip,body:tCur.suggUntriedPrefix+' '+pick.emoji+' '+pick.name+' '+tCur.suggUntriedSuffix,time:'Just now',unread:true,isSuggestion:true});
        }
        // Suggest improvement if accuracy < 60%
        const catAccuracy={};
        newHistory.forEach(h=>{if(!catAccuracy[h.catId])catAccuracy[h.catId]={total:0,sum:0};catAccuracy[h.catId].total++;catAccuracy[h.catId].sum+=h.pct;});
        const weakCats=CATEGORIES.filter(c=>catAccuracy[c.id]&&catAccuracy[c.id].total>=1&&(catAccuracy[c.id].sum/catAccuracy[c.id].total)<60);
        if(weakCats.length>0&&Math.random()<0.5){
          const weak=weakCats[Math.floor(Math.random()*weakCats.length)];
          const avgPct=Math.round(catAccuracy[weak.id].sum/catAccuracy[weak.id].total);
          suggNotifs.push({id:Date.now()+2,title:'📈 '+tCur.suggWeak,body:weak.emoji+' '+weak.name+': '+tCur.suggWeakBody+' '+avgPct+'%. '+tCur.suggWeakSuffix,time:'Just now',unread:true,isSuggestion:true});
        }
        // Milestones
        if(newDone===5)suggNotifs.push({id:Date.now()+3,title:tCur.suggFive,body:'',time:'Just now',unread:true,isSuggestion:true});
        if(newDone===10)suggNotifs.push({id:Date.now()+4,title:tCur.suggTen,body:'',time:'Just now',unread:true,isSuggestion:true});
        if(result.pct===100){setTimeout(()=>{if(window.launchConfetti)window.launchConfetti(3000);},300);}
      if(result.pct===100)suggNotifs.push({id:Date.now()+5,title:tCur.suggPerfect,body:'',time:'Just now',unread:true,isSuggestion:true});
      }
      setNotifications(n=>[newNotif,...suggNotifs,...n.slice(0,8)]);
      const newUser={...prev,xp:newXP,quizzesDone:newDone,avgAcc:newAvg,history:newHistory,achievements:earned,unreadCount:(prev.unreadCount||0)+1};
      // Save immediately so progress is never lost
      saveSession(newUser);
      return newUser;
    });
  },[]);
 
  useEffect(()=>{
    const ov=document.getElementById('sidebar-overlay');
    if(!ov)return;
    const h=()=>setSidebarOpen(false);
    ov.addEventListener('click',h);return()=>ov.removeEventListener('click',h);
  },[]);
  useEffect(()=>{
    const ov=document.getElementById('sidebar-overlay');
    if(ov)ov.classList.toggle('visible',sidebarOpen&&isSidebar);
    document.body.style.overflow=sidebarOpen&&isSidebar?'hidden':'';
  },[sidebarOpen,isSidebar]);
 
  // On load, if already logged in, seed history so the first "back" press
  // is caught by our popstate handler instead of leaving the app entirely
  useEffect(()=>{
    if(user.name&&window.history&&window.history.pushState){
      window.history.replaceState({page:'dashboard'},'',window.location.pathname);
      window.history.pushState({page:'dashboard'},'',window.location.pathname);
    }
  },[]);

  // Intercept browser back button — if logged in, stay in app
  useEffect(()=>{
    const onPop=(e)=>{
      if(user.name){
        // Re-push so they can never go back past the logged-in wall
        window.history.pushState({page:'dashboard'},'',window.location.pathname);
        // If already on dashboard, back should not navigate anywhere further
        if(page==='dashboard')return;
        // Navigate to prev page if state has one, else dashboard
        const target=(e.state&&e.state.page&&e.state.page!=='landing'&&e.state.page!=='login'&&e.state.page!=='register')?e.state.page:'dashboard';
        setPage(target);
        window.scrollTo({top:0,behavior:'smooth'});
      }
    };
    window.addEventListener('popstate',onPop);
    return()=>window.removeEventListener('popstate',onPop);
  },[user.name,page]);
 
  const shared={t,onMenuClick,darkMode,setDarkMode,goBack:()=>navTo('dashboard')};
  const quizPhaseRef=React.useRef('categories');
  const [quizActive,setQuizActive]=useState(false);
  const [showNavQuitModal,setShowNavQuitModal]=useState(false);
  const [pendingNav,setPendingNav]=useState(null);
  // Custom quizzes created in Admin panel
  const [customQuizzes,setCustomQuizzes]=useState([]);
  // Managed quiz overrides from Admin (title, active status, question count changes)
  const DEFAULT_MANAGED=[
    {id:1,title:'Computer Science',category:'CS',questions:15,plays:3120,rating:4.8,active:true,catId:1,isDefault:true},
    {id:2,title:'Biology',category:'Biology',questions:15,plays:1540,rating:4.7,active:true,catId:2,isDefault:true},
    {id:3,title:'Geography',category:'Geography',questions:15,plays:1920,rating:4.6,active:true,catId:3,isDefault:true},
    {id:4,title:'Art & Culture',category:'Art',questions:15,plays:870,rating:4.5,active:true,catId:4,isDefault:true},
    {id:5,title:'Physics',category:'Physics',questions:15,plays:980,rating:4.5,active:true,catId:5,isDefault:true},
    {id:6,title:'Literature',category:'Literature',questions:15,plays:760,rating:4.6,active:true,catId:6,isDefault:true},
    {id:7,title:'History',category:'History',questions:15,plays:1340,rating:4.7,active:true,catId:7,isDefault:true},
    {id:8,title:'Mathematics',category:'Mathematics',questions:15,plays:1100,rating:4.8,active:true,catId:8,isDefault:true},
  ];
  const [managedQuizzes,setManagedQuizzes]=useState(DEFAULT_MANAGED);
  const [deletedDefaults,setDeletedDefaults]=useState([]); // tracks deleted default catIds for recovery
 
  return h('div',{className:'app'},
    showNavQuitModal&&h('div',{style:{position:'fixed',inset:0,background:'rgba(0,0,0,.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000,padding:20}},
      h('div',{style:{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--r3)',padding:28,width:'100%',maxWidth:360,textAlign:'center'}},
        h('div',{style:{fontSize:32,marginBottom:12}},'🚪'),
        h('h3',{style:{fontFamily:'var(--font-display)',fontWeight:700,marginBottom:8,fontSize:18}},'Leave quiz?'),
        h('p',{style:{fontSize:13,color:'var(--text2)',marginBottom:24}},'Your progress will be lost if you leave now.'),
        h('div',{style:{display:'flex',gap:10}},
          h('button',{className:'btn btn-ghost',style:{flex:1,justifyContent:'center'},onClick:()=>{setShowNavQuitModal(false);setPendingNav(null);}},'Keep playing'),
          h('button',{className:'btn btn-danger',style:{flex:1,justifyContent:'center'},onClick:()=>{quizPhaseRef.current='categories';setQuizActive(false);setShowNavQuitModal(false);setPage(pendingNav||'dashboard');setPendingNav(null);}},'Leave')
        )
      )
    ),
    isSidebar&&h(Sidebar,{page,setPage:navTo,user,t,onLogout:logout,sidebarOpen,setSidebarOpen,notifications,quizActive}),
    h('div',{className:isSidebar?'main-content':'non-sidebar-content'},
      page==='landing'&&h(LandingPage,{setPage:navTo,t,darkMode,setDarkMode}),
      page==='login'&&h(LoginPage,{setPage:navTo,onLogin:login,t}),
      page==='register'&&h(RegisterPage,{setPage:navTo,onLogin:login,t}),
      page==='forgot'&&h(ForgotPage,{setPage:navTo,t}),
      page==='dashboard'&&h(DashboardPage,{setPage:navTo,user,...shared}),
      page==='quiz'&&h(QuizPage,{setPage:navTo,user,onQuizComplete,customQuizzes,managedQuizzes,quizPhaseRef,setQuizActive,...shared}),
      page==='leaderboard'&&h(LeaderboardPage,{user,...shared}),
      page==='stats'&&h(StatsPage,{user,...shared}),
      page==='profile'&&h(ProfilePage,{user,setUser,...shared}),
      page==='admin'&&isAdminUser(user)&&h(AdminPage,{...shared,user,customQuizzes,setCustomQuizzes,managedQuizzes,setManagedQuizzes,deletedDefaults,setDeletedDefaults}),
      page==='notifications'&&h(NotificationsPage,{notifications,setNotifications,...shared}),
      page==='settings'&&h(SettingsPage,{...shared,onLogout:logout,lang,setLang,soundsOn,setSoundsOn,user,setUser})
    )
  );
}
 
ReactDOM.createRoot(document.getElementById('root')).render(h(App));