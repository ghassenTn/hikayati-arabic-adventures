
import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, BookPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="bg-primary shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
          <BookOpen size={28} className="text-white" />
          <span className="text-2xl font-bold text-white">حكايتي</span>
        </Link>
        <nav>
          <ul className="flex space-x-6 rtl:space-x-reverse">
            <li>
              <Link to="/" className="text-white hover:text-secondary font-medium">
                الرئيسية
              </Link>
            </li>
            <li>
              <Link to="/stories" className="text-white hover:text-secondary font-medium">
                مكتبة القصص
              </Link>
            </li>
          </ul>
        </nav>
        <Link to="/create">
          <Button variant="secondary" className="flex items-center space-x-2 rtl:space-x-reverse">
            <BookPlus size={18} />
            <span>قصة جديدة</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
