# Piano-CEZMEO
Le piano CEZMEO est un projet qui rassemble **IOT** (objets connectés), **UX Design** et **programmation**. Nous devions concevoir un **outil adapté à une personne autiste** pour lui permettre de faire de la musique. Nous sommes partis du constat que les personnes autistes ont souvent des difficultés à s'intégrer socialement. Ils sont malheureusement exclus des activités de groupes. Nous avons donc porté notre intention sur ce point. Nous voulions mettre en place un instrument de musique avec lequel l'enfant autiste pourrait jouer de manière **simple** en compagnie **d'autres personnes** (avec ses parents, ses frères et soeurs ou ses amis).

# Fonctionnement du projet
- **Composition du piano**

  Pour réaliser ce piano connecté, nous avons construit un piano physique avec [une Raspberry Pi 3](https://www.raspberrypi-france.fr/). Ce dernier comporte **8 LED** associées aux **8 touches d'un piano** ( nous avons fait exprès de limiter le nombre de touche pour augmenter la facilité d'utilisation). Nous y avons également installé **un serveur NodeJS** qui va permettre de manipuler les ports entrée / sortie de la Raspberry en Javascript et ainsi exécuter des actions sur la Raspberry (allumer les LED, jouer un son sur une sortie audio).
  
- **Utilisation du piano**

  Depuis un ordinateur, on peut se connecter sur le serveur de la Raspberry et on accède à une interface ressemblant à un piano. L'enfant peut alors jouer de la musique en cliquant sur les boutons avec la souris. Il peut aussi directement appuyer sur les touches de claviers associées aux notes. 
Au clique d'un bouton, la led associée à la note de musique s'allume sur la Raspberry et on peut entendre la note jouée. 

- **Configuration des touches de l'ordinateur**

  Nous avons paramétré les touches de clavier de la manière suivante : 
  
  | Touche de clavier        | a  | z  | e  | r  | t   | y  | u  | i  |
  |--------------------------|----|----|----|----|-----|----|----|----|
  | Note de musique associée | Do | Ré | Mi | Fa | Sol | La | Si | Do |


# Explication technique du projet
Techniquement il y a deux parties bien distinctes dans ce projet : **le serveur NodeJS** et **l'ordinateur distant** sur lequel apparaît un piano virtuel (intégré en HTML & SASS).

- **La communication Client Serveur**

  L'une des problématiques de ce projet est de pouvoir **garantir une expérience utilisateur agréable et fluide**. Autrement dit, il faut limiter au maximum le délai entre le moment ou l'utilisateur appuie sur la touche de son clavier d'ordinateur et le moment où le son est joué sur la Raspberry. Pour se faire, nous avons utilisé une **communication en Websocket**.
  
- **Mise en place de la communication WebSocket** 

  Pour établir une connexion Websocket entre un client et un serveur, nous utilisons la libraire [socket.io](https://socket.io/) 
  
    - **Côté client**
  
    Il faut ajouter cette dépendance côté client :
    ```js
    var socket = io.connect('192.168.1.17:4000')
    ```
    Ici, l'adresse de connexion ```192.168.1.17:4000``` doit correspondre à l'addresse IP de votre serveur Node. Il faut donc bien s'assurer que votre **Raspberry Pi** et **votre ordinateur** soit connecté sur le **même réseau**.
    
  - **Côté serveur**
  
    On peut directement télécharger le module socket.io avec npm : 
    ```js
    npm i socket.io
    ```
    Ensuite, on peut l'importer comme ceci : 
    ```js
    var socket = require('socket.io');
    ```
    La communication Websocket **est prête à être utilisée**.
    
    Lorsque l'utilisateur joue une note de musique, **deux messages Websocket sont envoyés au serveur**.</br>
    Le premier correspond au moment où la touche **est préssée** et le deuxième correspond au moment où l'utilisateur **enlève son doigt de la touche**. En effet, il faut faire savoir au serveur quand est ce qu'il faut **commencer à jouer** un son est quand est ce qu'il faut l'**arrêter**.
    
    Voici la forme du message WebSocket
    ```js
    socket.emit('note_action', {
        note: id,
        state: 'on',
    });
    ```
    L'**Id** correspond au nom de la note jouée et le **state** prend la valeur ```on``` si le bouton du piano est préssé ou ```off``` si le boutton est relaché.
    
    **Comment envoyer la bonne note de musique au serveur ?**
    
    Si l'utilisateur joue du piano avec les touches du clavier, il faut pouvoir détecter quelle touche est préssée et récupérer la note associée. Pour se faire, j'ai créé un objet Javascript qui associe à chaque note de musique le [Key code](https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes) de la touche du clavier.
    ```js
    let key_play = {
      "keyboard": [{
          "key": 65,"note": "do"}, //a
          {"key": 90,"note": "re"}, //z
          {"key": 69,"note": "mi"}, //e
          {"key": 82,"note": "fa"}, //r
          {"key": 84,"note": "sol"}, //t
          {"key": 89,"note": "la"}, //y
          {"key": 85,"note": "si"}, //u
          {"key": 73,"note": "do_oct"}, //i
        ]
    };
    ```
    
    Grâce à cet objet, on peut associer la note de musique avec la touche préssée en ajouter un écouteur d'évènement Javascript sur les touches de clavier
    ```js
	$(document).on("keyup", (e) => {
		if(canKey && list_keybind.includes(e.which) ){
			const items = Object.values(key_play.keyboard).filter(({
				key
			}) => key == e.which);
			let id = items[0].note;
			$(`#${items[0].note}`).click();
			 socket.emit('note_action', {
				note: id,
				state: 'off',
			 });
		}
	});
    ```
    
- **Construction du serveur NodeJS**

  Pour piloter une Raspberry avec du Javascript, il faut télécharger des modules précis :
  - [express](http://expressjs.com/) sert à configurer l'architecture de notre serveur.
  - [rpi-gpio](https://www.npmjs.com/package/rpi-gpio) permet de manipuler les ports de la Raspberry (allumer et éteindre les LED).
  - [node-aplay](https://www.npmjs.com/package/node-aplay) permet de donner l'ordre à la Raspberry de jouer un son.
 
  Avant de pouvoir commander la Raspberry, il faut **initialiser ses ports d'entrées sorties**. En l'occurence, nous allons paramétrer nos 8 ports en sortie car ils vont renvoyer un signal pour allumer les LED.
 ```js
 gpio.setup(18,gpio.DIR_OUT);
 gpio.setup(16,gpio.DIR_OUT);
 gpio.setup(12,gpio.DIR_OUT);
 gpio.setup(10,gpio.DIR_OUT);
 gpio.setup(31,gpio.DIR_OUT);
 gpio.setup(33,gpio.DIR_OUT);
 gpio.setup(35,gpio.DIR_OUT);
 gpio.setup(37,gpio.DIR_OUT);
 ```
 Puis, en fonction des messages envoyés par le client, le serveur Node exécute différentes actions sur la Raspberry.
 
 - Quelques exemples d'actions sur la Raspberry
 
 **Allumer une LED**
   ```js
   gpio.write(num_pin, true, function(err) {
       if (err) throw err
       
       });
   ```
 
  **Éteindre une LED**
   ```js
   gpio.write(num_pin, false, function(err) {
       if (err) throw err
   ``` 
       
  **Jouer un son**
   ```js
   let p_do = new Sound('./public/sound/Do.wav');
   p_do.play();
   ```
 
 # Pour aller plus loin dans le projet
A long terme, il serait intéressant de **dématerialiser ce projet** afin de pouvoir créer une application web. Nous pourrions par exemple extraire le serveur NodeJS de la Raspberry et la mettre directement sur un serveur en ligne. Ainsi, tous les utilisateurs connectés à ce serveur pourraient jouer de la musique en même temps et construire une partition ensemble.

Ca pourrait être une ouverture à l'apprentissage du piano à distance. On aurait par exemple un professeur à Paris qui donnerait des cours de musique à une personne habitant à Toulouse. Tout ça depuis chez eux !

D'un point de vue expérience utilisateur, nous pourrions **construire une manette en forme de piano** directement branchable par USB afin que les utilisateur puissent jouer sur le piano et non sur les touches de l'ordinateur.

Il y a tant de perspectives à envisager !
  
