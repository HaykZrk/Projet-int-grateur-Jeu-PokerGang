let formulaire_connexion=document.getElementById("form_connexion");


//**** TO DO *****
//comment récuperer le probleme d'authentification ? 
formulaire_connexion.addEventListener('submit',(e)=>
{ 
    let username=document.getElementById("username").value;
    let password=document.getElementById("password").value;

    console.log(username,password)
     
})