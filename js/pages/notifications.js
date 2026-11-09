function NotificationsPage({notifications,setNotifications,t,onMenuClick,darkMode,setDarkMode,goBack}){
  const unread=notifications.filter(n=>n.unread).length;
  return h('div',{className:'page active'},h('div',{style:{maxWidth:1100,margin:'0 auto'}},
    h(TopBar,{title:t.notifications,onMenuClick,darkMode,setDarkMode,onBack:goBack,actions:h('div',{style:{display:'flex',gap:8}},unread>0&&h('button',{className:'btn btn-ghost btn-sm',onClick:()=>{setNotifications(p=>p.map(n=>({...n,unread:false})));showToast(t.allRead,'','success');}},t.markAllRead),notifications.length>0&&h('button',{className:'btn btn-ghost btn-sm',style:{color:'var(--rose)'},onClick:()=>{setNotifications([]);showToast(t.settingsSaved,t.allNotifsRemoved,'success');}},'Clear all'))}),
    h('div',{className:'p-section'},h('div',{className:'card',style:{maxWidth:640}},
      notifications.length===0?h('div',{style:{padding:'32px',textAlign:'center',color:'var(--text3)'}},t.noNotifs):
      notifications.map(n=>h('div',{key:n.id,className:'notif-item'+(n.unread?' unread':''),style:{display:'flex',alignItems:'flex-start',gap:8}},
        h('div',{style:{flex:1,display:'flex',alignItems:'flex-start',gap:12,cursor:'pointer'},onClick:()=>setNotifications(p=>p.map(x=>x.id===n.id?{...x,unread:false}:x))},
          n.unread&&h('div',{className:'notif-dot'}),
          h('div',{className:'notif-content'},h('div',{className:'notif-title'},n.title),h('div',{style:{fontSize:13,color:'var(--text2)',margin:'2px 0'}},n.body),h('div',{className:'notif-time'},n.time))
        ),
        h('button',{onClick:e=>{e.stopPropagation();setNotifications(p=>p.filter(x=>x.id!==n.id));},style:{background:'none',border:'none',color:'var(--text3)',cursor:'pointer',padding:'2px 6px',borderRadius:'var(--r)',fontSize:18,lineHeight:1,flexShrink:0,marginTop:2},title:t.deleteNotif},'×')
      ))
    ))
  ));
}


