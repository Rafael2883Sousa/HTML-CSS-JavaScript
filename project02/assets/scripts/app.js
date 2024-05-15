const VALOR_ATAQUE = 10;
const STRONG_ATACK = 30;
const HEAL = 30;
let maxVida = 100;
let valorActualVidaM = maxVida;
let valorActualVidaP = maxVida;

const atack = () => {

    // determinar um valor par diminuir a vida do monstro
    const perda = dealMonsterDamage(VALOR_ATAQUE);
    valorActualVidaM -= perda;

    const perdaPlayer = dealPlayerDamage (VALOR_ATAQUE);
    valorActualVidaP -= perda; 

    allert();
}

const strong_atack = () => {

    // determinar um valor par diminuir a vida do monstro
    const perda = dealMonsterDamage(STRONG_ATACK);
    valorActualVidaM -= perda;

    const perdaPlayer = dealPlayerDamage (STRONG_ATACK);
    valorActualVidaP -= perdaPlayer; 

    allert();
}

const heal = () => {
    // funcao que cura o jogador

    const cura = increasePlayerHealth(HEAL);
    valorActualVidaP += cura;

    allert();
}

const allert = () => {
    // mostra se perdeu, venceu ou empataram;

    if(valorActualVidaM <= 0 && valorActualVidaP > 0){
        alert("Venceu");
    } else if(valorActualVidaM > 0 && valorActualVidaP <= 0){
        alert("Perdeu");
    } else if(valorActualVidaM <= 0 && valorActualVidaP <= 0){
        alert("Empate");
    }
}

// implementar o SHOW LOG 


attackBtn.addEventListener('click', atack);
strongAttackBtn.addEventListener('click', strong_atack);
healBtn.addEventListener('click', heal);