import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRegister } from "@/hooks/useRegister";
import { useGoogleLogin } from "@/hooks/useGoogleAuth";
import { GoogleLogin } from "@react-oauth/google";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { register, loading } = useRegister();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { googleLogin, loading: googleLoading } = useGoogleLogin();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name);
    console.log(value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }

    const token = await register(
      formData.name,
      formData.email,
      formData.password
    );
    if (token) {
      navigate("/");
      toast({
        title: "Signup Successful",
        description: "Welcome to QueryVerse!",
      });
    } else {
      toast({
        title: "Error",
        description: "Signup failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    const googleToken = response.credential;
    const token = await googleLogin(googleToken);

    if (token) {
      navigate("/");
      toast({
        title: "Google Login Successful",
        description: "Welcome back to QueryVerse!",
      });
    } else {
      toast({
        title: "Error",
        description: "Google login failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGoogleFailure = () => {
    toast({
      title: "Error",
      description: "Google login failed. Please try again.",
      variant: "destructive",
    });
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create a new account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={loading || googleLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading || googleLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading || googleLoading}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-500 dark:text-white dark:bg-blue-500"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
        <div className="mt-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            useOneTap
            theme="filled_blue"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Register;
