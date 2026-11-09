function ProfilePage({user,setUser,t,onMenuClick,darkMode,setDarkMode,goBack}){
  const name=user&&user.name?user.name:'Guest';
  const initials=name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()||'?';
  const lvl=getLevelInfo(user.xp||0);
  const history=user.history||[];
  const fileInputRef=React.useRef(null);
  const handleAvatarUpload=(e)=>{
    const file=e.target.files&&e.target.files[0];
    if(!file)return;
    if(file.size>2*1024*1024){showToast(t.imageTooLarge,t.imageMaxSize,'error');return;}
    const reader=new FileReader();
    reader.onload=(ev)=>{
      const dataUrl=ev.target.result;
      setUser(prev=>{const updated={...prev,avatar:dataUrl};saveSession(updated);return updated;});
      showToast(t.photoUpdated,'','success');
    };
    reader.readAsDataURL(file);
  };
  const removeAvatar=()=>{
    setUser(prev=>{const updated={...prev,avatar:null};saveSession(updated);return updated;});
    showToast(t.photoRemoved,'','info');
  };
  return h('div',{className:'page active'},h('div',{style:{maxWidth:1100,margin:'0 auto'}},
    h(TopBar,{title:t.profile,onMenuClick,darkMode,setDarkMode,onBack:goBack}),
    h('div',{className:'p-section'},
      h('div',{className:'profile-header'},
        h('div',{style:{position:'relative',flexShrink:0}},
          h('input',{type:'file',accept:'image/*',ref:fileInputRef,style:{display:'none'},onChange:handleAvatarUpload}),
          user.avatar
            ?h('div',{style:{position:'relative',width:80,height:80}},
                h('img',{src:user.avatar,style:{width:80,height:80,borderRadius:'50%',objectFit:'cover',border:'3px solid var(--accent2)',cursor:'pointer'},onClick:()=>fileInputRef.current&&fileInputRef.current.click(),title:t.photoClickChange}),
                h('button',{onClick:removeAvatar,style:{position:'absolute',top:-4,right:-4,width:20,height:20,borderRadius:'50%',background:'var(--rose)',border:'none',color:'#fff',cursor:'pointer',fontSize:12,display:'flex',alignItems:'center',justifyContent:'center',lineHeight:1}},'×')
              )
            :h('div',{style:{position:'relative',width:80,height:80}},
                h('div',{className:'profile-avatar',style:{cursor:'pointer'},onClick:()=>fileInputRef.current&&fileInputRef.current.click(),title:t.photoClickUpload},initials),
                h('div',{style:{position:'absolute',bottom:0,right:0,width:24,height:24,borderRadius:'50%',background:'var(--accent2)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:13},onClick:()=>fileInputRef.current&&fileInputRef.current.click()},'📷')
              )
        ),
        h('div',{style:{flex:1,minWidth:0}},
          h('div',{className:'profile-name'},name),
          h('div',{className:'profile-title'},lvl.title+' · Joined '+formatJoinDate(user.joinedAt||Date.now())),
          h('div',{style:{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}},
            h('span',{className:'level-badge'},'⭐ Level '+lvl.level+' — '+lvl.title),
            h('span',{className:'badge badge-purple'},'✅ '+(user.quizzesDone||0)+' quizzes done')
          )
        )
      ),
      h('div',{className:'grid-4',style:{marginBottom:16}},
        h('div',{className:'stat-card purple'},h('div',{className:'stat-value'},user.quizzesDone||0),h('div',{className:'stat-label'},t.quizzesTaken)),
        h('div',{className:'stat-card emerald'},h('div',{className:'stat-value'},(user.avgAcc||0)+'%'),h('div',{className:'stat-label'},t.avgAccuracy)),
        h('div',{className:'stat-card gold'},h('div',{className:'stat-value'},user.xp||0),h('div',{className:'stat-label'},t.totalXP)),
        h('div',{className:'stat-card rose'},h('div',{className:'stat-value'},'Lv '+lvl.level),h('div',{className:'stat-label'},'Level'))
      ),
      h('div',{style:{marginBottom:20}},h(XPBar,{xp:user.xp||0})),
      h('div',{className:'grid-2'},
        h('div',{className:'card'},
          h('div',{className:'section-header'},h('div',null,h('div',{className:'section-title'},t.achievements))),
          h('div',{style:{display:'flex',flexDirection:'column',gap:10}},ACHIEVEMENTS.map(a=>{
            const unlocked=(user.achievements||[]).includes(a.id);
            return h('div',{key:a.id,className:'achievement-card'+(unlocked?'':' locked')},h('div',{className:'achievement-icon'},a.icon),h('div',null,h('div',{style:{fontSize:13,fontWeight:600}},a.name),h('div',{style:{fontSize:11,color:'var(--text3)'}},a.desc),h('div',{style:{fontSize:10,color:unlocked?'var(--emerald)':'var(--text3)',marginTop:2}},unlocked?'✓ Unlocked':'Locked')));
          }))
        ),
        h('div',{className:'card'},
          h('div',{className:'section-header'},h('div',null,h('div',{className:'section-title'},t.categoryMastery))),
          CATEGORIES.map((c,i)=>{
            const ch=history.filter(h=>h.catId===c.id);
            const pct=ch.length>0?Math.round(ch.reduce((s,h)=>s+h.pct,0)/ch.length):0;
            const cols=['purple','emerald','sky','gold','rose','purple','gold','sky'];
            return h('div',{key:c.id,style:{marginBottom:12}},h('div',{style:{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:4}},h('span',null,c.emoji+' '+c.name),h('span',{style:{fontWeight:600}},ch.length>0?pct+'%':'—')),ch.length>0&&h('div',{className:'progress-bar'},h('div',{className:'progress-fill '+cols[i],style:{width:pct+'%'}})));
          })
        )
      )
    )
  ));
}


