import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { register } from "../services/signup.service";
import { colors } from "@/shared/theme/colors";

interface SignupFormProps {
  onSuccess: () => void;
  className?: string;
}

export function SignupForm({
  onSuccess,
  className,
  ...props
}: SignupFormProps & React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await register({ phoneNumber: `+251${phoneNumber}`, name, password });
      onSuccess();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to register. Please try again.";
      setError(message);
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Enter your details below to create your account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="focus:!border-[#fde2aeff] focus:!shadow-[0_1px_3px_0_#fde2aeff] focus-visible:!ring-0"
                />
                <FieldDescription>
                  Your username as you&apos;d like it to appear.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                <div className="flex items-center border border-input rounded-md overflow-hidden focus-within:border-[#fde2aeff] focus-within:shadow-[0_1px_3px_0_#fde2aeff]">
                  <span className="px-3 py-2 bg-muted text-muted-foreground text-sm border-r border-input select-none">+251</span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="912345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="border-0 rounded-none focus:!border-0 focus:!shadow-none focus-visible:!ring-0"
                  />
                </div>
                <FieldDescription>Your phone number.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="focus:!border-[#fde2aeff] focus:!shadow-[0_1px_3px_0_#fde2aeff] focus-visible:!ring-0"
                />
              </Field>
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                  {error}
                </div>
              )}
              <Field>
                <Button
                  type="submit"
                  disabled={isLoading}
                  style={{ backgroundColor: colors.primary.main }}
                  className="text-white"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Already have an account?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/login");
                  }}
                >
                  Login
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:flex md:items-center md:justify-center">
            <img
              src="/assets/gebetamaps.png"
              alt="Logo"
              className="w-58 h-58 object-contain"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/terms'); }}>Terms of Service</a>{" "}
        and{" "}
        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }}>Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
