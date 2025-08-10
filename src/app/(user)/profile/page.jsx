"use client";

import React, { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaCamera,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn, MdPerson } from "react-icons/md";
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
import { Badge } from "@/components/ui/badge";

const UserProfileForm = () => {
  const dispatch = useAppDispatch();
  const { user, loading, updating, error } = useAppSelector(
    (state) => state.user,
  );
  const { toast } = useToast();
  const { data: session, update: sessionUpdate } = useSession();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    image: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

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
        setOriginalData(data);
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
      setOriginalData(user);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - restore original data
      setFormData(originalData);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
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
      setOriginalData(updatedData);
      setIsEditing(false);

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

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Lỗi ảnh",
        description: "Chỉ cho phép upload file hình ảnh (jpg, png, ...)",
      });

      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Lỗi ảnh",
        description: "Kích thước ảnh tối đa là 2MB.",
      });

      return;
    }

    // Create preview
    const reader = new FileReader();

    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

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
      setImagePreview(null);

      // Refresh session
      await sessionUpdate();
      toast({
        title: "Thành công",
        description: "Ảnh đại diện đã được cập nhật",
      });
    } catch (err) {
      dispatch(updateProfileFailure(err.message));
      setImagePreview(null);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể cập nhật ảnh đại diện",
      });
    }
  };

  const hasChanges = () => {
    return (
      formData.name !== originalData.name ||
      formData.phoneNumber !== originalData.phoneNumber ||
      formData.address !== originalData.address
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-4xl shadow-xl">
            <CardHeader className="text-center">
              <Skeleton className="mx-auto h-8 w-[200px]" />
              <Skeleton className="mx-auto h-4 w-[300px]" />
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex justify-center">
                <Skeleton className="size-24 rounded-full" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-4xl shadow-xl">
            <CardContent className="py-12 text-center">
              <div className="mb-4 text-6xl text-red-500">⚠️</div>
              <h2 className="mb-2 text-2xl font-bold text-gray-800">
                Đã xảy ra lỗi
              </h2>
              <p className="text-gray-600">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Thử lại
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-4xl border-0 shadow-xl">
          <CardHeader className="rounded-t-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-center text-white">
            <div className="mb-4 flex justify-center">
              <div className="relative">
                <Avatar className="size-24 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={imagePreview || formData.image || undefined}
                    alt={formData.name || "avatar"}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-white text-blue-600">
                    <FaUserCircle className="text-6xl" />
                  </AvatarFallback>
                </Avatar>
                <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-blue-600 p-2 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-blue-700">
                  <FaCamera className="text-sm" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              {formData.name || "Người dùng"}
            </CardTitle>
            <CardDescription className="text-blue-100">
              Quản lý thông tin cá nhân của bạn
            </CardDescription>
            {session?.user?.email && (
              <Badge
                variant="secondary"
                className="mt-2 bg-blue-500 text-white"
              >
                {session.user.email}
              </Badge>
            )}
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <MdPerson className="text-blue-600" />
                    Họ và tên
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên"
                    disabled={!isEditing}
                    className={`transition-all duration-200 ${
                      isEditing
                        ? "border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <MdEmail className="text-blue-600" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    disabled={true}
                    className="cursor-not-allowed border-gray-200 bg-gray-50"
                  />
                  <p className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="size-2 rounded-full bg-gray-400"></span>
                    Email không thể thay đổi
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phoneNumber"
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <MdPhone className="text-blue-600" />
                    Số điện thoại
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber || ""}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                    disabled={!isEditing}
                    className={`transition-all duration-200 ${
                      isEditing
                        ? "border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="address"
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <MdLocationOn className="text-blue-600" />
                    Địa chỉ
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                    placeholder="Nhập địa chỉ của bạn"
                    disabled={!isEditing}
                    className={`transition-all duration-200 ${
                      isEditing
                        ? "border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t pt-6">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleEditToggle}
                      className="flex items-center gap-2"
                    >
                      <FaTimes className="text-sm" />
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      disabled={updating || !hasChanges()}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      {updating ? (
                        <>
                          <div className="size-4 animate-spin rounded-full border-b-2 border-white"></div>
                          Đang cập nhật...
                        </>
                      ) : (
                        <>
                          <FaSave className="text-sm" />
                          Lưu thay đổi
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={handleEditToggle}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <FaEdit className="text-sm" />
                    Chỉnh sửa thông tin
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfileForm;
