import { useDispatch, useSelector } from "react-redux";

// Nếu dùng TypeScript, có thể export type AppDispatch = typeof store.dispatch;
// Ở đây là JS nên chỉ export hook

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
