# Piano-CEZMEO
Le piano CEZMEO est un projet qui rassemble **IOT** (objets connectés), **UX Design** et **programmation**. Nous devions concevoir un **outil adapté à une personne autiste** pour lui permettre de faire de la musique. Nous sommes partis du constat que les personnes autistes ont souvent des difficultés à s'intégrer socialement. Ils sont malheureusement exclus des activités de groupes. Nous avons donc portés notre intention sur ce point. Nous voulions mettre en place un instrument avec lequel l'enfant autiste pourrait jouer de manière simple en compagnie d'autres personnes (avec ses parents, ses frères et soeurs ou ses amis).

# Fonctionnement du projet
- **Composition du piano**

  Pour réaliser ce piano connecté, nous avons construit un piano physique avec [une Raspberry Pi 3](https://www.raspberrypi-france.fr/). Ce dernier comporte **8 leds** associées aux **8 touches d'un piano** ( nous avons fais exprès de limiter le nombre de touche pour augmenter la facilité d'utilisation). Nous y avons également ajouté **un serveur NodeJS** qui va permettre de manipuler les ports de la Raspberry en Javascript et ainsi executer des actions sur la Raspberry (allumer les LED, jouer un son sur une sortie audio).
  
- **Utilisation du piano**

  Depuis un ordinateur, on peut se connecter sur le serveur de la Raspberry et on accède à un interface ressemblant à un piano. L'enfant peut alors jouer de la musique en cliquant sur les boutons avec la souris. Il peut aussi directement appuyer sur les touches de claviers associés aux notes. Il peut voir alors s'allumer sur le piano Raspberry la led associée à la note de musique jouée depuis son ordinateur ! La note de musique est également jouée.

- **Configuration des touches de l'ordinateur**

  Nous avons paramétré les touches de clavier de la manière suivante : 
  
  | Touche de clavier        | a  | z  | e  | r  | t   | y  | u  | i  |
  |--------------------------|----|----|----|----|-----|----|----|----|
  | Note de musique associée | Do | Ré | Mi | Fa | Sol | La | Si | Do |


# Explication technique du projet
Techniquement il y a deux parties bien distinctes dans ce projet : **le serveur NodeJS** et **l'ordinateur distant** sur lequel apparait un piano virtuel (intégré en HTML & SASS).

- **La communication Client Serveur**
  L'une des problématiques de ce projet est de pouvoir garantir une expérience utilisateur agréable et fluide. Autrement dit, il faut donc limiter au maximum le délai entre le moment ou l'utilisateur appuie sur la touche de son clavier d'ordinateur et le son joué sur la Raspberry. Pour se faire, nous avons utilisé une communication en Websocket.
  
  - Mise en place de la communication WebSocket
  
