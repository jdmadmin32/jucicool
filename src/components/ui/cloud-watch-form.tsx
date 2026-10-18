"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CartoonEyesAvatar({ isTyping = false }: { isTyping?: boolean }) {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useEffect(() => {
    const winWidth = typeof window !== "undefined" ? window.innerWidth : 1000;
    const winHeight = typeof window !== "undefined" ? window.innerHeight : 1000;
    const offsetX = ((cursor.x / winWidth) - 0.5) * 40; // eye movement range
    const offsetY = ((cursor.y / winHeight) - 0.5) * 20;
    setEyePos({ x: offsetX, y: offsetY });
  }, [cursor]);

  // Blinking every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-56 sm:w-64 h-32 sm:h-36 mx-auto flex items-center justify-center select-none">
      <img
        src="https://cdn.21st.dev/assets/mirror/2e/2e429af66b2ad5c13c11326bead739b6e7746470c7af7ac4fd7892d0190b4ab8.jpg"
        alt="cartoon watcher"
        className="w-full h-full object-contain pointer-events-none drop-shadow-sm"
      />

      {["left", "right"].map((side, idx) => (
        <div
          key={side}
          className="absolute flex justify-center items-end overflow-hidden"
          style={{
            top: "37.5%",
            left: idx === 0 ? "29%" : "54%",
            width: 24,
            height: isTyping
              ? 3 // fully closed when typing password
              : blink
              ? 5 // temporary blink
              : 32, // open eye
            borderRadius: isTyping || blink ? "2px" : "50% / 60%",
            backgroundColor: isTyping ? "black" : "white",
            transition: "all 0.15s ease",
          }}
        >
          {!isTyping && (
            <div
              className="bg-black"
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                marginBottom: 3,
                transform: `translate(${eyePos.x * 0.75}px, 0px)`,
                transition: "all 0.1s ease",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function CloudWatchForm() {
  const [isTyping, setIsTyping] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white/30 backdrop-blur-md rounded-xl shadow-xl p-8 flex flex-col items-center gap-6 w-md border">
        
        {/* Cartoon Face */}
        <CartoonEyesAvatar isTyping={isTyping} />

        {/* Form */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col">
            <Label>Name</Label>
            <Input placeholder="Your Name" />
          </div>
          <div className="flex flex-col">
            <Label>Email</Label>
            <Input type="email" placeholder="Your Email" />
          </div>
          <div className="flex flex-col">
            <Label>Username</Label>
            <Input placeholder="Username" />
          </div>
          <div className="flex flex-col">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Password"
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
            />
          </div>
          <Button className="mt-2 w-full">Submit</Button>
        </div>
      </div>
    </div>
  );
}
