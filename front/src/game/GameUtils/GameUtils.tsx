//UTILS FUNCTION THAT GET CSS INFO ABOUT ELEMENTS AND CHANGE THEM

export function getCanvasDiv()
{
    return document.getElementById("canvasDiv")!.getBoundingClientRect()
}

//toScale(largeurDuPaddle, largeurFenetre / largeurDuJeu)
export function toScale(value: number, scale: number) {
    return value * scale;
}