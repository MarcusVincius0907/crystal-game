import { useDispatch, useSelector } from "react-redux";
import SessionStorageService, { StorageKeys } from "../../services/sessionStorageService";
import { Overlay } from "../Overlay/Overlay"
import { selectMatch, setWinner } from "../../store/modules/main";
import { useEffect, useState } from "react";
import './Winner.css';
import { useNavigate } from "react-router-dom";

const sessionStorageService = new SessionStorageService

export const Winner = () => {

    
    const match = useSelector(selectMatch)
    const [isTheWinner, setIsTheWinner] = useState(false);
    const [user, setUser] = useState<{name: string, score: string} | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const ownerId = sessionStorageService.getItem(StorageKeys.OWNER_ID);
        const tempUser = match?.users.find((user: any) => user.id === ownerId);
        const opponent = match?.users.find((user: any) => user.id !== ownerId);
        if(!tempUser) return;
        setUser(tempUser);
        setIsTheWinner(tempUser.score > opponent.score);

        setTimeout(() => {
            resetGame();
        }, 10000);

    }, [match]);

    const resetGame = () => {
        sessionStorageService.removeItem(StorageKeys.MATCH_ID);
        sessionStorageService.removeItem(StorageKeys.OWNER_ID);
        dispatch(setWinner(false))
        navigate('/');
    }


    return (
        <>
            <Overlay>
                <div className="bg-[#4F3B78] w-full max-w-[900px] rounded p-10 custom-shadow">
                {
                    isTheWinner ? 
                        <>
                            <div className="text-white text-3xl text-center">
                                Congratulations {user?.name}! You are the winner with {user?.score} points!
                            </div>    
                        </> 
                    : 
                    
                        <>
                            <div className="text-white text-3xl text-center">
                                That was a tough one! But don’t give up {user?.name}, you did {user?.score} points!
                            </div>
                        </>
                    
                }

                    <div onClick={resetGame} className=" px-10 py-5 mt-10 bg-[#927FBF] rounded-lg cursor-pointer hover:opacity-50 text-white text-center w-[200px] m-auto">
                        Play Again
                    </div>
                </div>
            </Overlay>
        </>
    )
}