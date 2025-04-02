// store.js
import { configureStore } from "@reduxjs/toolkit";
import main from "./modules/main";

const store = configureStore({
  reducer: {
    main, // Add reducers here
  },
});

export default store;
