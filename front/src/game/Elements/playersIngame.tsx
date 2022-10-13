
type propsType = {
    username: string
    image: string
    className: string
    
}

export default function PlayersIngame(props: propsType)
{
    return (
            <div className={`lobby--elem + ${props.className}`}>
                <h1 className="text-[40px]"> {props.username}    </h1>
                <img className="score--img" src={props.image} alt="user-profile-pic" />
            </div>

    )
}