import { useRouter } from "next/router";
import React from "react";

type Props = {};

export default function Header({}: Props) {
  const router = useRouter();

  const redirect = (path: string) => {
    router.push(path);
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">LSP Sertifikasi</span>
            <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="" />
          </a>
        </div>

        <div className="flex gap-x-12">
          <div className="relative">
            <button
              onClick={() => redirect("/")}
              type="button"
              className={`flex items-center gap-x-1 text-sm font-semibold hover:text-[#1677ffa5] transition-colors duration-100 leading-6 ${
                router.pathname === "/" ? "text-[#1677FF]" : "text-gray-900"
              }`}
              aria-expanded="false"
            >
              Home
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => redirect("/admin")}
              type="button"
              className={`flex items-center gap-x-1 text-sm hover:text-[#1677ffa5] transition-colors duration-100 font-semibold leading-6 ${
                router.pathname === "/admin" ? "text-[#1677FF]" : "text-gray-900"
              }`}
              aria-expanded="false"
            >
              Admin
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
