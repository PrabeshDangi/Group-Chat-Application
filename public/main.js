const socket=io()

const clientsTotal=document.getElementById('clients-total')
const messageContainer=document.getElementById('message-container')
const nameInput=document.getElementById('name-input')
const messageForm=document.getElementById('message-form')
const messageInput=document.getElementById('message-input')

messageForm.addEventListener('submit',(event)=>{
   event.preventDefault()
   sendMessage()
})

socket.on('clients-total',(data)=>{
   clientsTotal.innerText=`Total members:${data}`
})

function sendMessage(){
   if(messageInput.value=== "")// yedi msg kehi pani lekheko chhaina vaney msg send hudaina
   {
      return;
   }
   const data= {
      name: nameInput.value,
      message: messageInput.value,
      dataTime: new Date()
   }
   socket.emit('message',data)
   addMessagetoUI(true,data)
   messageInput.value=''
}

socket.on("chat",(data)=>{
   //console.log(data)
   addMessagetoUI(false,data)
})

function addMessagetoUI(isownMessage,data){
   clearFeedback()
   const element=`
   <li class="${isownMessage? 'message-right':'message-left'}">
   <p class="message">
       ${data.message}
       <span>${data.name} 🫥 ${moment(data.dataTime).fromNow()}</span>
   </p>

</li>`

messageContainer.innerHTML+=element
scrollMessageContainer()
}

function scrollMessageContainer(){
   messageContainer.scrollTo(0,messageContainer.scrollHeight)
}
let typingTimer;

messageInput.addEventListener('focus', (e) => {
   clearTimeout(typingTimer); // Clear the previous timer if exists

   typingTimer = setTimeout(() => {
      socket.emit('feedback', {
         feedback: `${nameInput.value} is typing a message.....✍🏻 `,
      });
   }, 1000); // Set a timer for 1000 milliseconds (adjust as needed)
});

messageInput.addEventListener('keypress', (e) => {
      socket.emit('feedback', {
         feedback: '',
      });
   });

messageInput.addEventListener('blur', (e) => {
   socket.emit('feedback', {
      feedback: '',
   });
});

// Additionally, you might want to clear the timer when switching sockets
socket.on('disconnect', () => {
   clearTimeout(typingTimer);
});



socket.on('feedback',(data)=>{
   clearFeedback()
   const element=`
   <li class="message-feedback">
   <p class="feedback" id="feedback">${data.feedback}</p>
</li>`
messageContainer.innerHTML+=element

})

function clearFeedback() {
   document.querySelectorAll('li.message-feedback').forEach((element) => {
     element.parentNode.removeChild(element)
   })
 }