import { useSelector } from "react-redux";
import { selectUsers } from "../../store/modules/main";

export function Header() {

    const users = useSelector(selectUsers);

    return (
        <header className="w-full bg-[#4F3B78] h-16 text-white flex justify-center items-center">
            <div className=" max-w-[946px] w-full flex justify-between items-center">
                <div>
                    { users && users.length && 
                        <>
                            <div>{ users[0].name }</div>
                            <div>{ users[0].score } pts</div>
                        </> 
                    }
                    
                </div>
                <div>
                    <div>VS.</div>
                </div>
                <div>
                    { users && users.length && 
                        <>
                            <div>{ users[1].name }</div>
                            <div>{ users[1].score } pts</div>
                        </> 
                    }
                </div>
            </div>
        </header>
    );
}