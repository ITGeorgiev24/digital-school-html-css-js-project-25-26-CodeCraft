function StatsPage({t,onMenuClick,darkMode,setDarkMode,user,goBack}){
  const history=user.history||[];
  const weekData=history.length>0?history.slice(-7).map(h=>h.pct):[0,0,0,0,0,0,0];
  const maxW=Math.max(...weekData,1);
  return h('div',{className:'page active'},h('div',{style:{maxWidth:1100,margin:'0 auto'}},
    h(TopBar,{title:t.stats,onMenuClick,darkMode,setDarkMode,onBack:goBack}),
    h('div',{className:'p-section'},
      h('div',{className:'grid-4',style:{marginBottom:20}},
        [['📈',(user.avgAcc||0)+'%',t.avgAccuracy,'emerald'],['🎯',user.quizzesDone||0,t.quizzesTaken,'gold'],['⭐',user.xp||0,t.totalXP,'purple'],['🏆','Lv '+getLevelInfo(user.xp||0).level,'Level','rose']].map(([icon,val,lbl,c])=>h('div',{key:lbl,className:'stat-card '+c},h('div',{className:'stat-icon '+c},icon),h('div',{className:'stat-value'},val),h('div',{className:'stat-label'},lbl)))
      ),
      h('div',{className:'grid-2',style:{marginBottom:20}},
        h('div',{className:'card'},
          h('div',{className:'section-header'},h('div',null,h('div',{className:'section-title'},t.weeklyAccuracy))),
          history.length===0?h('div',{style:{padding:'24px 0',textAlign:'center',color:'var(--text3)'}},'No data yet — take some quizzes!'):
          h('div',null,h('div',{className:'admin-chart',style:{height:140}},weekData.map((v,i)=>h('div',{key:i,className:'bar purple',style:{height:(v/maxW*100)+'%'},'data-val':v+'%'}))),h('div',{className:'chart-labels'},['1','2','3','4','5','6','7'].map(d=>h('div',{key:d,className:'chart-label'},d))))
        ),
        h('div',{className:'card'},
          h('div',{className:'section-header'},h('div',null,h('div',{className:'section-title'},t.timeDistribution))),
          history.length===0?h('div',{style:{padding:'24px 0',textAlign:'center',color:'var(--text3)'}},'No data yet.'):
          h('div',{style:{display:'flex',justifyContent:'center',gap:16,padding:'8px 0',flexWrap:'wrap'}},
            CATEGORIES.map(c=>{const n=history.filter(h=>h.catId===c.id).length;const total=Math.max(history.length,1);const pct=Math.round((n/total)*100);return n>0?h('div',{key:c.id,style:{textAlign:'center'}},h(DonutChart,{pct,color:'var(--accent2)',size:56}),h('div',{style:{fontSize:11,color:'var(--text2)',marginTop:4}},c.emoji)):null;}).filter(Boolean)
          )
        )
      ),
      h('div',{className:'card'},
        h('div',{className:'section-header'},h('div',null,h('div',{className:'section-title'},t.categoryPerformance))),
        h('div',{className:'grid-2'},CATEGORIES.map((c,i)=>{
          const ch=history.filter(h=>h.catId===c.id);
          const pct=ch.length>0?Math.round(ch.reduce((s,h)=>s+h.pct,0)/ch.length):0;
          const col=pct>=80?'emerald':pct>=50?'gold':'rose';
          return h('div',{key:c.id,style:{padding:'10px 0',borderBottom:'1px solid var(--border)'}},
            h('div',{style:{display:'flex',alignItems:'center',gap:8,marginBottom:5}},h('span',{style:{fontSize:14}},c.emoji),h('span',{style:{flex:1,fontSize:13,fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},c.name),h('span',{style:{fontFamily:'var(--font-display)',fontWeight:700,fontSize:13,color:'var(--'+col+')',flexShrink:0}},ch.length>0?pct+'%':'—')),
            ch.length>0&&h('div',{className:'progress-bar'},h('div',{className:'progress-fill '+col,style:{width:pct+'%'}}))
          );
        }))
      )
    )
  ));
}


