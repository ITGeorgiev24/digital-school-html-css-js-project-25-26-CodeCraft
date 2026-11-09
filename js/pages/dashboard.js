function DashboardPage({setPage,user,t,onMenuClick,darkMode,setDarkMode}){
  const name=user&&user.name?user.name:'Guest';
  const initials=name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()||'?';
  const lvl=getLevelInfo(user.xp||0);
  const history=user.history||[];
  const sparkData=history.length>=3?history.slice(-10).map(h=>h.pct):[10,30,20,50,45,65,60,75];
  return h('div',{className:'page active'},h('div',{style:{maxWidth:1100,margin:'0 auto'}},
    h(TopBar,{title:t.dashboard,onMenuClick,darkMode,setDarkMode,onBack:()=>setPage('landing'),actions:h('button',{className:'btn btn-primary btn-sm',onClick:()=>setPage('quiz')},t.newQuiz)}),
    h('div',{className:'dash-content'},
      h('div',{className:'profile-header',style:{marginBottom:20}},
        h(Avatar,{name,avatar:user.avatar,size:80,className:'profile-avatar'}),
        h('div',{style:{flex:1,minWidth:0}},
          h('div',{className:'profile-name'},name),
          h('div',{className:'profile-title'},lvl.title+' · Joined '+formatJoinDate(user.joinedAt||Date.now())),
          h('div',{style:{display:'flex',gap:8,flexWrap:'wrap',marginTop:6}},
            h('span',{className:'level-badge'},'⭐ Level '+lvl.level+' — '+lvl.title),
            h('span',{className:'badge badge-purple'},'✅ '+(user.quizzesDone||0)+' quizzes done'),
            user.quizzesDone>=1&&h('span',{className:'badge badge-emerald'},'🔥 On a roll!')
          )
        ),
        h('div',{style:{textAlign:'right',flexShrink:0}},
          h('div',{style:{fontFamily:'var(--font-display)',fontSize:28,fontWeight:800,color:'var(--accent3)'}},h(Counter,{target:user.xp||0})),
          h('div',{style:{fontSize:12,color:'var(--text2)',marginBottom:6}},t.totalXP),
          h(XPBar,{xp:user.xp||0})
        )
      ),
      h('div',{className:'grid-4',style:{marginBottom:20}},
        h('div',{className:'stat-card purple'},h('div',{className:'stat-icon purple'},'📝'),h('div',{className:'stat-value'},user.quizzesDone||0),h('div',{className:'stat-label'},t.quizzesTaken),h('div',{className:'stat-change up'},user.quizzesDone>0?'Keep going!':'Take your first quiz!')),
        h('div',{className:'stat-card emerald'},h('div',{className:'stat-icon emerald'},'✅'),h('div',{className:'stat-value'},(user.avgAcc||0)+'%'),h('div',{className:'stat-label'},t.avgAccuracy),h('div',{className:'stat-change up'},user.avgAcc>=80?'Excellent!':user.avgAcc>=50?'Good work!':'Room to grow')),
        h('div',{className:'stat-card gold'},h('div',{className:'stat-icon gold'},'⭐'),h('div',{className:'stat-value'},user.xp||0),h('div',{className:'stat-label'},t.totalXP),h('div',{className:'stat-change up'},'Level '+lvl.level+': '+lvl.title)),
        h('div',{className:'stat-card rose'},h('div',{className:'stat-icon rose'},'🏆'),h('div',{className:'stat-value'},'#'+(user.quizzesDone>=5?3:user.quizzesDone>=2?7:15)),h('div',{className:'stat-label'},t.globalRank),h('div',{className:'stat-change up'},user.quizzesDone>=1?'Climbing!':'Play to rank'))
      ),
      h('div',{className:'grid-2',style:{marginBottom:20}},
        h('div',{className:'card'},
          h('div',{className:'section-header'},h('div',null,h('div',{className:'section-title'},t.recentQuizzes),h('div',{className:'section-sub'},t.last4)),h('button',{className:'btn btn-ghost btn-sm',onClick:()=>setPage('quiz')},t.viewAll)),
          history.length===0
            ?h('div',{style:{padding:'24px 0',textAlign:'center',color:'var(--text3)'}},'No quizzes yet — take your first one!')
            :history.slice(-4).reverse().map((qh,i)=>h('div',{key:i,className:'quiz-history-item'},
              h('div',{className:'qh-icon',style:{background:'var(--bg3)'}},qh.catEmoji||'🎓'),
              h('div',{className:'qh-meta'},h('div',{className:'qh-title'},qh.catName),h('div',{className:'qh-sub'},qh.correct+'/'+qh.total+' correct · '+qh.pct+'%')),
              h('div',{className:'qh-score',style:{color:qh.pct>=80?'var(--emerald)':qh.pct>=50?'var(--gold)':'var(--rose)'}},'+'+qh.xp+' XP')
            ))
        ),
        h('div',{className:'card'},
          h('div',{className:'section-header'},h('div',null,h('div',{className:'section-title'},'Leaderboard'),h('div',{className:'section-sub'},'Global XP')),h('button',{className:'btn btn-ghost btn-sm',onClick:()=>setPage('leaderboard')},t.fullBoard)),
          [{rank:1,name:"Alex Chen",score:9840,avatar:"AC",color:"#7c3aed"},{rank:2,name:"Sarah Kim",score:9120,avatar:"SK",color:"#0ea5e9"},{rank:3,name:"Marcus Johnson",score:8750,avatar:"MJ",color:"#10b981"},{rank:4,name:"Priya Patel",score:8340,avatar:"PP",color:"#f59e0b"},{rank:5,name:name,score:user.xp||0,avatar:initials,color:"#a855f7",isUser:true}].sort((a,b)=>b.score-a.score).slice(0,5).map((l,i)=>h('div',{key:i,className:'leaderboard-item'},
            h('div',{className:'lb-rank '+(l.rank<=3?['gold','silver','bronze'][l.rank-1]:'other')},l.rank<=3?['🥇','🥈','🥉'][l.rank-1]:l.rank),
            h('div',{className:'avatar',style:{width:26,height:26,fontSize:10,flexShrink:0,background:l.color}},l.avatar),
            h('div',{className:'lb-name',style:{fontWeight:l.isUser?600:400}},l.name+(l.isUser?' (You)':'')),
            h('div',{className:'lb-score'},l.score.toLocaleString()+' XP')
          ))
        )
      ),
      h('div',{className:'grid-2'},
        h('div',{className:'card'},
          h('div',{className:'section-header'},h('div',null,h('div',{className:'section-title'},t.achievements),h('div',{className:'section-sub'},(user.achievements||[]).length+'/'+ACHIEVEMENTS.length+' unlocked'))),
          h('div',{className:'grid-2',style:{gap:8}},ACHIEVEMENTS.map(a=>{
            const unlocked=(user.achievements||[]).includes(a.id);
            return h('div',{key:a.id,className:'achievement-card'+(unlocked?'':' locked')},h('div',{className:'achievement-icon'},a.icon),h('div',null,h('div',{style:{fontSize:13,fontWeight:600}},a.name),h('div',{style:{fontSize:11,color:'var(--text3)'}},a.desc)));
          }))
        ),
        h('div',{className:'card'},
          h('div',{className:'section-header'},h('div',null,h('div',{className:'section-title'},t.performance),h('div',{className:'section-sub'},'Recent accuracy trend'))),
          h('div',{style:{height:80,marginBottom:12}},h(SparkLine,{data:sparkData,color:'var(--accent2)'})),
          h(XPBar,{xp:user.xp||0}),
          h('div',{style:{marginTop:12,display:'flex',gap:8,flexWrap:'wrap'}},
            ACHIEVEMENTS.filter(a=>(user.achievements||[]).includes(a.id)).map(a=>h('span',{key:a.id,className:'badge badge-gold',title:a.desc},a.icon+' '+a.name))
          )
        )
      )
    )
  ));
}


