module.exports={
    path:'/classify',
    getComponent(location,cb){
        require.ensure([],(require)=>{
            cb(null,require('./components/index.jsx'))
        })
    }
}
