
type propsType = {
    username: string
    image: string
    className: string
    
}

export default function PlayersIngame(props: propsType)
{
    return (
            <div className={`lobby--elem + ${props.className}`}>
                <h1 className="text-[20px]"> {props.username}    </h1>
                {/* <img className="score--img" src={"https://i.imgur.com/uhiPulC.jpg"} alt="user-profile-pic" /> */}
            </div>

    )
}