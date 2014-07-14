function tplawesome(a,c){res=a;for(var b=0;b<c.length;b++){res=res.replace(/\{\{(.*?)\}\}/g,function(d,e){return c[b][e]})}return res};
