"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CalendarDays, Plane, ArrowLeftRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

async function fetchBookings() {
  const res = await axios.get("/api/bookings/me");

  return res.data;
}

export default function MyBookings() {
  const { data: session } = useSession();
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [pressedCards, setPressedCards] = useState({}); // Trạng thái nhấn riêng cho từng card

  // React Query hook for fetching bookings
  const {
    data: bookings = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myBookings"],
    queryFn: fetchBookings,
    retry: 1,
  });

  // Redirect to login if not authenticated
  if (!session) {
    router.push(`/login?callbackUrl=/my-bookings`);

    return null;
  }

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;

    return booking.status.toLowerCase() === filter;
  });

  const handleMouseDown = (id) => {
    setPressedCards((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseUp = (id) => {
    setPressedCards((prev) => ({ ...prev, [id]: false }));
  };

  if (isLoading) return <p>Đang tải lịch sử đặt vé...</p>;
  if (isError) return <p>Đã xảy ra lỗi khi tải lịch sử đặt vé.</p>;

  return (
    <div className="max-w container mx-auto h-[800px] overflow-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Lịch sử đặt vé</CardTitle>
          <CardDescription>
            Xem và quản lý các chuyến bay đã đặt và sắp tới của bạn
          </CardDescription>
          <div className="mt-4">
            <Select onValueChange={(value) => setFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="upcoming">Sắp tới</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="h-[600px] overflow-y-scroll">
          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <p>Không tìm thấy lịch sử đặt vé với bộ lọc này.</p>
            ) : (
              filteredBookings.map((booking) => (
                <Card
                  key={booking.id}
                  className={`cursor-pointer transition-all duration-200 ease-in-out hover:bg-slate-100 ${
                    pressedCards[booking.id] ? "scale-95" : "hover:scale-1025"
                  }`}
                  onClick={() => router.push(`my-bookings/${booking.id}`)}
                  onMouseDown={() => handleMouseDown(booking.id)}
                  onMouseUp={() => handleMouseUp(booking.id)}
                  onMouseLeave={() => handleMouseUp(booking.id)}
                >
                  <CardContent className="flex items-center p-4">
                    {/* Phần bên trái */}
                    <div className="flex w-1/3 items-center">
                      <Plane className="mr-2 size-5 text-primary" />
                      <div>
                        <div className="mb-1 flex items-center">
                          <h3 className="font-semibold">
                            {booking.destination}
                          </h3>
                          {booking.isRoundTrip && (
                            <ArrowLeftRight className="ml-2 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Chuyến bay{" "}
                          {booking.tickets
                            .map((ticket) => ticket.flightNumber)
                            .join(", ")}
                        </p>
                      </div>
                    </div>

                    {/* Phần giữa */}
                    <div className="flex w-1/3 items-center justify-center">
                      <CalendarDays className="mr-1 size-4 text-muted-foreground" />
                      <span className="whitespace-nowrap text-sm">
                        {new Date(booking.createdAt).toLocaleDateString(
                          "vi-VN",
                        )}
                      </span>
                    </div>

                    {/* Phần bên phải */}
                    <div className="ml-auto flex items-center">
                      <Badge
                        variant={
                          booking.status === "Completed"
                            ? "default"
                            : booking.status === "Upcoming"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {booking.status === "Completed"
                          ? "Hoàn thành"
                          : booking.status === "Upcoming"
                            ? "Sắp tới"
                            : "Đã hủy"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
