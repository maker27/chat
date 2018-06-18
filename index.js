"use strict";
const express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),

    allClients = {},
    flags = ['ad','bj','cu','ga','ie','lc','mu','pl','sm','ua','ae','bm','cv','gb','il','li','mv','pm','sn','ug','af','bn','cx','gd','im','lk','mw','pn','so','uk','ag','bo','cy','ge','in','lr','mx','pr','sr','um','ai','br','cz','gf','io','ls','my','ps','ss','us','al','bs','de','gh','iq','lt','mz','pt','st','uy','am','bt','dj','gi','ir','lu','na','pw','sv','uz','an','bv','dk','gl','is','lv','nc','py','sy','va','ao','bw','dm','gm','it','ly','ne','qa','sz','vc','aq','by','do','gn','jm','ma','nf','re','tc','ve','ar','bz','dz','gp','jo','mc','ng','ro','td','vg','as','ca','ec','gq','jp','md','ni','rs','tf','vi','at','cc','ee','gr','ke','me','nl','ru','tg','vn','au','cd','eg','gs','kg','mg','no','rw','th','vu','aw','cf','eh','gt','kh','mh','np','sa','tj','wf','ax','cg','er','gu','ki','mk','nr','sb','tk','ws','az','ch','es','gw','km','ml','nu','sc','tl','ye','ba','ci','et','gy','kn','mm','nz','sd','tm','yt','bb','ck','eu','hk','kp','mn','om','se','tn','za','bd','cl','fi','hm','kr','mo','pa','sg','to','zm','be','cm','fj','hn','kw','mp','pe','sh','tr','zw','bf','cn','fk','hr','ky','mq','pf','si','tt','bg','co','fm','ht','kz','mr','pg','sj','tv','bh','cr','fo','hu','la','ms','ph','sk','tw','bi','cs','fr','id','lb','mt','pk','sl','tz'];

app.use(express.static('static'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

function getClientsCount(){
    return Object.keys(io.sockets.sockets).length;
}
function getRandomPid(){
    let randEl, flagsCount = flags.length;
    do{
        randEl = flags[Math.floor(Math.random()*flagsCount)];
    } while(allClients[randEl] && flagsCount>Object.keys(allClients).length);
    return randEl;
}

io.on('connection', function(socket){
    socket.number = getRandomPid();
    allClients[socket.number] = Date.now();
    socket.broadcast.emit('connection',socket.number);
    io.emit('count',getClientsCount());

    socket.on('disconnect', function(){
        socket.broadcast.emit('disconnection',socket.number);
        delete allClients[socket.number];
        io.emit('count',getClientsCount());
    });
    socket.on('message',function(data){
        if(data) io.emit('message',{text:data,pid:socket.number});
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});