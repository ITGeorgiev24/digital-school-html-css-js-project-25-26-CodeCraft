function LeaderboardPage({t,onMenuClick,darkMode,setDarkMode,user,goBack}){
  const [lbTab,setLbTab]=useState('weekly');
  const name=user&&user.name?user.name:'You';
  const initials=name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()||'?';
  const isPublic=!user||!user.settings||user.settings.public!==false;
  const boardData={
    weekly:[{name:"Alex Chen",score:9840,avatar:"AC",color:"#7c3aed"},{name:"Sarah Kim",score:9120,avatar:"SK",color:"#0ea5e9"},{name:"Marcus Johnson",score:8750,avatar:"MJ",color:"#10b981"},{name:"Priya Patel",score:8340,avatar:"PP",color:"#f59e0b"},...(isPublic?[{name:name,score:user.xp||0,avatar:initials,color:"#a855f7",isUser:true}]:[]),{name:"Lena Mueller",score:4680,avatar:"LM",color:"#f43f5e"},{name:"Omar Hassan",score:3210,avatar:"OH",color:"#38bdf8"},{name:"Fatima Al-Rashid",score:1890,avatar:"FA",color:"#7c3aed"},{name:"James Wright",score:940,avatar:"JW",color:"#10b981"},{name:"Mei Lin",score:320,avatar:"ML",color:"#f59e0b"}],
    monthly:[{name:"Priya Patel",score:24600,avatar:"PP",color:"#f59e0b"},{name:"Alex Chen",score:21300,avatar:"AC",color:"#7c3aed"},{name:"Omar Hassan",score:18900,avatar:"OH",color:"#38bdf8"},...(isPublic?[{name:name,score:(user.xp||0)*4,avatar:initials,color:"#a855f7",isUser:true}]:[]),{name:"Sarah Kim",score:15200,avatar:"SK",color:"#0ea5e9"},{name:"Lena Mueller",score:12800,avatar:"LM",color:"#f43f5e"},{name:"Marcus Johnson",score:9400,avatar:"MJ",color:"#10b981"},{name:"Mei Lin",score:7100,avatar:"ML",color:"#f59e0b"},{name:"James Wright",score:4300,avatar:"JW",color:"#10b981"},{name:"Fatima Al-Rashid",score:2900,avatar:"FA",color:"#7c3aed"}],
    allTime:[{name:"Sarah Kim",score:142000,avatar:"SK",color:"#0ea5e9"},{name:"Alex Chen",score:138500,avatar:"AC",color:"#7c3aed"},{name:"Marcus Johnson",score:119000,avatar:"MJ",color:"#10b981"},{name:"Fatima Al-Rashid",score:98400,avatar:"FA",color:"#7c3aed"},{name:"Priya Patel",score:87600,avatar:"PP",color:"#f59e0b"},{name:"Lena Mueller",score:76200,avatar:"LM",color:"#f43f5e"},...(isPublic?[{name:name,score:(user.xp||0)*12,avatar:initials,color:"#a855f7",isUser:true}]:[]),{name:"Omar Hassan",score:54300,avatar:"OH",color:"#38bdf8"},{name:"James Wright",score:38900,avatar:"JW",color:"#10b981"},{name:"Mei Lin",score:21000,avatar:"ML",color:"#f59e0b"}],
  };
  const board=(boardData[lbTab]||boardData.weekly).sort((a,b)=>b.score-a.score).map((l,i)=>({...l,rank:i+1}));
  const top3=[board[1],board[0],board[2]];
  return h('div',{className:'page active'},h('div',{style:{maxWidth:1100,margin:'0 auto'}},
    h(TopBar,{title:t.leaderboard,onMenuClick,darkMode,setDarkMode,onBack:goBack}),
    h('div',{className:'p-section'},
      h('div',{style:{marginBottom:20}},h('div',{className:'tabs'},['weekly','monthly','allTime'].map(k=>h('button',{key:k,className:'tab'+(lbTab===k?' active':''),onClick:()=>setLbTab(k)},t[k])))),
      h('div',{className:'grid-3',style:{marginBottom:24}},top3.map((l,i)=>h('div',{key:i,className:'card',style:{textAlign:'center',padding:20,border:'1px solid '+(i===1?'rgba(245,158,11,.3)':'var(--border)')}},h('div',{style:{fontSize:28,marginBottom:6}},['🥈','🥇','🥉'][i]),h('div',{className:'avatar',style:{width:48,height:48,fontSize:18,margin:'0 auto 8px',background:l.color}},l.avatar),h('div',{style:{fontFamily:'var(--font-display)',fontWeight:700,fontSize:14}},l.name+(l.isUser?' (You)':'')),h('div',{style:{fontFamily:'var(--font-display)',fontWeight:800,fontSize:20,color:'var(--accent3)',marginTop:4}},l.score.toLocaleString()+' XP')))),
      h('div',{className:'card'},h('div',{className:'table-scroll'},h('table',{className:'data-table',style:{width:'100%',minWidth:480}},
        h('thead',null,h('tr',null,h('th',null,'Rank'),h('th',null,'Player'),h('th',null,'XP'),h('th',null,'Level'),h('th',null,'Status'))),
        h('tbody',null,board.map(l=>h('tr',{key:l.rank,style:{background:l.isUser?'rgba(124,58,237,.04)':''}},
          h('td',null,h('div',{className:'lb-rank '+(l.rank<=3?['gold','silver','bronze'][l.rank-1]:'other'),style:{display:'inline-flex'}},l.rank<=3?['🥇','🥈','🥉'][l.rank-1]:l.rank)),
          h('td',null,h('div',{style:{display:'flex',alignItems:'center',gap:8}},h('div',{className:'avatar',style:{width:26,height:26,fontSize:10,flexShrink:0,background:l.color}},l.avatar),h('span',{style:{fontWeight:l.isUser?600:400}},l.name+(l.isUser?' (You)':'')))),
          h('td',null,h('span',{style:{fontFamily:'var(--font-display)',fontWeight:700,color:'var(--accent3)'}},l.score.toLocaleString())),
          h('td',null,h('span',{className:'badge badge-purple'},'Lv '+getLevelInfo(l.score).level+' '+getLevelInfo(l.score).title)),
          h('td',null,h('span',{className:'badge badge-'+(l.rank===1?'gold':l.rank<=3?'purple':'muted')},l.rank===1?'Champion':l.rank<=3?'Elite':'Active'))
        )))
      )))
    )
  ));
}