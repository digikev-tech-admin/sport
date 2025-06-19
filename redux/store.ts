import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./features/adminAuthSlice";
import userReducer from "./features/userSlice";
import planReducer from "./features/planSlice";
import couponReducer from "./features/couponSlice";

export const store = () => {
  return configureStore({
    reducer: {
      auth: adminAuthReducer,
      user: userReducer,
      plan: planReducer,
      coupon: couponReducer,
    },
  })
}

export type AppStore = ReturnType<typeof store>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']