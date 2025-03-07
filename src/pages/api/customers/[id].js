import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  // Xử lý khi phương thức là GET (Lấy thông tin customer theo ID)
  if (req.method === "GET") {
    try {
      const customer = await prisma.customer.findUnique({
        where: {
          id: parseInt(id), // Chuyển đổi id thành số nguyên
        },
      });

      if (!customer) {
        return res.status(404).json({
          message: "Customer not found",
        });
      }

      return res.status(200).json(customer);
    } catch (error) {
      console.error("Error fetching customer:", error);

      return res.status(500).json({
        message: "Error fetching customer",
        error: error.message,
      });
    }
  }

  // Xử lý khi phương thức là DELETE (Xóa customer theo ID)
  else if (req.method === "DELETE") {
    try {
      const deletedCustomer = await prisma.customer.delete({
        where: {
          id: parseInt(id), // Chuyển đổi id thành số nguyên
        },
      });

      return res.status(200).json({
        message: "Customer deleted successfully",
        customer: deletedCustomer,
      });
    } catch (error) {
      console.error("Error deleting customer:", error);

      return res.status(500).json({
        message: "Error deleting customer",
        error: error.message,
      });
    }
  }

  // Xử lý khi phương thức là PUT (Cập nhật thông tin customer theo ID)
  else if (req.method === "PUT") {
    try {
      const {
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        gender,
        nationality,
        passportNumber,
        passportExpiry,
        passportIssuedAt,
      } = req.body;

      // Cập nhật customer dựa trên ID
      const updatedCustomer = await prisma.customer.update({
        where: {
          id: parseInt(id), // Chuyển đổi id thành số nguyên
        },
        data: {
          firstName,
          middleName,
          lastName,
          dateOfBirth: new Date(dateOfBirth),
          gender,
          nationality,
          passportNumber,
          passportExpiry: new Date(passportExpiry),
          passportIssuedAt,
        },
      });

      return res.status(200).json({
        message: "Customer updated successfully",
        customer: updatedCustomer,
      });
    } catch (error) {
      console.error("Error updating customer:", error);

      return res.status(500).json({
        message: "Error updating customer",
        error: error.message,
      });
    }
  }

  // Trả về lỗi nếu không phải là GET, DELETE, hoặc PUT
  else {
    return res.status(405).json({
      message: "Method Not Allowed",
    });
  }
}
