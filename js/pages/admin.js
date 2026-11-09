function AdminPage({t,onMenuClick,darkMode,setDarkMode,goBack,user,customQuizzes,setCustomQuizzes,managedQuizzes,setManagedQuizzes,deletedDefaults,setDeletedDefaults}){
  const [tab,setTab]=useState('overview');
  // Load real accounts from localStorage registry, excluding the admin account
  const loadRealUsers=()=>{
    try{
      const data=JSON.parse(localStorage.getItem('qm_accounts')||'{}');
      return Object.entries(data)
        .filter(([email])=>email!==ADMIN_EMAIL)
        .map(([email,acct],i)=>({
          id:i+1,
          name:acct.name||email.split('@')[0],
          email,
          quizzes:acct.quizzesDone||0,
          score:acct.xp||0,
          status:acct.status||'active',
          joinedAt:acct.joinedAt||null,
          avgAcc:acct.avgAcc||0,
          level:getLevelInfo(acct.xp||0).title,
        }));
    }catch(e){return [];}
  };
  const [users,setUsers]=useState(()=>loadRealUsers());
  // Refresh users list when component mounts
  useEffect(()=>setUsers(loadRealUsers()),[]);
  const quizzes=managedQuizzes||[];
  const setQuizzes=setManagedQuizzes;
  const [activity,setActivity]=useState([
    {text:'New user registered: Zara Ahmed',time:'2m ago',dot:'purple'},
    {text:'Quiz completed: World Geography',time:'5m ago',dot:'emerald'},
    {text:'Quiz generated: Roman History',time:'15m ago',dot:'sky'},
    {text:'Milestone: 1000 users hit Level 5',time:'1h ago',dot:'gold'},
    {text:'Monthly leaderboard reset',time:'3h ago',dot:'emerald'},
  ]);
  const [confirmModal,setConfirmModal]=useState(null);

  const bd=[{val:2840,color:'purple'},{val:1920,color:'sky'},{val:1540,color:'emerald'},{val:980,color:'gold'},{val:1260,color:'purple'},{val:2100,color:'sky'},{val:1750,color:'emerald'}];
  const mx=Math.max(...bd.map(b=>b.val));
  const modalStyle={position:'fixed',inset:0,background:'rgba(0,0,0,.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20};
  const cardStyle={background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--r3)',padding:28,width:'100%',maxWidth:440,position:'relative'};

  const suspendUser=(id)=>{
    const u=users.find(x=>x.id===id);
    if(!u)return;
    const newStatus=u.status==='active'?'suspended':'active';
    // Persist to ACCOUNTS
    const acct=ACCOUNTS.get(u.email.toLowerCase());
    if(acct)ACCOUNTS.set(u.email.toLowerCase(),{...acct,status:newStatus});
    setUsers(prev=>prev.map(x=>x.id===id?{...x,status:newStatus}:x));
    showToast(newStatus==='suspended'?'User suspended':'User reactivated',u.name,'info');
    setActivity(prev=>[{text:(newStatus==='suspended'?'Suspended: ':'Reactivated: ')+u.name,time:'Just now',dot:newStatus==='suspended'?'rose':'emerald'},...prev.slice(0,9)]);
  };
  const deleteUser=(id)=>{
    const u=users.find(x=>x.id===id);
    if(!u)return;
    // Remove from ACCOUNTS registry
    ACCOUNTS.delete(u.email.toLowerCase());
    setUsers(prev=>prev.filter(x=>x.id!==id));
    showToast('User deleted',u.name+' removed','error');
    setActivity(prev=>[{text:'Deleted user: '+u.name,time:'Just now',dot:'rose'},...prev.slice(0,9)]);
    setConfirmModal(null);
  };
  const deleteQuiz=(id)=>{
    const q=quizzes.find(x=>x.id===id)||(customQuizzes||[]).find(x=>x.id===id);
    const name=q?(q.title||q.name):'Quiz';
    if(q&&q.isDefault&&q.catId&&setDeletedDefaults) setDeletedDefaults(prev=>[...prev,q.catId]);
    setQuizzes(prev=>prev.filter(x=>x.id!==id));
    if(setCustomQuizzes) setCustomQuizzes(prev=>prev.filter(x=>x.id!==id));
    showToast('Quiz deleted',name+' removed','error');
    setActivity(prev=>[{text:'Deleted quiz: '+name,time:'Just now',dot:'rose'},...prev.slice(0,9)]);
    setConfirmModal(null);
  };
  const recoverQuiz=(catId)=>{
    const defaults=[
      {id:1,title:'Computer Science',category:'CS',questions:15,plays:3120,rating:4.8,active:true,catId:1,isDefault:true},
      {id:2,title:'Biology',category:'Biology',questions:15,plays:1540,rating:4.7,active:true,catId:2,isDefault:true},
      {id:3,title:'Geography',category:'Geography',questions:15,plays:1920,rating:4.6,active:true,catId:3,isDefault:true},
      {id:4,title:'Art & Culture',category:'Art',questions:15,plays:870,rating:4.5,active:true,catId:4,isDefault:true},
      {id:5,title:'Physics',category:'Physics',questions:15,plays:980,rating:4.5,active:true,catId:5,isDefault:true},
      {id:6,title:'Literature',category:'Literature',questions:15,plays:760,rating:4.6,active:true,catId:6,isDefault:true},
      {id:7,title:'History',category:'History',questions:15,plays:1340,rating:4.7,active:true,catId:7,isDefault:true},
      {id:8,title:'Mathematics',category:'Mathematics',questions:15,plays:1100,rating:4.8,active:true,catId:8,isDefault:true},
    ];
    const def=defaults.find(d=>d.catId===catId);
    if(!def)return;
    setQuizzes(prev=>[...prev,def]);
    if(setDeletedDefaults) setDeletedDefaults(prev=>prev.filter(x=>x!==catId));
    showToast('Quiz restored!',def.title+' is back','success');
    setActivity(prev=>[{text:'Restored: '+def.title,time:'Just now',dot:'emerald'},...prev.slice(0,9)]);
  };
  const toggleQuizActive=(id)=>{
    const q=quizzes.find(x=>x.id===id);
    setQuizzes(prev=>prev.map(x=>x.id===id?{...x,active:!x.active}:x));
    if(q) showToast(q.active?'Quiz disabled':'Quiz enabled',q.title,'info');
  };


  const allQuizzes=[...quizzes,...(customQuizzes||[]).map(c=>({id:c.id,title:c.name,category:c.category,questions:c.questionCount||5,plays:0,rating:5.0,active:true,isCustom:true}))];

  return h('div',{className:'page active'},
    confirmModal&&h('div',{style:modalStyle},
      h('div',{style:{...cardStyle,border:'1px solid rgba(244,63,94,.4)'}},
        h('div',{style:{fontSize:28,textAlign:'center',marginBottom:12}},'⚠️'),
        h('h3',{style:{fontFamily:'var(--font-display)',fontWeight:700,textAlign:'center',marginBottom:8}},'Confirm Delete'),
        h('p',{style:{fontSize:13,color:'var(--text2)',textAlign:'center',marginBottom:24}},'Delete '+confirmModal.type+' "'+confirmModal.name+'"? This cannot be undone.'),
        h('div',{style:{display:'flex',gap:10}},
          h('button',{className:'btn btn-ghost',style:{flex:1,justifyContent:'center'},onClick:()=>setConfirmModal(null)},'Cancel'),
          h('button',{className:'btn btn-danger',style:{flex:1,justifyContent:'center'},onClick:()=>confirmModal.type==='user'?deleteUser(confirmModal.id):deleteQuiz(confirmModal.id)},'Delete')
        )
      )
    ),
    h('div',{style:{maxWidth:1100,margin:'0 auto'}},
      h(TopBar,{title:t.admin,onMenuClick,onBack:goBack}),
      h('div',{className:'admin-content'},
        h('div',{className:'tabs',style:{marginBottom:20}},
          [[t.overviewTab,'overview'],[t.usersTab,'users'],[t.quizzesTab,'quizzes']].map(([label,key])=>h('button',{key,className:'tab'+(tab===key?' active':''),onClick:()=>setTab(key)},label))
        ),
        tab==='overview'&&h('div',null,
          h('div',{className:'grid-4',style:{marginBottom:20}},
            [
              ['U',(users.length).toString(),t.totalUsers,'purple',users.filter(u=>u.status==='active').length+' active — '+users.filter(u=>u.status==='suspended').length+' suspended'],
              ['Q',allQuizzes.length.toString(),t.totalQuizzes,'emerald',allQuizzes.filter(q=>q.active!==false).length+' active'],
              ['P',bd.reduce((s,b)=>s+b.val,0).toLocaleString(),t.playsToday,'gold','This week'],
              ['R',(allQuizzes.length?allQuizzes.reduce((s,q)=>s+(q.rating||5),0)/allQuizzes.length:5).toFixed(1),t.avgRating,'sky','Avg rating'],
            ].map(([icon,val,lbl,c,sub])=>h('div',{key:lbl,className:'stat-card '+c},h('div',{className:'stat-value'},val),h('div',{className:'stat-label'},lbl),h('div',{className:'stat-change up'},sub)))
          ),
          h('div',{className:'card',style:{marginBottom:20}},
            h('div',{className:'section-header'},h('div',null,h('div',{className:'section-title'},t.weeklyPlays),h('div',{className:'section-sub'},t.completionsByDay))),
            h('div',{className:'admin-chart'},bd.map((b,i)=>h('div',{key:i,className:'bar '+b.color,style:{height:(b.val/mx*100)+'%'},'data-val':b.val.toLocaleString()}))),
            h('div',{className:'chart-labels'},['M','T','W','T','F','S','S'].map((d,i)=>h('div',{key:i,className:'chart-label'},d)))
          ),
          h('div',{className:'grid-2'},
            h('div',{className:'card'},
              h('div',{className:'section-header'},h('div',null,h('div',{className:'section-title'},t.recentActivity))),
              activity.slice(0,6).map((a,i)=>h('div',{key:i,style:{display:'flex',gap:10,padding:'10px 0',borderBottom:'1px solid var(--border)',alignItems:'flex-start'}},
                h('div',{style:{width:8,height:8,borderRadius:'50%',background:'var(--'+(a.dot==='purple'?'accent2':a.dot)+')',marginTop:5,flexShrink:0}}),
                h('div',null,h('div',{style:{fontSize:13}},a.text),h('div',{style:{fontSize:11,color:'var(--text3)',marginTop:2}},a.time))
              ))
            ),
            h('div',{className:'card'},
              h('div',{className:'section-header'},h('div',null,h('div',{className:'section-title'},t.categoryBreakdown))),
              CATEGORIES.slice(0,5).map((c,i)=>{
                const pcts=[35,22,18,15,10];
                return h('div',{key:c.id,style:{marginBottom:12}},
                  h('div',{style:{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:4}},
                    h('span',null,c.emoji+' '+c.name),
                    h('span',{style:{color:'var(--text2)'}},pcts[i]+'%')
                  ),
                  h('div',{className:'progress-bar'},h('div',{className:'progress-fill purple',style:{width:pcts[i]+'%'}}))
                );
              })
            )
          )
        ),
        tab==='users'&&h('div',{className:'card'},
          h('div',{className:'table-scroll'},
            h('table',{className:'data-table',style:{width:'100%',minWidth:600}},
              h('thead',null,h('tr',null,
                h('th',null,'User'),h('th',null,'Email'),
                h('th',null,'Quizzes'),h('th',null,'XP'),
                h('th',null,'Level'),h('th',null,'Accuracy'),
                h('th',null,'Status'),h('th',null,'Actions')
              )),
              h('tbody',null,users.length===0
                ?h('tr',null,h('td',{colSpan:8,style:{textAlign:'center',padding:24,color:'var(--text3)'}},'No registered users yet.'))
                :users.map(u=>h('tr',{key:u.id,style:{background:u.status==='suspended'?'rgba(244,63,94,.04)':''}},
                  h('td',null,h('div',{style:{display:'flex',alignItems:'center',gap:8}},
                    h('div',{className:'avatar',style:{width:28,height:28,fontSize:10}},u.name.split(' ').map(n=>n[0]).join('').slice(0,2)),
                    h('span',{style:{fontWeight:500}},u.name)
                  )),
                  h('td',null,h('span',{style:{color:'var(--text2)',fontSize:12}},u.email)),
                  h('td',null,u.quizzes),
                  h('td',null,h('span',{style:{fontFamily:'var(--font-display)',fontWeight:700,color:'var(--accent3)'}},u.score.toLocaleString())),
                  h('td',null,h('span',{className:'badge badge-purple'},u.level||'Rookie')),
                  h('td',null,h('span',{style:{color:u.avgAcc>=80?'var(--emerald)':u.avgAcc>=50?'var(--gold)':'var(--text3)'}},u.avgAcc?u.avgAcc+'%':'—')),
                  h('td',null,h('span',{className:'badge badge-'+(u.status==='active'?'emerald':'rose')},u.status)),
                  h('td',null,h('div',{style:{display:'flex',gap:4}},
                    h('button',{className:'btn btn-ghost btn-sm',style:{color:u.status==='active'?'var(--gold)':'var(--emerald)'},onClick:()=>suspendUser(u.id)},u.status==='active'?'Suspend':'Activate'),
                    h('button',{className:'btn btn-danger btn-sm',onClick:()=>setConfirmModal({type:'user',id:u.id,name:u.name})},'Delete')
                  ))
                )))
            )
          )
        ),
        tab==='quizzes'&&h('div',null,
          h('div',{className:'card',style:{marginBottom:16}},
            h('div',{className:'table-scroll'},
              h('table',{className:'data-table',style:{width:'100%',minWidth:520}},
                h('thead',null,h('tr',null,h('th',null,'Quiz'),h('th',null,'Category'),h('th',null,'Qs'),h('th',null,'Plays'),h('th',null,'Rating'),h('th',null,'Status'),h('th',null,'Actions'))),
                h('tbody',null,allQuizzes.map(q=>h('tr',{key:q.id},
                  h('td',null,h('div',{style:{display:'flex',alignItems:'center',gap:6}},h('span',{style:{fontWeight:500}},q.title),q.isCustom&&h('span',{className:'badge badge-sky',style:{fontSize:10}},'Custom'))),
                  h('td',null,h('span',{className:'badge badge-purple'},q.category)),
                  h('td',null,q.questions),
                  h('td',null,(q.plays||0).toLocaleString()),
                  h('td',null,h('span',{style:{color:'var(--gold)'}},Number(q.rating||5).toFixed(1)+' ★')),
                  h('td',null,h('span',{className:'badge badge-'+(q.active!==false?'emerald':'rose')},q.active!==false?'Active':'Disabled')),
                  h('td',null,h('div',{style:{display:'flex',gap:4}},
                    !q.isCustom&&h('button',{className:'btn btn-ghost btn-sm',style:{color:q.active?'var(--gold)':'var(--emerald)'},onClick:()=>toggleQuizActive(q.id)},q.active?'Disable':'Enable'),
                    h('button',{className:'btn btn-danger btn-sm',onClick:()=>setConfirmModal({type:'quiz',id:q.id,name:q.title||q.name})},'Delete')
                  ))
                )))
              )
            )
          ),
          deletedDefaults&&deletedDefaults.length>0&&h('div',{className:'card'},
            h('div',{style:{fontFamily:'var(--font-display)',fontWeight:700,fontSize:14,marginBottom:12,color:'var(--rose)'}},'Deleted Quizzes — click Restore to bring them back'),
            h('div',{style:{display:'flex',gap:8,flexWrap:'wrap'}},
              deletedDefaults.map(catId=>{
                const names={1:'Computer Science',2:'Biology',3:'Geography',4:'Art & Culture',5:'Physics',6:'Literature',7:'History',8:'Mathematics'};
                return h('div',{key:catId,style:{display:'flex',alignItems:'center',gap:8,padding:'8px 12px',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'var(--r)'}},
                  h('span',{style:{fontSize:13}},names[catId]||'Quiz'),
                  h('button',{className:'btn btn-ghost btn-sm',style:{color:'var(--emerald)'},onClick:()=>recoverQuiz(catId)},'Restore')
                );
              })
            )
          )
        )
      )
    )
  );
}



