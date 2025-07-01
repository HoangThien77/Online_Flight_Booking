"use client";

import React from "react";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
} from "@/features/user/userSlice";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const UserProfileForm = () => {
  const dispatch = useAppDispatch();
  const { user, loading, updating, error } = useAppSelector(
    (state) => state.user,
  );
  const { toast } = useToast();
  const { data: session, update: sessionUpdate } = useSession(); // Correct destructuring

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    image: "",
    address: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      dispatch(fetchProfileStart());
      try {
        const response = await fetch("/api/user/profile");

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();

        dispatch(fetchProfileSuccess(data));
        setFormData(data);
      } catch (err) {
        dispatch(fetchProfileFailure(err.message));
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải thông tin người dùng",
        });
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateProfileStart());
    try {
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      const updatedData = await response.json();

      dispatch(updateProfileSuccess(updatedData));
      setFormData(updatedData);
      toast({
        title: "Thành công",
        description: "Thông tin đã được cập nhật",
      });
    } catch (err) {
      dispatch(updateProfileFailure(err.message));
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể cập nhật thông tin",
      });
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Kiểm tra loại file
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Lỗi ảnh",
        description: "Chỉ cho phép upload file hình ảnh (jpg, png, ...)",
      });

      return;
    }
    // Giới hạn size 2MB
    if (file.size > 2 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Lỗi ảnh",
        description: "Kích thước ảnh tối đa là 2MB.",
      });

      return;
    }

    const formDataUpload = new FormData();

    formDataUpload.append("avatar", file);

    dispatch(updateProfileStart());

    try {
      const response = await fetch("/api/user/upload-image", {
        method: "POST",
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();

      dispatch(updateProfileSuccess(data.user));
      setFormData((prev) => ({ ...prev, image: data.image }));

      // Refresh session
      await sessionUpdate();
      toast({
        title: "Thành công",
        description: "Ảnh đại diện đã được cập nhật",
      });
    } catch (err) {
      dispatch(updateProfileFailure(err.message));
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể cập nhật ảnh đại diện",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="size-20 rounded-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>Cập nhật thông tin profile của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="size-20">
                <AvatarImage
                  src={formData.image || undefined}
                  alt={formData.name || "avatar"}
                />
                <AvatarFallback>
                  <FaUserCircle className="text-6xl text-gray-400" />
                </AvatarFallback>
              </Avatar>
              <label className="cursor-pointer text-sm text-blue-600 hover:underline">
                Thay đổi ảnh đại diện
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  disabled={true}
                  className="bg-gray-50"
                />
                <p className="text-sm text-gray-500">
                  Email không thể thay đổi
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Số điện thoại</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber || ""}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ của bạn"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={updating}>
                {updating ? "Đang cập nhật..." : "Cập nhật thông tin"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileForm;
