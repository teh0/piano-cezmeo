# Piano-CEZMEO
Le piano CEZMEO est un projet qui rassemble **IOT** (objets connectés), **UX Design** et **programmation**. Nous devions concevoir un **outil adapté à une personne autiste** pour lui permettre de faire de la musique. Nous sommes partis du constat que les personnes autistes ont souvent des difficultés à s'intégrer socialement. Ils sont malheureusement exclus des activités de groupes. Nous avons donc portés notre intention sur ce point. Nous voulions mettre en place un instrument avec lequel l'enfant autiste pourrait jouer de manière simple en compagnie d'autres personnes (avec ses parents, ses frères et soeurs ou ses amis).

# Fonctionnement du projet
- **Composition du piano**

  Pour réaliser ce piano connecté, nous avons construit un piano physique avec [une Raspberry Pi 3](https://www.raspberrypi-france.fr/). Ce dernier comporte **8 leds** associées aux **8 touches d'un piano** ( nous avons fais exprès de limiter le nombre de touche pour augmenter la facilité d'utilisation). Nous y avons également ajouté **un serveur NodeJS** qui va permettre de manipuler les ports de la Raspberry en Javascript et ainsi executer des actions sur la Raspberry (allumer les LED, jouer un son sur une sortie audio).
  
- **Utilisation du piano**

  Depuis un ordinateur, on peut se connecter sur le serveur de la Raspberry et on accède à un interface ressemblant à un piano. L'enfant peut alors jouer de la musique en cliquant sur les boutons avec la souris. Il peut aussi directement appuyer sur les touches de claviers associés aux notes. 
Au clique d'un bouton, la led associée à la note de musique s'allume sur la Raspberry et on peut entendre la note jouée. 

- **Configuration des touches de l'ordinateur**

  Nous avons paramétré les touches de clavier de la manière suivante : 
  
  | Touche de clavier        | a  | z  | e  | r  | t   | y  | u  | i  |
  |--------------------------|----|----|----|----|-----|----|----|----|
  | Note de musique associée | Do | Ré | Mi | Fa | Sol | La | Si | Do |


# Explication technique du projet
Techniquement il y a deux parties bien distinctes dans ce projet : **le serveur NodeJS** et **l'ordinateur distant** sur lequel apparait un piano virtuel (intégré en HTML & SASS).

- **La communication Client Serveur**

  L'une des problématiques de ce projet est de pouvoir **garantir une expérience utilisateur agréable et fluide**. Autrement dit, il faut donc limiter au maximum le délai entre le moment ou l'utilisateur appuie sur la touche de son clavier d'ordinateur et le moment où le son est joué sur la Raspberry. Pour se faire, nous avons utilisé une **communication en Websocket**.
  
- **Mise en place de la communication WebSocket** 

Pour établir une connexion Websocket entre un client et un serveur, nous utilisons la libraire [socketio](https://socket.io/) 
  
  - Côté client
  
    Il faut ajouté cette dépendance côté client :
    ```js
    var socket = io.connect('192.168.1.17:4000')
    ```
    Ici, l'adresse de connexion ```192.168.1.17:4000``` doit correspondre à l'addresse IP de votre serveur Node. Il faut donc bien s'assurer que votre **Raspberry Pi** et **votre ordinateur** soit connecté sur le même réseau.
  - Côté serveur
  
    On peut directement télécharger le module socket.io avec npm : 
    ```js
    npm i socket.io
    ```
    Ensuite, l'importer comme ceci : 
    ```js
    var socket = require('socket.io');
    ```
    La communication Websocket est prête à être utilisée.
    
    Lorsque l'utilisateur joue une note de musique, il y a **deux messages Websocket envoyés eu serveur**.</br>
    Le premier correspond au moment ou la touche ```diff + est préssée``` et le deuxième correspond au moment ou l'utilisateur enlève son doigt de la touche. En effet, il faut faire savoir au serveur quand est ce qu'il faut commencer à jouer un son est quand est ce qu'il faut l'arrêter.
    
    ```
    
    ```
    
- **Construction de notre serveur NodeJS**

 Pour piloter une Raspberry avec du Javascript, il faut télécharger des modules précis :
 - [express](http://expressjs.com/) sert à configurer l'architecture de notre serveur.
 - [rpi-gpio](https://www.npmjs.com/package/rpi-gpio) permet de manipuler les ports de la Raspberry (allumer et éteindre les LED).
 - [node-aplay](https://www.npmjs.com/package/node-aplay) permet de donner l'ordre à la Raspberry de jouer un son.
 
 

# Pour aller plus loin dans le projet
  
