"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      toast.warning("Заповніть всі поля");
      return;
    }

    if (name.trim().length < 2) {
      toast.warning("Ім'я має бути мінімум 2 символи");
      return;
    }

    if (password.length < 6) {
      toast.warning("Пароль має бути мінімум 6 символів");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login/callback`,
        data: {
          full_name: name.trim(),
        },
      },
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (
      data.user &&
      data.user.identities &&
      data.user.identities.length === 0
    ) {
      toast.error("Користувач з таким email вже існує");
      return;
    }

    toast.success("Перевірте пошту для підтвердження реєстрації!");
    setName("");
    setEmail("");
    setPassword("");
    setIsSignUp(false);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast.warning("Заповніть всі поля");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      toast.error(userError.message);
      return;
    }

    if (userData.user && !userData.user.email_confirmed_at) {
      toast.warning("Будь ласка, підтвердіть свою пошту перед входом");
      return;
    }

    toast.success("Успішний вхід!");
    router.push("/");
    router.refresh();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (isSignUp) {
        handleSignUp();
      } else {
        handleLogin();
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col gap-4 max-w-sm w-full p-6 border rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-center">
          {isSignUp ? "Реєстрація" : "Вхід"}
        </h1>

        {/* Поле імені (тільки для реєстрації) */}
        {isSignUp && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Ім'я</Label>
            <Input
              id="name"
              type="text"
              placeholder="Ваше ім'я"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              autoFocus={isSignUp}
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            autoFocus={!isSignUp}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            type="password"
            placeholder="Мінімум 6 символів"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-2 mt-2">
          {isSignUp ? (
            <>
              <Button
                onClick={handleSignUp}
                disabled={loading}
                className="bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
              >
                {loading ? "Завантаження..." : "Зареєструватися"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsSignUp(false);
                  setName("");
                }}
                disabled={loading}
              >
                Вже є акаунт? Увійти
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleLogin}
                disabled={loading}
                className=" bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
              >
                {loading ? "Завантаження..." : "Увійти"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsSignUp(true)}
                disabled={loading}
              >
                Немає акаунту? Зареєструватися
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
