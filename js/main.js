
//Variaveis Globais
let myCards = [];
let score = 0; sizeToScore = 0;
let check = false;


/**
 * Esta funcao (createCards) cria um array de objetos (do tamanho passado pelo parametro) 
 * que contem o caminho da imagem (path)
 * 
 * O loop percorre de 2 em 2 posiçoes para duplicar a mesma imagem dentro do array
 * 
 * Ao final é retornado o array com os path randomizados
 */
let createCards = (size) => {
  sizeToScore = size;
  let arr = [];
  let j = 0;

  for(let i = 0; i<size; i += 2) {
    arr[i] = {
      path: `../img/pic00${j+1}.jpeg`
    };
    arr[i+1] = {path: arr[i].path};
    j++;
  }

  //shuffle cards
  return arr.sort(() => Math.random() - 0.5);  
};


/**
 * Esta funcao (createBoard) preenche a div board com divs filhas com o numero de elementos passado pelo select, cada div filha recebe um ID!
 */
let createBoard = () => {
  
  let size = document.getElementById('slct').value;
  let el = document.getElementById('board');
  
  //Limpa a div Board
  el.innerHTML = '';
  
  size = parseInt(size);
  
  //o vetor myCards (global) recebe o retorno da funcao createCards
  myCards = createCards(size);
  
  //Adiciona um novo atributo (value) em cada elemento, mais adiante esse atributo servirá para comparar com o id da card.
  myCards.forEach((element, index) => {
    element.value = `c${index}`;
  });
  
  //Preenche a div Board com divs vazias.
  for(let i=0; i<size; i++){
    el.innerHTML += `<div  class="card blockUnblock" id="c${i}">  </div>`
  }
};


/**
 * EventListner é a funcao responsavel pela disparada da ação do jogo da memoria
 * ela obtem o valor da ID da div e chama a funcao resposnavel por checar se a proxima div tem o mesmo    background da anterior clicada.
 */
document.getElementById('board').addEventListener('click', (e) => {
    if(e.target.id != 'board'){
      checkCard(e.target.id);
    } 
});


/**
 * 
 * Essa funcao recebe o id da div clicada
 * Caso a variavel global 'check' for false, entao altera o fundo da div para o path correspondente no array myCards. E entao muda o valor de 'check' para true;
 * 
 * Caso seja TRUE, verifica se a imagem no arry myCards correspondente ao valor da id, tem a mesma id da div.
 * caso sim muda o fundo, a variavel global score recebe +1 e bloqueia o clique nessas duas divs que são iguais.
 * 
 * caso contrario, a div revela o fundo e depois de 1 segundo as duas voltam a ficar sem a imagem do background.
 *  
 */
let checkCard = (id) => {
 
  if(!check) {
    myCards.forEach((element, index) => {
      if(element.value == id) {
        document.getElementById(id).style.backgroundImage = `url(${element.path})`; 
        //desabilita o clique até que a outra carta seja checada.
        document.getElementById(id).style.pointerEvents = 'none';
        path = {'url': element.path, 'prevID': id} ;
      }
    });
    
    //'check' turns 'true' to skip to next click. 
    check = true; 
  
  } else {
    
    
    myCards.forEach((element, index) => {
      
      //Muda o fundo da div e verifica se o valor do path é o mesmo da div anterior;
      if(element.value == id) {
        document.getElementById(id).style.backgroundImage = `url(${element.path})`; 
        if(element.path == path.url) {

        
          //score recebe +1
          score += 1;

          // Bloqueia o click nas divs reveladas com imagem iguais
          document.getElementById(id).style.pointerEvents = 'none';
          document.getElementById(path.prevID).style.pointerEvents = 'none';
          
          // Altera o ID para null
          document.getElementById(id).id = 'null';
          document.getElementById(path.prevID).id = 'null';

          
          
          //Score conta ate que todas as imagens sejam mostradas, e emite a msg de parabéns;
          console.log(`Score: ${score}, Size: ${sizeToScore}`);
          if(score == (sizeToScore / 2)) {
            //document.getElementById(id).style.backgroundImage = `url(${element.path})`; 
            
            setTimeout(() => {
              alert('Parabéns Você terminou');
            }, 1000);
          }      
          
          check = false;

        } else {

          check = false;
          
          //Essa funcao bloqueia o clique durante a comparação das cartas...
          blockClickCards();
          
          setTimeout(() => {
            document.getElementById(path.prevID).style.backgroundImage = '';
            document.getElementById(id).style.backgroundImage = '';

            // Desbloqueia o click depois de mostrar que as cartas nao são iguais.
            unblockCards();
          
          }, 1000);
        }
      }
    });
  }

} 


let blockClickCards = () => {
  for(let i=0; i<myCards.length; i++){
    document.getElementsByClassName('blockUnblock')[i].style.pointerEvents = "none"; 
  }
}

let unblockCards = () => {
  for(let i=0; i<myCards.length; i++){
    document.getElementsByClassName('blockUnblock')[i].style.pointerEvents = "auto";
  }
}

