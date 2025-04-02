import { useEffect, useState } from 'react';
import './Board.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectMatch, selectRound, setUserActions } from '../../store/modules/main';
import { deepCopy } from '../../utils';



export function Board(props: { board: any, isUserPanel: boolean, boardIndex: number, isPanelActive: boolean }) {

  const round = useSelector(selectRound);
  const match = useSelector(selectMatch);

  const dispatch = useDispatch();
  const [localBoards, setLocalBoards] = useState(deepCopy(props?.board?.blocks));
  const [options, setOptions] = useState({
    allowRob: false,
    allowExplode: false,
    allowSelected: false,
  })

  useEffect(() => {
    if((round - 1) === props.boardIndex && props.isPanelActive){
      if(!props.isUserPanel){
        //it means that we can allow rob and explode
        setOptions({
          allowRob: true,
          allowExplode: true,
          allowSelected: false,
        })
      } else {
        //it means that we can select
        setOptions({
          allowRob: false,
          allowExplode: false,
          allowSelected: true,
        })
      }
    }
  }, [props.isUserPanel, props.boardIndex, round, match]);

  useEffect(() => {
    setLocalBoards(deepCopy(props?.board?.blocks));
  }, [match]);

  useEffect(() => {
    dispatch(setUserActions(localBoards));
  }, [localBoards]);

  const isAvailableForSelecting = () => {
    //user should be able to select only if the round is equal to the board index and the panel is active
    return props.boardIndex === (round - 1) && props.isPanelActive;
  }

  const onBlockClick = (index: number) => {

    if(options.allowRob && options.allowExplode){
      //check all localboard items and look for action = 'rob'
      const robActionIndex = localBoards.findIndex((item: any) => item.action === 'rob');
      const explodeActionIndex = localBoards.findIndex((item: any) => item.action === 'explode');

      if(robActionIndex  === -1){
        //set rob action
        const newLocalBoards = deepCopy(localBoards);
        newLocalBoards[index].action = 'rob';
        setLocalBoards(newLocalBoards);
        setUserActions(newLocalBoards);
        return;
      }

      if(explodeActionIndex === -1){
        //set explode action
        const newLocalBoards = deepCopy(localBoards);
        newLocalBoards[index].action = 'explode';
        setLocalBoards(newLocalBoards);
        setUserActions(newLocalBoards);
        return;
      }
      
      //look for rob action and explode action and then set action to empty
      const newLocalBoards = deepCopy(localBoards);
      
      newLocalBoards[robActionIndex].action = '';
      newLocalBoards[explodeActionIndex].action = '';
      setLocalBoards(newLocalBoards);
      setUserActions(newLocalBoards);
      

    } else if(options.allowSelected){

      const newLocalBoards = deepCopy(localBoards);
      
      if(newLocalBoards[index].action === 'explode') return;

      const selectedActionIndex = localBoards.findIndex((item: any) => item.action === 'selected');

      if(selectedActionIndex === -1){
        newLocalBoards[index].action = 'selected';
        setLocalBoards(newLocalBoards);
      }else {
        newLocalBoards[selectedActionIndex].action = '';
        newLocalBoards[index].action = 'selected';
        setLocalBoards(newLocalBoards);
      }
    }


  }


  return (
    <div className='flex flex-wrap w-[310px] h-[310px] gap-1'>
        {localBoards && localBoards?.length && localBoards?.map((item: any, index: number) => (
            <div onClick={() => isAvailableForSelecting() && onBlockClick(index)} key={index} style={{ backgroundColor:  item.action ? '#C4BBF0' : '#927FBF'}} className={` cursor-pointer h-[100px] w-[100px] rounded-lg text-white text-center flex flex-col justify-center items-center`}>
              {
                item.value || item.action? 
                <>
                  <div>{item.value}</div> 
                  <div>{ item.action }</div>
                </> : 
                <>
                  <div className='my-class'>
                    {/* <i className="fa-solid fa-infinity"></i> */}
                    <i className="fa-solid fa-question"></i>
                  </div>
                </>
              }
              
              
            </div>
        ))}
    </div>
  )
}
