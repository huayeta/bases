module.exports={
    path:'/add',
    getComponent(location,cb){
        require.ensure([],(require)=>{
            cb(null,require('./components/index.jsx'))
        })
    }
}
