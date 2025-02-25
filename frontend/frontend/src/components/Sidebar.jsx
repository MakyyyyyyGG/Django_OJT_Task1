import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Info, PanelRightOpen, PanelLeftOpen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const links = [
  { to: "/home", label: "Home", icon: <Home size={18} /> },
  { to: "/about", label: "About", icon: <Info size={18} /> },
];

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`h-screen ${
        isExpanded ? "w-56 p-4" : "w-16 items-center"
      } bg-[#1d1d21] text-white flex flex-col  py-4 border-r border-[#3a3a3a] ease-in-out transition-all `}
    >
      <NavLink to="/home" className="mb-6 text-lg font-bold">
        MC
      </NavLink>
      <button
        onClick={toggleSidebar}
        className={`mb-4 ${isExpanded ? "ml-auto" : ""}`}
      >
        {isExpanded ? (
          <PanelRightOpen size={18} />
        ) : (
          <PanelLeftOpen size={18} />
        )}
      </button>
      <TooltipProvider delayDuration={0}>
        <nav className="flex flex-col gap-2">
          {links.map(({ to, label, icon }) => (
            <Tooltip key={to}>
              <NavLink
                to={to}
                end
                className={({ isActive }) =>
                  `p-3  transition flex ${
                    isExpanded ? "justify-start" : "justify-center"
                  } ${
                    isActive
                      ? "bg-[#18181c]  border border-[#3a3a3a] "
                      : "text-gray-400 hover:bg-gray-600"
                  }`
                }
              >
                <TooltipTrigger asChild>
                  <div className="flex gap-2 items-center">
                    {icon}
                    {isExpanded && <span>{label}</span>}
                  </div>
                </TooltipTrigger>
                {!isExpanded && (
                  <TooltipContent side="right" sideOffset={15}>
                    {isExpanded ? null : label}
                  </TooltipContent>
                )}
              </NavLink>
            </Tooltip>
          ))}
        </nav>
        <div className="flex mt-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar>
                <AvatarImage src="https://lh3.googleusercontent.com/a/ACg8ocLxOnGzztI0QPhIF1ewl-bDBP4s3I75hX-UIifLvj6NHOEe_ao=s360-c-no" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={15}>
              Created by @MarkyyyyyyGG
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default Sidebar;
