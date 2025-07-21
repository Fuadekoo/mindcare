"use client";
import React from "react";
import { Phone, Shield, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import useAction from "@/hooks/useActions";
import { getProfile } from "@/actions/psycatrist/profile";

// Sample data for the profile - replace with actual data from your backend
const userProfile = {
  name: "Dr. Evelyn Reed",
  role: "Psychiatrist",
  phone: "+1 (555) 123-4567",
  email: "info@darelkubra.com",
  location: "Betel, Addis Ababa, Ethiopia",
  avatarUrl: "/profile.png", // A placeholder path
  bio: "She is a board-certified psychiatrist with over 15 years of experience in diagnosing and treating a wide range of mental health disorders. She is dedicated to providing compassionate and comprehensive care to her patients, helping them to achieve mental wellness and improve their quality of life.",
};

function Page() {
  const [profileData, refreshProfile, isLoadingProfile] = useAction(
    getProfile,
    [true, () => {}]
  );
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Replace gradient with image background */}
        <div className="h-32 w-full relative">
          <Image
            src="/logo3.png"
            alt="Profile Background"
            fill
            className="object-contain rounded-t-2xl bg-gray-400"
            priority
          />
        </div>
        <div className="p-6 sm:p-8 -mt-20">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <Image
                src={userProfile.avatarUrl}
                alt="Profile Picture"
                width={128}
                height={128}
                className="rounded-full border-4 border-white shadow-md object-cover bg-gray-200"
                onError={(e) => {
                  // Fallback for when the image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement("div");
                    fallback.className =
                      "w-32 h-32 rounded-full border-4 border-white shadow-md bg-gray-200 flex items-center justify-center text-gray-500 text-4xl font-bold";
                    fallback.textContent = userProfile.name.charAt(0);
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
            <div className="mt-4 sm:mt-0 text-center sm:text-left">
              <h1 className="mt-6 text-3xl font-bold text-gray-800">
                {profileData?.username}
              </h1>
              <p className="text-lg text-purple-600 font-medium">
                {userProfile.role}
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-600">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500" />
                <span>{userProfile.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500" />
                <span>{profileData?.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span>{userProfile.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-500" />
                <span>Role: {userProfile.role}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">About</h2>
            <p className="text-gray-600 leading-relaxed">{userProfile.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
