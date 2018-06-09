const socket = io(),
    chat = document.getElementById('chat'),
    input = document.getElementById('msgText'),

    insertString = function(text,classname,icon){
        let newText = document.createElement('div');
        if(classname) newText.className = classname;
        newText.textContent = text;
        if(icon){
            let iconSpan = document.createElement('span');
            iconSpan.style.background = 'url(http://maffia-online.ru/images/flags/'+icon+'.png) no-repeat';
            newText.appendChild(iconSpan);
        }
        chat.appendChild(newText);
        chat.scrollTop = chat.scrollHeight;
    },
    sendMessage = function(){
        if(!input.value) return;
        socket.emit('message', input.value);
        input.value = '';
    },
    someThing = function(count,first,some,many){
        var out, tmp = count%100;
        if(tmp>10 && tmp<20){
            out = count+' '+many;
        }else{
            switch(count%10){
                case 1: out = count+' '+first; break;
                case 2: case 3: case 4: out = count+' '+some; break;
                default: out = count+' '+many; break;
            }
        }
        return out;
    };

input.addEventListener('keydown',function(e){
    if(e.keyCode==13) sendMessage();
});
document.getElementById('sendButton').addEventListener('click',sendMessage);

socket.on('connection',function(pid){
    insertString('Присоединился новый участник','sysmsg',pid);
});
socket.on('disconnection',function(pid){
    insertString('Один из участников отсоединился','sysmsg',pid);
});
socket.on('message',function(data){
    insertString(data.text,'message',data.pid);
});
socket.on('count',function(data){
    insertString('В чате '+someThing(data,'участник','участника','участников'),'important');
});