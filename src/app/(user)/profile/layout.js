import { Toaster } from "@/components/ui/toaster";
const UserProfileLayout = ({ children }) => {
  return (
    <div className="h-[800px] pt-16">
      {" "}
      {/* Thêm khoảng trống phía trên */}
      {children}
      <Toaster />
    </div>
  );
};

export default UserProfileLayout;
