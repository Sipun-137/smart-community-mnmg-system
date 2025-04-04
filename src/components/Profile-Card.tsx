"use client";

import type React from "react";

import { useEffect, useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { User, LockKeyhole, Mail, Phone, Home, UserCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getProfileDetails, UpdatePassword } from "@/services/AuthService";

export default function ProfilePage() {
  // This would typically come from your authentication context or API
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    apartmentNo: "",
    role: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Please make sure your new password and confirmation match.");
      return;
    }

    const response = await UpdatePassword(
      passwords.newPassword,
      passwords.currentPassword
    );
    if (!response.success) {
      toast.error(response.message);
      return;
    } else {
      toast.success(response.message);
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }

    // Here you would call your API to update the password

    // Reset form
  };

  const loadMyProfile = async () => {
    const data = await getProfileDetails();
    if (data.success) {
      setProfile(data.extractAuthUserinfo);
    } else {
      toast.error("Failed to load your profile");
    }
  };

  useEffect(() => {
    loadMyProfile();
  }, []);

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
        <Toaster position="bottom-right"/>
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="space-y-8">
        {/* Profile Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Details
            </CardTitle>
            <CardDescription>
              View and manage your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <UserCircle className="h-4 w-4" />
                  Name
                </div>
                <div className="font-medium">{profile.name}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                <div className="font-medium">{profile.email}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </div>
                <div className="font-medium">{profile.phone}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Home className="h-4 w-4" />
                  Apartment Number
                </div>
                <div className="font-medium">{profile.apartmentNo}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <UserCircle className="h-4 w-4" />
                  Role
                </div>
                <div className="font-medium">{profile.role}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Password Change Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LockKeyhole className="h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
