function LoginPage({setPage,onLogin,t}){
  const [email,setEmail]=useState('');const [pass,setPass]=useState('');
  const [err,setErr]=useState('');
  const handle=()=>{
    setErr('');
    if(!email||!pass){setErr('Please fill in all fields.');return;}
    const acct=ACCOUNTS.get(email.toLowerCase());
    if(!acct){setErr('No account found with this email. Please sign up first.');return;}
    if(acct.password!==pass){setErr('Incorrect password. Please try again.');return;}
    if(acct.status==='suspended'){setErr('This account has been suspended. Please contact the administrator.');return;}
    onLogin(acct.name,email,acct.joinedAt);playStart();
    showToast(t.welcomeBack+', '+acct.name+'!','','success');
    setPage('dashboard');
  };
  return h('div',{className:'auth-page'},
    h('div',{className:'hero-bg'},h('div',{className:'orb orb-1',style:{opacity:.06}}),h('div',{className:'orb orb-2',style:{opacity:.06}})),
    h('div',{className:'auth-card'},
      h('div',{style:{textAlign:'center',marginBottom:28}},h('div',{className:'logo-icon',style:{width:44,height:44,margin:'0 auto 12px',fontSize:22}},'⚡')),
      h('h2',{className:'auth-title',style:{textAlign:'center'}},t.welcomeBack),
      h('p',{className:'auth-sub',style:{textAlign:'center',marginBottom:24}},t.signInSub),
      h('div',{className:'form-group'},h('label',{className:'form-label'},t.email),h('input',{className:'form-input',type:'email',placeholder:'you@example.com',value:email,onChange:e=>{setEmail(e.target.value);setErr('');}})),
      h('div',{className:'form-group'},
        h('label',{className:'form-label',style:{display:'flex',justifyContent:'space-between'}},h('span',null,t.password),h('a',{href:'#',style:{color:'var(--accent3)',fontSize:12},onClick:e=>{e.preventDefault();setPage('forgot');}},t.forgotPass)),
        h('input',{className:'form-input',type:'password',placeholder:'••••••••',value:pass,onChange:e=>{setPass(e.target.value);setErr('');},onKeyDown:e=>e.key==='Enter'&&handle()})
      ),
      err&&h('div',{style:{fontSize:12,color:'var(--rose)',marginBottom:10,padding:'8px 12px',background:'rgba(244,63,94,.08)',borderRadius:'var(--r)',border:'1px solid rgba(244,63,94,.2)'}},err),
      h('button',{className:'btn btn-primary',style:{width:'100%',justifyContent:'center',padding:'11px',marginTop:4},onClick:handle},t.signInBtn),
      
      h('p',{style:{textAlign:'center',fontSize:13,color:'var(--text2)',marginTop:20}},t.noAccount+' ',h('a',{href:'#',style:{color:'var(--accent3)'},onClick:e=>{e.preventDefault();setPage('register');}},t.signUpFree))
    )
  );
}

function RegisterPage({setPage,onLogin,t}){
  const [name,setName]=useState('');const [email,setEmail]=useState('');const [pass,setPass]=useState('');
  const [err,setErr]=useState('');
  const handle=()=>{
    setErr('');
    if(!name||!email||!pass){setErr('Please fill in all fields.');return;}
    if(pass.length<6){setErr('Password must be at least 6 characters.');return;}
    if(ACCOUNTS.has(email.toLowerCase())){setErr('An account with this email already exists. Please sign in.');return;}
    const joinedAt=Date.now();
    ACCOUNTS.set(email.toLowerCase(),{name,password:pass,joinedAt});
    onLogin(name,email,joinedAt);playStart();
    showToast(t.newQuizCreated,t.welcomeCreated,'success');
    setPage('dashboard');
  };
  return h('div',{className:'auth-page'},
    h('div',{className:'hero-bg'},h('div',{className:'orb orb-1',style:{opacity:.06}}),h('div',{className:'orb orb-3',style:{opacity:.06}})),
    h('div',{className:'auth-card'},
      h('div',{style:{textAlign:'center',marginBottom:28}},h('div',{className:'logo-icon',style:{width:44,height:44,margin:'0 auto 12px',fontSize:22}},'⚡')),
      h('h2',{className:'auth-title',style:{textAlign:'center'}},t.createAccount),
      h('p',{className:'auth-sub',style:{textAlign:'center',marginBottom:24}},t.createSub),
      h('div',{className:'form-group'},h('label',{className:'form-label'},t.fullName),h('input',{className:'form-input',type:'text',placeholder:'Jordan Davis',value:name,onChange:e=>{setName(e.target.value);setErr('');}})),
      h('div',{className:'form-group'},h('label',{className:'form-label'},t.email),h('input',{className:'form-input',type:'email',placeholder:'you@example.com',value:email,onChange:e=>{setEmail(e.target.value);setErr('');}})),
      h('div',{className:'form-group'},h('label',{className:'form-label'},t.password),h('input',{className:'form-input',type:'password',placeholder:'Min. 6 characters',value:pass,onChange:e=>{setPass(e.target.value);setErr('');},onKeyDown:e=>e.key==='Enter'&&handle()})),
      err&&h('div',{style:{fontSize:12,color:'var(--rose)',marginBottom:10,padding:'8px 12px',background:'rgba(244,63,94,.08)',borderRadius:'var(--r)',border:'1px solid rgba(244,63,94,.2)'}},err),
      h('p',{style:{fontSize:12,color:'var(--text3)',marginBottom:14,lineHeight:1.5}},'By creating an account you agree to our Terms of Service.'),
      h('button',{className:'btn btn-primary',style:{width:'100%',justifyContent:'center',padding:'11px'},onClick:handle},t.createBtn),
      
      h('p',{style:{textAlign:'center',fontSize:13,color:'var(--text2)',marginTop:20}},t.alreadyAccount+' ',h('a',{href:'#',style:{color:'var(--accent3)'},onClick:e=>{e.preventDefault();setPage('login');}},t.signIn))
    )
  );
}

function ForgotPage({setPage,t}){
  const [email,setEmail]=useState('');
  return h('div',{className:'auth-page'},
    h('div',{className:'auth-card'},
      h('h2',{className:'auth-title',style:{textAlign:'center'}},t.resetPass),
      h('p',{className:'auth-sub',style:{textAlign:'center',marginBottom:24}},t.resetSub),
      h('div',{className:'form-group'},h('label',{className:'form-label'},t.email),h('input',{className:'form-input',type:'email',placeholder:'you@example.com',value:email,onChange:e=>setEmail(e.target.value)})),
      h('button',{className:'btn btn-primary',style:{width:'100%',justifyContent:'center',padding:11},onClick:()=>{showToast(t.emailSent,t.checkInbox,'success');setPage('login');}},t.sendReset),
      h('p',{style:{textAlign:'center',fontSize:13,color:'var(--text2)',marginTop:16}},h('a',{href:'#',style:{color:'var(--accent3)'},onClick:e=>{e.preventDefault();setPage('login');}},t.backToLogin))
    )
  );
}

