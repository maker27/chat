const socket = io(),
    chat = document.getElementById('chat'),
    input = document.getElementById('msgText'),

    insertString = function(text){
        let newText = document.createElement('div');
        newText.textContent = text;
        chat.appendChild(newText);
    },
    sendMessage = function(){
        if(!input.value) return;
        socket.emit('message', input.value);
        input.value = '';
    };

input.addEventListener('keydown',function(e){
    if(e.keyCode==13) sendMessage();
});
document.getElementById('sendButton').addEventListener('click',sendMessage);

socket.on('connection',function(){
    insertString('Присоединился новый участник');
});
socket.on('message',function(data){
    insertString(data);
});