// components/ExportDialog.js
import { Download } from "lucide-react";
import { useState } from "react";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const ExportDialog = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const handleExport = async () => {
    try {
      let url = "";

      // Xác định URL dựa trên option được chọn
      switch (selectedOption) {
        case "monthly-revenue":
          url = `/api/admins/export/revenue?month=${month}&year=${year}`;
          break;
        case "today-flights":
          url = "/api/admins/export/today-flights";
          break;
        case "today-passengers":
          url = "/api/admins/export/today-passengers";
          break;
        default:
          throw new Error("Invalid export option");
      }

      // Gọi API và download file
      const response = await axios.get(url, {
        responseType: "blob",
      });

      // Tạo URL và download
      const downloadUrl = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.setAttribute(
        "download",
        response.headers["content-disposition"].split("filename=")[1],
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Export error:", error);
      alert("Có lỗi xảy ra khi export dữ liệu!");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="size-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="exportType">Chọn loại dữ liệu</Label>
            <Select value={selectedOption} onValueChange={setSelectedOption}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại dữ liệu cần export" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Export Options</SelectLabel>
                  <SelectItem value="monthly-revenue">
                    Doanh thu theo tháng
                  </SelectItem>
                  <SelectItem value="today-flights">
                    Chuyến bay trong ngày hôm nay
                  </SelectItem>
                  <SelectItem value="today-passengers">
                    Hành khách bay ngày hôm nay
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Hiển thị input tháng/năm khi chọn doanh thu theo tháng */}
          {selectedOption === "monthly-revenue" && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="month">Tháng</Label>
                  <Input
                    id="month"
                    type="number"
                    min="1"
                    max="12"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    placeholder="Nhập tháng"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="year">Năm</Label>
                  <Input
                    id="year"
                    type="number"
                    min="2000"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="Nhập năm"
                  />
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleExport}
            className="w-full"
            disabled={
              !selectedOption ||
              (selectedOption === "monthly-revenue" && (!month || !year))
            }
          >
            Export
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
