const CAT_GROUPS={all:[1,2,3,4,5,6,7,8],science:[2,5],humanities:[4,6,7],technology:[1,3,8]};
function CategoryGrid({t,startQuiz,customQuizzes,managedQuizzes}){
  const [activeTab,setActiveTab]=useState('all');
  const [search,setSearch]=useState('');
  const [selectedDiff,setSelectedDiff]=useState({});
  const tabs=[['all',t.all],['science',t.science],['humanities',t.humanities],['technology',t.technology]];
  const ids=CAT_GROUPS[activeTab]||CAT_GROUPS.all;
  const filtered=CATEGORIES.filter(c=>ids.includes(c.id)&&(!search||c.name.toLowerCase().includes(search.toLowerCase())));
  const getDiff=(id)=>selectedDiff[id]||'Medium';
  const setDiff=(id,d)=>setSelectedDiff(prev=>({...prev,[id]:d}));
  const diffColors={Easy:'emerald',Medium:'gold',Hard:'rose'};
  return h('div',null,
    h('div',{style:{marginBottom:20,display:'flex',gap:12,flexWrap:'wrap',alignItems:'center'}},
      h('div',{className:'tabs',style:{flex:'0 0 auto'}},tabs.map(([key,label])=>h('button',{key,className:'tab'+(activeTab===key?' active':''),onClick:()=>setActiveTab(key)},label))),
      h('div',{className:'search-bar',style:{flex:'1 1 160px',maxWidth:240}},
        h('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,style:{width:15,height:15,color:'var(--text3)',flexShrink:0}},h('circle',{cx:11,cy:11,r:8}),h('line',{x1:21,y1:21,x2:16.65,y2:16.65})),
        h('input',{className:'search-input',placeholder:t.searchCats,value:search,onChange:e=>setSearch(e.target.value)})
      )
    ),
    filtered.length===0?h('div',{style:{padding:'32px 0',textAlign:'center',color:'var(--text3)'}},'No categories match your search.'):
    h('div',null,
      h('div',{className:'grid-auto'},filtered.map(c=>{
      const managed=(managedQuizzes||[]).find(m=>m.catId===c.id);
      const isDisabled=managed&&managed.active===false;
      const displayTitle=managed?managed.title:c.name;
      return h('div',{key:c.id,className:'category-card',style:{cursor:isDisabled?'not-allowed':'default',opacity:isDisabled?0.45:1,filter:isDisabled?'grayscale(60%)':'none',position:'relative'}},
        isDisabled&&h('div',{style:{position:'absolute',top:8,right:8,background:'var(--rose)',color:'#fff',fontSize:10,fontWeight:700,padding:'2px 6px',borderRadius:4,zIndex:1}},'DISABLED'),
        h('div',{className:'category-emoji'},c.emoji),
        h('div',{className:'category-name'},displayTitle),
        h('div',{className:'category-count',style:{marginBottom:10}},isDisabled?'Temporarily unavailable':'15 questions · 5 per quiz'),
        h('div',{style:{display:'flex',gap:4,marginBottom:12,justifyContent:'center'}},
          ['Easy','Medium','Hard'].map(d=>h('button',{key:d,
            className:'btn btn-sm '+(getDiff(c.id)===d?'btn-primary':'btn-ghost'),
            style:{flex:1,justifyContent:'center',padding:'4px 0',fontSize:11},
            disabled:isDisabled,
            onClick:e=>{e.stopPropagation();if(!isDisabled)setDiff(c.id,d);}
          },d))
        ),
        h('div',{style:{display:'flex',gap:6}},
          h('button',{
            className:'btn '+(isDisabled?'btn-ghost':'btn-primary'),
            style:{flex:1,justifyContent:'center',padding:'8px'},
            disabled:isDisabled,
            onClick:()=>{if(!isDisabled)startQuiz(c,getDiff(c.id),null,false);}
          },isDisabled?'Unavailable':'▶ Start'),
          !isDisabled&&h('div',{className:'has-tooltip',style:{position:'relative'}},
            h('button',{
              className:'btn btn-ghost',
              style:{justifyContent:'center',padding:'8px 10px'},
              onClick:()=>startQuiz(c,getDiff(c.id),null,true)
            },'📖'),
            h('div',{className:'tooltip'},'Practice Mode')
          )
        )
      );
    })),
      customQuizzes&&customQuizzes.length>0&&h('div',{style:{marginTop:24}},
        h('div',{style:{fontFamily:'var(--font-display)',fontWeight:700,fontSize:14,color:'var(--text2)',marginBottom:12}},'✨ Custom Quizzes'),
        h('div',{className:'grid-auto'},customQuizzes.map(c=>h('div',{key:c.id,className:'category-card',style:{cursor:'default'}},
          h('div',{className:'category-emoji'},c.emoji),
          h('div',{className:'category-name'},c.name),
          h('div',{className:'category-count',style:{marginBottom:10}},'Custom · '+c.questionCount+' questions'),
          h('div',{style:{display:'flex',gap:4,marginBottom:12,justifyContent:'center'}},
            ['Easy','Medium','Hard'].map(d=>h('button',{key:d,
              className:'btn btn-sm '+(getDiff(c.id)===d?'btn-primary':'btn-ghost'),
              style:{flex:1,justifyContent:'center',padding:'4px 0',fontSize:11},
              onClick:e=>{e.stopPropagation();setDiff(c.id,d);}
            },d))
          ),
          h('button',{
            className:'btn btn-primary',
            style:{width:'100%',justifyContent:'center',padding:'8px'},
            onClick:()=>startQuiz(c,getDiff(c.id))
          },'Start Quiz')
        )))
      )
    )
  );
}
 
 
function QuizPage({setPage,t,onMenuClick,darkMode,setDarkMode,user,onQuizComplete,customQuizzes,managedQuizzes,quizPhaseRef,setQuizActive}){
  const [phase,setPhase]=useState('categories');
  const [selectedCat,setSelectedCat]=useState(null);
  const [questions,setQuestions]=useState([]);
  const [currentQ,setCurrentQ]=useState(0);
  const [selected,setSelected]=useState(null);
  const [answered,setAnswered]=useState(false);
  const [answers,setAnswers]=useState([]);
  const [timeLeft,setTimeLeft]=useState(30);
  const [score,setScore]=useState(0);
  const [practiceMode,setPracticeMode]=useState(false);
  const [canRetry,setCanRetry]=useState(false); // for practice retry
  const [showQuitModal,setShowQuitModal]=useState(false);
  const doQuit=()=>{
    clearInterval(timerRef.current);
    setShowQuitModal(false);
    setQuestions([]);
    setSelectedCat(null);
    setCurrentQ(0);
    setAnswers([]);
    setScore(0);
    setTimeLeft(30);
    setSelected(null);
    setAnswered(false);
    setCanRetry(false);
    setPracticeMode(false);
    if(quizPhaseRef)quizPhaseRef.current='categories';
    if(setQuizActive)setQuizActive(false);
    setPhase('categories');
  };
  const [aiModal,setAiModal]=useState(false);
  const [aiTopic,setAiTopic]=useState('');
  const [aiDiff,setAiDiff]=useState('Medium');
  const [aiGenerating,setAiGenerating]=useState(false);
  const timerRef=useRef(null);
  const startTimeRef=useRef(30);
 
  const startQuiz=(cat,diffOrQs,explicitQs,isPractice)=>{
    const isPrebuilt=Array.isArray(diffOrQs);
    const difficulty=isPrebuilt?'Medium':(diffOrQs||'Medium');
    let finalQs;
    if(explicitQs){finalQs=explicitQs;}
    else if(isPrebuilt){finalQs=diffOrQs;}
    else if(cat.isCustom){
      // Custom quiz: use AI topic matching to find relevant questions
      const result=getAIQuestions(cat.name,difficulty);
      finalQs=result&&result.qs?result.qs:pickQuestions(1,5,difficulty);
    }
    else{finalQs=pickQuestions(cat.id,5,difficulty);}
    playStart();
    reportedRef.current=false;
    setPracticeMode(!!isPractice);
    setSelectedCat({...cat,chosenDifficulty:difficulty});setQuestions(finalQs);if(quizPhaseRef)quizPhaseRef.current='playing';if(setQuizActive)setQuizActive(true);setPhase('playing');
    setCurrentQ(0);setAnswers([]);setScore(0);setTimeLeft(30);setSelected(null);setAnswered(false);setCanRetry(false);
  };
 
  const handleAiGenerate=()=>{
    if(!aiTopic.trim()){showToast(t.enterTopic,t.enterTopicDesc,'error');return;}
    setAiGenerating(true);
    const topic=aiTopic.trim();
    setTimeout(()=>{
      // Fuzzy match topic against 30-topic library
      const editDist=(a,b)=>{const m=a.length,n=b.length;const dp=Array.from({length:m+1},(_,i)=>Array.from({length:n+1},(_,j)=>i===0?j:j===0?i:0));for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);return dp[m][n];};
      const q=topic.toLowerCase().trim();
      let best=null,bestScore=0;
      for(const tp of AI_TOPICS){
        let score=0;
        for(const k of tp.keys){
          if(q===k)score+=20;
          else if(q.includes(k)||k.includes(q))score+=10;
          else{const qw=q.split(/\s+/);const kw=k.split(/\s+/);for(const a of qw)for(const b of kw){if(a===b)score+=4;else if(Math.abs(a.length-b.length)<=2&&a.length>=4&&editDist(a,b)<=2)score+=3;}}
        }
        if(score>bestScore){bestScore=score;best=tp;}
      }
      if(!best||bestScore<3){
        setAiGenerating(false);
        showToast(t.topicNotRecognised,t.topicTryExamples,'error');
        return;
      }
      const tier=aiDiff==='Hard'?'Hard':aiDiff==='Easy'?'Easy':'Medium';
      const pool=best.qs[tier]||best.qs.Medium||best.qs.Easy;
      const qs=[...pool].sort(()=>Math.random()-.5).slice(0,5);
      setAiGenerating(false);setAiModal(false);
      showToast('🤖 Quiz generated!',best.label+' · '+aiDiff,'success');
      startQuiz({id:99,emoji:best.emoji,name:topic,color:'purple',difficulty:aiDiff},aiDiff,qs);
      setAiTopic('');
    },900);
  };
 
  useEffect(()=>{
    if(phase==='playing'&&!answered&&!practiceMode){
      startTimeRef.current=timeLeft;
      timerRef.current=setInterval(()=>setTimeLeft(p=>{
        if(p<=1){clearInterval(timerRef.current);doAnswer(-1);return 0;}
        return p-1;
      }),1000);
    }
    return()=>clearInterval(timerRef.current);
  },[phase,currentQ,answered]);
 
  const doAnswer=(idx)=>{
    if(answered)return;
    clearInterval(timerRef.current);
    const timeTaken=startTimeRef.current-(practiceMode?30:timeLeft);
    setSelected(idx);
    const q=questions[currentQ];
    const correct=idx===q.correct;
    const fast=correct&&timeTaken<=5;
    if(correct){
      if(!practiceMode)setScore(s=>s+q.xp);
      playCorrect();setAnswered(true);setCanRetry(false);
      setAnswers(a=>[...a,{q:q.text,correct,userAnswer:idx,rightAnswer:q.correct,options:q.options,fast,xp:q.xp}]);
    }else{
      playWrong();
      if(practiceMode){
        // Lock options after wrong answer - must click Retry to try again
        setSelected(idx);setAnswered(true);setCanRetry(true);
        setAnswers(a=>[...a,{q:q.text,correct:false,userAnswer:idx,rightAnswer:q.correct,options:q.options,fast:false,xp:0}]);
      }else{
        setAnswered(true);setCanRetry(false);
        setAnswers(a=>[...a,{q:q.text,correct,userAnswer:idx,rightAnswer:q.correct,options:q.options,fast,xp:q.xp}]);
      }
    }
  };
  const retryQuestion=()=>{setSelected(null);setCanRetry(false);setAnswered(false);setAnswers(a=>a.slice(0,-1));};
 
  const nextQ=()=>{
    if(currentQ<questions.length-1){setCurrentQ(q=>q+1);setSelected(null);setAnswered(false);setTimeLeft(30);}
    else{if(quizPhaseRef)quizPhaseRef.current='results';if(setQuizActive)setQuizActive(false);setPhase('results');};
  };
 
  // Track whether we already reported this result to avoid double-firing
  const reportedRef=useRef(false);
  useEffect(()=>{
    if(phase==='results'&&!reportedRef.current&&!practiceMode){
      reportedRef.current=true;
      const correctCount=answers.filter(a=>a.correct).length;
      const pct=Math.round((correctCount/questions.length)*100);
      onQuizComplete({catId:selectedCat?.id,catName:selectedCat?.name||'Quiz',catEmoji:selectedCat?.emoji||'🎓',xp:score,correct:correctCount,total:questions.length,pct,perfect:pct===100,speed:answers.some(a=>a.fast)});
    }
  },[phase]);
 
  if(phase==='results'){
    const correctCount=answers.filter(a=>a.correct).length;
    const pct=Math.round((correctCount/questions.length)*100);
    const col=pct>=80?'var(--emerald)':pct>=50?'var(--gold)':'var(--rose)';
    const r=40,c=2*Math.PI*r,fill=c*(pct/100);
  return h('div',{className:'page active'},
    h('div',{style:{maxWidth:900,margin:'0 auto'}},
      h(TopBar,{title:t.quizResults,onMenuClick,darkMode,setDarkMode,actions:h('button',{className:'btn btn-ghost btn-sm',onClick:()=>setPhase('categories')},t.backToCats)}),
      h('div',{className:'results-container'},
        h('div',{className:'score-ring'},
          h('svg',{width:160,height:160,viewBox:'0 0 90 90'},
            h('circle',{cx:45,cy:45,r:40,fill:'none',stroke:'var(--bg3)',strokeWidth:8}),
            h('circle',{cx:45,cy:45,r:40,fill:'none',stroke:col,strokeWidth:8,strokeDasharray:fill+' '+c,strokeLinecap:'round',style:{transform:'rotate(-90deg)',transformOrigin:'center',transition:'stroke-dasharray 1.2s ease'}})
          ),
          h('div',{className:'score-ring-text'},h('div',{className:'score-pct',style:{color:col}},pct+'%'),h('div',{className:'score-label'},t.score))
        ),
        h('h2',{className:'results-title'},practiceMode?'📖 Practice Complete!':(pct===100?'🏆 Perfect!':pct>=80?'🎉 Great job!':pct>=50?'💪 Keep going!':'📚 Keep studying!')),
        practiceMode&&h('div',{style:{background:'rgba(56,189,248,.08)',border:'1px solid rgba(56,189,248,.2)',borderRadius:'var(--r)',padding:'10px 16px',marginBottom:12,fontSize:13,color:'var(--sky)',textAlign:'center'}},t.practiceNoXP),
        !practiceMode&&h('p',{className:'results-sub'},pct>=80?'XP added to your profile — check your level!':'Every attempt makes you smarter. Try again!'),
        h('div',{className:'results-stats'},
          h('div',{className:'result-stat'},h('div',{className:'result-stat-val',style:{color:'var(--emerald)'}},correctCount+'/'+questions.length),h('div',{className:'result-stat-key'},t.correct)),
          h('div',{className:'result-stat'},h('div',{className:'result-stat-val',style:{color:'var(--gold)'}},'+'+score),h('div',{className:'result-stat-key'},t.xpEarned)),
          h('div',{className:'result-stat'},h('div',{className:'result-stat-val',style:{color:col}},pct+'%'),h('div',{className:'result-stat-key'},'Accuracy'))
        ),
        h('div',{style:{display:'flex',gap:8,justifyContent:'center',marginBottom:28,flexWrap:'wrap'}},
          h('button',{className:'btn btn-primary',onClick:()=>startQuiz(selectedCat,selectedCat&&selectedCat.chosenDifficulty||'Medium',null,practiceMode)},t.retryQuiz),
          h('button',{className:'btn btn-ghost',onClick:()=>setPhase('categories')},t.allCategories),
          h('button',{className:'btn btn-ghost',onClick:()=>setPage('dashboard')},t.dashboard)
        ),
        h('div',{className:'answer-review'},
          h('h3',{style:{fontFamily:'var(--font-display)',fontWeight:700,marginBottom:12}},t.answerReview),
          answers.map((a,i)=>h('div',{key:i,className:'review-item '+(a.correct?'correct':'wrong')},
            h('div',{className:'review-num'},i+1),
            h('div',null,h('div',{className:'review-q'},a.q),h('div',{className:'review-a'},a.correct?'✓ Correct'+(a.fast?' ⚡ Fast!':''):'✗ Answer: '+a.options[a.rightAnswer]))
          ))
        )
      )
    ));
  }
 
  if(phase==='playing'&&questions.length>0){
    const q=questions[currentQ];
    return h('div',{className:'page active'},
      showQuitModal&&h('div',{style:{position:'fixed',inset:0,background:'rgba(0,0,0,.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}},
        h('div',{style:{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--r3)',padding:28,width:'100%',maxWidth:360,textAlign:'center'}},
          h('div',{style:{fontSize:32,marginBottom:12}},'🚪'),
          h('h3',{style:{fontFamily:'var(--font-display)',fontWeight:700,marginBottom:8,fontSize:18}},'Quit this quiz?'),
          h('p',{style:{fontSize:13,color:'var(--text2)',marginBottom:24}},"Your progress won't be saved."),
          h('div',{style:{display:'flex',gap:10}},
            h('button',{className:'btn btn-ghost',style:{flex:1,justifyContent:'center'},onClick:()=>setShowQuitModal(false)},'Keep playing'),
            h('button',{className:'btn btn-danger',style:{flex:1,justifyContent:'center'},onClick:doQuit},'Quit')
          )
        )
      ),
      h('div',{style:{maxWidth:900,margin:'0 auto'}},
      h(TopBar,{title:selectedCat?.name||'Quiz',onMenuClick,darkMode,setDarkMode,actions:h('button',{className:'btn btn-ghost btn-sm',onClick:()=>{setShowQuitModal(true);}},t.quit)}),
      h('div',{className:'quiz-container'},
        h('div',{className:'quiz-header'},
          h('div',{className:'quiz-progress-info'},
            h('span',{className:'quiz-question-num'},t.question+' '+(currentQ+1)+' '+t.of+' '+questions.length),
            practiceMode
              ?h('span',{className:'badge badge-sky',style:{fontSize:12,padding:'4px 10px'}},'📖 Practice Mode — No XP')
              :h('div',{className:'xp-chip'},'⭐ +'+q.xp+' XP')
          ),
          practiceMode
            ?h('span',{className:'badge badge-emerald',style:{fontSize:12,padding:'4px 10px'}},'⏱ No Timer')
            :h('div',{className:'quiz-timer'+(timeLeft<=10?' warning':'')},'⏱ '+timeLeft+'s')
        ),
        h('div',{className:'progress-bar',style:{marginBottom:24}},h('div',{className:'progress-fill purple',style:{width:(currentQ/questions.length*100)+'%'}})),
        h('div',{className:'question-card'},
          h('div',{style:{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}},
            h('span',{className:'badge badge-'+(selectedCat?.color||'purple')},(selectedCat?.emoji||'')+' '+(selectedCat?.name||'')),
            h('span',{className:'badge badge-muted'},'🎯 '+selectedCat?.difficulty)
          ),
          h('h2',{className:'question-text'},q.text),
          h('div',{className:'options-grid'},q.options.map((opt,i)=>{
            let cls='option-btn';
            if(answered&&canRetry&&practiceMode){
              // Practice wrong: only show the wrong pick, don't reveal correct
              if(i===selected)cls+=' wrong';
            } else if(answered){
              if(i===q.correct)cls+=' correct';
              else if(i===selected)cls+=' wrong';
            } else if(i===selected)cls+=' selected';
            return h('button',{key:i,className:cls,onClick:()=>doAnswer(i),disabled:answered||(canRetry&&i===selected)},h('span',{className:'option-letter'},'ABCD'[i]),h('span',{className:'option-text'},opt));
          })),
          canRetry&&h('div',{style:{marginTop:12,padding:'10px 14px',background:'rgba(244,63,94,.06)',border:'1px solid rgba(244,63,94,.2)',borderRadius:'var(--r)',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}},
            h('span',{style:{fontSize:13,color:'var(--rose)',fontWeight:600}},'❌ Not quite!'),
            h('div',{style:{display:'flex',gap:6}},
              h('button',{className:'btn btn-ghost btn-sm',onClick:retryQuestion,style:{color:'var(--rose)'}},'↩ Retry'),
              h('button',{className:'btn btn-ghost btn-sm',onClick:()=>{setCanRetry(false);setAnswered(true);},style:{color:'var(--text2)'}},currentQ<questions.length-1?'Skip →':'Finish →')
            )
          ),
          answered&&h('div',{style:{marginTop:20,padding:14,background:'rgba(124,58,237,.06)',border:'1px solid rgba(124,58,237,.15)',borderRadius:'var(--r)',fontSize:14,color:'var(--text2)',lineHeight:1.6}},h('strong',{style:{color:'var(--accent3)'}},t.explanation),q.explanation)
        ),
        (answered||canRetry)&&h('div',{className:'quiz-footer'},
          h('div',{style:{fontSize:13,color:'var(--text2)'}},
            practiceMode
              ?h('span',{style:{color:'var(--sky)',fontWeight:600}},t.noPracticeXP)
              :h('span',null,t.score+': ',h('strong',{style:{color:'var(--accent3)',fontFamily:'var(--font-display)'}},score+' XP'))
          ),
          answered&&!canRetry&&h('button',{className:'btn btn-primary',onClick:nextQ},currentQ<questions.length-1?t.nextQuestion:t.seeResults)
        )
      )
    ));
  }
 
  // Categories
  return h('div',{className:'page active'},
    aiModal&&h('div',{style:{position:'fixed',inset:0,background:'rgba(0,0,0,.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:500,padding:20}},
      h('div',{style:{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'var(--r3)',padding:28,width:'100%',maxWidth:440,position:'relative'}},
        h('button',{onClick:()=>{setAiModal(false);setAiTopic('');},style:{position:'absolute',top:14,right:14,background:'none',border:'none',color:'var(--text2)',cursor:'pointer',fontSize:22,lineHeight:1}},'×'),
        h('div',{style:{display:'flex',alignItems:'center',gap:10,marginBottom:20}},
          h('div',{style:{width:40,height:40,borderRadius:10,background:'rgba(56,189,248,.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}},'🤖'),
          h('div',null,h('div',{style:{fontFamily:'var(--font-display)',fontWeight:700,fontSize:17}},t.aiGenerator),h('div',{style:{fontSize:13,color:'var(--text2)'}},t.aiGeneratorSub))
        ),
        h('div',{className:'form-group'},h('label',{className:'form-label'},t.topic),h('input',{className:'form-input',type:'text',placeholder:t.topicPlaceholder,value:aiTopic,onChange:e=>setAiTopic(e.target.value),onKeyDown:e=>e.key==='Enter'&&handleAiGenerate(),autoFocus:true})),
        h('div',{className:'form-group'},h('label',{className:'form-label'},t.difficulty),
          h('div',{style:{display:'flex',gap:8}},
            ['Easy','Medium','Hard'].map(d=>h('button',{key:d,className:'btn '+(aiDiff===d?'btn-primary':'btn-ghost'),style:{flex:1,justifyContent:'center'},onClick:()=>setAiDiff(d)},d))
          )
        ),
        h('button',{className:'btn btn-primary',style:{width:'100%',justifyContent:'center',padding:'11px',marginTop:4},onClick:handleAiGenerate,disabled:aiGenerating},aiGenerating?'⏳ Generating quiz...':t.generateQuiz)
      )
    ),
    h('div',{style:{maxWidth:1100,margin:'0 auto'}},
      h(TopBar,{title:t.quizCategories,onMenuClick,darkMode,setDarkMode,actions:h('div',{style:{display:'flex',gap:8}},
        h('button',{className:'btn btn-primary btn-sm',onClick:()=>setAiModal(true)},t.aiQuiz)
      )}),
      h('div',{className:'p-section'},
        h(CategoryGrid,{t,startQuiz,customQuizzes:customQuizzes||[],managedQuizzes:managedQuizzes||[]})
      )
    )
  );
}