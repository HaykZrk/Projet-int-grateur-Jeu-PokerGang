<template>
    <main>
    <div class="page">
    <header>
        <img id="logo_texte" src="../../public/img/poker_gang.png" alt="Poker Gang"/>
        <div id="droite">
            <div id="infos_user">
                <span>{{ user.pseudo }}</span>
                <div id="jetons">
                    <span>{{ user.jetons }}</span>
                    <img src="../../public/img/tokens.png" alt="jetons poker">
                </div>
                <div id="menu_deroulant">
                    <button id="profil"><RouterLink id="lien_profil" to = "/profile">{{ $t("profil") }}</RouterLink></button>
                    <button id="deconnexion"><RouterLink id="lien_deconnexion" to = "/home">{{ $t("deconnexion") }}</RouterLink></button>
                </div>
            </div>
            <img v-if="$i18n.locale=='fr'" id="drapeau" @click="changeLangue($i18n.locale)" src="../../public/img/uk.png" alt="Drapeau Royaume-Uni"/>
            <img v-else-if="$i18n.locale=='en'" id="drapeau" @click="changeLangue($i18n.locale)" src="../../public/img/fr.png" alt="Drapeau France"/>  
        </div>
    </header>

    <div id="section_bouton_logo">
        <button id="#bouton_retour"><RouterLink to="/accueil">{{ $t("retour") }}</RouterLink></button>
        <img id="logo" src="../../public/img/logo_bleu.png" alt="Logo couronne"/>
        <div id="div_vide"></div>
    </div>
    <div id="profile">
    <div>
        <p id="h_pseudo">{{ user.pseudo }}</p>
        <p>{{ $t("parties_gagnees") }} {{ ClassementInfo.nb_victoires }} </p>
    </div>
        <div id="deux_bouttons">
            <button  @click="changerPseudo()">{{ $t("change_pseudo") }}</button>
            <button @click="changerMDP()">{{ $t("change_mdp") }}</button>
        </div>
    <form @submit.prevent="modifierPseudo()" id="form_modif" >
        <input type="text" id="pseudo" name="pseudo" :placeholder="$t('new_pseudo')" >

        <input type="password" id="mdp" name="mdp"  :placeholder="$t('new_mdp')" >

        <input type="password" id="conf_mdp" name="conf_mdp" :placeholder="$t('confirm_mdp')" >

  
        <button id="confirmer" type="submit">{{ $t("confirm") }}</button>
    </form>
    </div>
    <footer>
        <a target="_blank" href="https://linktr.ee/poker_gang"><img src="../../public/img/logo_instagram.png" alt="Instagram"></a>
    </footer>
    </div>
    </main>
</template>

<script>
import i18n from '../locales/i18n';

export default {
    data(){
        return{
            user:[],
            ClassementInfo: [],
            afficherChampPseudo: false,
            afficherChampMDP: false,
            nouveauPseudo:'',
            
            

        };
    },
    beforeCreate: function () {
        document.body.className = 'all';
    },
    methods: {
        changeLangue(locale) {
            if (locale == 'en') {
                i18n.global.locale = 'fr'
            }
            if (locale == 'fr') {
                i18n.global.locale = 'en'
            }
        },
        getUserInfo() {
            fetch('/getUserInfo')
                .then(response => response.json())
                .then(data => {
                    console.log("data",JSON.stringify(data));
                    this.user = data;
                    console.log("i'm here "+JSON.stringify(this.user));
                })
                .catch(error => {
                    console.error('Error', error);
                    console.log("erreur getuserinfo")
                });
        },

        modifierPseudo() {
            const nouveauPseudo ={
                iduser:this.user.id_user,
                newusername:document.getElementById('pseudo').value
            }
            
        fetch('/verifierusername', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(nouveauPseudo)
        })
        .then((response) => {
            if (response.ok) {
            }
            throw new Error('Réponse réseau incorrecte');
        })
        .then(data => {
            if (data.message === 'Pseudo existe') {
            this.messagePseudo = 'Ce pseudo est déjà pris';
            this.pseudoDisponible = false;
            } else {
            this.messagePseudo = 'Ce pseudo est disponible';
            this.pseudoDisponible = true;
            }
        })
        .catch(error => {
            console.error('Erreur de fetch :');
            alert(error);   
        });
        if (this.pseudoDisponible) {
            fetch('/changeusername', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nouveauPseudo)
            })
            .then(response => {
            if (response.ok) {
                this.messageChangementPseudo = 'Le pseudo a été changé';
                this.pseudo = nouveauPseudo;
            }
            throw new Error('Réponse réseau incorrecte');
            })
            .catch(error => {
            console.error('Erreur de fetch :');
            alert(error);
            });
        }
        },
        getclassmentinfo() {
            fetch('/getUserStats')
            .then(response => response.json())
            .then(data => {
                this.ClassementInfo = data;
                console.log("getuser stats = "+ JSON.stringify(this.ClassementInfo));
            })
            .catch(error => {
                console.log(error);
            });
        },
        afficheMenuDeroulant(){
            window.addEventListener('click', function(e){   
            if (document.getElementById('infos_user').contains(e.target)){
                document.getElementById("menu_deroulant").style.visibility = 'visible';
            } else{
                document.getElementById("menu_deroulant").style.visibility = 'hidden';
            }
            });
        },
        changerPseudo() {
            this.afficherChampPseudo = true;
            this.afficherChampMDP = false;
            if (this.afficherChampPseudo) {
                console.log("JESUIS LAAAAAAAAAAAAAAAAAAA");
                document.getElementById("pseudo").style.display = "block";
                document.getElementById("confirmer").style.display = "block";

                document.getElementById("mdp").style.display = "none";
                document.getElementById("conf_mdp").style.display = "none";


            }
    
        },
        changerMDP() {
            this.afficherChampMDP = true;
            this.afficherChampPseudo = false;
            if (this.afficherChampMDP) {
                console.log("JESUIS LAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAA");

                document.getElementById("pseudo").style.display = "none";
                document.getElementById("confirmer").style.display = "block";
                document.getElementById("mdp").style.display = "block";
                document.getElementById("conf_mdp").style.display = "block";


            }
        },
    },
    mounted(){
        this.afficheMenuDeroulant();
        this.getUserInfo();
        this.getclassmentinfo();


    }
}

</script>


<style scoped>
*{
    color: white;
    font-family: 'Rowdies';
}

#app{
    background-size: cover;
}

.page{
    flex-wrap: wrap;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;   
}

a:link{
    text-decoration: none;
    color: white;
    font-family: 'Rowdies';
}

a {color:#FFFFFF;}      
a:visited {color:#FFFFFF;}
a:hover {color:#FFFFFF;} 
a:active {color:#FFFFFF;} 

header{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    height: 45px;
}

header img:first-child{
    height: 18px;
    width: auto;
    margin-left: 0px;
    margin-top: 10px;
}

@media all and (min-width: 500px){
    header img:first-child{
        margin-left: 20px;
    }
}

@media all and (min-width: 800px){
    header img:first-child{
        height: 25px;
    }
}

header img:last-child{
    height: 45px;
    width: 55px ;
    border-radius: 70px;
    margin-right: 5px;
    margin-top: 10px;
}

@media all and (min-width: 500px){
    header img:last-child{
        margin-right: 20px;
    }
}

header #droite{
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

@media all and (min-width: 500px){
    header #droite{
        flex-direction: row;
        align-items: center;
    }
}

header #droite #infos_user{
    display: flex;
    flex-direction: column;
    justify-content:space-between;
    align-items: center;
    width: 170px;
    height: 70px;
    background-color: #022F4C;
    border: none;
    border-radius: 70px;
    font-size: 18px;
    margin-top: 0px;
    margin-right: 5px;
    cursor: pointer;
}

@media all and (min-width: 500px){
    header #droite #infos_user{
        margin-right: 30px;
        margin-top: 25px;
    }
}


@media all and (min-width: 800px){
    header #droite #infos_user{
        width: 340px; /* */
        height: 45px;
        font-size: 25px;
        margin-top: 10px;
        flex-direction: row;
    }
}



header #droite span:first-of-type{
    margin-left: 0px;
    margin-top: 5px;
}

@media all and (min-width: 800px){
    header #droite span:first-of-type{
        margin-left: 20px;
        margin-top: 0px;
    }
}


header #droite #jetons{
    display: flex;
    flex-direction: row;
    justify-content:space-between;
    align-items: center;
    visibility: visible;
}


header #droite #jetons img{
    margin: 0;
    margin-left: 5px;
    width: 40px;
    height: auto;
}

@media all and (min-width: 800px){
    header #droite #jetons img{
        margin-right: 10px;
        margin-left: 5px;
    }
}

header #droite #infos_user #menu_deroulant{
    visibility: hidden;
    display: flex;
    flex-direction: column;
    text-align: center;
    position: absolute;
    top: 78px;
    right: 102px;
    width: 190px;
    background: #FFFFFF;
    opacity: 0.8;
    border-radius: 15px;
}

@media all and (min-width: 800px){
    header #droite #infos_user #menu_deroulant{
        top: 59px;
        right: 130px;
        width: 300px;
    }
}

header #droite #infos_user #menu_deroulant button{
    margin-top: 7px;
    margin-bottom: 7px;
    background-color: transparent;
    border: none;
}

header #droite #infos_user #menu_deroulant a{
    color:#022F4C;
    font-size: 18px;
}

@media all and (min-width: 800px){
    header #droite #infos_user #menu_deroulant a{
        font-size: 22px;
    }

}


#section_bouton_logo {
    width: 100%;
    display: flex;
    flex-direction: column-reverse;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 30px;
    /**margin-bottom: 0px;*/
    margin-top: 1.5vh;
}

@media all and (min-width: 1000px) {
    #section_bouton_logo {
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 0px;
    }
}

#section_bouton_logo button:first-of-type {
    width: 200px;
    height: 45px;
    background: rgba(2, 47, 76, 0.37);
    border: none;
    border-radius: 70px;
    font-size: 14px;
    margin-left: 0px;
    transition: all 0.3s ease-in-out;

}
#section_bouton_logo button:first-of-type:hover {
  transform: scale(1.05);
}

@media all and (min-width: 500px) {
    #section_bouton_logo button:first-of-type {
        font-size: 25px;
        width: 250px;
        height: 60px;
    }
}

@media all and (min-width: 1000px) {
    #section_bouton_logo button:first-of-type {
        margin-left: 104px;
        margin-top: 85px;
    }
}

#section_bouton_logo div:last-of-type {
    width: 0px;
    height: 0px;
    margin-right: 0px;
    margin-top: 0px;
}

@media all and (min-width: 1000px) {
    #section_bouton_logo div:last-of-type {
        width: 250px;
        height: 60px;
        margin-right: 104px;
        margin-top: 85px;
    }
}


#section_bouton_logo img {
    width: 150px;
    height: 150px;
    margin-top: -20px;
}

@media all and (min-width: 500px) {
    #section_bouton_logo img {
        width: 260px;
        height: 260px;
    }
}

p {
    text-align: center;
    font-size: 30px;
}

#h_pseudo{
    text-decoration: underline;
}

footer{
    position: fixed;
    bottom: 0;
    right: 0;
}

footer img{
    height: 30px;
    width: auto;
    margin-right: 30px;
    margin-bottom: 20px;
}

@media all and (min-width: 800px){
    footer img{
        height: 45px;
    }
}
form {
    
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0px;
    
    border-radius: 5px;
}
#profile{
    padding: 20px;
    border: thick double #ffffff;
    border-radius: 20px;
}

form p {
    font-size: 18px;
    display: none;
    border-left: 5px solid #ff0033;
    margin: 0;
    margin-bottom: 10px;
    padding-left: 5px;
}

@media all and (min-width: 600px) {
    form p {
        font-size: 22px;
    }
}

form p:last-of-type{
    margin-top: 10px;
    margin-bottom: 0;
}



form input:not(:last-child) {
    display: none;
    border: none;
    margin-bottom: 30px;
    text-align: center;
    color: #FFFFFF;
    background: rgba(2, 47, 76, 0.6);
    font-size: 25px;
    border-radius: 70px;
    border: none;
    width: 250px;
}

@media all and (min-width: 600px) {
    form input:not(:last-child) {
        font-size: 30px;
        width: 550px;
    }
}

@media all and (min-width: 700px) {
    form input:not(:last-child) {
        font-size: 30px;
        width: 750px;
    }
}

input::placeholder {
    color: white;
    font-family: 'Rowdies';
    opacity: 0.5;

}

input:focus {
    color: white;
    font-family: 'Rowdies';
}

form>button {
    background: #01304D;
    font-size: 25px;
    opacity: 1;
    border-radius: 70px;
    border: none;
    text-align: center;
    color: #FFFFFF;
    width: 250px;
    transition: all 0.3s ease-in-out;
    display: none;
}
form > button:hover {
  transform: scale(1.05);
  cursor: pointer;
}

@media all and (min-width: 600px) {
    form>button {
        font-size: 30px;
        width: 550px;
    }
}

@media all and (min-width: 700px) {
    form>button {
        width: 750px;
    }
}

#avatar{
  display: block; 
  width: 150px; 
  height: 150px; 
  border-radius: 50%; 
  object-fit: cover; 
  margin: 0 auto;
}
#deux_bouttons{
    display: flex;
    justify-content: center;
    align-items: center;
}
#deux_bouttons button {
  padding: 10px;
  border: none;
  border-radius: 70px;
  font-size: 18px;
  cursor: pointer;
  background-color: #01304D;
  color: #fff;
  margin-left: 30px;
  text-align: center;
  margin-bottom: 20px;
}

#deux_bouttons button:hover {
  background-color: #0069d9;
}

#deux_bouttons button:focus {
  outline: none;
}


</style>
