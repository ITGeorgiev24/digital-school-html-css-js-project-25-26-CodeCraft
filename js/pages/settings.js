function SettingsPage({t,onMenuClick,darkMode,setDarkMode,onLogout,lang,setLang,soundsOn,setSoundsOn,goBack,user,setUser}){
  const [showDeleteModal,setShowDeleteModal]=useState(false);
  const settings=user&&user.settings?user.settings:{notifs:true,smart:true,public:true};
  const [showPwModal,setShowPwModal]=useState(false);
  const [pwForm,setPwForm]=useState({current:'',next:'',confirm:''});
  const [pwErr,setPwErr]=useState('');
  const [showUsernameModal,setShowUsernameModal]=useState(false);
  const [newUsername,setNewUsername]=useState('');
  const [usernameErr,setUsernameErr]=useState('');
  const toggle=(k)=>{
    const newVal=!(settings[k]);
    setUser(prev=>{
      const upd={...prev,settings:{...(prev.settings||{}), [k]:newVal}};
      saveSession(upd);
      return upd;
    });
    showToast(t.settingsSaved,t.settingsSavedDesc,'success');
  };
  const handleChangePw=()=>{
    setPwErr('');
    if(!pwForm.current||!pwForm.next||!pwForm.confirm){setPwErr('Please fill in all fields.');return;}
    if(pwForm.next.length<6){setPwErr('New password must be at least 6 characters.');return;}
    if(pwForm.next!==pwForm.confirm){setPwErr('New passwords do not match.');return;}
    const email=user&&user.email?user.email.toLowerCase():null;
    if(!email){setPwErr('Not logged in.');return;}
    const acct=ACCOUNTS.get(email);
    if(!acct){setPwErr('Account not found.');return;}
    if(acct.password!==pwForm.current){setPwErr('Current password is incorrect.');return;}
    ACCOUNTS.set(email,{...acct,password:pwForm.next});
    setShowPwModal(false);
    setPwForm({current:'',next:'',confirm:''});
    showToast(t.passwordChanged,t.passwordUpdatedDesc,'success');
  };
  const handleChangeUsername=()=>{
    setUsernameErr('');
    if(!newUsername.trim()){setUsernameErr('Please enter a new username.');return;}
    if(newUsername.trim().length<2){setUsernameErr('Username must be at least 2 characters.');return;}
    const email=user&&user.email?user.email.toLowerCase():null;
    if(!email){setUsernameErr('Not logged in.');return;}
    const acct=ACCOUNTS.get(email);
    if(acct)ACCOUNTS.set(email,{...acct,name:newUsername.trim()});
    setUser(prev=>{const upd={...prev,name:newUsername.trim()};saveSession(upd);return upd;});
    setShowUsernameModal(false);
    setNewUsername('');
    showToast(t.usernameSaved,t.usernameSavedDesc,'success');
  };
  const inputSt={width:'100%',padding:'9px 12px',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'var(--r)',color:'var(--text)',fontSize:14,boxSizing:'border-box',outline:'none',marginTop:4};
  return h('div',{className:'page active'},
    showUsernameModal&&h('div',{style:{position:'fixed',inset:0,background:'rgba(0,0,0,.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}},
      h('div',{style:{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--r3)',padding:28,width:'100%',maxWidth:400}},
        h('h3',{style:{fontFamily:'var(--font-display)',fontWeight:700,marginBottom:20}},t.changeUsername),
        h('div',{style:{marginBottom:8}},h('label',{style:{fontSize:12,fontWeight:600,color:'var(--text2)',display:'block',marginBottom:4}},t.newUsername),h('input',{style:inputSt,type:'text',placeholder:user&&user.name?user.name:'',value:newUsername,onChange:e=>{setNewUsername(e.target.value);setUsernameErr('');},onKeyDown:e=>e.key==='Enter'&&handleChangeUsername(),autoFocus:true})),
        usernameErr&&h('div',{style:{fontSize:12,color:'var(--rose)',marginBottom:12,padding:'8px 12px',background:'rgba(244,63,94,.08)',borderRadius:'var(--r)',border:'1px solid rgba(244,63,94,.2)'}},usernameErr),
        h('div',{style:{display:'flex',gap:8,marginTop:16}},
          h('button',{className:'btn btn-ghost',style:{flex:1,justifyContent:'center'},onClick:()=>{setShowUsernameModal(false);setNewUsername('');setUsernameErr('');}},t.cancelBtn),
          h('button',{className:'btn btn-primary',style:{flex:1,justifyContent:'center'},onClick:handleChangeUsername},t.saveUsername)
        )
      )
    ),
    showPwModal&&h('div',{style:{position:'fixed',inset:0,background:'rgba(0,0,0,.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}},
      h('div',{style:{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--r3)',padding:28,width:'100%',maxWidth:400}},
        h('h3',{style:{fontFamily:'var(--font-display)',fontWeight:700,marginBottom:20}},t.changePassword),
        h('div',{style:{marginBottom:12}},h('label',{style:{fontSize:12,fontWeight:600,color:'var(--text2)',display:'block',marginBottom:4}},t.currentPassword),h('input',{style:inputSt,type:'password',placeholder:'••••••••',value:pwForm.current,onChange:e=>setPwForm({...pwForm,current:e.target.value})})),
        h('div',{style:{marginBottom:12}},h('label',{style:{fontSize:12,fontWeight:600,color:'var(--text2)',display:'block',marginBottom:4}},t.newPassword),h('input',{style:inputSt,type:'password',placeholder:'Min. 6 characters',value:pwForm.next,onChange:e=>setPwForm({...pwForm,next:e.target.value})})),
        h('div',{style:{marginBottom:16}},h('label',{style:{fontSize:12,fontWeight:600,color:'var(--text2)',display:'block',marginBottom:4}},t.confirmPassword),h('input',{style:inputSt,type:'password',placeholder:'Re-enter new password',value:pwForm.confirm,onChange:e=>setPwForm({...pwForm,confirm:e.target.value}),onKeyDown:e=>e.key==='Enter'&&handleChangePw()})),
        pwErr&&h('div',{style:{fontSize:12,color:'var(--rose)',marginBottom:12,padding:'8px 12px',background:'rgba(244,63,94,.08)',borderRadius:'var(--r)',border:'1px solid rgba(244,63,94,.2)'}},pwErr),
        h('div',{style:{display:'flex',gap:8}},
          h('button',{className:'btn btn-ghost',style:{flex:1,justifyContent:'center'},onClick:()=>{setShowPwModal(false);setPwForm({current:'',next:'',confirm:''});setPwErr('');}},t.cancelBtn),
          h('button',{className:'btn btn-primary',style:{flex:1,justifyContent:'center'},onClick:handleChangePw},t.savePassword)
        )
      )
    ),
    showDeleteModal&&h('div',{style:{position:'fixed',inset:0,background:'rgba(0,0,0,.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}},
      h('div',{style:{background:'var(--bg2)',border:'1px solid rgba(244,63,94,.4)',borderRadius:'var(--r3)',padding:28,maxWidth:420,width:'100%',boxShadow:'0 0 40px rgba(244,63,94,.15)'}},
        h('div',{style:{fontSize:28,marginBottom:12,textAlign:'center'}},'⚠'),
        h('h3',{style:{fontFamily:'var(--font-display)',fontWeight:700,fontSize:18,textAlign:'center',marginBottom:8}},'Delete your account?'),
        h('p',{style:{fontSize:13,color:'var(--text2)',textAlign:'center',lineHeight:1.6,marginBottom:24}},'This will permanently delete your account, all your XP, quiz history, and achievements. This action cannot be undone.'),
        h('div',{style:{display:'flex',gap:10}},
          h('button',{className:'btn btn-ghost',style:{flex:1,justifyContent:'center'},onClick:()=>setShowDeleteModal(false)},'Cancel'),
          h('button',{className:'btn btn-danger',style:{flex:1,justifyContent:'center'},onClick:()=>{if(window._currentUserEmail)ACCOUNTS.delete(window._currentUserEmail.toLowerCase());setShowDeleteModal(false);showToast(t.accountDeleted,t.accountDeletedDesc,'error');setTimeout(()=>onLogout(),800);}},'Yes, delete it')
        )
      )
    ),
    h('div',{style:{maxWidth:1100,margin:'0 auto'}},
    h(TopBar,{title:t.settings,onMenuClick,darkMode,setDarkMode,onBack:goBack}),
    h('div',{className:'p-section'},h('div',{style:{maxWidth:580}},
      h('div',{className:'card card-lg',style:{marginBottom:16}},
        h('div',{style:{fontFamily:'var(--font-display)',fontWeight:700,fontSize:16,marginBottom:16}},t.appearance),
        h('div',{className:'settings-row'},h('div',null,h('div',{className:'settings-label'},t.darkMode),h('div',{className:'settings-desc'},t.darkModeDesc)),h('button',{className:'toggle'+(darkMode?' on':''),onClick:()=>{setDarkMode(d=>!d);showToast(t.settingsSaved,t.settingsSavedDesc,'success');}})),
        h('div',{className:'settings-row'},h('div',null,h('div',{className:'settings-label'},t.language),h('div',{className:'settings-desc'},t.languageDesc)),h('select',{className:'select',value:lang,onChange:e=>{setLang(e.target.value);showToast(t.settingsSaved,t.settingsSavedDesc,'success');}},LANG_KEYS.map(k=>h('option',{key:k,value:k},k))))
      ),
      h('div',{className:'card card-lg',style:{marginBottom:16}},
        h('div',{style:{fontFamily:'var(--font-display)',fontWeight:700,fontSize:16,marginBottom:16}},t.notifSection),
        [['notifs',t.pushNotifs,t.pushNotifsDesc],].map(([k,label,desc])=>h('div',{key:k,className:'settings-row'},h('div',null,h('div',{className:'settings-label'},label),h('div',{className:'settings-desc'},desc)),h('button',{className:'toggle'+(settings[k]?' on':''),onClick:()=>toggle(k)}))),
        h('div',{className:'settings-row'},h('div',null,h('div',{className:'settings-label'},t.soundFx),h('div',{className:'settings-desc'},t.soundFxDesc)),h('button',{className:'toggle'+(soundsOn?' on':''),onClick:()=>{const v=!soundsOn;setSoundsOn(v);window._soundsOn=v;if(v)playCorrect();showToast(t.settingsSaved,v?'Sound on':'Sound off','success');}}))
      ),
      h('div',{className:'card card-lg'},
        h('div',{style:{fontFamily:'var(--font-display)',fontWeight:700,fontSize:16,marginBottom:16}},t.privacyAI),
        [['smart',t.smartSuggestions,t.smartSuggestionsDesc],['public',t.publicProfile,t.publicProfileDesc]].map(([k,label,desc])=>h('div',{key:k,className:'settings-row'},h('div',null,h('div',{className:'settings-label'},label),h('div',{className:'settings-desc'},desc)),h('button',{className:'toggle'+(settings[k]?' on':''),onClick:()=>toggle(k)}))),
        h('div',{style:{marginTop:20,paddingTop:16,borderTop:'1px solid var(--border)'}},
          h('div',{className:'settings-row'},
            h('div',null,h('div',{className:'settings-label'},t.changeUsername),h('div',{className:'settings-desc'},'Update your display name')),
            h('button',{className:'btn btn-ghost btn-sm',onClick:()=>{setNewUsername(user&&user.name?user.name:'');setShowUsernameModal(true);}},t.changeUsername)
          ),
          h('div',{className:'settings-row'},
            h('div',null,h('div',{className:'settings-label'},t.changePassword),h('div',{className:'settings-desc'},'Update your account password')),
            h('button',{className:'btn btn-ghost btn-sm',onClick:()=>setShowPwModal(true)},t.changePassword)
          ),
          h('div',{className:'settings-row'},
            h('div',null,h('div',{className:'settings-label',style:{color:'var(--rose)'}},t.deleteAccount),h('div',{className:'settings-desc'},'Permanently remove your account')),
            h('button',{className:'btn btn-danger btn-sm',onClick:()=>setShowDeleteModal(true)},t.deleteAccount)
          ),
          h('div',{className:'settings-row'},
            h('div',null,h('div',{className:'settings-label'},t.logoutBtn),h('div',{className:'settings-desc'},'Sign out of your account')),
            h('button',{className:'btn btn-ghost btn-sm',style:{display:'flex',alignItems:'center',gap:6},onClick:onLogout},icons.logout,' ',t.logoutBtn)
          )
        )
      )
    ))
  ));
}