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
import { useLogin } from "@/hooks/useLogin";
import { useToast } from "@/hooks/use-toast";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@/hooks/useGoogleAuth";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, loading } = useLogin();
  const { googleLogin, loading: googleLoading } = useGoogleLogin();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Both email and password are required.",
        variant: "destructive",
      });
      return;
    }

    const token = await login(formData.email, formData.password);
    if (token) {
      navigate("/");
      toast({
        title: "Login Successful",
        description: "Welcome back to QueryVerse!",
      });
    } else {
      toast({
        title: "Error",
        description: "Login failed. Please try again.",
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
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={loading || googleLoading}
          >
            {loading ? "Logging in..." : "Login"}
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

export default Login;
