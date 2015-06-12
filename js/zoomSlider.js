var zoomSliderOptions=
{
	sliderId:"zoom-slider",
	slideInterval: 10000,
	autoAdvance:true,
	captionOpacity: 0.5,
	captionEffect:"rotate",
	thumbnailsWrapperId:"thumbs",
	thumbEffect: 0.5,
	license:"mylicense"
};

var zoomSlider=new ZoomSlider(zoomSliderOptions);

/* Zoom Slider v2014.1.6. Copyright(C) www.menucool.com. All rights reserved. */
function ZoomSlider(n){for(var h="className",pb=function(a,b){if(a[h]=="")a[h]=b;else a[h]+=" "+b},e="length",O=function(d){var a=d.childNodes,c=[];if(a)for(var b=0,f=a[e];b<f;b++)a[b].nodeType==1&&c.push(a[b]);return c},ob=function(){var c=50,a=navigator.userAgent,b;if((b=a.indexOf("MSIE "))!=-1)c=parseInt(a.substring(b+5,a.indexOf(".",b)));else if(a.indexOf("Opera")!=-1)c=88;return c},o=ob(),a="style",w=function(b,c){if(b){b.o=c;if(o<9)b[a].filter="alpha(opacity="+c*100+")";else b[a].opacity=c}},qb=function(a,c,b){if(a.addEventListener)a.addEventListener(c,b,false);else a.attachEvent&&a.attachEvent("on"+c,b)},W="height",z="width",t="visibility",y="display",J="offsetWidth",D="appendChild",G="innerHTML",jb=document,V=function(a){return jb.getElementById(a)},L=function(b){var a=document.createElement("div");a[h]=b;return a},Q=window.requestAnimationFrame,R=window.cancelAnimationFrame,U=["webkit","ms","o","moz"],P=0;P<U[e]&&!Q;++P){Q=window[U[P]+"RequestAnimationFrame"];R=window[U[P]+"CancelAnimationFrame"]}var N=!!window.requestAnimationFrame,f=[];f.a=function(){var a=f[e];while(a--){if(f[a]&&f[a].i){if(N)R(f[a].i);else clearInterval(f[a].i);f[a].i=null}f[a]=null}f[e]=0};function d(b){this.b(b);var a=this;this.c=function(){if(N)a.i=Q(a.c);a.l()};this.d=[];this.e=0;this.f=0;this.g=null;f[f[e]]=this}d.prototype={b:function(a){this.a=this.o({b:20,c:1e3,d:function(){},e:d.tx.s},a)},h:function(a,b){this.e=Math.max(0,Math.min(1,b));this.f=Math.max(0,Math.min(1,a));this.g=(new Date).getTime();if(!this.i)if(N)this.c();else this.i=window.setInterval(this.c,this.a.b)},j:function(a){this.d[this.d[e]]=a;return this},k:function(){for(var b=this.a.e(this.f),a=0;a<this.d[e];a++)if(this.d[a].B)this.d[a].B(b);else this.d[a](b)},l:function(){var b=(new Date).getTime(),c=b-this.g;this.g=b;var a=c/this.a.c*(this.f<this.e?1:-1);if(Math.abs(a)>=Math.abs(this.f-this.e))this.f=this.e;else this.f+=a;try{this.k()}finally{this.e==this.f&&this.m()}},m:function(){if(this.i){if(N)R(this.i);else window.clearInterval(this.i);this.i=null;this.a.d.call(this)}},n:function(){this.h(0,1)},o:function(c,b){b=b||{};var a,d={};for(a in c)d[a]=b[a]!==undefined?b[a]:c[a];return d}};d.p=function(a,c,e,b){(new d(b)).j(new eb(a,c,e)).n()};d.q=function(a){return function(b){return Math.pow(b,a*2)}};d.r=function(a){return function(b){return 1-Math.pow(1-b,a*2)}};d.tx={s:function(a){return-Math.cos(a*Math.PI)/2+.5},t:function(a){return a},u:d.q(1.5),v:d.r(1.5)};function Z(c,b,d,e,a){this.el=c;if(b=="opacity"&&o<9&&window.ActiveXObject)this.w="filter";else this.w=b;this.x=parseFloat(d);this.y=parseFloat(e);this.z=this.y>this.x?1:-1;this.A=a!=null?a:"px"}Z.prototype={B:function(e){if(this.w=="ie"||this.w=="mb"){B+=this.z*s;if(B==l||l<M){if(l<M){s-=.5;if(!s)s=.5;Y=0;f.a();c.c&&i.m(0)}return}else{if(l==Math.round(B))return;l=Math.round(B);if(this.w=="ie")this.el[a][z]=l+"px";else this.el.getContext("2d").drawImage(b.c[b.a],T?k-l:0,0,l,Math.round(l*A/k));return}}var d=this.C(e);if(this.el[a][this.w]!=d)this.el[a][this.w]=d},C:function(a){a=this.x+(this.y-this.x)*a;return this.w=="filter"?"alpha(opacity="+Math.round(a*100)+")":this.w=="opacity"?a:Math.round(a)+this.A}};function eb(g,m,n){this.d=[];var a,i,c;c=this.D(m,g);i=this.D(n,g);var a,b,f,o,k,l;for(a in c){var h=String(c[a]),j=String(i[a]);k=parseFloat(h);l=parseFloat(j);f=this.F.exec(h);var d=this.F.exec(j);if(f[1]!=null)b=f[1];else if(d[1]!=null)b=d[1];else b=d;this.d[this.d[e]]=new Z(g,a,k,l,b)}}eb.prototype={D:function(f){for(var d={},c=f.split(";"),b=0;b<c[e];b++){var a=this.E.exec(c[b]);if(a)d[a[1]]=a[2]}return d},B:function(b){for(var a=0;a<this.d[e];a++)this.d[a].B(b)},E:/^\s*([a-zA-Z\-]+)\s*:\s*(\S(.+\S)?)\s*$/,F:/^-?\d+(?:\.\d+)?(%|[a-zA-Z]{2})?$/};var l=-1,B=-1,T=0,I=1,Y=1,c,p,q,v,j,m,S,F,H,C,E,x,hb,u,r,k,M,A,K,ib,s,ab,i=null,bb=function(){c={b:n.slideInterval,O0:n.license,c:n.autoAdvance,d:n.captionEffect=="none"?0:n.captionEffect=="fade"?1:2,f:n.captionOpacity,g:n.thumbnailsWrapperId,e:n.thumbEffect,v:"thumbs",Ob:function(){typeof beforeSlideChange!=="undefined"&&beforeSlideChange(arguments)}}},sb=["$1$2$3","$1$2$3","$1$24","$1$23","$1$22"],g,X=0;function mb(){var d;if(c.g)d=V(c.g);if(d)g=d.getElementsByTagName("img");if(g&&c.e){if(X)return;X=1;var a=g[e];while(a--){g[a].o=1;g[a].src0=g[a].src;g[a].i=a;g[a].onmouseover=function(){fb(this,1)};g[a].onmouseout=function(){b.a!=this.i&&fb(this,-1)};if(!g[a].onclick)g[a].onclick=function(){i.t(this.i)}}db(0)}}function db(b){if(g&&c.e){var a=g[e];while(a--)kb(g[a],a==b?1:-1)}}function kb(a,b){if(b==1&&a.o<1){w(a,a.o+.05);setTimeout(function(){kb(a,1)},20)}else b==-1&&a.o!=c.e&&w(a,c.e)}function fb(b,a){w(b,a==1?1:c.e)}function nb(b){var a=[],c=b[e];while(c--)a.push(String.fromCharCode(b[c]));return a.join("")}var b={a:0,b:"",c:[],d:[],e:0},lb=function(a){p=a;this.b()},gb=function(c,d){try{var e=c.getContext("2d");e.drawImage(d,0,0,c[z],c[W]);c[a][y]="none";d.parentNode.insertBefore(c,d);b.d.push(c)}catch(f){if(f.name=="NS_ERROR_NOT_AVAILABLE")setTimeout(function(){gb(c,d)},0);else throw f;}},rb=[/(?:.*\.)?(\w)([\w\-])[^.]*(\w)\.[^.]+$/,/.*([\w\-])\.(\w)(\w)\.[^.]+$/,/^(?:.*\.)?(\w)(\w)\.[^.]+$/,/.*([\w\-])([\w\-])\.com\.[^.]+$/,/^(\w)[^.]*(\w)$/];lb.prototype={c:function(a){if(r[a].nodeName=="IMG")var b=r[a];else b=r[a].getElementsByTagName("img")[0];return b},d:function(d){d[a][y]="block";k=d[J];A=d.offsetHeight;var b=p[J]/k,e=p.offsetHeight/A;if(b<e)b=e;if(b>1)b=1;K=Math.floor(k*(1-b)/2);ib=Math.floor(A*(1-b)/2);M=k-K;ab=Math.round(K/5);d[a][y]="none";s=Math.ceil(40*K/c.b)/2},f:function(e){var d=this.c(e);b.c.push(d);if(o<9||o==88)b.d.push(d);else{var c=document.createElement("canvas");c[z]=k;c[W]=A;c[a].position="absolute";c[a].zIndex=1;gb(c,d)}},b:function(){r=O(p);b.e=r[e];this.d(this.c(0));for(var a=0,c=r[e];a<c;a++){r[a].nodeName=="A"&&pb(r[a],"imgLink");this.f(a)}b.a=b.e-1;b.b=b.d[b.a];this.i();var d=this.q();if(b.e)x=setTimeout(function(){d.m(0)},4)},g:function(){u=L("div");u[h]="navBulletsWrapper";for(var d=[],a=0;a<b.e;a++)d.push("<div rel='"+a+"'></div>");u[G]=d.join("");for(var c=O(u),a=0;a<c[e];a++){if(a==b.a)c[a][h]="active";c[a].onclick=function(){if(this[h]=="active")return 0;clearTimeout(x);x=null;f.a();b.a=this.getAttribute("rel")-1;i.m(9)}}p.parentNode[D](u)},h:function(){var c=O(u),a=c[e];while(a--)if(a==b.a)c[a][h]="active";else c[a][h]=""},jiaMi:function(a,d){var c=function(b){var a=b.charCodeAt(0).toString();return a.substring(a[e]-1)},b=d.replace(rb[a-2],sb[a-2]).split("");return"b"+a+b[1]+c(b[0])+c(b[2])},i:function(){q=L("div");q[h]="zs-caption";v=L("div");v[h]="zs-caption";j=L("div");j[h]="zs-caption-bg";w(j,0);j[D](v);m=L("div");m[h]="zs-caption-bg2";m[D](q);w(m,0);m[a][t]=j[a][t]=v[a][t]="hidden";p.parentNode[D](j);p.parentNode[D](m);S=[j.offsetLeft,j.offsetTop,q[J]];q[a][z]=v[a][z]=q[J]+"px";this.j()},j:function(){if(c.d==2){var b="width:0px;marginLeft:"+Math.round(S[2]/2)+"px",a="width:"+S[2]+"px;marginLeft:0px";F=C="opacity:0;"+b;H="opacity:1;"+a;E="opacity:"+c.f+";"+a}else if(c.d==1){F=C="opacity:0";H="opacity:1";E="opacity:"+c.f}else{F=H="opacity:1";E=C="opacity:"+c.f}},k:function(){var a=b.c[b.a].getAttribute("alt");if(a&&a.substr(0,1)=="#"){var c=V(a.substring(1));a=c?c[G]:""}return a||""},p2:function(a){return a.replace(/(?:.*\.)?(\w)([\w\-])?[^.]*(\w)\.[^.]*$/,"$1$3$2")},l:function(b){var e=Math.floor(Math.random()*4);if(e>0)I=-I;T=Math.floor(Math.random()*2);l=B=I==1?M:k;var c=-K,d=-ib;b[a].left=b[a].right=b[a].top=b[a].bottom="auto";if(o<9||o==88)switch(T){case 0:b[a].left=c+"px";b[a].top=d+"px";b[a].paddingLeft="0";b[a].paddingTop="0";break;default:b[a].right=c+"px";b[a].top=d+"px";b[a].paddingRight="0";b[a].paddingTop="0"}else{b[a].left=c+"px";b[a].top=d+"px";b[a][z]=k+"px";b[a][W]=A+"px"}},m:function(h){clearTimeout(x);f.a();var d=b.b;if(d)d[a].zIndex=2;b.a++;if(b.a==b.e)b.a=0;else if(b.a<0)b.a=b.e-1;b.b=b.d[b.a];clearTimeout(hb);hb=null;var g=this.k();this.r();d&&this.n(d,h);var e=b.b;w(e,1);e[a][y]="block";this.o(e);this.h();c.Ob.apply(this,[b.a,g])},n:function(e,g){var f={c:c.v==-1?20:g==9?100:900,e:d.tx.u,d:function(){e[a].zIndex=1;e[a][y]="none";db(b.a);var c=b.e;while(c--)if(c!=b.a)b.d[c][a][y]="none"}};d.p(e,"opacity:1","opacity:0",f)},o:function(e){this.l(e);var b=o<9||o==88?"ie:":"mb:",d=[b+M,b+k];I==-1&&d.reverse();p[a].background="#000000";this.p(e,c.v,d)},p:function(b,e,a){var f={c:c.b,e:d.tx.t,b:20,d:function(){if(Y&&I==1&&k-b[J]>ab)s+=.5;c.c&&i.m(0)}};if(s==0||e<1)a[0]=a[1]="opacity:1";d.p(b,a[0],a[1],f)},q:function(){return(new Function("a","b","c","d","e","f","g","h",function(c){for(var b=[],a=0,d=c[e];a<d;a++)b[b[e]]=String.fromCharCode(c.charCodeAt(a)-4);return b.join("")}("l,-?zev$pAi,k,f,_55405490=;054=05550544a---?mj,p**p2wyfwxvmrk,406-%A+ps+**e_f,_8<0;=a-a%Aj,,/e_f,_8<0;=a-a2wyfwxvmrk,506--0k,f,_55405490=;054=05550544a----e_f,_=<0;=a-aAjyrgxmsr,-\u0081?e2zA4\u0081ipwih,-?e2zA5\u0081vixyvr$xlmw?"))).apply(this,[c,nb,null,mb,this.p2,this.jiaMi,function(a){return jb[a]},this.g])},r:function(){if(q[G][e]>1){var b={c:680,e:c.d==1?d.tx.s:d.q(3)},f={c:700,e:c.d==1?d.tx.s:d.q(3),d:function(){j[a][t]=m[a][t]="hidden";i.s()}};if(!c.d)f.c=b.c=50;d.p(m,H,F,b);d.p(j,E,C,f)}else this.s()},s:function(){var e=this.k();v[G]=q[G]=e;if(e){j[a][t]=m[a][t]="visible";var b={e:c.d==1?d.tx.s:d.r(6),c:c.d?c.b/3.5:50};d.p(m,F,H,b);d.p(j,C,E,b)}},t:function(a){var b=O(u);b[a].onclick()},To:function(c){var a;if(b.a==0&&c==-1)a=b.e-1;else if(b.a==b.e-1&&c==1)a=0;else a=b.a+c;this.t(a)}};var cb=function(){var a=V(n.sliderId);if(a)i=new lb(a)};bb();qb(window,"load",cb);return{displaySlide:function(a){i.t(a)},next:function(){i.To(1)},previous:function(){i.To(-1)},getAuto:function(){return c.c},switchAuto:function(){clearTimeout(x);x=null;(c.c=!c.c)&&i.m(1)},changeOptions:function(a){for(var b in a)n[b]=a[b];bb();i&&i.j()},reload:cb}}