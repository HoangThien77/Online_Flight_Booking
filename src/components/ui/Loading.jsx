import { ClipLoader } from "react-spinners";

const LoadingSpinner = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <ClipLoader color="#f97316" size={50} />
    </div>
  );
};

export default LoadingSpinner;
