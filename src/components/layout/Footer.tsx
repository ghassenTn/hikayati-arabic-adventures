
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-primary mt-auto py-6 text-center">
      <div className="container mx-auto px-4">
        <p className="text-white">
          حكايتي - منصة تعليمية لإنشاء قصص تفاعلية باللغة العربية © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
