// Navbar của bạn
// Footer nếu có

const BookingDetailLayout = ({ children }) => {
  return (
    <div className="h-[800px] pt-16">
      {" "}
      {/* Thêm khoảng trống phía trên */}
      {children}
    </div>
  );
};

export default BookingDetailLayout;
