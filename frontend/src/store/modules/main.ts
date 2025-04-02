// counterSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http from "../../api/AxiosInstance";
import { findMatch as findMatchStructure } from "../../services/gameService";
import SessionStorageService, { StorageKeys } from "../../services/sessionStorageService";

const sessionService = new SessionStorageService();

export const findMatch = createAsyncThunk('main/findMatch', async (userName: string) => {
  try {
      const response = await findMatchStructure(userName);
      return response;
  } catch (error) {
      console.log(error)
  }
});

export const getMatchById = createAsyncThunk('main/getMatchById', async ({ matchId, ownerId }: { matchId: string; ownerId: string }) => {
  try {
      const response = await http.get(`/match/${matchId}/${ownerId}`);
      return response.data?.data;
  } catch (error) {
      console.log(error);
  }
});

const mainSlice = createSlice({
  name: "main",
  initialState: { match: null, matchId: '', ownerId: '', loader: false, opponentLoader: false, userActions: null, winner: false },
  reducers: {
    setUserActions: (state, action) => {
      state.userActions = action.payload;
    },
    setMatch: (state, action) => {
      state.match = action.payload;
    },
    setLoader: (state, action) => {
      state.loader = action.payload;
    },
    setWinner: (state, action) => {
      state.winner = action.payload;
    },
    setOpponentLoader: (state, action) => {
      state.opponentLoader = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(findMatch.fulfilled, (state, action) => {
        state.loader = false;
        if(action.payload) {
          state.matchId = action.payload;
          sessionService.setItem(StorageKeys.MATCH_ID, action.payload);
        }
      })
      .addCase(findMatch.pending, (state) => {
        state.loader = true;
      })

      .addCase(getMatchById.fulfilled, (state, action) => {
        if(action.payload) {
          state.match = action.payload;
          if(action.payload?.round === 4){
            state.winner = true;
          }
        }
      }
    )
      
      
  }, 
});


export const selectMatch = (state: any) => state.main.match;
export const selectMatchId = (state: any) => state.main.matchId;
export const selectLoader = (state: any) => state.main.loader;
export const selectUserActions = (state: any) => state.main?.userActions;
export const selectUsers = (state: any) => state.main?.match?.users || [];
export const selectRound = (state: any) => state.main?.match?.round || 0;
export const selectWinner = (state: any) => state.main?.winner;
export const selectOpponentLoader = (state: any) => state?.main?.opponentLoader;

export const { setUserActions, setMatch, setLoader, setWinner, setOpponentLoader } = mainSlice.actions;
export default mainSlice.reducer;
