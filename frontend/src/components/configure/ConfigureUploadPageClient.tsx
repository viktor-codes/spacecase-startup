"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { fetchApod, type ApodResponse } from "@/lib/api/apodClient";
import Section from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider"; // Если есть shadcn, если нет - заменим на обычный
import {
  ChevronLeft,
  Maximize2,
  RotateCcw,
  ShoppingCart,
  Info,
  Smartphone,
} from "lucide-react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const SpaceDateScanner = dynamic(() => import("../SpaceDateScanner"), {
  ssr: false,
});

export default function ConfigureUploadPageClient({
  initialDate,
}: {
  initialDate?: string;
}) {
  const [date, setDate] = useState(initialDate ?? "");
  const [apod, setApod] = useState<ApodResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // States для конфигуратора
  const [zoom, setZoom] = useState(100);
  const [phoneModel, setPhoneModel] = useState("iphone-15-pro");
  const [finish, setFinish] = useState("matte");
  const [frameColor, setFrameColor] = useState("#111827");

  const handleRevealUniverse = async (selectedDate?: string) => {
    setLoading(true);
    try {
      const data = await fetchApod((selectedDate ?? date) || undefined);
      if (data.media_type === "image") setApod(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans selection:bg-blue-100">
      {/* Header — более разреженный и профессиональный */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-slate-900 transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="h-4 w-px bg-slate-200" />
            <h1 className="text-sm font-semibold tracking-tight text-slate-900">
              Design Studio <span className="mx-2 text-slate-300">/</span>
              <span className="font-mono text-[11px] uppercase text-slate-500 tracking-widest">
                Configuration
              </span>
            </h1>
          </div>
          <Button variant="ghost" size="sm" className="gap-2 font-medium">
            <ShoppingCart className="h-4 w-4" />
            Cart (0)
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 md:py-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
          {/* LEFT COLUMN: Visual Preview */}
          <div className="relative flex flex-col items-center justify-center min-h-[500px] lg:min-h-[700px]">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Configure Your SpaceCase
              </h2>
              <p className="text-slate-500 mt-2 text-sm uppercase tracking-[0.2em] font-mono">
                Model: {phoneModel.replace(/-/g, " ")}
              </p>
            </div>

            {/* Реалистичный мокап */}
            <div className="relative group">
              {/* Свечение сзади */}
              <div className="absolute -inset-10 bg-blue-100/30 blur-[100px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

              <div
                className={cn(
                  "relative aspect-[9/18.5] w-[280px] md:w-[340px] rounded-[3.5rem] p-[7px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] transition-all duration-500",
                  "bg-slate-950", // Цвет корпуса телефона
                )}
                style={{ backgroundColor: frameColor }}
              >
                {/* Внутренняя зона (экран/кейс) */}
                <div className="relative h-full w-full overflow-hidden rounded-[3.1rem] bg-slate-900">
                  {apod ? (
                    <motion.img
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: zoom / 100 }}
                      src={apod.url}
                      alt="Cosmic design"
                      className="h-full w-full object-cover select-none"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center px-12 text-center text-xs text-slate-500 font-mono leading-loose uppercase tracking-widest">
                      Waiting for date input...
                    </div>
                  )}

                  {/* Глянцевый блик поверх картинки */}
                  <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-40" />

                  {/* Глубокий эффект чехла - имитация краев */}
                  <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_40px_rgba(0,0,0,0.4)]" />
                </div>

                {/* Блок камеры (упрощенный, премиальный) */}
                <div className="absolute left-10 top-10 h-24 w-24 rounded-[1.8rem] bg-black/20 backdrop-blur-md border border-white/10 z-30" />
              </div>

              {/* Инфо-плашка прямо у чехла */}
              <AnimatePresence>
                {apod && (
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="absolute -right-8 bottom-20 z-40 hidden xl:block"
                  >
                    <div className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white max-w-[200px]">
                      <p className="text-[10px] font-mono text-blue-600 uppercase mb-1">
                        Observation
                      </p>
                      <p className="text-xs font-bold text-slate-900 line-clamp-2">
                        {apod.title}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {apod.date}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="mt-12 text-[11px] text-slate-400 font-mono uppercase tracking-[0.2em]">
              Drag and pinch image to compose
            </p>
          </div>

          {/* RIGHT COLUMN: Controls */}
          <aside className="space-y-6">
            {/* 1. Date Card */}
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Info className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Universe Sync
                </h3>
              </div>

              <SpaceDateScanner
                value={date}
                onChange={setDate}
                size="compact"
                showSlider={false}
                showPrimaryButton={false}
                helperVariant="minimal"
                onSubmit={handleRevealUniverse}
                loading={loading}
              />

              <Button
                onClick={() => handleRevealUniverse()}
                disabled={loading || !date}
                className="w-full mt-6 h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 transition-all font-bold"
              >
                {loading ? "Syncing..." : "Reveal the Universe"}
              </Button>
            </div>

            {/* 2. Transform Card */}
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">
                  Image Scale
                </h3>
                <span className="font-mono text-xs font-bold text-blue-600">
                  {zoom}%
                </span>
              </div>

              {/* Кастомный слайдер */}
              <div className="relative h-6 flex items-center mb-6">
                <input
                  type="range"
                  min="100"
                  max="200"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {["Center", "Top", "Bottom"].map((pos) => (
                  <Button
                    key={pos}
                    variant="outline"
                    size="xs"
                    className="text-[10px] uppercase font-bold py-4 rounded-xl"
                  >
                    {pos}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="xs"
                  className="py-4"
                  onClick={() => setZoom(100)}
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* 3. Case Config Card */}
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 space-y-8">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 block">
                  Device Model
                </label>
                <div className="flex flex-wrap gap-2">
                  {["iPhone 15", "Pro", "Pro Max"].map((m) => (
                    <button
                      key={m}
                      onClick={() =>
                        setPhoneModel(m.toLowerCase().replace(/ /g, "-"))
                      }
                      className={cn(
                        "px-4 py-2 rounded-xl text-[11px] font-bold transition-all border",
                        phoneModel.includes(m.toLowerCase().replace(/ /g, "-"))
                          ? "bg-slate-900 border-slate-900 text-white shadow-md"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-400",
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 block">
                  Frame Finish
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Matte", "Glossy", "Soft"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFinish(f.toLowerCase())}
                      className={cn(
                        "py-2 rounded-xl text-[11px] font-bold border transition-all",
                        finish === f.toLowerCase()
                          ? "border-slate-900 bg-slate-50"
                          : "border-slate-100",
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 block">
                  Base Color
                </label>
                <div className="flex gap-3">
                  {["#111827", "#E2E8F0", "#1E40AF", "#166534", "#991B1B"].map(
                    (c) => (
                      <button
                        key={c}
                        onClick={() => setFrameColor(c)}
                        style={{ backgroundColor: c }}
                        className={cn(
                          "h-8 w-8 rounded-full border-2 transition-all",
                          frameColor === c
                            ? "border-blue-600 scale-110 shadow-lg"
                            : "border-transparent",
                        )}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* 4. Checkout Summary */}
            <div className="rounded-[2.5rem] bg-blue-600 p-8 text-white shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)]">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">
                    Total investment
                  </p>
                  <p className="text-3xl font-bold">$39.00</p>
                </div>
                <Smartphone className="h-10 w-10 opacity-20" />
              </div>
              <Button className="w-full h-14 bg-white text-blue-600 hover:bg-blue-50 transition-all rounded-2xl font-bold text-base gap-2">
                Add to Cosmic Cart
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
