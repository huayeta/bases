const isTrue=(val)=>{
    if(!val)return false;
    if(val=='0')return false;
    if(val=='')return false;
    return true;
}

const guideUser=()=>{
    fetch('?m=member&c=index&a=getconfig',{
        credentials:'include',
        headers: {
           "Date-Type": "json"
         }
    }).then((res)=>res.json()).then(function(re){
        if(re.status && re.info){
            var member=re.info.member;
            if(member.addinfo=='1'){
                fetch('?m=member&c=index&a=getinfo&expand=true',{
                    credentials:'include',
                    headers: {
                       "Date-Type": "json"
                     }
                }).then((res)=>res.json()).then(function(ret){
                    if(member.isemail && member.isemail=='1' && !isTrue(ret.info.isemail)){
                        window.location.href='?m=member&c=account&a=verify_email';
                    }
                    if(member.ismobile && member.ismobile=='1' && !isTrue(ret.info.ismobile)){
                        window.location.href='?m=member&c=account&a=verify_mobile';
                    }
                    if(member.isauth && member.isauth=='1' && !isTrue(ret.info.isidcard)){
                        window.location.href='?m=member&c=account&a=verify_card';
                    }
                });
            }
        }
    });
}

export default guideUser;
