"use client"

export const getId = () => {
  if (typeof window === "undefined") {
    return null;
  }
  const _id = localStorage.getItem("_id")
  
  return _id || null;
}