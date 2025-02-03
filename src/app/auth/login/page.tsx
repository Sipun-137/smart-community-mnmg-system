"use client";
import { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  Typography,
  IconButton,
  Divider,
  CardContent,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const HandleSubmit = () => {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <Card className="w-full max-w-sm p-6 shadow-md rounded-lg">
        <CardContent className="text-center">
          <Typography variant="h5" className="font-bold font-serif">
            Sign in to your account
          </Typography>
        </CardContent>

        <CardContent className="space-y-4">
          {/* Email Input */}
          <TextField
            id="email"
            type="email"
            label="Email Address"
            fullWidth
            required
            variant="outlined"
          />

          {/* Password Input */}
          <OutlinedInput
            id="password"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            placeholder="Password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />

          {/* Sign In Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "16px",
            }}
            onClick={HandleSubmit}
          >
            Sign in
          </Button>

          {/* OR Divider */}
          <Divider sx={{ my: 2 }}>or</Divider>

          {/* Social Login Button Placeholder */}
        </CardContent>

        <CardActions className="justify-center">
          <Typography variant="body2">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Don't have an account? contact to the admin
          </Typography>
        </CardActions>
      </Card>
    </div>
  );
}
