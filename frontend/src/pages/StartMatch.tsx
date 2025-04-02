import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { findMatch, selectLoader, selectMatchId } from "../store/modules/main";
import { useNavigate } from "react-router-dom";

export function StartMatch(){
    const [userName, setUserName] = useState('');
    const matchId = useSelector(selectMatchId);
    const loading = useSelector(selectLoader);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onFindMatch = async () => {
        if(userName === '' || loading) return;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        dispatch(findMatch(userName));
    }

    useEffect(() => {
        if (matchId) {
            navigate('/home');
        }
    }, [matchId]);
   
    return (
        <div className="h-full w-full bg-[#C4BBF0] flex justify-center items-center">
            <div className="bg-[#4F3B78] text-white p-10 rounded-lg max-w-[500px] w-full ">
                <h1 className="text-3xl text-center">
                    Start Match
                </h1>
                <div className="flex justify-center items-center mt-5">
                    <input onChange={(e) => setUserName(e.target.value)} className="px-5 py-2 bg-[#C4BBF0] border rounded outline-none text-[#4F3B78]" type="text"  placeholder="Your Name"/>
                </div>
                <div className="flex justify-center items-center mt-5">
                    <div onClick={() => onFindMatch()} className="bg-[#927FBF] py-2 px-5 text-center rounded cursor-pointer hover:opacity-50">
                        { loading ? <div className="loader"></div> : 'Find Match' }
                    </div>
                </div>
            </div>
        </div>
    )
}
