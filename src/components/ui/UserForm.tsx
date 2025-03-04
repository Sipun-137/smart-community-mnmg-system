"use client";

import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Select,
  MenuItem,
  Link,
} from "@mui/material";

const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    apartmentNo: "AF-8",
    phone: "9087654389",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Editor",
    apartmentNo: "AF-8",
    phone: "9087654389",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "User",
    apartmentNo: "AF-8",
    phone: "9087654389",
  },
];

interface UserFormProps {
  userId?: string;
}

export function UserForm({ userId }: UserFormProps) {
  // const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "User",
    password: "",
    apartmentNo: "",
    phone: "",
  });

  useEffect(() => {
    if (userId) {
      const user = mockUsers.find((u) => u.id === userId);
      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          role: user.role,
          password: "",
          apartmentNo: user.apartmentNo,
          phone: user.phone,
        });
      }
    }
  }, [userId]);

  const handleSubmit = () => {
   
  };
  console.log(formData);
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {userId ? "Update User" : "Create User"}
        </Typography>
        <div>
          <FormControl fullWidth>
            <InputLabel htmlFor="email-input">Email address</InputLabel>
            <Input
              id="email-input"
              aria-describedby="email-helper-text"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
              }}
            />
            <FormHelperText id="email-helper-text">
              We ll never share your email.
            </FormHelperText>
          </FormControl>
          {/* Name */}
          <FormControl fullWidth>
            <InputLabel htmlFor="Name-input">Full Name</InputLabel>
            <Input
              id="Name-input"
              aria-describedby="Name-helper-text"
              value={formData.name}
              type="text"
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
              }}
            />
            <FormHelperText id="Name-helper-text">
              Plese Enter the full Name of the User
            </FormHelperText>
          </FormControl>
          {/* password field */}
          <FormControl fullWidth>
            <InputLabel htmlFor="Password-input">Password</InputLabel>
            <Input
              id="Password-input"
              type="password"
              aria-describedby="Password-helper-text"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
              }}
            />
            <FormHelperText id="Password-helper-text">
              Plese Enter the full Name of the User
            </FormHelperText>
          </FormControl>
          <br />

          {/* for the role selection */}
          <FormControl fullWidth className="m-4 p-3">
            <InputLabel id="demo-simple-select-label">Role</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={formData.role}
              label="Age"
              onChange={(e) => {
                setFormData({ ...formData, role: e.target.value });
              }}
            >
              <MenuItem value={"Resident"}>Resident</MenuItem>
              <MenuItem value={"Admin"}>Admin</MenuItem>
              <MenuItem value={"Security"}>Security</MenuItem>
              <MenuItem value={"Maintainance"}>Maintainanace</MenuItem>
            </Select>
          </FormControl>

          <div className="flex justify-between items-center p-2 px-8 mx-8 ">
            <div>
              <Button component={Link} href="/dashboard/admin/user" variant="outlined">
                Cancel
              </Button>
            </div>
            <div>
              <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
                {userId ? "Update User" : "Create User"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
