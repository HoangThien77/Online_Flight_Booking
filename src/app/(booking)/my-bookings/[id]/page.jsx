"use client";

import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import BookingDetails from "../components/BookingDetails";

async function fetchBooking(id) {
  const response = await axios.get(`/api/bookings/${id}`);

  return response.data;
}

export default function BookingDetail() {
  const router = useRouter();
  const { id } = useParams();

  const {
    data: booking,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => fetchBooking(id),
    enabled: !!id,
    retry: 2,
    onError: () => {
      console.error("Error fetching booking.");
      router.push("/my-bookings");
    },
  });

  if (isLoading) return <p>Loading booking details...</p>;
  if (error)
    return <p>Error loading booking details. Please try again later.</p>;
  if (!booking) return <p>Booking not found</p>;

  return (
    <div>
      <BookingDetails booking={booking} />
    </div>
  );
}
