import React from "react"

export default function useAnimationFrame(uptdateGame:any) 
{
    //CUSTOM HOOKS THAT REFRESH THE GAME AT EACH FRAME
    //ARG : THE FUNCTION TO RUN AT EACH FRAME
    //SEE REACT HOOKS AND CUSTOM HOOKS
    //https://css-tricks.com/using-requestanimationframe-with-react-hooks/
    
    const timeRef:React.MutableRefObject<number|undefined> = React.useRef()
	const previousTimeRef:React.MutableRefObject<number|undefined> = React.useRef()
    
    function animation(time:number)
    {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        uptdateGame(deltaTime)
      }
      previousTimeRef.current = time;
      timeRef.current = requestAnimationFrame(animation);
    }
    
    React.useEffect(() => {
        timeRef.current = requestAnimationFrame(animation);
      return () => cancelAnimationFrame(timeRef.current!);
    })
  }
  