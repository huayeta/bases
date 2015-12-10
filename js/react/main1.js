var pr=require('./pr.js');

require.ensure([],function(require){
    var $=require('jquery');
    console.log($);
},'huayeta')

require.ensure([],function(require){
    var react=require('react');
    console.log(react);
},'huayeta');

console.log('main1.js');
pr();
