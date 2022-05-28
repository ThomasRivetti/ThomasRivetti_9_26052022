/*TODO*/  
❌ problème  
✅ Ok  
🔲 ToDo  

# Test1 
## Description
Le test Bills / les notes de frais s'affichent par ordre décroissant est passé au rouge.  
✅ Faire passer le test au vert en réparant la fonctionnalité.

# Test2
## Description
Dans le rapport de test "Login, si un administrateur remplit correctement les champs du Login, il devrait naviguer sur la page Dashboard", le test est passé au rouge.  
✅ Faire passer le test au vert en réparant la fonctionnalité.

# Test3
## Description
Je suis connecté en tant qu'employé, je saisis une note de frais avec un justificatif qui a une extension différente de jpg, jpeg ou png, j'envoie. J'arrive sur la page Bills, je clique sur l'icône "voir" pour consulter le justificatif : la modale s'ouvre, mais il n'y a pas d'image.  
Si je me connecte à présent en tant qu'Admin, et que je clique sur le ticket correspondant, le nom du fichier affiché est null. De même, lorsque je clique sur l'icône "voir" pour consulter le justificatif : la modale s'ouvre, mais il n'y a pas d'image.

Comportements attendus :  
✅ la modale doit afficher l'image.  
✅ dans le dashboard, le formulaire correspondant au ticket doit afficher le nom du fichier.

Suggestion : empêcher la saisie d'un document qui a une extension différente de jpg, jpeg ou png au niveau du formulaire du fichier NewBill.js. Indice : cela se passe dans la méthode handleChangeFile...

# Test4
## Description
Je suis connecté en tant qu'administrateur RH, je déplie une liste de tickets (par exemple : statut "validé"), je sélectionne un ticket, puis je déplie une seconde liste (par exemple : statut "refusé"), je ne peux plus sélectionner un ticket de la première liste. 

✅ Comportement attendu : pourvoir déplier plusieurs listes, et consulter les tickets de chacune des deux listes.

Pas besoin d'ajouter de tests.

# Test Unitaires et d'Intégration
Le rapport de couverture de branche de Jest indique que le fichiers suivants ne sont pas couverts (cf. copie d'écran) :

## TEST  
✅ composant views/Bills : Le taux de couverture est à 100% néanmoins si tu regardes le premier test il manque la mention “expect”. Ajoute cette mention pour que le test vérifie bien ce que l’on attend de lui.  

## TEST  
✅ composant  views/NewBill (réalisé par Garance)  

## TEST  
🔲 composant container/Bills :  
    ✅ couvrir les tests U Bills : clic sur l'icone Oeil 
    ✅ couvrir les tests U Bills : clic sur nouvelle note de frais 

    🔲 couvrir un maximum de  "statements" c'est simple, il faut qu’après avoir ajouté tes tests unitaires et d’intégration (le rapport de couverture du fichier container/Bills( http://127.0.0.1:8080/coverage/lcov-report/containers/Bills.js.html )) soit vert. Cela devrait permettre d'obtenir un taux de couverture aux alentours de 80% dans la colonne "statements".  
    🔲 ajouter un test d'intégration GET Bills. Tu peux t'inspirer de celui qui est fait (signalé en commentaires) pour Dashboard.

## TEST     
🔲 composant container/NewBill :  
    🔲 couvrir un maximum de "statements" : c'est simple, il faut que le rapport de couverture du fichier container/NewBill soit vert (accessible à cette adresse( http://127.0.0.1:8080/coverage/lcov-report/containers/NewBill.js.html ) quand tu auras lancé le serveur). Cela devrait permettre d'obtenir un taux de couverture aux alentours de 80% dans la colonne "statements".    
    🔲 ajouter un test d'intégration POST new bill.  
    ✅ composant views/VerticalLayout (réalisé par Garance) 

Respecter la structure des tests unitaires en place : Given  / When / Then avec le résultat attendu. Un exemple est donné dans le squelette du test __tests__/Bills.js  

# Parcours Employé

🔲 Rédiger un plan de test E2E pour le parcours *employé*. Ce plan doit comprendre l'ensemble des scenarios possibles et doit respecter le format habituel.
( https://course.oc-static.com/projects/DA+JSR_P9/Billed+-+Description+pratique+des+besoins+-.pdf )