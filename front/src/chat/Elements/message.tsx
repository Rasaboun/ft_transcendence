import React from "react";

type MessagePropsT = {
    className: string,
    message: string,
    senderId: number
}

export default function Message(props:MessagePropsT)
{
        const backgroundColor = props.senderId % 2 === 0 ?
            "bg-gray-300" : "bg-sky-300"
        const alignSelf = props.senderId % 2 === 0 ?
            "items-end" : "items-start"
    const classT = `${backgroundColor} ${alignSelf} ${props.className} `
    console.log(classT)
    return(
        <div className={`${classT}`}>
            {props.message}
        </div>
    )
}