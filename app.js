/**
 * AssetLog Data Layer v2 - Developed by Naif Almalki
 * naif.almalkisau@gmail.com
 */
const AssetLog = (function() {
  var K = { TYPES:'al_types', ASSETS:'al_assets', RECORDS:'al_records', ADMINS:'al_admins', USERS:'al_users', SESSION:'al_session' };
  var uid = function(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7); };
  var load = function(k){ try{ var v=localStorage.getItem(k); return v?JSON.parse(v):null; }catch(e){ return null; } };
  var save = function(k,v){ localStorage.setItem(k,JSON.stringify(v)); };
  function fmtDate(d){ return d.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'2-digit'}); }
  function fmtTime(d){ return d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:true}); }
  function nowSnap(){ var d=new Date(); return {date:fmtDate(d),time:fmtTime(d),iso:d.toISOString(),ts:d.getTime()}; }

  function migrate(){
    var old=localStorage.getItem('al_admin');
    if(old && !localStorage.getItem(K.ADMINS)){ try{ var a=JSON.parse(old); if(a&&!Array.isArray(a)&&a.username) save(K.ADMINS,[{id:uid(),username:a.username,password:a.password}]); }catch(e){} localStorage.removeItem('al_admin'); }
  }

  function init(){
    migrate();
    var admins = load(K.ADMINS);
    if(!admins){
      save(K.ADMINS,[{id:'admin_1',username:'admin',password:'admin123'}]);
    } else {
      var idx = admins.findIndex(function(a){ return a.id==='admin_1'; });
      if(idx >= 0){
        admins[idx].username = 'admin';
        admins[idx].password = 'admin123';
      } else {
        admins.unshift({id:'admin_1',username:'admin',password:'admin123'});
      }
      save(K.ADMINS, admins);
    }
    if(!load(K.USERS)) save(K.USERS,[]);
    var storedTypes = load(K.TYPES);
    if(!storedTypes || !storedTypes.length) save(K.TYPES,[
      {id:'type_cars',   name:'Cars',   icon:'🚗',photo:'',description:'Company vehicles',           color:'#0D1B2A',enabled:true},
      {id:'type_tablets',name:'Tablets',icon:'📱',photo:'',description:'Company tablets and devices',color:'#2563EB',enabled:true}
    ]);
    var storedAssets = load(K.ASSETS);
    if(!storedAssets || !storedAssets.length) save(K.ASSETS,[
      {id:'a1',typeId:'type_cars',   name:'Toyota Fortuner',      identifier:'ABC 1234',   notes:'',photo:'',available:true,enabled:true},
      {id:'a2',typeId:'type_cars',   name:'Toyota Vios',          identifier:'DEF 5678',   notes:'',photo:'',available:true,enabled:true},
      {id:'a3',typeId:'type_cars',   name:'Mitsubishi Strada',    identifier:'GHI 9012',   notes:'',photo:'',available:true,enabled:true},
      {id:'a4',typeId:'type_cars',   name:'Mitsubishi Montero',   identifier:'JKL 3456',   notes:'',photo:'',available:true,enabled:true},
      {id:'a5',typeId:'type_tablets',name:'iPad Air (1)',         identifier:'SN-IPAD-001',notes:'',photo:'',available:true,enabled:true},
      {id:'a6',typeId:'type_tablets',name:'iPad Air (2)',         identifier:'SN-IPAD-002',notes:'',photo:'',available:true,enabled:true},
      {id:'a7',typeId:'type_tablets',name:'Samsung Galaxy Tab A', identifier:'SN-SAM-001', notes:'',photo:'',available:true,enabled:true},
      {id:'a8',typeId:'type_tablets',name:'iPad Pro',             identifier:'SN-IPRO-001',notes:'',photo:'',available:true,enabled:true}
    ]);
    if(!load(K.RECORDS)) save(K.RECORDS,[]);
  }

  var types = {
    getAll:function(e){ var a=load(K.TYPES)||[]; return e?a.filter(function(t){return t.enabled;}):a; },
    get:function(id){ return (load(K.TYPES)||[]).find(function(t){return t.id===id;})||null; },
    add:function(d){ var a=load(K.TYPES)||[]; var item=Object.assign({id:uid(),photo:'',enabled:true},d); a.push(item); save(K.TYPES,a); return item; },
    update:function(id,d){ var a=load(K.TYPES)||[]; var i=a.findIndex(function(t){return t.id===id;}); if(i<0)return null; a[i]=Object.assign({},a[i],d); save(K.TYPES,a); return a[i]; },
    remove:function(id){ save(K.TYPES,(load(K.TYPES)||[]).filter(function(t){return t.id!==id;})); }
  };

  var assets = {
    getAll:function(e){ var a=load(K.ASSETS)||[]; return e?a.filter(function(x){return x.enabled;}):a; },
    getByType:function(tid,e){ return assets.getAll(e!==false).filter(function(a){return a.typeId===tid;}); },
    get:function(id){ return (load(K.ASSETS)||[]).find(function(a){return a.id===id;})||null; },
    add:function(d){ var a=load(K.ASSETS)||[]; var item=Object.assign({id:uid(),available:true,enabled:true},d); a.push(item); save(K.ASSETS,a); return item; },
    update:function(id,d){ var a=load(K.ASSETS)||[]; var i=a.findIndex(function(x){return x.id===id;}); if(i<0)return null; a[i]=Object.assign({},a[i],d); save(K.ASSETS,a); return a[i]; },
    remove:function(id){ save(K.ASSETS,(load(K.ASSETS)||[]).filter(function(a){return a.id!==id;})); },
    setAvail:function(id,av){ return assets.update(id,{available:av}); }
  };

  var users = {
    getAll:function(){ return load(K.USERS)||[]; },
    search:function(q){ if(!q)return []; var ql=q.toLowerCase().trim(); return (load(K.USERS)||[]).filter(function(u){ var n=u.name.toLowerCase(); return n.includes(ql)||n.split(' ')[0].startsWith(ql); }); },
    upsert:function(ud){ var a=load(K.USERS)||[]; var k=ud.name.toLowerCase().trim(); var i=a.findIndex(function(u){return u.name.toLowerCase().trim()===k;}); if(i>=0){ a[i]=Object.assign({},a[i],{phone:ud.phone,email:ud.email,lastSeen:new Date().toISOString()}); }else{ a.unshift({id:uid(),name:ud.name.trim(),phone:ud.phone.trim(),email:ud.email.trim(),lastSeen:new Date().toISOString()}); } save(K.USERS,a); },
    add:function(d){ var a=load(K.USERS)||[]; var k=d.name.toLowerCase().trim(); if(a.find(function(u){return u.name.toLowerCase().trim()===k;}))return null; var item={id:uid(),name:d.name.trim(),phone:(d.phone||'').trim(),email:(d.email||'').trim(),lastSeen:null}; a.push(item); save(K.USERS,a); return item; },
    update:function(id,d){ var a=load(K.USERS)||[]; var i=a.findIndex(function(u){return u.id===id;}); if(i<0)return null; a[i]=Object.assign({},a[i],d); save(K.USERS,a); return a[i]; },
    remove:function(id){ save(K.USERS,(load(K.USERS)||[]).filter(function(u){return u.id!==id;})); },
    bulkAdd:function(list){ var a=load(K.USERS)||[]; var ex=new Set(a.map(function(u){return u.name.toLowerCase().trim();})); var added=0; list.forEach(function(row){ var k=(row.name||'').toLowerCase().trim(); if(!k||ex.has(k))return; a.push({id:uid(),name:row.name.trim(),phone:(row.phone||'').trim(),email:(row.email||'').trim(),lastSeen:null}); ex.add(k); added++; }); save(K.USERS,a); return added; }
  };

  var records = {
    getAll:function(){ return load(K.RECORDS)||[]; },
    get:function(id){ return (load(K.RECORDS)||[]).find(function(r){return r.id===id;})||null; },
    getActive:function(){ return (load(K.RECORDS)||[]).filter(function(r){return r.status==='checked_out';}); },
    checkout:function(assetId,ud){
      var asset=assets.get(assetId); if(!asset||!asset.available||!asset.enabled)return null;
      var type=types.get(asset.typeId); var dt=nowSnap();
      var rec={id:uid(),assetId:assetId,assetTypeId:asset.typeId,assetName:asset.name,assetTypeName:type?type.name:'Unknown',assetIdentifier:asset.identifier,userName:ud.name.trim(),phone:ud.phone.trim(),email:ud.email.trim(),dateTaken:dt.date,timeTaken:dt.time,dateReturned:null,timeReturned:null,status:'checked_out',createdAt:dt.iso};
      var all=load(K.RECORDS)||[]; all.unshift(rec); save(K.RECORDS,all); assets.setAvail(assetId,false);
      users.upsert({name:ud.name,phone:ud.phone,email:ud.email}); return rec;
    },
    returnAsset:function(recordId){ var dt=nowSnap(); var all=load(K.RECORDS)||[]; var i=all.findIndex(function(r){return r.id===recordId;}); if(i<0)return null; all[i]=Object.assign({},all[i],{dateReturned:dt.date,timeReturned:dt.time,status:'returned',returnedAt:dt.iso}); save(K.RECORDS,all); assets.setAvail(all[i].assetId,true); return all[i]; },
    update:function(id,d){ var all=load(K.RECORDS)||[]; var i=all.findIndex(function(r){return r.id===id;}); if(i<0)return null; all[i]=Object.assign({},all[i],d); save(K.RECORDS,all); return all[i]; },
    filter:function(o){
      var r=load(K.RECORDS)||[];
      if(o.typeId)   r=r.filter(function(x){return x.assetTypeId===o.typeId;});
      if(o.assetId)  r=r.filter(function(x){return x.assetId===o.assetId;});
      if(o.userName) r=r.filter(function(x){return x.userName.toLowerCase().includes(o.userName.toLowerCase());});
      if(o.status)   r=r.filter(function(x){return x.status===o.status;});
      if(o.dateFrom) r=r.filter(function(x){return new Date(x.createdAt)>=new Date(o.dateFrom);});
      if(o.dateTo)   r=r.filter(function(x){return new Date(x.createdAt)<=new Date(o.dateTo+'T23:59:59');});
      return r;
    },
    stats:function(){ var all=load(K.RECORDS)||[]; var today=fmtDate(new Date()); return {total:all.length,active:all.filter(function(r){return r.status==='checked_out';}).length,todayOut:all.filter(function(r){return r.dateTaken===today;}).length,returned:all.filter(function(r){return r.status==='returned';}).length}; }
  };

  var admin = {
    getAll:function(){ return load(K.ADMINS)||[]; },
    login:function(username,password){ var admins=load(K.ADMINS)||[]; var match=admins.find(function(a){return a.username===username&&a.password===password;}); if(match){ save(K.SESSION,{loggedIn:true,adminId:match.id,username:match.username,ts:Date.now()}); return true; } return false; },
    logout:function(){ localStorage.removeItem(K.SESSION); },
    isLoggedIn:function(){ var s=load(K.SESSION); if(!s||!s.loggedIn)return false; if(Date.now()-s.ts>8*3600*1000){admin.logout();return false;} return true; },
    currentSession:function(){ return load(K.SESSION); },
    add:function(d){ var all=load(K.ADMINS)||[]; if(all.find(function(a){return a.username===d.username;}))return null; var item={id:uid(),username:d.username.trim(),password:d.password}; all.push(item); save(K.ADMINS,all); return item; },
    update:function(id,d){ var all=load(K.ADMINS)||[]; var i=all.findIndex(function(a){return a.id===id;}); if(i<0)return null; all[i]=Object.assign({},all[i],d); save(K.ADMINS,all); return all[i]; },
    remove:function(id){ var all=load(K.ADMINS)||[]; if(all.length<=1)return false; save(K.ADMINS,all.filter(function(a){return a.id!==id;})); return true; }
  };

  function calcDuration(fromIso, toIso) {
    if (!fromIso) return 'N/A';
    var from = new Date(fromIso);
    var to   = toIso ? new Date(toIso) : new Date();
    var ms   = to - from;
    if (isNaN(ms) || ms < 0) return 'N/A';
    var mins  = Math.floor(ms / 60000);
    var hours = Math.floor(ms / 3600000);
    var days  = Math.floor(ms / 86400000);
    if (mins  < 1)  return 'Just now';
    if (mins  < 60) return mins + ' min';
    if (hours < 24) { var rm = mins - hours*60; return rm > 0 ? hours+'h '+rm+'m' : hours+'h'; }
    var rh = hours - days*24;
    var dl = days === 1 ? '1 day' : days+' days';
    return rh > 0 ? dl+' '+rh+'h' : dl;
  }

  return {init:init,types:types,assets:assets,users:users,records:records,admin:admin,uid:uid,nowSnap:nowSnap,fmtDate:fmtDate,fmtTime:fmtTime,calcDuration:calcDuration};
})();

// Patch: expose settings API on existing AssetLog object
AssetLog.settings = (function(){
  var K = 'al_settings';
  var load = function(k){ try{ var v=localStorage.getItem(k); return v?JSON.parse(v):null; }catch(e){ return null; } };
  var save = function(k,v){ localStorage.setItem(k,JSON.stringify(v)); };
  return {
    get: function(){ return load(K) || {orgName:''}; },
    set: function(d){ var s = (load(K)||{}); save(K, Object.assign({}, s, d)); }
  };
})();

// Audit Log API
AssetLog.audit = (function(){
  var K = 'al_audit';
  var load = function(k){ try{ var v=localStorage.getItem(k); return v?JSON.parse(v):null; }catch(e){ return null; } };
  var save = function(k,v){ localStorage.setItem(k,JSON.stringify(v)); };
  return {
    log: function(action, detail, admin) {
      var entries = load(K) || [];
      entries.unshift({ id: Date.now().toString(36), ts: new Date().toISOString(), action: action, detail: detail||'', admin: admin||'system' });
      if (entries.length > 1000) entries = entries.slice(0, 1000);
      save(K, entries);
    },
    getAll: function() { return load(K) || []; },
    clear:  function() { save(K, []); }
  };
})();
