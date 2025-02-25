import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className=" w-full flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-7xl font-bold text-red-600">404</h1>
      <p className="text-lg text-gray-500 mt-2">This page doesn't exist.</p>
      <Button asChild className="mt-4">
        <Link to="/">Go Home</Link>
      </Button>
    </div>
  );
}
