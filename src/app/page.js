"use client";

import "react-datepicker/dist/react-datepicker.css";
import {
  Modal,
  Button,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import FlightSearchSection from "@/components/home/FlightSearchSection";
import AdSection from "@/components/home/AdSection";
import FlightPageReview from "@/components/home/FlightPageReview";
import ScrollToTopButton from "@/components/home/ScrollToTopButton";

export default function HomePage() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  // Kiểm tra query parameter no-access
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams.get("no-access") === "true") {
      setVisible(true);
    }
  }, []);

  // Hàm đóng modal
  const closeModal = () => {
    setVisible(false);
    router.replace("/", undefined, { shallow: true });
  };

  return (
    <div className="bg-white">
      <FlightSearchSection />
      <ScrollToTopButton />
      <AdSection />
      <FlightPageReview />
      {/* <DiscountSection /> */}
      <Modal isOpen={visible} onClose={closeModal}>
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Không có quyền truy cập
            </ModalHeader>
            <ModalBody>
              <p>Bạn cần phải là admin để truy cập vào trang này</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={closeModal}>
                Close
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
}
