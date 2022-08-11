//UTILS FUNCTION THAT GET CSS INFO ABOUT ELEMENTS AND CHANGE THEM

export function getBallX() {
    return parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--x'));
}

export function getBallY() {
    return parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--y'));
}

export function getContactZone()
{
    //SEE 
    return document.getElementById("ball")!.getBoundingClientRect()
}

export function getPaddleContactZone()
{
    return document.getElementById("playerPaddle")!.getBoundingClientRect()
}

export function getComputerContactZone()
{
    return document.getElementById("computerPaddle")!.getBoundingClientRect()
}

export function setBallX (value:string) {
    document.documentElement.style.setProperty("--x", value)
}

export function setBallY (value:string) {
    document.documentElement.style.setProperty("--y", value)
}
