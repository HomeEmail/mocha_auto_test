//返回如下格式：
/*
  [
    {
      tag:'模块名称',
      url:'api路径',
      method:'get',
      reqAccept:'application/json', //application/x-www-form-urlencoded
      resContentType:'\\*\\/\\*',
      query:{},//参数 for get method
      data:{},//参数 for post method
      summary:'',//接口名称
      status:200,//返回状态码 统一设置200，这满足需求了，真有些特殊需求手动改改生成后的代码就行（反正你也要手动改生成代码里的传参值），有需要更细力度的控制需要改代码
    }
  ]
*/
function parse_swagger2(obj){ //obj=swagger2.0 json对象
  let apis = [];
  for(let path in obj.paths){
    let item = {
      tag:'',
      url:'',
      method:'get',
      reqAccept:'application/json', //application/x-www-form-urlencoded
      resContentType:'\\*\\/\\*',
      query:{},//for get method
      data:{},//for post method
      summary:'',
      status:200,
    };
    item.url=path;
    for(let method in obj.paths[path]){
      item.method=method;
      const apiDetail = obj.paths[path][method];
      if(apiDetail.tags&&apiDetail.tags[0]){
        item.tag=apiDetail.tags[0];
      }
      if(apiDetail.summary){
        item.summary=apiDetail.summary;
      }
      if(apiDetail.consumes&&apiDetail.consumes[0]){
        item.reqAccept=apiDetail.consumes[0];
      }
      if(apiDetail.produces&&apiDetail.produces[0]){
        item.resContentType=apiDetail.produces[0];
      }
      let query = {},data={};
      if(apiDetail.parameters&&apiDetail.parameters.length>0){
        for(let p=0,plen=apiDetail.parameters.length;p<plen;p++){
          let pitem = apiDetail.parameters[p];
          if(pitem.in=='body'){
            if(pitem.schema&&pitem.schema['$ref']){ //这是一个对象引用
              const newData = getObjByRef(obj,pitem.schema['$ref']);
              data={
                ...data,
                ...newData
              };
            } else {
              data[pitem.name]=pitem.type=='integer'?0:pitem.type||'';
            }
          }
          if(pitem.in=='query'){
            query[pitem.name]=pitem.type=='integer'?0:pitem.type||'';
          }
        }
      }
      item.query=query;
      item.data=data;
      break;
    }
    apis.push(item);
  }
  // console.log(apis);
  return apis;
}
function getObjByRef(obj,refStr){ //refStr=#/aa/bb
  const str=refStr.replace('#/','');
  const str1 = str.replace(/\//ig,'.');
  const result = getObjByObjPathStr(obj,str1);
  let data={};
  if(result.type=='object'){
    if(result.properties){
      for(let pro in result.properties){
        if(result.properties[pro]['$ref']){ //对象引用
          data[pro]=getObjByRef(obj,result.properties[pro]['$ref']);
        }else if(result.properties[pro].type=='array'){ //数组
          data[pro]=[];
          if(result.properties[pro].items&&result.properties[pro].items['$ref']){
            data[pro].push(getObjByRef(obj,result.properties[pro].items['$ref']));
          }
        } else { // 普通的
          data[pro] = result.properties[pro].type=='integer'?0:(result.properties[pro].type=='boolean'?true:result.properties[pro].type||'');
        }
      }
    }
  }
  if(result.type=='array'){
    data=[];
    if(result.items&&result.items['$ref']){
      data.push(getObjByRef(obj,result.items['$ref']));
    }
  }
  return data;
}
function getObjByObjPathStr(obj,str){ //str='aa.bb.cc'
  if(!str) return null;
  const ary = str.split('.');
  if(!obj||Array.isArray(obj)||typeof obj!='object') return null;
  let temp=obj;
  for(let i=0,len=ary.length;i<len;i++){
    if(temp[ary[i]]){
      temp=temp[ary[i]];
    }else{
      break;
    }
  }
  return temp;
}


exports.parse_swagger2=parse_swagger2;